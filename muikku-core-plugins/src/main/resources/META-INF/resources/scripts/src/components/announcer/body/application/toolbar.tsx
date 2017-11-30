import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import Dropdown from '~/components/general/dropdown';
import Link from '~/components/general/link';
import {i18nType} from '~/reducers/base/i18n';
import NewAnnouncement from './new-announcement';

import '~/sass/elements/link.scss';
import '~/sass/elements/application-panel.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/buttons.scss';
import '~/sass/elements/form-fields.scss';
import { AnnouncementsType, AnnouncementType } from '~/reducers/main-function/announcer/announcements';

import DeleteAnnouncementDialog from '../delete-announcement-dialog';

interface AnnouncerToolbarProps {
  i18n: i18nType,
  announcements: AnnouncementsType
}

interface AnnouncerToolbarState {

}

class AnnouncerToolbar extends React.Component<AnnouncerToolbarProps, AnnouncerToolbarState> {
  constructor(props: AnnouncerToolbarProps){
    super(props);
    
    this.go = this.go.bind(this);
    this.onGoBackClick = this.onGoBackClick.bind(this);
  }
  go(announcement:AnnouncementType){
    if (!announcement){
      return;
    }
    
    //TODO this is a retarded way to do things if we ever update to a SPA
    //it's a hacky mechanism to make history awesome, once we use a router it gotta be fixed
    if (history.replaceState){
      history.replaceState('', '', location.hash.split("/")[0] + "/" + announcement.id);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    } else {
      location.hash = location.hash.split("/")[0] + "/" + announcement.id;
    }
  }
  onGoBackClick(e: Event){
    //TODO this is a retarded way to do things if we ever update to a SPA
    //it's a hacky mechanism to make history awesome, once we use a router it gotta be fixed
    if (history.replaceState){
      let canGoBack = (document.referrer.indexOf(window.location.host) !== -1) && (history.length);
      if (canGoBack){
        history.back();
      } else {
        history.replaceState('', '', location.hash.split("/")[0]);
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      }
    } else {
      location.hash = location.hash.split("/")[0];
    }
  }
  render(){
    if (this.props.announcements.current) {
      //TODO this should be done more efficiently but the information is not included in the announcement
      let currentIndex:number = this.props.announcements.announcements.findIndex((a:AnnouncementType)=>a.id === this.props.announcements.current.id);
      let next:AnnouncementType = null;
      let prev:AnnouncementType = null;
      
      if (currentIndex !== -1){
        next = this.props.announcements.announcements[currentIndex + 1];
        prev = this.props.announcements.announcements[currentIndex - 1];
      }
      
      return ( 
        <div className="application-panel__toolbar">
          <div className="application-panel__toolbar-actions-main">          
            <Link className="button-pill button-pill--go-back" onClick={this.onGoBackClick}>
              <span className="icon icon-goback"></span>
            </Link>
            <DeleteAnnouncementDialog announcement={this.props.announcements.current} onDeleteAnnouncementSuccess={this.onGoBackClick}>
              <Link className="button-pill button-pill--delete">
                <span className="icon icon-delete"></span> 
              </Link>
            </DeleteAnnouncementDialog>
          </div>
          <div className="application-panel__toolbar-actions-aside">
            <Link className="button-pill button-pill--prev-page" disabled={!prev} onClick={this.go.bind(this, prev)}>
              <span className="icon icon-arrow-left"></span>
            </Link>                       
            <Link className="button-pill button-pill--next-page" disabled={!next} onClick={this.go.bind(this, next)}>
              <span className="icon icon-arrow-right"></span>
            </Link>
          </div>
        </div> 
      )
    } else {
      return (
        <div className="application-panel__toolbar">        
          <div className="application-panel__toolbar-actions-main">
            <DeleteAnnouncementDialog>
              <Link className="button-pill button-pill--delete" disabled={this.props.announcements.selected.length === 0}>
                <span className="icon icon-delete"></span>          
              </Link>
            </DeleteAnnouncementDialog>
          </div>     
        </div>
      )      
    }
  }
}

function mapStateToProps(state: any){
  return {
    i18n: state.i18n,
    announcements: state.announcements
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {}
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(AnnouncerToolbar);