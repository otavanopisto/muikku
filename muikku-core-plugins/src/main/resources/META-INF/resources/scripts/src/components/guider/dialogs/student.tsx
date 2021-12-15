import * as React from "react";
import Dialog, { DialogTitleItem, DialogTitleContainer } from "~/components/general/dialog";
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
import CurrentStudent from '../body/application/current-student';
import { getName, getUserImageUrl } from "~/util/modifiers";
import { createAllTabs } from "~/helper-functions/tabs"
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
interface StudentDialogState {
  activeTab: string,
}

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

    this.state = {
      activeTab: "STUDENT"
    }
  }


  onTabChange = (id: string) => {
    this.setState({ activeTab: id });
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {

    const tabs = [{
      id: "STUDENT",
      name: this.props.i18n.text.get('TODO: STUDENT'),
      component: () => (<CurrentStudent />)
    },
    {
      id: "LUDENT",
      name: this.props.i18n.text.get('TODO: 1'),
      component: () => (<div >huuuhaa jee kivaa</div>)
    },

    {
      id: "PUDENT",
      name: this.props.i18n.text.get('TODO: 2'),
      component: () => (<div >huuuhaa jee kivaa</div>)
    }
    ];

    if (!this.props.student) {
      return null;
    }

    const content = () => (
      <Tabs tabs={tabs} allTabs={createAllTabs(tabs)} activeTab={this.state.activeTab} onTabChange={this.onTabChange}></Tabs>
    );

    const defaultEmailAddress = this.props.student.emails && " " + this.props.student.emails.find((e) => e.defaultAddress).address;
    const dialogTitle = <DialogTitleContainer>
      <DialogTitleItem modifier="user">
        {getName(this.props.student.basic, true)}
      </DialogTitleItem>
      <DialogTitleItem modifier="studyproggamme">{"(" + this.props.student.basic.studyProgrammeName + ")"}</DialogTitleItem>
    </DialogTitleContainer>;


    return (
      <Dialog
        isOpen={this.props.isOpen}
        onClose={this.props.onClose}
        modifier="guider-student"
        title={dialogTitle}
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
