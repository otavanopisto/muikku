import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import Link from '~/components/general/link';
import {i18nType} from '~/reducers/base/i18n';
import {AnnouncementListType, AnnouncementType} from '~/reducers/main-function/announcer/announcements';
import '~/sass/elements/buttons.scss';
import '~/sass/elements/item-list.scss';

interface AnnouncementsAsideProps {
  i18n: i18nType,
  announcements: AnnouncementListType
}

interface AnnouncementsAsideState {

}



class AnnouncementsAside extends React.Component<AnnouncementsAsideProps, AnnouncementsAsideState> {
  
  
  
  
  render(){
    
    return (<div className="ordered-container__item ordered-container__item--index-panel-container ordered-container__item--basic-announcements">
        <div className="panel panel--index">
          {this.props.announcements.length !== 0 ?
            <div className="item-list item-list--panel-announcements">
              {this.props.announcements.map((announcement: AnnouncementType)=>{
                return <Link key={announcement.id} className={`item-list__item item-list__item--announcements ${announcement.workspaces ? "item-list__item--has-workspaces" : ""}`}
                  href={`/announcements?announcementId=${announcement.id}`}>
                  <span className="item-list__icon item-list__icon--announcements icon-announcer"></span>
                  <span className="text item-list__text-body item-list__text-body--multiline">
                    {announcement.caption}
                    <span className="text item-list__announcement-date">
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
)(AnnouncementsAside);
