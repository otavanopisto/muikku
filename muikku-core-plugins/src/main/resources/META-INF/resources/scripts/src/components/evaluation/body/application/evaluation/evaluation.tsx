import * as React from "react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import SlideDrawer from "./slide-drawer";
import EvaluationEventContentCard from "./evaluation-event-content-card";
import WorkspaceEditor from "./editors/workspace-editor";
import SupplementationEditor from "./editors/supplementation-editor";
import ArchiveDialog from "../../../dialogs/archive";
import Button from "~/components/general/button";
import EvaluationJournalEventList from "./evaluation-journal-event-list";
import EvaluationAssessmentList from "./evaluation-assessment-list";
import {
  createAssignmentInfoArray,
  createExamInfoArray,
} from "~/components/general/evaluation-assessment-details/helper";
import { WorkspaceDataType } from "~/reducers/workspaces";
import { EvaluationAssessmentRequest } from "~/generated/client";
import "~/sass/elements/evaluation.scss";
import "~/sass/elements/assignment.scss";
import "~/sass/elements/empty.scss";
import { MATHJAXSRC } from "~/lib/mathjax";
import { WithTranslation, withTranslation } from "react-i18next";
import { StateType } from "~/reducers";
import { useEvaluationState } from "~/components/evaluation/hooks/evaluation";
import { useEvaluationLogic } from "~/components/evaluation/hooks/evaluation";
import EvaluationExamsList from "./evaluation-exams-list";
import UserLanguageProfile from "~/components/general/user-language-profile";

/**
 * CKEditorConfig
 * @param locale locale
 * @returns CKEditor config
 */
export const CKEditorConfig = (locale: string) => ({
  /* eslint-disable camelcase */
  linkShowTargetTab: true,
  language: locale,
  colorButton_colors:
    "000000,800000,8B4513,2F4F4F,008080,000080,4B0082,B22222,A52A2A,DAA520,006400,40E0D0,0000CD,800080,808080,FF0000,FF8C00,FFD700,008000,00FFFF,0000FF,EE82EE,A9A9A9,FFA07A,FFA500,FFFF00,00FF00,AFEEEE,ADD8E6,DDA0DD,D3D3D3,FFF0F5,FAEBD7,FFFFE0,F0FFF0,F0FFFF,F0F8FF,E6E6FA,FFFFFF",
  height: 400,
  mathJaxLib: MATHJAXSRC,
  mathJaxClass: "math-tex", // This CANNOT be changed as cke saves this to database as part of documents html (wraps the formula in a span with specified className). Don't touch it! ... STOP TOUCHING IT!
  toolbar: [
    {
      name: "clipboard",
      items: ["Cut", "Copy", "Paste", "-", "Undo", "Redo"],
    },
    {
      name: "editing",
      items: ["Find", "-", "SelectAll", "-", "Scayt"],
    },
    {
      name: "basicstyles",
      items: [
        "Bold",
        "Italic",
        "Underline",
        "Strike",
        "Subscript",
        "Superscript",
        "-",
        "RemoveFormat",
      ],
    },
    "/",
    {
      name: "insert",
      items: [
        "Image",
        "Audio",
        "oembed",
        "Muikku-mathjax",
        "Table",
        "Smiley",
        "SpecialChar",
      ],
    },
    { name: "links", items: ["Link", "Unlink"] },
    { name: "colors", items: ["TextColor", "BGColor"] },
    "/",
    { name: "styles", items: ["Format"] },
    {
      name: "paragraph",
      items: [
        "NumberedList",
        "BulletedList",
        "-",
        "Outdent",
        "Indent",
        "Blockquote",
        "-",
        "JustifyLeft",
        "JustifyCenter",
        "JustifyRight",
        "JustifyBlock",
        "-",
        "BidiLtr",
        "BidiRtl",
      ],
    },
    { name: "tools", items: ["Maximize"] },
  ],
  removePlugins: "image,exportpdf,wsc",
  resize_enabled: true,
  extraPlugins: "divarea,image2,muikku-mathjax",
});
/* eslint-enable camelcase */

/**
 * EvaluationDrawerProps
 */
interface EvaluationDrawerProps extends WithTranslation {
  onClose?: () => void;
  /**
   * Assessment that is opened
   */
  selectedAssessment: EvaluationAssessmentRequest;
}

