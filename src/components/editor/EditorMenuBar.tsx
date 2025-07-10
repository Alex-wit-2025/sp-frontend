import React from 'react';
import { Editor } from '@tiptap/react';
import { 
  Bold, 
  Italic, 
  List, 
  ListOrdered, 
  Code, 
  Strikethrough, 
  Quote, 
  Undo,
  Underline, 
  Redo,
  SquareRadical, 
  AlignLeft,
  AlignRight,
  AlignCenter,
  AlignJustify,
} from 'lucide-react';
import { Button,  } from '../ui/Button';
import { ChevronDown } from 'lucide-react';
// ...existing code...
interface EditorMenuBarProps {
  editor: Editor;
}

const EditorMenuBar: React.FC<EditorMenuBarProps> = ({ editor }) => {
  if (!editor) {
    return null;
  }
 const headingOptions = [
  { label: 'Heading 1', level: 1 },
  { label: 'Heading 2', level: 2 },
  { label: 'Heading 3', level: 3 },
  { label: 'Heading 4', level: 4 },
];
const getActiveHeading = () => {
  for (let i = 1; i <= 4; i++) {
    if (editor.isActive('heading', { level: i })) {
      return i;
    }
  }
  return null;
};

const activeHeading = getActiveHeading();
const activeHeadingLabel = activeHeading
  ? `H${activeHeading} Heading`
  : 'Heading';
  
  const canUndo = typeof editor.can().undo === 'function';
  const canRedo = typeof editor.can().redo === 'function';

  return (
    <div className="border-b border-gray-200 p-2 sticky top-0 bg-white z-10">
      <div className="flex flex-wrap items-center gap-1">
        {canUndo && (
          <Button
            title="Undo"
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
            title="Redo"
            variant="ghost"
            size="sm"
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().redo()}
          >
            <Redo size={16} />
          </Button>
        )}
        
        <div className="h-6 w-px bg-gray-300 mx-1"></div>
        
        <Button
          title="Bold"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'bg-gray-200' : ''}
        >
          <Bold size={16} />
        </Button>
        
        <Button
          title="Italic"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'bg-gray-200' : ''}
        >
          <Italic size={16} />
        </Button>

        <Button
          title="Underline"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          className={editor.isActive('underline') ? 'bg-gray-200' : ''}
        >
          <Underline size={16} />
        </Button>

        <Button
          title="Strike"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'bg-gray-200' : ''}
          >
            <Strikethrough size={16} />
        </Button>

        <div className="h-6 w-px bg-gray-300 mx-1"></div>
        
        <Button
          title="Align Left"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          className={editor.isActive('align left') ? 'bg-gray-200' : ''}
          >
            <AlignLeft size={16} />
        </Button>

        <Button
          title="Align Center"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          className={editor.isActive('align center') ? 'bg-gray-200' : ''}
          >
            <AlignCenter size={16} />
        </Button>

        <Button
          title="Align Right"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          className={editor.isActive('align right') ? 'bg-gray-200' : ''}
          >
            <AlignRight size={16} />
        </Button>

        <Button
          title="Align Justify"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().setTextAlign('justify').run()}
          className={editor.isActive('align justify') ? 'bg-gray-200' : ''}
          >
            <AlignJustify size={16} />
        </Button>
        <div className="h-6 w-px bg-gray-300 mx-1"></div>
        
        {/* Heading Dropdown */}
        <div className="relative group">
          <Button
            title="Headings"
            variant="ghost"
            size="sm"
            className={
              [1, 2, 3, 4].some(l => editor.isActive('heading', { level: l }))
                ? 'bg-gray-200 flex items-center'
                : 'flex items-center'
            }
            type="button"
          >
            <span className="ml-1">{activeHeadingLabel}</span>
            <ChevronDown size={14} className="ml-1" />
          </Button>
          <div className="absolute left-0 mt-1 w-32 bg-white border border-gray-200 rounded shadow-lg z-20 hidden group-hover:block hover:block">
            {headingOptions.map(option => (
              <button
                key={option.level}
                className={`w-full text-left px-3 py-1 hover:bg-gray-100 ${
                  editor.isActive('heading', { level: option.level }) ? 'bg-gray-100 font-bold' : ''
                }`}
                onMouseDown={e => {
                  e.preventDefault();
                  editor.chain().focus().toggleHeading({ level: option.level as any}).run();
                }}
              >
                {`H${option.level} Heading`}
              </button>
            ))}
          </div>
        </div>
        
        <div className="h-6 w-px bg-gray-300 mx-1"></div>
        
        <Button
          title="Bullet List"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'bg-gray-200' : ''}
        >
          <List size={16} />
        </Button>
        
        <Button
          title="Ordered List"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'bg-gray-200' : ''}
        >
          <ListOrdered size={16} />
        </Button>
        
        <Button
          title="Code Block"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? 'bg-gray-200' : ''}
        >
          <Code size={16} />
        </Button>
        
        <Button
          title="Block Quote"
          variant="ghost"
          size="sm"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'bg-gray-200' : ''}
        >
          <Quote size={16} />
        </Button>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={() =>
            editor.chain().focus().insertContent({
                type: 'mathBlock',
                attrs: {},
                content: [{ type: 'text', text: ' ' }], // Use a single space instead of an empty string
              }).run()
          }
        >
          <SquareRadical size={16} />
        </Button>
        
        <div className="h-6 w-px bg-gray-300 mx-1"></div>
        
        
      </div>
    </div>
  );
};

export default EditorMenuBar;