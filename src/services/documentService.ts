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
  serverTimestamp 
} from 'firebase/firestore';
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
  
  return docRef.id;
}

export async function getDocument(id: string): Promise<DocumentData | null> {
  const docRef = doc(db, COLLECTION_NAME, id);
  const docSnap = await getDoc(docRef);
  
  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() } as DocumentData;
  } else {
    return null;
  }
}

export async function getUserDocuments(userId: string): Promise<DocumentData[]> {
  const q = query(
    collection(db, COLLECTION_NAME), 
    where('collaborators', 'array-contains', userId)
  );
  
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ 
    id: doc.id, 
    ...doc.data() 
  })) as DocumentData[];
}

export async function updateDocumentTitle(id: string, title: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, { 
    title, 
    updatedAt: serverTimestamp() 
  });
}

export async function updateDocumentContent(id: string, content: string): Promise<void> {
  const docRef = doc(db, COLLECTION_NAME, id);
  await updateDoc(docRef, { 
    content, 
    updatedAt: serverTimestamp() 
  });
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