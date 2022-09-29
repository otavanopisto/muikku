import * as moment from "moment";
import * as React from "react";
import {
  DiaryComment,
  DiaryCommentCreate,
  DiaryCommentDelete,
  DiaryCommentUpdate,
} from "~/@types/journal";
import {
  DisplayNotificationTriggerType,
  displayNotification,
} from "~/actions/base/notifications";
import { useDiaryComments } from "~/components/evaluation/body/application/evaluation/hooks/useDiaryComments";
import { StateType } from "~/reducers";
import { i18nType } from "~/reducers/base/i18n";
import { StatusType } from "~/reducers/base/status";
import { WorkspaceType } from "~/reducers/workspaces";
import CkeditorContentLoader from "../../../../base/ckeditor-loader/content";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "~/actions";
import AnimateHeight from "react-animate-height";
import WorkspaceJournalCommentEditor from "./editors/workspace-journal-comment-editor";
import Button from "~/components/general/button";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import Avatar from "~/components/general/avatar";
import { IconButton } from "../../../../general/button";

/**
 * WorkspaceJournalCommentListProps
 */
interface WorkspaceJournalCommentListProps {
  i18n: i18nType;
  status: StatusType;
  currentWorkspace: WorkspaceType;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * WorkspaceJournalCommentList
 * @param props props
 */
export const WorkspaceJournalCommentList: React.FC<
  WorkspaceJournalCommentListProps
> = (props) => {
  const {
    diaryComments,
    loadDiaryComments,
    deleteComment,
    createComment,
    updateComment,
  } = useDiaryComments(
    props.currentWorkspace && props.currentWorkspace.id,
    props.currentWorkspace &&
      props.currentWorkspace.journals &&
      props.currentWorkspace.journals.currentJournal &&
      props.currentWorkspace.journals.currentJournal.id,
    props.displayNotification
  );

  const [showComments, setShowComments] = React.useState(false);
  const [createNewActive, setCreateNewActive] = React.useState(false);
  const [showEditor, setShowEditor] = React.useState(false);

  React.useEffect(() => {
    if (
      showComments &&
      !diaryComments.isLoading &&
      !diaryComments.diaryComments
    ) {
      loadDiaryComments();
    }
  }, [
    showComments,
    loadDiaryComments,
    diaryComments.isLoading,
    diaryComments.diaryComments,
  ]);

  /**
   * handleShowCommentsClick
   */
  const handleShowCommentsClick = () => {
    setShowComments(!showComments);
  };

  /**
   * handleCreateNewCommentClick
   */
  const handleCreateNewCommentClick = () => {
    unstable_batchedUpdates(() => {
      !showComments && setShowComments(true);
      setCreateNewActive(true);
      setShowEditor(true);
    });
  };

  /**
   * handleCancelNewComment
   */
  const handleCancelNewCommentClick = () => {
    setShowEditor(false);
  };

  /**
   * handleNewEditorTransitionEnd
   */
  const handleNewEditorTransitionEnd = () => {
    if (!showEditor) {
      setCreateNewActive(false);
    }
  };

  /**
   * handleSaveNewCommentClick
   * @param comment comment
   * @param callback callback
   */
  const handleSaveNewCommentClick = (
    comment: string,
    callback?: () => void
  ) => {
    const newComment: DiaryCommentCreate = {
      journalEntryId:
        props.currentWorkspace.journals &&
        props.currentWorkspace.journals.currentJournal &&
        props.currentWorkspace.journals.currentJournal.id,
      comment: comment,
    };

    createComment(newComment, () => {
      callback();
      setShowEditor(false);
    });
  };

  if (
    !props.currentWorkspace ||
    !props.currentWorkspace.journals ||
    !props.currentWorkspace.journals.currentJournal
  ) {
    return null;
  }

  return (
    <div style={{ width: "100%" }}>
      <div style={{ display: "flex" }}>
        <div
          onClick={handleShowCommentsClick}
          style={{
            fontWeight: "bold",
            fontSize: "1rem",
            padding: "10px 0",
            display: "flex",
            alignItems: "center",
          }}
        >
          {showComments ? "Piilota kommentit (XX)" : "Näytä kommentit (XX)"}
          <div className="icon-arrow-right" />
        </div>
      </div>

      <AnimateHeight height={showComments ? "auto" : 0}>
        {!diaryComments.isLoading &&
          diaryComments.diaryComments &&
          diaryComments.diaryComments.length > 0 &&
          diaryComments.diaryComments.map((dComment) => (
            <WorkspaceJournalCommentListItem
              key={dComment.id}
              diaryComment={dComment}
              status={props.status}
              workspaceEntityId={props.currentWorkspace.id}
              onUpdate={updateComment}
              onDelete={deleteComment}
            />
          ))}

        {!diaryComments.isLoading &&
          !diaryComments.isSaving &&
          diaryComments.diaryComments &&
          diaryComments.diaryComments.length === 0 && <div>Tyhjä</div>}

        {diaryComments.isLoading && <div className="loader-empty" />}
      </AnimateHeight>

      {!showEditor && (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <Button onClick={handleCreateNewCommentClick}>Uusi kommentti</Button>
        </div>
      )}

      <AnimateHeight
        height={showEditor ? "auto" : 0}
        duration={300}
        onAnimationEnd={handleNewEditorTransitionEnd}
        style={{ padding: "10px 0" }}
      >
        {createNewActive && (
          <WorkspaceJournalCommentEditor
            type="new"
            diaryEventId={props.currentWorkspace.journals.currentJournal.id}
            userEntityId={
              props.currentWorkspace.journals.currentJournal.userEntityId
            }
            workspaceEntityId={
              props.currentWorkspace.journals.currentJournal.workspaceEntityId
            }
            locked={diaryComments.isSaving}
            onSave={handleSaveNewCommentClick}
            onClose={handleCancelNewCommentClick}
          />
        )}
      </AnimateHeight>
    </div>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    status: state.status,
    currentWorkspace: state.workspaces.currentWorkspace,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return {
    displayNotification,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkspaceJournalCommentList);

/**
 * WorkspaceJournalCommentListProps
 */
interface WorkspaceJournalCommentListItemProps {
  diaryComment: DiaryComment;
  workspaceEntityId: number;
  status: StatusType;
  /* onSave: (comment: string, callback?: () => void) => void; */
  onUpdate: (
    updatedComment: DiaryCommentUpdate,
    onSuccess?: () => void,
    onFail?: () => void
  ) => Promise<void>;
  onDelete: (
    deleteComment: DiaryCommentDelete,
    onSuccess?: () => void,
    onFail?: () => void
  ) => Promise<void>;
}

/**
 * WorkspaceJournalCommentList
 * @param props props
 */
export const WorkspaceJournalCommentListItem: React.FC<
  WorkspaceJournalCommentListItemProps
> = (props): JSX.Element => {
  const { onDelete, diaryComment, status, onUpdate } = props;

  const {
    id,
    authorId,
    journalEntryId,
    comment,
    firstName,
    lastName,
    created,
  } = diaryComment;

  const [editing, setEditing] = React.useState(false);

  /**
   * handleStartEditClick
   */
  const handleEditCommentClick = () => {
    setEditing(true);
  };

  /**
   * handleCancelNewComment
   */
  const handleCancelEditingCommentClick = () => {
    setEditing(false);
  };

  /**
   * handleSaveNewCommentClick
   * @param editedComment editedComment
   * @param callback callback
   */
  const handleSaveEditedCommentClick = (
    editedComment: string,
    callback?: () => void
  ) => {
    const newComment: DiaryCommentUpdate = {
      id: id,
      journalEntryId: journalEntryId,
      comment: editedComment,
    };

    onUpdate(newComment, () => {
      callback();
      setEditing(false);
    });
  };

  /**
   * handleDeleteCommentClick
   */
  const handleDeleteCommentClick = () => {
    onDelete && onDelete({ id: id, journalEntryId: journalEntryId });
  };

  const creatorIsMe = status.userId === authorId;
  const creatorName = creatorIsMe ? `Minä` : `${firstName} ${lastName}`;
  const formatedDate = `${moment(created).format("l")} - ${moment(
    created
  ).format("LT")}`;

  return (
    <div style={{ marginBottom: "20px" }}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "5px",
        }}
      >
        <div style={{ display: "flex" }}>
          <Avatar id={authorId} firstName={firstName} hasImage={false} />
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              marginLeft: "5px",
            }}
          >
            <span style={{ fontWeight: "bold", fontSize: "1.25rem" }}>
              {creatorName}
            </span>
            <span>{formatedDate}</span>
          </div>
        </div>

        {creatorIsMe && !editing && (
          <div style={{ display: "flex" }}>
            <IconButton icon="pencil" onClick={handleEditCommentClick} />
            <IconButton icon="trash" onClick={handleDeleteCommentClick} />
          </div>
        )}
      </div>

      {editing ? (
        <div>
          <WorkspaceJournalCommentEditor
            type="edit"
            comment={diaryComment}
            diaryEventId={props.diaryComment.journalEntryId}
            userEntityId={props.diaryComment.journalEntryId}
            workspaceEntityId={props.workspaceEntityId}
            locked={false}
            onSave={handleSaveEditedCommentClick}
            onClose={handleCancelEditingCommentClick}
          />
        </div>
      ) : (
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
        </div>
      )}
    </div>
  );
};
