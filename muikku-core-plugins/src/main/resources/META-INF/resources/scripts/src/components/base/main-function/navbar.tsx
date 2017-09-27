import Navbar from '~/components/general/navbar';
import Link from '~/components/general/link';

import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {i18nType} from '~/reducers/base/i18n';
import {StatusType} from '~/reducers/base/status';

interface ItemDataElement {
  classNameSuffix: string,
  trail: string,
  text: string,
  href: string,
  icon: string,
  condition?: boolean,
  badge?: number
}

interface MainFunctionNavbarProps {
  activeTrail: string,
  i18n: i18nType,
  navigation?: React.ReactElement<any>,
  status: StatusType,
  messageCount: number,
  title: string
}

interface MainFunctionNavbarState {
  
}

class MainFunctionNavbar extends React.Component<MainFunctionNavbarProps, MainFunctionNavbarState> {
  render(){
    const itemData: ItemDataElement[] = [{
      classNameSuffix: "home",
      trail: "index",
      text: 'plugin.home.home',
      href: "/",
      icon: "home",
      condition: true
    }, {
      classNameSuffix: "coursepicker",
      trail: "coursepicker",
      text: 'plugin.coursepicker.coursepicker',
      href: "/coursepicker",
      icon: "books",
      condition: true
    }, {
      classNameSuffix: "communicator",
      trail: "communicator",
      text: 'plugin.communicator.communicator',
      href: "/communicator",
      icon: "envelope",
      condition: this.props.status.loggedIn,
      badge: this.props.messageCount
    }, {
      classNameSuffix: "discussion",
      trail: "discussion",
      text: 'plugin.forum.forum',
      href: "/discussion",
      icon: "bubble",
      condition: this.props.status.loggedIn && this.props.status.permissions.FORUM_ACCESSENVIRONMENTFORUM
    }, {
      classNameSuffix: "guider",
      trail: "guider",
      text: 'plugin.guider.guider',
      href: "/guider",
      icon: "members",
      condition: this.props.status.permissions.GUIDER_VIEW
    }, {
      classNameSuffix: "records",
      trail: "records",
      text: 'plugin.records.records',
      href: "/records",
      icon: "profile",
      condition: this.props.status.permissions.TRANSCRIPT_OF_RECORDS_VIEW
    }, {
      classNameSuffix: "evaluation",
      trail: "evaluation",
      text: 'plugin.evaluation.evaluation',
      href: "/evaluation",
      icon: "evaluate",
      condition: this.props.status.permissions.EVALUATION_VIEW_INDEX
    }, {
      classNameSuffix: "announcer",
      trail: "announcer",
      text: 'plugin.announcer.announcer',
      href: "/announcer",
      icon: "announcer",
      condition: this.props.status.permissions.ANNOUNCER_TOOL
    }];
    
    return <Navbar mobileTitle={this.props.title}
      classNameExtension="main-function" navigation={this.props.navigation} navbarItems={itemData.map((item)=>{
      if (!item.condition){
        return null;
      }
      return {
        classNameSuffix: item.classNameSuffix,
        item: (<Link href={item.href} className={`main-function link link-icon link-full ${this.props.activeTrail === item.trail ? 'active' : ''}`}
          title={this.props.i18n.text.get(item.text)}>
          <span className={`icon icon-${item.icon}`}/>
          {item.badge ? <span className="main-function indicator">{(item.badge >= 100 ? "99+" : item.badge)}</span> : null}
        </Link>)
      }
    })} defaultOptions={[]} menuItems={itemData.map((item: ItemDataElement)=>{
      if (!item.condition){
        return null;
      }
      return <Link href={item.href} className={`main-function link link-full main-function-link-menu ${this.props.activeTrail === item.trail ? 'active' : ''}`}>
        <span className={`icon icon-${item.icon}`}/>
        {item.badge ? <span className="main-function indicator">{(item.badge >= 100 ? "99+" : item.badge)}</span> : null}
        {this.props.i18n.text.get(item.text)}
      </Link>
    })}/>
  }
}

function mapStateToProps(state: any){
  return {
    i18n: state.i18n,
    status: state.status,
    messageCount: state.messageCount,
    title: state.title
  }
};

const mapDispatchToProps = (dispatch: Dispatch<any>)=>{
  return {};
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(MainFunctionNavbar);
