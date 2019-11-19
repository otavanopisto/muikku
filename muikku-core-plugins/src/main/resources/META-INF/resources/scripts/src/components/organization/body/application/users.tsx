import * as React from 'react';
import {StateType} from '~/reducers';
import {connect, Dispatch} from 'react-redux';
import OrganizationUsers from './users/view';

interface UsersProps {
}

interface UsersState {
}

class Users extends React.Component<UsersProps, UsersState> {
  
  render(){
    return (
        <OrganizationUsers />
    );
  }
}

function mapStateToProps(state: StateType){
  return {
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Users);
