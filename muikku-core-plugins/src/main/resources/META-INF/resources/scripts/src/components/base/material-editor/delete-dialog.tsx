import * as React from "react";
import { connect, Dispatch } from "react-redux";
import Link from "~/components/general/link";
import Dialog from "~/components/general/dialog";
import { AnyActionType } from "~/actions";
import { i18nType } from "~/reducers/base/i18n";

import "~/sass/elements/link.scss";
import { StateType } from "~/reducers";
import Button from "~/components/general/button";
import { bindActionCreators } from "redux";
import {
  WorkspaceType,
  MaterialContentNodeType,
  WorkspaceMaterialEditorType,
} from "~/reducers/workspaces";
import {
  deleteWorkspaceMaterialContentNode,
  DeleteWorkspaceMaterialContentNodeTriggerType,
} from "~/actions/workspaces";

interface DeleteWorkspaceMaterialDialogProps {
  i18n: i18nType;
  children: any;
  isSection?: boolean;
  material: MaterialContentNodeType;
  deleteWorkspaceMaterialContentNode: DeleteWorkspaceMaterialContentNodeTriggerType;
  materialEditor: WorkspaceMaterialEditorType;
  onDeleteSuccess: () => any;
}

interface DeleteWorkspaceMaterialDialogState {
  locked: boolean;
}

class DeleteWorkspaceMaterialDialog extends React.Component<
  DeleteWorkspaceMaterialDialogProps,
  DeleteWorkspaceMaterialDialogState
> {
  constructor(props: DeleteWorkspaceMaterialDialogProps) {
    super(props);
    this.state = {
      locked: false,
    };

    this.delete = this.delete.bind(this);
  }
  delete(closeDialog: () => any) {
    this.setState({
      locked: true,
    });
    this.props.deleteWorkspaceMaterialContentNode({
      material: this.props.material,
      workspace: this.props.materialEditor.currentNodeWorkspace,
      success: () => {
        this.setState({
          locked: false,
        });
        closeDialog();
        this.props.onDeleteSuccess();
      },
      fail: () => {
        this.setState({
          locked: false,
        });
        closeDialog();
      },
    });
  }
  render() {
    const content = (closeDialog: () => any) => (
      <div>
        <span>
          {this.props.i18n.text.get(
            this.props.isSection
              ? "plugin.workspace.materialsManagement.confirmSectionDelete.text"
              : "plugin.workspace.materialsManagement.confirmDelete.text"
          )}
        </span>
      </div>
    );

    const footer = (closeDialog: () => any) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["standard-ok", "fatal"]}
          onClick={this.delete.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {this.props.i18n.text.get(
            this.props.isSection
              ? "plugin.workspace.materialsManagement.confirmSectionDelete.confirmButton"
              : "plugin.workspace.materialsManagement.confirmDelete.confirmButton"
          )}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={closeDialog}
          disabled={this.state.locked}
        >
          {this.props.i18n.text.get(
            this.props.isSection
              ? "plugin.workspace.materialsManagement.confirmSectionDelete.cancelButton"
              : "plugin.workspace.materialsManagement.confirmDelete.cancelButton"
          )}
        </Button>
      </div>
    );

    return (
      <Dialog
        modifier="evaluation-cancel-dialog"
        title={this.props.i18n.text.get(
          this.props.isSection
            ? "plugin.workspace.materialsManagement.confirmSectionDelete.title"
            : "plugin.workspace.materialsManagement.confirmDelete.title"
        )}
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
    materialEditor: state.workspaces.materialEditor,
  };
}

function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ deleteWorkspaceMaterialContentNode }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteWorkspaceMaterialDialog);
