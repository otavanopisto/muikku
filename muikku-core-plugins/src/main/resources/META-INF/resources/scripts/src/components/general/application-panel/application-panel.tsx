import * as React from 'react';
import Tabs, {TabType} from '~/components/general/tabs';
import ApplicationPanelBody from './components/application-panel-body';
import '~/sass/elements/application-panel.scss';
import '~/sass/elements/loaders.scss';

interface ApplicationPanelProps {
  modifier: string,
  title?: React.ReactElement<any> | string,
  icon?: React.ReactElement<any> | string,
  panelTabs?: Array<TabType>
  onTabChange?:(id: string)=>any,
  activeTab? : string;
  primaryOption?: React.ReactElement<any>,
  toolbar?: React.ReactElement<any>,
  asideBefore?: React.ReactElement<any>,
  asideAfter?: React.ReactElement<any>,
  children?: React.ReactElement<any> | Array<React.ReactElement<any>>,
  disableStickyScrolling?: boolean
}

interface ApplicationPanelState {
}



export default class ApplicationPanel extends React.Component<ApplicationPanelProps, ApplicationPanelState> {
  private offsetBorderAgainstBottom: number;
  constructor(props: ApplicationPanelProps){
    super(props);
  }


  render(){
    return (
      <div className={`application-panel application-panel--${this.props.modifier}`} ref="panel">
        <div className="application-panel__container">
          <div className="application-panel__header">
          {this.props.title ?
            <div className="application-panel__header-title">{this.props.title}</div>
          : null}
          {this.props.icon ?
            <div className="application-panel__header-actions">{this.props.icon}</div>
          : null}
          </div>
          {this.props.panelTabs ? <Tabs modifier="application-panel" tabs={this.props.panelTabs} onTabChange={this.props.onTabChange} activeTab={this.props.activeTab} /> :
            <ApplicationPanelBody toolbar={this.props.toolbar} primaryOption={this.props.primaryOption} asideAfter={this.props.asideAfter} asideBefore={this.props.asideBefore} disableStickyScrolling={this.props.disableStickyScrolling}>
              {this.props.children}
            </ApplicationPanelBody>
          }
        </div>
      </div>
    );
  }
}

interface ApplicationPanelToolbarProps {
}

interface ApplicationPanelToolbarState {
}

export class ApplicationPanelToolbar extends React.Component<ApplicationPanelToolbarProps, ApplicationPanelToolbarState> {
  render(){
    return <div className="application-panel__toolbar">{this.props.children}</div>
  }
}

interface ApplicationPanelToolbarActionsMainProps {
}

interface ApplicationPanelToolbarActionsMainState {
}

export class ApplicationPanelToolbarActionsMain extends React.Component<ApplicationPanelToolbarActionsMainProps, ApplicationPanelToolbarActionsMainState> {
  render(){
    return <div className="application-panel__toolbar-actions-main">{this.props.children}</div>
  }
}

interface ApplicationPanelToolbarActionsAsideProps {

}

interface ApplicationPanelToolbarActionsAsideState {

}

export class ApplicationPanelToolbarActionsAside extends React.Component<ApplicationPanelToolbarActionsAsideProps, ApplicationPanelToolbarActionsAsideState> {
  render(){
    return <div className="application-panel__toolbar-actions-aside">{this.props.children}</div>
  }
}

interface ApplicationPanelToolsContainerProps {

}

interface ApplicationPanelToolsContainerState {

}

export class ApplicationPanelToolsContainer extends React.Component<ApplicationPanelToolsContainerProps, ApplicationPanelToolsContainerState>{
  render(){
    return <div className="application-panel__tools-container">{this.props.children}</div>
  }
}
