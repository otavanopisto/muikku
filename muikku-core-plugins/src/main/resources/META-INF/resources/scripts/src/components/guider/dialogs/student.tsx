import * as React from "react";
import Dialog, {
  DialogTitleItem,
  DialogTitleContainer,
} from "~/components/general/dialog";
import Tabs from "~/components/general/tabs";
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import "~/sass/elements/form.scss";
import { StatusType } from "~/reducers/base/status";
import {
  GuiderStudentUserProfileType,
  GuiderCurrentStudentStateType,
  GuiderState,
} from "~/reducers/main-function/guider";
import StateOfStudies from "./student/tabs/state-of-studies";
import StudyHistory from "./student/tabs/study-history";
import StudyPlan from "./student/tabs/study-plan";
import GuidanceRelation from "./student/tabs/guidance-relation";
import {
  loadStudentHistory,
  LoadStudentTriggerType,
  loadStudentContactLogs,
  LoadContactLogsTriggerType,
  UpdateCurrentStudentHopsPhaseTriggerType,
  updateCurrentStudentHopsPhase,
} from "~/actions/main-function/guider";
import { getName } from "~/util/modifiers";
import CompulsoryEducationHopsWizard from "../../general/hops-compulsory-education-wizard";
import Button from "~/components/general/button";
import { COMPULSORY_HOPS_VISIBLITY } from "../../general/hops-compulsory-education-wizard/index";
import { withTranslation, WithTranslation } from "react-i18next";
import UpperSecondaryPedagogicalSupportWizardForm, {
  UPPERSECONDARY_PEDAGOGYFORM,
} from "~/components/general/pedagogical-support-form";
import { PedagogyFormAccess } from "~/generated/client";

export type tabs =
  | "STUDIES"
  | "STUDY_PLAN"
  | "GUIDANCE_RELATIONS"
  | "STUDY_HISTORY"
  | "PEDAGOGICAL_SUPPORT"
  | "HOPS";

/**
 * StudentDialogProps
 */
interface StudentDialogProps extends WithTranslation<["common"]> {
  isOpen?: boolean;
  student: GuiderStudentUserProfileType;
  guider: GuiderState;
  currentStudentStatus: GuiderCurrentStudentStateType;
  onClose?: () => void;
  onOpen?: () => void;
  status: StatusType;
  loadStudentHistory: LoadStudentTriggerType;
  loadStudentContactLogs: LoadContactLogsTriggerType;
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
  // This definition is the source of truth for every child component
  private contactLogsPerPage = 10;

  /**
   * constructor
   * @param props props for the constructor
   */

  /**
   * constructor
   * @param props StudentDialogProps
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
    const studentUserEntityId = this.props.student.basic.userEntityId;
    this.setState({ activeTab: id });
    switch (id) {
      case "STUDY_HISTORY": {
        this.props.loadStudentHistory(studentId);
        break;
      }
      case "GUIDANCE_RELATIONS": {
        this.props.loadStudentContactLogs(
          studentUserEntityId,
          this.contactLogsPerPage,
          0
        );
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
        name: this.props.i18n.t("labels.situation", { ns: "guider" }),
        type: "guider-student",
        component: <StateOfStudies />,
      },
      {
        id: "GUIDANCE_RELATIONS",
        name: this.props.i18n.t("labels.relations", { ns: "guider" }),
        type: "guider-student",
        component: (
          <GuidanceRelation contactLogsPerPage={this.contactLogsPerPage} />
        ),
      },
      {
        id: "STUDY_HISTORY",
        name: this.props.i18n.t("labels.studyHistory", { ns: "guider" }),
        type: "guider-student",
        component: <StudyHistory />,
      },
    ];

    if (
      this.props.guider.currentStudent &&
      this.props.guider.currentStudent.basic &&
      UPPERSECONDARY_PEDAGOGYFORM.includes(
        this.props.guider.currentStudent.basic.studyProgrammeName
      ) &&
      this.props.guider.currentStudent.pedagogyFormAvailable &&
      this.props.guider.currentStudent.pedagogyFormAvailable.accessible
    ) {
      tabs.splice(1, 0, {
        id: "PEDAGOGICAL_SUPPORT",
        name: this.props.t("labels.title", { ns: "pedagogySupportPlan" }),
        type: "guider-student",
        component: (
          <UpperSecondaryPedagogicalSupportWizardForm
            userRole={userRoleForForm(
              this.props.guider.currentStudent.pedagogyFormAvailable
            )}
            studentUserEntityId={
              this.props.guider.currentStudent.basic.userEntityId
            }
          />
        ),
      });
    }

    if (
      this.props.guider.currentStudent &&
      this.props.guider.currentStudent.basic &&
      this.props.guider.currentStudent.hopsAvailable
    ) {
      // Hops is shown only if basic info is there,
      // current guider has permissions to use/see (hopsAvailable)
      // Compulsory hops
      if (
        COMPULSORY_HOPS_VISIBLITY.includes(
          this.props.guider.currentStudent.basic.studyProgrammeName
        )
      ) {
        tabs.splice(1, 0, {
          id: "HOPS",
          name: "Hops",
          type: "guider-student",
          component: (
            <>
              <div className="tabs__header-actions tabs__header-actions--hops">
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
                  <option value={1}>HOPS - esitäyttö</option>
                  <option value={2}>HOPS - opintojen suunnittelu</option>
                </select>
              </div>

              {this.state.editHops ? (
                <CompulsoryEducationHopsWizard
                  user="supervisor"
                  usePlace="guider"
                  disabled={false}
                  studentId={this.props.guider.currentStudent.basic.id}
                  superVisorModifies
                />
              ) : (
                <CompulsoryEducationHopsWizard
                  user="supervisor"
                  usePlace="guider"
                  disabled={true}
                  studentId={this.props.guider.currentStudent.basic.id}
                  superVisorModifies={false}
                />
              )}
            </>
          ),
        });
      }
      // If student has HOPS, specifically for uppersecondary school
      else if (
        this.props.guider.currentStudent.hops &&
        this.props.guider.currentStudent.hops.optedIn
      ) {
        tabs.splice(1, 0, {
          id: "HOPS",
          name: "Hops",
          type: "guider-student",
          component: <StudyPlan />,
        });
      }
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
    status: state.status,
    currentStudentStatus: state.guider.currentStudentState,
    guider: state.guider,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch action dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    {
      loadStudentHistory,
      loadStudentContactLogs,
      updateCurrentStudentHopsPhase,
    },
    dispatch
  );
}

export default withTranslation(["common"])(
  connect(mapStateToProps, mapDispatchToProps)(StudentDialog)
);

/**
 * Returns role string for pedagogical support form
 *
 * @param pedagogyFormAvailable pedagogyFormAvailable
 * @returns role
 */
const userRoleForForm = (pedagogyFormAvailable: PedagogyFormAccess) => {
  if (pedagogyFormAvailable.specEdTeacher) {
    return "SPECIAL_ED_TEACHER";
  }
  if (pedagogyFormAvailable.courseTeacher) {
    return "COURSE_TEACHER";
  }
  if (pedagogyFormAvailable.guidanceCounselor) {
    return "GUIDANCE_COUNSELOR";
  }
  if (pedagogyFormAvailable.studentParent) {
    return "STUDENT_PARENT";
  }
};
