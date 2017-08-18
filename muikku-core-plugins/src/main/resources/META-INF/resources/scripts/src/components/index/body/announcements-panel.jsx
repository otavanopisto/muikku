import Link from '../../general/link.jsx';
import React from 'react';
import {connect} from 'react-redux';

class AnnouncementsPanel extends React.Component {
  render(){
    return (<div className="ordered-container-item index panel">
        <div className="index text index-text-for-panels-title index-text-for-panels-title-announcements">
        <span className="icon icon-announcer"></span>
        <span>{this.props.i18n.text.get('plugin.frontPage.announcements')}</span>
      </div>
      {this.props.announcements.length !== 0 ?
        <div className="index item-list index-item-list-panel-announcements">
          {this.props.announcements.map((announcement)=>{
            return <Link key={announcement.id} className={`item-list-item ${announcement.workspaces ? "item-list-item-has-workspaces" : ""}`}
              href={`/announcements?announcementId=${announcement.id}`}>
              <span className="icon icon-announcer"></span>
              <span className="text item-list-text-body item-list-text-body-multiline">
                {announcement.caption}
                <span className="index text index-text-announcements-date">
                  {this.props.i18n.time.format(announcement.created)}
                </span>
              </span>
            </Link>
          })}
        </div>  
      :
        <div className="index text index-text-panel-no-announcements">{this.props.i18n.text.get("plugin.announcer.empty.title")}</div>
      }
    </div>);
  }
}

function mapStateToProps(state){
  return {
    status: state.status,
    i18n: state.i18n,
    announcements: state.announcements
  }
};

const mapDispatchToProps = (dispatch)=>{
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnnouncementsPanel);