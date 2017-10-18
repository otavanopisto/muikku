import Link from '../link';
import * as React from 'react';

import {logout, LogoutTriggerType} from '~/actions/base/status';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import $ from '~/lib/jquery';
import {i18nType} from '~/reducers/base/i18n';
import {StatusType} from '~/reducers/base/status';

function checkLinkClicked(target: HTMLElement): boolean {
  return target.nodeName.toLowerCase() === "a" || (target.parentElement ? checkLinkClicked(target.parentElement) : false);
}

import '~/sass/elements/menu.scss';
import '~/sass/elements/container.scss';
import '~/sass/elements/link.scss';

interface MenuProps {
  open: boolean,
  onClose: ()=>any,
  items: Array<React.ReactElement<any>>,
  modifier: string,
  navigation?: React.ReactElement<any>,
  status: StatusType,
  i18n: i18nType,
  logout: LogoutTriggerType
}

interface MenuState {
  displayed: boolean,
  visible: boolean,
  dragging: boolean,
  drag: number,
  open: boolean
}

class Menu extends React.Component<MenuProps, MenuState> {
  private touchCordX: number;
  private touchMovementX: number;
  constructor(props: MenuProps){
    super(props);
    
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.closeByOverlay = this.closeByOverlay.bind(this);
    
    this.state = {
      displayed: props.open,
      visible: props.open,
      dragging: false,
      drag: null,
      open: props.open
    }
  }
  componentWillReceiveProps(nextProps: MenuProps){
    if (nextProps.open && !this.state.open){
      this.open();
    } else if (!nextProps.open && this.state.open){
      this.close();
    }
  }
  onTouchStart(e: React.TouchEvent<any>){
    this.setState({'dragging': true});
    this.touchCordX = e.changedTouches[0].pageX;
    this.touchMovementX = 0;
    e.preventDefault();
  }
  onTouchMove(e: React.TouchEvent<any>){
    let diffX = e.changedTouches[0].pageX - this.touchCordX;
    let absoluteDifferenceX = Math.abs(diffX - this.state.drag);
    this.touchMovementX += absoluteDifferenceX;

    if (diffX > 0) {
      diffX = 0;
    }
    this.setState({drag: diffX});
    e.preventDefault();
  }
  onTouchEnd(e: React.TouchEvent<any>){
    let width = $(this.refs["menuContainer"]).width();
    let diff = this.state.drag;
    let movement = this.touchMovementX;
    
    let menuHasSlidedEnoughForClosing = Math.abs(diff) >= width*0.33;
    let youJustClickedTheOverlay = e.target === this.refs["menu"] && movement <= 5;
    let youJustClickedALink = checkLinkClicked(e.target as HTMLElement) && movement <= 5;
    
    this.setState({dragging: false});
    setTimeout(()=>{
      this.setState({drag: null});
      if (menuHasSlidedEnoughForClosing || youJustClickedTheOverlay || youJustClickedALink){
        this.close();
      }
    }, 10);
    e.preventDefault();
  }
  open(){
    this.setState({displayed: true, open: true});
    setTimeout(()=>{
      this.setState({visible: true});
    }, 10);
    $(document.body).css({'overflow': 'hidden'});
  }
  closeByOverlay(e: React.MouseEvent<any>){
    let isOverlay = e.target === e.currentTarget;
    let isLink = checkLinkClicked(e.target as HTMLElement);
    if (!this.state.dragging && (isOverlay || isLink)){
      this.close();
    }
  }
  close(){
    $(document.body).css({'overflow': ''});
    this.setState({visible: false});
    setTimeout(()=>{
      this.setState({displayed: false, open: false});
      this.props.onClose();
    }, 300);
  }
  render(){
    return (<div className={`menu menu--${this.props.modifier} ${this.state.displayed ? "displayed" : ""} ${this.state.visible ? "visible" : ""} ${this.state.dragging ? "dragging" : ""}`}
              onClick={this.closeByOverlay} onTouchStart={this.onTouchStart} onTouchMove={this.onTouchMove} onTouchEnd={this.onTouchEnd} ref="menu">
             <div className="menu__container" ref="menuContainer" style={{left: this.state.drag}}>
                <div className="menu__header">
                  <div className="menu__logo"></div>
                  <Link className="menu__header__button--close icon icon-arrow-left"></Link>
                </div>
                <div className="menu__body">
                  {this.props.navigation ? <div className="menu__extras">{this.props.navigation}</div> : null}
                  <ul className="menu__items">
                    {this.props.items.map((item, index)=>{
                      if (!item){
                        return null;
                      }
                      return <li className="menu__item" key={index}>{item}</li>
                    })}
                    {this.props.status.loggedIn ? <li className="menu__item menu__item--space"></li> : null}
                    {this.props.status.loggedIn ? <li className="menu__item">
                      <Link className="link link--full link--menu link--menu--profile" href="/profile">
                        <object className="container container--profile-image container--profile-image--in-menu"
                          data={`/rest/user/files/user/${this.props.status.userId}/identifier/profile-image-96`}
                          type="image/jpeg">
                          <span className="icon icon-user"></span>
                        </object>
                        <span className="link--menu__text">{this.props.i18n.text.get('plugin.profile.profile')}</span>
                      </Link>
                    </li> : null}
                    {this.props.status.loggedIn ? <li className="menu__item">
                      <Link className="link link--full link--menu link--menu--instructions">
                        <span className="icon icon-forgotpassword"/>
                        <span className="link--menu__text">{this.props.i18n.text.get('plugin.footer.instructions')}</span>
                      </Link>
                    </li> : null}
                    {this.props.status.loggedIn ? <li className="menu__item">
                      <Link className="link link--full link--menu link--menu--helpdesk">
                        <span className="icon icon-helpdesk"></span>
                        <span className="link--menu__text">{this.props.i18n.text.get('plugin.home.helpdesk')}</span>
                      </Link>
                    </li> : null}
                    {this.props.status.loggedIn ? <li className="menu__item">
                      <Link className="link link--full link--menu link--menu--logout" onClick={this.props.logout}>
                        <span className="icon icon-signout"></span>
                        <span className="link--menu__text">{this.props.i18n.text.get('plugin.logout.logout')}</span>
                      </Link>
                    </li> : null}
                  </ul>
                </div>
              </div>
            </div>);
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
)(Menu);
  
