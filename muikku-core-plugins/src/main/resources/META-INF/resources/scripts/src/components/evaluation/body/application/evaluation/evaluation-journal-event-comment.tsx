import * as React from "react";
import * as moment from "moment";
import "~/sass/elements/rich-text.scss";
import CkeditorContentLoader from "../../../../base/ckeditor-loader/content";
import { JournalComment, JournalCommentDelete } from "~/@types/journal";
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

/**
 * EvaluationEventContentCardProps
 */
interface EvaluationDiaryEventCommentProps {
  journalComment: JournalComment;
  userEntityId: number;
  workspaceEntityId: number;
  displayNotification: DisplayNotificationTriggerType;
  isSaving: boolean;
  status: StatusType;
  canDelete: boolean;
  onEditClick: (comment: JournalComment) => void;
  onDelete: (
    deleteComment: JournalCommentDelete,
    onSuccess?: () => void,
    onFail?: () => void
  ) => Promise<void>;
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
  const { journalComment, status, onDelete, onEditClick, canDelete } = props;

  const { comment, created, id, firstName, lastName, authorId } =
    journalComment;

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
  const creatorName = creatorIsMe ? `Minä` : `${firstName} ${lastName}`;
  const formatedDate = `${moment(created).format("l")} - ${moment(
    created
  ).format("LT")}`;

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
          <Link className="link" onClick={handleEditCommentClick}>
            LOCALE: plugin.evaluation.evaluationModal.journalComments.editButton
          </Link>

          {canDelete && creatorIsMe && (
            <DeleteJournalComment
              journalComment={journalComment}
              onDelete={onDelete}
            >
              <Link className="link">
                LOCALE:
                plugin.evaluation.evaluationModal.journalComments.deleteButton
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
