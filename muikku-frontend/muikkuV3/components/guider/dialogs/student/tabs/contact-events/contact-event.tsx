import * as React from "react";
import "~/sass/elements/contact-event.scss";
import "~/sass/elements/rich-text.scss";
import CommentContactEvent from "./editors/new-comment";
import EditContactEvent from "./editors/edit-event";
import EditContactEventComment from "./editors/edit-comment";
import ContactEventDeletePrompt from "./editors/delete-prompt";
import Avatar from "~/components/general/avatar";
import { connect } from "react-redux";
import { StateType } from "~/reducers";
import { StatusType } from "~/reducers/base/status";
import Link from "~/components/general/link";
import { ContactLogEvent } from "~/generated/client";
import { useTranslation } from "react-i18next";
import { localize } from "~/locales/i18n";

/**
 * ContactEventProps
 */
interface ContactEventProps {
  event: ContactLogEvent;
  allPrivileges: boolean;
  studentId: number;
  modifier?: string;
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
  const { modifier, studentId, allPrivileges, status } = props;
  const [commentOpen, setCreateCommentOpen] = React.useState<boolean>(false);
  const [eventEditOpen, setEventEditOpen] = React.useState<boolean>(false);
  const [commentEditOpen, setCommentEditOpen] = React.useState<number[]>([]);
  const { date } = localize;
  const { t } = useTranslation(["messaging", "common"]);
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
          name={creatorName}
        ></Avatar>{" "}
        <div className="contact-event__title">
          <div className="contact-event__creator">{creatorName}</div>
          <div className={`contact-event__type type-${type}`}>
            {t("labels.type", { context: type })}
          </div>
          <div className="contact-event__date">
            {date(entryDate, "dddd, MMMM Do YYYY")}
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
          {t("actions.create", { context: "comment" })}
        </Link>
        <Link
          className="link link--contact-event-footer"
          onClick={() => setEventEditOpen(true)}
        >
          {t("actions.edit")}
        </Link>
        <ContactEventDeletePrompt
          studentUserEntityId={studentId}
          contactLogEntryId={id}
        >
          <Link className="link link--contact-event-footer">
            {t("actions.remove")}
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
                  name={comment.creatorName}
                ></Avatar>
                <div className="contact-event__title">
                  <div className="contact-event__creator">
                    {comment.creatorName}
                  </div>
                  <div className="contact-event__date">
                    {date(comment.commentDate, "dddd, MMMM Do YYYY")}
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
              {allPrivileges || comment.creatorId === status.userId ? (
                <div className="contact-event__footer">
                  <Link
                    className="link link--contact-event-footer"
                    onClick={() =>
                      setCommentEditOpen([...commentEditOpen, ...[comment.id]])
                    }
                  >
                    {t("actions.edit")}
                  </Link>
                  <ContactEventDeletePrompt
                    studentUserEntityId={studentId}
                    contactLogEntryId={id}
                    commentId={comment.id}
                  >
                    <Link className="link link--contact-event-footer">
                      {t("actions.remove")}
                    </Link>
                  </ContactEventDeletePrompt>
                </div>
              ) : null}
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
    status: state.status,
  };
}

export default connect(mapStateToProps)(ContactEvent);
