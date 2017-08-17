import Navbar from '../general/navbar.jsx';
import Link from '../general/link.jsx';
import PropTypes from 'prop-types';

import React from 'react';
import {connect} from 'react-redux';

class MainFunctionNavbar extends React.Component {
  static propTypes = {
    activeTrail: PropTypes.string.isRequired
  }
  render(){
    const itemData = [{
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
      badge: this.props.status.messageCount
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
    
    return <Navbar classNameExtension="main-function" navbarItems={itemData.map((item)=>{
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
    })} defaultOptions={[]} menuItems={itemData.map((item)=>{
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

function mapStateToProps(state){
  return {
    i18n: state.i18n,
    status: state.status,
    messageCount: state.messageCount
  }
};

const mapDispatchToProps = (dispatch)=>{
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MainFunctionNavbar);
