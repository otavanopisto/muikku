import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
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
import { UserGroupType } from "~/reducers/user-index";

interface CourseProps {
  i18n: i18nType;
  status: StatusType;
  usergroup: UserGroupType;
}

interface CourseState { }

class Workspace extends React.Component<CourseProps, CourseState> {
  constructor(props: CourseProps) {
    super(props);

    this.state = {
      expanded: false,
    };
  }

  render() {
    let actions = (
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

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    status: state.status,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(Workspace);
