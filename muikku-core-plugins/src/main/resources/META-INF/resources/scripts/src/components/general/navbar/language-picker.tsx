import * as PropTypes from 'prop-types';
import actions from '~/actions/base/locales';
import Dropdown from '~/components/general/dropdown.tsx';
import * as React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import Link from '~/components/general/link.tsx';

class LanguagePicker extends React.Component {
  static propTypes = {
    classNameExtension: PropTypes.string.isRequired,
  }
  render(){
    return <Dropdown classNameExtension={this.props.classNameExtension} classNameSuffix="language-picker" items={this.props.locales.avaliable.map((locale)=>{
      return (<Link className={`${this.props.classNameExtension} link link-full ${this.props.classNameExtension}-link-language-picker`} onClick={this.props.setLocale.bind(this, locale.locale)}>
        <span>{locale.name}</span>
      </Link>);
    })}>
      <Link className={`${this.props.classNameExtension} button-pill ${this.props.classNameExtension}-button-pill-language`}>
        <span>{this.props.locales.current}</span>
      </Link>
    </Dropdown>
  }
}

function mapStateToProps(state){
  return {
    locales: state.locales
  }
};

const mapDispatchToProps = (dispatch)=>{
  return bindActionCreators(actions, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LanguagePicker);