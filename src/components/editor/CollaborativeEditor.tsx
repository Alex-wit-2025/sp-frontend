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
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import CodeBlock from '@tiptap/extension-code-block';
import Blockquote from '@tiptap/extension-blockquote';
import Mathematics from '@tiptap/extension-mathematics';
import Strike from '@tiptap/extension-strike'
import Underline from '@tiptap/extension-underline'
import { TextAlign } from '@tiptap/extension-text-align'
import 'katex/dist/katex.min.css';

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
        }
      } catch (error) {
        console.error('Error loading document:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadDocument();
  }, [documentId]);

  // Debounced save function
  const debouncedSave = useCallback(async (content: string) => {
    if (content === lastSavedContent) return;
    
    try {
      setSaveStatus('saving');
      let resp = await updateDocumentContent(documentId, user.uid, content, await user.getIdToken());
      console.log('Save response:', resp);
      console.log('Document saved successfully:', content);
      setLastSavedContent(content);
      setSaveStatus('saved');
    } catch (error) {
      console.error('Error saving document:', error);
      console.log('Content:', content);
      setSaveStatus('error');
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

  // Editor initialization
  const editor = useEditor({
    extensions: [
      StarterKit,
      BulletList,
      OrderedList,
      CodeBlock,
      Blockquote,
      Strike,
      Underline,
      TextAlign.configure({
      types: ['heading', 'paragraph'], // Add all node types you want to align
      }),
      Mathematics.configure({
        shouldRender: (state, pos, node) => {
          const $pos = state.doc.resolve(pos)
          return node.type.name === 'text' && $pos.parent.type.name !== 'codeBlock'
        },
      }),
      Placeholder.configure({ placeholder: 'Start writing...' }),
    ],
    content: lastSavedContent,
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg mx-auto focus:outline-none',
      },
    },


    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      lastContentRef.current = content;
      
      if (content !== lastSavedContent) {
        setSaveStatus('pending');
      }
      
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      
      saveTimeoutRef.current = setTimeout(() => {
        console.log('Auto-saving content:', content);
        debouncedSave(content);
      }, 10000);
    },
  }, [lastSavedContent, debouncedSave]);

    // Manual save function
      const handleManualSave = useCallback(async () => {
        if (editor) {
          const content = editor.getHTML();
          await debouncedSave(content);
        }
      }, [debouncedSave, editor]);
  // Update editor when content loads
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
    if (editor && lastSavedContent && !isLoading) {
      editor.commands.setContent(lastSavedContent);
    }
  }, [editor, lastSavedContent, isLoading]);

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
              leftIcon={<Save size={16} />}
            >
              Save Now
            </Button>
          )}
        </div>
      </div>
      
      <div className="flex-grow overflow-auto">
        <div className="max-w-4xl mx-auto px-4">
          <EditorContent
            editor={editor}
            className="min-h-[calc(100vh-12rem)] border-b pb-24 prose"
          />         
        </div>
      </div>
      
      
      <UserPresenceList users={connectedUsers} />
    </div>
  );
};

export default CollaborativeEditor;