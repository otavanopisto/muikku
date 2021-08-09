import * as React from "react";
import { connect, Dispatch } from "react-redux";
import CKEditor from "~/components/general/ckeditor";
import { bindActionCreators } from "redux";
import { StateType } from "../../../../../../reducers/index";
import { AnyActionType } from "../../../../../../actions/index";
import { StatusType } from "../../../../../../reducers/base/status";
import { EvaluationState } from "../../../../../../reducers/main-function/evaluation/index";
import SessionStateComponent from "../../../../../general/session-state-component";
import { cleanWorkspaceAndSupplementationDrafts } from "../../../../dialogs/delete";
import Button from "~/components/general/button";
import {
  UpdateWorkspaceSupplementation,
  updateWorkspaceSupplementationToServer,
} from "../../../../../../actions/main-function/evaluation/evaluationActions";
import "~/sass/elements/evaluation.scss";
import { i18nType } from "../../../../../../reducers/base/i18n";

/**
 * SupplementationEditorProps
 */
interface SupplementationEditorProps {
  i18n: i18nType;
  status: StatusType;
  evaluations: EvaluationState;
  type?: "new" | "edit";
  editorLabel?: string;
  modifiers?: string[];
  onClose?: () => void;
  updateWorkspaceSupplementationToServer: UpdateWorkspaceSupplementation;
}

/**
 * SupplementationEditorState
 */
interface SupplementationEditorState {
  literalEvaluation: string;
  eventId: string;
}

/**
 * SupplementationEditor
 */
class SupplementationEditor extends SessionStateComponent<
  SupplementationEditorProps,
  SupplementationEditorState
> {
  /**
   * constructor
   * @param props
   */
  constructor(props: SupplementationEditorProps) {
    /**
     * This is wierd one, setting namespace and identificated type for it from props...
     */
    super(props, `supplementation-editor-${props.type ? props.type : "new"}`);

    const { evaluationAssessmentEvents } = props.evaluations;

    const latestIndex =
      evaluationAssessmentEvents.data &&
      evaluationAssessmentEvents.data.length - 1;

    const eventId =
      evaluationAssessmentEvents.data &&
      evaluationAssessmentEvents.data.length > 0 &&
      evaluationAssessmentEvents.data[latestIndex].identifier
        ? evaluationAssessmentEvents.data[latestIndex].identifier
        : "empty";

    this.state = this.getRecoverStoredState(
      {
        literalEvaluation: "",
        eventId,
      },
      eventId
    );
  }

  /**
   * componentDidMount
   */
  componentDidMount = () => {
    const { evaluationAssessmentEvents } = this.props.evaluations;

    const latestIndex =
      evaluationAssessmentEvents.data &&
      evaluationAssessmentEvents.data.length - 1;

    if (this.props.type === "edit") {
      this.setState(
        this.getRecoverStoredState(
          {
            literalEvaluation:
              evaluationAssessmentEvents.data &&
              evaluationAssessmentEvents.data[latestIndex].text,
          },
          this.state.eventId
        )
      );
    } else {
      this.setState(
        this.getRecoverStoredState(
          {
            literalEvaluation: "",
          },
          this.state.eventId
        )
      );
    }
  };

  /**
   * handleCKEditorChange
   * @param e
   */
  handleCKEditorChange = (e: string) => {
    this.setStateAndStore({ literalEvaluation: e }, this.state.eventId);
  };

  /**
   * handleEvaluationSupplementationSave
   */
  handleEvaluationSupplementationSave = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    const { evaluations, type = "new", onClose } = this.props;
    const { evaluationAssessmentEvents } = evaluations;

    if (type === "new") {
      this.props.updateWorkspaceSupplementationToServer({
        type: "new",
        workspaceSupplementation: {
          requestDate: new Date().getTime().toString(),
          requestText: this.state.literalEvaluation,
        },
        onSuccess: () => {
          cleanWorkspaceAndSupplementationDrafts(this.state.eventId);

          /**
           * Removes "new" items from localstorage
           */
          this.setStateAndClear(
            {
              literalEvaluation: "",
            },
            this.state.eventId
          );
          onClose();
        },
        onFail: () => onClose(),
      });
    } else {
      /**
       * Latest assessments event index whom identifier we want to get
       */
      const latestIndex =
        evaluationAssessmentEvents.data &&
        evaluationAssessmentEvents.data.length - 1;

      this.props.updateWorkspaceSupplementationToServer({
        type: "edit",
        workspaceSupplementation: {
          id:
            evaluationAssessmentEvents.data &&
            evaluationAssessmentEvents.data[latestIndex].identifier,
          requestDate: new Date().getTime().toString(),
          requestText: this.state.literalEvaluation,
        },
        onSuccess: () => {
          cleanWorkspaceAndSupplementationDrafts(this.state.eventId);

          /**
           * Removes "edit" items from localstorage
           */
          this.setStateAndClear(
            {
              literalEvaluation: "",
            },
            this.state.eventId
          );
          onClose();
        },
        onFail: () => onClose(),
      });
    }
  };

  /**
   * handleDeleteEditorDraft
   */
  handleDeleteEditorDraft = () => {
    if (this.props.type === "edit") {
      const { evaluationAssessmentEvents } = this.props.evaluations;
      const latestIndex =
        evaluationAssessmentEvents.data &&
        evaluationAssessmentEvents.data.length - 1;

      /**
       * If editing delete draft, and set back to default values from event data
       */
      this.setStateAndClear(
        {
          literalEvaluation:
            evaluationAssessmentEvents.data &&
            evaluationAssessmentEvents.data[latestIndex].text,
        },
        this.state.eventId
      );
    } else {
      /**
       * If making new, delete draft and set back to default values
       */
      this.setStateAndClear(
        {
          literalEvaluation: "",
        },
        this.state.eventId
      );
    }
  };

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    return (
      <>
        <div className="editor">
          {this.props.editorLabel && (
            <label className="drawer-editor-label">
              {this.props.editorLabel}
            </label>
          )}

          <CKEditor onChange={this.handleCKEditorChange}>
            {this.state.literalEvaluation}
          </CKEditor>
        </div>

        <div className="evaluation-modal-evaluate-form-row--buttons">
          <Button
            className={`eval-modal-evaluate-button eval-modal-evaluate-button--supplementation`}
            onClick={this.handleEvaluationSupplementationSave}
          >
            {this.props.i18n.text.get(
              "plugin.evaluation.evaluationModal.workspaceEvaluationForm.saveButtonLabel"
            )}
          </Button>
          <Button
            onClick={this.props.onClose}
            className="eval-modal-evaluate-button button-cancel"
          >
            {this.props.i18n.text.get(
              "plugin.evaluation.evaluationModal.workspaceEvaluationForm.cancelButtonLabel"
            )}
          </Button>
          {this.recovered && (
            <Button
              className="eval-modal-evaluate-button button-delete-draft"
              onClick={this.handleDeleteEditorDraft}
            >
              {this.props.i18n.text.get(
                "plugin.evaluation.evaluationModal.workspaceEvaluationForm.deleteDraftButtonLabel"
              )}
            </Button>
          )}
        </div>
      </>
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
    evaluations: state.evaluations,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    { updateWorkspaceSupplementationToServer },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SupplementationEditor);
