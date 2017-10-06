import Dropdown from '~/components/general/dropdown';
import Link from '~/components/general/link';
import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {i18nType} from '~/reducers/base/i18n';
import {StatusType} from '~/reducers/base/status';
import {bindActionCreators} from 'redux';

import {logout, LogoutTriggerType} from '~/actions/base/status';

import '~/sass/elements/link.scss';
import '~/sass/elements/buttons.scss';

interface ProfileItemProps {
  modifier: string,
  i18n: i18nType,
  status: StatusType,
  logout: LogoutTriggerType
}

interface ProfileItemState {
  
}

class ProfileItem extends React.Component<ProfileItemProps, ProfileItemState> {
  render(){
    if (!this.props.status.loggedIn){
      return null;
    }
    const items: Array<any> = [
      {
        icon: "user",
        text: 'plugin.profile.links.personal',
        href: "/profile"
      },
      {
        icon: "forgotpassword",
        text: 'plugin.footer.instructions'
      },
      {
        icon: "helpdesk",
        text: 'plugin.home.helpdesk'
      },
      {
        icon: "signout",
        text: 'plugin.logout.logout',
        onClick: this.props.logout
      }
    ]
    return <Dropdown modifier={this.props.modifier + "-profile-menu"} items={items.map((item)=>{
        return (closeDropdown: ()=>any)=>{return <Link href={item.href}
         className={`link link--full link--profile-menu link--${this.props.modifier}-profile-menu`}
         onClick={(...args:any[])=>{closeDropdown(); item.onClick && item.onClick(...args)}}>
          <span className={`icon icon-${item.icon}`}></span>
          <span>{this.props.i18n.text.get(item.text)}</span>
        </Link>}
      })}>
      <Link className="button-pill button-pill--profile">
        <object className="container container--full"
         data={`/rest/user/files/user/${this.props.status.userId}/identifier/profile-image-96`}
         type="image/jpeg">
          <span className="icon icon-user"></span>
        </object>
      </Link>
    </Dropdown>
  }
}

function mapStateToProps(state: any){
  return {
    i18n: state.i18n,
    status: state.status
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return bindActionCreators({logout}, dispatch);
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(ProfileItem);