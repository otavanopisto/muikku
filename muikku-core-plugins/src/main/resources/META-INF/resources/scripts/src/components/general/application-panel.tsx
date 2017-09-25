import * as React from 'react';
import * as PropTypes from 'prop-types';

export default class ApplicationPanel extends React.Component {
  static propTypes = {
    classNameExtension: PropTypes.string.isRequired,
    title: PropTypes.element.isRequired,
    icon: PropTypes.element.isRequired,
    primaryOption: PropTypes.element.isRequired,
    toolbar: PropTypes.element.isRequired,
    navigation: PropTypes.element.isRequired,
    children: PropTypes.oneOfType([PropTypes.element, PropTypes.arrayOf(PropTypes.element)])
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

