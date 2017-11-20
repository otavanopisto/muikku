import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import Dropdown from '~/components/general/dropdown';
import Link from '~/components/general/link';
import {i18nType} from '~/reducers/base/i18n';
import { AnnouncerNavigationItemListType, AnnouncerNavigationItemType } from '~/reducers/main-function/announcer/announcer-navigation';
import { AnnouncementsType } from '~/reducers/main-function/announcer/announcements';

import '~/sass/elements/buttons.scss';
import '~/sass/elements/item-list.scss';

interface AnnouncerAsideProps {
  i18n: i18nType,
  announcerNavigation: AnnouncerNavigationItemListType,
  announcements: AnnouncementsType
}

interface AnnouncerAsideState {

}


class AnnouncerAside extends React.Component<AnnouncerAsideProps, AnnouncerAsideState> {
  render(){
    return (    
      <div className="item-list item-list--aside-navigation">
        {this.props.announcerNavigation.map((item: AnnouncerNavigationItemType)=>{
          return <Link key={item.id} className={`item-list__item ${this.props.announcements.location === item.location ? "active" : ""}`}
            href={item.location}>
            <span className={`icon icon-${item.icon}`}></span>
            <span className="item-list__text-body text">
              {item.text(this.props.i18n)}
            </span>
          </Link>
        })}
      </div>
 
    )
  }
}

function mapStateToProps(state: any){
  return {
    i18n: state.i18n,
    announcerNavigation: state.announcerNavigation,
    announcements: state.announcements
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};


export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(AnnouncerAside);
