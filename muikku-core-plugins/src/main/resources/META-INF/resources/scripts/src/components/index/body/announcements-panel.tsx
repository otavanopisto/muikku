import Link from '../../general/link';
import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {i18nType} from '~/reducers/base/i18n';
import {StatusType} from '~/reducers/base/status';
import {AnnouncementListType, AnnouncementType} from '~/reducers/announcements';
import {StateType} from '~/reducers';

import '~/sass/elements/item-list.scss';
import '~/sass/elements/panel.scss';
import '~/sass/elements/label.scss';

interface AnnouncementsPanelProps {
  i18n: i18nType,
  status: StatusType,
  announcements: AnnouncementListType
}

interface AnnouncementsPanelState {

}

class AnnouncementsPanel extends React.Component<AnnouncementsPanelProps, AnnouncementsPanelState> {
  render(){
    return (<div className="panel panel--announcements">
      <div className="panel__header">
        <div className="panel__header-icon panel__header-icon--announcements icon-paper-plane"></div>
        <div className="panel__header-title">{this.props.i18n.text.get('plugin.frontPage.announcements.title')}</div>
      </div>
      {this.props.announcements.length ? (
        <div className="panel__body">
          <div className="item-list item-list--panel-announcements">
            {this.props.announcements.map((announcement: AnnouncementType)=>{
              let extraWorkspaces = announcement.workspaces && announcement.workspaces.length ? announcement.workspaces.length - 1 : 0;
              return <Link key={announcement.id} className={`item-list__item item-list__item--announcements ${announcement.workspaces.length ? "item-list__item--has-workspaces" : ""}`}
                to={`/announcements#${announcement.id}`}>
                <span className="item-list__icon item-list__icon--announcements icon-paper-plane"></span>
                <span className="item-list__text-body item-list__text-body--multiline">
                  <span className="item-list__announcement-caption">
                    {announcement.caption}
                  </span>
                  <span className="item-list__announcement-date">
                    {this.props.i18n.time.format(announcement.startDate)}
                  </span>
                  {announcement.workspaces && announcement.workspaces.length ?
                    <div className="labels item-list__announcement-workspaces">
                      <span className="label">
                        <span className="label__icon label__icon--announcement-workspace icon-books"></span>
                        <span className="label__text label__text--announcement-workspace">{announcement.workspaces[0].name} {announcement.workspaces[0].nameExtension ? "(" + announcement.workspaces[0].nameExtension + ")" : null }</span>
                      </span>
                      {extraWorkspaces ? <span className="label">{"(+" + extraWorkspaces + ")"}</span> : null}
                    </div> : null}
                </span>
              </Link>
            })}
          </div>
        </div>
        ) : (
          <div className="panel__body panel__body--empty">
            {this.props.i18n.text.get("plugin.frontPage.announcements.noAnnouncements")}
          </div>
      )}
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
