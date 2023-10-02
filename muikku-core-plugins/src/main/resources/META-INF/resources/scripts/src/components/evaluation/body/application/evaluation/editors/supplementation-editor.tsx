import * as React from "react";
import { connect, Dispatch } from "react-redux";
import CKEditor from "~/components/general/ckeditor";
import { bindActionCreators } from "redux";
import { StateType } from "~/reducers/index";
import { AnyActionType } from "~/actions/index";
import { StatusType } from "~/reducers/base/status";
import { EvaluationState } from "~/reducers/main-function/evaluation/index";
import SessionStateComponent from "~/components/general/session-state-component";
import Button from "~/components/general/button";
import {
  UpdateWorkspaceSupplementation,
  updateWorkspaceSupplementationToServer,
} from "~/actions/main-function/evaluation/evaluationActions";
import "~/sass/elements/evaluation.scss";
import {
  UpdateNeedsReloadEvaluationRequests,
  updateNeedsReloadEvaluationRequests,
} from "~/actions/main-function/evaluation/evaluationActions";
import "~/sass/elements/form.scss";
import { LocaleState } from "~/reducers/base/locales";
import { CKEditorConfig } from "../evaluation";
import { EvaluationAssessmentRequest } from "~/generated/client";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * SupplementationEditorProps
 */
interface SupplementationEditorProps extends WithTranslation {
  status: StatusType;
  evaluations: EvaluationState;
  locale: LocaleState;
  selectedAssessment: EvaluationAssessmentRequest;
  type?: "new" | "edit";
  eventId?: string;
  editorLabel?: string;
  modifiers?: string[];
  onClose?: () => void;
  workspaceSubjectToBeEvaluatedIdentifier: string;
  updateWorkspaceSupplementationToServer: UpdateWorkspaceSupplementation;
  updateNeedsReloadEvaluationRequests: UpdateNeedsReloadEvaluationRequests;
}

/**
 * SupplementationEditorState
 */
interface SupplementationEditorState {
  literalEvaluation: string;
  draftId: string;
  locked: boolean;
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
   * @param props props
   */
  constructor(props: SupplementationEditorProps) {
    /**
     * This is wierd one, setting namespace and identificated type for it from props...
     */
    super(props, `supplementation-editor-${props.type ? props.type : "new"}`);

    const { evaluationAssessmentEvents } = props.evaluations;

    const { selectedAssessment, workspaceSubjectToBeEvaluatedIdentifier } =
      props;

    const { userEntityId, workspaceEntityId } = selectedAssessment;

    /**
     * When there is not existing event data we use only user id and workspace id as
     * draft id. There must be at least user id and workspace id, so if making changes to multiple workspace
     * that have same user evaluations, so draft won't class together
     */
    let draftId = `${userEntityId}-${workspaceEntityId}-${workspaceSubjectToBeEvaluatedIdentifier}`;

    if (
      (evaluationAssessmentEvents.data.length > 0 && props.type !== "new") ||
      (evaluationAssessmentEvents.data.length > 0 && props.type === "edit")
    ) {
      let latestEvent =
        evaluationAssessmentEvents.data[
          evaluationAssessmentEvents.data.length - 1
        ];

      /**
       * If editing existing event, we need to find that specific event from event list by its' id
       */
      if (this.props.eventId) {
        latestEvent = evaluationAssessmentEvents.data.find(
          (eItem) => eItem.identifier === this.props.eventId
        );
      }

      const eventId =
        evaluationAssessmentEvents.data.length > 0 && latestEvent.identifier
          ? latestEvent.identifier
          : "empty";

      /**
       * As default but + latest event id
       */
      draftId = `${userEntityId}-${workspaceEntityId}-${workspaceSubjectToBeEvaluatedIdentifier}-${eventId}`;

      this.state = {
        ...this.getRecoverStoredState(
          {
            literalEvaluation: latestEvent.text,
            draftId,
          },
          draftId
        ),
        locked: false,
      };
    } else {
      this.state = {
        ...this.getRecoverStoredState(
          {
            literalEvaluation: "",
            draftId,
          },
          draftId
        ),
        locked: false,
      };
    }
  }

  /**
   * componentDidMount
   */
  componentDidMount = () => {
    const { evaluationAssessmentEvents } = this.props.evaluations;

    let latestIndex =
      evaluationAssessmentEvents.data &&
      evaluationAssessmentEvents.data.length - 1;

    if (this.props.type === "edit") {
      if (this.props.eventId) {
        /**
         * If editing existing event, we need to find that specific event from event list by its' id
         */
        latestIndex = evaluationAssessmentEvents.data.findIndex(
          (eItem) => eItem.identifier === this.props.eventId
        );
      }

      this.setState(
        this.getRecoverStoredState(
          {
            literalEvaluation:
              evaluationAssessmentEvents.data &&
              evaluationAssessmentEvents.data[latestIndex].text,
          },
          this.state.draftId
        )
      );
    } else {
      this.setState(
        this.getRecoverStoredState(
          {
            literalEvaluation: "",
          },
          this.state.draftId
        )
      );
    }
  };

