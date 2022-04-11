import * as React from "react";

export interface ContactEvent {
  date: string;
  type: string;
  creator: string;
  content: string;
}

interface ContactEventProps {
  event: ContactEvent;
}

const ContactEvent: React.FC<ContactEventProps> = (props) => {
  const { date, type, creator, content } = props.event;

  return (
    <div>
      <div>
        <div>{date}</div>
        <div>{type}</div>
        <div>{creator}</div>
      </div>
      <div>{content}</div>
    </div>
  );
};

export default ContactEvent;
