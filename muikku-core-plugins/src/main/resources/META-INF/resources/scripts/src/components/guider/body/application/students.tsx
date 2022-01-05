import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import * as queryString from "query-string";
import { i18nType } from "~/reducers/base/i18n";

import "~/sass/elements/empty.scss";
import "~/sass/elements/loaders.scss";

import "~/sass/elements/label.scss";
import "~/sass/elements/user.scss";
import "~/sass/elements/application-list.scss";

import BodyScrollLoader from "~/components/general/body-scroll-loader";
import SelectableList from "~/components/general/selectable-list";
import {
  LoadMoreStudentsTriggerType,
  loadMoreStudents,
  addToGuiderSelectedStudents,
  removeFromGuiderSelectedStudents,
  AddToGuiderSelectedStudentsTriggerType,
  RemoveFromGuiderSelectedStudentsTriggerType,
} from "~/actions/main-function/guider";
import BodyScrollKeeper from "~/components/general/body-scroll-keeper";
import Student from "./students/student";
import { StateType } from "~/reducers";
import {
  GuiderStudentsStateType,
  GuiderStudentUserProfileType,
  GuiderStudentType,
  GuiderType,
} from "~/reducers/main-function/guider";
import ApplicationList, {
  ApplicationListItem,
} from "~/components/general/application-list";

interface GuiderStudentsProps {
  i18n: i18nType;
  guiderStudentsState: GuiderStudentsStateType;
  guiderStudentsHasMore: boolean;
  loadMoreStudents: LoadMoreStudentsTriggerType;
  guiderStudentsCurrent: GuiderStudentUserProfileType;
  guider: GuiderType;
  addToGuiderSelectedStudents: AddToGuiderSelectedStudentsTriggerType;
  removeFromGuiderSelectedStudents: RemoveFromGuiderSelectedStudentsTriggerType;
}

interface GuiderStudentsState {}

class GuiderStudents extends BodyScrollLoader<
  GuiderStudentsProps,
  GuiderStudentsState
> {
  constructor(props: GuiderStudentsProps) {
    super(props);

    //once this is in state READY only then a loading more event can be triggered
    this.statePropertyLocation = "guiderStudentsState";
    //it will only call the function if this is true
    this.hasMorePropertyLocation = "guiderStudentsHasMore";
    //this is the function that will be called
    this.loadMoreTriggerFunctionLocation = "loadMoreStudents";
    //Cancel loading more if that property exists
    this.cancellingLoadingPropertyLocation = "guiderStudentsCurrent";

    this.onStudentClick = this.onStudentClick.bind(this);
  }

  onStudentClick(student: GuiderStudentType) {
    const locationData = queryString.parse(
      document.location.hash.split("?")[1] || "",
      { arrayFormat: "bracket" }
    );
    locationData.c = student.id;
    window.location.hash =
      "#?" + queryString.stringify(locationData, { arrayFormat: "bracket" });
  }

  render() {
    if (this.props.guiderStudentsState === "LOADING") {
      return null;
    } else if (this.props.guiderStudentsState === "ERROR") {
      return (
        <div className="empty">
          <span>{"ERROR"}</span>
        </div>
      );
    } else if (
      this.props.guiderStudentsState.length === 0 &&
      !this.props.guiderStudentsCurrent
    ) {
      return (
        <div className="empty">
          <span>
            {this.props.i18n.text.get("plugin.guider.errormessage.users")}
          </span>
        </div>
      );
    }

    return (
      <BodyScrollKeeper hidden={!!this.props.guiderStudentsCurrent}>
        <SelectableList
          as={ApplicationList}
          selectModeModifiers="select-mode"
          extra={
            this.props.guiderStudentsState === "LOADING_MORE" ? (
              <div className="application-list__item loader-empty" />
            ) : null
          }
          dataState={this.props.guiderStudentsState}
        >
          {this.props.guider.students.map(
            (student: GuiderStudentType, index: number) => {
              const isSelected = this.props.guider.selectedStudentsIds.includes(
                student.id
              );
              return {
                as: ApplicationListItem,
                className: "user user--guider",
                onSelect: this.props.addToGuiderSelectedStudents.bind(
                  null,
                  student
                ),
                onDeselect: this.props.removeFromGuiderSelectedStudents.bind(
                  null,
                  student
                ),
                onEnter: this.onStudentClick.bind(this, student),
                isSelected,
                key: student.id,
                checkboxId: `user-select-${index}`,
                checkboxClassName: "user__selector",
                contents: (checkbox: React.ReactElement<any>) => (
                  <Student
                    index={index}
                    checkbox={checkbox}
                    student={student}
                  />
                ),
              };
            }
          )}
        </SelectableList>
      </BodyScrollKeeper>
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    guiderStudentsState: state.guider.state,
    guiderStudentsHasMore: state.guider.hasMore,
    guiderStudentsCurrent: state.guider.currentStudent,
    guider: state.guider,
  };
}

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators(
    {
      loadMoreStudents,
      addToGuiderSelectedStudents,
      removeFromGuiderSelectedStudents,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(GuiderStudents);
