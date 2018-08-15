import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import Link from '~/components/general/link';
import {i18nType} from '~/reducers/base/i18n';
import {StateType} from '~/reducers';

import '~/sass/elements/link.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/application-list.scss';
import '~/sass/elements/rich-text.scss';
import '~/sass/elements/label.scss';

import { AnnouncementsType } from '~/reducers/main-function/announcements';

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
            {this.props.announcements.current.workspaces && this.props.announcements.current.workspaces.length ? 
                <div className="labels labels--announcer-announcement item-list__announcement-workspaces">
                {this.props.announcements.current.workspaces.map((workspace)=>{ 
                  return <span className="label" key={workspace.id}>
                    <span className="label__icon label__icon--announcement-workspace icon-books"></span>
                    <span className="text label__text label__text--announcement-workspace">{workspace.name} {workspace.nameExtension ? "(" + workspace.nameExtension + ")" : null }</span>
                  </span>
                })}
                </div> : null}
          </div>
          <div className="application-list__item-body">
            <header className="text text--announcement-caption">{this.props.announcements.current.caption}</header>
            <section className="text text--announcement-content rich-text" dangerouslySetInnerHTML={{__html: this.props.announcements.current.content}}></section>                                
          </div>  
        </div>                 
      </div>
    )
  }       
}

//TODO fix this is using the other version of announcements
function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    announcements: state.announcements
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnnouncementView);