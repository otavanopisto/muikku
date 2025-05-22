import * as React from "react";
import { connect } from "react-redux";
import CKEditor from "~/components/general/ckeditor";
import { bindActionCreators } from "redux";
import { StateType } from "~/reducers/index";
import SessionStateComponent from "~/components/general/session-state-component";
import Button from "~/components/general/button";
import "~/sass/elements/evaluation.scss";
import "~/sass/elements/form.scss";
import { LocaleState } from "~/reducers/base/locales";
import { CKEditorConfig } from "../evaluation";
import {
  createOrUpdateEvaluationJournalFeedback,
  CreateOrUpdateEvaluationJournalFeedbackTriggerType,
} from "~/actions/main-function/evaluation/evaluationActions";
import { EvaluationJournalFeedback } from "~/generated/client";
import { withTranslation, WithTranslation } from "react-i18next";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * SupplementationEditorProps
 */
interface JournalFeedbackEditorProps extends WithTranslation {
  locale: LocaleState;
  journalFeedback?: EvaluationJournalFeedback;
  userEntityId: number;
  workspaceEntityId: number;
  editorLabel?: string;
  modifiers?: string[];
  createOrUpdateEvaluationJournalFeedback: CreateOrUpdateEvaluationJournalFeedbackTriggerType;
  onClose?: () => void;
}

/**
 * SupplementationEditorState
 */
interface JournalFeedbackEditorState {
  feedbackText: string;
  draftId: string;
  locked: boolean;
}

/**
 * SupplementationEditor
 */
class JournalFeedbackEditor extends SessionStateComponent<
  JournalFeedbackEditorProps,
  JournalFeedbackEditorState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: JournalFeedbackEditorProps) {
    /**
     * This is wierd one, setting namespace and identificated type for it from props...
     * If existing journalFeedback is given, then we editor type is "edit" otherwise "new"
     */
    super(
      props,
      `diary-journalFeedback-${props.journalFeedback ? "edit" : "new"}`
    );

    const { userEntityId, workspaceEntityId, journalFeedback } = props;

    /**
     * When there is not existing event data we use only user id and workspace id as
     * draft id. There must be at least user id and workspace id, so if making changes to multiple workspace
     * that have same user evaluations, so draft won't class together
     */
    let draftId = `${userEntityId}-${workspaceEntityId}`;

    if (journalFeedback) {
      draftId = `${userEntityId}-${workspaceEntityId}-${journalFeedback.id}`;
    }

    this.state = {
      ...this.getRecoverStoredState(
        {
          feedbackText: journalFeedback ? journalFeedback.feedback : "",
          draftId,
        },
        draftId
      ),
      locked: false,
    };
  }

  /**
   * componentDidMount
   */
  componentDidMount = () => {
    this.setState(
      this.getRecoverStoredState(
        {
          feedbackText: this.props.journalFeedback
            ? this.props.journalFeedback.feedback
            : "",
        },
        this.state.draftId
      )
    );
  };

  /**
   * Handle save click
   */
  handleSaveClick = () => {
    this.setState({
      locked: true,
    });

    // Creates or updates feedback
    this.props.createOrUpdateEvaluationJournalFeedback({
      userEntityId: this.props.userEntityId,
      workspaceEntityId: this.props.workspaceEntityId,
      feedback: this.state.feedbackText,
      // eslint-disable-next-line jsdoc/require-jsdoc
      success: () => {
        // Clears drafts
        this.justClear(["feedbackText"], this.state.draftId);

        this.setState(
          {
            locked: false,
          },
          () => {
            this.props.onClose && this.props.onClose();
          }
        );
      },
      // eslint-disable-next-line jsdoc/require-jsdoc
      fail: () => {
        this.setState({
          locked: false,
        });
      },
    });
  };

  /**
   * Handles ckeditor change
   * @param e e
   */
  handleCKEditorChange = (e: string) => {
    this.setStateAndStore({ feedbackText: e }, this.state.draftId);
  };

  /**
   * Handles deleting draft
   */
  handleDeleteEditorDraft = () => {
    this.setStateAndClear(
      {
        feedbackText:
          this.props.journalFeedback && this.props.journalFeedback.feedback,
      },
      this.state.draftId
    );
  };

  /**
   * Component render method
   * @returns React.JSX.Element
   */
  render() {
    return (
      <div className="form" role="form">
        <div className="form__row">
          <div className="form-element">
            <label>{this.props.t("labels.content")}</label>

            <CKEditor
              onChange={this.handleCKEditorChange}
              configuration={CKEditorConfig(this.props.locale.current)}
            >
              {this.state.feedbackText}
            </CKEditor>
          </div>
        </div>

        <div className="form__buttons form__buttons--evaluation">
          <Button
            buttonModifiers="dialog-execute"
            onClick={this.handleSaveClick}
            disabled={this.state.locked}
          >
            {this.props.t("actions.save")}
          </Button>
          <Button
            onClick={this.props.onClose}
            disabled={this.state.locked}
            buttonModifiers="dialog-cancel"
          >
            {this.props.t("actions.cancel")}
          </Button>
          {this.recovered && (
            <Button
              buttonModifiers="dialog-clear"
              disabled={this.state.locked}
              onClick={this.handleDeleteEditorDraft}
            >
              {this.props.t("actions.remove", { context: "draft" })}
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
    locale: state.locales,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators(
    { createOrUpdateEvaluationJournalFeedback },
    dispatch
  );
}

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(JournalFeedbackEditor)
);
