import * as React from "react";
import { connect } from "react-redux";
import Dialog from "~/components/general/dialog";
import "~/sass/elements/link.scss";
import { StateType } from "~/reducers";
import Button from "~/components/general/button";
import { WithTranslation, withTranslation } from "react-i18next";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * ConfirmRemoveDialogProps
 */
interface ConfirmRemoveDialogProps extends WithTranslation {
  onConfirm: (fileData: any) => any;
  file: any;
  children: React.ReactElement<any>;
}

/**
 * ConfirmRemoveDialogState
 */
interface ConfirmRemoveDialogState {
  locked: boolean;
}

/**
 * ConfirmRemoveDialog
 */
class ConfirmRemoveDialog extends React.Component<
  ConfirmRemoveDialogProps,
  ConfirmRemoveDialogState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: ConfirmRemoveDialogProps) {
    super(props);
    this.state = {
      locked: false,
    };

    this.cancel = this.cancel.bind(this);
    this.confirm = this.confirm.bind(this);
  }

  /**
   * confirm
   * @param closeDialog closeDialog
   */
  confirm(closeDialog: () => any) {
    closeDialog();
    this.props.onConfirm(this.props.file);
  }

  /**
   * cancel
   * @param closeDialog closeDialog
   */
  cancel(closeDialog?: () => any) {
    closeDialog();
  }

  /**
   * render
   * @returns React.JSX.Element
   */
  render() {
    const { t } = this.props;

    /**
     * content
     * @param closeDialog closeDialog
     * @returns React.JSX.Element
     */
    const content = (closeDialog: () => any) => (
      <div>
        <span>
          {t("content.removing", { ns: "materials", context: "file" })}
        </span>
      </div>
    );

    /**
     * footer
     * @param closeDialog closDialog
     * @returns React.JSX.Element
     */
    const footer = (closeDialog: () => any) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["standard-ok", "fatal"]}
          onClick={this.confirm.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {t("actions.remove")}
        </Button>
        <Button
          buttonModifiers={["standard-cancel", "cancel"]}
          onClick={this.cancel.bind(this, closeDialog)}
          disabled={this.state.locked}
        >
          {t("actions.cancel")}
        </Button>
      </div>
    );

    return (
      <Dialog
        modifier="confirm-remove-dialog"
        title={t("labels.remove", { ns: "files" })}
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
 * @returns object
 */
function mapStateToProps(state: StateType) {
  return {};
}

/**
 *
 * @param dispatch dispatch
 * @returns object
 */
function mapDispatchToProps(dispatch: AppDispatch) {
  return {};
}

export default withTranslation(["workspace", "files", "materials", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(ConfirmRemoveDialog)
);
