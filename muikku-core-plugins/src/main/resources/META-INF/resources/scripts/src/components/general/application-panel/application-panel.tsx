import * as React from "react";
import Tabs, { TabType } from "~/components/general/tabs";
import ApplicationPanelBody from "./components/application-panel-body";
import "~/sass/elements/application-panel.scss";
import "~/sass/elements/loaders.scss";

interface ApplicationPanelProps {
  modifier: string;
  title?: React.ReactElement<any> | string;
  icon?: React.ReactElement<any> | string;
  panelTabs?: Array<TabType>;
  onTabChange?: (id: string) => any;
  activeTab?: string;
  primaryOption?: React.ReactElement<any>;
  toolbar?: React.ReactElement<any>;
  asideBefore?: React.ReactElement<any>;
  asideAfter?: React.ReactElement<any>;
  children?: React.ReactElement<any> | Array<React.ReactElement<any>>;
  disableStickyScrolling?: boolean;
}

interface ApplicationPanelState {
  offsetBorderAgainstBottom: number;
}

export default class ApplicationPanel extends React.Component<
  ApplicationPanelProps,
  ApplicationPanelState
> {
  constructor(props: ApplicationPanelProps) {
    super(props);
    this.state = {
      offsetBorderAgainstBottom: 0,
    };
  }

  componentDidMount() {
    this.calculate();
  }

  private calculate = () => {
    let panelComputedStyle = document.defaultView.getComputedStyle(
      this.refs["panel"] as HTMLElement
    );
    const offsetBorderAgainstBottom = parseInt(
      panelComputedStyle.getPropertyValue("padding-bottom")
    );

    this.setState({
      offsetBorderAgainstBottom,
    });
  };

  render() {
    console.log("???", this.state.offsetBorderAgainstBottom);

    return (
      <main
        className={`application-panel application-panel--${this.props.modifier}`}
        ref="panel"
      >
        <div className="application-panel__container">
          <h1 className="application-panel__header">
            {this.props.title ? (
              <span className="application-panel__header-title">
                {this.props.title}
              </span>
            ) : null}
            {this.props.icon ? (
              <span className="application-panel__header-actions">
                {this.props.icon}
              </span>
            ) : null}
          </h1>
          {this.props.panelTabs ? (
            <Tabs
              modifier="application-panel"
              tabs={this.props.panelTabs}
              onTabChange={this.props.onTabChange}
              activeTab={this.props.activeTab}
            />
          ) : (
            <ApplicationPanelBody
              modifier={this.props.modifier ? this.props.modifier : ""}
              toolbar={this.props.toolbar}
              primaryOption={this.props.primaryOption}
              asideAfter={this.props.asideAfter}
              asideBefore={this.props.asideBefore}
              disableStickyScrolling={this.props.disableStickyScrolling}
              offsetBorderAgainstBottom={this.state.offsetBorderAgainstBottom}
            >
              {this.props.children}
            </ApplicationPanelBody>
          )}
        </div>
      </main>
    );
  }
}

interface ApplicationPanelToolbarProps {}

interface ApplicationPanelToolbarState {}

export class ApplicationPanelToolbar extends React.Component<
  ApplicationPanelToolbarProps,
  ApplicationPanelToolbarState
> {
  render() {
    return (
      <div className="application-panel__toolbar">{this.props.children}</div>
    );
  }
}

interface ApplicationPanelToolbarActionsMainProps {}

interface ApplicationPanelToolbarActionsMainState {}

export class ApplicationPanelToolbarActionsMain extends React.Component<
  ApplicationPanelToolbarActionsMainProps,
  ApplicationPanelToolbarActionsMainState
> {
  render() {
    return (
      <div className="application-panel__toolbar-actions-main">
        {this.props.children}
      </div>
    );
  }
}

interface ApplicationPanelToolbarActionsAsideProps {}

interface ApplicationPanelToolbarActionsAsideState {}

export class ApplicationPanelToolbarActionsAside extends React.Component<
  ApplicationPanelToolbarActionsAsideProps,
  ApplicationPanelToolbarActionsAsideState
> {
  render() {
    return (
      <div className="application-panel__toolbar-actions-aside">
        {this.props.children}
      </div>
    );
  }
}

interface ApplicationPanelToolsContainerProps {}

interface ApplicationPanelToolsContainerState {}

export class ApplicationPanelToolsContainer extends React.Component<
  ApplicationPanelToolsContainerProps,
  ApplicationPanelToolsContainerState
> {
  render() {
    return (
      <div className="application-panel__tools-container">
        {this.props.children}
      </div>
    );
  }
}
