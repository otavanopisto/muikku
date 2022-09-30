import * as moment from "moment";
import * as React from "react";
import {
  JournalComment,
  JournalCommentCreate,
  JournalCommentDelete,
  JournalCommentUpdate,
} from "~/@types/journal";
import {
  DisplayNotificationTriggerType,
  displayNotification,
} from "~/actions/base/notifications";
import { useJournalComments } from "~/hooks/useJournalComments";
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
    journalComments,
    loadJournalComments,
    deleteComment,
    createComment,
    updateComment,
  } = useJournalComments(
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
      !journalComments.isLoading &&
      !journalComments.comments
    ) {
      loadJournalComments();
    }
  }, [
    showComments,
    loadJournalComments,
    journalComments.isLoading,
    journalComments.comments,
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
    const newComment: JournalCommentCreate = {
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
        {!journalComments.isLoading &&
          journalComments.comments &&
          journalComments.comments.length > 0 &&
          journalComments.comments.map((comment) => (
            <WorkspaceJournalCommentListItem
              key={comment.id}
              journalComment={comment}
              status={props.status}
              workspaceEntityId={props.currentWorkspace.id}
              isSaving={journalComments.isSaving}
              onUpdate={updateComment}
              onDelete={deleteComment}
            />
          ))}

        {!journalComments.isLoading &&
          !journalComments.isSaving &&
          journalComments.comments &&
          journalComments.comments.length === 0 && <div>Tyhjä</div>}

        {(journalComments.isLoading || journalComments.isSaving) && (
          <div className="loader-empty" />
        )}
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
            locked={journalComments.isSaving}
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
  journalComment: JournalComment;
  workspaceEntityId: number;
  status: StatusType;
  isSaving: boolean;
  /* onSave: (comment: string, callback?: () => void) => void; */
  onUpdate: (
    updatedComment: JournalCommentUpdate,
    onSuccess?: () => void,
    onFail?: () => void
  ) => Promise<void>;
  onDelete: (
    deleteComment: JournalCommentDelete,
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
  const { onDelete, journalComment, status, onUpdate } = props;

  const {
    id,
    authorId,
    journalEntryId,
    comment,
    firstName,
    lastName,
    created,
  } = journalComment;

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
    const newComment: JournalCommentUpdate = {
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
            journalComment={journalComment}
            diaryEventId={journalComment.journalEntryId}
            userEntityId={journalComment.journalEntryId}
            workspaceEntityId={props.workspaceEntityId}
            locked={props.isSaving}
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
