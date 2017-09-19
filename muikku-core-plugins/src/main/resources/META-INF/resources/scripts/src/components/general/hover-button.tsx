import * as React from 'react';
import * as PropTypes from 'prop-types';
import Link from './link.tsx';

export default class HoverButton extends React.Component {
  static propTypes = {
    onClick: PropTypes.func,
    classNameExtension: PropTypes.string.isRequired,
    classNameSuffix: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    href: PropTypes.string
  }
  render(){
    return (<Link href={this.props.href} onClick={this.props.onClick}
       className={`${this.props.classNameExtension} button-pill button-pill-floating ${this.props.classNameExtension}-button-pill-${this.props.classNameSuffix}`}>
      <span className={`icon icon-${this.props.icon}`}></span>
    </Link>);
  }
}