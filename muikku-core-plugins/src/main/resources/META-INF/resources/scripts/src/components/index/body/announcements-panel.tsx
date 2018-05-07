import Link from '../../general/link';
import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {i18nType} from '~/reducers/base/i18n';
import {StatusType} from '~/reducers/base/status';
import {AnnouncementListType, AnnouncementType} from '~/reducers/main-function/announcements';
import {StateType} from '~/reducers';

import '~/sass/elements/ordered-container.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/item-list.scss';
import '~/sass/elements/panel.scss';

interface AnnouncementsPanelProps {
  i18n: i18nType,
  status: StatusType,
  announcements: AnnouncementListType
}

interface AnnouncementsPanelState {
  
}

//TODO css get rid of ordered container
class AnnouncementsPanel extends React.Component<AnnouncementsPanelProps, AnnouncementsPanelState> {
  render(){
    return (<div className="ordered-container__item ordered-container__item--index-panel-container ordered-container__item--basic-announcements">
        <div className="text text--for-panels-title">
          <span className="text__panel-icon text__panel-icon--announcements icon-announcer"></span>
          <span className="text__panel-title">{this.props.i18n.text.get('plugin.frontPage.announcements.title')}</span>
        </div>
        <div className="panel panel--index">
          {this.props.announcements.length !== 0 ?
            <div className="item-list item-list--panel-announcements">
              {this.props.announcements.map((announcement: AnnouncementType)=>{
                return <Link key={announcement.id} className={`item-list__item item-list__item--announcements ${announcement.workspaces ? "item-list__item--has-workspaces" : ""}`}
                  href={`/announcements?announcementId=${announcement.id}`}>
                  <span className="item-list__icon item-list__icon--announcements icon-announcer"></span>
                  <span className="text item-list__text-body item-list__text-body--multiline">
                    <span className="text item-list__announcement-caption">
                      {announcement.caption}
                    </span>
                    <span className="text item-list__announcement-date">
                      {this.props.i18n.time.format(announcement.startDate)}
                    </span>
                  </span>
                </Link>
              })}
            </div>  
          :
            <div className="text text--panel-nothing">
             {this.props.i18n.text.get("plugin.frontPage.announcements.noAnnouncements")}
            </div>
          }
      </div>
    </div>);
  }
}

function mapStateToProps(state: StateType){
  return {
    status: state.status,
    i18n: state.i18n,
    announcements: state.announcements.announcements
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnnouncementsPanel);