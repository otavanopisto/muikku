import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import Link from '~/components/general/link';
import {i18nType} from '~/reducers/base/i18n';

import '~/sass/elements/link.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/application-list.scss';
import { AnnouncementsType } from '~/reducers/main-function/announcer/announcements';

interface MessageViewProps {
  i18n: i18nType,
  announcements: AnnouncementsType,
}

interface MessageVitewState {
  drag: number
}

class AnnouncementView extends React.Component<MessageViewProps, MessageVitewState> {

  render(){
    if (!this.props.announcements.current){
      return null;
    }
    
    return (
      <div className="application-list application-list--open">
        <div className={`application-list__item ${this.props.announcements.current.workspaces.length ? "application-list__item--workspace-announcement" : "application-list__item--environment-announcement"}`}>
          <div className="application-list__item-header  application-list__item-header--announcer-announcement">
            <div className="container container--announcer-announcement-meta">
              <div className="application-list__item-header-main application-list__item-header-main--announcer-announcement-dates">
                <div className="text text--announcer-announcement-header">
                  <span className="text__icon icon-clock"></span>
                  <span className="text text--announcer-times">
                    {this.props.i18n.time.format(this.props.announcements.current.startDate)} - {this.props.i18n.time.format(this.props.announcements.current.endDate)}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="application-list__item-body">
            <header className="text text--announcer-announcement-caption">{this.props.announcements.current.caption}</header>
            <section className="text text--announcer-announcement-content" dangerouslySetInnerHTML={{__html: this.props.announcements.current.content}}></section>                                
          </div>  
          <div className="application-list__item-meta">
            {/* This should be shown only if announcement has workspaces set */}
            <div className="text text--announcer-announcement-workspaces">
              <div className="text text--announcer-workspace"> 
                <span className="text__icon text__icon--anouncement-workspace icon-books"></span>
                <span className="text text--announcement-workspace-name"></span>
              </div>
            </div>
          </div>
            
        </div>                 
      </div>
    )
  }       
}


function mapStateToProps(state: any){
  return {
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
)(AnnouncementView);