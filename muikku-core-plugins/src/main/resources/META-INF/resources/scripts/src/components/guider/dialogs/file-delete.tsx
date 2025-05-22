import * as React from "react";
import Dialog from "~/components/general/dialog";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import Button from "~/components/general/button";
import {
  removeFileFromCurrentStudent,
  RemoveFileFromCurrentStudentTriggerType,
} from "~/actions/main-function/guider";
import { UserFileType } from "~/reducers/user-index";

import "~/sass/elements/form.scss";
import { withTranslation, WithTranslation } from "react-i18next";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * FileDeleteDialogProps
 */
interface FileDeleteDialogProps extends WithTranslation<["common"]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any>;
  isOpen?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClose?: () => any;
  file: UserFileType;
  removeFileFromCurrentStudent: RemoveFileFromCurrentStudentTriggerType;
}

/**
 * FileDeleteDialogState
 */
interface FileDeleteDialogState {}

/**
 * FileDeleteDialog
 */
class FileDeleteDialog extends React.Component<
  FileDeleteDialogProps,
  FileDeleteDialogState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: FileDeleteDialogProps) {
    super(props);

    this.deleteFile = this.deleteFile.bind(this);
  }

  /**
   * deleteFile
   * @param closeDialog closeDialog
   */
  deleteFile(closeDialog: () => void) {
    this.props.removeFileFromCurrentStudent(this.props.file);
    closeDialog();
  }

  /**
   * render
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
          onClick={this.deleteFile.bind(this, closeDialog)}
        >
          {this.props.i18n.t("actions.remove")}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={closeDialog}
        >
          {this.props.i18n.t("actions.cancel")}
        </Button>
      </div>
    );

    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => void) => (
      <div>
        {this.props.i18n.t("content.removing", {
          context: "attachment",
          name: this.props.file.fileName,
        })}
      </div>
    );
    return (
      <Dialog
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        modifier="guider-delete-file"
        title={this.props.i18n.t("labels.remove", { context: "attachment" })}
        content={content}
        footer={footer}
      >
        {this.props.children}
      </Dialog>
    );
  }
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators({ removeFileFromCurrentStudent }, dispatch);
}

export default withTranslation(["guider"])(
  connect(null, mapDispatchToProps)(FileDeleteDialog)
);
