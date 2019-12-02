import * as React from 'react';
import {StateType} from '~/reducers';
import {connect, Dispatch} from 'react-redux';
import ApplicationList, { ApplicationListItem } from '~/components/general/application-list';
import Course from './courses/course';



interface CoursesProps {
  
}

interface CoursesState {
}

class Courses extends React.Component<CoursesProps, CoursesState> {
  
  render(){
    return (
        <ApplicationList>
        </ApplicationList>
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
)(Courses);
