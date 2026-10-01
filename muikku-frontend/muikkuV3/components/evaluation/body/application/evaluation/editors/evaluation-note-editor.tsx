import * as React from "react";
import { connect } from "react-redux";
import CKEditor from "~/components/general/ckeditor";
import { Action, bindActionCreators, Dispatch } from "redux";
import { StateType } from "~/reducers/index";
import { AnyActionType } from "~/actions/index";
import SessionStateComponent from "~/components/general/session-state-component";
import Button from "~/components/general/button";
import "~/sass/elements/evaluation.scss";
import "~/sass/elements/form.scss";
import { LocaleState } from "~/reducers/base/locales";
import { CKEditorConfig } from "~/components/evaluation/helper";
import {
  CreateEvaluationNoteTriggerType,
  UpdateEvaluationNoteTriggerType,
  createEvaluationNote,
  updateEvaluationNote,
} from "~/actions/main-function/evaluation/evaluationActions";
import { withTranslation, WithTranslation } from "react-i18next";
import { EvaluationNote } from "~/generated/client";

/**
 * Evaluation Note Editor Props
 */
interface EvaluationNoteEditorProps extends WithTranslation {
  locale: LocaleState;
  evaluationNote?: EvaluationNote;
  userEntityId: number;
  workspaceEntityId: number;
  editorLabel?: string;
  modifiers?: string[];
  createEvaluationNote: CreateEvaluationNoteTriggerType;
  updateEvaluationNote: UpdateEvaluationNoteTriggerType;
  onClose?: () => void;
}

/**
 * EvaluationNoteEditorState
 */
interface EvaluationNoteEditorState {
  noteText: string;
  draftId: string;
  locked: boolean;
  mode: "edit" | "new";
}

/**
 * Evaluation Note Editor
 */
class EvaluationNoteEditor extends SessionStateComponent<
  EvaluationNoteEditorProps,
  EvaluationNoteEditorState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: EvaluationNoteEditorProps) {
    /**
     * If existing evaluationNote is given, then we editor type is "edit" otherwise "new"
     */
    super(
      props,
      `diary-evaluationNote-${props.evaluationNote ? "edit" : "new"}`
    );

    const { userEntityId, workspaceEntityId, evaluationNote } = props;

    /**
     * When there is not existing event data we use only user id and workspace id as
     * draft id. There must be at least user id and workspace id, so if making changes to multiple workspace
     * that have same user evaluations, so draft won't class together
     */
    let draftId = `${userEntityId}-${workspaceEntityId}`;

    if (evaluationNote) {
      draftId = `${userEntityId}-${workspaceEntityId}-${evaluationNote.id}`;
    }

    this.state = {
      ...this.getRecoverStoredState(
        {
          noteText: evaluationNote ? evaluationNote.note : "",
          draftId,
        },
        draftId
      ),
      locked: false,
      mode: evaluationNote ? "edit" : "new",
    };
  }

  /**
   * componentDidMount
   */
  componentDidMount = () => {
    this.setState(
      this.getRecoverStoredState(
        {
          noteText: this.props.evaluationNote
            ? this.props.evaluationNote.note
            : "",
        },
        this.state.draftId
      )
    );
  };

  /**
   * Creates evaluation note
   */
  createEvaluationNote = () => {
    // Creates or updates feedback
    this.props.createEvaluationNote({
      userEntityId: this.props.userEntityId,
      workspaceEntityId: this.props.workspaceEntityId,
      note: {
        ...this.props.evaluationNote,
        note: this.state.noteText,
      },
      // eslint-disable-next-line jsdoc/require-jsdoc
      onSuccess: () => {
        // Clears drafts
        this.justClear(["noteText"], this.state.draftId);

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
      onFail: () => {
        this.setState({
          locked: false,
        });
      },
    });
  };

  /**
   * Updates evaluation note
   */
  updateEvaluationNote = () => {
    this.props.updateEvaluationNote({
      userEntityId: this.props.userEntityId,
      workspaceEntityId: this.props.workspaceEntityId,
      note: {
        ...this.props.evaluationNote,
        note: this.state.noteText,
      },
      // eslint-disable-next-line jsdoc/require-jsdoc
      onSuccess: () => {
        // Clears drafts
        this.justClear(["noteText"], this.state.draftId);

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
      onFail: () => {
        this.setState({
          locked: false,
        });
      },
    });
  };

  /**
   * Handle save click
   */
  handleSaveClick = () => {
    this.setState({
      locked: true,
    });

    if (this.state.mode === "new") {
      this.createEvaluationNote();
    } else {
      this.updateEvaluationNote();
    }
  };

  /**
   * Handles ckeditor change
   * @param e e
   */
  handleCKEditorChange = (e: string) => {
    this.setStateAndStore({ noteText: e }, this.state.draftId);
  };

  /**
   * Handles deleting draft
   */
  handleDeleteEditorDraft = () => {
    this.setStateAndClear(
      {
        noteText: this.props.evaluationNote && this.props.evaluationNote.note,
      },
      this.state.draftId
    );
  };

  /**
   * Component render method
   * @returns JSX.Element
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
              {this.state.noteText}
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
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    { createEvaluationNote, updateEvaluationNote },
    dispatch
  );
}

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(EvaluationNoteEditor)
);
