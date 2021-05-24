import * as React from "react";
import { WorkspaceType } from "~/reducers/workspaces";
import { i18nType } from "~/reducers/base/i18n";
import { MatriculationExaminationEnrollmentInfo as Step1 } from "./matriculation-examination-enrollment-info";
import { MatriculationExaminationEnrollmentInformation as Step2 } from "./matriculation-examination-enrollment-information";
import { MatriculationExaminationEnrollmentAct as Step3 } from "./matriculation-examination-enrollment-act";
import { MatriculationExaminationEnrollmentCompleted as Step4 } from "./matriculation-examination-enrollment-completed";
const StepZilla = require("react-stepzilla").default;
import "~/sass/elements/wizard.scss";
import { connect, Dispatch } from "react-redux";
import { StateType } from "~/reducers";
import "~/sass/elements/matriculation.scss";
import { Examination, SaveState } from "../../../../@types/shared";
import {
  ProfileStatusType,
  StatusType,
} from "../../../../reducers/base/status";

interface MatriculationExaminationWizardProps {
  workspace: WorkspaceType;
  i18n: i18nType;
  status: StatusType;
  onDone: () => any;
}

interface MatriculationExaminationWizardState {
  locked: boolean;
  examinationInformation?: Examination;
  data: any;
  examId: any;
}

class MatriculationExaminationWizard extends React.Component<
  MatriculationExaminationWizardProps,
  MatriculationExaminationWizardState
