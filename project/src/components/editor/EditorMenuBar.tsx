import React from 'react';
import { Editor } from '@tiptap/react';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Code, 
  Heading1, 
  Heading2, 
  Quote, 
  Undo, 
  Redo 
} from 'lucide-react';
import { Button } from '../ui/Button';

interface EditorMenuBarProps {
  editor: Editor;
}

const EditorMenuBar: React.FC<EditorMenuBarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }

  const canUndo = typeof editor.can().undo === 'function';
  const canRedo = typeof editor.can().redo === 'function';

  return (
    <div className="border-b border-gray-200 p-2 sticky top-0 bg-white z-10">
      <div className="flex flex-wrap items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-gray-200' : ''}
        >
          <Bold size={16} />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-gray-200' : ''}
        >
          <Italic size={16} />
        </Button>
        
        <div className="h-6 w-px bg-gray-300 mx-1"></div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'bg-gray-200' : ''}
        >
          <Heading1 size={16} />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'bg-gray-200' : ''}
        >
          <Heading2 size={16} />
        </Button>
        
        <div className="h-6 w-px bg-gray-300 mx-1"></div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
        >
          <List size={16} />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}
        >
          <ListOrdered size={16} />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? 'bg-gray-200' : ''}
        >
          <Code size={16} />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'bg-gray-200' : ''}
        >
          <Quote size={16} />
        </Button>
        
        <div className="h-6 w-px bg-gray-300 mx-1"></div>
        
        {canUndo && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().undo()}
          >
            <Undo size={16} />
          </Button>
        )}
        
        {canRedo && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo size={16} />
          </Button>
        )}
      </div>
    </div>
  );
};

export default EditorMenuBar;