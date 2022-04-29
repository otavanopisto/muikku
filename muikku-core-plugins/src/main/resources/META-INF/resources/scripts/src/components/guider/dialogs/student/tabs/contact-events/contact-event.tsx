import * as React from "react";
import "~/sass/elements/contact-event.scss";
import "~/sass/elements/rich-text.scss";
import { i18nType } from "~/reducers/base/i18n";
import { IContactEvent } from "~/reducers/main-function/guider";
import * as moment from "moment";
interface ContactEventProps {
  event: IContactEvent;
  modifier?: string;
  i18n: i18nType;
}

const ContactEvent: React.FC<ContactEventProps> = (props) => {
  const { entryDate, type, creatorName, text, comments, id } = props.event;
  const modifier = props.modifier;
  const i18n = props.i18n;
  return (
    <div
      className={`contact-event ${
        modifier ? "contact-event--" + modifier : ""
      }`}
    >
      <div className="contact-event__header">
        <div className="contact-event__title">
          <div className="contact-event__creator">{creatorName}</div>
          <div className="contact-event__type">
            {i18n.text.get("plugin.guider.contact.type." + type)}
          </div>
          <div className="contact-event__date">
            {moment(entryDate).format("dddd, MMMM Do YYYY")}
          </div>
        </div>
        <div className="contact-event__header-actions">
          <span>Kommentoi</span>
          <span>Muokkaa</span>
          <span>Poista</span>
        </div>
      </div>
      <div
        className="contact-event__body"
        dangerouslySetInnerHTML={{ __html: text }}
      ></div>
      {comments ? (
        <div className="contact-event__replies">
          {comments.map((comment) => (
            <div key={comment.id} className="contact-event__reply">
              <div className="contact-event__header contact-event__header--reply">
                <div className="contact-event__date">{comment.commentDate}</div>
                <div className="contact-event__creator">
                  {comment.creatorName}
                </div>
              </div>
              <div
                className="contact-event__body contact-event__body--reply"
                dangerouslySetInnerHTML={{ __html: comment.text }}
              ></div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default ContactEvent;
