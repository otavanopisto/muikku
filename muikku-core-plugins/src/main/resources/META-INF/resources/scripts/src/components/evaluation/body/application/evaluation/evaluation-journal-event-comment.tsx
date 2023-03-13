import * as React from "react";
import "~/sass/elements/rich-text.scss";
import CkeditorContentLoader from "../../../../base/ckeditor-loader/content";
import { JournalComment } from "~/@types/journal";
import { StateType } from "~/reducers";
import { Dispatch } from "redux";
import Link from "~/components/general/link";
import { AnyActionType } from "~/actions";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { connect } from "react-redux";
import { StatusType } from "~/reducers/base/status";
import DeleteJournalComment from "~/components/evaluation/dialogs/delete-journal-comment";
import { useTranslation } from "react-i18next";
import { i18nType } from "~/reducers/base/i18nOLD";

/**
 * EvaluationEventContentCardProps
 */
interface EvaluationDiaryEventCommentProps {
  i18nOLD: i18nType;
  journalComment: JournalComment;
  userEntityId: number;
  workspaceEntityId: number;
  displayNotification: DisplayNotificationTriggerType;
  status: StatusType;
  canDelete: boolean;
  onEditClick: (comment: JournalComment) => void;
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
    i18nOLD,
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
  const formatedDate = `${i18nOLD.time.format(
    created,
    "l"
  )} - ${i18nOLD.time.format(created, "LT")}`;

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
        {creatorName} - {formatedDate}
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
    i18nOLD: state.i18nOLD,
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return { displayNotification };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EvaluationJournalEventComment);
