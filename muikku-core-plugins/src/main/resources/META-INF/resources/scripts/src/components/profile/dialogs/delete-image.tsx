import Dialog from "~/components/general/dialog";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18nOLD";
import { StateType } from "~/reducers";
import "~/sass/elements/buttons.scss";
import {
  deleteProfileImage,
  DeleteProfileImageTriggerType,
} from "~/actions/main-function/profile";
import { bindActionCreators } from "redux";
import Button from "~/components/general/button";

/**
 * DeleteImageDialogProps
 */
interface DeleteImageDialogProps {
  i18nOLD: i18nType;

  deleteProfileImage: DeleteProfileImageTriggerType;

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

    this.delete = this.delete.bind(this);
  }

  /**
   * delete
   * @param closeDialog closeDialog
   */
  delete(closeDialog: () => any) {
    this.props.deleteProfileImage();
    closeDialog();
  }
  /**
   * render
   */
  render() {
    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => any) => (
      <div>
        <span>
          {this.props.i18nOLD.text.get(
            "plugin.profile.deleteImage.dialog.description"
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
            "plugin.profile.deleteImage.dialog.button.deleteLabel"
          )}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={closeDialog}
        >
          {this.props.i18nOLD.text.get(
            "plugin.profile.deleteImage.dialog.button.cancelLabel"
          )}
        </Button>
      </div>
    );
    return (
      <Dialog
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        title={this.props.i18nOLD.text.get(
          "plugin.profile.deleteImage.dialog.title"
        )}
        content={content}
        footer={footer}
        modifier="delete-image"
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
  return bindActionCreators({ deleteProfileImage }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteImageDialog);
