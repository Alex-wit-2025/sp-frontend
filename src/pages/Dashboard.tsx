import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Plus, Trash2 } from 'lucide-react';
import { Sidebar } from '../components/layout/Sidebar';
import { Button } from '../components/ui/Button';
import { Loader } from '../components/ui/Loader';
import { useAuth } from '../contexts/AuthContext';
import { DocumentData } from '../types';
import {
  createDocument,
  getUserDocuments,
  deleteDocument
} from '../services/documentService';

const Dashboard: React.FC = () => {
  const [documents, setDocuments] = useState<DocumentData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Fetch user's documents
  useEffect(() => {
    const fetchDocuments = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const docs = await getUserDocuments(user.uid, await user.getIdToken());
        console.log('Fetched documents:', docs);
        setDocuments(docs);
      } catch (err) {
        console.error('Error fetching documents:', err);
        setError('Failed to load documents. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchDocuments();
  }, [user]);
  
  // Create a new document
  const handleNewDocument = async () => {
    if (!user) return;
    
    try {
      const documentId = await createDocument(user.uid);
      navigate(`/document/${documentId}`);
    } catch (err) {
      console.error('Error creating document:', err);
      setError('Failed to create document. Please try again.');
    }
  };
  
  // Delete a document
  const handleDeleteDocument = async (id: string) => {
    try {
      await deleteDocument(id);
      setDocuments(docs => docs.filter(doc => doc.id !== id));
    } catch (err) {
      console.error('Error deleting document:', err);
      setError('Failed to delete document. Please try again.');
    }
  };
  
  // Navigate to a document
  const handleSelectDocument = (id: string) => {
    navigate(`/document/${id}`);
  };
  
  return (
    <div className="flex h-screen">
      <Sidebar
        documents={documents}
        onNewDocument={handleNewDocument}
        onSelectDocument={handleSelectDocument}
        onDeleteDocument={handleDeleteDocument}
      />
      
      <div className="flex-1 p-8 bg-gray-50">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Loader size="lg" />
          </div>
        ) : (
          <>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
                {error}
              </div>
            )}
            
            <div className="max-w-5xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-semibold text-gray-800">Your Documents</h1>
                <Button
                  variant="primary"
                  leftIcon={<Plus size={16} />}
                  onClick={handleNewDocument}
                >
                  New Document
                </Button>
              </div>
              
              {documents.length === 0 ? (
                <div className="text-center p-12 bg-white rounded-lg border border-gray-200">
                  <div className="inline-flex items-center justify-center p-3 bg-gray-100 rounded-full mb-4">
                    <FileText size={24} className="text-gray-500" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
                  <p className="text-gray-500 mb-4">
                    Create your first document to get started with collaborative editing
                  </p>
                  <Button
                    variant="primary"
                    leftIcon={<Plus size={16} />}
                    onClick={handleNewDocument}
                  >
                    Create Document
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {documents.map(doc => (
                    <div
                      key={doc.id}
                      className="bg-white p-4 rounded-lg border border-gray-200 hover:border-teal-500 cursor-pointer transition-all shadow-sm hover:shadow-md"
                      onClick={() => handleSelectDocument(doc.id)}
                    >
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-lg truncate">
                          {doc.title || 'Untitled Document'}
                        </h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-gray-500 hover:text-red-500"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteDocument(doc.id);
                          }}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                      <p className="text-sm text-gray-500 mt-2">
                        Last edited: {doc.updatedAt ? new Date(doc.updatedAt.seconds * 1000).toLocaleString() : 'Never'}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;