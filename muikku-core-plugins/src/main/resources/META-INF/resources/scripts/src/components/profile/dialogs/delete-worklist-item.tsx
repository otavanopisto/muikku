import Dialog from "~/components/general/dialog";
import * as React from "react";
import { connect } from "react-redux";
import "~/sass/elements/buttons.scss";
import {
  deleteProfileWorklistItem,
  DeleteProfileWorklistItemTriggerType,
} from "~/actions/main-function/profile";
import { Action, bindActionCreators, Dispatch } from "redux";
import Button from "~/components/general/button";
import { withTranslation, WithTranslation } from "react-i18next";
import { AnyActionType } from "~/actions";
import { WorklistItem } from "~/generated/client";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * DeleteWorklistItemDialogProps
 */
interface DeleteWorklistItemDialogProps extends WithTranslation<["common"]> {
  deleteProfileWorklistItem: DeleteProfileWorklistItemTriggerType;
  isOpen: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClose: () => any;
  item: WorklistItem;
}

/**
 * DeleteWorklistItemDialogState
 */
interface DeleteWorklistItemDialogState {}

/**
 * DeleteWorklistItemDialog
 */
class DeleteWorklistItemDialog extends React.Component<
  DeleteWorklistItemDialogProps,
  DeleteWorklistItemDialogState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: DeleteWorklistItemDialogProps) {
    super(props);

    this.delete = this.delete.bind(this);
  }

  /**
   * delete
   * @param closeDialog closeDialog
   */
  delete(closeDialog: () => void) {
    this.props.deleteProfileWorklistItem({
      item: this.props.item,
      success: closeDialog,
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
        <span>{this.props.t("content.removing", { ns: "worklist" })}</span>
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
          onClick={this.delete.bind(this, closeDialog)}
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
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        title={this.props.t("labels.remove", { ns: "worklist" })}
        content={content}
        footer={footer}
        modifier="delete-worklist-item"
      />
    );
  }
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators({ deleteProfileWorklistItem }, dispatch);
}

export default withTranslation(["common"])(
  connect(null, mapDispatchToProps)(DeleteWorklistItemDialog)
);
