import MainFunctionNavbar from '~/components/base/main-function/navbar';
import * as React from 'react';
import ScreenContainer from '~/components/general/screen-container';

import '~/sass/elements/container.scss';
import { StateType } from '~/reducers';
import { Dispatch, connect } from 'react-redux';
import { ErrorType } from '~/reducers/base/error';

interface ErrorBodyProps {
  error: ErrorType
}

interface ErrorBodyState {
  
}

class ErrorBody extends React.Component<ErrorBodyProps,ErrorBodyState> {
  render(){
    return (<div className="container container--full">
      <MainFunctionNavbar/>
        
      <ScreenContainer fullHeight={false}>
        <div className="container container--error">
          <h2>{this.props.error.title}</h2>
          <p>{this.props.error.description}</p>
        </div>
      </ScreenContainer>
    </div>);
  }
}

function mapStateToProps(state: StateType){
  return {
    error: state.error
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ErrorBody);