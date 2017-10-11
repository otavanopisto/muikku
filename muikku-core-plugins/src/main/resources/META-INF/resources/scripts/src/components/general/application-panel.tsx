import * as React from 'react';

import '~/sass/elements/application-panel.scss';
import '~/sass/elements/loaders.scss';

interface ApplicationPanelProps {
  modifier: string,
  title: React.ReactElement<any> | string,
  icon: React.ReactElement<any> | string,
  primaryOption: React.ReactElement<any>,
  toolbar: React.ReactElement<any>,
  aside: React.ReactElement<any>,
  children?: React.ReactElement<any> | Array<React.ReactElement<any>>
}

interface ApplicationPanelState {
  
}

export default class ApplicationPanel extends React.Component<ApplicationPanelProps, ApplicationPanelState> {
  constructor(props: ApplicationPanelProps){
    super(props);
  }
  render(){
    return (<div className={`application-panel application-panel--${this.props.modifier}`}>
      <div className="application-panel__container">                
        <div className="application-panel__header">
          <div className="application-panel__helper-container">{this.props.title}</div>
          <div className="application-panel__main-container">{this.props.icon}</div>
        </div>          
        <div className="application-panel__body">
          <div className="application-panel__actions">
            <div className="application-panel__helper-container">{this.props.primaryOption}</div>
            <div className="application-panel__main-container">{this.props.toolbar}</div>
          </div>
          <div className="application-panel__content">
            <div className="application-panel__helper-container">{this.props.aside}</div>
            <div className="application-panel__main-container loader-empty">{this.props.children}</div>
          </div>
        </div>
      </div>
    </div>);
  }
}

