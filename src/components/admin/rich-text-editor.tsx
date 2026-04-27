"use client";

import { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import { Button } from "@/components/ui";
import {
  Bold,
  Italic,
  List,
  ListOrdered,
  Quote,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  Undo,
  Redo,
  Strikethrough,
  BookOpen,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  StrikethroughReplacement,
  ScriptureReference,
} from "./extensions";

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

export function RichTextEditor({
  content,
  onChange,
  placeholder = "Start writing...",
}: RichTextEditorProps) {
  const [showStrikethroughModal, setShowStrikethroughModal] = useState(false);
  const [showScriptureModal, setShowScriptureModal] = useState(false);
  const [replacementText, setReplacementText] = useState("");
  const [scriptureReference, setScriptureReference] = useState("");
  const [scriptureVerseText, setScriptureVerseText] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [2, 3],
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary-600 underline",
        },
      }),
      StrikethroughReplacement,
      ScriptureReference,
    ],
    content,
    editorProps: {
      attributes: {
        class: "tiptap",
        "data-placeholder": placeholder,
      },
    },
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  if (!editor) {
    return null;
  }

  const addImage = () => {
    const url = window.prompt("Enter image URL:");
    if (url) {
      editor.chain().focus().setImage({ src: url }).run();
    }
  };

  const addLink = () => {
    const url = window.prompt("Enter URL:");
    if (url) {
      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const openStrikethroughModal = () => {
    if (editor.state.selection.empty) {
      alert("Please select the text you want to strike through first.");
      return;
    }
    setReplacementText("");
    setShowStrikethroughModal(true);
  };

  const applyStrikethrough = () => {
    if (replacementText.trim()) {
      editor
        .chain()
        .focus()
        .setStrikethroughReplacement(replacementText.trim())
        .run();
    }
    setShowStrikethroughModal(false);
    setReplacementText("");
  };

  const openScriptureModal = () => {
    if (editor.state.selection.empty) {
      alert("Please select the scripture reference text first (e.g., 'John 3:16').");
      return;
    }
    setScriptureReference("");
    setScriptureVerseText("");
    setShowScriptureModal(true);
  };

  const applyScriptureReference = () => {
    if (scriptureReference.trim() && scriptureVerseText.trim()) {
      editor
        .chain()
        .focus()
        .setScriptureReference({
          reference: scriptureReference.trim(),
          verseText: scriptureVerseText.trim(),
        })
        .run();
    }
    setShowScriptureModal(false);
    setScriptureReference("");
    setScriptureVerseText("");
  };

  const ToolbarButton = ({
    onClick,
    active,
    children,
    title,
  }: {
    onClick: () => void;
    active?: boolean;
    children: React.ReactNode;
    title: string;
  }) => (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={cn(
        "p-2 rounded hover:bg-gray-100 transition-colors",
        active && "bg-gray-100 text-primary-600"
      )}
    >
      {children}
    </button>
  );

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      <div className="flex flex-wrap items-center gap-1 p-2 bg-gray-50 border-b border-gray-200">
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          active={editor.isActive("bold")}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          active={editor.isActive("italic")}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          active={editor.isActive("heading", { level: 2 })}
          title="Heading 2"
        >
          <Heading2 className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          active={editor.isActive("heading", { level: 3 })}
          title="Heading 3"
        >
          <Heading3 className="h-4 w-4" />
        </ToolbarButton>
        <div className="w-px h-6 bg-gray-300 mx-1" />
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
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          active={editor.isActive("blockquote")}
          title="Quote"
        >
          <Quote className="h-4 w-4" />
        </ToolbarButton>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <ToolbarButton onClick={addLink} title="Add Link">
          <LinkIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={addImage} title="Add Image">
          <ImageIcon className="h-4 w-4" />
        </ToolbarButton>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <ToolbarButton
          onClick={openStrikethroughModal}
          active={editor.isActive("strikethroughReplacement")}
          title="Strikethrough with Replacement"
        >
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={openScriptureModal}
          active={editor.isActive("scriptureReference")}
          title="Scripture Reference"
        >
          <BookOpen className="h-4 w-4" />
        </ToolbarButton>
        <div className="w-px h-6 bg-gray-300 mx-1" />
        <ToolbarButton
          onClick={() => editor.chain().focus().undo().run()}
          title="Undo"
        >
          <Undo className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().redo().run()}
          title="Redo"
        >
          <Redo className="h-4 w-4" />
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} className="bg-white" />

      {showStrikethroughModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Strikethrough with Replacement</h3>
              <button
                onClick={() => setShowStrikethroughModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              The selected text will be struck through. Enter the replacement word:
            </p>
            <input
              type="text"
              value={replacementText}
              onChange={(e) => setReplacementText(e.target.value)}
              placeholder="Enter replacement word"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 mb-4"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === "Enter") applyStrikethrough();
              }}
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowStrikethroughModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={applyStrikethrough}
                className="px-4 py-2 bg-navy-800 text-white rounded-lg hover:bg-navy-900"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {showScriptureModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Add Scripture Reference</h3>
              <button
                onClick={() => setShowScriptureModal(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Readers will see the verse text when they hover over the selected scripture reference.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reference (e.g., John 3:16)
                </label>
                <input
                  type="text"
                  value={scriptureReference}
                  onChange={(e) => setScriptureReference(e.target.value)}
                  placeholder="John 3:16"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Verse Text
                </label>
                <textarea
                  value={scriptureVerseText}
                  onChange={(e) => setScriptureVerseText(e.target.value)}
                  placeholder="For God so loved the world..."
                  rows={4}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 resize-none"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowScriptureModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={applyScriptureReference}
                className="px-4 py-2 bg-navy-800 text-white rounded-lg hover:bg-navy-900"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
