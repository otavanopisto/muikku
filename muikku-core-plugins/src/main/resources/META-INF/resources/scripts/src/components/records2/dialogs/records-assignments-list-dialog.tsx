import Dialog from "~/components/general/dialog";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/form-elements.scss";
import "~/sass/elements/form.scss";
import "~/sass/elements/wizard.scss";
import "~/sass/elements/dialog.scss";
import { StateType } from "~/reducers";
import { StudyAssignmentsList } from "../body/application/records/study-list";
import { DiaryList } from "../body/application/records/diary-list";

/**
 * RecordsAssigmentsListDialogProps
 */
interface RecordsAssigmentsListDialogProps {
  i18n: i18nType;
  userEntityId: number;
  children?: React.ReactElement<any>;
}

/**
 * RecordsAssigmentsListDialogState
 */
interface RecordsAssigmentsListDialogState {}

/**
 * RecordsAssigmentsListDialog
 */
class RecordsAssigmentsListDialog extends React.Component<
  RecordsAssigmentsListDialogProps,
  RecordsAssigmentsListDialogState
> {
  render() {
    let content = (closeDialog: () => any) => (
      <div style={{ display: "flex" }}>
        <div>
          <StudyAssignmentsList
            i18n={this.props.i18n}
            userEntityId={this.props.userEntityId}
            assignments={[]}
            compositeReplies={[]}
          />
        </div>
        <div>
          <DiaryList i18n={this.props.i18n} diaryEvents={[]} />
        </div>
      </div>
    );
    let footer = (closeDialog: () => any) => {
      return <div className="dialog__button-set"></div>;
    };
    return (
      <Dialog
        disableScroll={true}
        title="[Kurssin nimi] tehtävät"
        content={content}
        modifier={["assignments"]}
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
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecordsAssigmentsListDialog);
