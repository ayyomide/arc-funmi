"use client";

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import { useState, useEffect } from 'react';
import { imageUploadService } from '@/lib/image-upload';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered, 
  Heading1, 
  Heading2, 
  Heading3, 
  Link as LinkIcon, 
  Image as ImageIcon,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Quote,
  Code,
  Undo,
  Redo,
  ImagePlus,
  ChevronDown
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

interface LoadingOverlayProps {
  message: string;
}

const LoadingOverlay = ({ message }: LoadingOverlayProps) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-gray-800 text-white px-6 py-4 rounded-lg flex items-center space-x-3">
      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-yellow-500"></div>
      <span>{message}</span>
    </div>
  </div>
);

// Custom Ordered List Extension with advanced formatting
const CustomOrderedList = OrderedList.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      listStyleType: {
        default: 'decimal',
        parseHTML: element => element.style.listStyleType || 'decimal',
        renderHTML: attributes => {
          return {
            style: `list-style-type: ${attributes.listStyleType}`,
          }
        },
      },
    }
  },
});

const MenuBar = ({ editor, onImageUpload, showListOptions, setShowListOptions }: { 
  editor: any; 
  onImageUpload: (file: File) => Promise<void>;
  showListOptions: boolean;
  setShowListOptions: (show: boolean) => void;
}) => {
  if (!editor) {
    return null;
  }

  const addLink = () => {
    const url = window.prompt('Enter the URL');
    if (url) {
      editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    }
  };

  const addImage = async () => {
    // Create a file input element
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (event) => {
      const file = (event.target as HTMLInputElement).files?.[0];
      if (file) {
        await onImageUpload(file);
      }
    };
    input.click();
  };

  const setImagePosition = (position: string) => {
    const { from, to } = editor.state.selection;
    const node = editor.state.doc.nodeAt(from);
    
    if (node && node.type.name === 'image') {
      // Update image attributes
      editor.chain().focus().updateAttributes('image', { 
        class: `image-${position}` 
      }).run();
    }
  };

  const resizeImage = (size: string) => {
    const { from, to } = editor.state.selection;
    const node = editor.state.doc.nodeAt(from);
    
    if (node && node.type.name === 'image') {
      const currentClass = node.attrs.class || '';
      const newClass = currentClass.replace(/image-size-\w+/, `image-size-${size}`);
      editor.chain().focus().updateAttributes('image', { 
        class: newClass 
      }).run();
    }
  };

  const setOrderedListStyle = (style: string) => {
    if (editor.isActive('orderedList')) {
      editor.chain().focus().updateAttributes('orderedList', { listStyleType: style }).run();
    } else {
      editor.chain().focus().toggleOrderedList().run();
    }
    setShowListOptions(false);
  };

  return (
    <div className="border-b border-gray-700 p-3 bg-gray-800 rounded-t-lg">
      <div className="flex flex-wrap gap-2">
        {/* Text Formatting */}
        <div className="flex items-center gap-1 border-r border-gray-600 pr-2">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            disabled={!editor.can().chain().focus().toggleBold().run()}
            className={`p-2 rounded hover:bg-gray-700 transition-colors ${
              editor.isActive('bold') ? 'bg-yellow-500 text-black' : 'text-white'
            }`}
            title="Bold"
          >
            <Bold className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            disabled={!editor.can().chain().focus().toggleItalic().run()}
            className={`p-2 rounded hover:bg-gray-700 transition-colors ${
              editor.isActive('italic') ? 'bg-yellow-500 text-black' : 'text-white'
            }`}
            title="Italic"
          >
            <Italic className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            className={`p-2 rounded hover:bg-gray-700 transition-colors ${
              editor.isActive('underline') ? 'bg-yellow-500 text-black' : 'text-white'
            }`}
            title="Underline"
          >
            <UnderlineIcon className="w-4 h-4" />
          </button>
        </div>

        {/* Headings */}
        <div className="flex items-center gap-1 border-r border-gray-600 pr-2">
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
            className={`p-2 rounded hover:bg-gray-700 transition-colors ${
              editor.isActive('heading', { level: 1 }) ? 'bg-yellow-500 text-black' : 'text-white'
            }`}
            title="Heading 1"
          >
            <Heading1 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
            className={`p-2 rounded hover:bg-gray-700 transition-colors ${
              editor.isActive('heading', { level: 2 }) ? 'bg-yellow-500 text-black' : 'text-white'
            }`}
            title="Heading 2"
          >
            <Heading2 className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
            className={`p-2 rounded hover:bg-gray-700 transition-colors ${
              editor.isActive('heading', { level: 3 }) ? 'bg-yellow-500 text-black' : 'text-white'
            }`}
            title="Heading 3"
          >
            <Heading3 className="w-4 h-4" />
          </button>
        </div>

        {/* Lists */}
        <div className="flex items-center gap-1 border-r border-gray-600 pr-2">
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`p-2 rounded hover:bg-gray-700 transition-colors ${
              editor.isActive('bulletList') ? 'bg-yellow-500 text-black' : 'text-white'
            }`}
            title="Bullet List"
          >
            <List className="w-4 h-4" />
          </button>
          
          {/* Ordered List with Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowListOptions(!showListOptions)}
              className={`p-2 rounded hover:bg-gray-700 transition-colors flex items-center gap-1 ${
                editor.isActive('orderedList') ? 'bg-yellow-500 text-black' : 'text-white'
              }`}
              title="Numbered List"
            >
              <ListOrdered className="w-4 h-4" />
              <ChevronDown className="w-3 h-3" />
            </button>
            
            {showListOptions && (
              <div className="absolute top-full left-0 mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-50 min-w-[200px] list-dropdown">
                <div className="p-2">
                  <div className="text-xs text-gray-400 mb-2 px-2">List Style:</div>
                  <button
                    onClick={() => setOrderedListStyle('decimal')}
                    className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 rounded flex items-center gap-2"
                  >
                    <span className="w-4 h-4 flex items-center justify-center">1.</span>
                    <span>Numbers (1, 2, 3...)</span>
                  </button>
                  <button
                    onClick={() => setOrderedListStyle('lower-alpha')}
                    className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 rounded flex items-center gap-2"
                  >
                    <span className="w-4 h-4 flex items-center justify-center">a.</span>
                    <span>Lowercase letters (a, b, c...)</span>
                  </button>
                  <button
                    onClick={() => setOrderedListStyle('upper-alpha')}
                    className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 rounded flex items-center gap-2"
                  >
                    <span className="w-4 h-4 flex items-center justify-center">A.</span>
                    <span>Uppercase letters (A, B, C...)</span>
                  </button>
                  <button
                    onClick={() => setOrderedListStyle('lower-roman')}
                    className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 rounded flex items-center gap-2"
                  >
                    <span className="w-4 h-4 flex items-center justify-center">i.</span>
                    <span>Lowercase Roman (i, ii, iii...)</span>
                  </button>
                  <button
                    onClick={() => setOrderedListStyle('upper-roman')}
                    className="w-full text-left px-3 py-2 text-sm text-white hover:bg-gray-700 rounded flex items-center gap-2"
                  >
                    <span className="w-4 h-4 flex items-center justify-center">I.</span>
                    <span>Uppercase Roman (I, II, III...)</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Text Alignment */}
        <div className="flex items-center gap-1 border-r border-gray-600 pr-2">
          <button
            onClick={() => editor.chain().focus().setTextAlign('left').run()}
            className={`p-2 rounded hover:bg-gray-700 transition-colors ${
              editor.isActive({ textAlign: 'left' }) ? 'bg-yellow-500 text-black' : 'text-white'
            }`}
            title="Align Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('center').run()}
            className={`p-2 rounded hover:bg-gray-700 transition-colors ${
              editor.isActive({ textAlign: 'center' }) ? 'bg-yellow-500 text-black' : 'text-white'
            }`}
            title="Align Center"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('right').run()}
            className={`p-2 rounded hover:bg-gray-700 transition-colors ${
              editor.isActive({ textAlign: 'right' }) ? 'bg-yellow-500 text-black' : 'text-white'
            }`}
            title="Align Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().setTextAlign('justify').run()}
            className={`p-2 rounded hover:bg-gray-700 transition-colors ${
              editor.isActive({ textAlign: 'justify' }) ? 'bg-yellow-500 text-black' : 'text-white'
            }`}
            title="Justify"
          >
            <AlignJustify className="w-4 h-4" />
          </button>
        </div>

        {/* Other Formatting */}
        <div className="flex items-center gap-1 border-r border-gray-600 pr-2">
          <button
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            className={`p-2 rounded hover:bg-gray-700 transition-colors ${
              editor.isActive('blockquote') ? 'bg-yellow-500 text-black' : 'text-white'
            }`}
            title="Quote"
          >
            <Quote className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().toggleCodeBlock().run()}
            className={`p-2 rounded hover:bg-gray-700 transition-colors ${
              editor.isActive('codeBlock') ? 'bg-yellow-500 text-black' : 'text-white'
            }`}
            title="Code Block"
          >
            <Code className="w-4 h-4" />
          </button>
        </div>

        {/* Links and Images */}
        <div className="flex items-center gap-1 border-r border-gray-600 pr-2">
          <button
            onClick={addLink}
            className="p-2 rounded hover:bg-gray-700 transition-colors text-white"
            title="Add Link"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
          <button
            onClick={addImage}
            className="p-2 rounded hover:bg-gray-700 transition-colors text-white"
            title="Upload Image"
          >
            <ImagePlus className="w-4 h-4" />
          </button>
        </div>

        {/* Image Positioning */}
        <div className="flex items-center gap-1 border-r border-gray-600 pr-2">
          <button
            onClick={() => setImagePosition('left')}
            className="p-2 rounded hover:bg-gray-700 transition-colors text-white"
            title="Align Image Left"
          >
            <AlignLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setImagePosition('center')}
            className="p-2 rounded hover:bg-gray-700 transition-colors text-white"
            title="Center Image"
          >
            <AlignCenter className="w-4 h-4" />
          </button>
          <button
            onClick={() => setImagePosition('right')}
            className="p-2 rounded hover:bg-gray-700 transition-colors text-white"
            title="Align Image Right"
          >
            <AlignRight className="w-4 h-4" />
          </button>
        </div>

        {/* Image Sizing */}
        <div className="flex items-center gap-1 border-r border-gray-600 pr-2">
          <button
            onClick={() => resizeImage('small')}
            className="p-2 rounded hover:bg-gray-700 transition-colors text-white"
            title="Small Image"
          >
            <div className="w-4 h-3 border border-current"></div>
          </button>
          <button
            onClick={() => resizeImage('medium')}
            className="p-2 rounded hover:bg-gray-700 transition-colors text-white"
            title="Medium Image"
          >
            <div className="w-4 h-2 border border-current"></div>
          </button>
          <button
            onClick={() => resizeImage('large')}
            className="p-2 rounded hover:bg-gray-700 transition-colors text-white"
            title="Large Image"
          >
            <div className="w-4 h-1 border border-current"></div>
          </button>
        </div>

        {/* Undo/Redo */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => editor.chain().focus().undo().run()}
            disabled={!editor.can().chain().focus().undo().run()}
            className="p-2 rounded hover:bg-gray-700 transition-colors text-white disabled:opacity-50"
            title="Undo"
          >
            <Undo className="w-4 h-4" />
          </button>
          <button
            onClick={() => editor.chain().focus().redo().run()}
            disabled={!editor.can().chain().focus().redo().run()}
            className="p-2 rounded hover:bg-gray-700 transition-colors text-white disabled:opacity-50"
            title="Redo"
          >
            <Redo className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default function RichTextEditor({ content, onChange, placeholder = "Start writing your article...", disabled = false }: RichTextEditorProps) {
  const [isClient, setIsClient] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [showListOptions, setShowListOptions] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (!target.closest('.list-dropdown')) {
        setShowListOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        orderedList: false, // Disable default ordered list to use our custom one
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: 'text-yellow-500 hover:text-yellow-400 underline',
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: 'max-w-full h-auto rounded-lg',
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      CustomOrderedList,
      ListItem,
    ],
    content,
    editable: !disabled,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const html = editor.getHTML();
      console.log("Rich text editor content updated:", {
        length: html.length,
        preview: html.substring(0, 100) + "..."
      });
      onChange(html);
    },
  });

  if (!isClient) {
    return (
      <div className="border border-gray-700 rounded-lg overflow-hidden">
        <div className="p-4 bg-black text-white min-h-[400px] flex items-center justify-center">
          <div className="text-gray-400">Loading editor...</div>
        </div>
      </div>
    );
  }

  const handleImageUpload = async (file: File) => {
    try {
      setIsUploading(true);
      
      // Upload directly to Supabase storage
      const result = await imageUploadService.uploadImage(file);

      if (result.error) {
        alert(`Upload failed: ${result.error}`);
        return;
      }

      if (result.url && editor) {
        // Insert image with positioning options
        editor.chain().focus().setImage({ 
          src: result.url,
          alt: 'Article image',
          title: 'Article image'
        }).run();
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden">
      {isUploading && <LoadingOverlay message="Uploading image..." />}
      <MenuBar 
        editor={editor} 
        onImageUpload={handleImageUpload} 
        showListOptions={showListOptions}
        setShowListOptions={setShowListOptions}
      />
      <EditorContent 
        editor={editor} 
        className="prose prose-invert max-w-none p-4 bg-black text-white min-h-[400px] focus:outline-none"
      />
      <style jsx global>{`
        .ProseMirror {
          outline: none;
          min-height: 400px;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          color: #6b7280;
          content: attr(data-placeholder);
          float: left;
          height: 0;
          pointer-events: none;
        }
        .ProseMirror h1 {
          font-size: 2em;
          font-weight: bold;
          margin: 1em 0 0.5em 0;
          color: white;
        }
        .ProseMirror h2 {
          font-size: 1.5em;
          font-weight: bold;
          margin: 1em 0 0.5em 0;
          color: white;
        }
        .ProseMirror h3 {
          font-size: 1.17em;
          font-weight: bold;
          margin: 1em 0 0.5em 0;
          color: white;
        }
        .ProseMirror p {
          margin: 1em 0;
          line-height: 1.6;
        }
        .ProseMirror ul, .ProseMirror ol {
          margin: 1em 0;
          padding-left: 2em;
        }
        .ProseMirror li {
          margin: 0.5em 0;
        }
        .ProseMirror ol[style*="list-style-type: decimal"] {
          list-style-type: decimal;
        }
        .ProseMirror ol[style*="list-style-type: lower-alpha"] {
          list-style-type: lower-alpha;
        }
        .ProseMirror ol[style*="list-style-type: upper-alpha"] {
          list-style-type: upper-alpha;
        }
        .ProseMirror ol[style*="list-style-type: lower-roman"] {
          list-style-type: lower-roman;
        }
        .ProseMirror ol[style*="list-style-type: upper-roman"] {
          list-style-type: upper-roman;
        }
        .ProseMirror blockquote {
          border-left: 4px solid #fbbf24;
          margin: 1em 0;
          padding-left: 1em;
          font-style: italic;
          color: #d1d5db;
        }
        .ProseMirror pre {
          background: #1f2937;
          border-radius: 0.5rem;
          padding: 1rem;
          margin: 1em 0;
          overflow-x: auto;
        }
        .ProseMirror code {
          background: #374151;
          padding: 0.2em 0.4em;
          border-radius: 0.25rem;
          font-family: monospace;
        }
        .ProseMirror img {
          max-width: 100%;
          height: auto;
          border-radius: 0.5rem;
          margin: 1em 0;
        }
        .ProseMirror a {
          color: #fbbf24;
          text-decoration: underline;
        }
        .ProseMirror a:hover {
          color: #f59e0b;
        }
      `}</style>
    </div>
  );
} 