import * as React from "react";
import SlideDrawer from "./slide-drawer";
import EvaluationEventContentCard from "./evaluation-event-content-card";
import { connect, Dispatch } from "react-redux";
import { AnyActionType } from "~/actions/index";
import { StateType } from "~/reducers/index";
import { EvaluationState } from "~/reducers/main-function/evaluation/index";
import "~/sass/elements/evaluation.scss";
import EvaluationAssessmentAssignment from "./evaluation-assessment-assignment";
import {
  AssessmentRequest,
  EvaluationEnum,
  EvaluationWorkspace,
} from "~/@types/evaluation";
import EvaluationDiaryEvent from "./evaluation-diary-event";
import WorkspaceEditor from "./editors/workspace-editor";
import SupplementationEditor from "./editors/supplementation-editor";
import { StatusType } from "~/reducers/base/status";
import { i18nType } from "~/reducers/base/i18n";
import ArchiveDialog from "../../../dialogs/archive";
import { bindActionCreators } from "redux";
import Button from "~/components/general/button";
import {
  LoadEvaluationAssessmentRequest,
  LoadEvaluationAssessmentEvent,
  loadEvaluationAssessmentRequestsFromServer,
  loadEvaluationAssessmentEventsFromServer,
} from "~/actions/main-function/evaluation/evaluationActions";
import "~/sass/elements/assignment.scss";
import "~/sass/elements/empty.scss";
import { WorkspaceType } from "~/reducers/workspaces";
import Link from "~/components/general/link";

interface EvaluationDrawerProps {
  i18n: i18nType;
  status: StatusType;
  onClose?: () => void;
  evaluation: EvaluationState;
  currentWorkspace: WorkspaceType;
  selectedAssessment: AssessmentRequest;
  loadEvaluationAssessmentRequestsFromServer: LoadEvaluationAssessmentRequest;
  loadEvaluationAssessmentEventsFromServer: LoadEvaluationAssessmentEvent;
}

interface EvaluationDrawerState {
  archiveStudentDialog: boolean;
  showWorkspaceEvaluationDrawer: boolean;
  showWorkspaceSupplemenationDrawer: boolean;
  eventByIdOpened?: string;
  openAllDiaryEntries: boolean;
  openAllMaterialContent: boolean;
  edit?: boolean;
  showContent: boolean;
  listOfDiaryIds: number[];
  listOfAssignmentIds: number[];
  diaryFetched: boolean;
}

