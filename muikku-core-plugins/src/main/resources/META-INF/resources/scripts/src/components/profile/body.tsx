import MainFunctionNavbar from '../base/main-function/navbar';
import ScreenContainer from '../general/screen-container';
import Application from './body/application';

import * as React from 'react';

import '~/sass/elements/profile-element.scss';
import { StateType } from '~/reducers';
import { Dispatch, connect } from 'react-redux';
import { StatusType } from '~/reducers/base/status';

class ProfileBody extends React.Component<{
  status: StatusType
},{}> {
  render(){
    return (<div>
      <MainFunctionNavbar/>
      <Application/>
    </div>); 
  }
}

function mapStateToProps(state: StateType){
  return {
    status: state.status
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileBody);