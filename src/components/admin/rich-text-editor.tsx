"use client";

import { useCallback, useRef, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import LinkExtension from "@tiptap/extension-link";
import ImageExtension from "@tiptap/extension-image";
import { Table as TableExtension } from "@tiptap/extension-table";
import { TableRow as TableRowExtension } from "@tiptap/extension-table-row";
import { TableCell as TableCellExtension } from "@tiptap/extension-table-cell";
import { TableHeader as TableHeaderExtension } from "@tiptap/extension-table-header";
import Placeholder from "@tiptap/extension-placeholder";
import CharacterCount from "@tiptap/extension-character-count";
import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Quote,
  Code2,
  Table,
  Link,
  Link2Off,
  Image,
  Eye,
  EyeOff,
  Pilcrow,
} from "lucide-react";
import { cn } from "@/lib/utils";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface RichTextEditorProps {
  /** Controlled content (HTML string) */
  value: string;
  /** Content change handler */
  onChange: (html: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** Max character count (0 = unlimited) */
  maxLength?: number;
  /** Minimum height of the editor */
  minHeight?: string;
  /** Additional class names */
  className?: string;
  /** Disable the editor */
  disabled?: boolean;
}

// ---------------------------------------------------------------------------
// Toolbar Button
// ---------------------------------------------------------------------------

interface ToolbarButtonProps {
  onClick: () => void;
  active?: boolean;
  disabled?: boolean;
  title: string;
  children: React.ReactNode;
}

function ToolbarButton({
  onClick,
  active,
  disabled,
  title,
  children,
}: ToolbarButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={title}
      className={cn(
        "rounded-md p-1.5 transition-colors",
        active
          ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
          : "text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200",
        disabled && "cursor-not-allowed opacity-40",
      )}
    >
      {children}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Toolbar Divider
// ---------------------------------------------------------------------------

function ToolbarDivider() {
  return (
    <div className="mx-0.5 h-5 w-px bg-zinc-200 dark:bg-zinc-700" />
  );
}

// ---------------------------------------------------------------------------
// Link Input Popover
// ---------------------------------------------------------------------------

function LinkInput({
  editor,
  onClose,
}: {
  editor: Editor;
  onClose: () => void;
}) {
  const [url, setUrl] = useState(editor.getAttributes("link").href ?? "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url) {
      editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
    } else {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
    }
    onClose();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="absolute top-full left-0 z-50 mt-1 flex items-center gap-2 rounded-lg border border-zinc-200 bg-white p-2 shadow-lg dark:border-zinc-700 dark:bg-zinc-900"
    >
      <input
        type="url"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://..."
        className="w-60 rounded-md border border-zinc-200 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
        autoFocus
      />
      <button
        type="submit"
        className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-500"
      >
        Apply
      </button>
      <button
        type="button"
        onClick={onClose}
        className="rounded-md px-2 py-1 text-xs text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
      >
        Esc
      </button>
    </form>
  );
}

// ---------------------------------------------------------------------------
// Image Upload Handler
// ---------------------------------------------------------------------------

function ImageUploadHandler(editor: Editor) {
  const input = document.createElement("input");
  input.type = "file";
  input.accept = "image/*";
  input.onchange = async () => {
    const file = input.files?.[0];
    if (!file) return;

    // Simple data URL approach for demo — replace with actual upload endpoint
    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      editor.chain().focus().setImage({ src: url }).run();
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

// ---------------------------------------------------------------------------
// RichTextEditor
// ---------------------------------------------------------------------------

export function RichTextEditor({
  value,
  onChange,
  placeholder = "Start writing...",
  maxLength = 0,
  minHeight = "200px",
  className,
  disabled = false,
}: RichTextEditorProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [showLinkInput, setShowLinkInput] = useState(false);
  const linkButtonRef = useRef<HTMLButtonElement>(null);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      Underline,
      LinkExtension.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-blue-600 underline hover:text-blue-500" },
      }),
      ImageExtension.configure({
        HTMLAttributes: { class: "max-w-full h-auto rounded-lg" },
      }),
      TableExtension.configure({
        resizable: true,
      }),
      TableRowExtension,
      TableCellExtension,
      TableHeaderExtension,
      Placeholder.configure({ placeholder }),
      CharacterCount.configure({ limit: maxLength || undefined }),
    ],
    content: value,
    editable: !disabled,
    onUpdate: ({ editor: ed }) => {
      onChange(ed.getHTML());
    },
  });

  // Update content when value changes externally
  // (skip if the editor's content is already matching)
  // We handle this via a key or re-render strategy

  const handleImageUpload = useCallback(() => {
    if (!editor) return;
    ImageUploadHandler(editor);
  }, [editor]);

  if (!editor) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-lg border border-zinc-200 bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800/50",
          className,
        )}
        style={{ minHeight }}
      >
        <p className="text-sm text-zinc-400">Loading editor...</p>
      </div>
    );
  }

  const characterCount = editor.storage.characterCount?.characters?.() ?? 0;
  const wordCount = editor.storage.characterCount?.words?.() ?? 0;

  return (
    <div
      className={cn(
        "overflow-hidden rounded-lg border border-zinc-200 bg-white dark:border-zinc-700 dark:bg-zinc-900",
        className,
      )}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b border-zinc-200 px-3 py-2 dark:border-zinc-700">
        {/* Text style */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold (Ctrl+B)"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic (Ctrl+I)"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          active={editor.isActive("underline")}
          title="Underline (Ctrl+U)"
        >
          <UnderlineIcon className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Headings */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive("heading", { level: 1 })}
          title="Heading 1"
        >
          <Heading1 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          active={editor.isActive("paragraph")}
          title="Paragraph"
        >
          <Pilcrow className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Lists */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          active={editor.isActive("bulletList")}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          active={editor.isActive("orderedList")}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Block elements */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          active={editor.isActive("codeBlock")}
          title="Code Block"
        >
          <Code2 className="h-4 w-4" />
        </ToolbarButton>

        <ToolbarDivider />

        {/* Link */}
        <div className="relative">
          <ToolbarButton
            onClick={() => {
              if (editor.isActive("link")) {
                editor.chain().focus().unsetLink().run();
              } else {
                setShowLinkInput(!showLinkInput);
              }
            }}
            active={editor.isActive("link")}
            title={editor.isActive("link") ? "Remove Link" : "Add Link"}
          >
            {editor.isActive("link") ? (
              <Link2Off className="h-4 w-4" />
            ) : (
              <Link className="h-4 w-4" />
            )}
          </ToolbarButton>
          {showLinkInput && (
            <LinkInput
              editor={editor}
              onClose={() => setShowLinkInput(false)}
            />
          )}
        </div>

        {/* Image */}
        <ToolbarButton
          onClick={handleImageUpload}
          title="Insert Image"
        >
          <Image className="h-4 w-4" />
        </ToolbarButton>

        {/* Table */}
        <ToolbarButton
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
          title="Insert Table"
        >
          <Table className="h-4 w-4" />
        </ToolbarButton>

        <div className="ml-auto flex items-center gap-2">
          {/* Preview toggle */}
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className={cn(
              "rounded-md p-1.5 transition-colors",
              showPreview
                ? "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300"
                : "text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300",
            )}
            title={showPreview ? "Edit mode" : "Preview mode"}
          >
            {showPreview ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      {/* Editor / Preview content */}
      {showPreview ? (
        <div
          className="prose prose-sm dark:prose-invert max-w-none p-4"
          style={{ minHeight }}
          dangerouslySetInnerHTML={{ __html: editor.getHTML() }}
        />
      ) : (
        <div className="p-4" style={{ minHeight }}>
          <EditorContent editor={editor} />
        </div>
      )}

      {/* Footer: character / word count */}
      {(maxLength > 0 || true) && (
        <div className="flex items-center justify-between border-t border-zinc-200 px-3 py-1.5 text-xs text-zinc-400 dark:border-zinc-700">
          <span>
            {wordCount} {wordCount === 1 ? "word" : "words"}
          </span>
          {maxLength > 0 && (
            <span
              className={cn(
                characterCount > maxLength && "font-medium text-red-500",
              )}
            >
              {characterCount}/{maxLength} characters
            </span>
          )}
        </div>
      )}
    </div>
  );
}
