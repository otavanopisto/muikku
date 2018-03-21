import * as React from 'react';

import '~/sass/elements/buttons.scss';
import Link from './link';

interface ButtonProps extends React.DetailedHTMLProps<React.AnchorHTMLAttributes<HTMLAnchorElement>, HTMLAnchorElement> {
  buttonAs?: any,
  buttonModifiers?: Array<string>,
  className?: string
}

interface ButtonState {
}

export default class Button  extends React.Component<ButtonProps, ButtonState> {
  render(){
    let Element:any = this.props.buttonAs || Link;
    let elementProps:any = Object.assign({}, this.props);
    delete elementProps["buttonAs"];
    delete elementProps["buttonModifiers"];
    delete elementProps["className"];
    
    return <Element {...elementProps}
    className={`button ${this.props.className ? this.props.className : ""} ${(this.props.buttonModifiers || []).map(s=>`button--${s}`).join(" ")}`}/>
  }
}

export class ButtonSocial extends React.Component<ButtonProps, ButtonState> {
  render(){
    let Element = this.props.buttonAs || Link;
    let elementProps:any = Object.assign({}, this.props);
    delete elementProps["buttonAs"];
    delete elementProps["buttonModifiers"];
    delete elementProps["className"];
    
    return <Element {...elementProps}
    className={`button-social ${(this.props.buttonModifiers || []).map(s=>`button-social--${s}`).join(" ")}`}/>
  }
}

interface ButtonPillProps extends ButtonProps {
  icon?: string
}

export class ButtonPill extends React.Component<ButtonPillProps, ButtonState> {
  render(){
    let Element = this.props.buttonAs || Link;
    let elementProps:any = Object.assign({}, this.props);
    delete elementProps["buttonAs"];
    delete elementProps["buttonModifiers"];
    delete elementProps["className"];
    
    return <Element {...elementProps}
    className={`button-pill ${(this.props.buttonModifiers || []).map(s=>`button-pill--${s}`).join(" ")}`}>
      {this.props.icon && <span className={`button-pill__icon icon-${this.props.icon}`}></span>}
      {this.props.children}
    </Element>
  }
}