import * as React from "react";
import SlideDrawer from "./slide-drawer";
import EvaluationEventContentCard from "./evaluation-event-content-card";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "~/actions/index";
import { StateType } from "~/reducers/index";
import { EvaluationState } from "~/reducers/main-function/evaluation/index";
import "~/sass/elements/evaluation.scss";
import { EvaluationLatestSubjectEvaluationIndex } from "~/@types/evaluation";
import WorkspaceEditor from "./editors/workspace-editor";
import SupplementationEditor from "./editors/supplementation-editor";
import { StatusType } from "~/reducers/base/status";
import ArchiveDialog from "../../../dialogs/archive";
import { bindActionCreators } from "redux";
import Button from "~/components/general/button";
import { MATHJAXSRC } from "~/lib/mathjax";
import {
  LoadEvaluationAssessmentRequest,
  LoadEvaluationAssessmentEvent,
  loadEvaluationAssessmentRequestsFromServer,
  loadEvaluationAssessmentEventsFromServer,
} from "~/actions/main-function/evaluation/evaluationActions";
import "~/sass/elements/assignment.scss";
import "~/sass/elements/empty.scss";
import { WorkspaceDataType } from "~/reducers/workspaces";
import EvaluationJournalEventList from "./evaluation-journal-event-list";
import EvaluationAssessmentList from "./evaluation-assessment-list";
import {
  EvaluationAssessmentRequest,
  WorkspaceSubject,
  MaterialCompositeReply,
} from "~/generated/client";
import { WithTranslation, withTranslation } from "react-i18next";

/**
 * EvaluationDrawerProps
 */
interface EvaluationDrawerProps extends WithTranslation {
  status: StatusType;
  onClose?: () => void;
  evaluation: EvaluationState;
  currentWorkspace: WorkspaceDataType;
  /**
   * Assessment that is opened
   */
  selectedAssessment: EvaluationAssessmentRequest;
  /**
   * Loader action for loading evaluation assessment requests
   */
  loadEvaluationAssessmentRequestsFromServer: LoadEvaluationAssessmentRequest;
  /**
   * Loader action for loading assessment events
   */
  loadEvaluationAssessmentEventsFromServer: LoadEvaluationAssessmentEvent;
}

/**
 * EvaluationDrawerState
 */
interface EvaluationDrawerState {
  archiveStudentDialog: boolean;
  showWorkspaceEvaluationDrawer: boolean;
  showWorkspaceSupplemenationDrawer: boolean;
  eventByIdOpened?: string;
  edit?: boolean;
  /**
   * Object that contains subject properties that are needed for evaluation
   */
  subjectToBeEvaluated?: WorkspaceSubject;
  /**
   * subject evaluation identifier for event that is edited
   */
  subjectEvaluationToBeEditedIdentifier: string | null;
}

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
 * Evaluation
 */
export class Evaluation extends React.Component<
  EvaluationDrawerProps,
  EvaluationDrawerState
