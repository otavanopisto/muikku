import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import * as queryString from "query-string";
import StudentDialog from "../../dialogs/student";
import "~/sass/elements/empty.scss";
import "~/sass/elements/loaders.scss";
import "~/sass/elements/label.scss";
import "~/sass/elements/user.scss";
import "~/sass/elements/application-list.scss";
import "~/sass/elements/form.scss";

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
import StudentListItem from "./students/student";
import { StateType } from "~/reducers";
import {
  GuiderStudentsStateType,
  GuiderStudentUserProfileType,
  GuiderState,
} from "~/reducers/main-function/guider";
import ApplicationList, {
  ApplicationListItem,
} from "~/components/general/application-list";
import { AnyActionType } from "~/actions";
import { Student } from "~/generated/client";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * GuiderStudentsProps
 */
interface GuiderStudentsProps extends WithTranslation<["common"]> {
  guiderStudentsState: GuiderStudentsStateType;
  guiderStudentsHasMore: boolean;
  loadMoreStudents: LoadMoreStudentsTriggerType;
  guiderStudentsCurrent: GuiderStudentUserProfileType;
  guider: GuiderState;
  addToGuiderSelectedStudents: AddToGuiderSelectedStudentsTriggerType;
  removeFromGuiderSelectedStudents: RemoveFromGuiderSelectedStudentsTriggerType;
}

/**
 * GuiderStudentsState
 */
interface GuiderStudentsState {
  isOpen: boolean;
}

/**
 * GuiderStudents
 */
class GuiderStudents extends BodyScrollLoader<
  GuiderStudentsProps,
  GuiderStudentsState
> {
  /**
   * constructor
   * @param props props
   */
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
    this.state = {
      isOpen: false,
    };

    this.onStudentClick = this.onStudentClick.bind(this);
  }

  /**
   * getBackByHash clears the selectedStudent hash from the url
   * @returns New hash string
   */
  getBackByHash = (): string => {
    const locationData = queryString.parse(
      document.location.hash.split("?")[1] || "",
      { arrayFormat: "bracket" }
    );
    delete locationData.c;
    return (
      "#?" + queryString.stringify(locationData, { arrayFormat: "bracket" })
    );
  };

  /**
   * onStudentClose when the student is closed, the hash must be reset
   */
  onStudentClose = () => {
    location.hash = this.getBackByHash();
  };

  /**
   * onStudentClick
   * @param student student
   */
  onStudentClick(student: Student) {
    const locationData = queryString.parse(
      document.location.hash.split("?")[1] || "",
      { arrayFormat: "bracket" }
    );
    locationData.c = student.id;
    window.location.hash =
      "#?" + queryString.stringify(locationData, { arrayFormat: "bracket" });
  }

  /**
   * render
   */
  render() {
    if (this.props.guiderStudentsState === "LOADING") {
      return null;
    } else if (this.props.guiderStudentsState === "ERROR") {
      return (
        <div className="empty">
          {this.props.i18n.t("notifications.loadError", {
            ns: "orders",
            context: "student",
          })}
        </div>
      );
    } else if (this.props.guider.students.length === 0) {
      return (
        <div className="empty">
          <span>
            {this.props.i18n.t("content.empty", {
              ns: "users",
              context: "students",
            })}
          </span>
        </div>
      );
    }

    return (
      <>
        <StudentDialog
          student={this.props.guider.currentStudent}
          isOpen={this.props.guider.currentStudent !== null}
          onClose={this.onStudentClose}
        />
        <BodyScrollKeeper hidden={false}>
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
            {this.props.guider.students.map((student, index: number) => {
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
                /**
                 * contents
                 * @param checkbox checkbox
                 */
                contents: (checkbox: React.ReactElement<HTMLInputElement>) => (
                  <StudentListItem
                    index={index}
                    checkbox={checkbox}
                    student={student}
                  />
                ),
              };
            })}
          </SelectableList>
        </BodyScrollKeeper>
      </>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    guiderStudentsState: state.guider.studentsState,
    guiderStudentsHasMore: state.guider.hasMore,
    guiderStudentsCurrent: state.guider.currentStudent,
    guider: state.guider,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    {
      loadMoreStudents,
      addToGuiderSelectedStudents,
      removeFromGuiderSelectedStudents,
    },
    dispatch
  );
}

export default withTranslation(["users"])(
  connect(mapStateToProps, mapDispatchToProps)(GuiderStudents)
);
