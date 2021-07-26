import * as React from "react";
import Dialog from "~/components/general/dialog";
import Link from "~/components/general/link";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { i18nType } from "~/reducers/base/i18n";
import Button from "~/components/general/button";

import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import {
  removeFileFromCurrentStudent,
  RemoveFileFromCurrentStudentTriggerType,
} from "~/actions/main-function/guider";
import { UserFileType } from "~/reducers/user-index";

import "~/sass/elements/form-elements.scss";
import "~/sass/elements/form.scss";

const KEYCODES = {
  ENTER: 13,
};

interface DeleteDialogProps {
  children: React.ReactElement<any>;
  isOpen?: boolean;
  onClose?: () => any;
  i18n: i18nType;
  removeFileFromCurrentStudent: RemoveFileFromCurrentStudentTriggerType;
}

interface DeleteDialogState {}

class DeleteDialog extends React.Component<
  DeleteDialogProps,
  DeleteDialogState
> {
  constructor(props: DeleteDialogProps) {
    super(props);

    this.deleteFile = this.deleteFile.bind(this);
  }

  deleteFile(closeDialog: () => any) {
    closeDialog();
  }

  render() {
    let footer = (closeDialog: () => any) => {
      return (
        <div className="dialog__button-set">
          <Button
            buttonModifiers={["fatal", "standard-ok"]}
            onClick={this.deleteFile.bind(this, closeDialog)}
          >
            Kyllä
          </Button>
          <Button
            buttonModifiers={["cancel", "standard-cancel"]}
            onClick={closeDialog}
          >
            Peruuta
          </Button>
        </div>
      );
    };
    let content = (closeDialog: () => any) => {
      return (
        <div>
          Oletko varma, että haluat poistaa merkinnän opiskelijalta "(Student)"?
        </div>
      );
    };
    return (
      <Dialog
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        modifier="guider-delete-file"
        title="Merkinnän poisto"
        content={content}
        footer={footer}
      >
        {this.props.children}
      </Dialog>
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ removeFileFromCurrentStudent }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(DeleteDialog);
