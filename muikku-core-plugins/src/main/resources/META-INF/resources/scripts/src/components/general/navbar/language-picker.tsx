import {setLocale, SetLocaleTriggerType} from '~/actions/base/locales';
import Dropdown from '~/components/general/dropdown';
import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import Link from '~/components/general/link';
import {LocaleListType} from '~/reducers/base/locales';
import {StateType} from '~/reducers';

import '~/sass/elements/dropdown.scss';
import '~/sass/elements/link.scss';
import '~/sass/elements/buttons.scss';

interface LanguagePickerProps {
  locales: LocaleListType,
  setLocale: SetLocaleTriggerType
}

interface LanguagePickerState {
  
}

class LanguagePicker extends React.Component<LanguagePickerProps, LanguagePickerState> {
  render(){
    return <Dropdown modifier="language-picker" items={this.props.locales.available.map((locale)=>{
      return (<Link className={`link link--full link--language`} onClick={this.props.setLocale.bind(this, locale.locale)}>
        <span>{locale.name}</span>
      </Link>);
    })}>
      <Link className={`button-pill button-pill--current-language`}>
        <span>{this.props.locales.current}</span>
      </Link>
    </Dropdown>
  }
}

function mapStateToProps(state: StateType){
  return {
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