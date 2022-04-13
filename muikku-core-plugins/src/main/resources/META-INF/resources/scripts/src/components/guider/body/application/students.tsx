import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import * as queryString from "query-string";
import { i18nType } from "~/reducers/base/i18n";
import StudentDialog from "../../dialogs/student";
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

/**
 * GuiderStudentsProps
 */
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
    let locationData = queryString.parse(
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
  onStudentClick(student: GuiderStudentType) {
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
          <span>{"ERROR"}</span>
        </div>
      );
    } else if (this.props.guider.students.length === 0) {
      return (
        <div className="empty">
          <span>
            {this.props.i18n.text.get("plugin.guider.errormessage.users")}
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
            {this.props.guider.students.map(
              (student: GuiderStudentType, index: number) => {
                const isSelected =
                  this.props.guider.selectedStudentsIds.includes(student.id);
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
    i18n: state.i18n,
    guiderStudentsState: state.guider.state,
    guiderStudentsHasMore: state.guider.hasMore,
    guiderStudentsCurrent: state.guider.currentStudent,
    guider: state.guider,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
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
