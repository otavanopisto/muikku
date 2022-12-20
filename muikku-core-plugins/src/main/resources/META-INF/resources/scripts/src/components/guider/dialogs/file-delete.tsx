import * as React from "react";
import Dialog from "~/components/general/dialog";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { i18nType } from "~/reducers/base/i18nOLD";
import Button from "~/components/general/button";

import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import {
  removeFileFromCurrentStudent,
  RemoveFileFromCurrentStudentTriggerType,
} from "~/actions/main-function/guider";
import { UserFileType } from "~/reducers/user-index";

import "~/sass/elements/form.scss";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * FileDeleteDialogProps
 */
interface FileDeleteDialogProps extends WithTranslation<["common"]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any>;
  isOpen?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClose?: () => any;
  i18nOLD: i18nType;
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
          {this.props.i18nOLD.text.get(
            "plugin.guider.flags.deleteAttachmentDialog.yes"
          )}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={closeDialog}
        >
          {this.props.i18nOLD.text.get(
            "plugin.guider.flags.deleteAttachmentDialog.no"
          )}
        </Button>
      </div>
    );

    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => void) => (
      <div>
        {this.props.i18nOLD.text.get(
          "plugin.guider.flags.deleteAttachmentDialog.description"
        )}
      </div>
    );
    return (
      <Dialog
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        modifier="guider-delete-file"
        title={this.props.i18nOLD.text.get(
          "plugin.guider.flags.deleteAttachmentDialog.title"
        )}
        content={content}
        footer={footer}
      >
        {this.props.children}
      </Dialog>
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
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ removeFileFromCurrentStudent }, dispatch);
}

export default withTranslation(["common"])(
  connect(mapStateToProps, mapDispatchToProps)(FileDeleteDialog)
);
