import * as React from 'react';
import {connect, Dispatch} from 'react-redux';
import {bindActionCreators} from 'redux';
import Link from '~/components/general/link';

import {i18nType} from '~/reducers/base/i18n';
import { CoursePickerCourseType } from '~/reducers/main-function/coursepicker/coursepicker-courses';

import '~/sass/elements/application-list.scss';
import { StatusType } from '~/reducers/base/status';

interface CourseProps {
  i18n: i18nType,
  status: StatusType,
  course: CoursePickerCourseType
}

interface CourseState {
  expanded: boolean
}

class Course extends React.Component<CourseProps, CourseState>{
  constructor(props: CourseProps){
    super(props);
    
    this.state = {
      expanded: false
    }
    
    this.toggleExpanded = this.toggleExpanded.bind(this);
  }
  toggleExpanded(){
    this.setState({expanded: !this.state.expanded})
  }
  render(){
    //Please fix this markup I have no idea which standard to use, this is more or less like communicator
    //you can move the toggle expanded function wherever you want that you need the action to be triggered
    return <div className="application-list__item">
      <div className="application-list__item-header" onClick={this.toggleExpanded}>
        {this.props.course.name}
        {this.props.course.nameExtension}
      </div>
      {this.state.expanded ?
        <div className="application-list__item-body">
          <span dangerouslySetInnerHTML={{__html: this.props.course.description}}></span>
          <Link className="button" href={`${this.props.status.contextPath}/workspace/${this.props.course.urlName}`}>
            {this.props.course.isCourseMember ?
             this.props.i18n.text.get("TODO Continue") :
             this.props.i18n.text.get("TODO Check Out")}
          </Link>
        </div>
      : null}
    </div>
  }
}

function mapStateToProps(state: any){
  return {
    i18n: state.i18n,
    status: state.status
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(Course);