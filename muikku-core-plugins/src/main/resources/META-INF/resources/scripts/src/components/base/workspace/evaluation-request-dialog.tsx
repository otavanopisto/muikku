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
  RequestAssessmentAtWorkspaceTriggerType,
  requestAssessmentAtWorkspace,
} from "~/actions/workspaces";
import { StatusType } from "~/reducers/base/status";
import {
  DisplayNotificationTriggerType,
  displayNotification,
} from "~/actions/base/notifications";
import { withTranslation, WithTranslation } from "react-i18next";
import MApi, { isMApiError } from "~/api/api";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * EvaluationRequestDialogProps
 */
interface EvaluationRequestDialogProps extends WithTranslation {
  workspace: WorkspaceDataType;
  isOpen: boolean;
  onClose: () => any;
  requestAssessmentAtWorkspace: RequestAssessmentAtWorkspaceTriggerType;
  displayNotification: DisplayNotificationTriggerType;
  status: StatusType;
}

/**
 * EvaluationRequestDialogState
 */
interface EvaluationRequestDialogState {
  locked: boolean;
  message: string;
  price: number;
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
      price: 0,
      message: "",
    };

    this.updateMessage = this.updateMessage.bind(this);
    this.request = this.request.bind(this);
    this.proceedToPay = this.proceedToPay.bind(this);
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
   * proceedToPay creates the payment link and
   * @param closeDialog closeDialog
   */
  proceedToPay = async (closeDialog: () => any) => {
    const assessmentRequestApi = MApi.getAssessmentApi();

    try {
      closeDialog();

      const result = await assessmentRequestApi.createPaidAssessmentRequest({
        workspaceEntityId: this.props.workspace.id,
        createPaidAssessmentRequestRequest: {
          requestText: this.state.message,
        },
      });

      window.location.href = result.url;
    } catch (e) {
      if (!isMApiError(e)) {
        throw e;
      }

      this.props.displayNotification(
        this.props.t("notifications.createError", {
          ns: "orders",
          context: "paymentLocation",
        }),
        "error"
      );
    }
  };

  /**
   * loadPriceInfo loads the assessment prices from backend
   */
  loadPriceInfo = async () => {
    const assessmentRequestApi = MApi.getAssessmentApi();

    try {
      const result = await assessmentRequestApi.getWorkspaceAssessmentPrice({
        workspaceEntityId: this.props.workspace.id,
      });

      this.setState({
        price: result.price,
      });
    } catch (e) {
      if (!isMApiError(e)) {
        throw e;
      }
      this.props.displayNotification(
        this.props.t("notifications.loadError", {
          ns: "orders",
          context: "price",
          error: e.message,
        }),
        "error"
      );
    }
  };

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const { t } = this.props;
    const hasFees = this.props.status.hasFees;
    const price = this.state.price;

    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => any) => (
      <div>
        {hasFees ? (
          <>
            {price > 0 ? (
              <>
                <div className="dialog__content-row">
                  <p>
                    {t("content.evaluationFee", {
                      ns: "workspace",
                      price: price,
                    })}
                  </p>
                </div>
                <div className="dialog__content-row">
                  <p>
                    {t("content.evaluationPaymentProcessor", {
                      ns: "workspace",
                    })}
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="dialog__content-row">
                  {t("content.requestEvaluation", {
                    ns: "workspace",
                  })}
                </div>
                <div className="dialog__content-row">
                  <label>
                    {t("labels.evaluationHasFee", {
                      ns: "workspace",
                    })}
                  </label>
                  <p>
                    {t("content.evaluationHasFee", {
                      ns: "workspace",
                    })}
                  </p>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="dialog__content-row">
            {t("content.requestEvaluation", {
              ns: "workspace",
            })}
          </div>
        )}
        <div className="form-element dialog__content-row">
          <p>
            <label htmlFor="messageForTeacher">
              {t("labels.evaluationRequestMessage", {
                ns: "workspace",
              })}
            </label>
            <textarea
              id="messageForTeacher"
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
        {price > 0 ? (
          <Button
            buttonModifiers={["standard-ok", "execute"]}
            buttonAs="div"
            onClick={() => this.proceedToPay(closeDialog)}
            disabled={this.state.locked}
          >
            {t("actions.pay", {
              ns: "workspace",
            })}
          </Button>
        ) : (
          <Button
            buttonModifiers={["standard-ok", "execute"]}
            onClick={this.request.bind(this, closeDialog)}
            disabled={this.state.locked}
          >
            {t("actions.send", { context: "evaluationRequest" })}
          </Button>
        )}
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
        executeOnOpen={this.loadPriceInfo}
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
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators(
    { requestAssessmentAtWorkspace, displayNotification },
    dispatch
  );
}

export default withTranslation(["workspace", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(EvaluationRequestDialog)
);
