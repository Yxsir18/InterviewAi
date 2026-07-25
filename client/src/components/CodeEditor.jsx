import React, { useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';

const CodeEditor = ({ 
  language = 'javascript', 
  value = '', 
  onChange = () => {}, 
  height = '500px',
  theme = 'vs-dark',
  readOnly = false 
}) => {
  const editorRef = useRef(null);

  const handleEditorDidMount = (editor, monaco) => {
    editorRef.current = editor;
    
    // Configure editor options
    editor.updateOptions({
      fontSize: 14,
      fontFamily: "'Fira Code', 'Consolas', 'Monaco', monospace",
      minimap: { enabled: true },
      automaticLayout: true,
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      lineNumbers: 'on',
      renderWhitespace: 'selection',
      tabSize: 2,
      insertSpaces: true,
      formatOnPaste: true,
      formatOnType: true,
    });
  };

  const handleEditorChange = (value) => {
    onChange(value);
  };

  return (
    <div className="w-full h-full">
      <Editor
        height={height}
        language={language}
        value={value}
        theme={theme}
        onChange={handleEditorChange}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          selectOnLineNumbers: true,
          roundedSelection: true,
          cursorStyle: 'line',
          automaticLayout: true,
        }}
        loading={<div className="flex items-center justify-center h-full text-gray-400">Loading editor...</div>}
      />
    </div>
  );
};

export default CodeEditor;
