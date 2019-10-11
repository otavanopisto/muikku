import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {i18nType} from '~/reducers/base/i18n';
import $ from '~/lib/jquery';
import Header from './body/return-credentials';
import ScreenContainer from '~/components/general/screen-container';
import {StateType} from '~/reducers';

interface CredentialsBodyProps {
  i18n: i18nType
}

interface CredentialsBodyState {
  
}

class CredentialsBody extends React.Component<CredentialsBodyProps, CredentialsBodyState> {
  render(){
    return (<div>

    </div>);
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CredentialsBody);