import "~/sass/elements/link.scss";
import "~/sass/elements/form.scss";
import "~/sass/elements/buttons.scss";
import * as React from "react";
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import Dialog from "~/components/general/dialog";
import Button from "~/components/general/button";
import {
  DeleteEvaluationNoteTriggerType,
  deleteEvaluationNote,
} from "../../../actions/main-function/evaluation/evaluationActions";
import { EvaluationNote } from "~/generated/client";
import { WithTranslation, withTranslation } from "react-i18next";

/**
 * Delete evaluation note props
 */
interface DeleteEvaluationNoteProps extends WithTranslation {
  evaluationNote: EvaluationNote;
  workspaceUserEntityId: number;
  deleteEvaluationNote: DeleteEvaluationNoteTriggerType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any>;
}

/**
 * Delete evaluation note state
 */
interface DeleteEvaluationNoteState {
  locked: boolean;
}

/**
 * Delete evaluation note
 */
class DeleteEvaluationNote extends React.Component<
  DeleteEvaluationNoteProps,
  DeleteEvaluationNoteState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: DeleteEvaluationNoteProps) {
    super(props);

    this.handleDeleteEvaluationNoteClick =
      this.handleDeleteEvaluationNoteClick.bind(this);

    this.state = {
      locked: false,
    };
  }

  /**
   * Delete evaluation note
   * @param closeDialog closeDialog
   */
  handleDeleteEvaluationNoteClick(closeDialog: () => void) {
    const { evaluationNote } = this.props;

    this.setState({ locked: true });

    this.props.deleteEvaluationNote({
      noteId: evaluationNote.id,
      workspaceUserEntityId: this.props.workspaceUserEntityId,
      // eslint-disable-next-line jsdoc/require-jsdoc
      onSuccess: () => {
        localStorage.removeItem(
          `evaluation-note-edit.${evaluationNote.userEntityId}-${evaluationNote.workspaceEntityId}-${evaluationNote.id}.noteText`
        );

        this.setState({ locked: false }, () => {
          closeDialog();
        });
      },
      // eslint-disable-next-line jsdoc/require-jsdoc
      onFail: () => {
        this.setState({ locked: false });
      },
    });
  }

  /**
   * render
   */
  render() {
    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => void) => (
      <div>
        {this.props.t("content.removing", {
          ns: "evaluation",
          context: "evaluationNote",
        })}
      </div>
    );

    /**
     * footer
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => void) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["fatal", "standard-ok"]}
          onClick={this.handleDeleteEvaluationNoteClick.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {this.props.t("actions.remove")}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={closeDialog}
        >
          {this.props.t("actions.cancel")}
        </Button>
      </div>
    );

    return (
      <Dialog
        modifier="delete-journal"
        title={this.props.t("labels.evaluationNoteDelete", {
          ns: "evaluation",
        })}
        content={content}
        footer={footer}
      >
        {this.props.children}
      </Dialog>
    );
  }
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators({ deleteEvaluationNote }, dispatch);
}

export default withTranslation()(
  connect(null, mapDispatchToProps)(DeleteEvaluationNote)
);
