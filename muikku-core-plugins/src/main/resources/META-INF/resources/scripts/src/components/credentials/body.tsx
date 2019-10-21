import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {i18nType} from '~/reducers/base/i18n';
import $ from '~/lib/jquery';
import ReturnCredentials from './body/return-credentials';
import CredentialsContainer from './body/credentials-container';
import CredentialsHero from './body/credentials-hero';
import {StateType} from '~/reducers';

interface CredentialsBodyProps {
  i18n: i18nType
}

interface CredentialsBodyState {
  
}

class CredentialsBody extends React.Component<CredentialsBodyProps, CredentialsBodyState> {
  private param = new URLSearchParams(location.search);
  render(){
    
    let hash:string = this.param.get("h");
  
    return (<div className="credentials">
        <CredentialsHero i18n={this.props.i18n}/>
        <CredentialsContainer i18n={this.props.i18n}>
          <ReturnCredentials secret={hash} />
        </CredentialsContainer>
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