import { UserType } from "~/reducers/main-function/user-index";
import * as React from "react";
import { getName } from "~/util/modifiers";
import { GuiderStudentType, GuiderStudentUserProfileLabelType } from "~/reducers/main-function/guider";

import '~/sass/elements/text.scss';
import '~/sass/elements/label.scss';
import '~/sass/elements/user.scss';
import '~/sass/elements/application-list.scss';
import { ApplicationListItemContentWrapper, ApplicationListItemHeader, ApplicationListItemFooter } from "~/components/general/application-list";

interface StudentProps {
  student: GuiderStudentType,
  checkbox: any
}

interface StudentState {
  
}

export default class Student extends React.Component<StudentProps, StudentState> {
  render(){
    return <ApplicationListItemContentWrapper aside={<div className="user__select-container">
      {this.props.checkbox}
    </div>}>
      <ApplicationListItemHeader>
        <span className="text text--list-item-title"><span className="text text--student-name">{getName(this.props.student as any as UserType)}</span> <span className="text text--list-item-helper-title">{this.props.student.email}</span></span>
        <span className="text text--list-item-type-title">{this.props.student.studyProgrammeName}</span>
      </ApplicationListItemHeader>
        
      {this.props.student.flags.length ? <ApplicationListItemFooter modifiers="student">
        <div className="labels">
        {this.props.student.flags.map((flag: GuiderStudentUserProfileLabelType)=>{
          return <div className="label" key={flag.id}>
            <span className="label__icon icon-flag" style={{color: flag.flagColor}}></span>
            <span className="text label__text">{flag.flagName}</span>
          </div>
        })}
        </div>
      </ApplicationListItemFooter> : null}   
    </ApplicationListItemContentWrapper>
  }
}