import * as React from "react";
import AnimateHeight from "react-animate-height";
import "~/sass/elements/rich-text.scss";
import CkeditorContentLoader from "../../../../base/ckeditor-loader/content";
import { StateType } from "~/reducers";
import { Action, bindActionCreators, Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import Link from "~/components/general/link";
import { connect } from "react-redux";
import JournalCommentEditor from "./editors/journal-comment-editor";
import SlideDrawer from "./slide-drawer";
import EvaluationJournalEventComment from "./evaluation-journal-event-comment";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";
import { EvaluationState } from "~/reducers/main-function/evaluation";
import {
  LoadEvaluationJournalCommentsFromServerTriggerType,
  loadEvaluationJournalCommentsFromServer,
} from "~/actions/main-function/evaluation/evaluationActions";
import { useTranslation } from "react-i18next";
import {
  UpdateEvaluationJournalCommentTriggerType,
  updateEvaluationJournalComment,
} from "../../../../../actions/main-function/evaluation/evaluationActions";
import {
  CreateEvaluationJournalCommentTriggerType,
  createEvaluationJournalComment,
} from "../../../../../actions/main-function/evaluation/evaluationActions";
import {
  WorkspaceJournalEntry,
  WorkspaceJournalComment,
} from "~/generated/client";
import { localize } from "~/locales/i18n";
import {
  MaterialContentNodeWithIdAndLogic,
  WorkspaceDataType,
} from "~/reducers/workspaces";
import EvaluationMaterial from "./evaluation-material";

/**
 * EvaluationEventContentCardProps
 */
interface EvaluationDiaryEventProps extends WorkspaceJournalEntry {
  workspace: WorkspaceDataType;
  evaluation: EvaluationState;
  loadEvaluationJournalCommentsFromServer: LoadEvaluationJournalCommentsFromServerTriggerType;
  createEvaluationJournalComment: CreateEvaluationJournalCommentTriggerType;
  updateEvaluationJournalComment: UpdateEvaluationJournalCommentTriggerType;
}

export type EvaluationJournalEventRef = {
  toggleOpen: (type?: "open" | "close") => void;
};

/**
 * Creates evaluation diary event component
 *
 * @param props props
 * @returns JSX.Element
 */
const EvaluationJournalEvent = React.forwardRef<
  EvaluationJournalEventRef,
  EvaluationDiaryEventProps
>((props, ref) => {
  const {
    title,
    content,
    material,
    created,
    userEntityId,
    workspaceEntityId,
    id,
    workspaceMaterialPath,
    commentCount,
    workspaceMaterialId,
    createEvaluationJournalComment,
    updateEvaluationJournalComment,
  } = props;

  const myRef = React.useRef<HTMLDivElement>(null);

  const [showContent, setShowContent] = React.useState(true);
  const [showComments, setShowComments] = React.useState(false);

  const [createNewActive, setCreateNewActive] = React.useState(false);
  const [commentToEdit, setCommentToEdit] = React.useState<
    WorkspaceJournalComment | undefined
  >(undefined);
  const [editorLocked, setEditorLocked] = React.useState(false);

  const { t } = useTranslation(["evaluation", "journal", "common"]);

  // Scrolls to element when new comment editor is opened
  React.useEffect(() => {
    if (showContent && createNewActive) {
      handleExecuteScrollToElement();
    }
  }, [createNewActive, showContent]);

  /**
   * Toggles open state
   * @param type "open" | "handle"
   */
  const toggleContent = (type?: "open" | "close") => {
    if (type) {
      setShowContent(type === "open" ? true : false);
    } else {
      setShowContent(!showContent);
    }
  };

  // Way to expose toggleHeight and refs to parent component
  React.useImperativeHandle(ref, () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    toggleOpen: (type) => {
      toggleContent(type);
    },
  }));

  /**
   * Shows diary content
   */
  const handleOpenContentClick = () => {
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
        unstable_batchedUpdates(() => {
          commentToEdit && setCommentToEdit(undefined);
          setShowContent(true);
          setCreateNewActive(true);
        });
      } else {
        unstable_batchedUpdates(() => {
          commentToEdit && setCommentToEdit(undefined);
          setCreateNewActive(true);
        });
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
  const handleEditComment = (diaryComment: WorkspaceJournalComment) => {
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

    createEvaluationJournalComment({
      newCommentPayload: {
        journalEntryId: id,
        comment: comment,
      },
      journalEntryId: id,
      workspaceEntityId: workspaceEntityId,
      // eslint-disable-next-line jsdoc/require-jsdoc
      success: () => {
        callback();

        unstable_batchedUpdates(() => {
          setCreateNewActive(false);
          setEditorLocked(false);
        });
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

    updateEvaluationJournalComment({
      updatedCommentPayload: {
        id: commentToEdit.id,
        journalEntryId: commentToEdit.journalEntryId,
        comment: comment,
      },
      journalEntryId: id,
      workspaceEntityId: workspaceEntityId,
      // eslint-disable-next-line jsdoc/require-jsdoc
      success: () => {
        callback();

        unstable_batchedUpdates(() => {
          setCommentToEdit(undefined);
          setEditorLocked(false);
        });
      },
    });
  };

  // Composite reply holds answers for specific journal assignment entry
  const compositeReply =
    props.evaluation.evaluationCompositeReplies?.data?.find(
      (cReply) => cReply.workspaceMaterialId === workspaceMaterialId
    );

  /**
   * Renders content depending whether entry is Journal assignment or not
   * @returns JSX.Element
   */
  const renderDiaryContent = () => {
    // If material with workspaceMaterialId from entry is present, entry is Journal assignment
    if (
      material &&
      workspaceMaterialId &&
      workspaceMaterialPath &&
      props.workspace
    ) {
      // Material content node, that MaterialLoader expects
      const materialContentNode: MaterialContentNodeWithIdAndLogic = {
        ...material,
        contentHiddenForUser: false,
        assignmentType: "JOURNAL",
        ai: "DISALLOWED",
        path: workspaceMaterialPath,
      };

      return (
        <EvaluationMaterial
          material={materialContentNode}
          workspace={props.workspace}
          compositeReply={compositeReply}
          userEntityId={userEntityId}
        />
      );
    }

    return (
      <div className="evaluation-modal__item-body rich-text">
        <CkeditorContentLoader html={content} />
      </div>
    );
  };

  const formatedDate = `${localize.date(created)} - ${localize.date(
    created,
    "h:mm"
  )}`;

  const arrowClasses = !showComments
    ? `evaluation-modal__event-arrow evaluation-modal__event-arrow--journal-comment evaluation-modal__event-arrow--right`
    : `evaluation-modal__event-arrow evaluation-modal__event-arrow--journal-comment evaluation-modal__event-arrow--down `;

  const isLoading =
    !props.evaluation.evaluationJournalComments.commentsLoaded.includes(id);

  const comments = props.evaluation.evaluationJournalComments.comments[id];

  const isMandatory = props.material !== null;
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
          <div className="title-container">
            <div className="title-text">{title}</div>

            {isDraft && (
              <span className="label label--draft">
                <span className="label__text">{t("actions.draft")}</span>
              </span>
            )}
          </div>

          <div className="evaluation-modal__item-meta">
            <div className="evaluation-modal__item-meta-item">
              <span className="evaluation-modal__item-meta-item-label">
                {t("labels.written", { ns: "evaluation" })}
              </span>
              <span className="evaluation-modal__item-meta-item-data">
                {formatedDate}
              </span>
            </div>
          </div>
        </div>
      </div>

      <AnimateHeight duration={400} height={showContent ? "auto" : 0}>
        {renderDiaryContent()}
        <>
          <div
            className="evaluation-modal__item-subheader evaluation-modal__item-subheader--journal-comment"
            onClick={handleShowCommentsClick}
          >
            <div className={arrowClasses + " icon-arrow-right"} />
            <div className="evaluation-modal__item-subheader-title evaluation-modal__item-subheader-title--journal-comment">
              {t("labels.comments")} ({commentCount})
            </div>
          </div>

          <AnimateHeight duration={420} height={showComments ? "auto" : 0}>
            <>
              {isLoading ? (
                <div className="loader-empty" />
              ) : comments && comments.length === 0 ? (
                <div className="empty">
                  <span>
                    {t("content.empty", { ns: "journal", context: "comments" })}
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
              <Link
                className="link link--evaluation"
                onClick={handleCreateNewComment}
              >
                {t("labels.create", { context: "comment" })}
              </Link>
            </div>
          </AnimateHeight>
        </>
      </AnimateHeight>

      <SlideDrawer
        title={t("labels.create", { context: "comment" })}
        closeIconModifiers={["evaluation"]}
        modifiers={["journal-comment"]}
        show={createNewActive}
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
        title={t("labels.edit", { context: "comment" })}
        show={commentToEdit !== undefined}
        closeIconModifiers={["evaluation"]}
        modifiers={["journal-comment"]}
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
});

EvaluationJournalEvent.displayName = "EvaluationJournalEvent";

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    evaluation: state.evaluations,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    {
      loadEvaluationJournalCommentsFromServer,
      createEvaluationJournalComment,
      updateEvaluationJournalComment,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true,
})(EvaluationJournalEvent);
