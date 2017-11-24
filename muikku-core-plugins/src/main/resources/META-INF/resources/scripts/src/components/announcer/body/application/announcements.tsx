import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import {colorIntToHex} from '~/util/modifiers';
import equals = require("deep-equal");

import {i18nType} from '~/reducers/base/i18n';

import '~/sass/elements/empty.scss';
import '~/sass/elements/loaders.scss';
import '~/sass/elements/application-list.scss';
import '~/sass/elements/text.scss';
import { AnnouncementsType, AnnouncementType } from '~/reducers/main-function/announcer/announcements';
import BodyScrollKeeper from '~/components/general/body-scroll-keeper';
import SelectableList from '~/components/general/selectable-list';
import Link from '~/components/general/link';
import { AddToAnnouncementsSelectedTriggerType, RemoveFromAnnouncementsSelectedTriggerType,
  removeFromAnnouncementsSelected, addToAnnouncementsSelected } from '~/actions/main-function/announcer/announcements';

interface AnnouncementsProps {
  i18n: i18nType,
  announcements: AnnouncementsType,
  addToAnnouncementsSelected: AddToAnnouncementsSelectedTriggerType,
  removeFromAnnouncementsSelected: RemoveFromAnnouncementsSelectedTriggerType
}

interface AnnouncementsState {

}

class Announcements extends React.Component<AnnouncementsProps, AnnouncementsState> {
  setCurrentAnnouncement(){
    
  }
  render(){
    return (<BodyScrollKeeper hidden={!!this.props.announcements.current}>
        <SelectableList className="application-list application-list__items"
          selectModeClassAddition="application-list--select-mode" dataState={this.props.announcements.state}>
          {this.props.announcements.announcements.map((announcement: AnnouncementType)=>{
            let className = announcement.workspaces.length ? 
                'application-list__item application-list__item--workspace-announcement' :
                'application-list__item application-list__item--environment-announcement';
            return {
              className,
              onSelect: this.props.addToAnnouncementsSelected.bind(null, announcement),
              onDeselect: this.props.removeFromAnnouncementsSelected.bind(null, announcement),
              onEnter: this.setCurrentAnnouncement.bind(this, announcement),
              isSelected: this.props.announcements.selectedIds.includes(announcement.id),
              key: announcement.id,
              contents: (checkbox: React.ReactElement<any>)=>{
                return <div>
                  <div className="application-list__item-header">
                    {checkbox}        
                    <div className="text text--announcer-header-main">
                      <span className="icon icon-clock"></span>
                      <span className="text text--announcer-times">
                        {this.props.i18n.time.format(announcement.startDate)} - {this.props.i18n.time.format(announcement.endDate)}
                      </span>
                    </div> 
                    <div className="text text--announcer-header-aside">
                      {announcement.workspaces.map((workspace)=>{
                        return <span key={workspace.id}>
                          <span className="icon icon-books"></span>
                          <span className="text text--announcer-workspace">
                            {workspace.name}
                          </span>
                        </span>
                      })}
                    </div>                  
                  </div>                  
                  <div className="application-list__item-body">
                    <div className="text text--announcer-body">
                      <article className="text text--item-article">
                        <header className="text text--item-article-header">{announcement.caption}</header>
                        <p dangerouslySetInnerHTML={{__html:announcement.content}}></p>
                      </article>
                    </div>
                  </div>                
                  <div className="application-list__item-footer">                  
                    <Link className="link link--application-list-item-footer">{this.props.i18n.text.get('plugin.announcer.link.edit')}</Link>
                    <Link className="link link--application-list-item-footer">{this.props.i18n.text.get('plugin.announcer.link.delete')}</Link>
                  </div>
               </div>
             }
            }
          })}
        </SelectableList>
    </BodyScrollKeeper>);
  }
}

function mapStateToProps(state: any){
  return {
    i18n: state.i18n,
    announcements: state.announcements
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return bindActionCreators({
    addToAnnouncementsSelected,
    removeFromAnnouncementsSelected
  }, dispatch);;
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(Announcements);
