import Dialog from "~/components/general/dialog";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18nOLD";
import { StateType } from "~/reducers";
import "~/sass/elements/buttons.scss";
import Button from "~/components/general/button";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { bindActionCreators } from "redux";
import {
  updateCurrentWorkspaceImagesB64,
  UpdateCurrentWorkspaceImagesB64TriggerType,
} from "~/actions/workspaces";
import "~/sass/elements/rangeslider.scss";

/**
 * DeleteImageDialogProps
 */
interface DeleteImageDialogProps {
  i18nOLD: i18nType;
  displayNotification: DisplayNotificationTriggerType;
  updateCurrentWorkspaceImagesB64: UpdateCurrentWorkspaceImagesB64TriggerType;
  onDelete: () => any;
  isOpen: boolean;
  onClose: () => any;
}

/**
 * DeleteImageDialogState
 */
interface DeleteImageDialogState {}

/**
 * DeleteImageDialog
 */
class DeleteImageDialog extends React.Component<
  DeleteImageDialogProps,
  DeleteImageDialogState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: DeleteImageDialogProps) {
    super(props);
    this.deleteImage = this.deleteImage.bind(this);
  }

  /**
   * deleteImage
   * @param closeDialog closeDialog
   */
  deleteImage(closeDialog: () => any) {
    closeDialog();
    this.props.updateCurrentWorkspaceImagesB64({
      delete: true,
      /**
       * success
       */
      success: () => {
        this.props.displayNotification(
          this.props.i18nOLD.text.get(
            "plugin.workspace.management.notification.coverImage.deleted"
          ),
          "success"
        );
        this.props.onDelete();
      },
    });
  }

  /**
   * render
   */
  render() {
    /**
     *  content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => any) => (
      <div>
        {this.props.i18nOLD.text.get(
          "plugin.workspace.management.deleteImage.dialog.description"
        )}
      </div>
    );
    /**
     * footer
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => any) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["execute", "standard-ok"]}
          onClick={this.deleteImage.bind(this, closeDialog)}
        >
          {this.props.i18nOLD.text.get(
            "plugin.workspace.management.deleteImage.dialog.deleteButton.label"
          )}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={closeDialog}
        >
          {this.props.i18nOLD.text.get(
            "plugin.workspace.management.deleteImage.dialog.cancelButton.label"
          )}
        </Button>
      </div>
    );
    return (
      <Dialog
        isOpen={this.props.isOpen}
        title={this.props.i18nOLD.text.get(
          "plugin.workspace.management.changeImage.dialog.title"
        )}
        content={content}
        footer={footer}
        modifier="delete-header-image"
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
    i18nOLD: state.i18nOLD,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators(
    { displayNotification, updateCurrentWorkspaceImagesB64 },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteImageDialog);
