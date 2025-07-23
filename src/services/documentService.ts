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

const COLLECTION_NAME = 'documents';

export async function createDocument(userId: string, title: string = 'Untitled Document'): Promise<string> {
  const docRef = await addDoc(collection(db, COLLECTION_NAME), {
    title,
    content: '',
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    createdBy: userId,
    collaborators: [userId]
  });

  // Add collaborator via API
  try {
    await fetch(`/api/documents/add-collaborator/${docRef.id}/${userId}`, {
      method: 'POST'
    });
  } catch (e) {
    console.error('Error adding collaborator via API:', e);
  }

  return docRef.id;
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

export async function addCollaborator(documentId: string, userId: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, documentId);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    const data = docSnap.data();
    const collaborators = data.collaborators || [];
    
    if (!collaborators.includes(userId)) {
      await updateDoc(docRef, {
        collaborators: [...collaborators, userId]
      });
    }
  }
}
export async function removeCollaboratorFromDocument(documentId: string, userId: string): Promise<void> {
  // Remove user from document collaborators
  const docRef = doc(db, COLLECTION_NAME, documentId);
  await updateDoc(docRef, {
    collaborators: arrayRemove(userId)
  });
  
  // Remove document from user's shared documents
  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    await updateDoc(userRef, {
      sharedDocuments: arrayRemove(documentId)
    });
  }
}

export async function getDocumentCollaborators(documentId: string): Promise<Array<{id: string, email: string, isOwner: boolean}>> {
  const docRef = doc(db, COLLECTION_NAME, documentId);
  const docSnap = await getDoc(docRef);
  
  if (!docSnap.exists()) {
    throw new Error('Document not found');
  }
  
  const data = docSnap.data();
  const collaboratorIds = data.collaborators || [];
  const ownerId = data.createdBy;
  
  const collaborators = [];
  
  for (const userId of collaboratorIds) {
    const userRef = doc(db, 'users', userId);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      collaborators.push({
        id: userId,
        email: userData.email,
        isOwner: userId === ownerId
      });
    }
  }
  
  return collaborators;
}