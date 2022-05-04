import * as React from "react";
import "~/sass/elements/contact-event.scss";
import "~/sass/elements/rich-text.scss";
import { i18nType } from "~/reducers/base/i18n";
import { IContactEvent } from "~/reducers/main-function/guider";
import CommentContactEvent from "../../../comment-contact-event";
import EditContactEvent from "../../../edit-contact-event";
import EditContactEventComment from "../../../edit-contact-event-comment";
import * as moment from "moment";


/**
 *
 */
interface ContactEventProps {
  event: IContactEvent;
  studentId: number;
  modifier?: string;
  i18n: i18nType;
}

/**
 *
 * @param props
 * @returns
 */
const ContactEvent: React.FC<ContactEventProps> = (props) => {
  const { entryDate, type, creatorName, text, comments, id } = props.event;
  const { modifier, studentId, i18n } = props;
  const [commentOpen, setCreateCommentOpen] = React.useState<boolean>(false);
  const [eventEditOpen, setEventEditOpen] = React.useState<boolean>(false);
  const [commentEditOpen, setCommentEditOpen] = React.useState<number>(null);

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
          <span onClick={() => setCreateCommentOpen(true)}>Kommentoi</span>
          <span onClick={() => setEventEditOpen(true)}>Muokkaa</span>
          <span>Poista</span>
        </div>
      </div>
      {eventEditOpen ? (
        <div className="contact-event__body">
          <EditContactEvent
            contactEvent={props.event}
            studentUserEntityId={studentId}
            onClickCancel={() => setEventEditOpen(false)}
          ></EditContactEvent>
        </div>
      ) : (
        <div
          className="contact-event__body"
          dangerouslySetInnerHTML={{ __html: text }}
        ></div>
      )}
      {commentOpen ? (
        <CommentContactEvent
          contactEventtId={id}
          studentUserEntityId={studentId}
          onClickCancel={() => setCreateCommentOpen(false)}
        ></CommentContactEvent>
      ) : null}
      {comments ? (
        <div className="contact-event__replies">
          {comments.map((comment) => (
            <div key={comment.id} className="contact-event__reply">
              <div className="contact-event__header contact-event__header--reply">
                <div className="contact-event__title">
                  <div className="contact-event__creator">
                    {comment.creatorName}
                  </div>
                  <div className="contact-event__date">
                    {moment(comment.commentDate).format("dddd, MMMM Do YYYY")}
                  </div>
                </div>
                <div className="contact-event__header-actions">
                  <span onClick={() => setCommentEditOpen(comment.id)}>Muokkaa</span>
                  <span>Poista</span>
                </div>
              </div>
              {commentEditOpen === comment.id ? (
                <div className="contact-event__body contact-event__body--reply">
                  <EditContactEventComment
                    comment={comment}
                    studentUserEntityId={studentId}
                    onClickCancel={() => setCommentEditOpen(null)}
                  />
                </div>
              ) : (
                <div
                  className="contact-event__body contact-event__body--reply"
                  dangerouslySetInnerHTML={{ __html: comment.text }}
                ></div>
              )}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default ContactEvent;

