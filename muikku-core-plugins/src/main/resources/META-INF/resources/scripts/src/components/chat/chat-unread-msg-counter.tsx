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
function ChatUnreadMsgCounter(props: ChatUnreadMsgCounterProps) {
  const { number, modifiers } = props;

  if (number === 0) return null;

  const classModifiers = (modifiers || [])
    .map((modifier) => `chat__unread-msg-counter--${modifier}`)
    .join(" ");

  const showedNumber =
    number >= 9 ? (
      <>
        <span className="chat__unread-msg-counter-number">9</span>
        <span className="chat__unread-msg-counter-plus">+</span>
      </>
    ) : (
      number
    );

  return (
    <span className={`chat__unread-msg-counter ${classModifiers}`}>
      {showedNumber}
    </span>
  );
}

export default ChatUnreadMsgCounter;
