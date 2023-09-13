import * as React from "react";
import { getName } from "~/util/modifiers";
import { i18nType } from "~/reducers/base/i18n";
import { StatusType } from "~/reducers/base/status";
import { StateType } from "~/reducers";
import { connect } from "react-redux";
import moment from "~/lib/moment";
import "~/sass/elements/label.scss";
import "~/sass/elements/user.scss";
import "~/sass/elements/application-list.scss";
import "~/sass/elements/wcag.scss";
import {
  ApplicationListItemContentWrapper,
  ApplicationListItemHeader,
  ApplicationListItemFooter,
} from "~/components/general/application-list";
import { Student } from "~/generated/client";

type StudentStudyTimeState = "ONGOING" | "ENDING" | "ENDED";

/**
 * StudentProps
 */
interface StudentProps {
  student: Student;
  checkbox: React.ReactElement<HTMLInputElement>;
  i18n: i18nType;
  index: number;
  status: StatusType;
}

/**
 * StudentState
 */
interface StudentState {}

/**
 * Student
 */
class StudentListItem extends React.Component<StudentProps, StudentState> {
  /**
   * getSudentStudyTimeState
   *
   * @param student student
   * @returns StudentStudytimeState "ENDED" | "ENDING" | "ONGOING"
   */
  getSudentStudyTimeState = (student: Student): StudentStudyTimeState => {
    if (student.studyTimeEnd) {
      const studyTimeEnd = moment(student.studyTimeEnd);
      const difference = studyTimeEnd.diff(moment(), "days");

      if (moment(studyTimeEnd).isBefore(moment())) {
        return "ENDED";
      } else if (difference < 7) {
        return "ENDING";
      }
      return "ONGOING";
    }
    return "ONGOING";
  };

  /**
   * render
   */
  render() {
    const studyTimeEndState = this.getSudentStudyTimeState(this.props.student);
    return (
      <ApplicationListItemContentWrapper
        className={"state-" + studyTimeEndState}
        aside={
          <div className="form-element form-element--item-selection-container">
            <label
              htmlFor={`userSelect-` + this.props.index}
              className="visually-hidden"
            >
              {this.props.i18n.text.get("plugin.wcag.userSelect.label")}
            </label>
            {this.props.checkbox}
          </div>
        }
      >
        <ApplicationListItemHeader>
          <span className="application-list__header-primary">
            <span>{getName(this.props.student, true)}</span>
            <span className="application-list__header-helper">
              {this.props.student.email}
            </span>
          </span>
          <span className="application-list__header-secondary">
            {this.props.student.studyProgrammeName}
          </span>
        </ApplicationListItemHeader>

        <ApplicationListItemFooter modifiers="student">
          <div className="labels">
            {studyTimeEndState !== "ONGOING" ? (
              <div className={`label label--${studyTimeEndState}`}>
                <span
                  className={`label__icon icon-clock state-${studyTimeEndState}`}
                ></span>
                <span className="label__text">
                  {this.props.i18n.text.get(
                    "plugin.guider.user.state." + studyTimeEndState,
                    moment(this.props.student.studyTimeEnd).format("LL")
                  )}{" "}
                </span>
              </div>
            ) : null}
            {this.props.student.flags.length
              ? this.props.student.flags.map((flag) => (
                  <div className="label" key={flag.id}>
                    <span
                      className="label__icon icon-flag"
                      style={{ color: flag.flagColor }}
                    ></span>
                    <span className="label__text">{flag.flagName}</span>
                  </div>
                ))
              : null}
          </div>
        </ApplicationListItemFooter>
      </ApplicationListItemContentWrapper>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    status: state.status,
  };
}

export default connect(mapStateToProps)(StudentListItem);
