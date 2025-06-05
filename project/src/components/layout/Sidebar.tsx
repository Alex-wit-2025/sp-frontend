import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ChevronLeft, 
  ChevronRight, 
  FileText, 
  Plus, 
  LogOut, 
  Trash2,
  Search
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { useAuth } from '../../contexts/AuthContext';
import { DocumentData } from '../../types';

interface SidebarProps {
  documents: DocumentData[];
  onNewDocument: () => void;
  onSelectDocument: (id: string) => void;
  onDeleteDocument: (id: string) => void;
  activeDocumentId?: string;
}

export const Sidebar: React.FC<SidebarProps> = ({
  documents,
  onNewDocument,
  onSelectDocument,
  onDeleteDocument,
  activeDocumentId
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const filteredDocuments = documents.filter(doc => 
    doc.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isCollapsed) {
    return (
      <div className="h-screen w-16 bg-gray-900 p-2 flex flex-col items-center">
        <Button 
          variant="ghost" 
          className="text-gray-400 hover:text-white mb-6 mt-2"
          onClick={() => setIsCollapsed(false)}
        >
          <ChevronRight size={20} />
        </Button>
        <Button
          variant="ghost"
          className="text-gray-400 hover:text-white mb-4"
          onClick={onNewDocument}
        >
          <Plus size={20} />
        </Button>
        <div className="flex-grow">
          {documents.slice(0, 5).map(doc => (
            <Button
              key={doc.id}
              variant="ghost"
              className={`text-gray-400 hover:text-white mb-2 ${
                activeDocumentId === doc.id ? 'bg-gray-800' : ''
              }`}
              onClick={() => onSelectDocument(doc.id)}
            >
              <FileText size={20} />
            </Button>
          ))}
        </div>
        <Button
          variant="ghost"
          className="text-gray-400 hover:text-white mt-auto mb-4"
          onClick={handleLogout}
        >
          <LogOut size={20} />
        </Button>
      </div>
    );
  }

  return (
    <div className="h-screen w-64 bg-gray-900 p-4 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-white font-semibold">Documents</h1>
        <Button 
          variant="ghost" 
          className="text-gray-400 hover:text-white"
          onClick={() => setIsCollapsed(true)}
        >
          <ChevronLeft size={20} />
        </Button>
      </div>
      
      <div className="mb-4">
        <Button
          variant="primary"
          className="w-full"
          leftIcon={<Plus size={16} />}
          onClick={onNewDocument}
        >
          New Document
        </Button>
      </div>
      
      <div className="mb-4">
        <div className="relative">
          <Input
            placeholder="Search documents..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-gray-800 border-gray-700 text-white placeholder-gray-500"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
        </div>
      </div>
      
      <div className="flex-grow overflow-y-auto">
        {filteredDocuments.length > 0 ? (
          filteredDocuments.map(doc => (
            <div 
              key={doc.id}
              className={`flex items-center justify-between p-2 rounded-md cursor-pointer mb-1 ${
                activeDocumentId === doc.id 
                  ? 'bg-gray-800 text-white' 
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
              onClick={() => onSelectDocument(doc.id)}
            >
              <div className="flex items-center overflow-hidden">
                <FileText size={16} className="mr-2 flex-shrink-0" />
                <span className="truncate">{doc.title || 'Untitled Document'}</span>
              </div>
              <Button
                variant="ghost"
                className="p-1 text-gray-400 hover:text-white hover:bg-red-500/20"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteDocument(doc.id);
                }}
              >
                <Trash2 size={14} />
              </Button>
            </div>
          ))
        ) : (
          <div className="text-gray-500 text-center mt-4">
            {searchQuery ? 'No matching documents' : 'No documents yet'}
          </div>
        )}
      </div>
      
      <Button
        variant="ghost"
        className="text-gray-400 hover:text-white mt-2"
        leftIcon={<LogOut size={16} />}
        onClick={handleLogout}
      >
        Log out
      </Button>
    </div>
  );
};