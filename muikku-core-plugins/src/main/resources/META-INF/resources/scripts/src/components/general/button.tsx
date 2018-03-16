import * as React from 'react';

import '~/sass/elements/buttons.scss';
import Link from './link';

interface ButtonProps {
  buttonAs?: any,
  buttonModifiers?: Array<string>,
  social?: boolean,
  className?: string,
  [otherProp: string]: any
}

interface ButtonState {
}

export default class Button extends React.Component<ButtonProps, ButtonState> {
  constructor(props: ButtonProps){
    super(props);
  }
  render(){
    let Element = this.props.buttonAs || Link;
    let elementProps:any = Object.assign({}, this.props);
    delete elementProps["buttonAs"];
    delete elementProps["buttonModifiers"];
    delete elementProps["className"];
    
    return <Element {...elementProps}
    className={`${this.props.social ? "button-social" : "button"} ${this.props.className ? this.props.className : ""} ${(this.props.buttonModifiers || []).map(s=>`button--${s}`).join(" ")}`}/>
  }
}