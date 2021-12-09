import * as React from "react";
import Dialog from "~/components/general/dialog";
import Tabs from "~/components/general/tabs";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { i18nType } from "~/reducers/base/i18n";
import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import "~/sass/elements/form-elements.scss";
import "~/sass/elements/form.scss";
import { StatusType } from "~/reducers/base/status";
import { GuiderStudentUserProfileType, GuiderCurrentStudentStateType } from "~/reducers/main-function/guider";
import Student from "../body/application/students/student";
import { getName } from "~/util/modifiers";
/**
 * StudentDialogProps
 */
interface StudentDialogProps {
  isOpen?: boolean,
  student: GuiderStudentUserProfileType,
  currentStudentStatus: GuiderCurrentStudentStateType,
  onClose?: () => any,
  onOpen?: (jotan: any) => any,
  i18n: i18nType,
  status: StatusType,
}

/**
 * StudentDialogState
 */
interface StudentDialogState { }

/**
 * Student dialog for evaluation
 */
class StudentDialog extends React.Component<
  StudentDialogProps,
  StudentDialogState
> {
  /**
   * constructor
   */
  constructor(props: StudentDialogProps) {
    super(props);
  }


  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {

    if (!this.props.student) {
      return null;
    }


    const content = () => (
      <div>KKKontent</div>
    );

    return (
      <Dialog
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        modifier="guider-student"
        title={getName(this.props.student.basic, true)}
        content={content}
        disableScroll
      />

    );
  }
}

/**
 * mapStateToProps
 * @param state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    status: state.status,
    currentStudentStatus: state.guider.currentState
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    {

    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentDialog);
