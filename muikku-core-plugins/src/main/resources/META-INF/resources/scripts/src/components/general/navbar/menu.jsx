import Link from '../link.jsx';
import PropTypes from 'prop-types';
import React from 'react';

import actions from '../../../actions/base/status';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

class Menu extends React.Component {
  static propTypes = {
    open: PropTypes.bool.isRequired,
    onClose: PropTypes.func.isRequired,
    items: PropTypes.arrayOf(PropTypes.element).isRequired,
    classNameExtension: PropTypes.string.isRequired
  }
  constructor(props){
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
  componentWillReceiveProps(nextProps){
    if (nextProps.open && !this.state.open){
      this.open();
    } else if (!nextProps.open && this.state.open){
      this.close();
    }
  }
  onTouchStart(e){
    this.setState({'dragging': true});
    this.touchCordX = e.changedTouches[0].pageX;
    this.touchMovementX = 0;
    e.preventDefault();
  }
  onTouchMove(e){
    let diffX = e.changedTouches[0].pageX - this.touchCordX;
    let absoluteDifferenceX = Math.abs(diffX - this.state.drag);
    this.touchMovementX += absoluteDifferenceX;

    if (diffX > 0) {
      diffX = 0;
    }
    this.setState({drag: diffX});
    e.preventDefault();
  }
  onTouchEnd(e){
    let width = $(this.refs.menuContainer).width();
    let diff = this.state.drag;
    let movement = this.touchMovementX;
    
    let menuHasSlidedEnoughForClosing = Math.abs(diff) >= width*0.33;
    let youJustClickedTheOverlay = e.target === this.refs.menu && movement <= 5;
    let youJustClickedALink = e.target.nodeName.toLowerCase() === "a" && movement <= 5;
    
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
  closeByOverlay(e){
    let isOverlay = e.target === e.currentTarget;
    let isLink = !!e.target.href;
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
    return (<div className={`${this.props.classNameExtension} menu ${this.state.displayed ? "displayed" : ""} ${this.state.visible ? "visible" : ""} ${this.state.dragging ? "dragging" : ""}`}
              onClick={this.closeByOverlay} onTouchStart={this.onTouchStart} onTouchMove={this.onTouchMove} onTouchEnd={this.onTouchEnd} ref="menu">
             <div className="menu-container" ref="menuContainer" style={{left: this.state.drag}}>
                <div className="menu-header">
                  <div className="menu-logo"></div>
                  <Link className="menu-header-button-close icon icon-arrow-left"></Link>
                </div>
                <div className="menu-body">
                  <ul className="menu-items">
                    {this.props.items.map((item, index)=>{
                      if (!item){
                        return null;
                      }
                      return <li className="menu-item" key={index}>{item}</li>
                    })}
                    {this.props.status.loggedIn ? <li className="menu-item menu-item-space"></li> : null}
                    {this.props.status.loggedIn ? <li className="menu-item">
                      <Link className="main-function link link-full main-function-link-menu main-function-link-menu-profile" href="/profile">
                        <object className="embbed embbed-profile-image"
                          data={`/rest/user/files/user/${this.props.status.userId}/identifier/profile-image-96`}
                          type="image/jpeg">
                          <span className="icon icon-user"></span>
                        </object>
                        {this.props.i18n.text.get('plugin.profile.profile')}
                      </Link>
                    </li> : null}
                    {this.props.status.loggedIn ? <li className="menu-item">
                      <Link className="main-function link link-full main-function-link-menu main-function-link-menu-instructions">
                        <span className="icon icon-forgotpassword"/>
                        {this.props.i18n.text.get('plugin.footer.instructions')}
                      </Link>
                    </li> : null}
                    {this.props.status.loggedIn ? <li className="menu-item">
                      <Link className="main-function link link-full main-function-link-menu main-function-link-menu-helpdesk">
                        <span className="icon icon-helpdesk"></span>
                        {this.props.i18n.text.get('plugin.home.helpdesk')}
                      </Link>
                    </li> : null}
                    {this.props.status.loggedIn ? <li className="menu-item">
                      <Link className="main-function link link-full main-function-link-menu main-function-link-menu-logout" onClick={this.props.logout}>
                        <span className="icon icon-signout"></span>
                        {this.props.i18n.text.get('plugin.logout.logout')}
                      </Link>
                    </li> : null}
                  </ul>
                </div>
              </div>
            </div>);
  }
}

function mapStateToProps(state){
  return {
    i18n: state.i18n,
    status: state.status
  }
};

const mapDispatchToProps = (dispatch)=>{
  return bindActionCreators(actions, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Menu);
  
