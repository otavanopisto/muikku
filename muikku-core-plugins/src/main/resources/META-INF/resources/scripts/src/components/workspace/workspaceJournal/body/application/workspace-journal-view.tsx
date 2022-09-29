import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { StateType } from "~/reducers";
import "~/sass/elements/link.scss";
import "~/sass/elements/label.scss";
import "~/sass/elements/application-list.scss";
import "~/sass/elements/message.scss";
import { AnyActionType } from "~/actions";
import { WorkspaceType } from "~/reducers/workspaces";
import WorkspaceJournalsListItem from "./workspace-journals-list-item";
import ApplicationList from "~/components/general/application-list";

/**
 * MessageViewProps
 */
interface WorkspaceJournalViewProps {
  currentWorkspace: WorkspaceType;
}

/**
 * WorkspaceJournalView
 * @param props props
 */
const WorkspaceJournalView: React.FC<WorkspaceJournalViewProps> = (props) => {
  if (
    !props.currentWorkspace ||
    !props.currentWorkspace.journals ||
    !props.currentWorkspace.journals.currentJournal
  ) {
    return null;
  }

  return (
    <ApplicationList>
      <WorkspaceJournalsListItem
        journal={props.currentWorkspace.journals.currentJournal}
        showCommentList={true}
        asCurrent={true}
      />
    </ApplicationList>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    currentWorkspace: state.workspaces.currentWorkspace,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkspaceJournalView);
