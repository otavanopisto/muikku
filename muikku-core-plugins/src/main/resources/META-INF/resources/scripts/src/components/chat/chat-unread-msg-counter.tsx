import * as React from "react";

/**
 * ChatUnreadMsgCounterProps
 */
interface ChatUnreadMsgCounterProps {
  number: number;
  modifiers?: string[];
}

/**
 * ChatUnreadMsgCounter
 * @param props props
 */
export const ChatUnreadMsgCounter = (props: ChatUnreadMsgCounterProps) => {
  const { number, modifiers } = props;

  if (number === 0) return null;

  const classModifiers = (modifiers || []).map(
    (modifier) => `chat-unread-msg-counter--${modifier}`
  );

  const showedNumber = number >= 9 ? "9+" : number;

  return (
    <span
      className={`chat-unread-msg-counter ${classModifiers}`}
      style={{
        backgroundColor: "red",
        color: "white",
        borderRadius: "50%",
        padding: "2.5px",
        display: "flex",
        width: "20px",
        height: "20px",
        justifyContent: "center",
        alignItems: "center",
        fontSize: "0.70rem",
      }}
    >
      {showedNumber}
    </span>
  );
};
