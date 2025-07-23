import { User } from 'firebase/auth';
import { Timestamp } from 'firebase/firestore';

export interface DocumentData {
  id: string;
  title: string;
  content: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  createdBy: string;
  collaborators: string[];
}

export interface DocumentListItemProps {
  document: DocumentData;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export interface EditorProps {
  documentId: string;
  user: User;
}

export interface UserPresence {
  name: string;
  color: string;
  cursor?: {
    anchor: number;
    head: number;
  };
}

export interface UserData {
  id: string;
  email: string;
  sharedDocuments?: string[];
  createdAt: Timestamp;
  isPlaceholder?: boolean;
}