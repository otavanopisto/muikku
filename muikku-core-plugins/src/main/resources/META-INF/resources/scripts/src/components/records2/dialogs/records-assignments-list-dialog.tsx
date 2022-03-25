import Dialog from "~/components/general/dialog";
import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import "~/sass/elements/form.scss";
import "~/sass/elements/dialog.scss";
import "~/sass/elements/records.scss";
import { StateType } from "~/reducers";
import { StudyAssignmentsList } from "../body/application/records/study-list";
import { DiaryList } from "../body/application/records/diary-list";

/**
 * RecordsAssigmentsListDialogProps
 */
interface RecordsAssigmentsListDialogProps {
  i18n: i18nType;
  courseName: string;
  userEntityId: number;
  workspaceEntityId: number;
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
  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    /**
     * content
     * @param closeDialog closeDialog
     * @returns JSX.Element
     */
    const content = (closeDialog: () => any) => (
      <div className="records-container">
        <div className="records-assignment-section">
          <StudyAssignmentsList
            i18n={this.props.i18n}
            userEntityId={this.props.userEntityId}
            workspaceId={this.props.workspaceEntityId}
          />
        </div>
        <div className="records-assignment-section">
          <DiaryList
            i18n={this.props.i18n}
            userEntityId={this.props.userEntityId}
            workspaceEntityId={this.props.workspaceEntityId}
          />
        </div>
      </div>
    );

    return (
      <Dialog
        disableScroll={true}
        title={`${this.props.courseName} tehtävät`}
        content={content}
        modifier={["assignments"]}
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
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(RecordsAssigmentsListDialog);
