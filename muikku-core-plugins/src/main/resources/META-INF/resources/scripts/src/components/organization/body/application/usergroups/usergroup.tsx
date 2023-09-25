import * as React from "react";
import { connect } from "react-redux";
import "~/sass/elements/course.scss";
import "~/sass/elements/rich-text.scss";
import "~/sass/elements/application-list.scss";
import { StatusType } from "~/reducers/base/status";
import { StateType } from "~/reducers";
import UserGroupDialog from "~/components/organization/dialogs/edit-usergroup";
import {
  ApplicationListItem,
  ApplicationListItemHeader,
} from "~/components/general/application-list";
import { UserGroup } from "~/generated/client";

/**
 * CourseProps
 */
interface CourseProps {
  status: StatusType;
  usergroup: UserGroup;
}

/**
 * CourseState
 */
interface CourseState {}

/**
 * Workspace
 */
class Workspace extends React.Component<CourseProps, CourseState> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: CourseProps) {
    super(props);

    this.state = {
      expanded: false,
    };
  }

  /**
   * render
   */
  render() {
    const actions = (
      <div>
        <UserGroupDialog usergroup={this.props.usergroup}>
          <span className="icon-pencil"></span>
        </UserGroupDialog>
      </div>
    );
    return (
      <ApplicationListItem className="course">
        <ApplicationListItemHeader className="application-list__item-header--course">
          <span className={`application-list__header-icon icon-users`}></span>
          <span className="application-list__header-primary">
            {this.props.usergroup.name}
          </span>
          <span className="application-list__header-secondary">{actions}</span>
        </ApplicationListItemHeader>
      </ApplicationListItem>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Workspace);
