import * as React from "react";
import { connect } from "react-redux";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import { StateType } from "reducers";
import { StatusType } from "~/reducers/base/status";
import ChatSettings from "./application/chat-settings";
import ContactInformation from "./application/contact-information";
import GeneralInformation from "./application/general-information";
import Security from "./application/security";
import VacationSettings from "./application/vacation-settings";
import WorkList from "./application/work-list";
import { i18nType } from "~/reducers/base/i18nOLD";
import Purchases from "./application/purchases";

/**
 * ProfileApplicationProps
 */
interface ProfileApplicationProps {
  i18nOLD: i18nType;
  aside: React.ReactElement;
  status: StatusType;
}

/**
 * ProfileApplicationState
 */
interface ProfileApplicationState {}

/**
 * ProfileApplication
 */
class ProfileApplication extends React.Component<
  ProfileApplicationProps,
  ProfileApplicationState
> {
  /**
   * render
   */
  render() {
    if (!this.props.status.profile) {
      return null;
    }
    return (
      <>
        <ApplicationPanel
          title={this.props.status.profile.displayName}
          asideBefore={this.props.aside}
        >
          <ChatSettings />
          <ContactInformation />
          <GeneralInformation />
          <Security />
          <VacationSettings />
          <WorkList />
          <Purchases />
        </ApplicationPanel>
      </>
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
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(ProfileApplication);
