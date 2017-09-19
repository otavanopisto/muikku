import * as PropTypes from 'prop-types';
import * as React from 'react';

function scrollToSection(anchor) {
  if (!$(anchor).size()){
    window.location.href = anchor;
    return;
  }
  
  let topOffset = 90;
  let scrollTop = $(anchor).offset().top - topOffset;

  $('html, body').stop().animate({
    scrollTop : scrollTop
  }, {
    duration : 500,
    easing : "easeInOutQuad"
  });
  
  setTimeout(()=>{
    window.location.href = anchor;
  }, 500);
}

export default class Link extends React.Component {
  constructor(props){
    super(props);
    
    this.onClick = this.onClick.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    
    this.state = {
      active: false
    }
    
    this.touchCordX = null;
    this.touchCordY = null;
  }
  onClick(e, re){
    e.preventDefault();
    if (this.props.disablePropagation){
      e.stopPropagation();
    }
    
    if (this.props.disabled){
      return;
    }
    if (this.props.href && this.props.href[0] === '#'){
      scrollToSection(this.props.href);
    } else if (this.props.href){
      location.href = this.props.href;
    }
    
    if (this.props.onClick){
      this.props.onClick(e, re);
    }
  }
  onTouchStart(e, re){
    e.preventDefault();
    if (this.props.disablePropagation){
      e.stopPropagation();
    }
    
    this.touchCordX = e.changedTouches[0].pageX;
    this.touchCordY = e.changedTouches[0].pageY;
    
    if (!this.props.disabled){
      this.setState({active: true});
      if (this.props.onTouchStart){
        this.props.onTouchStart(e, re);
      }
    } 
  }
  onTouchMove(e, re){
    if (this.state.active){
      let X = e.changedTouches[0].pageX;
      let Y = e.changedTouches[0].pageY;
      
      if (Math.abs(X - this.touchCordX) >= 5 || Math.abs(X - this.touchCordY) >= 5){
        this.setState({active: false});
      }
    }
    
    if (!this.props.disabled && this.props.onTouchMove){
      this.props.onTouchMove(e, re);
    }
  }
  onTouchEnd(e, re){
    if (!this.props.disabled){
      this.setState({active: false});
    }
    
    if (this.state.active){
      this.onClick(e, re);
    }
    if (!this.props.disabled && this.props.onTouchEnd){
      this.props.onTouchEnd(e, re);
    }
  }
  render(){
    let Element = this.props.as || 'a';
    let elementProps = Object.assign({}, this.props, {disablePropagation: undefined, disabled: undefined});
    
    return <Element {...elementProps}
      className={this.props.className + (this.state.active ? " active" : "") + (this.props.disabled ? " disabled" : "")}
      onClick={this.onClick} onTouchStart={this.onTouchStart} onTouchEnd={this.onTouchEnd} onTouchMove={this.onTouchMove}/>
  }
}