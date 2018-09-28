import Navbar from '~/components/general/navbar';
import Link from '~/components/general/link';

import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {i18nType} from '~/reducers/base/i18n';
import {StatusType} from '~/reducers/base/status';
import {StateType} from '~/reducers';

import '~/sass/elements/link.scss';
import '~/sass/elements/indicator.scss';

interface ItemDataElement {
  modifier: string,
  trail: string,
  text: string,
  href: string,
  to?: boolean,
  icon: string,
  condition?: boolean,
  badge?: number
}

interface WorkspaceNavbarProps {
  activeTrail?: string,
  i18n: i18nType,
  navigation?: React.ReactElement<any>,
  status: StatusType,
  title: string,
  workspaceUrl: string
}

interface WorkspaceNavbarState {
  
}

class WorkspaceNavbar extends React.Component<WorkspaceNavbarProps, WorkspaceNavbarState> {
  render(){
    const itemData: ItemDataElement[] = [{
      modifier: "home",
      trail: "index",
      text: 'plugin.workspace.dock.home',
      href: "/workspaces/" + this.props.workspaceUrl,
      icon: "home",
      to: true,
      condition: this.props.status.permissions.WORKSPACE_HOME_VISIBLE
    }, {
      modifier: "help",
      trail: "help",
      text: 'plugin.workspace.dock.guides',
      href: "/workspaces/" + this.props.workspaceUrl + "/help",
      icon: "explanation",
      to: true,
      condition: this.props.status.permissions.WORKSPACE_GUIDES_VISIBLE
    }, {
      modifier: "materials",
      trail: "materials",
      text: 'plugin.workspace.dock.materials',
      href: "/workspaces/" + this.props.workspaceUrl + "/materials",
      icon: "materials",
      to: true,
      condition: this.props.status.permissions.WORKSPACE_MATERIALS_VISIBLE
    }, {
      modifier: "discussions",
      trail: "discussions",
      text: 'plugin.workspace.dock.discussions',
      href: "/workspaces/" + this.props.workspaceUrl + "/discussions",
      icon: "discussion",
      to: true,
      condition: this.props.status.permissions.WORKSPACE_DISCUSSIONS_VISIBLE
    }, {
      modifier: "users",
      trail: "users",
      text: 'plugin.workspace.dock.members',
      href: "/workspaces/" + this.props.workspaceUrl + "/users",
      icon: "members",
      to: true,
      condition: this.props.status.permissions.WORKSPACE_USERS_VISIBLE
    }, {
      modifier: "journal",
      trail: "journal",
      text: 'plugin.workspace.dock.journal',
      href: "/workspaces/" + this.props.workspaceUrl + "/journal",
      icon: "journal",
      to: true,
      condition: this.props.status.permissions.WORKSPACE_JOURNAL_VISIBLE
    }];
    
    return <Navbar mobileTitle={this.props.title}
      modifier="workspace" navigation={this.props.navigation} navbarItems={itemData.map((item)=>{
      if (!item.condition){
        return null;
      }
      return {
        modifier: item.modifier,
        item: (<Link href={item.href} to={item.to && this.props.activeTrail !== item.trail ? item.href : null} className={`link link--icon link--full link--workspace-navbar ${this.props.activeTrail === item.trail ? 'active' : ''}`}
          title={this.props.i18n.text.get(item.text)}>
          <span className={`link__icon icon-${item.icon}`}/>
          {item.badge ? <span className="indicator indicator--workspace">{(item.badge >= 100 ? "99+" : item.badge)}</span> : null}
        </Link>)
      }
    })} defaultOptions={null} menuItems={itemData.map((item: ItemDataElement)=>{
      if (!item.condition){
        return null;
      }
      return <Link href={item.href} className={`link link--full link--menu ${this.props.activeTrail === item.trail ? 'active' : ''}`}>
        <span className={`link__icon icon-${item.icon}`}/>
        {item.badge ? <span className="indicator indicator--workspace">{(item.badge >= 100 ? "99+" : item.badge)}</span> : null}
        <span className="link--menu__text">{this.props.i18n.text.get(item.text)}</span>
      </Link>
    })}/>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    status: state.status,
    title: state.title
  }
};

const mapDispatchToProps = (dispatch: Dispatch<any>)=>{
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WorkspaceNavbar);