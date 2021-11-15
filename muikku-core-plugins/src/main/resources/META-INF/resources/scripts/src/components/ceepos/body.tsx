import * as React from 'react';
import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { StateType } from '~/reducers';
import {i18nType} from '~/reducers/base/i18n';

interface CeeposBodyProps {
  i18n: i18nType,
}

interface CeeposBodyState {

}

class CeeposBody extends React.Component<CeeposBodyProps,CeeposBodyState> {
  render(){
    return (<div>

    </div>);
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CeeposBody);
