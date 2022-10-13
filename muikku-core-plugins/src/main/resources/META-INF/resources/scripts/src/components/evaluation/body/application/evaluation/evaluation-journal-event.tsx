import * as React from "react";
import * as moment from "moment";
import AnimateHeight from "react-animate-height";
import { WorkspaceJournalType } from "~/reducers/workspaces/index";
import "~/sass/elements/rich-text.scss";
import CkeditorContentLoader from "../../../../base/ckeditor-loader/content";
import { useJournalComments } from "../../../../../hooks/useJournalComments";
import { StateType } from "~/reducers";
import { Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { connect } from "react-redux";
import { ButtonPill } from "~/components/general/button";
import JournalCommentEditor from "./editors/journal-comment-editor";
import SlideDrawer from "./slide-drawer";
import EvaluationJournalEventComment from "./evaluation-journal-event-comment";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import {
  JournalComment,
  JournalCommentCreate,
  JournalCommentUpdate,
} from "~/@types/journal";

/**
 * EvaluationEventContentCardProps
 */
interface EvaluationDiaryEventProps extends WorkspaceJournalType {
  open: boolean;
  onClickOpen?: (diaryId: number) => void;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * Creates evaluation diary event component
 *
 * @param props props
 * @returns JSX.Element
 */
const EvaluationJournalEvent: React.FC<EvaluationDiaryEventProps> = (props) => {
  const {
    title,
    content,
    created,
    open,
    onClickOpen,
    userEntityId,
    workspaceEntityId,
    id,
    displayNotification,
  } = props;

  const {
    journalComments,
    loadJournalComments,
    createComment,
    updateComment,
    deleteComment,
  } = useJournalComments(workspaceEntityId, id, displayNotification);

  const myRef = React.useRef<HTMLDivElement>(null);

  const [createNewActive, setCreateNewActive] = React.useState(false);
  const [showComments, setShowComments] = React.useState(false);
  const [showContent, setShowContent] = React.useState(false);
  const [commentToEdit, setCommentToEdit] = React.useState<
    JournalComment | undefined
  >(undefined);

  React.useEffect(() => {
    if (!createNewActive && commentToEdit === undefined) {
      setShowContent(open);
    }
  }, [open, createNewActive, commentToEdit]);

  React.useEffect(() => {
    if (
      createNewActive &&
      !journalComments.isLoading &&
      journalComments.comments === undefined
    ) {
      loadJournalComments();
      setShowComments(true);
    }
  }, [
    loadJournalComments,
    createNewActive,
    journalComments.isLoading,
    journalComments.comments,
  ]);

  React.useEffect(() => {
    if (showContent && createNewActive) {
      handleExecuteScrollToElement();
    }
  }, [createNewActive, open, showContent]);

  /**
   * Shows diary content
   */
  const handleOpenContentClick = () => {
    if (onClickOpen) {
      onClickOpen(id);
    }

    setShowContent(!showContent);
  };

  /**
   * Shows and loads comments list
   */
  const handleShowCommentsClick = () => {
    if (!showComments && journalComments.comments === undefined) {
      loadJournalComments();
    }
    setShowComments(!showComments);
  };

  /**
   * Handles creates new comment
   * Closes possible existing editing editor and opens content
   * @param e e
   */
  const handleCreateNewComment = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    e.stopPropagation();
    unstable_batchedUpdates(() => {
      if (!open || !showContent) {
        commentToEdit && setCommentToEdit(undefined);
        setShowContent(true);
        setCreateNewActive(true);
      } else {
        commentToEdit && setCommentToEdit(undefined);
        setCreateNewActive(true);
      }
    });
  };

  /**
   * Closes new comment editor
   */
  const handleNewCommentCancel = () => {
    if (open) {
      setCreateNewActive(false);
    } else {
      unstable_batchedUpdates(() => {
        setShowContent(false);
        setCreateNewActive(false);
      });
    }
  };

  /**
   * Handles edit comment.
   * If there is existing new comment editor open -> closes it
   * @param diaryComment diaryComment
   */
  const handleEditComment = (diaryComment: JournalComment) => {
    unstable_batchedUpdates(() => {
      setCommentToEdit(diaryComment);
      createNewActive && setCreateNewActive(false);
    });
  };

  /**
   * Handles cancel edit comment
   */
  const handleEditCancel = () => {
    setCommentToEdit(undefined);
  };

  /**
   * Scrolls with smooth transition to ref element
   */
  const handleExecuteScrollToElement = () => {
    window.dispatchEvent(new Event("resize"));

    setTimeout(() => {
      myRef.current.scrollIntoView({ behavior: "smooth" });
    }, 420);
  };

  /**
   * Handles save new comment
   * @param comment new comment information
   * @param callback callback to do on success save. In this case deleting drafts
   */
  const handleNewCommentSave = (comment: string, callback?: () => void) => {
    const newComment: JournalCommentCreate = {
      journalEntryId: id,
      comment: comment,
    };

    createComment(newComment, () => {
      callback();
      setCreateNewActive(false);
    });
  };

  /**
   * Handles save edited comment
   * @param comment comment
   * @param callback callback
   */
  const handleCommentEditSave = (comment: string, callback?: () => void) => {
    const updatedComment: JournalCommentUpdate = {
      id: commentToEdit.id,
      journalEntryId: commentToEdit.journalEntryId,
      comment: comment,
    };

    updateComment(updatedComment, () => {
      callback();
      setCommentToEdit(undefined);
    });
  };

  const formatedDate = `${moment(created).format("l")} - ${moment(
    created
  ).format("LT")}`;

  const arrowClasses = !showComments
    ? `evaluation-modal__event-arrow evaluation-modal__event-arrow--right `
    : `evaluation-modal__event-arrow evaluation-modal__event-arrow--down `;

  return (
    <div className="evaluation-modal__item">
      <div className="evaluation-modal__item-header" ref={myRef}>
        <div
          className="evaluation-modal__item-header-title evaluation-modal__item-header-title--journal"
          onClick={handleOpenContentClick}
        >
          {title}
          <div className="evaluation-modal__item-meta">
            <div className="evaluation-modal__item-meta-item">
              <span className="evaluation-modal__item-meta-item-label">
                Kirjoitettu
              </span>
              <span className="evaluation-modal__item-meta-item-data">
                {formatedDate}
              </span>
            </div>
          </div>
        </div>
      </div>

      <AnimateHeight duration={400} height={showContent ? "auto" : 0}>
        <div className="evaluation-modal__item-body rich-text">
          <CkeditorContentLoader html={content} />
        </div>

        <>
          <div
            className="evaluation-modal__item-subheader evaluation-modal__item-subheader--journal-comment"
            onClick={handleShowCommentsClick}
          >
            <div className="evaluation-modal__item-subheader-title evaluation-modal__item-subheader-title--journal-comment">
              Kommentit: (XX)
            </div>
            <div className={arrowClasses + "icon-arrow-right"} />
          </div>

          <AnimateHeight duration={420} height={showComments ? "auto" : 0}>
            <>
              {!journalComments.isLoading &&
                journalComments.comments &&
                journalComments.comments.length > 0 &&
                journalComments.comments.map((comment) => {
                  const editingIsActive =
                    commentToEdit && commentToEdit.id === comment.id;

                  return (
                    <EvaluationJournalEventComment
                      key={comment.id}
                      journalComment={comment}
                      canDelete={!editingIsActive}
                      workspaceEntityId={workspaceEntityId}
                      userEntityId={userEntityId}
                      onEditClick={handleEditComment}
                      onDelete={deleteComment}
                      isSaving={journalComments.isSaving}
                    />
                  );
                })}

              {(journalComments.isLoading || journalComments.isSaving) && (
                <div className="loader-empty" />
              )}

              {!journalComments.isLoading &&
                !journalComments.isSaving &&
                journalComments.comments &&
                journalComments.comments.length === 0 && <div>Tyhjä</div>}
            </>
            <div>
              <ButtonPill
                buttonModifiers={["evaluate"]}
                icon="book"
                onClick={handleCreateNewComment}
              />
            </div>
          </AnimateHeight>
        </>
      </AnimateHeight>

      <SlideDrawer
        show={createNewActive}
        title={title}
        onClose={handleNewCommentCancel}
      >
        <JournalCommentEditor
          type="new"
          journalEventId={id}
          userEntityId={userEntityId}
          workspaceEntityId={workspaceEntityId}
          onSave={handleNewCommentSave}
          onClose={handleNewCommentCancel}
          locked={journalComments.isSaving}
        />
      </SlideDrawer>

      <SlideDrawer
        show={commentToEdit !== undefined}
        title={title}
        onClose={handleNewCommentCancel}
      >
        <JournalCommentEditor
          type="edit"
          userEntityId={userEntityId}
          workspaceEntityId={workspaceEntityId}
          journalEventId={id}
          journalComment={commentToEdit}
          onSave={handleCommentEditSave}
          onClose={handleEditCancel}
          locked={journalComments.isSaving}
        />
      </SlideDrawer>
    </div>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {};
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
)(EvaluationJournalEvent);
