import React, { useState, useEffect, useRef } from 'react';
import { Input } from '../ui/Input';
import { updateDocumentTitle } from '../../services/documentService';

interface DocumentHeaderProps {
  documentId: string;
  title: string;
}

const DocumentHeader: React.FC<DocumentHeaderProps> = ({ documentId, title }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [documentTitle, setDocumentTitle] = useState(title || 'Untitled Document');
  const inputRef = useRef<HTMLInputElement>(null);
  
  useEffect(() => {
    setDocumentTitle(title || 'Untitled Document');
  }, [title]);
  
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);
  
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocumentTitle(e.target.value);
  };
  
  const handleTitleSave = async () => {
    if (documentTitle.trim() === '') {
      setDocumentTitle('Untitled Document');
    } else {
      try {
        await updateDocumentTitle(documentId, documentTitle);
      } catch (error) {
        console.error('Failed to update document title:', error);
      }
    }
    setIsEditing(false);
  };
  
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleTitleSave();
    } else if (e.key === 'Escape') {
      setDocumentTitle(title || 'Untitled Document');
      setIsEditing(false);
    }
  };
  
  return (
    <div className="py-3 px-4 border-b">
      {isEditing ? (
        <Input
          ref={inputRef}
          value={documentTitle}
          onChange={handleTitleChange}
          onBlur={handleTitleSave}
          onKeyDown={handleKeyDown}
          className="font-medium text-lg"
        />
      ) : (
        <h1 
          className="font-medium text-lg cursor-pointer hover:bg-gray-100 px-2 py-1 rounded transition-colors"
          onClick={() => setIsEditing(true)}
        >
          {documentTitle}
        </h1>
      )}
    </div>
  );
};

export default DocumentHeader;