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
import "~/sass/elements/form.scss";
import { StatusType } from "~/reducers/base/status";
import {
  GuiderStudentUserProfileType,
  GuiderCurrentStudentStateType,
  GuiderType,
} from "~/reducers/main-function/guider";
import StateOfStudies from "../body/application/state-of-studies";
import StudyHistory from "../body/application/study-history";
import StudyPlan from "../body/application/study-plan";
import {
  loadStudentHistory,
  LoadStudentTriggerType,
  UpdateCurrentStudentHopsPhaseTriggerType,
  updateCurrentStudentHopsPhase,
} from "~/actions/main-function/guider";
import { getName } from "~/util/modifiers";
import CompulsoryEducationHopsWizard from "../../general/hops-compulsory-education-wizard";
import Button from "~/components/general/button";

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
  onClose?: () => void;
  onOpen?: () => void;
  i18n: i18nType;
  status: StatusType;
  loadStudentHistory: LoadStudentTriggerType;
  updateCurrentStudentHopsPhase: UpdateCurrentStudentHopsPhaseTriggerType;
}

/**
 * StudentDialogState
 */
interface StudentDialogState {
  activeTab: string;
  editHops: boolean;
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
      editHops: false,
    };
  }

  /**
   * handleHopsPhaseChange
   * @param e e
   */
  handleHopsPhaseChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    this.props.updateCurrentStudentHopsPhase({
      value: e.currentTarget.value,
    });
  };

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
   * onClickEditHops
   */
  onClickEditHops = () => {
    this.setState({
      editHops: !this.state.editHops,
    });
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
    const hopsModifyStateModifiers = ["modify-hops"];

    if (this.state.editHops) {
      hopsModifyStateModifiers.push("modify-hops-active");
    }

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

    if (
      this.props.guider.currentStudent &&
      this.props.guider.currentStudent.basic
    )
      tabs.push({
        id: "HOPS",
        name: "Hops",
        type: "guider-student",
        component: (
          <>
            <div
              style={{
                display: "flex",
                alignContent: "center",
                justifyContent: "center",
              }}
            >
              <Button
                onClick={this.onClickEditHops}
                buttonModifiers={hopsModifyStateModifiers}
              >
                Muokkaustila
              </Button>

              <select
                className="form-element__select"
                value={
                  this.props.guider.currentStudent.hopsPhase
                    ? this.props.guider.currentStudent.hopsPhase
                    : 0
                }
                onChange={this.handleHopsPhaseChange}
              >
                <option value={0}>HOPS - Ei aktivoitu</option>
                <option value={1}>HOPS - aktiivinen</option>
                <option value={2}>HOPS - esitäyttö</option>
                <option value={3}>HOPS - opintojen suunnittelu</option>
              </select>
            </div>

            {this.state.editHops ? (
              <CompulsoryEducationHopsWizard
                user="supervisor"
                disabled={false}
                studentId={this.props.guider.currentStudent.basic.id}
                superVisorModifies
              />
            ) : (
              <CompulsoryEducationHopsWizard
                user="supervisor"
                disabled={true}
                studentId={this.props.guider.currentStudent.basic.id}
                superVisorModifies={false}
              />
            )}
          </>
        ),
      });

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
        closeOnOverlayClick={false}
        disableScroll
      />
    );
  }
}

/**
 * mapStateToProps
 * @param state application state
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
 * @param dispatch action dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    {
      loadStudentHistory,
      updateCurrentStudentHopsPhase,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(StudentDialog);
