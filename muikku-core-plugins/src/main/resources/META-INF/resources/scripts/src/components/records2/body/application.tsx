import * as React from "react";
import { connect, Dispatch } from "react-redux";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import { i18nType } from "reducers/base/i18n";
import Records from "./application/records";
import CurrentRecord from "./application/current-record";
// import Vops from './application/vops';
import Hops from "./application/hops";
import Summary from "./application/summary";
import YO from "./application/yo";
import { StateType } from "~/reducers";
import ApplicationPanelBody from "../../general/application-panel/components/application-panel-body";

/**
 * StudiesApplicationProps
 */
interface StudiesApplicationProps {
  aside: React.ReactElement<any>;
  i18n: i18nType;
}

/**
 * StudiesApplicationState
 */
interface StudiesApplicationState {
  activeTab: "RECORDS" | "CURRENT_RECORD" | "HOPS" | "SUMMARY" | "YO";
}

/**
 * StudiesApplication
 */
class StudiesApplication extends React.Component<
  StudiesApplicationProps,
  StudiesApplicationState
> {
  /**
   * constructor
   * @param props
   */
  constructor(props: StudiesApplicationProps) {
    super(props);

    this.state = {
      activeTab: "SUMMARY",
    };
  }

  /**
   * onTabChange
   * @param id
   */
  onTabChange = (
    id: "RECORDS" | "CURRENT_RECORD" | "HOPS" | "SUMMARY" | "YO"
  ) => {
    this.setState({
      activeTab: id,
    });
  };

  /**
   * render
   * @returns JSX.Element
   */
  render() {
    let title = (
      <h1 className="application-panel__header-title">
        {this.props.i18n.text.get("plugin.records.pageTitle")}
      </h1>
    );

    return (
      <ApplicationPanel
        modifier="organization"
        title={title}
        onTabChange={this.onTabChange}
        activeTab={this.state.activeTab}
        panelTabs={[
          {
            id: "SUMMARY",
            name: "Opintojen yhteenveto",
            component: () => {
              return (
                <ApplicationPanelBody modifier="tabs" children={<Summary />} />
              );
            },
          },
          {
            id: "RECORDS",
            name: "Suoritukset",
            component: () => {
              return (
                <ApplicationPanelBody modifier="tabs" children={<Records />} />
              );
            },
          },
          {
            id: "CURRENT_RECORD",
            name: this.props.i18n.text.get(
              "plugin.organization.tab.title.users"
            ),
            component: () => {
              return (
                <ApplicationPanelBody
                  modifier="tabs"
                  children={<CurrentRecord />}
                />
              );
            },
          },
          {
            id: "Henkilökohtainen opetussuunnitelma",
            name: this.props.i18n.text.get(
              "plugin.organization.tab.title.users"
            ),
            component: () => {
              return (
                <ApplicationPanelBody modifier="tabs" children={<Hops />} />
              );
            },
          },

          {
            id: "YO",
            name: "YO",
            component: () => {
              return <ApplicationPanelBody modifier="tabs" children={<YO />} />;
            },
          },
        ]}
      />
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

export default connect(mapStateToProps, mapDispatchToProps)(StudiesApplication);
