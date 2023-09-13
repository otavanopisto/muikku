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
  RequestAssessmentAtWorkspaceTriggerType,
  requestAssessmentAtWorkspace,
} from "~/actions/workspaces";
import { StatusType } from "~/reducers/base/status";
import promisify from "~/util/promisify";
import mApi from "~/lib/mApi";
import {
  DisplayNotificationTriggerType,
  displayNotification,
} from "~/actions/base/notifications";

/**
 * EvaluationRequestDialogProps
 */
interface EvaluationRequestDialogProps {
  i18n: i18nType;
  workspace: WorkspaceType;
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
    try {
      closeDialog();
      const link: string = (await promisify(
        mApi().assessmentrequest.workspace.paidAssessmentRequest.create(
          this.props.workspace.id,
          {
            requestText: this.state.message,
          }
        ),
        "callback"
      )().then((link: { url: string }) => link.url)) as string;
      window.location.href = link;
    } catch (e) {
      this.props.displayNotification(
        this.props.i18n.text.get(
          "plugin.ceepos.errormessage.assesmentRequest.createFailed"
        ),
        "error"
      );
    }
  };

  /**
   * loadPriceInfo loads the assessment prices from backend
   */
  loadPriceInfo = async () => {
    try {
      const price: number = (await promisify(
        mApi().assessmentrequest.workspace.assessmentPrice.read(
          this.props.workspace.id
        ),
        "callback"
      )().then(
        (assessmentPrice: { price: number }) => assessmentPrice.price
      )) as number;

      this.setState({
        price,
      });
      // eslint-disable-next-line no-empty
    } catch (e) {
      this.props.displayNotification(
        this.props.i18n.text.get(
          "plugin.ceepos.errormessage.assesmentRequest.loadFailed",
          e
        ),
        "error"
      );
    }
  };

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const hasFees = this.props.status.hasFees;
    const price = this.state.price;

    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => any) => (
      <div>
        <div className="dialog__content-row">
          {this.props.i18n.text.get(
            "plugin.workspace.evaluation.requestEvaluation.description"
          )}
        </div>
        {hasFees ? (
          <div className="dialog__content-row">
            <label>
              {this.props.i18n.text.get(
                "plugin.workspace.evaluation.requestEvaluation.evaluationHasFee.label"
              )}
            </label>
            <p>
              {this.props.i18n.text.get(
                "plugin.workspace.evaluation.requestEvaluation.evaluationHasFee.content"
              )}
              {price > 0 ? (
                <>
                  {this.props.i18n.text.get(
                    "plugin.workspace.evaluation.requestEvaluation.evaluationHasFee.price",
                    price
                  )}
                </>
              ) : null}
            </p>
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
        {price > 0 ? (
          <Button
            buttonModifiers={["standard-ok", "execute"]}
            buttonAs="div"
            onClick={() => this.proceedToPay(closeDialog)}
            disabled={this.state.locked}
          >
            {this.props.i18n.text.get(
              "plugin.workspace.evaluation.requestEvaluation.paymentButton"
            )}
          </Button>
        ) : (
          <Button
            buttonModifiers={["standard-ok", "execute"]}
            onClick={this.request.bind(this, closeDialog)}
            disabled={this.state.locked}
          >
            {this.props.i18n.text.get(
              "plugin.workspace.evaluation.requestEvaluation.requestButton"
            )}
          </Button>
        )}
        <Button
          buttonModifiers={["standard-cancel", "cancel"]}
          onClick={closeDialog}
          disabled={this.state.locked}
        >
          {this.props.i18n.text.get(
            "plugin.workspace.evaluation.requestEvaluation.cancelButton"
          )}
        </Button>
      </div>
    );

    return (
      <Dialog
        modifier="evaluation-request-dialog"
        title={this.props.i18n.text.get(
          "plugin.workspace.evaluation.requestEvaluation.title"
        )}
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
    i18n: state.i18n,
    workspace: state.workspaces.currentWorkspace,
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    { requestAssessmentAtWorkspace, displayNotification },
    dispatch
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EvaluationRequestDialog);
