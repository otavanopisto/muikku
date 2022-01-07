/* eslint-disable react/no-string-refs */

/**
 * Depcrecated refs should be refactored
 */

import * as React from "react";
import Tabs, { TabType } from "~/components/general/tabs";
import ApplicationPanelBody from "./components/application-panel-body";
import "~/sass/elements/application-panel.scss";
import "~/sass/elements/loaders.scss";
import { createAllTabs } from "~/helper-functions/tabs";

interface ApplicationPanelProps {
  modifier?: string;
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
}

interface ApplicationPanelState {}

export default class ApplicationPanel extends React.Component<
  ApplicationPanelProps,
  ApplicationPanelState
> {
  constructor(props: ApplicationPanelProps) {
    super(props);
  }

  render() {
    return (
      <main
        className={`application-panel ${
          this.props.modifier ? "application-panel--" + this.props.modifier : ""
        }`}
        ref="panel"
      >
        <div
          className={`application-panel__container ${
            this.props.modifier
              ? "application-panel__container--" + this.props.modifier
              : ""
          }`}
        >
          <h1
            className={`application-panel__header   ${
              this.props.modifier
                ? "application-panel__header--" + this.props.modifier
                : ""
            }`}
          >
            {this.props.title ? (
              <span
                className={`application-panel__header-title ${
                  this.props.modifier
                    ? "application-panel__header-title--" + this.props.modifier
                    : ""
                }`}
              >
                {this.props.title}
              </span>
            ) : null}
            {this.props.icon ? (
              <span
                className={`application-panel__header-actions ${
                  this.props.modifier
                    ? "application-panele__header-actions--" +
                      this.props.modifier
                    : ""
                }`}
              >
                {this.props.icon}
              </span>
            ) : null}
          </h1>
          {this.props.panelTabs ? (
            <Tabs
              allTabs={createAllTabs(this.props.panelTabs)}
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

interface ApplicationPanelToolbarActionsMainProps {
  modifier?: string;
}

interface ApplicationPanelToolbarActionsMainState {}

export class ApplicationPanelToolbarActionsMain extends React.Component<
  ApplicationPanelToolbarActionsMainProps,
  ApplicationPanelToolbarActionsMainState
> {
  render() {
    return (
      <div
        className={`application-panel__toolbar-actions-main ${
          this.props.modifier
            ? "application-panel__toolbar-actions-main--" + this.props.modifier
            : ""
        }`}
      >
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
