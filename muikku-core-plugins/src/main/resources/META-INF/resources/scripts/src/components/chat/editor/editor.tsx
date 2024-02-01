import * as React from "react";
import { createEditor, Descendant, Editor, Range } from "slate";
import {
  Slate,
  Editable,
  withReact,
  RenderElementProps,
  RenderLeafProps,
  useSelected,
  useFocused,
} from "slate-react";
import { withHistory } from "slate-history";
import { CustomEditor, deserialize, serialize, withMentions } from "./helper";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import EditorHoveringToolbar from "./editor-hovering-toolbar";
import { useChatContext } from "../context/chat-context";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import EditorMentions from "./editor-mentions";
import { MentionElement } from "./type";

/**
 * Define a React component renderer for our custom text.
 */
interface ChatEditorProps {
  initialValueString: string;
  onChange: (value: string) => void;
  onEnterSubmit?: (editor: Editor) => void;
  onEscape?: (editor: Editor) => void;
}

/**
 * ChatEditor
 * @param props props
 */
const ChatEditor = (props: ChatEditorProps) => {
  const { initialValueString, onChange, onEnterSubmit, onEscape } = props;

  const useChat = useChatContext();

  const [target, setTarget] = React.useState<Range | undefined>();
  const [index, setIndex] = React.useState(0);
  const [search, setSearch] = React.useState("");

  const chatUsers = useChat.users || [];

  const filteredUsers = chatUsers
    .filter((c) => c.nick.toLowerCase().startsWith(search.toLowerCase()))
    .slice(0, 10);

  const initialValue: Descendant[] = React.useMemo(
    () =>
      deserialize(initialValueString) || [
        {
          type: "paragraph",
          children: [{ text: "A line of text in a paragraph." }],
        },
      ],
    [initialValueString]
  );

  const [editor] = React.useState(() =>
    withMentions(withReact(withHistory(createEditor())))
  );

  return (
    <Slate
      editor={editor}
      initialValue={initialValue}
      onChange={(value) => {
        const { selection } = editor;

        if (selection && Range.isCollapsed(selection)) {
          const [start] = Range.edges(selection);
          const wordBefore = Editor.before(editor, start, { unit: "word" });
          const before = wordBefore && Editor.before(editor, wordBefore);
          const beforeRange = before && Editor.range(editor, before, start);
          const beforeText = beforeRange && Editor.string(editor, beforeRange);
          const beforeMatch = beforeText && beforeText.match(/^@(\w+)$/);
          const after = Editor.after(editor, start);
          const afterRange = Editor.range(editor, start, after);
          const afterText = Editor.string(editor, afterRange);
          const afterMatch = afterText.match(/^(\s|$)/);

          if (beforeMatch && afterMatch) {
            unstable_batchedUpdates(() => {
              setTarget(beforeRange);
              setSearch(beforeMatch[1]);
              setIndex(0);
              return;
            });
          } else {
            setTarget(null);
            onChange(serialize(value));
          }
        } else {
          setTarget(null);
          onChange(serialize(value));
        }
      }}
    >
      <EditorHoveringToolbar />
      <EditorMentions
        target={target}
        mentions={filteredUsers.map((u) => ({
          id: u.id,
          mentionString: u.nick,
        }))}
        selectedMention={
          filteredUsers[index] && {
            id: filteredUsers[index].id,
            mentionString: filteredUsers[index].nick,
          }
        }
        onClickMention={(mentionsString) => {
          CustomEditor.insertMention(editor, target, mentionsString);
          setTarget(null);
        }}
      />
      <Editable
        rows={4}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey && onEnterSubmit) {
            e.preventDefault();
            onEnterSubmit(editor);
            return;
          }

          if (e.key === "Escape" && onEscape) {
            e.preventDefault();
            onEscape(editor);
            return;
          }

          if (!e.ctrlKey) {
            return;
          }

          switch (e.key) {
            case "`": {
              e.preventDefault();
              CustomEditor.toggleCodeBlock(editor);
              break;
            }
            case "b": {
              e.preventDefault();
              CustomEditor.toggleBoldMark(editor);
              break;
            }
            case "i": {
              e.preventDefault();
              CustomEditor.toggleItalicMark(editor);
              break;
            }
            case "s": {
              e.preventDefault();
              CustomEditor.toggleStrikeThroughMark(editor);
              break;
            }
            case "ArrowDown": {
              e.preventDefault();
              const prevIndex =
                index >= filteredUsers.length - 1 ? 0 : index + 1;
              setIndex(prevIndex);
              break;
            }
            case "ArrowUp": {
              e.preventDefault();
              const nextIndex =
                index <= 0 ? filteredUsers.length - 1 : index - 1;
              setIndex(nextIndex);
              break;
            }
            case "Tab":
            case "Enter":
              e.preventDefault();
              CustomEditor.insertMention(
                editor,
                target,
                filteredUsers[index].nick
              );
              setTarget(null);
              break;
            case "Escape":
              e.preventDefault();
              setTarget(null);
              break;

            default: {
              break;
            }
          }
        }}
        style={{
          padding: "5px 10px",
          height: "100%",
          maxHeight: "200px",
          overflowY: "auto",
          width: "100%",
        }}
      />
    </Slate>
  );
};

