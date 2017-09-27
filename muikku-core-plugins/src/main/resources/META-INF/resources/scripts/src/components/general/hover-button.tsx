import * as React from 'react';
import Link from './link';

interface HoverButtonProps {
  onClick?: (e: Event, re: any)=>any,
  classNameExtension: string,
  icon: string,
  href?: string,
  classNameSuffix: string
}

interface HoverButtonState {
  
}

export default class HoverButton extends React.Component<HoverButtonProps, HoverButtonState> {
  constructor(props: HoverButtonProps){
    super(props);
  }
  render(){
    return (<Link href={this.props.href} onClick={this.props.onClick}
       className={`${this.props.classNameExtension} button-pill button-pill-floating ${this.props.classNameExtension}-button-pill-${this.props.classNameSuffix}`}>
      <span className={`icon icon-${this.props.icon}`}></span>
    </Link>);
  }
}