import * as React from "react";
import { connect, Dispatch } from "react-redux";
import CKEditor from "~/components/general/ckeditor";
import { bindActionCreators } from "redux";
import { StateType } from "~/reducers/index";
import { AnyActionType } from "~/actions/index";
import { StatusType } from "~/reducers/base/status";
import SessionStateComponent from "~/components/general/session-state-component";
import Button from "~/components/general/button";
import "~/sass/elements/evaluation.scss";
import { i18nType } from "~/reducers/base/i18nOLD";
import "~/sass/elements/form.scss";
import { LocaleState } from "~/reducers/base/locales";
import { CKEditorConfig } from "../evaluation";
import { JournalComment } from "~/@types/journal";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * SupplementationEditorProps
 */
interface JournalCommentEditorProps
  extends WithTranslation<["common", "evaluation"]> {
  i18nOLD: i18nType;
  status: StatusType;
  locale: LocaleState;
  journalComment?: JournalComment;
  locked: boolean;
  journalEventId: number;
  userEntityId: number;
  workspaceEntityId: number;
  type?: "new" | "edit";
  editorLabel?: string;
  modifiers?: string[];
  onSave: (journalComment: string, callback?: () => void) => void;
  onClose?: () => void;
}

/**
 * SupplementationEditorState
 */
interface JournalCommentEditorState {
  journalCommentText: string;
  draftId: string;
}

/**
 * SupplementationEditor
 */
class JournalCommentEditor extends SessionStateComponent<
  JournalCommentEditorProps,
  JournalCommentEditorState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: JournalCommentEditorProps) {
    /**
     * This is wierd one, setting namespace and identificated type for it from props...
     */
    super(props, `diary-journalComment-${props.type ? props.type : "new"}`);

    const { userEntityId, workspaceEntityId, journalEventId } = props;

    /**
     * When there is not existing event data we use only user id and workspace id as
     * draft id. There must be at least user id and workspace id, so if making changes to multiple workspace
     * that have same user evaluations, so draft won't class together
     */
    let draftId = `${userEntityId}-${workspaceEntityId}-${journalEventId}`;

    if (props.journalComment) {
      draftId = `${userEntityId}-${workspaceEntityId}-${journalEventId}-${props.journalComment.id}`;
    }

    this.state = {
      ...this.getRecoverStoredState(
        {
          journalCommentText: props.journalComment
            ? props.journalComment.comment
            : "",
          draftId,
        },
        draftId
      ),
    };
  }

  /**
   * componentDidMount
   */
  componentDidMount = () => {
    this.setState(
      this.getRecoverStoredState(
        {
          journalCommentText: this.props.journalComment
            ? this.props.journalComment.comment
            : "",
        },
        this.state.draftId
      )
    );
  };

  /**
   * handleSaveClick
   */
  handleSaveClick = () => {
    this.props.onSave &&
      this.props.onSave(this.state.journalCommentText, () =>
        this.justClear(["journalCommentText"], this.state.draftId)
      );
  };

  /**
   * handleCKEditorChange
   * @param e e
   */
  handleCKEditorChange = (e: string) => {
    this.setStateAndStore({ journalCommentText: e }, this.state.draftId);
  };

  /**
   * handleDeleteEditorDraft
   */
  handleDeleteEditorDraft = () => {
    this.setStateAndClear(
      {
        journalCommentText:
          this.props.journalComment && this.props.journalComment.comment,
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
            <label>
              {this.props.i18nOLD.text.get(
                "plugin.evaluation.evaluationModal.journalComments.formContentLabel"
              )}
            </label>

            <CKEditor
              onChange={this.handleCKEditorChange}
              configuration={CKEditorConfig(this.props.locale.current)}
            >
              {this.state.journalCommentText}
            </CKEditor>
          </div>
        </div>

        <div className="form__buttons form__buttons--evaluation">
          <Button
            buttonModifiers="dialog-execute"
            onClick={this.handleSaveClick}
            disabled={this.props.locked}
          >
            {this.props.t("common:actions.save")}
          </Button>
          <Button
            onClick={this.props.onClose}
            disabled={this.props.locked}
            buttonModifiers="dialog-cancel"
          >
            {this.props.t("common:actions.cancel")}
          </Button>
          {this.recovered && (
            <Button
              buttonModifiers="dialog-clear"
              disabled={this.props.locked}
              onClick={this.handleDeleteEditorDraft}
            >
              {this.props.t("common:actions.remove_draft")}
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
    i18nOLD: state.i18nOLD,
    status: state.status,
    locale: state.locales,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({}, dispatch);
}

export default withTranslation(["common", "evaluation"])(
  connect(mapStateToProps, mapDispatchToProps)(JournalCommentEditor)
);
