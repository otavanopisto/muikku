import Link from '../../general/link';
import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {i18nType} from '~/reducers/base/i18n';
import {StatusType} from '~/reducers/base/status';
import {AnnouncementListType, AnnouncementType} from '~/reducers/main-function/announcer/announcements';

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

class AnnouncementsPanel extends React.Component<AnnouncementsPanelProps, AnnouncementsPanelState> {
  render(){
    return (<div className="ordered-container__item">
        <div className="text text--for-panels-title text--for-panels-title--announcements">
          <span className="text__panel-icon text__panel-icon--announcements icon-announcer"></span>
          <span className="text__panel-title">{this.props.i18n.text.get('plugin.frontPage.announcements')}</span>
        </div>
        <div className="panel panel--index">
          {this.props.announcements.length !== 0 ?
            <div className="item-list item-list--panel-announcements">
              {this.props.announcements.map((announcement: AnnouncementType)=>{
                return <Link key={announcement.id} className={`item-list__item ${announcement.workspaces ? "item-list__item--has-workspaces" : ""}`}
                  href={`/announcements?announcementId=${announcement.id}`}>
                  <span className="item-list__icon icon-announcer"></span>
                  <span className="text item-list__text-body item-list__text-body--multiline">
                    {announcement.caption}
                    <span className="text text--announcements-date">
                      {this.props.i18n.time.format(announcement.created)}
                    </span>
                  </span>
                </Link>
              })}
            </div>  
          :
            <div className="text text--panel-nothing">
             {this.props.i18n.text.get("plugin.announcer.empty.title")}
            </div>
          }
      </div>
    </div>);
  }
}

function mapStateToProps(state: any){
  return {
    status: state.status,
    i18n: state.i18n,
    announcements: state.announcements
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(AnnouncementsPanel);