> {
  constructor(props: MatriculationExaminationWizardProps) {
    super(props);

    this.state = {
      examId: undefined,
      locked: false,
      examinationInformation: {
        studentProfile: {
          name: "",
          email: "",
          address: "",
          zipCode: "",
          postalDisctrict: "",
          phoneNumber: "",
          profileId: "",
          descriptionInfo: "",
        },
        studentInfo: {
          degreeType: "MATRICULATIONEXAMINATION",
          registrationType: "UPPERSECONDARY",
          superVisor: "",
          refreshingExamination: "false",
        },
        attendedSubjectList: [],
        completedSubjectList: [],
        futureSubjectList: [],
        attentionInformation: {
          placeToAttend: "Mikkeli",
          extraInfoForSupervisor: "",
          publishPermission: "false",
          publishedName: "",
          date: undefined,
        },
      },
      data: undefined,
    };
  }

  /**
   * componentDidMount
   */
  componentDidMount() {
    fetch(
      `/rest/matriculation/exams/${this.state.examId}/initialData/${this.props.status.userId}`,
      { credentials: "include" }
    )
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        this.setState(data);
        this.fetchSavedEnrollment();
      });
  }

  /**
   * fetchSavedEnrollment
   */
  fetchSavedEnrollment() {
    fetch(
      `/rest/matriculation/exams/${this.state.examId}/savedEnrollments/${this.props.status.userId}`,
      { credentials: "include" }
    )
      .then((response) => {
        if (response.status == 404) {
          return "{}";
        } else {
          return response.json();
        }
      })
      .then((data) => {
        this.setState(Object.assign(data, { initialized: true }));
      });
  }

  /**
   * newEnrolledAttendance
   */
  newEnrolledAttendance = (e: React.MouseEvent) => {
    const enrolledAttendances =
      this.state.examinationInformation.attendedSubjectList;
    enrolledAttendances.push({
      subject: "AI",
      mandatory: "true",
      renewal: "false",
      status: "UNKNOWN",
    });

    this.setState({
      examinationInformation: {
        ...this.state.examinationInformation,
        attendedSubjectList: enrolledAttendances,
      },
    });
  };

  /**
   * newFinishedAttendance
   */
  newFinishedAttendance = (e: React.MouseEvent) => {
    const finishedAttendances =
      this.state.examinationInformation.completedSubjectList;
    finishedAttendances.push({
      term: "",
      subject: "AI",
      mandatory: "false",
      grade: "UNKNOWN",
      status: "FINISHED",
    });

    this.setState({
      examinationInformation: {
        ...this.state.examinationInformation,
        completedSubjectList: finishedAttendances,
      },
    });
  };

  /**
   * newPlannedAttendance
   */
  newPlannedAttendance = (e: React.MouseEvent) => {
    const plannedAttendances =
      this.state.examinationInformation.futureSubjectList;
    plannedAttendances.push({
      term: "",
      subject: "AI",
      mandatory: "true",
      status: "PLANNED",
    });

    this.setState({
      examinationInformation: {
        ...this.state.examinationInformation,
        futureSubjectList: plannedAttendances,
      },
    });
  };

  /**
   * deleteEnrolledAttendance
   * @param i
   */
  deleteEnrolledAttendance = (i: number) => (e: React.MouseEvent) => {
    const enrolledAttendances =
      this.state.examinationInformation.attendedSubjectList;
    enrolledAttendances.splice(i, 1);

    this.setState({
      examinationInformation: {
        ...this.state.examinationInformation,
        attendedSubjectList: enrolledAttendances,
      },
    });
  };

  /**
   * deleteFinishedAttendance
   * @param i
   */
  deleteFinishedAttendance = (i: number) => (e: React.MouseEvent) => {
    const finishedAttendances =
      this.state.examinationInformation.completedSubjectList;
    finishedAttendances.splice(i, 1);

    this.setState({
      examinationInformation: {
        ...this.state.examinationInformation,
        completedSubjectList: finishedAttendances,
      },
    });
  };

  /**
   * deletePlannedAttendance
   * @param i
   */
  deletePlannedAttendance = (i: number) => (e: React.MouseEvent) => {
    const plannedAttendances =
      this.state.examinationInformation.futureSubjectList;
    plannedAttendances.splice(i, 1);

    this.setState({
      examinationInformation: {
        ...this.state.examinationInformation,
        futureSubjectList: plannedAttendances,
      },
    });
  };

  /**
   * onExaminationInformationChange
   * @param examination
   */
  onExaminationInformationChange = (examination: Examination) => {
    this.setState({
      examinationInformation: examination,
    });
  };

  /**
   * Renders steps title by state of saving
   * @param state State of saving
   * @returns title
   */
  renderSaveStateMessageTitle = (state?: SaveState) => {
    const animatedDots = (
      <>
        <span>.</span>
        <span>.</span>
        <span>.</span>
      </>
    );

    let title: JSX.Element;
    switch (state) {
      case "PENDING":
        title = (
          <p className="matriculation-step-title">Odottaa{animatedDots}</p>
        );
      case "IN_PROGRESS":
        title = (
          <p className="matriculation-step-title">Ladataan{animatedDots}</p>
        );
      case "SUCCESS":
        title = <p className="matriculation-step-title">Valmis</p>;
      case "FAILED":
        title = <p className="matriculation-step-title">Epäonnistui</p>;
        break;
      default:
        title = <p className="matriculation-step-title">Viimeistely</p>;
    }
    return title;
  };

  /**
   * Component render
   */
  render() {
    const steps = [
      {
        name: "Info",
        component: <Step1 />,
      },
      {
        name: "Oppilastiedot",
        component: (
          <Step2
            onChange={this.onExaminationInformationChange}
            newEnrolledAttendance={this.newEnrolledAttendance}
            newFinishedAttendance={this.newFinishedAttendance}
            newPlannedAttendance={this.newPlannedAttendance}
            deleteEnrolledAttendance={this.deleteEnrolledAttendance}
            deleteFinishedAttendance={this.deleteFinishedAttendance}
            deletePlannedAttendance={this.deletePlannedAttendance}
            examination={this.state.examinationInformation}
          />
        ),
      },
      {
        name: "Suorituspaikka",
        component: (
          <Step3
            onChange={this.onExaminationInformationChange}
            examination={this.state.examinationInformation}
          />
        ),
      },
      {
        name: this.renderSaveStateMessageTitle(),
        component: <Step4 saveState="FAILED" />,
      },
    ];

    return (
      <div className="wizard">
        <div className="wizard_container">
          <StepZilla
            stepsNavigation={!this.state.locked}
            showNavigation={!this.state.locked}
            steps={steps}
            showSteps={true}
            preventEnterSubmission={true}
            prevBtnOnLastStep={false}
            nextTextOnFinalActionStep="Ilmoittaudu"
            nextButtonCls="button button--wizard"
            backButtonCls="button button--wizard"
            nextButtonText={this.props.i18n.text.get(
              "plugin.workspace.management.wizard.button.next"
            )}
            backButtonText={this.props.i18n.text.get(
              "plugin.workspace.management.wizard.button.last"
            )}
          />
        </div>
      </div>
    );
  }
}

/**
 * mapStateToProps
 * @param state
 * @returns
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    workspace: state.workspaces && state.workspaces.currentWorkspace,
    status: state.status,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 * @returns
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MatriculationExaminationWizard);