> {
  /**
   * constructor
   *
   * @param props props
   */
  constructor(props: EvaluationDrawerProps) {
    super(props);

    this.state = {
      archiveStudentDialog: false,
      showWorkspaceEvaluationDrawer: false,
      showWorkspaceSupplemenationDrawer: false,
      subjectToBeEvaluated: undefined,
      subjectEvaluationToBeEditedIdentifier: null,
    };
  }

  /**
   * componentDidMount
   */
  componentDidMount(): void {
    if (this.props.selectedAssessment) {
      /**
       * If there is more than one subject, then its combination workspace
       */
      const isCombinationWorkspace =
        this.props.selectedAssessment.subjects.length > 1;

      /**
       * If not, then first item is default always
       */
      if (!isCombinationWorkspace) {
        this.setState({
          subjectToBeEvaluated: this.props.selectedAssessment.subjects[0],
        });
      }
    }
  }

  /**
   * Gets latest evealuated event index by subject identifier and returns that as object
   * If there is not any evaluation, then it doesn't return anything
   *
   * @param identifier subject identifier
   * @returns object containing latest evaluated event index by subject identifier
   */
  getLatestEvaluatedEventIndex = (
    identifier: string
  ): EvaluationLatestSubjectEvaluationIndex => {
    const { evaluationAssessmentEvents } = this.props.evaluation;

    if (
      evaluationAssessmentEvents.data &&
      evaluationAssessmentEvents.data.length > 0
    ) {
      let indexOfLatestEvaluatedEvent: number = null;

      for (let i = 0; i < evaluationAssessmentEvents.data.length; i++) {
        const event = evaluationAssessmentEvents.data[i];

        if (
          event.workspaceSubjectIdentifier === identifier &&
          event.type !== "EVALUATION_REQUEST"
        ) {
          indexOfLatestEvaluatedEvent = i;
        }
      }

      return (
        indexOfLatestEvaluatedEvent !== null && {
          [identifier]: indexOfLatestEvaluatedEvent,
        }
      );
    }
  };

  /**
   * Checks if latest event is supplementation request
   *
   * @returns boolean whether latest event is supplementation request
   */
  isLatestEventSupplementationRequest = (): boolean => {
    const { evaluationAssessmentEvents } = this.props.evaluation;

    if (
      evaluationAssessmentEvents.data &&
      evaluationAssessmentEvents.data.length > 0
    ) {
      const lastEvent =
        evaluationAssessmentEvents.data[
          evaluationAssessmentEvents.data.length - 1
        ];

      return lastEvent.type === "SUPPLEMENTATION_REQUEST";
    }

    return false;
  };

  /**
   * Shows hidden evaluation assignment if it's has been submitted and assignment
   * is set to be hidden
   *
   * @param compositeReply assignment compositereply
   * @returns boolean whether to show assignment or not
   */
  showAsHiddenEvaluationAssignment = (
    compositeReply?: MaterialCompositeReply
  ): boolean => compositeReply && compositeReply.submitted !== null;

  /**
   * Handles open workspace evaluation drawer
   */
  handleOpenWorkspaceEvaluationDrawer = () => {
    this.setState({
      showWorkspaceEvaluationDrawer: true,
    });
  };

  /**
   * Handles close workspace evaluation drawer
   */
  handleCloseWorkspaceEvaluationDrawer = () => {
    if (this.state.edit) {
      this.setState({
        eventByIdOpened: undefined,
        edit: false,
        showWorkspaceEvaluationDrawer: false,
        subjectEvaluationToBeEditedIdentifier: null,
      });
    } else {
      this.setState({
        showWorkspaceEvaluationDrawer: false,
      });
    }
  };

  /**
   * Handles open workspace supplementation evaluation drawer
   */
  handleOpenWorkspaceSupplementationEvaluationDrawer = () => {
    this.setState({
      showWorkspaceSupplemenationDrawer: true,
    });
  };

  /**
   * Handles close workspace supplementation evaluation drawer
   */
  handleCloseWorkspaceSupplementationEvaluationDrawer = () => {
    if (this.state.edit) {
      this.setState({
        eventByIdOpened: undefined,
        edit: false,
        showWorkspaceSupplemenationDrawer: false,
        subjectEvaluationToBeEditedIdentifier: null,
      });
    } else {
      this.setState({
        showWorkspaceSupplemenationDrawer: false,
      });
    }
  };

  /**
   * Handles workspace suffesful save by loading events again or opening
   * archive dialog if booleans value is true
   *
   * @param openArchiveDialog openArchiveDialog
   */
  handleWorkspaceSuccesfulSave = (openArchiveDialog: boolean) => () => {
    if (openArchiveDialog) {
      this.setState({
        archiveStudentDialog: true,
      });
    } else {
      this.props.loadEvaluationAssessmentEventsFromServer({
        assessment: this.props.selectedAssessment,
      });
    }
  };

  /**
   * Handles open archive student dialog
   */
  handleOpenArchiveStudentDialog = () => {
    this.setState({
      archiveStudentDialog: true,
    });
  };

  /**
   * Handles close archive student dialog
   */
  handleCloseArchiveStudentDialog = () => {
    this.setState({
      archiveStudentDialog: false,
    });
    this.props.loadEvaluationAssessmentEventsFromServer({
      assessment: this.props.selectedAssessment,
    });
  };

  /**
   * Handles edit event click
   *
   * @param eventId eventId
   * @param workspaceSubjectIdentifier workspaceSubjectIdentifier
   * @param supplementation supplementation
   */
  handleClickEdit =
    (
      eventId: string,
      workspaceSubjectIdentifier: string | null,
      supplementation?: boolean
    ) =>
    () => {
      if (supplementation) {
        this.setState({
          edit: true,
          showWorkspaceSupplemenationDrawer: true,
          subjectEvaluationToBeEditedIdentifier: workspaceSubjectIdentifier,
          eventByIdOpened: eventId,
        });
      } else {
        this.setState({
          edit: true,
          showWorkspaceEvaluationDrawer: true,
          subjectEvaluationToBeEditedIdentifier: workspaceSubjectIdentifier,
          eventByIdOpened: eventId,
        });
      }
    };

  /**
   * Handles select subject evaluation change
   *
   * @param e e
   */
  handleSelectSubjectEvaluationChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const subject = this.props.selectedAssessment.subjects.find(
      (sItem) => sItem.identifier === e.currentTarget.value
    );

    this.setState({
      subjectToBeEvaluated: subject,
    });
  };

  /**
   * Component render method
   *
   * @returns JSX.Element
   */
  render() {
    const {
      subjectToBeEvaluated,
      edit,
      eventByIdOpened,
      showWorkspaceEvaluationDrawer,
    } = this.state;

    const { selectedAssessment, t } = this.props;

    const { evaluationAssessmentEvents } = this.props.evaluation;

    const isCombinationWorkspace = selectedAssessment.subjects.length > 1;

    /**
     * If latest event is supplementation request
     */
    const latestEventIsSupplementationRequest =
      this.isLatestEventSupplementationRequest();

    /**
     * If there is any existing evaluation in workspace
     */
    let isEvaluated = false;

    /**
     * If one selected subject of workspace is evaluated. This will affect whether next evaluation is normal or
     * raise
     */
    let isSelectedSubjectEvaluated = false;

    const latestEvaluatedEventIndexPerSubject = selectedAssessment.subjects
      .map((sItem) => this.getLatestEvaluatedEventIndex(sItem.identifier))
      .reduce((r, c) => Object.assign(r, c), {});

    const amountOfEvaluatedModules = Object.keys(
      latestEvaluatedEventIndexPerSubject
    ).length;

    const evaluationsEvents = evaluationAssessmentEvents.data || [];

    if (subjectToBeEvaluated) {
      /**
       * If selected subject is evaluated in combination workspace with grade
       */
      const subject =
        evaluationsEvents.length > 0 &&
        evaluationsEvents.find(
          (event) =>
            event.workspaceSubjectIdentifier === subjectToBeEvaluated.identifier
        );

      isSelectedSubjectEvaluated = subject && subject.grade !== null;
    }

    /**
     * evaluationEventContentCards
     */
    const evaluationEventContentCards =
      evaluationsEvents.length > 0 ? (
        evaluationAssessmentEvents.data.map((eItem, index) => {
          if (eItem.grade !== null) {
            isEvaluated = true;
          }

          const isInterimEvaluation =
            eItem.type === "INTERIM_EVALUATION" ||
            eItem.type === "INTERIM_EVALUATION_REQUEST" ||
            eItem.type === "INTERIM_EVALUATION_REQUEST_CANCELLED";

          /**
           * Is not evaluation request boolean
           */
          const isRequestOrCancelled =
            eItem.type === "EVALUATION_REQUEST" ||
            eItem.type === "EVALUATION_REQUEST_CANCELLED";

          /**
           * Is supplementation request boolean
           */
          const isSupplementationRequest =
            eItem.type === "SUPPLEMENTATION_REQUEST";

          if (isCombinationWorkspace) {
            /**
             * Whether current element is latest evaluation for module
             */
            const isLatestEvaluationForModule =
              latestEvaluatedEventIndexPerSubject[
                eItem.workspaceSubjectIdentifier
              ] === index;

            /**
             * Next event is not request. Default value true
             */
            let nextIsNotRequest = true;

            /**
             * supplementation request can be deleted. Default value true
             */
            let canDeleteSupplementationRequest = true;

            /**
             * We only check items before last element
             */
            if (evaluationAssessmentEvents.data.length - 1 !== index) {
              /**
               * Creating help array that contains remaining events from current element forward
               */
              const remainingEvents = evaluationAssessmentEvents.data.slice(
                index + 1
              );

              /**
               * Checking if remaining event array doesn't contain evaluation or
               * supplementation request event for normal workspace. If combination then only evaluation requests matters
               */
              nextIsNotRequest =
                remainingEvents.find((j) => j.type === "EVALUATION_REQUEST") ===
                undefined;

              /**
               * If event is supplementation request...
               */
              if (isSupplementationRequest) {
                /**
                 * Check if remaining events contains same type of event with same workspace identifier
                 * if it doesn't then event can be deleted
                 */
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
                onClickEdit={this.handleClickEdit}
                key={index}
                selectedAssessment={this.props.selectedAssessment}
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

          /**
           * Is event latest one. Only latest event can be deleted
           */
          const isLatestEvent =
            evaluationAssessmentEvents.data.length - 1 === index;

          return (
            <EvaluationEventContentCard
              onClickEdit={this.handleClickEdit}
              key={index}
              selectedAssessment={this.props.selectedAssessment}
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

    const workspaces = [...this.props.evaluation.evaluationWorkspaces];

    /**
     * This is because, when admin goes to workspace where he/she is not
     * workspace teacher, the select list will be missing that current active workspace.
     * So here we check if its not in the list and push currentWorkspace as temporary option
     */
    if (
      this.props.currentWorkspace &&
      !this.props.evaluation.evaluationWorkspaces.some(
        (eWorkspace) => eWorkspace.id === this.props.currentWorkspace.id
      )
    ) {
      workspaces.push({
        ...this.props.currentWorkspace,
      } as WorkspaceDataType);
    }

    return (
      <div className="evaluation-modal">
        <div
          onClick={this.props.onClose}
          className="evaluation-modal__close icon-cross"
        ></div>

        <section className="evaluation-modal__container">
          <header className="evaluation-modal__header evaluation-modal__header--student">
            <div className="evaluation-modal__header-title">{`${this.props.selectedAssessment.lastName}, ${this.props.selectedAssessment.firstName} (${this.props.selectedAssessment.studyProgramme})`}</div>
          </header>

          <div className="evaluation-modal__content-wrapper">
            <EvaluationAssessmentList
              workspaces={workspaces}
              selectedAssessment={this.props.selectedAssessment}
            />
            <EvaluationJournalEventList
              selectedAssessment={this.props.selectedAssessment}
            />
          </div>
        </section>
        <section className="evaluation-modal__container">
          <header className="evaluation-modal__header evaluation-modal__header--workspace">
            <div className="evaluation-modal__header-title">
              {this.props.selectedAssessment.workspaceName}
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
                {this.props.evaluation.evaluationAssessmentEvents.state ===
                "READY" ? (
                  evaluationEventContentCards
                ) : (
                  <div className="loader-empty" />
                )}

                {isCombinationWorkspace ? (
                  this.props.selectedAssessment.subjects.map((subject) => {
                    let workspaceEditorOpen = false;
                    let supplementationEditorOpen = false;

                    /**
                     * If show workspace evaluation drawer
                     */
                    if (this.state.showWorkspaceEvaluationDrawer) {
                      /**
                       * Normal evaluation proces, there must be selected subject
                       */
                      if (!edit && this.state.subjectToBeEvaluated) {
                        workspaceEditorOpen =
                          this.state.subjectToBeEvaluated.identifier ===
                          subject.identifier;
                      } else if (
                        edit &&
                        this.state.subjectEvaluationToBeEditedIdentifier !==
                          null
                      ) {
                        /**
                         * When editing existing workspace event
                         */
                        workspaceEditorOpen =
                          this.state.subjectEvaluationToBeEditedIdentifier ===
                          subject.identifier;
                      }
                    }

                    /**
                     * If show supplementation evaluation drawer
                     */
                    if (this.state.showWorkspaceSupplemenationDrawer) {
                      /**
                       * Normal evaluation process, there must be selected subject
                       */
                      if (!edit && this.state.subjectToBeEvaluated) {
                        supplementationEditorOpen =
                          this.state.subjectToBeEvaluated.identifier ===
                          subject.identifier;
                      } else if (
                        edit &&
                        this.state.subjectEvaluationToBeEditedIdentifier !==
                          null
                      ) {
                        /**
                         * When editing existing supplementation event
                         */
                        supplementationEditorOpen =
                          this.state.subjectEvaluationToBeEditedIdentifier ===
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
                          onClose={this.handleCloseWorkspaceEvaluationDrawer}
                        >
                          <WorkspaceEditor
                            eventId={eventByIdOpened}
                            editorLabel={t("labels.literalEvaluation", {
                              ns: "evaluation",
                            })}
                            workspaceSubjectToBeEvaluatedIdentifier={
                              subject.identifier
                            }
                            selectedAssessment={this.props.selectedAssessment}
                            onClose={this.handleCloseWorkspaceEvaluationDrawer}
                            type={edit ? "edit" : "new"}
                            onSuccesfulSave={this.handleWorkspaceSuccesfulSave(
                              edit
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
                            this
                              .handleCloseWorkspaceSupplementationEvaluationDrawer
                          }
                        >
                          <SupplementationEditor
                            eventId={eventByIdOpened}
                            editorLabel={t("labels.literalEvaluation", {
                              ns: "evaluation",
                            })}
                            onClose={
                              this
                                .handleCloseWorkspaceSupplementationEvaluationDrawer
                            }
                            workspaceSubjectToBeEvaluatedIdentifier={
                              subject.identifier
                            }
                            selectedAssessment={this.props.selectedAssessment}
                            type={edit ? "edit" : "new"}
                          />
                        </SlideDrawer>
                      </div>
                    );
                  })
                ) : subjectToBeEvaluated ? (
                  <>
                    <div>
                      <SlideDrawer
                        title={t("labels.workspaceEvaluation", {
                          ns: "evaluation",
                        })}
                        closeIconModifiers={["evaluation"]}
                        modifiers={["workspace"]}
                        show={showWorkspaceEvaluationDrawer}
                        onClose={this.handleCloseWorkspaceEvaluationDrawer}
                      >
                        <WorkspaceEditor
                          eventId={eventByIdOpened}
                          editorLabel={t("labels.literalEvaluation", {
                            ns: "evaluation",
                          })}
                          selectedAssessment={this.props.selectedAssessment}
                          workspaceSubjectToBeEvaluatedIdentifier={
                            subjectToBeEvaluated.identifier
                          }
                          onClose={this.handleCloseWorkspaceEvaluationDrawer}
                          type={edit ? "edit" : "new"}
                          onSuccesfulSave={this.handleOpenArchiveStudentDialog}
                        />
                      </SlideDrawer>
                    </div>
                    <SlideDrawer
                      title={t("labels.workspaceSupplementationRequest", {
                        ns: "evaluation",
                      })}
                      closeIconModifiers={["evaluation"]}
                      modifiers={["supplementation"]}
                      show={this.state.showWorkspaceSupplemenationDrawer}
                      onClose={
                        this.handleCloseWorkspaceSupplementationEvaluationDrawer
                      }
                    >
                      <SupplementationEditor
                        eventId={eventByIdOpened}
                        editorLabel={t("labels.literalEvaluation", {
                          ns: "evaluation",
                        })}
                        onClose={
                          this
                            .handleCloseWorkspaceSupplementationEvaluationDrawer
                        }
                        workspaceSubjectToBeEvaluatedIdentifier={
                          subjectToBeEvaluated.identifier
                        }
                        selectedAssessment={this.props.selectedAssessment}
                        type={edit ? "edit" : "new"}
                      />
                    </SlideDrawer>
                  </>
                ) : null}
              </div>

              <div className="evaluation-modal__content-footer">
                <div className="evaluation-modal__content-selector">
                  {this.props.selectedAssessment.subjects.length > 1 ? (
                    <select
                      className="form-element__select form-element__select--evaluation"
                      onChange={this.handleSelectSubjectEvaluationChange}
                    >
                      <option value="">
                        {t("actions.pickModule", {
                          ns: "evaluation",
                        })}
                      </option>
                      {this.props.selectedAssessment.subjects.map((subject) => {
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
                    onClick={this.handleOpenWorkspaceEvaluationDrawer}
                    buttonModifiers={["evaluation-add-assessment"]}
                    disabled={
                      this.props.evaluation.evaluationAssessmentEvents.state ===
                        "LOADING" ||
                      this.props.evaluation.basePrice.state === "LOADING" ||
                      (this.props.selectedAssessment.subjects.length > 1 &&
                        !subjectToBeEvaluated)
                    }
                  >
                    {isEvaluated &&
                    isSelectedSubjectEvaluated &&
                    subjectToBeEvaluated
                      ? t("actions.improveGrade", {
                          ns: "evaluation",
                        })
                      : t("actions.grade", {
                          ns: "evaluation",
                          context: "workspace",
                        })}
                  </Button>
                  <Button
                    onClick={
                      this.handleOpenWorkspaceSupplementationEvaluationDrawer
                    }
                    buttonModifiers={["evaluation-add-supplementation"]}
                    disabled={
                      this.props.evaluation.evaluationAssessmentEvents.state ===
                        "LOADING" ||
                      this.props.evaluation.basePrice.state === "LOADING" ||
                      (this.props.selectedAssessment.subjects.length > 1 &&
                        !subjectToBeEvaluated)
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
          isOpen={this.state.archiveStudentDialog}
          onClose={this.handleCloseArchiveStudentDialog}
          place="modal"
          evaluationAssessmentRequest={this.props.selectedAssessment}
        />
      </div>
    );
  }
}

/**
 * mapStateToProps
 *
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    status: state.status,
    evaluation: state.evaluations,
    currentWorkspace: state.workspaces.currentWorkspace,
  };
}

/**
 * mapDispatchToProps
 *
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    {
      loadEvaluationAssessmentRequestsFromServer,
      loadEvaluationAssessmentEventsFromServer,
    },
    dispatch
  );
}

export default withTranslation(["evaluation", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(Evaluation)
);
