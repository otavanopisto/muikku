import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import equals = require("deep-equal");
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
          <div className="application-list__item-header">
            <div className="text text--announcer-announcement-header">
              <span className="text__icon icon-clock"></span>
              <span className="text text--announcer-times">
                {this.props.i18n.time.format(this.props.announcements.current.startDate)} - {this.props.i18n.time.format(this.props.announcements.current.endDate)}
              </span>
            </div>
          </div>
          <div className="application-list__item-body">
            <div className="text text--announcer-body">
              <article className="text text--item-article">
                <header className="text text--item-article-header">{this.props.announcements.current.caption}</header>
                <p dangerouslySetInnerHTML={{__html: this.props.announcements.current.content}}></p>                                
             </article>
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