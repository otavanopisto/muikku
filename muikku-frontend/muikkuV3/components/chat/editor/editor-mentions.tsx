import * as React from "react";
import { Range } from "slate";

/**
 * Mentions
 */
interface Mention {
  id: number;
  mentionString: string;
}

/**
 * ChatEditorMentionsProps
 */
interface EditorMentionsProps {
  target: Range;
  mentions: Mention[];
  selectedMention?: Mention;
  onClickMention: (mentionsString: string) => void;
}

/**
 * ChatEditorMentions
 * @param props props
 * @returns JSX.Element
 */
function EditorMentions(props: EditorMentionsProps) {
  if (!props.target || props.mentions.length <= 0 || !props.selectedMention) {
    return null;
  }

  return (
    <div
      style={{
        position: "absolute",
        zIndex: 3,
        padding: "3px",
        background: "white",
        borderRadius: "4px",
        boxShadow: "0 1px 5px rgba(0,0,0,.2)",
        bottom: "40px",
        left: "0",
        right: "0",
      }}
      data-cy="mentions-portal"
    >
      {props.mentions.map((m, i) => (
        <div
          key={i}
          onClick={() => props.onClickMention(m.mentionString)}
          style={{
            padding: "1px 3px",
            borderRadius: "3px",
            background:
              m.id === props.selectedMention.id ? "#B4D5FF" : "transparent",
          }}
        >
          {m.mentionString}
        </div>
      ))}
    </div>
  );
}

export default EditorMentions;
