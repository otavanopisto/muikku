import * as React from "react";
import { connect, Dispatch } from "react-redux";
import Dialog from "~/components/general/dialog";
import { AnyActionType } from "~/actions";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/link.scss";
import { StateType } from "~/reducers";
import Button from "~/components/general/button";
import { bindActionCreators } from "redux";
import {
  MaterialContentNodeType,
  WorkspaceMaterialEditorType,
} from "~/reducers/workspaces";
import {
  DeleteWorkspaceMaterialContentNodeTriggerType,
  deleteWorkspaceMaterialContentNode,
} from "~/actions/workspaces/material";
import { MaterialContentNode } from "~/generated/client";

/**
 * DeleteWorkspaceMaterialDialogProps
 */
interface DeleteWorkspaceMaterialDialogProps {
  i18n: i18nType;
  children: any;
  isSection?: boolean;
  material: MaterialContentNode;
  deleteWorkspaceMaterialContentNode: DeleteWorkspaceMaterialContentNodeTriggerType;
  materialEditor: WorkspaceMaterialEditorType;
  onDeleteSuccess: () => any;
}

/**
 * DeleteWorkspaceMaterialDialogState
 */
interface DeleteWorkspaceMaterialDialogState {
  locked: boolean;
}

/**
 * DeleteWorkspaceMaterialDialog
 */
class DeleteWorkspaceMaterialDialog extends React.Component<
  DeleteWorkspaceMaterialDialogProps,
  DeleteWorkspaceMaterialDialogState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: DeleteWorkspaceMaterialDialogProps) {
    super(props);
    this.state = {
      locked: false,
    };

    this.delete = this.delete.bind(this);
  }

  /**
   * delete
   * @param closeDialog closeDialog
   */
  delete(closeDialog: () => any) {
    this.setState({
      locked: true,
    });
    this.props.deleteWorkspaceMaterialContentNode({
      material: this.props.material,
      workspace: this.props.materialEditor.currentNodeWorkspace,
      /**
       * success
       */
      success: () => {
        this.setState({
          locked: false,
        });
        closeDialog();
        this.props.onDeleteSuccess();
      },
      /**
       * fail
       */
      fail: () => {
        this.setState({
          locked: false,
        });
        closeDialog();
      },
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

    /**
     * footer
     * @param closeDialog closeDialog
     */
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

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    materialEditor: state.workspaces.materialEditor,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ deleteWorkspaceMaterialContentNode }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DeleteWorkspaceMaterialDialog);
