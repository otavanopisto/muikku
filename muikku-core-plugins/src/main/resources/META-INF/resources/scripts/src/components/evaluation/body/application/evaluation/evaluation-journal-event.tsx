import * as React from "react";
import * as moment from "moment";
import AnimateHeight from "react-animate-height";
import "~/sass/elements/rich-text.scss";
import CkeditorContentLoader from "../../../../base/ckeditor-loader/content";
import { StateType } from "~/reducers";
import { bindActionCreators, Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import Link from "~/components/general/link";
import { connect } from "react-redux";
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
import { i18nType } from "~/reducers/base/i18n";
import { EvaluationState } from "~/reducers/main-function/evaluation";
import {
  LoadEvaluationJournalCommentsFromServerTriggerType,
  loadEvaluationJournalCommentsFromServer,
} from "~/actions/main-function/evaluation/evaluationActions";
import { EvaluationStudyDiaryEvent } from "~/@types/evaluation";
import {
  UpdateEvaluationJournalCommentTriggerType,
  updateEvaluationJournalComment,
} from "../../../../../actions/main-function/evaluation/evaluationActions";
import {
  CreateEvaluationJournalCommentTriggerType,
  createEvaluationJournalComment,
} from "../../../../../actions/main-function/evaluation/evaluationActions";

/**
 * EvaluationEventContentCardProps
 */
interface EvaluationDiaryEventProps extends EvaluationStudyDiaryEvent {
  i18n: i18nType;
  open: boolean;
  onClickOpen?: (diaryId: number) => void;
  evaluation: EvaluationState;
  loadEvaluationJournalCommentsFromServer: LoadEvaluationJournalCommentsFromServerTriggerType;
  createEvaluationJournalComment: CreateEvaluationJournalCommentTriggerType;
  updateEvaluationJournalComment: UpdateEvaluationJournalCommentTriggerType;
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
    i18n,
    commentCount,
    createEvaluationJournalComment,
    updateEvaluationJournalComment,
  } = props;

  const myRef = React.useRef<HTMLDivElement>(null);

  const [showContent, setShowContent] = React.useState(false);
  const [showComments, setShowComments] = React.useState(false);

  const [createNewActive, setCreateNewActive] = React.useState(false);
  const [commentToEdit, setCommentToEdit] = React.useState<
    JournalComment | undefined
  >(undefined);
  const [editorLocked, setEditorLocked] = React.useState(false);

  React.useEffect(() => {
    if (!createNewActive && commentToEdit === undefined) {
      setShowContent(open);
    }
  }, [open, createNewActive, commentToEdit]);

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
    if (
      !props.evaluation.evaluationJournalComments.commentsLoaded.includes(id)
    ) {
      props.loadEvaluationJournalCommentsFromServer({
        workspaceId: workspaceEntityId,
        journalEntryId: id,
      });
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
    setEditorLocked(true);

    const newComment: JournalCommentCreate = {
      journalEntryId: id,
      comment: comment,
    };

    createEvaluationJournalComment({
      newCommentPayload: newComment,
      journalEntryId: id,
      workspaceEntityId: workspaceEntityId,
      // eslint-disable-next-line jsdoc/require-jsdoc
      success: () => {
        callback();
        setCreateNewActive(false);
        setEditorLocked(false);
      },
    });
  };

  /**
   * Handles save edited comment
   * @param comment comment
   * @param callback callback
   */
  const handleCommentEditSave = (comment: string, callback?: () => void) => {
    setEditorLocked(true);

    const updatedComment: JournalCommentUpdate = {
      id: commentToEdit.id,
      journalEntryId: commentToEdit.journalEntryId,
      comment: comment,
    };

    updateEvaluationJournalComment({
      updatedCommentPayload: updatedComment,
      journalEntryId: id,
      workspaceEntityId: workspaceEntityId,
      // eslint-disable-next-line jsdoc/require-jsdoc
      success: () => {
        callback();
        setCommentToEdit(undefined);
        setEditorLocked(false);
      },
    });
  };

  const formatedDate = `${moment(created).format("l")} - ${moment(
    created
  ).format("LT")}`;

  const arrowClasses = !showComments
    ? `evaluation-modal__event-arrow evaluation-modal__event-arrow--journal-comment evaluation-modal__event-arrow--right`
    : `evaluation-modal__event-arrow evaluation-modal__event-arrow--journal-comment evaluation-modal__event-arrow--down `;

  const isLoading =
    !props.evaluation.evaluationJournalComments.commentsLoaded.includes(id);

  const comments = props.evaluation.evaluationJournalComments.comments[id];

  const isMandatory = props.isMaterialField;
  const isDraft =
    props.workspaceMaterialReplyState &&
    props.workspaceMaterialReplyState === "ANSWERED";

  return (
    <div className="evaluation-modal__item">
      <div className="evaluation-modal__item-header" ref={myRef}>
        <div
          className={
            isMandatory
              ? "evaluation-modal__item-header-title evaluation-modal__item-header-title--journal-mandatory"
              : "evaluation-modal__item-header-title evaluation-modal__item-header-title--journal"
          }
          onClick={handleOpenContentClick}
        >
          {title}
          {isDraft &&
            i18n.text.get(
              "plugin.evaluation.evaluationModal.journalEntry.statusDraft"
            )}
          <div className="evaluation-modal__item-meta">
            <div className="evaluation-modal__item-meta-item">
              <span className="evaluation-modal__item-meta-item-label">
                {i18n.text.get(
                  "plugin.evaluation.evaluationModal.journalEntry.writtenLabel"
                )}
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
            <div className={arrowClasses + " icon-arrow-right"} />
            <div className="evaluation-modal__item-subheader-title evaluation-modal__item-subheader-title--journal-comment">
              {i18n.text.get(
                "plugin.evaluation.evaluationModal.journalComments.title"
              )}{" "}
              ({commentCount})
            </div>
          </div>

          <AnimateHeight duration={420} height={showComments ? "auto" : 0}>
            <>
              {isLoading ? (
                <div className="loader-empty" />
              ) : comments && comments.length === 0 ? (
                <div className="empty">
                  <span>
                    {i18n.text.get(
                      "plugin.evaluation.evaluationModal.journalComments.noComments"
                    )}
                  </span>
                </div>
              ) : (
                comments.length > 0 &&
                comments.map((comment) => {
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
                    />
                  );
                })
              )}
            </>

            <div>
              <Link className="link" onClick={handleCreateNewComment}>
                {i18n.text.get(
                  "plugin.evaluation.evaluationModal.journalComments.newCommentButton"
                )}
              </Link>
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
          locked={editorLocked}
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
          locked={editorLocked}
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
  return {
    i18n: state.i18n,
    evaluation: state.evaluations,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    {
      loadEvaluationJournalCommentsFromServer,
      createEvaluationJournalComment,
      updateEvaluationJournalComment,
    },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EvaluationJournalEvent);
