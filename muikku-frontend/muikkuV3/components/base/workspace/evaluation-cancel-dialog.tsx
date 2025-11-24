import * as React from "react";
import { connect } from "react-redux";
import Dialog from "~/components/general/dialog";
import { AnyActionType } from "~/actions";
import "~/sass/elements/link.scss";
import { StateType } from "~/reducers";
import Button from "~/components/general/button";
import { Action, bindActionCreators, Dispatch } from "redux";
import { WorkspaceDataType } from "~/reducers/workspaces";
import {
  cancelAssessmentAtWorkspace,
  CancelAssessmentAtWorkspaceTriggerType,
} from "~/actions/workspaces";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * EvaluationCancelDialogProps
 */
interface EvaluationCancelDialogProps extends WithTranslation {
  workspace: WorkspaceDataType;
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
    const { t } = this.props;

    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => any) => (
      <div>
        <span>
          {t("content.cancel_evaluationRequest", { ns: "workspace" })}
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
          {t("actions.send")}
        </Button>
        <Button
          buttonModifiers={["standard-cancel", "cancel"]}
          onClick={closeDialog}
          disabled={this.state.locked}
        >
          {t("actions.cancel")}
        </Button>
      </div>
    );

    return (
      <Dialog
        modifier="evaluation-cancel-dialog"
        title={t("labels.cancel_evaluationRequest", { ns: "workspace" })}
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
    workspace: state.workspaces.currentWorkspace,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators({ cancelAssessmentAtWorkspace }, dispatch);
}

export default withTranslation(["evaluation", "workspace", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(EvaluationCancelDialog)
);
