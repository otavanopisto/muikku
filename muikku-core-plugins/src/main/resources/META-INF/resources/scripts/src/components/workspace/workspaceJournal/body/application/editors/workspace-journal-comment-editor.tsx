import * as React from "react";
import { connect } from "react-redux";
import CKEditor from "~/components/general/ckeditor";
import { Action, bindActionCreators, Dispatch } from "redux";
import { StateType } from "~/reducers/index";
import { AnyActionType } from "~/actions/index";
import { StatusType } from "~/reducers/base/status";
import SessionStateComponent from "~/components/general/session-state-component";
import Button from "~/components/general/button";
import "~/sass/elements/evaluation.scss";
import "~/sass/elements/form.scss";
import { LocaleState } from "~/reducers/base/locales";
import { WorkspaceJournalComment } from "~/generated/client";
import { withTranslation, WithTranslation } from "react-i18next";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * SupplementationEditorProps
 */
interface WorkspaceJournalCommentEditorProps extends WithTranslation {
  status: StatusType;
  locale: LocaleState;
  journalComment?: WorkspaceJournalComment;
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
  journalCommentText: string;
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

    if (props.journalComment) {
      draftId = `${userEntityId}-${workspaceEntityId}-${diaryEventId}-${props.journalComment.id}`;
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
        journalCommentText: this.props.journalComment
          ? this.props.journalComment.comment
          : "",
      },
      this.state.draftId
    );
  };

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const { t } = this.props;
    const editorTitle = this.props.journalComment
      ? t("actions.edit", { ns: "common", context: "comment" }) +
        " - " +
        t("labels.content")
      : t("actions.create", { ns: "common", context: "comment" }) +
        " - " +
        t("labels.content");

    const commentHeaderTitle = this.props.journalComment
      ? t("actions.edit", { ns: "common", context: "comment" })
      : t("actions.create", { ns: "common", context: "comment" });

    return (
      <div className="form" role="form">
        <div className="env-dialog env-dialog--mainfunction env-dialog--edit-journal-entry">
          <section className="env-dialog__wrapper">
            <div className="env-dialog__content">
              <header className="env-dialog__header">
                {commentHeaderTitle}
              </header>
              <section className="env-dialog__body">
                <div
                  className="env-dialog__row env-dialog__row--ckeditor"
                  key="3"
                >
                  <div className="env-dialog__form-element-container">
                    <label className="env-dialog__label">
                      {t("labels.content")}
                    </label>
                    <CKEditor
                      onChange={this.handleCKEditorChange}
                      editorTitle={editorTitle}
                    >
                      {this.state.journalCommentText}
                    </CKEditor>
                  </div>
                </div>
              </section>
              <footer className="env-dialog__footer">
                <div className="env-dialog__actions">
                  <Button
                    buttonModifiers="dialog-execute"
                    onClick={this.handleSaveClick}
                    disabled={this.props.locked}
                  >
                    {t("actions.save", { ns: "common" })}
                  </Button>
                  <Button
                    onClick={this.props.onClose}
                    disabled={this.props.locked}
                    buttonModifiers="dialog-cancel"
                  >
                    {t("actions.cancel")}
                  </Button>
                  {this.recovered && (
                    <Button
                      buttonModifiers="dialog-clear"
                      disabled={this.props.locked}
                      onClick={this.handleDeleteEditorDraft}
                    >
                      {t("actions.remove", { context: "draft" })}
                    </Button>
                  )}
                </div>
              </footer>
            </div>
          </section>
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
    locale: state.locales,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators({}, dispatch);
}

export default withTranslation(["journal", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(WorkspaceJournalCommentEditor)
);
