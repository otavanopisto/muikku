import * as React from 'react';
import { Redirect } from "react-router-dom";

import '~/sass/elements/link.scss';
import { scrollToSection } from '~/util/modifiers';


// TODO remove the className, make it a modifier and add link class automatically to all the links


interface LinkProps extends React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {
  disablePropagation?: boolean,
  disabled?: boolean,
  as?: string,
  href?: string,
  to?: string,
  className?: string,
  openInNewTab?: string,
  onScrollToSection?: ()=>any,
  scrollPadding?: number,
  disableScroll?: boolean
}

interface LinkState {
  active: boolean,
  redirect: boolean
}

export default class Link extends React.Component<LinkProps, LinkState> {
  private touchCordX: number | null;
  private touchCordY: number | null;

  constructor(props: LinkProps){
    super(props);
    
    this.onClick = this.onClick.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
    
    this.state = {
      active: false,
      redirect: false
    }
    
    this.touchCordX = null;
    this.touchCordY = null;
  }
  onClick(e: React.MouseEvent<HTMLAnchorElement>){
    e.preventDefault();
    if (this.props.disablePropagation){
      e.stopPropagation();
    }
    
    if (this.props.disabled){
      return;
    }
    
    if (!this.props.to){
      if (this.props.href && this.props.href[0] === '#'){
        if (this.props.disableScroll){
          window.location.hash = this.props.href;
        } else {
          scrollToSection(this.props.href, this.props.onScrollToSection, this.props.scrollPadding);
        }
      } else if (this.props.href){
        if (this.props.openInNewTab){
          window.open(this.props.href, this.props.openInNewTab).focus();
        } else {
          location.href = this.props.href;
        }
      }
    } else if ((window as any).USES_HISTORY_API){
      this.setState({redirect: true});
    } else {
      location.href = this.props.to;
    }
    
    if (this.props.onClick){
      this.props.onClick(e);
    }
  }
  onTouchStart(e: React.TouchEvent<HTMLAnchorElement>){
    e.preventDefault();
    if (this.props.disablePropagation){
      e.stopPropagation();
    }
    
    this.touchCordX = e.changedTouches[0].pageX;
    this.touchCordY = e.changedTouches[0].pageY;
    
    if (!this.props.disabled){
      this.setState({active: true});
      if (this.props.onTouchStart){
        this.props.onTouchStart(e);
      }
    } 
  }
  onTouchMove(e: React.TouchEvent<HTMLAnchorElement>){
    if (this.state.active){
      let X = e.changedTouches[0].pageX;
      let Y = e.changedTouches[0].pageY;
      
      if (Math.abs(X - this.touchCordX) >= 5 || Math.abs(X - this.touchCordY) >= 5){
        this.setState({active: false});
      }
    }
    
    if (!this.props.disabled && this.props.onTouchMove){
      this.props.onTouchMove(e);
    }
  }
  onTouchEnd(e: React.TouchEvent<any>, re: any){
    if (!this.props.disabled){
      this.setState({active: false});
    }
    
    if (this.state.active){
      this.onClick(e as any);
    }
    if (!this.props.disabled && this.props.onTouchEnd){
      this.props.onTouchEnd(e);
    }
  }
  render(){
    if (this.state.redirect){
      return <Redirect push to={this.props.to}/>
    }
    
    let Element = this.props.as || 'a';
    let elementProps:LinkProps  = Object.assign({}, this.props);
    delete elementProps["disablePropagation"];
    delete elementProps["disabled"];
    delete elementProps["to"];
    delete elementProps["onScrollToSection"];
    delete elementProps["openInNewTab"];
    delete elementProps["scrollPadding"];
    delete elementProps["disableScroll"];
    
    return <Element ref="element" {...elementProps}
      className={(this.props.className || "") + (this.state.active ? " active" : "") + (this.props.disabled ? " disabled" : "")}
      onClick={this.onClick} onTouchStart={this.onTouchStart} onTouchEnd={this.onTouchEnd} onTouchMove={this.onTouchMove}/>
  }
  getElement():HTMLElement {
    return this.refs["element"] as HTMLElement;
  }
}