/**
 * Main component for evaluation model, that combines
 * other sub components, like different lists and drawers.
 * @param props props
 * @returns JSX.Element
 */
const Evaluation = (props: EvaluationDrawerProps) => {
  const { onClose, selectedAssessment } = props;

  const currentWorkspace = useSelector(
    (state: StateType) => state.workspaces.currentWorkspace
  );
  const evaluation = useSelector((state: StateType) => state.evaluations);

  const { state, updateState } = useEvaluationState(selectedAssessment);

  const {
    isAllAssignmentsLocked,
    getLatestEvaluatedEventIndex,
    isLatestEventSupplementationRequest,
    handleClickEdit,
    handleWorkspaceSuccesfulSave,
    handleCloseWorkspaceEvaluationDrawer,
    handleCloseWorkspaceSupplementationEvaluationDrawer,
    handleSelectSubjectEvaluationChange,
    handleCloseArchiveStudentDialog,
    handleToggleAllLockedAssignment,
    handleOpenWorkspaceEvaluationDrawer,
    handleOpenWorkspaceSupplementationEvaluationDrawer,
  } = useEvaluationLogic(selectedAssessment, evaluation, state, updateState);

  const { t } = useTranslation(["evaluation", "common"]);

  const isCombinationWorkspace = selectedAssessment.subjects.length > 1;

  // Memoize workspaces array
  const workspaces = useMemo(() => {
    const workspaceList = [...evaluation.evaluationWorkspaces];

    // Add current workspace if not in list
    if (
      currentWorkspace &&
      !evaluation.evaluationWorkspaces.some(
        (eWorkspace) => eWorkspace.id === currentWorkspace.id
      )
    ) {
      workspaceList.push({ ...currentWorkspace } as WorkspaceDataType);
    }

    return workspaceList;
  }, [evaluation.evaluationWorkspaces, currentWorkspace]);

  // Initialized evaluation state variables with default values
  const compsoiteReplies = evaluation.evaluationCompositeReplies?.data || [];
  const currentStudentAssigments = (
    evaluation.evaluationCurrentStudentAssigments?.data?.assigments || []
  ).filter((assignment) => !assignment.exam);
  const evaluationsEvents = evaluation.evaluationAssessmentEvents?.data || [];
  const currentStudentExams = evaluation.evaluationExams?.data || [];

  // Assignment info array
  const assignmentInfoArray = createAssignmentInfoArray(
    compsoiteReplies,
    currentStudentAssigments
  );

  // Exam info array
  const examInfoArray = createExamInfoArray(currentStudentExams);

  // Check if evaluation has been completed
  const isEvaluated = evaluationsEvents.length > 0;

  // Check if selected subject has been evaluated
  const isSelectedSubjectEvaluated =
    state.subjectToBeEvaluated &&
    evaluationsEvents.find(
      (e) =>
        e.workspaceSubjectIdentifier ===
          state.subjectToBeEvaluated.identifier && e.grade !== null
    );

  // Memoize latest evaluated event indices
  const latestEvaluatedEventIndexPerSubject = useMemo(
    () =>
      selectedAssessment.subjects
        .map((sItem) => getLatestEvaluatedEventIndex(sItem.identifier))
        .reduce((r, c) => Object.assign(r, c), {}),
    [selectedAssessment.subjects, getLatestEvaluatedEventIndex]
  );

  // Memoize amount of evaluated modules
  const amountOfEvaluatedModules = useMemo(
    () => Object.keys(latestEvaluatedEventIndexPerSubject).length,
    [latestEvaluatedEventIndexPerSubject]
  );

  const latestEventIsSupplementationRequest =
    isLatestEventSupplementationRequest();

  const evaluationEventContentCards =
    evaluationsEvents.length > 0 ? (
      evaluationsEvents.map((eItem, index) => {
        const isInterimEvaluation =
          eItem.type === "INTERIM_EVALUATION" ||
          eItem.type === "INTERIM_EVALUATION_REQUEST" ||
          eItem.type === "INTERIM_EVALUATION_REQUEST_CANCELLED";

        const isRequestOrCancelled =
          eItem.type === "EVALUATION_REQUEST" ||
          eItem.type === "EVALUATION_REQUEST_CANCELLED";

        const isSupplementationRequest =
          eItem.type === "SUPPLEMENTATION_REQUEST";

        if (isCombinationWorkspace) {
          const isLatestEvaluationForModule =
            latestEvaluatedEventIndexPerSubject[
              eItem.workspaceSubjectIdentifier
            ] === index;

          let nextIsNotRequest = true;
          let canDeleteSupplementationRequest = true;

          if (evaluationsEvents.length - 1 !== index) {
            const remainingEvents = evaluationsEvents.slice(index + 1);

            nextIsNotRequest =
              remainingEvents.find((j) => j.type === "EVALUATION_REQUEST") ===
              undefined;

            if (isSupplementationRequest) {
              canDeleteSupplementationRequest =
                remainingEvents.find(
                  (e) =>
                    e.type === "SUPPLEMENTATION_REQUEST" &&
                    e.workspaceSubjectIdentifier ===
                      eItem.workspaceSubjectIdentifier
                ) === undefined;
            }
          }

          return (
            <EvaluationEventContentCard
              onClickEdit={handleClickEdit}
              key={index}
              selectedAssessment={selectedAssessment}
              {...eItem}
              showModifyLink={
                !isInterimEvaluation &&
                (!isRequestOrCancelled || isSupplementationRequest)
              }
              showDeleteLink={
                !isInterimEvaluation &&
                ((!isRequestOrCancelled &&
                  nextIsNotRequest &&
                  isLatestEvaluationForModule &&
                  !latestEventIsSupplementationRequest) ||
                  (isSupplementationRequest &&
                    nextIsNotRequest &&
                    canDeleteSupplementationRequest))
              }
            />
          );
        }

        const isLatestEvent = evaluationsEvents.length - 1 === index;

        return (
          <EvaluationEventContentCard
            onClickEdit={handleClickEdit}
            key={index}
            selectedAssessment={selectedAssessment}
            {...eItem}
            showModifyLink={!isInterimEvaluation && !isRequestOrCancelled}
            showDeleteLink={
              !isInterimEvaluation && !isRequestOrCancelled && isLatestEvent
            }
          />
        );
      })
    ) : (
      <div className="empty">
        <span>
          {t("content.empty", {
            ns: "evaluation",
          })}
        </span>
      </div>
    );

  return (
    <div className="evaluation-modal">
      <div
        onClick={onClose}
        className="evaluation-modal__close icon-cross"
      ></div>

      <section className="evaluation-modal__container">
        <header className="evaluation-modal__header evaluation-modal__header--student">
          <div className="evaluation-modal__header-title">{`${selectedAssessment.lastName}, ${selectedAssessment.firstName} (${selectedAssessment.studyProgramme})`}</div>
        </header>

        <div className="evaluation-modal__content-wrapper">
          <EvaluationAssessmentList
            workspaces={workspaces}
            selectedAssessment={selectedAssessment}
          />

          <EvaluationExamsList
            workspaces={workspaces}
            selectedAssessment={selectedAssessment}
          />

          <EvaluationJournalEventList
            workspaces={workspaces}
            selectedAssessment={selectedAssessment}
          />
          <div className="evaluation-modal__content">
            <div className="evaluation-modal__content-title">
              {t("labels.languageProfile")}
            </div>
            <div className="evaluation-modal__item">
              <UserLanguageProfile userId={selectedAssessment.userEntityId} />
            </div>
          </div>
        </div>
      </section>
      <section className="evaluation-modal__container">
        <header className="evaluation-modal__header evaluation-modal__header--workspace">
          <div className="evaluation-modal__header-title evaluation-modal__header-title--workspace">
            {selectedAssessment.workspaceName}
          </div>
        </header>
        <div className="evaluation-modal__content-wrapper">
          <div className="evaluation-modal__content">
            <div className="evaluation-modal__content-title">
              {t("labels.evaluationHistory", {
                ns: "evaluation",
              })}
            </div>
            <div className="evaluation-modal__content-body">
              {evaluation.evaluationAssessmentEvents.state === "READY" ? (
                evaluationEventContentCards
              ) : (
                <div className="loader-empty" />
              )}

              {isCombinationWorkspace ? (
                selectedAssessment.subjects.map((subject) => {
                  let workspaceEditorOpen = false;
                  let supplementationEditorOpen = false;

                  if (state.showWorkspaceEvaluationDrawer) {
                    if (!state.edit && state.subjectToBeEvaluated) {
                      workspaceEditorOpen =
                        state.subjectToBeEvaluated.identifier ===
                        subject.identifier;
                    } else if (
                      state.edit &&
                      state.subjectEvaluationToBeEditedIdentifier !== null
                    ) {
                      workspaceEditorOpen =
                        state.subjectEvaluationToBeEditedIdentifier ===
                        subject.identifier;
                    }
                  }

                  if (state.showWorkspaceSupplemenationDrawer) {
                    if (!state.edit && state.subjectToBeEvaluated) {
                      supplementationEditorOpen =
                        state.subjectToBeEvaluated.identifier ===
                        subject.identifier;
                    } else if (
                      state.edit &&
                      state.subjectEvaluationToBeEditedIdentifier !== null
                    ) {
                      supplementationEditorOpen =
                        state.subjectEvaluationToBeEditedIdentifier ===
                        subject.identifier;
                    }
                  }

                  return (
                    <div key={subject.identifier}>
                      <SlideDrawer
                        title={t("labels.workspaceEvaluation", {
                          ns: "evaluation",
                        })}
                        closeIconModifiers={["evaluation"]}
                        modifiers={["workspace"]}
                        show={workspaceEditorOpen}
                        onClose={handleCloseWorkspaceEvaluationDrawer}
                      >
                        <WorkspaceEditor
                          eventId={state.eventByIdOpened}
                          editorLabel={t("labels.literalEvaluation", {
                            ns: "evaluation",
                          })}
                          assignmentInfoArray={assignmentInfoArray}
                          examInfoArray={examInfoArray}
                          workspaceSubjectToBeEvaluatedIdentifier={
                            subject.identifier
                          }
                          selectedAssessment={selectedAssessment}
                          onClose={handleCloseWorkspaceEvaluationDrawer}
                          type={state.edit ? "edit" : "new"}
                          onSuccesfulSave={handleWorkspaceSuccesfulSave(
                            state.edit
                              ? amountOfEvaluatedModules ===
                                  selectedAssessment.subjects.length
                              : amountOfEvaluatedModules ===
                                  selectedAssessment.subjects.length - 1 &&
                                  !Object.prototype.hasOwnProperty.call(
                                    latestEvaluatedEventIndexPerSubject,
                                    subject.identifier
                                  )
                          )}
                        />
                      </SlideDrawer>
                      <SlideDrawer
                        title={t("labels.workspaceSupplementationRequest", {
                          ns: "evaluation",
                        })}
                        closeIconModifiers={["evaluation"]}
                        modifiers={["supplementation"]}
                        show={supplementationEditorOpen}
                        onClose={
                          handleCloseWorkspaceSupplementationEvaluationDrawer
                        }
                      >
                        <SupplementationEditor
                          eventId={state.eventByIdOpened}
                          editorLabel={t("labels.literalEvaluation", {
                            ns: "evaluation",
                          })}
                          onClose={
                            handleCloseWorkspaceSupplementationEvaluationDrawer
                          }
                          workspaceSubjectToBeEvaluatedIdentifier={
                            subject.identifier
                          }
                          selectedAssessment={selectedAssessment}
                          type={state.edit ? "edit" : "new"}
                        />
                      </SlideDrawer>
                    </div>
                  );
                })
              ) : state.subjectToBeEvaluated ? (
                <>
                  <div>
                    <SlideDrawer
                      title={t("labels.workspaceEvaluation", {
                        ns: "evaluation",
                      })}
                      closeIconModifiers={["evaluation"]}
                      modifiers={["workspace"]}
                      show={state.showWorkspaceEvaluationDrawer}
                      onClose={handleCloseWorkspaceEvaluationDrawer}
                    >
                      <WorkspaceEditor
                        eventId={state.eventByIdOpened}
                        editorLabel={t("labels.literalEvaluation", {
                          ns: "evaluation",
                        })}
                        assignmentInfoArray={assignmentInfoArray}
                        examInfoArray={examInfoArray}
                        selectedAssessment={selectedAssessment}
                        workspaceSubjectToBeEvaluatedIdentifier={
                          state.subjectToBeEvaluated.identifier
                        }
                        onClose={handleCloseWorkspaceEvaluationDrawer}
                        type={state.edit ? "edit" : "new"}
                        onSuccesfulSave={handleWorkspaceSuccesfulSave(true)}
                      />
                    </SlideDrawer>
                  </div>
                  <SlideDrawer
                    title={t("labels.workspaceSupplementationRequest", {
                      ns: "evaluation",
                    })}
                    closeIconModifiers={["evaluation"]}
                    modifiers={["supplementation"]}
                    show={state.showWorkspaceSupplemenationDrawer}
                    onClose={
                      handleCloseWorkspaceSupplementationEvaluationDrawer
                    }
                  >
                    <SupplementationEditor
                      eventId={state.eventByIdOpened}
                      editorLabel={t("labels.literalEvaluation", {
                        ns: "evaluation",
                      })}
                      onClose={
                        handleCloseWorkspaceSupplementationEvaluationDrawer
                      }
                      workspaceSubjectToBeEvaluatedIdentifier={
                        state.subjectToBeEvaluated.identifier
                      }
                      selectedAssessment={selectedAssessment}
                      type={state.edit ? "edit" : "new"}
                    />
                  </SlideDrawer>
                </>
              ) : null}
            </div>

            <div className="evaluation-modal__content-footer">
              <div className="evaluation-modal__content-selector">
                {selectedAssessment.subjects.length > 1 ? (
                  <select
                    className="form-element__select form-element__select--evaluation"
                    onChange={handleSelectSubjectEvaluationChange}
                  >
                    <option value="">
                      {t("actions.pickModule", {
                        ns: "evaluation",
                      })}
                    </option>
                    {selectedAssessment.subjects.map((subject) => {
                      const selectItemName = `${subject.subject.code}${
                        subject.courseNumber ? subject.courseNumber : ""
                      } - ${subject.subject.name}`;

                      return (
                        <option
                          key={subject.identifier}
                          value={subject.identifier}
                        >
                          {selectItemName}
                        </option>
                      );
                    })}
                  </select>
                ) : null}
              </div>
              <div className="evaluation-modal__content-buttonset">
                <Button
                  className={
                    isAllAssignmentsLocked
                      ? "button--evaluation-unlock-assignments"
                      : "button--evaluation-lock-assignments"
                  }
                  disabled={
                    evaluation.evaluationCurrentStudentAssigments.state ===
                    "LOADING"
                  }
                  onClick={handleToggleAllLockedAssignment}
                >
                  {isAllAssignmentsLocked
                    ? t("actions.unlockAssignments", {
                        ns: "evaluation",
                      })
                    : t("actions.lockAssignments", {
                        ns: "evaluation",
                      })}
                </Button>
              </div>
              <div className="evaluation-modal__content-buttonset">
                <Button
                  onClick={handleOpenWorkspaceEvaluationDrawer}
                  buttonModifiers={["evaluation-add-assessment"]}
                  disabled={
                    evaluation.evaluationAssessmentEvents.state === "LOADING" ||
                    evaluation.basePrice.state === "LOADING" ||
                    (selectedAssessment.subjects.length > 1 &&
                      !state.subjectToBeEvaluated)
                  }
                >
                  {isEvaluated &&
                  isSelectedSubjectEvaluated &&
                  state.subjectToBeEvaluated
                    ? t("actions.improveGrade", {
                        ns: "evaluation",
                      })
                    : t("actions.grade", {
                        ns: "evaluation",
                        context: "workspace",
                      })}
                </Button>
                <Button
                  onClick={handleOpenWorkspaceSupplementationEvaluationDrawer}
                  buttonModifiers={["evaluation-add-supplementation"]}
                  disabled={
                    evaluation.evaluationAssessmentEvents.state === "LOADING" ||
                    evaluation.basePrice.state === "LOADING" ||
                    (selectedAssessment.subjects.length > 1 &&
                      !state.subjectToBeEvaluated)
                  }
                >
                  {t("actions.askSupplementation", {
                    ns: "evaluation",
                  })}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ArchiveDialog
        isOpen={state.archiveStudentDialog}
        onClose={handleCloseArchiveStudentDialog}
        place="modal"
        evaluationAssessmentRequest={selectedAssessment}
      />
    </div>
  );
};

export default withTranslation(["evaluation", "common"])(Evaluation);
