import * as React from "react";
import {
  DisplayNotificationTriggerType,
  displayNotification,
} from "~/actions/base/notifications";
import { StateType } from "~/reducers";
import { StatusType } from "~/reducers/base/status";
import { WorkspaceDataType } from "~/reducers/workspaces";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "~/actions";
import AnimateHeight from "react-animate-height";
import WorkspaceJournalCommentEditor from "./editors/workspace-journal-comment-editor";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import Link from "~/components/general/link";
import {
  JournalsState,
  WorkspaceJournalWithComments,
} from "~/reducers/workspaces/journals";
import { bindActionCreators } from "redux";
import {
  createWorkspaceJournalComment,
  CreateWorkspaceJournalCommentTriggerType,
} from "../../../../../actions/workspaces/journals";
import WorkspaceJournalCommentListItem from "./workspace-journal-comment-list-item";
import { useTranslation } from "react-i18next";

/**
 * WorkspaceJournalCommentListProps
 */
interface WorkspaceJournalCommentListProps {
  status: StatusType;
  journalsState: JournalsState;
  currentWorkspace: WorkspaceDataType;
  currentJournal: WorkspaceJournalWithComments;
  createWorkspaceJournalComment: CreateWorkspaceJournalCommentTriggerType;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * WorkspaceJournalCommentList
 * @param props props
 */
export const WorkspaceJournalCommentList: React.FC<
  WorkspaceJournalCommentListProps
> = (props) => {
  const { t } = useTranslation(["journal", "common"]);

  const { currentJournal, journalsState } = props;

  const [showComments, setShowComments] = React.useState(false);
  const [createNewActive, setCreateNewActive] = React.useState(false);
  const [showEditor, setShowEditor] = React.useState(false);
  const [editorLocked, setEditorLocked] = React.useState(false);

  const editorRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    setShowComments(true);
  }, []);

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

    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }, 325);
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
    setEditorLocked(true);

    props.createWorkspaceJournalComment({
      newCommentPayload: {
        journalEntryId: props.currentJournal.id,
        comment: comment,
      },
      journalEntryId: props.currentJournal.id,
      workspaceEntityId: props.currentJournal.workspaceEntityId,
      /**
       * success
       */
      success: () => {
        callback();
        unstable_batchedUpdates(() => {
          setCreateNewActive(false);
          setShowEditor(false);
          setEditorLocked(false);
        });
      },
    });
  };

  if (!props.currentWorkspace || !props.currentJournal) {
    return null;
  }

  const isLoading = !journalsState.commentsLoaded.includes(currentJournal.id);

  return (
    <>
      <div className="application-list__header application-list__header--journal">
        <h2
          className="application-list__title"
          onClick={handleShowCommentsClick}
        >
          <span className="application-list__title-main">
            {t("labels.comments")} ({props.currentJournal.commentCount})
          </span>
        </h2>
      </div>

      <AnimateHeight height={showComments ? "auto" : 0}>
        <>
          {isLoading ? (
            <div className="loader-empty" />
          ) : currentJournal.comments &&
            currentJournal.comments.length === 0 ? (
            <div className="empty">
              <span>
                {t("content.empty", { ns: "journal", context: "comments" })}
              </span>
            </div>
          ) : (
            currentJournal.comments.length > 0 &&
            currentJournal.comments.map((comment) => (
              <WorkspaceJournalCommentListItem
                key={comment.id}
                journalComment={comment}
                status={props.status}
                workspaceEntityId={props.currentWorkspace.id}
              />
            ))
          )}
        </>

        <>
          {!showEditor && (
            <div className="application-list__footer">
              <Link
                onClick={handleCreateNewCommentClick}
                className="link link--application-list"
              >
                {t("actions.create", { ns: "common", context: "comment" })}
              </Link>
            </div>
          )}

          <AnimateHeight
            height={showEditor ? "auto" : 0}
            duration={300}
            onAnimationEnd={handleNewEditorTransitionEnd}
            style={{ padding: "10px 0" }}
          >
            <div ref={editorRef}>
              {createNewActive && (
                <WorkspaceJournalCommentEditor
                  type="new"
                  diaryEventId={props.currentJournal.id}
                  userEntityId={props.currentJournal.userEntityId}
                  workspaceEntityId={props.currentJournal.workspaceEntityId}
                  locked={editorLocked}
                  onSave={handleSaveNewCommentClick}
                  onClose={handleCancelNewCommentClick}
                />
              )}
            </div>
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
    status: state.status,
    journalsState: state.journals,
    currentWorkspace: state.workspaces && state.workspaces.currentWorkspace,
    currentJournal: state.journals && state.journals.currentJournal,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    {
      displayNotification,
      createWorkspaceJournalComment,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkspaceJournalCommentList);