/**
 * Render an element.
 * @param props props
 * @returns JSX.Element
 */
const renderElement = (props: RenderElementProps) => {
  switch (props.element.type) {
    case "code":
      return <CodeElement {...props} />;
    case "quote":
      return <QuoteElement {...props} />;
    case "mention":
      return <MentionElement {...props} />;
    default:
      return <DefaultElement {...props} />;
  }
};

/**
 * renderLeaf
 * @param props props
 * @returns JSX.Element
 */
const renderLeaf = (props: RenderLeafProps) => <Leaf {...props} />;

/**
 * CodeElement
 * @param props props
 * @returns JSX.Element
 */
const CodeElement = (props: RenderElementProps) => (
  <pre {...props.attributes}>{props.children}</pre>
);

/**
 * QuoteElement
 * @param props props
 * @returns JSX:Element
 */
const QuoteElement = (props: RenderElementProps) => (
  <blockquote {...props.attributes}>{props.children}</blockquote>
);

/**
 * DefaultElement
 * @param props props
 * @returns JSX.Element
 */
const DefaultElement = (props: RenderElementProps) => (
  <p {...props.attributes}>{props.children}</p>
);

/**
 * Leaf
 * @param props props
 * @returns JSX.Element
 */
const Leaf = (props: RenderLeafProps) => (
  <span
    {...props.attributes}
    style={{
      fontWeight: props.leaf.bold ? "bold" : "normal",
      fontStyle: props.leaf.italic ? "italic" : "normal",
      textDecoration: props.leaf.strikeThrough ? "line-through" : "none",
    }}
  >
    {props.children}
  </span>
);

/**
 * MentionElement
 * @param props props
 * @returns JSX.Element
 */
const MentionElement = (props: RenderElementProps) => {
  // Have to cast to MentionElement because the type is not recognized
  // although type is checked againts discrimination value
  const element = props.element as MentionElement;

  const selected = useSelected();
  const focused = useFocused();
  const style: React.CSSProperties = {
    padding: "3px 3px 2px",
    margin: "0 1px",
    verticalAlign: "baseline",
    display: "inline-block",
    borderRadius: "4px",
    backgroundColor: "#eee",
    fontSize: "0.9em",
    boxShadow: selected && focused ? "0 0 0 2px #B4D5FF" : "none",
  };
  // See if our empty text child has any styling marks applied and apply those
  if (props.element.children[0].bold) {
    style.fontWeight = "bold";
  }
  if (props.element.children[0].italic) {
    style.fontStyle = "italic";
  }
  return (
    <span
      {...props.attributes}
      contentEditable={false}
      data-cy={`mention-${element.character.replace(" ", "-")}`}
      style={style}
    >
      @{element.character}
      {props.children}
    </span>
  );
};

export default ChatEditor;
