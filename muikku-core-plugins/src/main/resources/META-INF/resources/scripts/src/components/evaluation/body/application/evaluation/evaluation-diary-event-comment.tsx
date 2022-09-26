import * as React from "react";
import * as moment from "moment";
import "~/sass/elements/rich-text.scss";
import CkeditorContentLoader from "../../../../base/ckeditor-loader/content";
import { DiaryComment, DiaryCommentDelete } from "./hooks/useDiaryComments";
import { StateType } from "~/reducers";
import { Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { connect } from "react-redux";
import { StatusType } from "~/reducers/base/status";

/**
 * EvaluationEventContentCardProps
 */
interface EvaluationDiaryEventCommentProps {
  diaryComment: DiaryComment;
  userEntityId: number;
  workspaceEntityId: number;
  displayNotification: DisplayNotificationTriggerType;
  isSaving: boolean;
  status: StatusType;
  canDelete: boolean;
  onEditClick: (comment: DiaryComment) => void;
  onDelete: (
    deleteComment: DiaryCommentDelete,
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
const EvaluationDiaryEventComment: React.FC<
  EvaluationDiaryEventCommentProps
> = (props) => {
  const { diaryComment, status, onDelete, onEditClick, canDelete } = props;

  const {
    comment,
    created,
    id,
    firstName,
    lastName,
    journalEntryId,
    authorId,
  } = diaryComment;

  const myRef = React.useRef<HTMLDivElement>(null);

  /**
   * handleDeleteCommentClick
   */
  const handleDeleteCommentClick = () => {
    onDelete && onDelete({ id: id, journalEntryId: journalEntryId });
  };

  /**
   * handleEditCommentClick
   */
  const handleEditCommentClick = () => {
    onEditClick(diaryComment);
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
  const creatorName = creatorIsMe ? `- Minä` : `- ${firstName} ${lastName}`;
  const formatedDate = `${moment(created).format("l")} - ${moment(
    created
  ).format("LT")}`;

  return (
    <div
      ref={myRef}
      key={id}
      style={{
        marginBottom: "10px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#daf3fe",
          padding: "5px 0",
          borderRadius: "10px 0px",
        }}
      >
        <div style={{ padding: "5px" }}>
          <CkeditorContentLoader html={comment} />
        </div>

        <div
          style={{
            display: "flex",
            padding: "0 5px",
            fontSize: "0.8rem",
          }}
        >
          <a onClick={handleEditCommentClick} style={{ marginRight: "5px" }}>
            Muokkaa
          </a>
          {canDelete && (
            <a
              onClick={handleDeleteCommentClick}
              style={{ marginRight: "5px" }}
            >
              Poista
            </a>
          )}
        </div>
      </div>

      {creatorIsMe && (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>{creatorName}</span>
          <span>{formatedDate}</span>
        </div>
      )}
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
)(EvaluationDiaryEventComment);
