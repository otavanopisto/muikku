import {setLocale, SetLocaleTriggerType} from '~/actions/base/locales';
import Dropdown from '~/components/general/dropdown';
import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import { i18nType } from '~/reducers/base/i18n';
import Link from '~/components/general/link';
import {LocaleListType} from '~/reducers/base/locales';
import {StateType} from '~/reducers';

import '~/sass/elements/dropdown.scss';
import '~/sass/elements/link.scss';
import '~/sass/elements/buttons.scss';

interface LanguagePickerProps {
  locales: LocaleListType,
  i18n: i18nType,
  setLocale: SetLocaleTriggerType
}

interface LanguagePickerState {

}

class LanguagePicker extends React.Component<LanguagePickerProps, LanguagePickerState> {
  render(){
    return <Dropdown modifier="language-picker" items={this.props.locales.available.map((locale)=>{
      return (<Link className={`link link--full link--language-picker-dropdown`} onClick={this.props.setLocale.bind(this, locale.locale)} role="menuitem">
        <span className={`link__locale link__locale--${locale.locale}`}>{locale.name}</span>
      </Link>);
    })}>
      <Link className={`button-pill button-pill--current-language`} role="menuitem" tabIndex={0} aria-haspopup="true" aria-label={this.props.i18n.text.get("plugin.wcag.localeMenu.aria.label")}>
        <span className={`button-pill__current-locale button-pill__current-locale--${this.props.locales.current}`}>{this.props.locales.current}</span>
      </Link>
    </Dropdown>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    locales: state.locales
  }
};

const mapDispatchToProps = (dispatch: Dispatch<any>)=>{
  return bindActionCreators({setLocale}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LanguagePicker);
