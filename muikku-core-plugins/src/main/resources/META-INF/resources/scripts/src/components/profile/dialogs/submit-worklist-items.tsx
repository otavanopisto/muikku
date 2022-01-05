import Dialog from "~/components/general/dialog";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
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

interface SubmitWorklistItemsDialogProps {
  i18n: i18nType;
  summary: WorklistItemsSummary;
  children: React.ReactElement<any>;
  updateProfileWorklistItemsState: UpdateProfileWorklistItemsStateTriggerType;
}

interface SubmitWorklistItemsDialogState {}

class SubmitWorklistItemsDialog extends React.Component<
  SubmitWorklistItemsDialogProps,
  SubmitWorklistItemsDialogState
> {
  constructor(props: SubmitWorklistItemsDialogProps) {
    super(props);

    this.submit = this.submit.bind(this);
  }
  submit(closeDialog: () => any) {
    this.props.updateProfileWorklistItemsState({
      beginDate: this.props.summary.beginDate,
      endDate: this.props.summary.endDate,
      state: WorklistBillingState.PROPOSED,
      success: closeDialog,
    });
  }
  render() {
    const content = (closeDialog: () => any) => (
      <div>
        <span>
          {this.props.i18n.text.get(
            "plugin.profile.worklist.submitForApproval.dialog.description"
          )}
        </span>
      </div>
    );
    const footer = (closeDialog: () => any) => (
      <div className="dialog__button-set">
        <Button
          buttonModifiers={["success", "standard-ok"]}
          onClick={this.submit.bind(this, closeDialog)}
        >
          {this.props.i18n.text.get(
            "plugin.profile.worklist.submitForApproval.dialog.button.submitLabel"
          )}
        </Button>
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={closeDialog}
        >
          {this.props.i18n.text.get(
            "plugin.profile.worklist.submitForApproval.dialog.button.cancelLabel"
          )}
        </Button>
      </div>
    );
    return (
      <Dialog
        title={this.props.i18n.text.get(
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

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({ updateProfileWorklistItemsState }, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SubmitWorklistItemsDialog);