export const CKEditorConfig = (locale: string) => ({
  linkShowTargetTab: true,
  forcePasteAsPlainText: true,
  allowedContent: true, // disable content filtering to preserve all formatting of imported documents; fix for #263
  entities: false,
  entities_latin: false,
  entities_greek: false,
  language: locale,
  format_tags: "p;h3;h4",
  colorButton_colors:
    "000000,800000,8B4513,2F4F4F,008080,000080,4B0082,B22222,A52A2A,DAA520,006400,40E0D0,0000CD,800080,808080,FF0000,FF8C00,FFD700,008000,00FFFF,0000FF,EE82EE,A9A9A9,FFA07A,FFA500,FFFF00,00FF00,AFEEEE,ADD8E6,DDA0DD,D3D3D3,FFF0F5,FAEBD7,FFFFE0,F0FFF0,F0FFFF,F0F8FF,E6E6FA,FFFFFF",
  height: 400,
  mathJaxLib:
    "//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_SVG",
  mathJaxClass: "math-tex", // This CANNOT be changed as cke saves this to database as part of documents html (wraps the formula in a span with specified className). Don't touch it! ... STOP TOUCHING IT!
  toolbar: [
    {
      name: "clipboard",
      items: ["Cut", "Copy", "Paste", "-", "Undo", "Redo"],
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
  removePlugins: "image",
  resize_enabled: true,
  extraPlugins: "divarea,image2,muikku-mathjax",
});

export class Evaluation extends React.Component<
  EvaluationDrawerProps,
  EvaluationDrawerState
> {
  /**
   * constructor
   * @param props
   */
  constructor(props: EvaluationDrawerProps) {
    super(props);

    this.state = {
      archiveStudentDialog: false,
      showWorkspaceEvaluationDrawer: false,
      showWorkspaceSupplemenationDrawer: false,
      showContent: false,
      openAllDiaryEntries: true,
      openAllMaterialContent: false,
      listOfDiaryIds: [],
      listOfAssignmentIds: [],
      diaryFetched: false,
    };
  }

  /**
   * componentDidUpdate
   * @param prevProps
   * @param prevState
   */
  componentDidUpdate(
    prevProps: EvaluationDrawerProps,
    prevState: EvaluationDrawerState
  ) {
    if (
      !this.state.diaryFetched &&
      this.props.evaluation.evaluationDiaryEntries &&
      this.props.evaluation.evaluationDiaryEntries.data &&
      this.props.evaluation.evaluationDiaryEntries.state === "READY"
    ) {
      const numberList = this.props.evaluation.evaluationDiaryEntries.data.map(
        (item) => item.id
      );

      this.setState({
        diaryFetched: true,
        listOfDiaryIds: numberList,
      });
    }
  }

  /**
   * getLatestEvaluatedEventIndex
   * @returns latest evaluated event index
   */
  getLatestEvaluatedEventIndex = () => {
    const { evaluationAssessmentEvents } = this.props.evaluation;

    if (
      evaluationAssessmentEvents.data &&
      evaluationAssessmentEvents.data.length > 0
    ) {
      let indexOfLatestEvaluatedEvent: number = null;

      for (let i = 0; i < evaluationAssessmentEvents.data.length; i++) {
        const event = evaluationAssessmentEvents.data[i];

        if (event.type !== EvaluationEnum.EVALUATION_REQUEST) {
          indexOfLatestEvaluatedEvent = i;
        }
      }

      return indexOfLatestEvaluatedEvent;
    }
  };

  /**
   * getLastEvaluatedEventIndex
   * @returns last index
   */
  getLastEvaluatedEventIndex = () => {
    const { evaluationAssessmentEvents } = this.props.evaluation;

    if (
      evaluationAssessmentEvents.data &&
      evaluationAssessmentEvents.data.length > 0
    ) {
      let indexOfLatestEvaluatedEvent: number = null;

      const lastEvent =
        evaluationAssessmentEvents.data[
          evaluationAssessmentEvents.data.length - 1
        ];

      if (
        lastEvent.type &&
        lastEvent.type !== EvaluationEnum.EVALUATION_REQUEST
      ) {
        indexOfLatestEvaluatedEvent =
          evaluationAssessmentEvents.data.length - 1;
      }

      return indexOfLatestEvaluatedEvent;
    }
  };

  /**
   * handleOpenDrawer
   */
  handleOpenWorkspaceEvaluationDrawer = () => {
    this.setState({
      showWorkspaceEvaluationDrawer: true,
    });
  };

  /**
   * handleCloseDrawer
   */
  handleWorkspaceEvaluationCloseDrawer = () => {
    if (this.state.edit) {
      this.setState({
        eventByIdOpened: undefined,
        edit: false,
        showWorkspaceEvaluationDrawer: false,
      });
    } else {
      this.setState({
        showWorkspaceEvaluationDrawer: false,
      });
    }
  };

  /**
   * handleOpenDrawer
   */
  handleOpenWorkspaceSupplementationEvaluationDrawer = () => {
    this.setState({
      showWorkspaceSupplemenationDrawer: true,
    });
  };

  /**
   * handleCloseDrawer
   */
  handleWorkspaceSupplementationEvaluationCloseDrawer = () => {
    if (this.state.edit) {
      this.setState({
        eventByIdOpened: undefined,
        edit: false,
        showWorkspaceSupplemenationDrawer: false,
      });
    } else {
      this.setState({
        showWorkspaceSupplemenationDrawer: false,
      });
    }
  };

  /**
   * handleOpenContent
   */
  handleOpenContent = () => {
    this.setState({
      showContent: !this.state.showContent,
    });
  };

  /**
   * handleOpenArchiveStudentDialog
   */
  handleOpenArchiveStudentDialog = () => {
    this.setState({
      archiveStudentDialog: true,
    });
  };

  /**
   * handleCloseArchiveStudentDialog
   */
  handleCloseArchiveStudentDialog = () => {
    this.setState({
      archiveStudentDialog: false,
    });
    this.props.loadEvaluationAssessmentEventsFromServer({
      assessment: this.props.evaluation.evaluationSelectedAssessmentId,
    });
  };

  /**
   * handleClickEdit
   * @param supplementation
   */
  handleClickEdit =
    (eventId: string, supplementation?: boolean) =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      if (supplementation) {
        this.setState({
          edit: true,
          showWorkspaceSupplemenationDrawer: true,
          eventByIdOpened: eventId,
        });
      } else {
        this.setState({
          edit: true,
          showWorkspaceEvaluationDrawer: true,
          eventByIdOpened: eventId,
        });
      }
    };

  /**
   * handleCloseAllDiaryEntries
   */
  handleCloseAllDiaryEntriesClick = () => {
    this.setState({
      listOfDiaryIds: [],
    });
  };

  /**
   * handleOpenAllDiaryEntries
   */
  handleOpenAllDiaryEntriesClick = () => {
    if (
      this.props.evaluation.evaluationDiaryEntries &&
      this.props.evaluation.evaluationDiaryEntries.data
    ) {
      const numberList = this.props.evaluation.evaluationDiaryEntries.data.map(
        (item) => item.id
      );

      this.setState({
        listOfDiaryIds: numberList,
      });
    }
  };

  /**
   * handleCloseAllMaterialContentEntriesClick
   */
  handleCloseAllMaterialContentClick = () => {
    this.setState({
      listOfAssignmentIds: [],
    });
  };

  /**
   * handleOpenAllMaterialContentClick
   */
  handleOpenAllMaterialContentClick = () => {
    if (
      this.props.evaluation.evaluationCurrentStudentAssigments &&
      this.props.evaluation.evaluationCurrentStudentAssigments.data
    ) {
      const numberList =
        this.props.evaluation.evaluationCurrentStudentAssigments.data.assigments.map(
          (item) => item.id
        );

      this.setState({
        listOfAssignmentIds: numberList,
      });
    }
  };

  /**
   * handleCloseSpecificMaterialContent
   * @param materialId
   */
  handleCloseSpecificMaterialContent = (materialId: number) => {
    const listOfAssignmentIds = this.state.listOfAssignmentIds.filter(
      (id) => id !== materialId
    );

    this.setState({
      listOfAssignmentIds,
    });
  };

  /**
   * handleOpenDiaryEntryClick
   * @param id
   */
  handleOpenDiaryEntryClick = (id: number) => {
    let updatedList = [...this.state.listOfDiaryIds];

    const index = updatedList.findIndex((itemId) => itemId === id);

    if (index !== -1) {
      updatedList.splice(index, 1);
    } else {
      updatedList.push(id);
    }

    this.setState({
      listOfDiaryIds: updatedList,
    });
  };

  /**
   * handleOpenDiaryEntryClick
   * @param id
   */
  handleOpenMaterialClick = (id: number) => {
    let updatedList = [...this.state.listOfAssignmentIds];

    const index = updatedList.findIndex((itemId) => itemId === id);

    if (index !== -1) {
      updatedList.splice(index, 1);
    } else {
      updatedList.push(id);
    }

    this.setState({
      listOfAssignmentIds: updatedList,
    });
  };

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const { evaluationAssessmentEvents } = this.props.evaluation;

    const evaluationDiaryEvents =
      this.props.evaluation.evaluationDiaryEntries.data &&
      this.props.evaluation.evaluationDiaryEntries.data.length > 0 ? (
        this.props.evaluation.evaluationDiaryEntries.data.map((item) => {
          const isOpen = this.state.listOfDiaryIds.includes(item.id);

          return (
            <EvaluationDiaryEvent
              key={item.id}
              open={isOpen}
              {...item}
              onClickOpen={this.handleOpenDiaryEntryClick}
            />
          );
        })
      ) : (
        <div className="empty">
          <span>
            {this.props.i18n.text.get(
              "plugin.evaluation.evaluationModal.noJournals"
            )}
          </span>
        </div>
      );

    let isEvaluated = false;
    /**
     * This is because there must be chance to delete events
     * that were added before new "request" that students may request...
     * We pass it to evaluation event card component
     */
    let latestEvaluatedEventIndex = this.getLatestEvaluatedEventIndex();

    let lastEvaluatedEventIndex = this.getLastEvaluatedEventIndex();

    /**
     * evaluationEventContentCards
     */
    const evaluationEventContentCards =
      evaluationAssessmentEvents.data &&
      evaluationAssessmentEvents.data.length > 0 ? (
        evaluationAssessmentEvents.data.map((eItem, index) => {
          if (eItem.grade !== null) {
            isEvaluated = true;
          }

          const isNotRequest = eItem.type !== EvaluationEnum.EVALUATION_REQUEST;

          return (
            <EvaluationEventContentCard
              onClickEdit={this.handleClickEdit}
              key={index}
              {...eItem}
              showDeleteAndModify={
                lastEvaluatedEventIndex
                  ? lastEvaluatedEventIndex === index && isNotRequest
                  : latestEvaluatedEventIndex === index && isNotRequest
              }
            />
          );
        })
      ) : (
        <div className="empty">
          <span>
            {this.props.i18n.text.get(
              "plugin.evaluation.evaluationModal.noEvents"
            )}
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
      } as EvaluationWorkspace);
    }

    /**
     * renderEvaluationAssessmentAssignments
     */
    const renderEvaluationAssessmentAssignments =
      this.props.evaluation.evaluationCurrentStudentAssigments.data &&
      this.props.evaluation.evaluationCurrentStudentAssigments.data.assigments
        .length > 0 ? (
        this.props.evaluation.evaluationCurrentStudentAssigments.data.assigments.map(
          (item, i) => {
            const open = this.state.listOfAssignmentIds.includes(item.id);

            return (
              <EvaluationAssessmentAssignment
                key={i}
                workspace={workspaces.find(
                  (eWorkspace) =>
                    eWorkspace.id ===
                    this.props.evaluation.evaluationSelectedAssessmentId
                      .workspaceEntityId
                )}
                open={open}
                onClickOpen={this.handleOpenMaterialClick}
                assigment={item}
                onSave={this.handleCloseSpecificMaterialContent}
              />
            );
          }
        )
      ) : (
        <div className="empty">
          <span>
            {this.props.i18n.text.get(
              "plugin.evaluation.evaluationModal.noAssignmentsTitle"
            )}
          </span>
        </div>
      );

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
            <div className="evaluation-modal__content">
              <div className="evaluation-modal__content-title">
                <>
                  {this.props.i18n.text.get(
                    "plugin.evaluation.evaluationModal.assignmentsTitle"
                  )}
                  {this.props.evaluation.evaluationCurrentStudentAssigments
                    .state === "READY" &&
                  this.props.evaluation.evaluationCompositeReplies.state ===
                    "READY" ? (
                    <div className="evaluation-modal__content-actions">
                      <Link
                        className="link link--evaluation-close-open"
                        onClick={this.handleCloseAllMaterialContentClick}
                      >
                        {this.props.i18n.text.get(
                          "plugin.evaluation.evaluationModal.closeAll"
                        )}
                      </Link>
                      <Link
                        className="link link--evaluation-close-open"
                        onClick={this.handleOpenAllMaterialContentClick}
                      >
                        {this.props.i18n.text.get(
                          "plugin.evaluation.evaluationModal.openAll"
                        )}
                      </Link>
                    </div>
                  ) : null}
                </>
              </div>
              <div className="evaluation-modal__content-body">
                {this.props.evaluation.evaluationCurrentStudentAssigments
                  .state === "READY" &&
                this.props.evaluation.evaluationCompositeReplies.state ===
                  "READY" ? (
                  renderEvaluationAssessmentAssignments
                ) : (
                  <div className="loader-empty" />
                )}
              </div>
            </div>
            <div className="evaluation-modal__content">
              <div className="evaluation-modal__content-title">
                <>
                  {this.props.i18n.text.get(
                    "plugin.evaluation.evaluationModal.journalTitle"
                  )}
                  {this.props.evaluation.evaluationDiaryEntries.state ===
                  "READY" ? (
                    <div className="evaluation-modal__content-actions">
                      <Link
                        className="link link--evaluation-close-open"
                        onClick={this.handleCloseAllDiaryEntriesClick}
                      >
                        {this.props.i18n.text.get(
                          "plugin.evaluation.evaluationModal.closeAll"
                        )}
                      </Link>
                      <Link
                        className="link link--evaluation-close-open"
                        onClick={this.handleOpenAllDiaryEntriesClick}
                      >
                        {this.props.i18n.text.get(
                          "plugin.evaluation.evaluationModal.openAll"
                        )}
                      </Link>
                    </div>
                  ) : null}
                </>
              </div>
              <div className="evaluation-modal__content-body">
                {this.props.evaluation.evaluationDiaryEntries.state ===
                "READY" ? (
                  evaluationDiaryEvents
                ) : (
                  <div className="loader-empty" />
                )}
              </div>
            </div>
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
                {this.props.i18n.text.get(
                  "plugin.evaluation.evaluationModal.events.title"
                )}
              </div>
              <div className="evaluation-modal__content-body">
                {this.props.evaluation.evaluationAssessmentEvents.state ===
                "READY" ? (
                  evaluationEventContentCards
                ) : (
                  <div className="loader-empty" />
                )}

                <SlideDrawer
                  title={this.props.i18n.text.get(
                    "plugin.evaluation.evaluationModal.workspaceEvaluationForm.title"
                  )}
                  modifiers={["workspace"]}
                  show={this.state.showWorkspaceEvaluationDrawer}
                  onClose={this.handleWorkspaceEvaluationCloseDrawer}
                >
                  <WorkspaceEditor
                    eventId={this.state.eventByIdOpened}
                    editorLabel={this.props.i18n.text.get(
                      "plugin.evaluation.evaluationModal.workspaceEvaluationForm.literalAssessmentLabel"
                    )}
                    onClose={this.handleWorkspaceEvaluationCloseDrawer}
                    type={this.state.edit ? "edit" : "new"}
                    onSuccesfulSave={this.handleOpenArchiveStudentDialog}
                  />
                </SlideDrawer>

                <SlideDrawer
                  title={this.props.i18n.text.get(
                    "plugin.evaluation.evaluationModal.workspaceEvaluationForm.supplementationTitle"
                  )}
                  modifiers={["supplementation"]}
                  show={this.state.showWorkspaceSupplemenationDrawer}
                  onClose={
                    this.handleWorkspaceSupplementationEvaluationCloseDrawer
                  }
                >
                  <SupplementationEditor
                    eventId={this.state.eventByIdOpened}
                    editorLabel={this.props.i18n.text.get(
                      "plugin.evaluation.evaluationModal.workspaceEvaluationForm.literalSupplementationLabel"
                    )}
                    onClose={
                      this.handleWorkspaceSupplementationEvaluationCloseDrawer
                    }
                    type={this.state.edit ? "edit" : "new"}
                  />
                </SlideDrawer>
              </div>

              <div className="evaluation-modal__content-buttonset">
                <Button
                  onClick={this.handleOpenWorkspaceEvaluationDrawer}
                  buttonModifiers={["evaluation-add-assessment"]}
                  disabled={
                    this.props.evaluation.evaluationAssessmentEvents.state ===
                      "LOADING" ||
                    this.props.evaluation.basePrice.state === "LOADING"
                  }
                >
                  {isEvaluated
                    ? this.props.i18n.text.get(
                        "plugin.evaluation.evaluationModal.events.improvedGradeButton"
                      )
                    : this.props.i18n.text.get(
                        "plugin.evaluation.evaluationModal.events.gradeButton"
                      )}
                </Button>
                <Button
                  onClick={
                    this.handleOpenWorkspaceSupplementationEvaluationDrawer
                  }
                  buttonModifiers={["evaluation-add-supplementation"]}
                  disabled={
                    this.props.evaluation.evaluationAssessmentEvents.state ===
                      "LOADING" ||
                    this.props.evaluation.basePrice.state === "LOADING"
                  }
                >
                  {this.props.i18n.text.get(
                    "plugin.evaluation.evaluationModal.events.supplementationButton"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </section>
        <ArchiveDialog
          isOpen={this.state.archiveStudentDialog}
          onClose={this.handleCloseArchiveStudentDialog}
          place="modal"
          {...this.props.evaluation.evaluationSelectedAssessmentId}
        />
      </div>
    );
  }
}

/**
 * mapStateToProps
 * @param state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    status: state.status,
    evaluation: state.evaluations,
    currentWorkspace: state.workspaces.currentWorkspace,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
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

export default connect(mapStateToProps, mapDispatchToProps)(Evaluation);
