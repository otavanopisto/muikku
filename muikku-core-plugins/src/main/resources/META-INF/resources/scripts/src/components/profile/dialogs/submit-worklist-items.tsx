import Dialog from "~/components/general/dialog";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18nOLD";
import { StateType } from "~/reducers";
import "~/sass/elements/buttons.scss";
import { bindActionCreators } from "redux";
import Button from "~/components/general/button";
import {
  WorklistBillingState,
  WorklistItemsSummary,
} from "~/reducers/main-function/profile";
import {
  UpdateProfileWorklistItemsStateTriggerType,
  updateProfileWorklistItemsState,
} from "~/actions/main-function/profile";
import { withTranslation, WithTranslation } from "react-i18next";
import { AnyActionType } from "~/actions";

/**
 * SubmitWorklistItemsDialogProps
 */
interface SubmitWorklistItemsDialogProps extends WithTranslation<["common"]> {
  i18nOLD: i18nType;
  summary: WorklistItemsSummary;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  children: React.ReactElement<any>;
  updateProfileWorklistItemsState: UpdateProfileWorklistItemsStateTriggerType;
}

/**
 * SubmitWorklistItemsDialogState
 */
interface SubmitWorklistItemsDialogState {}

/**
 * SubmitWorklistItemsDialog
 */
class SubmitWorklistItemsDialog extends React.Component<
  SubmitWorklistItemsDialogProps,
  SubmitWorklistItemsDialogState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: SubmitWorklistItemsDialogProps) {
    super(props);

    this.submit = this.submit.bind(this);
  }

  /**
   * submit
   * @param closeDialog closeDialog
   */
  submit(closeDialog: () => void) {
    this.props.updateProfileWorklistItemsState({
      beginDate: this.props.summary.beginDate,
      endDate: this.props.summary.endDate,
      state: WorklistBillingState.PROPOSED,
      success: closeDialog,
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
    const content = (closeDialog: () => void) => (
      <div>
        <span>
          {this.props.i18nOLD.text.get(
            "plugin.profile.worklist.submitForApproval.dialog.description"
          )}
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
          buttonModifiers={["success", "standard-ok"]}
          onClick={this.submit.bind(this, closeDialog)}
        >
          {this.props.i18nOLD.text.get(
            "plugin.profile.worklist.submitForApproval.dialog.button.submitLabel"
          )}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={closeDialog}
        >
          {this.props.i18nOLD.text.get(
            "plugin.profile.worklist.submitForApproval.dialog.button.cancelLabel"
          )}
        </Button>
      </div>
    );
    return (
      <Dialog
        title={this.props.i18nOLD.text.get(
          "plugin.profile.worklist.submitForApproval.dialog.title"
        )}
        content={content}
        footer={footer}
        modifier="submit-worklist-item"
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
  return bindActionCreators({ updateProfileWorklistItemsState }, dispatch);
}

export default withTranslation(["common"])(
  connect(mapStateToProps, mapDispatchToProps)(SubmitWorklistItemsDialog)
);
