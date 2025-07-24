import { 
  collection, 
  doc, 
  addDoc, 
  getDoc, 
  getDocs, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  serverTimestamp,
  arrayUnion,
  arrayRemove 
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword,
  sendPasswordResetEmail 
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { db } from '../lib/firebase';
import { DocumentData } from '../types';
import { Collaborator } from '../components/editor/ShareModal';

const COLLECTION_NAME = 'documents';

export async function createDocument(userId: string, token: string, title: string = 'Untitled Document', content: string = ''): Promise<DocumentData | null> {
  try {
    const res = await fetch(`/api/documents/create/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ title, content }),
    });
    if (!res.ok) throw new Error('Failed to create document');
    const data = await res.json();
    return data as DocumentData;
  } catch (e) {
    console.error('Error creating document via API:', e);
    return null;
  }
}

export async function getDocument(id: string, uid: string, token: string): Promise<DocumentData | null> {
  // GET request to /api/documents/:id/:uid
  console.log('Fetching document:', id, uid);
  try {
    const res = await fetch(`/api/documents/${id}/${uid}`, {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : undefined,
    });
    if (!res.ok) return null;
    const data = await res.json();
    console.log('Document data:', data);
    return data as DocumentData;
  } catch (e) {
    console.log('Error fetching document:', e);
    return null;
  }
}

export async function getUserDocuments(userId: string, token: string): Promise<DocumentData[]> {
  try {
    const res = await fetch(`/api/user/documents/${userId}`, {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : undefined,
    });
    if (!res.ok) return [];
    console.log('Fetched user documents:', res);
    const result = await res.json();
    const ids = result.documents;
    console.log('Document IDs:', ids);
    if (!ids || !Array.isArray(ids) || ids.length === 0){
      console.log('No documents found for user:', userId);
      return [];
    }
    // Fetch each document by ID
    const docs = await Promise.all(
      ids.map((id: string) => getDocument(id, userId, token))
    );
    // Filter out nulls (failed fetches)
    return docs.filter((doc): doc is DocumentData => doc !== null);
  } catch (e) {
    console.error('Error fetching user documents:', e);
    return [];
  }
}

export async function updateDocumentTitle(id: string, title: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, { 
    title, 
    updatedAt: serverTimestamp() 
  });
}

// TODO: implement some way to manage who has the "talking stick"
// the user that holds the "stick" will be the only user who submits saves to the backend
// there will also need to be some kind of conflict resolution on the backend based off of who holds the "stick"
// this might be doable with yjs but im just not sure
export async function updateDocumentContent(id: string, uid: string, content: string, token: string): Promise<Boolean> {
  console.log("Updating document content", id, uid, content);
  console.log("Token:", token);
  const postReq = {
    content: content
  }
  try{
    const res = await fetch(`/api/documents/update/${id}/${uid}`,{
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : undefined,
      body: JSON.stringify(postReq),
      method: 'POST'
    })

    console.log("got response", res)

    if (!res.ok) return false;
    const data = await res.json();
    console.log("Response data:", data);
    if (res.status !== 200) {
      console.error('Error updating document:', data);
      return false;
    }
    return true

  }catch(e){
    console.log('Error posting data');
    return false;
  }
}

export async function deleteDocument(id: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await deleteDoc(docRef);
}

export async function addCollaborator(documentId: string, myUid: string, email: string, token: string): Promise<void> {
  try {
    // 1. Get UID from email
    const uidRes = await fetch(`/api/uid/${encodeURIComponent(email)}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!uidRes.ok) throw new Error('Failed to fetch UID for email');
    const { uid } = await uidRes.json();

    // 2. Add collaborator via API (docid and collaborator uid in URL)
    const addRes = await fetch(`/api/documents/add-collaborator/${documentId}/${myUid}`, {
      method: 'POST',
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      body: JSON.stringify({ collaborator: uid }),
    });
    if (!addRes.ok) throw new Error('Failed to add collaborator');
  } catch (e) {
    console.error('Error adding collaborator via API:', e);
    throw e;
  }
}

export async function removeCollaboratorFromDocument(documentId: string, userId: string, token: string, collaboratorId: string): Promise<void> {
  try {
    const res = await fetch(`/api/documents/remove-collaborator/${documentId}/${userId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ collaborator: collaboratorId }),
    });
    if (!res.ok) throw new Error('Failed to remove collaborator');
  } catch (e) {
    console.error('Error removing collaborator via API:', e);
    throw e;
  }
}

export async function getDocumentCollaborators(
  documentId: string,
  userId: string,
  token: string
): Promise<Collaborator[]> {
  try {
    // 1. Fetch document data to get collaborator UIDs and owners
    const res = await fetch(`/api/documents/${documentId}/${userId}`, {
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : undefined,
    });
    if (!res.ok) throw new Error('Failed to fetch document data');
    const data = await res.json();
    const collaboratorUids: string[] = data.collaborators?.map((c: any) => typeof c === 'string' ? c : c.id) || [];
    const ownerUid: string = data.createdBy;

    if (collaboratorUids.length === 0) return [];

    // 2. Map UIDs to emails using /api/email/bulk
    const emailRes = await fetch(`/api/emails/bulk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ uids: collaboratorUids }),
    });
    if (!emailRes.ok) throw new Error('Failed to fetch collaborator emails');
    const emailJson = await emailRes.json();
    const emailObjects: { uid: string; email: string }[] = emailJson.results; // <-- use .results

    // Map to Collaborator[]
    const collaborators: Collaborator[] = collaboratorUids.map(uid => {
      const found = emailObjects.find(obj => obj.uid === uid);
      const email = found ? found.email : 'unknown';
      return {
        id: uid,
        email,
        name: email,
        isOwner: uid === ownerUid,
      };
    });

    return collaborators;
  } catch (e) {
    console.error('Error fetching collaborators:', e);
    throw e;
  }
}
export async function getEmailForUid(uid: string, token?: string): Promise<string> {
  try {
    const res = await fetch(`/api/email/${uid}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    });
    if (!res.ok) throw new Error('Failed to fetch email for UID');
    const data = await res.json();
    return data.email ?? 'unknown';
  } catch (e) {
    console.error('Error fetching email for UID:', e);
    return 'unknown';
  }
}