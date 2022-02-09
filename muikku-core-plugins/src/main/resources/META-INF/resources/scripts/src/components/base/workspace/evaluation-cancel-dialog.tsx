import * as React from "react";
import { connect, Dispatch } from "react-redux";
import Dialog from "~/components/general/dialog";
import { AnyActionType } from "~/actions";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/link.scss";
import { StateType } from "~/reducers";
import Button from "~/components/general/button";
import { bindActionCreators } from "redux";
import { WorkspaceType } from "~/reducers/workspaces";
import {
  cancelAssessmentAtWorkspace,
  CancelAssessmentAtWorkspaceTriggerType,
} from "~/actions/workspaces";

/**
 * EvaluationCancelDialogProps
 */
interface EvaluationCancelDialogProps {
  i18n: i18nType;
  workspace: WorkspaceType;
  isOpen: boolean;
  onClose: () => any;
  cancelAssessmentAtWorkspace: CancelAssessmentAtWorkspaceTriggerType;
}

/**
 * EvaluationCancelDialogState
 */
interface EvaluationCancelDialogState {
  locked: boolean;
}

/**
 * EvaluationCancelDialog
 */
class EvaluationCancelDialog extends React.Component<
  EvaluationCancelDialogProps,
  EvaluationCancelDialogState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: EvaluationCancelDialogProps) {
    super(props);
    this.state = {
      locked: false,
    };

    this.cancel = this.cancel.bind(this);
  }

  /**
   * cancel
   * @param closeDialog closeDialog
   */
  cancel(closeDialog: () => any) {
    this.setState({
      locked: true,
    });
    this.props.cancelAssessmentAtWorkspace({
      workspace: this.props.workspace,
      /**
       * success
       */
      success: () => {
        this.setState({
          locked: false,
        });
        closeDialog();
      },

      /**
       * fail
       */
      fail: () => {
        this.setState({
          locked: false,
        });
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
    const content = (closeDialog: () => any) => (
      <div>
        <span>
          {this.props.i18n.text.get(
            "plugin.workspace.evaluation.cancelEvaluation.description"
          )}
        </span>
      </div>
    );

    /**
     * footer
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => any) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["standard-ok", "warn"]}
          onClick={this.cancel.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {this.props.i18n.text.get(
            "plugin.workspace.evaluation.cancelEvaluation.cancelRequestButton"
          )}
        </Button>
        <Button
          buttonModifiers={["standard-cancel", "cancel"]}
          onClick={closeDialog}
          disabled={this.state.locked}
        >
          {this.props.i18n.text.get(
            "plugin.workspace.evaluation.cancelEvaluation.cancelButton"
          )}
        </Button>
      </div>
    );

    return (
      <Dialog
        modifier="evaluation-cancel-dialog"
        title={this.props.i18n.text.get(
          "plugin.workspace.evaluation.cancelEvaluation.title"
        )}
        content={content}
        footer={footer}
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
      />
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
    workspace: state.workspaces.currentWorkspace,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ cancelAssessmentAtWorkspace }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EvaluationCancelDialog);
