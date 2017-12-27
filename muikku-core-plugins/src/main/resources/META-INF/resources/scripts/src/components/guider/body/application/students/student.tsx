import { UserType } from "~/reducers/main-function/user-index";
import * as React from "react";
import { getName } from "~/util/modifiers";

interface StudentProps {
  student: UserType,
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
        <div className="application-list__item-header">
          {getName(this.props.student)}
        </div>
      </div>    
    </div>
  }
}