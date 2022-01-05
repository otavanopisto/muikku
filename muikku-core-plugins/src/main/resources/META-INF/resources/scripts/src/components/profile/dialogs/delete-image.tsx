import Dialog from "~/components/general/dialog";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import { StateType } from "~/reducers";
import "~/sass/elements/buttons.scss";
import {
  deleteProfileImage,
  DeleteProfileImageTriggerType,
} from "~/actions/main-function/profile";
import { bindActionCreators } from "redux";
import Button from "~/components/general/button";

interface DeleteImageDialogProps {
  i18n: i18nType;

  deleteProfileImage: DeleteProfileImageTriggerType;

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

    this.delete = this.delete.bind(this);
  }
  delete(closeDialog: () => any) {
    this.props.deleteProfileImage();
    closeDialog();
  }
  render() {
    const content = (closeDialog: () => any) => (
      <div>
        <span>
          {this.props.i18n.text.get(
            "plugin.profile.deleteImage.dialog.description",
          )}
        </span>
      </div>
    );
    const footer = (closeDialog: () => any) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["fatal", "standard-ok"]}
          onClick={this.delete.bind(this, closeDialog)}
        >
          {this.props.i18n.text.get(
            "plugin.profile.deleteImage.dialog.button.deleteLabel",
          )}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={closeDialog}
        >
          {this.props.i18n.text.get(
            "plugin.profile.deleteImage.dialog.button.cancelLabel",
          )}
        </Button>
      </div>
    );
    return (
      <Dialog
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        title={this.props.i18n.text.get(
          "plugin.profile.deleteImage.dialog.title",
        )}
        content={content}
        footer={footer}
        modifier="delete-image"
      />
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({ deleteProfileImage }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteImageDialog);
