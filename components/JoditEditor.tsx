"use client";
import React, { useRef, useEffect } from "react";
import JoditEditor from "jodit-react";

type JoditEditorProps = {
  value: string;
  onChange: (value: string) => void;
};

const Editor: React.FC<JoditEditorProps> = ({ value, onChange }) => {
  const editor = useRef(null);

  useEffect(() => {
    if (editor.current) {
      // @ts-ignore
      editor.current.value = value;
    }
  }, [value]);

  return (
    <JoditEditor
      ref={editor}
      value={value}
      config={{
        readonly: false,
        height: 300,
        buttons: [
          "bold", "italic", "underline", "strikethrough", 
          "|", "ul", "ol", "|", "outdent", "indent", 
          "|", "font", "fontsize", "|", "link", "|", 
          "align", "|", "undo", "redo", "|", "cut", 
          "copy", "paste", "selectall"
        ],
      }}
      onBlur={(newContent) => onChange(newContent)}
    />
  );
};

export default Editor;
