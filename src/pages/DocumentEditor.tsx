import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import { Sidebar } from '../components/layout/Sidebar';
import { Button } from '../components/ui/Button';
import { Loader } from '../components/ui/Loader';
import CollaborativeEditor from '../components/editor/CollaborativeEditor';
import DocumentHeader from '../components/editor/DocumentHeader';
import { useAuth } from '../contexts/AuthContext';
import { DocumentData } from '../types';
import {
  getDocument,
  getUserDocuments,
  deleteDocument,
  createDocument
} from '../services/documentService';

const DocumentEditor: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [document, setDocument] = useState<DocumentData | null>(null);
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Fetch document and document list
  useEffect(() => {
    const fetchData = async () => {
      if (!user || !id) return;
      
      try {
        setLoading(true);
        
        // Fetch current document
        const token = await user.getIdToken();
        const doc = await getDocument(id, user.uid, token);
        if (!doc) {
          setError('Document not found');
          return;
        }
        console.log('Fetched document in document editor:', doc);
        setDocument(doc);
        
        // Fetch user's documents for sidebar
        const docs = await getUserDocuments(user.uid);
        setDocuments(docs);
      } catch (err) {
        console.error('Error fetching document:', err);
        setError('Failed to load document');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [user, id]);
  
  // Create a new document
  const handleNewDocument = async () => {
    if (!user) return;
    
    try {
      const documentId = await createDocument(user.uid);
      navigate(`/document/${documentId}`);
    } catch (err) {
      console.error('Error creating document:', err);
      setError('Failed to create document');
    }
  };
  
  // Delete a document
  const handleDeleteDocument = async (docId: string) => {
    try {
      await deleteDocument(docId);
      
      if (docId === id) {
        // If we're deleting the current document, navigate back to dashboard
        navigate('/dashboard');
      } else {
        // Otherwise just update the documents list
        setDocuments(docs => docs.filter(doc => doc.id !== docId));
      }
    } catch (err) {
      console.error('Error deleting document:', err);
      setError('Failed to delete document');
    }
  };
  
  // Navigate to a document
  const handleSelectDocument = (docId: string) => {
    navigate(`/document/${docId}`);
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader size="lg" />
      </div>
    );
  }
  
  if (error || !document || !user) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          {error || 'Document not found'}
        </h2>
        <Button 
          variant="primary" 
          leftIcon={<ChevronLeft size={16} />}
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </Button>
      </div>
    );
  }
  
  return (
    <div className="flex h-screen">
      <Sidebar
        documents={documents}
        onNewDocument={handleNewDocument}
        onSelectDocument={handleSelectDocument}
        onDeleteDocument={handleDeleteDocument}
        activeDocumentId={id}
      />
      
      <div className="flex-1 flex flex-col h-screen overflow-hidden bg-white">
        <DocumentHeader 
          documentId={document.id} 
          title={document.title} 
        />
        
        <div className="flex-1 overflow-auto">
          <CollaborativeEditor 
            documentId={document.id} 
            user={user} 
          />
        </div>
      </div>
    </div>
  );
};

export default DocumentEditor;