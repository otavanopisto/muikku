import * as React from "react";
import Dialog from "~/components/general/dialog";
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
import Button from "~/components/general/button";
import { AnyActionType } from "~/actions";
import "~/sass/elements/form.scss";
import { withTranslation, WithTranslation } from "react-i18next";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * DeleteDialogProps
 */
interface WarningeDialogProps extends WithTranslation {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any>;
  isOpen?: boolean;
  onContinueClick: () => void;
  onClose?: () => void;
}

/**
 * DeleteDialogState
 */
interface WarningDialogState {}

/**
 * DeleteDialog
 */
class WarningDialog extends React.Component<
  WarningeDialogProps,
  WarningDialogState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: WarningeDialogProps) {
    super(props);

    this.handleContinueClick = this.handleContinueClick.bind(this);
  }

  /**
   * handleDeleteEventClick
   * @param closeDialog closeDialog
   */
  handleContinueClick(closeDialog: () => void) {
    this.props.onContinueClick();
    closeDialog();
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    /**
     * footer
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => void) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["fatal", "standard-ok"]}
          onClick={this.handleContinueClick.bind(this, closeDialog)}
        >
          {this.props.t("actions.confirmCancel")}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={closeDialog}
        >
          {this.props.t("actions.cancel")}
        </Button>
      </div>
    );
    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => void) => (
      <div>
        {this.props.t("content.unsavedverbalEvaluations", { ns: "evaluation" })}
      </div>
    );
    return (
      <Dialog
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        modifier="evaluation-remove-assessment"
        title={this.props.t("labels.unsavedverbalEvaluations", {
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

/* localStorage.getItem(`workspace-editor-edit.${draftId}.`)
 */
/**

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators({}, dispatch);
}

export default withTranslation(["evaluation"])(
  connect(null, mapDispatchToProps)(WarningDialog)
);
