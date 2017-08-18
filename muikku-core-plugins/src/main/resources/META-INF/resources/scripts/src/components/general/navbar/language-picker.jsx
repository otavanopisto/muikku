import PropTypes from 'prop-types';
import actions from '../../../actions/base/locales';
import Dropdown from '../dropdown.jsx';
import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';

class LanguagePicker extends React.Component {
  static propTypes = {
    classNameExtension: PropTypes.string.isRequired,
  }
  render(){
    return <Dropdown classNameExtension={this.props.classNameExtension} classNameSuffix="language-picker" items={this.props.locales.avaliable.map((locale)=>{
      return (<a className={`${this.props.classNameExtension} link link-full ${this.props.classNameExtension}-link-language-picker`} onClick={this.props.setLocale.bind(this, locale.locale)}>
        <span>{locale.name}</span>
      </a>);
    })}>
      <a className={`${this.props.classNameExtension} button-pill ${this.props.classNameExtension}-button-pill-language`}>
        <span>{this.props.locales.current}</span>
      </a>
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