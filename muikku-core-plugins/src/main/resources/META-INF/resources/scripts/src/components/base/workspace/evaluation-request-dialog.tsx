import * as React from "react";
import { connect, Dispatch } from "react-redux";
import Dialog from "~/components/general/dialog";
import { AnyActionType } from "~/actions";
import "~/sass/elements/link.scss";
import { StateType } from "~/reducers";
import Button from "~/components/general/button";
import { bindActionCreators } from "redux";
import { WorkspaceDataType } from "~/reducers/workspaces";
import {
  RequestAssessmentAtWorkspaceTriggerType,
  requestAssessmentAtWorkspace,
} from "~/actions/workspaces";
import { StatusType } from "~/reducers/base/status";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * EvaluationRequestDialogProps
 */
interface EvaluationRequestDialogProps extends WithTranslation {
  workspace: WorkspaceDataType;
  isOpen: boolean;
  onClose: () => any;
  requestAssessmentAtWorkspace: RequestAssessmentAtWorkspaceTriggerType;
  status: StatusType;
}

/**
 * EvaluationRequestDialogState
 */
interface EvaluationRequestDialogState {
  locked: boolean;
  message: string;
}

/**
 * EvaluationRequestDialog
 */
class EvaluationRequestDialog extends React.Component<
  EvaluationRequestDialogProps,
  EvaluationRequestDialogState
> {
  /**
   * constructor method
   * @param props props
   */
  constructor(props: EvaluationRequestDialogProps) {
    super(props);
    this.state = {
      locked: false,
      message: "",
    };

    this.updateMessage = this.updateMessage.bind(this);
    this.request = this.request.bind(this);
  }

  /**
   * updateMessage
   * @param e e
   */
  updateMessage(e: React.ChangeEvent<HTMLTextAreaElement>) {
    this.setState({ message: e.target.value });
  }

  /**
   * request
   * @param closeDialog closeDialog
   */
  request(closeDialog: () => any) {
    this.setState({
      locked: true,
    });
    this.props.requestAssessmentAtWorkspace({
      workspace: this.props.workspace,
      text: this.state.message,
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
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const { t } = this.props;

    const hasFees = this.props.status.hasFees;

    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => any) => (
      <div>
        <div className="dialog__content-row">
          {t("content.requestEvaluation", { ns: "workspace" })}
        </div>
        {hasFees ? (
          <div className="dialog__content-row">
            <label>{t("labels.evaluationHasFee", { ns: "workspace" })}</label>
            <p>{t("content.evaluationHasFee", { ns: "workspace" })}</p>
          </div>
        ) : null}
        <div className="form-element dialog__content-row">
          <p>
            <textarea
              className="form-element__textarea"
              value={this.state.message}
              onChange={this.updateMessage}
            />
          </p>
        </div>
      </div>
    );

    /**
     * footer
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => any) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["standard-ok", "execute"]}
          onClick={this.request.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {t("actions.send", { context: "evaluationRequest" })}
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
        modifier="evaluation-request-dialog"
        title={t("labels.requestEvaluation", { ns: "workspace" })}
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
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ requestAssessmentAtWorkspace }, dispatch);
}

export default withTranslation(["workspace", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(EvaluationRequestDialog)
);
