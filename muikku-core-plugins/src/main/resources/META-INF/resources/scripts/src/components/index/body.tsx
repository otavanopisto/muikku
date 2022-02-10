import MainFunctionNavbar from "../base/main-function/navbar";
import ScreenContainer from "../general/screen-container";
import AnnouncementsPanel from "./body/announcements-panel";
import ContinueStudiesPanel from "./body/continue-studies-panel";
import ImportantPanel from "./body/important-panel";
import LastMessagesPanel from "./body/latest-messages-panel";
import WorkspacesPanel from "./body/workspaces-panel";
import { i18nType } from "~/reducers/base/i18n";
import * as React from "react";
import { StateType } from "~/reducers";
import { connect } from "react-redux";
import { StatusType } from "~/reducers/base/status";
import StudiesEnded from "./body/studies-ended";
import CheckContactInfoDialog from "~/components/base/check-contact-info-dialog";
import "~/sass/elements/wcag.scss";
import GuidanceEventsPanel from "./body/guidance-events-panel";

/**
 * IndexBodyProps
 */
interface IndexBodyProps {
  status: StatusType;
  i18n: i18nType;
}

//TODO css get rid of ordered container
/**
 * IndexBody
 */
class IndexBody extends React.Component<
  IndexBodyProps,
  Record<string, unknown>
> {
  /**
   * render
   */
  render() {
    return (
      <div>
        <MainFunctionNavbar activeTrail="index" />
        {this.props.status.isActiveUser ? (
          <ScreenContainer viewModifiers="index">
            <h1 className="visually-hidden">
              {this.props.i18n.text.get("plugin.wcag.indexViewHeader")}
            </h1>
            <div className="panel-group panel-group--studies">
              <ContinueStudiesPanel />
              <WorkspacesPanel />
            </div>
            <LastMessagesPanel />
            <GuidanceEventsPanel/>
            <AnnouncementsPanel overflow={true} />
          </ScreenContainer>
        ) : (
          <ScreenContainer viewModifiers="index">
            <StudiesEnded />
          </ScreenContainer>
        )}
        <CheckContactInfoDialog />
      </div>
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
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(IndexBody);
