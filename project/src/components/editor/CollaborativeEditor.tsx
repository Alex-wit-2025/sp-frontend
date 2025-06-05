import React, { useEffect, useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import Placeholder from '@tiptap/extension-placeholder';
import { WebsocketProvider } from 'y-websocket';
import * as Y from 'yjs';
import { EditorProps, UserPresence } from '../../types';
import EditorMenuBar from './EditorMenuBar';
import UserPresenceList from './UserPresenceList';
import { updateDocumentContent } from '../../services/documentService';

const CollaborativeEditor: React.FC<EditorProps> = ({ documentId, user }) => {
  const [provider, setProvider] = useState<WebsocketProvider | null>(null);
  const [connectedUsers, setConnectedUsers] = useState<UserPresence[]>([]);
  
  // Generate a consistent color for the current user
  const userColor = `#${Math.floor((parseInt(user.uid.substring(0, 8), 16) % 0xFFFFFF)).toString(16).padStart(6, '0')}`;
  
  // Set up Yjs document and provider
  useEffect(() => {
    const ydoc = new Y.Doc();
    const websocketProvider = new WebsocketProvider(
      'ws://localhost:3001',
      documentId,
      ydoc
    );
    
    // Set user information
    websocketProvider.awareness.setLocalStateField('user', {
      name: user.email?.split('@')[0] || 'Anonymous',
      color: userColor
    });
    
    setProvider(websocketProvider);
    
    // Track connected users
    const updateConnectedUsers = () => {
      const states = websocketProvider.awareness.getStates();
      const users: UserPresence[] = [];
      
      states.forEach((state, clientId) => {
        if (state.user) {
          users.push({
            name: state.user.name,
            color: state.user.color,
            cursor: state.cursor
          });
        }
      });
      
      setConnectedUsers(users);
    };
    
    websocketProvider.awareness.on('change', updateConnectedUsers);
    
    return () => {
      websocketProvider.awareness.off('change', updateConnectedUsers);
      websocketProvider.disconnect();
      ydoc.destroy();
    };
  }, [documentId, user, userColor]);
  
  // Initialize editor
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        history: false // Disable history as it's handled by Yjs
      }),
      Placeholder.configure({
        placeholder: 'Start writing...'
      }),
      Collaboration.configure({
        document: provider?.doc,
      }),
      CollaborationCursor.configure({
        provider: provider,
        user: {
          name: user.email?.split('@')[0] || 'Anonymous',
          color: userColor
        }
      })
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose lg:prose-lg mx-auto focus:outline-none'
      }
    },
    onUpdate: ({ editor }) => {
      // Autosave content to Firestore (debounced)
      const content = editor.getHTML();
      // Use a debounce implementation here in a real app
      updateDocumentContent(documentId, content);
    }
  }, [provider, documentId]);
  
  if (!editor) {
    return <div className="flex justify-center p-12">Loading editor...</div>;
  }
  
  return (
    <div className="h-full flex flex-col">
      <EditorMenuBar editor={editor} />
      
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