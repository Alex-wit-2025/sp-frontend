import React, { useEffect, useState, useCallback, useRef } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import Placeholder from '@tiptap/extension-placeholder';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';
import { Save, Check, AlertCircle } from 'lucide-react';
import { EditorProps, UserPresence } from '../../types';
import EditorMenuBar from './EditorMenuBar';
import UserPresenceList from './UserPresenceList';
import { Button } from '../ui/Button';
import { updateDocumentContent, getDocument } from '../../services/documentService';

type SaveStatus = 'saved' | 'saving' | 'error' | 'pending';

const CollaborativeEditor: React.FC<EditorProps> = ({ documentId, user }) => {
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);
  const [connectedUsers, setConnectedUsers] = useState<UserPresence[]>([]);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>('saved');
  const [lastSavedContent, setLastSavedContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [initialContent, setInitialContent] = useState<string>('');
  const [documentData, setDocumentData] = useState<any>(null); // For debugging
  
  // Refs for debouncing
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastContentRef = useRef<string>('');
  
  // Generate a consistent color for the current user
  const userColor = `#${Math.floor((parseInt(user.uid.substring(0, 8), 16) % 0xFFFFFF)).toString(16).padStart(6, '0')}`;
  
  // Load initial document content
  useEffect(() => {
    const loadDocument = async () => {
      try {
        console.log('Loading document with ID:', documentId);
        const doc = await getDocument(documentId, user.uid, await user.getIdToken());
        console.log('Loaded document data:', doc);
        
        setDocumentData(doc); // Store for debugging
        
        if (doc && doc.content) {
          console.log('Document content found:', doc.content);
          setInitialContent(doc.content);
          setLastSavedContent(doc.content);
          lastContentRef.current = doc.content;
        } else {
          console.log('No content found in document');
          setInitialContent('');
        }
      } catch (error) {
        console.error('Error loading document:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (documentId) {
      loadDocument();
    }
  }, [documentId]);
  
  // Debounced save function
  const debouncedSave = useCallback(async (content: string) => {
    // Don't save if content hasn't changed
    if (content === lastSavedContent) {
      console.log('Content unchanged, skipping save');
      return;
    }
    
    try {
      console.log('Saving content:', content);
      setSaveStatus('saving');
      let resp = await updateDocumentContent(documentId, user.uid, content, await user.getIdToken());
      console.log('Save response:', resp);
      console.log('Document saved successfully:', content);
      setLastSavedContent(content);
      setSaveStatus('saved');
      console.log('Content saved successfully');
      
    } catch (error) {
      console.error('Error saving document:', error);
      console.log('Content:', content);
      setSaveStatus('error');
      // Reset to pending after 3 seconds to allow retry
      setTimeout(() => {
        if (lastContentRef.current !== lastSavedContent) {
          setSaveStatus('pending');
        }
      }, 3000);
    }
  }, [documentId, lastSavedContent]);

  // Manual save function
  const handleManualSave = useCallback(async () => {
    const currentContent = lastContentRef.current;
    console.log('Manual save triggered with content:', currentContent);
    if (currentContent && currentContent !== lastSavedContent) {
      await debouncedSave(currentContent);
    }
  }, [debouncedSave, lastSavedContent]);

  // Create editor without collaboration extensions first
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({ placeholder: 'Start writing...' }),
    ],
    content: initialContent, // Set initial content here
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg mx-auto focus:outline-none',
      },
    },
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      lastContentRef.current = content;
      console.log('Editor content updated:', content);
      
      // Set status to pending if content changed
      if (content !== lastSavedContent) {
        setSaveStatus('pending');
      }
      
      // Clear existing timeout
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      // Set new timeout for auto-save (debounced by 2 seconds)
      saveTimeoutRef.current = setTimeout(() => {
        console.log('Auto-saving content:', content);
        debouncedSave(content);
      }, 2000);
    },
  }, [initialContent, debouncedSave, lastSavedContent]);

  // Update editor content when initialContent changes
  // Add this state at the top of your component
  const [hasInitialized, setHasInitialized] = useState(false);

  // Replace your effect with this:
  useEffect(() => {
  if (editor && lastSavedContent && !isLoading) {
    editor.commands.setContent(lastSavedContent);
  }
  // Only depend on editor, documentId, and isLoading
  }, [editor, documentId, isLoading]);


  // Reset the flag when the documentId changes:
  useEffect(() => {
    setHasInitialized(false);
  }, [documentId]);

  // Save status indicator
  const SaveStatusIndicator = () => {
    switch (saveStatus) {
      case 'saved':
        return (
          <div className="flex items-center text-green-600 text-sm">
            <Check size={16} className="mr-1" />
            Saved
          </div>
        );
      case 'saving':
        return (
          <div className="flex items-center text-blue-600 text-sm">
            <div className="animate-spin mr-1">
              <Save size={16} />
            </div>
            Saving...
          </div>
        );
      case 'error':
        return (
          <div className="flex items-center text-red-600 text-sm">
            <AlertCircle size={16} className="mr-1" />
            Save failed
          </div>
        );
      case 'pending':
        return (
          <div className="flex items-center text-gray-500 text-sm">
            <Save size={16} className="mr-1" />
            Unsaved changes
          </div>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return <div className="flex justify-center p-12">Loading document...</div>;
  }

  if (!editor) {
    return <div className="flex justify-center p-12">Loading editor...</div>;
  }
  
  return (
    <div className="h-full flex flex-col">
      {/* Debug info - remove this in production */}
      <div className="bg-yellow-100 p-2 text-xs">
        <strong>Debug Info:</strong><br />
        Document ID: {documentId}<br />
        Initial Content: {initialContent || 'EMPTY'}<br />
        Document Data: {JSON.stringify(documentData)}<br />
        Current Editor Content: {editor.getHTML() || 'EMPTY'}
      </div>
      
      <EditorMenuBar editor={editor} />
      
      {/* Save status bar */}
      <div className="border-b border-gray-200 px-4 py-2 bg-gray-50 flex justify-between items-center">
        <SaveStatusIndicator />
        <div className="flex items-center gap-2">
          {(saveStatus === 'pending' || saveStatus === 'error') && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleManualSave}
              disabled={false}
              leftIcon={<Save size={16} />}
            >
              Save Now
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex-grow overflow-auto">
        <div className="max-w-4xl mx-auto px-4">
          <EditorContent editor={editor} className="min-h-[calc(100vh-12rem)] border-b pb-24" />
        </div>
      </div>
      
      
      <UserPresenceList users={connectedUsers} />
    </div>
  );
};

export default CollaborativeEditor;