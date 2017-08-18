import PropTypes from 'prop-types';
import React from 'react';

function scrollToSection(anchor) {
  let topOffset = 90;
  let scrollTop = $(anchor).offset().top - topOffset;

  $('html, body').stop().animate({
    scrollTop : scrollTop
  }, {
    duration : 500,
    easing : "easeInOutQuad"
  });
}

export default class Link extends React.Component {
  constructor(props){
    super(props);
    
    this.onClick = this.onClick.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    
    this.state = {
      active: false
    }
  }
  onClick(e, re){
    if (this.props.href && this.props.href[0] === '#'){
      e.preventDefault();
      scrollToSection(this.props.href);
    }
    if (this.props.onClick){
      this.props.onClick(e, re);
    }
  }
  onTouchStart(e, re){
    this.setState({active: true});
    if (this.props.onTouchStart){
      this.props.onTouchStart(e, re);
    }
  }
  onTouchEnd(e, re){
    this.setState({active: false});
    this.onClick(e, re);
    if (this.props.onTouchEnd){
      this.props.onTouchEnd(e, re);
    }
  }
  render(){
    return <a {...this.props}
      className={this.props.className + (this.state.active ? " active" : "")}
      onClick={this.onClick} onTouchStart={this.onTouchStart} onTouchEnd={this.onTouchEnd}/>
  }
}