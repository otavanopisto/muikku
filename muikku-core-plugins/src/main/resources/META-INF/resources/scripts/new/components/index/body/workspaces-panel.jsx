import React from 'react';
import {connect} from 'react-redux';
import Link from '../../general/link.jsx';

class WorkspacesPanel extends React.Component {
  render(){
    return (<div className="ordered-container-item index panel">
      <div className="index text index-text-for-panels-title index-text-for-panels-title-workspaces">
        <span className="icon icon-books"></span>
        <span>{this.props.i18n.text.get('plugin.frontPage.workspaces.title')}</span>
      </div>
      {this.props.workspaces ? (
        <div className="index item-list index-item-list-panel-workspaces">
          {this.props.workspaces.map((workspace)=>{
            return <Link key={workspace.id} className="item-list-item" href={`/workspace/${workspace.urlName}`}>
              <span className="icon icon-books"></span>
              <span className="item-list-text-body text">
                {`${workspace.name} ${workspace.nameExtension ? workspace.nameExtension : ""}`}
              </span>
            </Link>
          })}
        </div>
      ) : (
        <div className="index text index-text-panel-no-workspaces">
          {this.props.i18n.text.get('plugin.frontPage.workspaces.noWorkspaces.part1')}
          <Link href="/coursepicker">
            {this.props.i18n.text.get('plugin.frontPage.workspaces.noWorkspaces.coursepicker')}
          </Link>
          {" "}{this.props.i18n.text.get('plugin.frontPage.workspaces.noWorkspaces.part2')}
        </div>
      )}
     </div>);
  }
}

function mapStateToProps(state){
  return {
    i18n: state.i18n,
    workspaces: state.workspaces
  }
};

const mapDispatchToProps = (dispatch)=>{
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkspacesPanel);