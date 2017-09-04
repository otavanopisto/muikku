import React from 'react';
import PropTypes from 'prop-types';

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
        <div className="application-panel-navigation">
          <div className="application-panel-left-container">{this.props.title}</div>
          <div className="application-panel-right-container">{this.props.icon}</div>
        </div>
        <div className="application-panel-box">
          <div className="application-panel-navigation">
            <div className="application-panel-left-container">{this.props.primaryOption}</div>
            <div className="application-panel-right-container">{this.props.toolbar}</div>
          </div>
          <div className="application-panel-body">
            <div className="application-panel-left-container">{this.props.navigation}</div>
            <div className="application-panel-right-container loader-empty">{this.props.children}</div>
          </div>
        </div>
      </div>
    </div>);
  }
}

