import * as React from "react";

export type contactEventReply = {
  date: string;
  creator: string;
  content: string;
};
export interface ContactEvent {
  date: string;
  type: string;
  creator: string;
  content: string;
  replies?: contactEventReply[];
}
interface ContactEventProps {
  event: ContactEvent;
  modifier: string;
}

const ContactEvent: React.FC<ContactEventProps> = (props) => {
  const { date, type, creator, content, replies } = props.event;
  const modifier = props.modifier;

  return (
    <div className="contact-event">
      <div className="contact-event__header">
        <div className="contact-event__date">{date}</div>
        <div className="contact-event__type">{type}</div>
        <div className="contact-event__creator">{creator}</div>
      </div>
      <div className="contact-event__body">{content}</div>
      {replies
        ? replies.map((reply) => (
            <div className="contact-event__reply">
              <div className="contact-event__header contact-event__header--reply">
                <div className="contact-event__date">{reply.date}</div>
                <div className="contact-event__creator">{reply.creator}</div>
              </div>
              <div className="contact-event__body contact-event__body--reply">
                {reply.content}
              </div>
            </div>
          ))
        : null}
    </div>
  );
};

export default ContactEvent;
