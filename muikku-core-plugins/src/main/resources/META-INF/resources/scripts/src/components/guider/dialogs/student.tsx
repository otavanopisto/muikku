import * as React from "react";
import Dialog, {
  DialogTitleItem,
  DialogTitleContainer,
} from "~/components/general/dialog";
import Tabs from "~/components/general/tabs";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { i18nType } from "~/reducers/base/i18n";
import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import "~/sass/elements/form-elements.scss";
import "~/sass/elements/form.scss";
import { StatusType } from "~/reducers/base/status";
import {
  GuiderStudentUserProfileType,
  GuiderCurrentStudentStateType,
} from "~/reducers/main-function/guider";
import StateOfStudies from "../body/application/state-of-studies";
import StudyHistory from "../body/application/study-history";
import {
  loadStudentHistory,
  LoadStudentTriggerType,
} from "~/actions/main-function/guider";
import { getName } from "~/util/modifiers";

export type tabs =
  | "STUDIES"
  | "STUDY_PLAN"
  | "GUIDANCE_RELATIONS"
  | "STUDY_HISTORY";

/**
 * StudentDialogProps
 */
interface StudentDialogProps {
  isOpen?: boolean;
  student: GuiderStudentUserProfileType;
  currentStudentStatus: GuiderCurrentStudentStateType;
  onClose?: () => any;
  onOpen?: (jotan: any) => any;
  i18n: i18nType;
  status: StatusType;
  loadStudentHistory: LoadStudentTriggerType;
}

/**
 * StudentDialogState
 */
interface StudentDialogState {
  activeTab: string;
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
   * @param props props for the constructor
   */

  constructor(props: StudentDialogProps) {
    super(props);

    this.state = {
      activeTab: "STUDENT",
    };
  }

  /**
   * Tab change function
   * @param id tab id
   */
  onTabChange = (id: tabs) => {
    const studentId = this.props.student.basic.id;
    this.setState({ activeTab: id });
    switch (id) {
      case "STUDIES": {
        return console.log("TODOS");
      }
      case "STUDY_PLAN": {
        return console.log("TODO_PLAN");
      }
      case "GUIDANCE_RELATIONS": {
        return console.log("TODO_RELATIONS");
      }
      case "STUDY_HISTORY": {
        this.props.loadStudentHistory(studentId);
      }
    }
  };

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const tabs = [
      {
        id: "STUDIES",
        name: this.props.i18n.text.get(
          "plugin.guider.user.tabs.title.situation"
        ),
        type: "guider-student",
        component: <StateOfStudies />,
      },
      // {
      //   id: "STUDY_PLAN",
      //   name: this.props.i18n.text.get('plugin.guider.user.tabs.title.studyPlan'),
      //   type: "guider-student",
      //   component: <div >Suunnitelma</div>
      // },
      // {
      //   id: "GUIDANCE_RELATIONS",
      //   name: this.props.i18n.text.get('plugin.guider.user.tabs.title.guidanceRelations'),
      //   type: "guider-student",
      //   component: <div >Ohjaussuhde</div>
      // },
      {
        id: "STUDY_HISTORY",
        name: this.props.i18n.text.get(
          "plugin.guider.user.tabs.title.studyHistory"
        ),
        type: "guider-student",
        component: <StudyHistory />,
      },
    ];

    if (!this.props.student) {
      return null;
    }

    /**
     * Content
     * @returns JSX.Element
     */
    const content = () => (
      <Tabs
        modifier="guider-student"
        tabs={tabs}
        activeTab={this.state.activeTab}
        onTabChange={this.onTabChange}
      ></Tabs>
    );

    const studyProgrammeName =
      this.props.student.basic && this.props.student.basic.studyProgrammeName;
    const dialogTitle = (
      <DialogTitleContainer>
        <DialogTitleItem modifier="user">
          {getName(this.props.student.basic, true)}
        </DialogTitleItem>
        <DialogTitleItem modifier="studyprogramme">
          {"(" + studyProgrammeName + ")"}
        </DialogTitleItem>
      </DialogTitleContainer>
    );

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
    currentStudentStatus: state.guider.currentState,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    {
      loadStudentHistory,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentDialog);
