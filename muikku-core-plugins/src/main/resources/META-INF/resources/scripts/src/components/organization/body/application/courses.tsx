import * as React from 'react';
import {StateType} from '~/reducers';
import {connect, Dispatch} from 'react-redux';
import ApplicationList, { ApplicationListItem } from '~/components/general/application-list';
import Course from './courses/course';

interface CoursesProps {
  
}

interface CoursesState {
}

const courses = [
  {
    name: "course",
    description: "Morbi lacus tellus, scelerisque in lacus nec, ullamcorper suscipit velit. Curabitur arcu quam, laoreet sagittis posuere sit amet, dapibus a arcu. Integer tempor orci eu est feugiat, a mollis est aliquet. Donec fringilla sem a risus maximus volutpat",
  },
  {
    name: "course",
    description: "Morbi lacus tellus, scelerisque in lacus nec, ullamcorper suscipit velit. Curabitur arcu quam, laoreet sagittis posuere sit amet, dapibus a arcu. Integer tempor orci eu est feugiat, a mollis est aliquet. Donec fringilla sem a risus maximus volutpat",
  },
  {
    name: "course",
    description: "Morbi lacus tellus, scelerisque in lacus nec, ullamcorper suscipit velit. Curabitur arcu quam, laoreet sagittis posuere sit amet, dapibus a arcu. Integer tempor orci eu est feugiat, a mollis est aliquet. Donec fringilla sem a risus maximus volutpat",
  },
  ]

class Courses extends React.Component<CoursesProps, CoursesState> {
  
  render(){
    return (
        <ApplicationList>
          {courses.map((course:any, index)=>{
            return <Course key={course.name + index} course={course}/>
          })}
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
