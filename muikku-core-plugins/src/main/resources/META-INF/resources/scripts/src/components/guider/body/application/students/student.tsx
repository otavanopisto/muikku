import { UserType } from "~/reducers/main-function/user-index";
import * as React from "react";
import { getName } from "~/util/modifiers";
import { GuiderStudentType, GuiderStudentUserProfileLabelType } from "~/reducers/main-function/guider/guider-students";
import '~/sass/elements/person.scss';
import '~/sass/elements/application-sub-panel.scss';


interface StudentProps {
  student: GuiderStudentType,
  checkbox: any
}

interface StudentState {
  
}

export default class Student extends React.Component<StudentProps, StudentState> {
  render(){
    return <div className="application-list__item-content-wrapper message__content">
      <div className="application-list__item-content application-list__item-content--aside">
        <div className="message__select-container">
          {this.props.checkbox}
        </div>
      </div>
      <div className="application-list__item-content application-list__item-content--main">
        <div className="application-list__item-header application-list__item-header--person">
          <div className="text text--list-item-title">{getName(this.props.student as any as UserType)}</div>
          <div className="text text--list-item-helper-title">todo: email@email.com</div>
          <div className="text text--list-item-type-title">{this.props.student.studyProgrammeName}</div>
        </div>
        <div className="application-list__item-body text text--labels">
          {this.props.student.flags.map((flag: GuiderStudentUserProfileLabelType)=>{
            return <div className="text text--label" key={flag.id}>
              <span className="icon-flag" style={{color: flag.flagColor}}></span>
              <span>{flag.flagName}</span>
            </div>
          })}
        </div>          
      </div>
    </div>
  }
}