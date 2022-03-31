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
  GuiderType,
} from "~/reducers/main-function/guider";
import StateOfStudies from "./student/tabs/state-of-studies";
import StudyHistory from "./student/tabs/study-history";
import StudyPlan from "./student/tabs/study-plan";
import GuidanceRelation from "./student/tabs/guidance-relation";
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
  guider: GuiderType;
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
      activeTab: "STUDIES",
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
      case "STUDY_HISTORY": {
        this.props.loadStudentHistory(studentId);
        break;
      }
    }
  };

  /**
   * closeDialog resets the component state and forwards onClose()
   */
  closeDialog = () => {
    this.setState({ activeTab: "STUDIES" });
    this.props.onClose();
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
      {
        id: "GUIDANCE_RELATIONS",
        name: this.props.i18n.text.get(
          "plugin.guider.user.tabs.title.guidanceRelations"
        ),
        type: "guider-student",
        component: <GuidanceRelation />,
      },
      {
        id: "STUDY_HISTORY",
        name: this.props.i18n.text.get(
          "plugin.guider.user.tabs.title.studyHistory"
        ),
        type: "guider-student",
        component: <StudyHistory />,
      },
    ];

    //    If student has HOPS, we show the tab for it

    if (
      this.props.guider.currentStudent &&
      this.props.guider.currentStudent.hops &&
      this.props.guider.currentStudent.hops.optedIn
    ) {
      tabs.splice(1, 0, {
        id: "STUDY_PLAN",
        name: this.props.i18n.text.get(
          "plugin.guider.user.tabs.title.studyPlan"
        ),
        type: "guider-student",
        component: <StudyPlan />,
      });
    }
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
        onClose={this.closeDialog}
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
    guider: state.guider,
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