  /**
   * handleCKEditorChange
   * @param e e
   */
  handleCKEditorChange = (e: string) => {
    this.setStateAndStore({ literalEvaluation: e }, this.state.draftId);
  };

  /**
   * handleEvaluationSupplementationSave
   * @param e e
   */
  handleEvaluationSupplementationSave = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    const { evaluations, type = "new", onClose } = this.props;
    const { evaluationAssessmentEvents } = evaluations;

    this.setState({ locked: true });

    if (type === "new") {
      this.props.updateWorkspaceSupplementationToServer({
        type: "new",
        workspaceSupplementation: {
          requestDate: new Date().getTime().toString(),
          requestText: this.state.literalEvaluation,
          workspaceSubjectIdentifier:
            this.props.workspaceSubjectToBeEvaluatedIdentifier,
        },
        /**
         * onSuccess
         */
        onSuccess: () => {
          // Removes "new" items from localstorage
          this.justClear(["literalEvaluation"], this.state.draftId);

          this.props.updateNeedsReloadEvaluationRequests({ value: true });

          this.setState({ locked: false });

          onClose && onClose();
        },
        /**
         * onFail
         */
        onFail: () => {
          this.setState({ locked: false });
          onClose();
        },
      });
    } else {
      /**
       * Latest assessments event index whom identifier we want to get
       */
      let latestIndex =
        evaluationAssessmentEvents.data &&
        evaluationAssessmentEvents.data.length - 1;

      if (this.props.eventId) {
        /**
         * If editing existing event, we need to find that specific event from event list by its' id
         */
        latestIndex = evaluationAssessmentEvents.data.findIndex(
          (eItem) => eItem.identifier === this.props.eventId
        );
      }

      this.props.updateWorkspaceSupplementationToServer({
        type: "edit",
        workspaceSupplementation: {
          id:
            evaluationAssessmentEvents.data &&
            evaluationAssessmentEvents.data[latestIndex].identifier,
          requestDate:
            evaluationAssessmentEvents.data &&
            evaluationAssessmentEvents.data[latestIndex].date,
          requestText: this.state.literalEvaluation,
          workspaceSubjectIdentifier:
            this.props.workspaceSubjectToBeEvaluatedIdentifier,
        },
        /**
         * onSuccess
         */
        onSuccess: () => {
          // Removes "new" items from localstorage
          this.justClear(["literalEvaluation"], this.state.draftId);

          this.props.updateNeedsReloadEvaluationRequests({ value: true });

          this.setState({ locked: false });

          onClose && onClose();
        },
        /**
         * onFail
         */
        onFail: () => {
          this.setState({ locked: false });
          onClose();
        },
      });
    }
  };

  /**
   * handleDeleteEditorDraft
   */
  handleDeleteEditorDraft = () => {
    if (this.props.type === "edit") {
      const { evaluationAssessmentEvents } = this.props.evaluations;
      let latestIndex =
        evaluationAssessmentEvents.data &&
        evaluationAssessmentEvents.data.length - 1;

      if (this.props.eventId) {
        /**
         * If editing existing event, we need to find that specific event from event list by its' id
         */
        latestIndex = evaluationAssessmentEvents.data.findIndex(
          (eItem) => eItem.identifier === this.props.eventId
        );
      }

      /**
       * If editing delete draft, and set back to default values from event data
       */
      this.setStateAndClear(
        {
          literalEvaluation:
            evaluationAssessmentEvents.data &&
            evaluationAssessmentEvents.data[latestIndex].text,
        },
        this.state.draftId
      );
    } else {
      /**
       * If making new, delete draft and set back to default values
       */
      this.setStateAndClear(
        {
          literalEvaluation: "",
        },
        this.state.draftId
      );
    }
  };

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const { t } = this.props;

    return (
      <div className="form" role="form">
        <div className="form__row">
          <div className="form-element">
            {this.props.editorLabel && <label>{this.props.editorLabel}</label>}

            <CKEditor
              onChange={this.handleCKEditorChange}
              configuration={CKEditorConfig(this.props.locale.current)}
            >
              {this.state.literalEvaluation}
            </CKEditor>
          </div>
        </div>

        <div className="form__buttons form__buttons--evaluation">
          <Button
            buttonModifiers="dialog-execute"
            onClick={this.handleEvaluationSupplementationSave}
            disabled={this.state.locked}
          >
            {t("actions.save")}
          </Button>
          <Button
            onClick={this.props.onClose}
            disabled={this.state.locked}
            buttonModifiers="dialog-cancel"
          >
            {t("actions.cancel")}
          </Button>
          {this.recovered && (
            <Button
              buttonModifiers="dialog-clear"
              disabled={this.state.locked}
              onClick={this.handleDeleteEditorDraft}
            >
              {t("actions.remove", { context: "draft" })}
            </Button>
          )}
        </div>
      </div>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    status: state.status,
    evaluations: state.evaluations,
    locale: state.locales,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    {
      updateWorkspaceSupplementationToServer,
      updateNeedsReloadEvaluationRequests,
    },
    dispatch
  );
}

export default withTranslation(["common"])(
  connect(mapStateToProps, mapDispatchToProps)(SupplementationEditor)
);
