"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";
import { cn } from "@/lib/utils";

interface EditorProps {
  value: string;
  onChange: (html: string) => void;
  className?: string;
}

export function RichEditor({ value, onChange, className }: EditorProps) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: value,
    editorProps: {
      attributes: {
        class:
          "prose prose-sm max-w-none min-h-[300px] p-4 focus:outline-none",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  // Sync external value changes (e.g. on edit load)
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [value, editor]);

  return (
    <div
      className={cn(
        "border border-input rounded-md bg-background overflow-auto",
        className
      )}
    >
      {/* Toolbar */}
      <div className="flex flex-wrap gap-1 p-2 border-b border-input">
        {[
          { label: "B", action: () => editor?.chain().focus().toggleBold().run(), active: editor?.isActive("bold") },
          { label: "I", action: () => editor?.chain().focus().toggleItalic().run(), active: editor?.isActive("italic") },
          { label: "S", action: () => editor?.chain().focus().toggleStrike().run(), active: editor?.isActive("strike") },
          { label: "H2", action: () => editor?.chain().focus().toggleHeading({ level: 2 }).run(), active: editor?.isActive("heading", { level: 2 }) },
          { label: "H3", action: () => editor?.chain().focus().toggleHeading({ level: 3 }).run(), active: editor?.isActive("heading", { level: 3 }) },
          { label: "UL", action: () => editor?.chain().focus().toggleBulletList().run(), active: editor?.isActive("bulletList") },
          { label: "OL", action: () => editor?.chain().focus().toggleOrderedList().run(), active: editor?.isActive("orderedList") },
          { label: "</>", action: () => editor?.chain().focus().toggleCodeBlock().run(), active: editor?.isActive("codeBlock") },
          { label: "—", action: () => editor?.chain().focus().setHorizontalRule().run(), active: false },
        ].map(({ label, action, active }) => (
          <button
            key={label}
            type="button"
            onClick={action}
            className={cn(
              "px-2 py-1 text-xs rounded hover:bg-accent transition-colors",
              active && "bg-accent font-bold"
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
