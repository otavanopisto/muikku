import * as React from "react";
import { connect, Dispatch } from "react-redux";
import Link from "~/components/general/link";
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

interface EvaluationCancelDialogProps {
  i18n: i18nType;
  workspace: WorkspaceType;
  isOpen: boolean;
  onClose: () => any;
  cancelAssessmentAtWorkspace: CancelAssessmentAtWorkspaceTriggerType;
}

interface EvaluationCancelDialogState {
  locked: boolean;
}

class EvaluationCancelDialog extends React.Component<
  EvaluationCancelDialogProps,
  EvaluationCancelDialogState
> {
  constructor(props: EvaluationCancelDialogProps) {
    super(props);
    this.state = {
      locked: false,
    };

    this.cancel = this.cancel.bind(this);
  }
  cancel(closeDialog: () => any) {
    this.setState({
      locked: true,
    });
    this.props.cancelAssessmentAtWorkspace({
      workspace: this.props.workspace,
      success: () => {
        this.setState({
          locked: false,
        });
        closeDialog();
      },
      fail: () => {
        this.setState({
          locked: false,
        });
      },
    });
  }
  render() {
    const content = (closeDialog: () => any) => (
      <div>
        <span>
          {this.props.i18n.text.get(
            "plugin.workspace.evaluation.cancelEvaluation.description",
          )}
        </span>
      </div>
    );

    const footer = (closeDialog: () => any) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["standard-ok", "warn"]}
          onClick={this.cancel.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {this.props.i18n.text.get(
            "plugin.workspace.evaluation.cancelEvaluation.cancelRequestButton",
          )}
        </Button>
        <Button
          buttonModifiers={["standard-cancel", "cancel"]}
          onClick={closeDialog}
          disabled={this.state.locked}
        >
          {this.props.i18n.text.get(
            "plugin.workspace.evaluation.cancelEvaluation.cancelButton",
          )}
        </Button>
      </div>
    );

    return (
      <Dialog
        modifier="evaluation-cancel-dialog"
        title={this.props.i18n.text.get(
          "plugin.workspace.evaluation.cancelEvaluation.title",
        )}
        content={content}
        footer={footer}
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
      />
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    workspace: state.workspaces.currentWorkspace,
  };
}

function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ cancelAssessmentAtWorkspace }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EvaluationCancelDialog);
