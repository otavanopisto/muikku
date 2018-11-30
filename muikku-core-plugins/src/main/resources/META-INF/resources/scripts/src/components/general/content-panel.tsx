import * as React from 'react';

import '~/sass/elements/content-panel.scss';
import '~/sass/elements/loaders.scss';

interface ContentPanelProps {
  modifier: string,
  title?: React.ReactElement<any> | string,
  navigation: React.ReactElement<any>
}

interface ContentPanelState {
  
}

export default class ContentPanel extends React.Component<ContentPanelProps, ContentPanelState> {
  render(){
    return (        
    <div className={`content-panel content-panel--${this.props.modifier}`} ref="panel">
      <div className="content-panel__container">                
        
        <div className="content-panel__header">{this.props.title}</div>
        
        <div className="content-panel__body" ref="body">
          <div className="content-panel__content">
            <div className={`content-panel__main-container loader-empty`}>{this.props.children}</div>
            <div className="content-panel__navigation">{
              this.props.navigation
            }</div>
          </div>
        </div>
      </div>
    </div>);
  }
}

export class ContentPanelItem extends React.Component<{}, {}> {
  render(){
    return (<div className="content-panel__item">{this.props.children}</div>);
  }
}