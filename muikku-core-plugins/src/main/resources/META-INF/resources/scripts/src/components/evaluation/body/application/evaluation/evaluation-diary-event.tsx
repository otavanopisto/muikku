import * as React from "react";
import * as moment from "moment";
import AnimateHeight from "react-animate-height";
import { WorkspaceJournalType } from "~/reducers/workspaces/index";
import "~/sass/elements/rich-text.scss";
import CkeditorContentLoader from "../../../../base/ckeditor-loader/content";
import {
  useDiaryComments,
  DiaryCommentCreate,
  DiaryComment,
  DiaryCommentUpdate,
} from "./hooks/useDiaryComments";
import { StateType } from "~/reducers";
import { Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { connect } from "react-redux";
import { ButtonPill } from "~/components/general/button";
import DiaryCommentEditor from "./editors/diary-comment-editor";
import SlideDrawer from "./slide-drawer";
import EvaluationDiaryEventComment from "./evaluation-diary-event-comment";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";

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
const EvaluationDiaryEvent: React.FC<EvaluationDiaryEventProps> = (props) => {
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
    diaryComments,
    loadDiaryComments,
    createComment,
    updateComment,
    deleteComment,
  } = useDiaryComments(workspaceEntityId, id, displayNotification);

  const myRef = React.useRef<HTMLDivElement>(null);

  const [createNewActive, setCreateNewActive] = React.useState(false);
  const [showComments, setShowComments] = React.useState(false);
  const [showContent, setShowContent] = React.useState(false);
  const [commentToEdit, setCommentToEdit] = React.useState<
    DiaryComment | undefined
  >(undefined);

  React.useEffect(() => {
    if (!createNewActive && commentToEdit === undefined) {
      setShowContent(open);
    }
  }, [open, createNewActive, commentToEdit]);

  React.useEffect(() => {
    if (
      createNewActive &&
      !diaryComments.isLoading &&
      diaryComments.diaryComments === undefined
    ) {
      loadDiaryComments();
      setShowComments(true);
    }
  }, [
    loadDiaryComments,
    createNewActive,
    diaryComments.isLoading,
    diaryComments.diaryComments,
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
    if (!showComments && diaryComments.diaryComments === undefined) {
      loadDiaryComments();
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
  const handleEditComment = (diaryComment: DiaryComment) => {
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
    const newComment: DiaryCommentCreate = {
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
    const updatedComment: DiaryCommentUpdate = {
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
        <div className="evaluation-modal__item-functions">
          <ButtonPill
            buttonModifiers={["evaluate"]}
            icon="book"
            onClick={handleCreateNewComment}
          />
        </div>
      </div>

      <AnimateHeight duration={400} height={showContent ? "auto" : 0}>
        <div className="evaluation-modal__item-body rich-text">
          <CkeditorContentLoader html={content} />
        </div>

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
          <div className={arrowClasses + "icon-arrow-right"} />
        </div>

        <AnimateHeight duration={420} height={showComments ? "auto" : 0}>
          {!diaryComments.isLoading &&
            diaryComments.diaryComments &&
            diaryComments.diaryComments.length > 0 &&
            diaryComments.diaryComments.map((dComment) => {
              const editingIsActive =
                commentToEdit && commentToEdit.id === dComment.id;

              return (
                <EvaluationDiaryEventComment
                  key={dComment.id}
                  diaryComment={dComment}
                  canDelete={!editingIsActive}
                  workspaceEntityId={workspaceEntityId}
                  userEntityId={userEntityId}
                  onEditClick={handleEditComment}
                  onDelete={deleteComment}
                  isSaving={diaryComments.isSaving}
                />
              );
            })}

          {(diaryComments.isLoading || diaryComments.isSaving) && (
            <div className="loader-empty" />
          )}

          {!diaryComments.isLoading &&
            !diaryComments.isSaving &&
            diaryComments.diaryComments &&
            diaryComments.diaryComments.length === 0 && <div>Tyhjä</div>}
        </AnimateHeight>
      </AnimateHeight>

      <SlideDrawer
        show={createNewActive}
        title={title}
        onClose={handleNewCommentCancel}
      >
        <DiaryCommentEditor
          type="new"
          diaryEventId={id}
          userEntityId={userEntityId}
          workspaceEntityId={workspaceEntityId}
          onSave={handleNewCommentSave}
          onClose={handleNewCommentCancel}
          locked={diaryComments.isSaving}
        />
      </SlideDrawer>

      <SlideDrawer
        show={commentToEdit !== undefined}
        title={title}
        onClose={handleNewCommentCancel}
      >
        <DiaryCommentEditor
          type="edit"
          diaryEventId={id}
          userEntityId={userEntityId}
          workspaceEntityId={workspaceEntityId}
          comment={commentToEdit}
          onSave={handleCommentEditSave}
          onClose={handleEditCancel}
          locked={diaryComments.isSaving}
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
)(EvaluationDiaryEvent);
