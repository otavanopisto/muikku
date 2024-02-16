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
    (modifier) => `chat__unread-msg-counter--${modifier}`
  );

  const showedNumber = number >= 9 ? "9+" : number;

  return (
    <span className={`chat__unread-msg-counter ${classModifiers}`}>
      {showedNumber}
    </span>
  );
};
