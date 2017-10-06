import {setLocale, SetLocaleTriggerType} from '~/actions/base/locales';
import Dropdown from '~/components/general/dropdown';
import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import Link from '~/components/general/link';
import {LocaleListType} from '~/reducers/base/locales';

import '~/sass/elements/dropdown.scss';
import '~/sass/elements/link.scss';
import '~/sass/elements/buttons.scss';

interface LanguagePickerProps {
  modifier: string,
  locales: LocaleListType,
  setLocale: SetLocaleTriggerType
}

interface LanguagePickerState {
  
}

class LanguagePicker extends React.Component<LanguagePickerProps, LanguagePickerState> {
  render(){
    return <Dropdown modifier={this.props.modifier + "-language-picker"} items={this.props.locales.avaliable.map((locale)=>{
      return (<Link className={`link link--full link--${this.props.modifier}-language-picker`} onClick={this.props.setLocale.bind(this, locale.locale)}>
        <span>{locale.name}</span>
      </Link>);
    })}>
      <Link className={`button-pill button-pill--language-picker button-pill--${this.props.modifier}-language-picker`}>
        <span>{this.props.locales.current}</span>
      </Link>
    </Dropdown>
  }
}

function mapStateToProps(state: any){
  return {
    locales: state.locales
  }
};

const mapDispatchToProps = (dispatch: Dispatch<any>)=>{
  return bindActionCreators({setLocale}, dispatch);
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(LanguagePicker);