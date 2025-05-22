import * as React from "react";
import "~/sass/elements/rich-text.scss";
import CkeditorContentLoader from "../../../../base/ckeditor-loader/content";
import { StateType } from "~/reducers";
import Link from "~/components/general/link";
import { AnyActionType } from "~/actions";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { connect } from "react-redux";
import { Action, Dispatch } from "redux";
import { StatusType } from "~/reducers/base/status";
import DeleteJournalComment from "~/components/evaluation/dialogs/delete-journal-comment";
import { WorkspaceJournalComment } from "~/generated/client";
import { useTranslation } from "react-i18next";
import { localize } from "~/locales/i18n";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * EvaluationEventContentCardProps
 */
interface EvaluationDiaryEventCommentProps {
  journalComment: WorkspaceJournalComment;
  userEntityId: number;
  workspaceEntityId: number;
  displayNotification: DisplayNotificationTriggerType;
  status: StatusType;
  canDelete: boolean;
  onEditClick: (comment: WorkspaceJournalComment) => void;
}

/**
 * Creates evaluation diary event component
 *
 * @param props props
 * @returns JSX.Element
 */
const EvaluationJournalEventComment: React.FC<
  EvaluationDiaryEventCommentProps
> = (props) => {
  const {
    journalComment,
    status,
    onEditClick,
    canDelete,
    userEntityId,
    workspaceEntityId,
  } = props;

  const { comment, created, id, firstName, lastName, authorId } =
    journalComment;

  const { t } = useTranslation();

  const myRef = React.useRef<HTMLDivElement>(null);

  /**
   * handleEditCommentClick
   */
  const handleEditCommentClick = () => {
    onEditClick(journalComment);
    handleExecuteScrollToElement();
  };

  /**
   * handleExecuteScrollToElement
   */
  const handleExecuteScrollToElement = () => {
    window.dispatchEvent(new Event("resize"));

    myRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const creatorIsMe = status.userId === authorId;
  const creatorName = creatorIsMe
    ? t("labels.self")
    : `${firstName} ${lastName}`;
  const formatedDate = `${localize.date(created)} - ${localize.date(
    created,
    "LT"
  )}`;

  return (
    <div
      ref={myRef}
      key={id}
      className="evaluation-modal__item evaluation-modal__item--journal-comment"
    >
      <div className="evaluation-modal__item-body evaluation-modal__item-body--journal-comment rich-text">
        <CkeditorContentLoader html={comment} />
      </div>
      {creatorIsMe && (
        <div className="evaluation-modal__item-actions evaluation-modal__item-actions--journal-comment">
          <Link
            className="link link--evaluation"
            onClick={handleEditCommentClick}
          >
            {t("actions.edit")}
          </Link>

          {canDelete && creatorIsMe && (
            <DeleteJournalComment
              journalComment={journalComment}
              userEntityId={userEntityId}
              workspaceEntityId={workspaceEntityId}
            >
              <Link className="link link--evaluation link--evaluation-delete">
                {t("actions.remove")}
              </Link>
            </DeleteJournalComment>
          )}
        </div>
      )}

      <div className="evaluation-modal__item-footer evaluation-modal__item-footer--journal-comment">
        <div className="evaluation-modal__item-meta">
          <div className="evaluation-modal__item-meta-item">
            <span className="evaluation-modal__item-meta-item-label">
              {creatorName}
            </span>
            <span className="evaluation-modal__item-meta-item-data">
              {formatedDate}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return { displayNotification };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EvaluationJournalEventComment);
