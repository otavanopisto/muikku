import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import Link from '~/components/general/link';
import {i18nType} from '~/reducers/base/i18n';
import { AnnouncementsType, AnnouncerNavigationItemType } from '~/reducers/announcements';
import {StateType} from '~/reducers';

import '~/sass/elements/buttons.scss';
import '~/sass/elements/item-list.scss';

interface AnnouncerAsideProps {
  i18n: i18nType,
  announcements: AnnouncementsType
}

interface AnnouncerAsideState {

}

class AnnouncerAside extends React.Component<AnnouncerAsideProps, AnnouncerAsideState> {
  render(){
    return (
      <div className="item-list item-list--aside-navigation">
        <span className="item-list__title">{this.props.i18n.text.get("plugin.announcer.folders.title")}</span>
        {this.props.announcements.navigation.map((item: AnnouncerNavigationItemType)=>{
          return <Link key={item.id} className={`item-list__item item-list__item--aside-navigation ${this.props.announcements.location === item.location ? "active" : ""}`}
            href={`#${item.location}`}>
            <span className={`item-list__icon icon-${item.icon}`}></span>
            <span className="item-list__text-body">
              {item.text(this.props.i18n)}
            </span>
          </Link>
        })}
      </div>

    )
  }
}

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
)(AnnouncerAside);
