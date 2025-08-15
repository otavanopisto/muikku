import Dialog from "~/components/general/dialog";
import * as React from "react";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import Button from "~/components/general/button";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * VisibilityAndApprovalDialogProps
 */
interface VisibilityAndApprovalDialogProps extends WithTranslation {
  formIsApproved: boolean;
  onApproveChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children?: React.ReactElement<any>;
  saveButtonDisabled: boolean;
  onSaveClick?: () => void;
}

/**
 * VisibilityAndApprovalDialogState
 */
interface VisibilityAndApprovalDialogState {}

/**
 * VisibilityAndApprovalDialog
 */
class ApprovalDialog extends React.Component<
  VisibilityAndApprovalDialogProps,
  VisibilityAndApprovalDialogState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: VisibilityAndApprovalDialogProps) {
    super(props);
    this.state = {};

    this.handleSaveClick = this.handleSaveClick.bind(this);
  }

  /**
   * handleSaveClick
   * @param closeDialog closeDialog
   */
  handleSaveClick(closeDialog: () => void) {
    this.props.onSaveClick && this.props.onSaveClick();
    closeDialog();
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const { formIsApproved, onApproveChange } = this.props;

    /**
     * content
     * @param closeDialog closeDialog
     * @returns JSX.Element
     */
    const content = (closeDialog: () => void) => (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
        }}
      >
        <fieldset className="hops-container__fieldset">
          <legend className="hops-container__subheader">
            {this.props.i18n.t("labels.approval", {
              ns: "pedagogySupportPlan",
            })}
          </legend>
          <div className="hops-container__row">
            {this.props.i18n.t("content.planVisibility", {
              ns: "pedagogySupportPlan",
            })}
          </div>
          <div className="hops-container__row">
            {this.props.i18n.t("content.planApproval", {
              ns: "pedagogySupportPlan",
            })}
          </div>

          <div className="hops-container__row">
            <div
              className="hops__form-element-container hops__form-element-container--single-row"
              style={{ flexFlow: "unset" }}
            >
              <input
                id="approved"
                type="checkbox"
                name="approved"
                className="hops__input"
                checked={formIsApproved}
                onChange={onApproveChange}
              ></input>
              <label htmlFor="approved" className="hops__label">
                {this.props.i18n.t("content.approving", {
                  ns: "pedagogySupportPlan",
                })}
              </label>
            </div>
          </div>
        </fieldset>
      </div>
    );

    /**
     * footer
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => void) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["standard-ok", "execute"]}
          onClick={this.handleSaveClick.bind(this, closeDialog)}
          disabled={this.props.saveButtonDisabled}
        >
          {this.props.i18n.t("actions.approve", { ns: "common" })}
        </Button>
        <Button
          buttonModifiers={["standard-cancel", "cancel"]}
          onClick={closeDialog}
        >
          {this.props.i18n.t("actions.cancel", { ns: "common" })}
        </Button>
      </div>
    );

    return (
      <Dialog
        modifier="approval-dialog"
        disableScroll={true}
        title={this.props.i18n.t("labels.approving", {
          ns: "pedagogySupportPlan",
        })}
        content={content}
        footer={footer}
        closeOnOverlayClick={false}
      >
        {this.props.children}
      </Dialog>
    );
  }
}

export default withTranslation(["pedagogySupportPlan", "common"])(
  ApprovalDialog
);
