import React from 'react';
import {connect} from 'react-redux';

class WorkspacesPanel extends React.Component {
  render(){
    return (<div className="ordered-container-item index panel">
      <div className="index text index-text-for-panels-title index-text-for-panels-title-workspaces">
        <span className="icon icon-books"></span>
        <span>{this.props.i18n.text.get('plugin.frontPage.workspaces.title')}</span>
      </div>
      <div data-controller-widget="panel-workspaces"></div>
     </div>);
  }
}

function mapStateToProps(state){
  return {
    i18n: state.i18n
  }
};

const mapDispatchToProps = (dispatch)=>{
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkspacesPanel);