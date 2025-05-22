import Dialog from "~/components/general/dialog";
import * as React from "react";
import { connect } from "react-redux";
import { StateType } from "~/reducers";
import "~/sass/elements/buttons.scss";
import Button from "~/components/general/button";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { bindActionCreators } from "redux";
import {
  updateCurrentWorkspaceImagesB64,
  UpdateCurrentWorkspaceImagesB64TriggerType,
} from "~/actions/workspaces";
import "~/sass/elements/rangeslider.scss";
import { withTranslation, WithTranslation } from "react-i18next";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * DeleteImageDialogProps
 */
interface DeleteImageDialogProps extends WithTranslation {
  displayNotification: DisplayNotificationTriggerType;
  updateCurrentWorkspaceImagesB64: UpdateCurrentWorkspaceImagesB64TriggerType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onDelete: () => any;
  isOpen: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    this.deleteImage = this.deleteImage.bind(this);
  }

  /**
   * deleteImage
   * @param closeDialog closeDialog
   */
  deleteImage(closeDialog: () => void) {
    const { t } = this.props;

    closeDialog();
    this.props.updateCurrentWorkspaceImagesB64({
      delete: true,
      /**
       * success
       */
      success: () => {
        this.props.displayNotification(
          t("notifications.removeSuccess", { ns: "workspace" }),
          "success"
        );
        this.props.onDelete();
      },
    });
  }

  /**
   * render
   */
  render() {
    const { t } = this.props;

    /**
     *  content
     * @param closeDialog closeDialog
     */
    const content = (closeDialog: () => void) => (
      <div>{t("content.removing", { ns: "workspace", context: "image" })}</div>
    );
    /**
     * footer
     * @param closeDialog closeDialog
     */
    const footer = (closeDialog: () => void) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["execute", "standard-ok"]}
          onClick={this.deleteImage.bind(this, closeDialog)}
        >
          {t("actions.remove")}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={closeDialog}
        >
          {t("actions.cancel")}
        </Button>
      </div>
    );
    return (
      <Dialog
        isOpen={this.props.isOpen}
        title={t("labels.remove", {
          context: "image",
        })}
        content={content}
        footer={footer}
        modifier="delete-header-image"
        onClose={this.props.onClose}
      />
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {};
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return bindActionCreators(
    { displayNotification, updateCurrentWorkspaceImagesB64 },
    dispatch
  );
}

export default withTranslation(["workspace"])(
  connect(mapStateToProps, mapDispatchToProps)(DeleteImageDialog)
);
