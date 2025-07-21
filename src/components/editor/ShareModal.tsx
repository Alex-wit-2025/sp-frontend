import React, { useState, useEffect } from 'react';
import { X, Mail, UserPlus, Trash2, Users } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { 
  addCollaborator, 
  removeCollaboratorFromDocument,
  getDocumentCollaborators 
} from '../../services/documentService';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  documentId: string;
  documentTitle: string;
}

interface Collaborator {
  id: string;
  email: string;
  isOwner: boolean;
}

const ShareModal: React.FC<ShareModalProps> = ({ 
  isOpen, 
  onClose, 
  documentId, 
  documentTitle 
}) => {
  const [email, setEmail] = useState('');
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();

  // Fetch collaborators when modal opens
  useEffect(() => {
    if (isOpen && documentId) {
      fetchCollaborators();
    }
  }, [isOpen, documentId]);

  const fetchCollaborators = async () => {
    try {
      const collaboratorList = await getDocumentCollaborators(documentId);
      setCollaborators(collaboratorList);
    } catch (err) {
      console.error('Error fetching collaborators:', err);
      setError('Failed to load collaborators');
    }
  };

  const handleAddCollaborator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await addCollaborator(documentId, email.trim());
      setSuccess(`Successfully shared with ${email}`);
      setEmail('');
      await fetchCollaborators(); // Refresh the list
    } catch (err: any) {
      setError(err.message || 'Failed to add collaborator');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveCollaborator = async (collaboratorId: string, collaboratorEmail: string) => {
    if (!confirm(`Remove ${collaboratorEmail} from this document?`)) return;

    try {
      await removeCollaboratorFromDocument(documentId, collaboratorId);
      setSuccess(`Removed ${collaboratorEmail} from document`);
      await fetchCollaborators(); // Refresh the list
    } catch (err: any) {
      setError(err.message || 'Failed to remove collaborator');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <Users className="h-5 w-5 text-teal-600" />
            <h2 className="text-lg font-semibold text-gray-900">Share Document</h2>
          </div>
          <Button variant="ghost" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6">
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 mb-1">{documentTitle}</h3>
            <p className="text-sm text-gray-500">Share this document with others</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 text-green-700 rounded-md text-sm">
              {success}
            </div>
          )}

          <form onSubmit={handleAddCollaborator} className="mb-6">
            <div className="flex space-x-2">
              <div className="flex-1">
                <Input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  fullWidth
                />
              </div>
              <Button
                type="submit"
                variant="primary"
                isLoading={loading}
                leftIcon={<UserPlus size={16} />}
              >
                Add
              </Button>
            </div>
          </form>

          <div>
            <h4 className="font-medium text-gray-900 mb-3">
              People with access ({collaborators.length})
            </h4>
            
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {collaborators.map((collaborator) => (
                <div
                  key={collaborator.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-md"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                      <Mail className="h-4 w-4 text-teal-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {collaborator.email}
                      </p>
                      <p className="text-xs text-gray-500">
                        {collaborator.isOwner ? 'Owner' : 'Collaborator'}
                      </p>
                    </div>
                  </div>
                  
                  {!collaborator.isOwner && collaborator.id !== user?.uid && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => handleRemoveCollaborator(collaborator.id, collaborator.email)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
              ))}
              
              {collaborators.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                  <p>No collaborators yet</p>
                  <p className="text-sm">Add people to start collaborating</p>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t">
          <Button variant="secondary" onClick={onClose} className="w-full">
            Done
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ShareModal;