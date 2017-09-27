import * as React from 'react';

interface ApplicationPanelProps {
  classNameExtension: string,
  title: React.ReactElement<any> | string,
  icon: React.ReactElement<any> | string,
  primaryOption: React.ReactElement<any>,
  toolbar: React.ReactElement<any>,
  navigation: React.ReactElement<any>,
  children?: React.ReactElement<any> | Array<React.ReactElement<any>>
}

interface ApplicationPanelState {
  
}

export default class ApplicationPanel extends React.Component<ApplicationPanelProps, ApplicationPanelState> {
  constructor(props: ApplicationPanelProps){
    super(props);
  }
  render(){
    return (<div className={`${this.props.classNameExtension} application-panel`}>
      <div className="application-panel-container">                
        <div className="application-panel-header">
          <div className="application-panel-helper-container">{this.props.title}</div>
          <div className="application-panel-main-container">{this.props.icon}</div>
        </div>          
        <div className="application-panel-body">
          {/* TODO: This not a navigation */}
          <div className="application-panel-actions">
            <div className="application-panel-helper-container">{this.props.primaryOption}</div>
            <div className="application-panel-main-container">{this.props.toolbar}</div>
          </div>
          <div className="application-panel-content">
            <div className="application-panel-helper-container">{this.props.navigation}</div>
            <div className="application-panel-main-container loader-empty">{this.props.children}</div>
          </div>
        </div>
      </div>
    </div>);
  }
}

