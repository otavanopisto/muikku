import * as React from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import { ClassicEditor } from "ckeditor5";
import CKEditorInspector from "@ckeditor/ckeditor5-inspector";
import "ckeditor5/ckeditor5.css";
import { testConfig, MuikkuCkeditorConfig } from "./configs";
import "./ckeditor5.css";

/**
 * CKEditorProps
 */
interface CKEditorProps {
  initialData?: string;
  onChange?: (data: string) => void;
  config?: MuikkuCkeditorConfig;
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

  const { editorConfig } = useMemo((): {
    editorConfig: MuikkuCkeditorConfig;
  } => {
    if (!isLayoutReady) {
      return { editorConfig: null };
    }

    return { editorConfig: { ...config, initialData: props.initialData } };
  }, [config, isLayoutReady, props.initialData]);

  return (
    <div
      className="editor-container editor-container_classic-editor editor-container_include-style editor-container_include-word-count"
      ref={editorContainerRef}
    >
      <div className="editor-container__editor">
        <div ref={editorRef}>
          {editorConfig && (
            <CKEditor
              data={props.initialData || initialData}
              onReady={(editor) => {
                if (!editor) {
                  return;
                }

                // Attach the inspector to the editor
                CKEditorInspector.attach(editor);

                const wordCount = editor.plugins.get("WordCount");
                if (editorWordCountRef.current) {
                  editorWordCountRef.current.appendChild(
                    wordCount.wordCountContainer
                  );
                }

                if (editorMenuBarRef.current) {
                  editorMenuBarRef.current.appendChild(
                    editor.ui.view.menuBarView.element
                  );
                }
              }}
              onAfterDestroy={() => {
                Array.from(editorWordCountRef.current.children).forEach(
                  (child) => child.remove()
                );

                if (editorMenuBarRef.current) {
                  Array.from(editorMenuBarRef.current.children).forEach(
                    (child) => child.remove()
                  );
                }
              }}
              onChange={(event, editor) => {
                console.log("CKEditor onChange", editor.getData());
                onChange?.(editor.getData());
              }}
              onError={(error, { phase }) => {
                console.error("CKEditor error:", { error, phase });
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
