// Define a serializing function that takes a value and returns a string.
// Import the `Node` helper interface from Slate.
import {
  Descendant,
  Editor,
  Element,
  Node,
  Range,
  Text,
  Transforms,
} from "slate";
import { MentionElement } from "./type";

/**
 * Define a serializing function that takes a value and returns a string
 * @param value value
 * @returns serialized string
 */
export const serialize = (value: Descendant[]) =>
  value
    // Return the string content of each paragraph in the value's children.
    .map((n) => Node.string(n))
    // Join them all with line breaks denoting paragraphs.
    .join("\n");

/**
 * Define a deserializing function that takes a string and returns a value.
 * @param string serialized string
 * @returns deserialized value
 */
export const deserialize = (string: string) =>
  // Return a value array of children derived by splitting the string.
  string.split("\n").map(
    (line) =>
      ({
        children: [{ text: line }],
      }) as Descendant
  );

/**
 * withMentions
 * @param editor editor
 * @returns editor with mentions
 */
export const withMentions = (editor: Editor) => {
  const { isInline, isVoid, markableVoid } = editor;

  // eslint-disable-next-line jsdoc/require-jsdoc
  editor.isInline = (element) =>
    element.type === "mention" ? true : isInline(element);
  // eslint-disable-next-line jsdoc/require-jsdoc
  editor.isVoid = (element) =>
    element.type === "mention" ? true : isVoid(element);
  // eslint-disable-next-line jsdoc/require-jsdoc
  editor.markableVoid = (element) =>
    element.type === "mention" || markableVoid(element);

  return editor;
};

/**
 * Helper to check if a key is a hotkey.
 */
export const CustomEditor = {
  /**
   * isBoldMarkActive
   * @param editor editor
   * @returns boolean
   */
  isBoldMarkActive(editor: Editor) {
    const [match] = Editor.nodes(editor, {
      // eslint-disable-next-line jsdoc/require-jsdoc
      match: (n) => Text.isText(n) && n.bold === true,
      universal: true,
    });
    return !!match;
  },
  /**
   * isItalicMarkActive
   * @param editor editor
   * @returns boolean
   */
  isItalicMarkActive(editor: Editor) {
    const [match] = Editor.nodes(editor, {
      // eslint-disable-next-line jsdoc/require-jsdoc
      match: (n) => Text.isText(n) && n.italic === true,
      universal: true,
    });
    return !!match;
  },
  /**
   * isStrikeThroughMarkActive
   * @param editor editor
   * @returns boolean
   */
  isStrikeThroughMarkActive(editor: Editor) {
    const [match] = Editor.nodes(editor, {
      // eslint-disable-next-line jsdoc/require-jsdoc
      match: (n) => Text.isText(n) && n.strikeThrough === true,
      universal: true,
    });
    return !!match;
  },
  /**
   * isQuoteBlockActive
   * @param editor editor
   * @returns boolean
   */
  isQuoteBlockActive(editor: Editor) {
    const [match] = Editor.nodes(editor, {
      // eslint-disable-next-line jsdoc/require-jsdoc
      match: (n) => Element.isElement(n) && n.type === "quote",
    });
    return !!match;
  },
  /**
   * isCodeBlockActive
   * @param editor editor
   * @returns boolean
   */
  isCodeBlockActive(editor: Editor) {
    const [match] = Editor.nodes(editor, {
      // eslint-disable-next-line jsdoc/require-jsdoc
      match: (n) => Element.isElement(n) && n.type === "code",
    });
    return !!match;
  },
  /**
   * toggleBoldMark
   * @param editor editor
   */
  toggleBoldMark(editor: Editor) {
    const isActive = CustomEditor.isBoldMarkActive(editor);
    Transforms.setNodes(
      editor,
      { bold: isActive ? null : true },
      // eslint-disable-next-line jsdoc/require-jsdoc
      { match: (n) => Text.isText(n), split: true }
    );
  },
  /**
   * toggleItalicMark
   * @param editor editor
   */
  toggleItalicMark(editor: Editor) {
    const isActive = CustomEditor.isItalicMarkActive(editor);
    Transforms.setNodes(
      editor,
      { italic: isActive ? null : true },
      // eslint-disable-next-line jsdoc/require-jsdoc
      { match: (n) => Text.isText(n), split: true }
    );
  },

  /**
   * toggleStrikeThroughMark
   * @param editor editor
   */
  toggleStrikeThroughMark(editor: Editor) {
    const isActive = CustomEditor.isStrikeThroughMarkActive(editor);
    Transforms.setNodes(
      editor,
      { strikeThrough: isActive ? null : true },
      // eslint-disable-next-line jsdoc/require-jsdoc
      { match: (n) => Text.isText(n), split: true }
    );
  },

  /**
   * toggleCodeBlock
   * @param editor editor
   */
  toggleCodeBlock(editor: Editor) {
    const isActive = CustomEditor.isCodeBlockActive(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? "paragraph" : "code" },
      {
        // eslint-disable-next-line jsdoc/require-jsdoc
        match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
      }
    );
  },

  /**
   * toggleQuoteBlock
   * @param editor editor
   */
  toggleQuoteBlock(editor: Editor) {
    const isActive = CustomEditor.isQuoteBlockActive(editor);
    Transforms.setNodes(
      editor,
      { type: isActive ? "paragraph" : "quote" },
      {
        // eslint-disable-next-line jsdoc/require-jsdoc
        match: (n) => Element.isElement(n) && Editor.isBlock(editor, n),
      }
    );
  },

  /**
   * insertMention
   * @param editor editor
   * @param target target
   * @param character character
   */
  insertMention(editor: Editor, target: Range, character: string) {
    const mention: MentionElement = {
      type: "mention",
      character,
      children: [{ text: "" }],
    };
    Transforms.select(editor, target);
    Transforms.insertNodes(editor, mention);
    Transforms.move(editor);
  },

  /**
   * reset
   * @param editor editor
   */
  reset(editor: Editor) {
    // loop delete all
    editor.children.map((item) => {
      Transforms.delete(editor, { at: [0] });
    });

    // reset init
    editor.children = [
      {
        type: "paragraph",
        children: [{ text: "" }],
      },
    ];
  },
};
