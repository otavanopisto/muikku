import Dialog from "~/components/general/dialog";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import Link from "~/components/general/link";
import { i18nType } from "~/reducers/base/i18n";
import { StateType } from "~/reducers";
import "~/sass/elements/buttons.scss";
import Button, { ButtonPill } from "~/components/general/button";
import {
  displayNotification,
  DisplayNotificationTriggerType
} from "~/actions/base/notifications";
import { bindActionCreators } from "redux";
import {
  updateCurrentWorkspaceImagesB64,
  UpdateCurrentWorkspaceImagesB64TriggerType
} from "~/actions/workspaces";
let Slider = require("react-rangeslider").default;
import "~/sass/elements/rangeslider.scss";

interface DeleteImageDialogProps {
  i18n: i18nType;
  displayNotification: DisplayNotificationTriggerType;
  updateCurrentWorkspaceImagesB64: UpdateCurrentWorkspaceImagesB64TriggerType;
  onDelete: () => any;
  isOpen: boolean;
  onClose: () => any;
}

interface DeleteImageDialogState {}

class DeleteImageDialog extends React.Component<
  DeleteImageDialogProps,
  DeleteImageDialogState
> {
  constructor(props: DeleteImageDialogProps) {
    super(props);
    this.deleteImage = this.deleteImage.bind(this);
  }

  deleteImage(closeDialog: () => any) {
    closeDialog();
    this.props.updateCurrentWorkspaceImagesB64({
      delete: true,
      success: () => {
        this.props.displayNotification(
          this.props.i18n.text.get(
            "plugin.workspace.management.notification.coverImage.deleted"
          ),
          "success"
        );
        this.props.onDelete();
      }
    });
  }

  render() {
    let content = (closeDialog: () => any) => (
      <div>
        {this.props.i18n.text.get(
          "plugin.workspace.management.deleteImage.dialog.description"
        )}
      </div>
    );
    let footer = (closeDialog: () => any) => {
      return (
        <div className="dialog__button-set">
          <Button
            buttonModifiers={["execute", "standard-ok"]}
            onClick={this.deleteImage.bind(this, closeDialog)}
          >
            {this.props.i18n.text.get(
              "plugin.workspace.management.deleteImage.dialog.deleteButton.label"
            )}
          </Button>
          <Button
            buttonModifiers={["cancel", "standard-cancel"]}
            onClick={closeDialog}
          >
            {this.props.i18n.text.get(
              "plugin.workspace.management.deleteImage.dialog.cancelButton.label"
            )}
          </Button>
        </div>
      );
    };
    return (
      <Dialog
        isOpen={this.props.isOpen}
        title={this.props.i18n.text.get(
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

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators(
    { displayNotification, updateCurrentWorkspaceImagesB64 },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteImageDialog);
