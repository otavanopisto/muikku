import * as React from "react";
import { connect } from "react-redux";
import Dialog from "~/components/general/dialog";
import "~/sass/elements/link.scss";
import { StateType } from "~/reducers";
import Button from "~/components/general/button";
import { bindActionCreators } from "redux";
import {
  MaterialContentNodeWithIdAndLogic,
  WorkspaceMaterialEditorType,
} from "~/reducers/workspaces";
import {
  DeleteWorkspaceMaterialContentNodeTriggerType,
  deleteWorkspaceMaterialContentNode,
} from "~/actions/workspaces/material";
import { WithTranslation, withTranslation } from "react-i18next";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * DeleteWorkspaceMaterialDialogProps
 */
interface DeleteWorkspaceMaterialDialogProps extends WithTranslation {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: any;
  isSection?: boolean;
  material: MaterialContentNodeWithIdAndLogic;
  deleteWorkspaceMaterialContentNode: DeleteWorkspaceMaterialContentNodeTriggerType;
  materialEditor: WorkspaceMaterialEditorType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
  delete(closeDialog: () => void) {
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
    const { t } = this.props;

    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => void) => (
      <div>
        <span>
          {this.props.isSection
            ? t("content.removing", {
                ns: "materials",
                context: "section",
              })
            : t("content.removing", {
                ns: "materials",
                context: "page",
              })}
        </span>
      </div>
    );

    /**
     * footer
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => void) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["standard-ok", "fatal"]}
          onClick={this.delete.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {t("actions.remove")}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={closeDialog}
          disabled={this.state.locked}
        >
          {t("actions.cancel")}
        </Button>
      </div>
    );

    return (
      <Dialog
        modifier="evaluation-cancel-dialog"
        title={
          this.props.isSection
            ? t("labels.remove", {
                context: "section",
                ns: "materials",
              })
            : t("labels.pageRemoval", {
                ns: "materials",
              })
        }
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
    materialEditor: state.workspaces.materialEditor,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators({ deleteWorkspaceMaterialContentNode }, dispatch);
}

export default withTranslation(["materials", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(DeleteWorkspaceMaterialDialog)
);
