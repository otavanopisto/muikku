import Dialog from "~/components/general/dialog";
import * as React from "react";
import { connect } from "react-redux";
import { StateType } from "~/reducers";
import "~/sass/elements/buttons.scss";
import { Action, bindActionCreators, Dispatch } from "redux";
import Button from "~/components/general/button";
import {
  toggleActiveStateOfStudentOfWorkspace,
  ToggleActiveStateOfStudentOfWorkspaceTriggerType,
} from "~/actions/workspaces";
import { getName } from "~/util/modifiers";
import { WorkspaceDataType } from "~/reducers/workspaces";
import { WorkspaceStudent } from "~/generated/client/models/WorkspaceStudent";
import { AnyActionType } from "~/actions";
import { withTranslation, WithTranslation } from "react-i18next";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * DeactivateReactivateUserDialogProps
 */
interface DeactivateReactivateUserDialogProps extends WithTranslation {
  user: WorkspaceStudent;
  toggleActiveStateOfStudentOfWorkspace: ToggleActiveStateOfStudentOfWorkspaceTriggerType;
  workspace: WorkspaceDataType;

  isOpen: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onClose: () => any;
}

/**
 * DeactivateReactivateUserDialogState
 */
interface DeactivateReactivateUserDialogState {}

/**
 * DeactivateReactivateUserDialog
 */
class DeactivateReactivateUserDialog extends React.Component<
  DeactivateReactivateUserDialogProps,
  DeactivateReactivateUserDialogState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: DeactivateReactivateUserDialogProps) {
    super(props);

    this.toggleActiveStatus = this.toggleActiveStatus.bind(this);
  }

  /**
   * toggleActiveStatus
   * @param closeDialog closeDialog
   */
  toggleActiveStatus(closeDialog: () => void) {
    this.props.toggleActiveStateOfStudentOfWorkspace({
      workspace: this.props.workspace,
      student: this.props.user,
      success: closeDialog,
    });
  }

  /**
   *
   */
  render() {
    const { t } = this.props;

    t("actions.archive");

    /**
     * content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => void) => (
      <div>
        <span>
          {this.props.user.active
            ? t("content.archiveStudent", {
                ns: "workspace",
                studentName: getName(this.props.user, true),
              })
            : t("content.unArchiveStudent", {
                ns: "workspace",
                studentName: getName(this.props.user, true),
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
          buttonModifiers={
            this.props.user.active
              ? ["fatal", "standard-ok"]
              : ["execute", "standard-ok"]
          }
          onClick={this.toggleActiveStatus.bind(this, closeDialog)}
        >
          {this.props.user.active ? t("actions.archive") : t("actions.restore")}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={closeDialog}
        >
          {this.props.user.active ? t("actions.cancel") : t("actions.cancel")}
        </Button>
      </div>
    );
    return (
      <Dialog
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        title={
          this.props.user.active
            ? t("labels.archive", { ns: "users" })
            : t("labels.unArchive", { ns: "users" })
        }
        content={content}
        footer={footer}
        modifier="deactivate-reactivate-user"
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
    workspace: state.workspaces.currentWorkspace,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators(
    { toggleActiveStateOfStudentOfWorkspace },
    dispatch
  );
}

export default withTranslation(["users", "workspace", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(DeactivateReactivateUserDialog)
);
