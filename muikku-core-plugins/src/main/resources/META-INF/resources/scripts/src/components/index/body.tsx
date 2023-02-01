import MainFunctionNavbar from "../base/main-function/navbar";
import ScreenContainer from "../general/screen-container";
import AnnouncementsPanel from "./body/announcements-panel";
import LastMessagesPanel from "./body/latest-messages-panel";
import WallPanel from "./body/wall-panel";
import WorkspacesPanel from "./body/workspaces-panel";
import StudiesPanel from "./body/studies-panel";
import { i18nType } from "~/reducers/base/i18nOLD";
import * as React from "react";
import { StateType } from "~/reducers";
import { connect } from "react-redux";
import { StatusType } from "~/reducers/base/status";
import StudiesEnded from "./body/studies-ended";
import CheckContactInfoDialog from "~/components/base/check-contact-info-dialog";
import "~/sass/elements/wcag.scss";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * IndexBodyProps
 */
interface IndexBodyProps extends WithTranslation {
  status: StatusType;
  i18nOLD: i18nType;
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
              {this.props.t("wcag.indexViewHeader", { ns: "frontPage" })}
            </h1>
            <div className="panel-group panel-group--studies">
              {this.props.status.isStudent ? (
                <StudiesPanel />
              ) : (
                <WorkspacesPanel />
              )}
            </div>
            <div className="panel-group panel-group--info">
              {this.props.status.isStudent ? <WallPanel /> : null}
              <LastMessagesPanel />
            </div>

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

export default withTranslation(["frontPage"])(
  connect(mapStateToProps, mapDispatchToProps)(IndexBody)
);
