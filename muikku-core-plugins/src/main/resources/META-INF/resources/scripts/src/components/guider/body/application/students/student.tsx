import { UserType } from "~/reducers/user-index";
import * as React from "react";
import { getName } from "~/util/modifiers";
import { GuiderStudentType, GuiderStudentUserProfileLabelType } from "~/reducers/main-function/guider";
import { i18nType } from '~/reducers/base/i18n';
import { StatusType } from '~/reducers/base/status';
import { StateType } from '~/reducers';
import { connect, Dispatch } from 'react-redux';

import '~/sass/elements/label.scss';
import '~/sass/elements/user.scss';
import '~/sass/elements/application-list.scss';
import '~/sass/elements/wcag.scss';
import { ApplicationListItemContentWrapper, ApplicationListItemHeader, ApplicationListItemFooter } from "~/components/general/application-list";

interface StudentProps {
  student: GuiderStudentType,
  checkbox: any,
  i18n: i18nType,
  index: number,
  status: StatusType
}

interface StudentState {

}

class Student extends React.Component<StudentProps, StudentState> {
  render(){
    return <ApplicationListItemContentWrapper aside={<div className="user__select-container">
      <label htmlFor={`user-select-` + this.props.index} className="visually-hidden">{this.props.i18n.text.get("plugin.wcag.userSelect.label")}</label>
      {this.props.checkbox}
    </div>}>
      <ApplicationListItemHeader>
        <span className="application-list__header-primary"><span>{getName(this.props.student as any as UserType, true)}</span> <span className="application-list__header-helper">{this.props.student.email}</span></span>
        <span className="application-list__header-secondary">{this.props.student.studyProgrammeName}</span>
      </ApplicationListItemHeader>

      {this.props.student.flags.length ? <ApplicationListItemFooter modifiers="student">
        <div className="labels">
        {this.props.student.flags.map((flag: GuiderStudentUserProfileLabelType)=>{
          return <div className="label" key={flag.id}>
            <span className="label__icon icon-flag" style={{color: flag.flagColor}}></span>
            <span className="label__text">{flag.flagName}</span>
          </div>
        })}
        </div>
      </ApplicationListItemFooter> : null}
    </ApplicationListItemContentWrapper>
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    status: state.status
  }
};

export default connect(
  mapStateToProps,
)(Student);
