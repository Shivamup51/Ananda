"use client";

import { useEffect } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Heading from "@tiptap/extension-heading";
import TextAlign from "@tiptap/extension-text-align";
import { MenuBar } from "./Menubar";

function escapeHtml(input: string) {
  return input
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function toHtmlContent(value?: string) {
  if (!value) {
    return "<p></p>";
  }

  if (value.trim().startsWith("<")) {
    return value;
  }

  const sanitized = value
    .split("\n")
    .map((line) => (line ? escapeHtml(line) : "&nbsp;"))
    .map((line) => `<p>${line}</p>`)
    .join("");

  return sanitized || "<p></p>";
}

export function RichTextEditor({
  field,
}: {
  field: { value?: string; onChange: (_value: string) => void };
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
      }),
      Heading.configure({
        levels: [1, 2, 3],
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
    ],

    editorProps: {
      attributes: {
        class:
          "h-[300px] p-4 focus:outline-none prose prose-sm sm:prose lg:prose-lg dark:prose-invert !w-full !max-w-none overflow-y-auto",
      },
    },

    onUpdate: ({ editor }) => {
      field.onChange(editor.getHTML());
    },

    content: toHtmlContent(field.value),
    immediatelyRender: false,
  });

  useEffect(() => {
    if (!editor) return;

    const incoming = field.value ?? "";
    const current = editor.getHTML();

    if (incoming === current) {
      return;
    }

    editor.commands.setContent(toHtmlContent(incoming));
  }, [editor, field.value]);

  return (
    <div className="w-full border border-input rounded-lg overflow-hidden dark:bg-input/30">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
}
