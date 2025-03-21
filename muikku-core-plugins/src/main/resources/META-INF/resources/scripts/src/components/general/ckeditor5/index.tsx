import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { EditorConfig } from "@ckeditor/ckeditor5-core/src/editor/editorconfig";
import { ClassicEditor } from "ckeditor5";
import "ckeditor5/ckeditor5.css";
import { testConfig } from "./configs";
import "./ckeditor5.css";

/**
 * CKEditorProps
 */
interface CKEditorProps {
  initialData?: string;
  onChange?: (data: string) => void;
  config?: EditorConfig;
}

/**
 * CKEditor5
 * @param props props
 */
const CKEditor5: React.FC<CKEditorProps> = (props) => {
  const { initialData, onChange, config = { ...testConfig } } = props;

  const editorContainerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<HTMLDivElement | null>(null);
  //const elementRef = useRef<HTMLDivElement>(null);
  const editorWordCountRef = useRef<HTMLDivElement>(null);
  const editorMenuBarRef = useRef<HTMLDivElement>(null);
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  useEffect(() => {
    setIsLayoutReady(true);

    return () => setIsLayoutReady(false);
  }, []);

  const { editorConfig } = useMemo((): { editorConfig: EditorConfig } => {
    if (!isLayoutReady) {
      return { editorConfig: null };
    }

    return { editorConfig: { ...config } };
  }, [config, isLayoutReady]);

  // useEffect(() => {
  //   // Initialize CKEditor
  //   ClassicEditor.create(elementRef.current!, config)
  //     .then((editor) => {
  //       editorRef.current = editor;

  //       // Set initial data if provided
  //       editor.setData(initialData);

  //       // Set up change handler
  //       editor.model.document.on("change:data", () => {
  //         const data = editor.getData();
  //         onChange?.(data);
  //       });
  //     })
  //     .catch((error) => {
  //       console.error("Error initializing CKEditor:", error);
  //     });

  //   // Cleanup on component unmount
  //   return () => {
  //     editorRef.current
  //       ?.destroy()
  //       .then(() => {
  //         editorRef.current = null;
  //       })
  //       .catch((error) => {
  //         console.error("Error destroying CKEditor:", error);
  //       });
  //   };
  // }, [config, initialData, onChange]); // Empty dependency array as we only want to initialize once

  //return <div ref={elementRef} />;

  console.log("Is there config?", editorConfig);

  return (
    <div
      className="editor-container editor-container_classic-editor editor-container_include-style editor-container_include-word-count"
      ref={editorContainerRef}
    >
      <div className="editor-container__editor">
        <div ref={editorRef}>
          {editorConfig && (
            <CKEditor
              onReady={(editor) => {
                const wordCount = editor.plugins.get("WordCount");
                editorWordCountRef.current.appendChild(
                  wordCount.wordCountContainer
                );

                editorMenuBarRef.current.appendChild(
                  editor.ui.view.menuBarView.element
                );
              }}
              onAfterDestroy={() => {
                Array.from(editorWordCountRef.current.children).forEach(
                  (child) => child.remove()
                );

                Array.from(editorMenuBarRef.current.children).forEach((child) =>
                  child.remove()
                );
              }}
              onChange={(event, editor) => {
                console.log("Editor changed", editor.getData());
                onChange?.(editor.getData());
              }}
              editor={ClassicEditor}
              config={editorConfig}
            />
          )}
        </div>
      </div>
      <div
        className="editor_container__word-count"
        ref={editorWordCountRef}
      ></div>
    </div>
  );
};

export default CKEditor5;
