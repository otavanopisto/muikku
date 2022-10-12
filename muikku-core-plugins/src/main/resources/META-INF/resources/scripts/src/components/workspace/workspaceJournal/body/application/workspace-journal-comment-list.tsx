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
import Link from "~/components/general/link";
import DeleteJournalComment from "../../dialogs/delete-journal-comment";
import {
  ApplicationListItem,
  ApplicationListItemHeader,
  ApplicationListItemBody,
  ApplicationListItemFooter,
} from "~/components/general/application-list";

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
    <>
      <div className="application-list__header application-list__header--journal">
        <h2
          className="application-list__title"
          onClick={handleShowCommentsClick}
        >
          <span className="application-list__title-main">
            {props.i18n.text.get(
              "plugin.workspace.journal.entry.comments.title"
            )}{" "}
            (666)
          </span>
        </h2>
      </div>

      <AnimateHeight height={showComments ? "auto" : 0}>
        <>
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
            journalComments.comments.length === 0 && (
              <div className="empty">
                <span>
                  {props.i18n.text.get("plugin.workspace.journal.noComments")}
                </span>
              </div>
            )}

          {(journalComments.isLoading || journalComments.isSaving) && (
            <div className="loader-empty" />
          )}
        </>

        <>
          {!showEditor && (
            <div className="application-list__footer">
              <Link
                onClick={handleCreateNewCommentClick}
                className="link link--application-list"
              >
                {props.i18n.text.get(
                  "plugin.workspace.journal.newCommentButton.label"
                )}
              </Link>
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
                  props.currentWorkspace.journals.currentJournal
                    .workspaceEntityId
                }
                locked={journalComments.isSaving}
                onSave={handleSaveNewCommentClick}
                onClose={handleCancelNewCommentClick}
              />
            )}
          </AnimateHeight>
        </>
      </AnimateHeight>
    </>
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

  const creatorIsMe = status.userId === authorId;
  const creatorName = creatorIsMe ? `Minä` : `${firstName} ${lastName}`;
  const formatedDate = `${moment(created).format("l")} - ${moment(
    created
  ).format("LT")}`;

  return (
    <ApplicationListItem className="journal journal--comment">
      <ApplicationListItemHeader
        className="application-list__item-header--journal-comment"
        tabIndex={0}
      >
        <Avatar
          id={authorId}
          firstName={firstName}
          hasImage={status.hasImage}
        />
        <div className="application-list__item-header-main application-list__item-header-main--journal-comment">
          <span className="application-list__item-header-main-content application-list__item-header-main-content--journal-comment-creator">
            {creatorName}
          </span>
        </div>
        <div className="application-list__item-header-aside application-list__item-header-aside--journal-comment">
          {formatedDate}
        </div>
      </ApplicationListItemHeader>

      {editing ? (
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
      ) : (
        <ApplicationListItemBody modifiers={["journal-comment"]}>
          <article className="application-list__item-content-body application-list__item-content-body--journal-comment rich-text">
            <CkeditorContentLoader html={comment} />
          </article>

          {creatorIsMe && !editing && (
            <ApplicationListItemFooter className="application-list__item-footer--journal-comment">
              <Link
                as="span"
                className="link link--application-list"
                onClick={handleEditCommentClick}
              >
                Muokkaa (LOKALISOINTI!)
              </Link>

              <DeleteJournalComment
                journalComment={journalComment}
                onDelete={onDelete}
              >
                <Link as="span" className="link link--application-list">
                  Poista (LOKALISOINTI!)
                </Link>
              </DeleteJournalComment>
            </ApplicationListItemFooter>
          )}
        </ApplicationListItemBody>
      )}
    </ApplicationListItem>
  );
};
