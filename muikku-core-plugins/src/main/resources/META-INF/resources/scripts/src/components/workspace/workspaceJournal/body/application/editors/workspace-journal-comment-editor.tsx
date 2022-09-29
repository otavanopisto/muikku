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
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/form.scss";
import { LocaleListType } from "~/reducers/base/locales";
import { DiaryComment } from "~/@types/journal";

/**
 * SupplementationEditorProps
 */
interface WorkspaceJournalCommentEditorProps {
  i18n: i18nType;
  status: StatusType;
  locale: LocaleListType;
  comment?: DiaryComment;
  locked: boolean;
  diaryEventId: number;
  userEntityId: number;
  workspaceEntityId: number;
  type?: "new" | "edit";
  editorLabel?: string;
  modifiers?: string[];
  onSave: (comment: string, callback?: () => void) => void;
  onClose?: () => void;
}

/**
 * SupplementationEditorState
 */
interface WorkspaceJournalCommentEditorState {
  comment: string;
  draftId: string;
}

/**
 * SupplementationEditor
 */
class WorkspaceJournalCommentEditor extends SessionStateComponent<
  WorkspaceJournalCommentEditorProps,
  WorkspaceJournalCommentEditorState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: WorkspaceJournalCommentEditorProps) {
    /**
     * This is wierd one, setting namespace and identificated type for it from props...
     */
    super(props, `journal-comment-${props.type ? props.type : "new"}`);

    const { userEntityId, workspaceEntityId, diaryEventId } = props;

    /**
     * When there is not existing event data we use only user id and workspace id as
     * draft id. There must be at least user id and workspace id, so if making changes to multiple workspace
     * that have same user evaluations, so draft won't class together
     */
    let draftId = `${userEntityId}-${workspaceEntityId}-${diaryEventId}`;

    if (props.comment) {
      draftId = `${userEntityId}-${workspaceEntityId}-${diaryEventId}-${props.comment.id}`;
    }

    this.state = {
      ...this.getRecoverStoredState(
        {
          comment: props.comment ? props.comment.comment : "",
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
          comment: this.props.comment ? this.props.comment.comment : "",
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
      this.props.onSave(this.state.comment, () =>
        this.justClear(["comment"], this.state.draftId)
      );
  };

  /**
   * handleCKEditorChange
   * @param e e
   */
  handleCKEditorChange = (e: string) => {
    this.setStateAndStore({ comment: e }, this.state.draftId);
  };

  /**
   * handleDeleteEditorDraft
   */
  handleDeleteEditorDraft = () => {
    this.setStateAndClear(
      {
        comment: this.props.comment ? this.props.comment.comment : "",
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
            {this.props.editorLabel && <label>{this.props.editorLabel}</label>}

            <CKEditor onChange={this.handleCKEditorChange}>
              {this.state.comment}
            </CKEditor>
          </div>
        </div>

        <div className="form__buttons form__buttons--evaluation">
          <Button
            buttonModifiers="evaluate-supplementation"
            onClick={this.handleSaveClick}
            disabled={this.props.locked}
          >
            {this.props.i18n.text.get(
              "plugin.evaluation.evaluationModal.workspaceEvaluationForm.saveButtonLabel"
            )}
          </Button>
          <Button
            onClick={this.props.onClose}
            disabled={this.props.locked}
            buttonModifiers="evaluate-cancel"
          >
            {this.props.i18n.text.get(
              "plugin.evaluation.evaluationModal.workspaceEvaluationForm.cancelButtonLabel"
            )}
          </Button>
          {this.recovered && (
            <Button
              buttonModifiers="evaluate-remove-draft"
              disabled={this.props.locked}
              onClick={this.handleDeleteEditorDraft}
            >
              {this.props.i18n.text.get(
                "plugin.evaluation.evaluationModal.workspaceEvaluationForm.deleteDraftButtonLabel"
              )}
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
    i18n: state.i18n,
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

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkspaceJournalCommentEditor);
