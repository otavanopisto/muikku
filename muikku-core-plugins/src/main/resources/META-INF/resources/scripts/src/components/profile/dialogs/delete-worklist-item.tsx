import Dialog from "~/components/general/dialog";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18nOLD";
import { StateType } from "~/reducers";
import "~/sass/elements/buttons.scss";
import {
  deleteProfileWorklistItem,
  DeleteProfileWorklistItemTriggerType,
} from "~/actions/main-function/profile";
import { bindActionCreators } from "redux";
import Button from "~/components/general/button";
import { StoredWorklistItem } from "~/reducers/main-function/profile";

/**
 * DeleteWorklistItemDialogProps
 */
interface DeleteWorklistItemDialogProps {
  i18nOLD: i18nType;
  deleteProfileWorklistItem: DeleteProfileWorklistItemTriggerType;
  isOpen: boolean;
  onClose: () => any;
  item: StoredWorklistItem;
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
  delete(closeDialog: () => any) {
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
     * @param closeDialog
     */
    const content = (closeDialog: () => any) => (
      <div>
        <span>
          {this.props.i18nOLD.text.get(
            "plugin.profile.worklist.delete.dialog.description"
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
          buttonModifiers={["fatal", "standard-ok"]}
          onClick={this.delete.bind(this, closeDialog)}
        >
          {this.props.i18nOLD.text.get(
            "plugin.profile.worklist.delete.dialog.button.deleteLabel"
          )}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={closeDialog}
        >
          {this.props.i18nOLD.text.get(
            "plugin.profile.worklist.delete.dialog.button.cancelLabel"
          )}
        </Button>
      </div>
    );
    return (
      <Dialog
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        title={this.props.i18nOLD.text.get(
          "plugin.profile.worklist.delete.dialog.title"
        )}
        content={content}
        footer={footer}
        modifier="delete-worklist-item"
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
    i18nOLD: state.i18nOLD,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({ deleteProfileWorklistItem }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteWorklistItemDialog);
