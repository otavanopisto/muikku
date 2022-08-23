import * as React from "react";
import "~/sass/elements/contact-event.scss";
import "~/sass/elements/rich-text.scss";
import { i18nType } from "~/reducers/base/i18n";
import { ContactLogEvent } from "~/reducers/main-function/guider";
import CommentContactEvent from "./editors/new-comment";
import EditContactEvent from "./editors/edit-event";
import EditContactEventComment from "./editors/edit-comment";
import ContactEventDeletePrompt from "./editors/delete-prompt";
import * as moment from "moment";
import Avatar from "~/components/general/avatar";
import { connect } from "react-redux";
import { StateType } from "~/reducers";
import { StatusType } from "~/reducers/base/status";
import Link from "~/components/general/link";

/**
 * ContactEventProps
 */
interface ContactEventProps {
  event: ContactLogEvent;
  studentId: number;
  modifier?: string;
  i18n: i18nType;
  status: StatusType;
}

/**
 * ContactEvent
 * @param props ContactEventProps
 * @returns JSX.Element
 */
const ContactEvent: React.FC<ContactEventProps> = (props) => {
  const {
    entryDate,
    type,
    creatorName,
    text,
    comments,
    hasImage,
    creatorId,
    id,
  } = props.event;
  const { modifier, studentId, i18n } = props;
  const [commentOpen, setCreateCommentOpen] = React.useState<boolean>(false);
  const [eventEditOpen, setEventEditOpen] = React.useState<boolean>(false);
  const [commentEditOpen, setCommentEditOpen] = React.useState<number[]>([]);

  return (
    <div
      className={`contact-event ${
        modifier ? "contact-event--" + modifier : ""
      }`}
    >
      <div className="contact-event__header">
        <Avatar
          id={creatorId}
          hasImage={hasImage}
          size="small"
          firstName={creatorName}
        ></Avatar>{" "}
        <div className="contact-event__title">
          <div className="contact-event__creator">{creatorName}</div>
          <div className={`contact-event__type type-${type}`}>
            {i18n.text.get("plugin.guider.contact.type." + type)}
          </div>
          <div className="contact-event__date">
            {moment(entryDate).format("dddd, MMMM Do YYYY")}
          </div>
        </div>
      </div>

      {eventEditOpen ? (
        <div className="contact-event__body">
          <EditContactEvent
            contactEvent={props.event}
            studentUserEntityId={studentId}
            closeEditor={() => setEventEditOpen(false)}
          ></EditContactEvent>
        </div>
      ) : (
        <div
          className="contact-event__body rich-text rich-text--contact-event"
          dangerouslySetInnerHTML={{ __html: text }}
        ></div>
      )}
      <div className="contact-event__footer">
        <Link
          className="link link--contact-event-footer"
          onClick={() => setCreateCommentOpen(true)}
        >
          {i18n.text.get("plugin.guider.user.contactLog.actions.comment")}
        </Link>
        <Link
          className="link link--contact-event-footer"
          onClick={() => setEventEditOpen(true)}
        >
          {i18n.text.get("plugin.guider.user.contactLog.actions.edit")}
        </Link>
        <ContactEventDeletePrompt
          studentUserEntityId={studentId}
          contactLogEntryId={id}
        >
          <Link className="link link--contact-event-footer">
            {i18n.text.get("plugin.guider.user.contactLog.actions.delete")}
          </Link>
        </ContactEventDeletePrompt>
      </div>
      {commentOpen ? (
        <CommentContactEvent
          contactEventtId={id}
          studentUserEntityId={studentId}
          closeEditor={() => setCreateCommentOpen(false)}
        ></CommentContactEvent>
      ) : null}

      {comments ? (
        <div className="contact-event__replies">
          {comments.map((comment) => (
            <div key={"comment-" + comment.id} className="contact-event__reply">
              <div className="contact-event__header contact-event__header--reply">
                <Avatar
                  id={comment.creatorId}
                  hasImage={comment.hasImage}
                  size="small"
                  firstName={comment.creatorName}
                ></Avatar>
                <div className="contact-event__title">
                  <div className="contact-event__creator">
                    {comment.creatorName}
                  </div>
                  <div className="contact-event__date">
                    {moment(comment.commentDate).format("dddd, MMMM Do YYYY")}
                  </div>
                </div>
              </div>
              {commentEditOpen.includes(comment.id) ? (
                <div className="contact-event__body contact-event__body--reply">
                  <EditContactEventComment
                    comment={comment}
                    studentUserEntityId={studentId}
                    closeEditor={() =>
                      setCommentEditOpen(
                        commentEditOpen.filter(
                          (editorOpenId) => editorOpenId !== comment.id
                        )
                      )
                    }
                  />
                </div>
              ) : (
                <div
                  className="contact-event__body contact-event__body--reply rich-text rich-text--contact-event"
                  dangerouslySetInnerHTML={{ __html: comment.text }}
                ></div>
              )}
              <div className="contact-event__footer">
                <Link
                  className="link link--contact-event-footer"
                  onClick={() =>
                    setCommentEditOpen([...commentEditOpen, ...[comment.id]])
                  }
                >
                  {i18n.text.get("plugin.guider.user.contactLog.actions.edit")}
                </Link>
                <ContactEventDeletePrompt
                  studentUserEntityId={studentId}
                  contactLogEntryId={id}
                  commentId={comment.id}
                >
                  <Link className="link link--contact-event-footer">
                    {i18n.text.get(
                      "plugin.guider.user.contactLog.actions.delete"
                    )}
                  </Link>
                </ContactEventDeletePrompt>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
};

/**
 * mapStateToProps
 * @param state state
 * @returns props from state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    status: state.status,
  };
}

export default connect(mapStateToProps)(ContactEvent);
