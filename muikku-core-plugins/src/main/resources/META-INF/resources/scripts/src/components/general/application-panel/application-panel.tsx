/* eslint-disable react/no-string-refs */

/**
 * Depcrecated refs should be refactored
 */

import * as React from "react";
import Tabs, { Tab } from "~/components/general/tabs";
import ApplicationPanelBody from "./components/application-panel-body";
import "~/sass/elements/application-panel.scss";
import "~/sass/elements/loaders.scss";

/**
 * ApplicationPanelProps
 */
interface ApplicationPanelProps {
  modifier?: string;
  title?: React.ReactElement<any> | string;
  panelOptions?: React.JSX.Element;
  icon?: React.ReactElement<any> | string;
  panelTabs?: Array<Tab>;
  onTabChange?: (id: string, hash?: string | Tab) => any;
  activeTab?: string;
  primaryOption?: React.ReactElement<any>;
  toolbar?: React.ReactElement<any>;
  asideBefore?: React.ReactElement<any>;
  asideAfter?: React.ReactElement<any>;
  children?: React.ReactElement<any> | Array<React.ReactElement<any>>;
}

/**
 * ApplicationPanelState
 */
interface ApplicationPanelState {}

/**
 * ApplicationPanel
 */
export default class ApplicationPanel extends React.Component<
  ApplicationPanelProps,
  ApplicationPanelState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: ApplicationPanelProps) {
    super(props);
  }

  /**
   * Component render method
   * @returns React.JSX.Element
   */
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
          {this.props.title ? (
            <div className="application-panel__header">
              <div
                className={`application-panel__header   ${
                  this.props.modifier
                    ? "application-panel__header--" + this.props.modifier
                    : ""
                }`}
              >
                <span
                  className={`application-panel__header-title ${
                    this.props.modifier
                      ? "application-panel__header-title--" +
                        this.props.modifier
                      : ""
                  }`}
                >
                  {this.props.title}
                  {this.props.panelOptions ? (
                    <div className="application-panel__header-options">
                      {this.props.panelOptions}
                    </div>
                  ) : null}
                </span>
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
              </div>
            </div>
          ) : null}

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
            >
              {this.props.children}
            </ApplicationPanelBody>
          )}
        </div>
      </main>
    );
  }
}

/**
 * ApplicationPanelToolbarProps
 */
interface ApplicationPanelToolbarProps {
  children?: React.ReactNode;
}

/**
 * ApplicationPanelToolbarState
 */
interface ApplicationPanelToolbarState {}

/**
 * ApplicationPanelToolbar
 */
export class ApplicationPanelToolbar extends React.Component<
  ApplicationPanelToolbarProps,
  ApplicationPanelToolbarState
> {
  /**
   * Component render method
   * @returns React.JSX.Element
   */
  render() {
    return (
      <div className="application-panel__toolbar">{this.props.children}</div>
    );
  }
}

/**
 * ApplicationPanelToolbarActionsMainProps
 */
interface ApplicationPanelToolbarActionsMainProps {
  modifier?: string;
  children?: React.ReactNode;
}

/**
 * ApplicationPanelToolbarActionsMainState
 */
interface ApplicationPanelToolbarActionsMainState {}

/**
 * ApplicationPanelToolbarActionsMain
 */
export class ApplicationPanelToolbarActionsMain extends React.Component<
  ApplicationPanelToolbarActionsMainProps,
  ApplicationPanelToolbarActionsMainState
> {
  /**
   * Component render method
   * @returns React.JSX.Element
   */
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

/**
 * ApplicationPanelToolbarActionsAsideProps
 */
interface ApplicationPanelToolbarActionsAsideProps {
  children?: React.ReactNode;
}

/**
 * ApplicationPanelToolbarActionsAsideState
 */
interface ApplicationPanelToolbarActionsAsideState {}

/**
 * ApplicationPanelToolbarActionsAside
 */
export class ApplicationPanelToolbarActionsAside extends React.Component<
  ApplicationPanelToolbarActionsAsideProps,
  ApplicationPanelToolbarActionsAsideState
> {
  /**
   * Component render method
   * @returns React.JSX.Element
   */
  render() {
    return (
      <div className="application-panel__toolbar-actions-aside">
        {this.props.children}
      </div>
    );
  }
}

/**
 * ApplicationPanelToolsContainerProps
 */
interface ApplicationPanelToolsContainerProps {
  children?: React.ReactNode;
}

/**
 * ApplicationPanelToolsContainerState
 */
interface ApplicationPanelToolsContainerState {}

/**
 * ApplicationPanelToolsContainer
 */
export class ApplicationPanelToolsContainer extends React.Component<
  ApplicationPanelToolsContainerProps,
  ApplicationPanelToolsContainerState
> {
  /**
   * Component render method
   * @returns React.JSX.Element
   */
  render() {
    return (
      <div className="application-panel__toolbar-tools-container">
        {this.props.children}
      </div>
    );
  }
}
