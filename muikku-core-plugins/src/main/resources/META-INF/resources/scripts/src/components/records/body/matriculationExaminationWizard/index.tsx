import * as React from "react";
import { WorkspaceType } from "~/reducers/workspaces";
import { i18nType } from "~/reducers/base/i18n";
import { MatriculationExaminationEnrollmentInfo as Step1 } from "./matriculation-examination-enrollment-info";
import { MatriculationExaminationEnrollmentInformation as Step2 } from "./matriculation-examination-enrollment-information";
import { MatrMatriculationExaminationEnrollmentAct as Step3 } from "./matriculation-examination-enrollment-act";
import { MatriculationExaminationEnrollmentCompleted as Step4 } from "./matriculation-examination-enrollment-completed";
const StepZilla = require("react-stepzilla").default;
import "~/sass/elements/wizard.scss";
import { connect, Dispatch } from "react-redux";
import { StateType } from "~/reducers";
import "~/sass/elements/matriculation.scss";
import {
  Examination,
  SaveState,
  ExaminationSubject,
  MatriculationExaminationApplication,
} from "../../../../@types/shared";
import { StatusType } from "../../../../reducers/base/status";
import { MatriculationExaminationDraft } from "../../../../@types/shared";
import {
  MatriculationStudent,
  MatriculationStudentExamination,
} from "../../../../@types/shared";

export const ACADEMIC_SUBJECTS = [
  "UE",
  "ET",
  "YO",
  "KE",
  "GE",
  "TT",
  "PS",
  "FI",
  "HI",
  "FY",
  "BI",
];
export const ADVANCED_SUBJECTS = [
  "MAA",
  "RUA",
  "ENA",
  "RAA",
  "ESA",
  "SAA",
  "VEA",
];
export const FINNISH_SUBJECTS = ["AI", "S2"];
export const REQUIRED_FINNISH_ATTENDANCES = 1;
export const REQUIRED_MANDATORY_ATTENDANCES = 4;
export const REQUIRED_ACADEMIC_SUBJECT_ATTENDANCE_LESS_THAN = 2;
export const REQUIRED_MANDATORY_SUBJECT_ATTENDANCE_MORE_THAN = 0;
export const SUBJECT_MAP: ExaminationSubject = {
  AI: "Äidinkieli",
  S2: "Suomi toisena kielenä",
  ENA: "Englanti, A-taso",
  RAA: "Ranska, A-taso",
  ESA: "Espanja, A-taso",
  SAA: "Saksa, A-taso",
  VEA: "Venäjä, A-taso",
  RUA: "Ruotsi, A-taso",
  RUB: "Ruotsi, B-taso",
  MAA: "Matematiikka, pitkä",
  MAB: "Matematiikka, lyhyt",
  UE: "Uskonto",
  ET: "Elämänkatsomustieto",
  YO: "Yhteiskuntaoppi",
  KE: "Kemia",
  GE: "Maantiede",
  TT: "Terveystieto",
  PS: "Psykologia",
  FI: "Filosofia",
  HI: "Historia",
  FY: "Fysiikka",
  BI: "Biologia",
  ENC: "Englanti, C-taso",
  RAC: "Ranska, C-taso",
  ESC: "Espanja, C-taso",
  SAC: "Saksa, C-taso",
  VEC: "Venäjä, C-taso",
  ITC: "Italia, C-taso",
  POC: "Portugali, C-taso",
  LAC: "Latina, C-taso",
  SM_DC: "Pohjoissaame, C-taso",
  SM_ICC: "Inarinsaame, C-taso",
  SM_QC: "Koltansaame, C-taso",
};

interface MatriculationExaminationWizardProps {
  workspace: WorkspaceType;
  i18n: i18nType;
  status: StatusType;
  examId: number;
  onDone: () => any;
}

export interface MatriculationExaminationWizardState {
  locked: boolean;
  examinationInformation: Examination;
  initialized: boolean;
  savingDraft: boolean;
  examId: any;
  errorMsg?: string;
  saveState?: SaveState;
}

class MatriculationExaminationWizard extends React.Component<
  MatriculationExaminationWizardProps,
  MatriculationExaminationWizardState
> {
  private draftTimer?: NodeJS.Timer = undefined;

  constructor(props: MatriculationExaminationWizardProps) {
    super(props);
    const date = new Date();

    this.state = {
      saveState: undefined,
      examId: undefined,
      locked: false,
      initialized: false,
      savingDraft: false,
      errorMsg: undefined,
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
          ssn: null,
        },
        studentInfo: {
          degreeType: "MATRICULATIONEXAMINATION",
          registrationType: "UPPERSECONDARY",
          superVisor: "",
          refreshingExamination: "false",
          courseCount: 0,
        },
        attendedSubjectList: [],
        completedSubjectList: [],
        futureSubjectList: [],
        attentionInformation: {
          placeToAttend: "Mikkeli",
          extraInfoForSupervisor: "",
          publishPermission: "false",
          publishedName: "",
          date:
            date.getDate() +
            "." +
            (date.getMonth() + 1) +
            "." +
            date.getFullYear(),
        },
      },
    };
  }

  /**
   * componentDidMount
   */
  componentDidMount() {
    fetch(
      `/rest/matriculation/exams/${this.props.examId}/initialData/${this.props.status.userSchoolDataIdentifier}`,
      { credentials: "include" }
    )
      .then((response) => {
        return response.json();
      })
      .then((data: MatriculationStudent) => {
        const examinationInformation: Examination = {
          ...this.state.examinationInformation,
          studentProfile: {
            name: data.name,
            email: data.email,
            address: data.address,
            zipCode: data.postalCode,
            postalDisctrict: data.locality,
            phoneNumber: data.phone,
            profileId: data.studentIdentifier,
            descriptionInfo: "",
            ssn: data.ssn,
          },
        };

        this.setState({
          initialized: false,
          examinationInformation,
        });
        this.fetchSavedEnrollment();
      });
  }

  /**
   * fetchSavedEnrollment
   */
  fetchSavedEnrollment() {
    fetch(
      `/rest/matriculation/exams/${this.props.examId}/savedEnrollments/${this.props.status.userSchoolDataIdentifier}`,
      { credentials: "include" }
    )
      .then((response) => {
        if (response.status == 404) {
          return "{}";
        } else {
          return response.json();
        }
      })
      .then((data: MatriculationStudentExamination) => {
        const examinationInformation: Examination = {
          studentProfile: {
            ...this.state.examinationInformation.studentProfile,
            descriptionInfo: data.changedContactInfo,
          },
          studentInfo: {
            degreeType: data.degreeType,
            registrationType: data.enrollAs,
            superVisor: data.guider,
            refreshingExamination: data.restartExam.toString(),
            courseCount: parseInt(data.numMandatoryCourses),
          },
          attendedSubjectList: data.enrolledAttendances,
          completedSubjectList: data.finishedAttendances,
          futureSubjectList: data.plannedAttendances,
          attentionInformation: {
            placeToAttend: data.location,
            extraInfoForSupervisor: data.message,
            publishPermission: data.canPublishName,
            publishedName:
              this.state.examinationInformation.studentProfile.name,
            date: this.state.examinationInformation.attentionInformation.date,
          },
        };

        this.setState({
          initialized: true,
          examinationInformation,
        });
      });
  }

  /**
   * resetDraftTimeout
   */
  resetDraftTimeout = () => {
    if (this.state.initialized) {
      if (this.draftTimer) {
        clearTimeout(this.draftTimer);
        this.draftTimer = undefined;
      }
      this.draftTimer = setTimeout(() => {
        this.saveDraft();
        this.draftTimer = undefined;
      }, 5000);
    }
  };

  /**
   * sleep
   * @param m milliseconds
   * @returns Promise
   */
  sleep = (m: number) => new Promise((r) => setTimeout(r, m));

  /**
   * saveDraft
   */
  saveDraft = async () => {
    this.setState({
      saveState: "SAVING_DRAFT",
    });

    const {
      studentInfo,
      studentProfile,
      attentionInformation,
      attendedSubjectList,
      completedSubjectList,
      futureSubjectList,
    } = this.state.examinationInformation;

    const matriculationForm: MatriculationExaminationDraft = {
      changedContactInfo: studentProfile.descriptionInfo,
      guider: studentInfo.superVisor,
      enrollAs: studentInfo.registrationType,
      degreeType: studentInfo.degreeType,
      numMandatoryCourses: studentInfo.courseCount.toString(),
      restartExam: studentInfo.refreshingExamination,
      message: attentionInformation.extraInfoForSupervisor,
      location: attentionInformation.placeToAttend,
      canPublishName: attentionInformation.publishPermission,
      enrolledAttendances: attendedSubjectList,
      plannedAttendances: futureSubjectList,
      finishedAttendances: completedSubjectList,
    };

    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(matriculationForm),
    };

    await fetch(
      `/rest/matriculation/exams/${this.props.examId}/savedEnrollments/${this.props.status.userSchoolDataIdentifier}`,
      {
        credentials: "include",
        ...requestOptions,
      }
    )
      .then(async (response) => {
        if (response.ok) {
          await this.sleep(3000);

          this.setState({
            saveState: "DRAFT_SAVED",
          });

          await this.sleep(3000);

          this.setState({
            saveState: undefined,
          });

          return response.json();
        }
        throw new Error();
      })
      .catch((error) => {
        let errMsg =
          "Lomakkeen välitallennus epäonnistui, palaa Muikun etusivulle ja varmista, että olet kirjautunut sisään.";
        this.handleErrorMsg(errMsg);
      });
  };

  /**
   * submit
   */
  submit = () => {
    this.setState({
      locked: true,
      saveState: "IN_PROGRESS",
    });

    const {
      studentProfile,
      attentionInformation,
      studentInfo,
      attendedSubjectList,
      futureSubjectList,
      completedSubjectList,
    } = this.state.examinationInformation;
    const { descriptionInfo } = studentProfile;
    const { extraInfoForSupervisor } = attentionInformation;

    let message = attentionInformation.extraInfoForSupervisor;
    if (descriptionInfo) {
      message =
        "Yhteystiedot:\n" + descriptionInfo + "\n\n" + extraInfoForSupervisor;
    }

    const attendedSubjectListParsed = attendedSubjectList.map((aSubject) => ({
      subject: aSubject.subject,
      mandatory: aSubject.mandatory === "true",
      repeat: aSubject.repeat === "true",
      year: null,
      term: null,
      status: aSubject.status,
    }));

    const finishedSubjectListParsed = completedSubjectList.map((fsubject) => ({
      subject: fsubject.subject,
      mandatory: fsubject.mandatory === "true",
      year: fsubject.term ? Number(fsubject.term.substring(6)) : null,
      term: fsubject.term ? fsubject.term.substring(0, 6) : null,
      status: fsubject.status,
      grade: fsubject.grade,
    }));

    const plannedSubjectListParsed = futureSubjectList.map((pSubject) => ({
      subject: pSubject.subject,
      mandatory: pSubject.mandatory === "true",
      year: pSubject.term ? Number(pSubject.term.substring(6)) : null,
      term: pSubject.term ? pSubject.term.substring(0, 6) : null,
      status: pSubject.status,
    }));

    const matriculationForm: MatriculationExaminationApplication = {
      examId: this.state.examId,
      name: studentProfile.name,
      ssn: studentProfile.ssn,
      email: studentProfile.email,
      phone: studentProfile.phoneNumber,
      address: studentProfile.address,
      postalCode: studentProfile.zipCode,
      city: studentProfile.postalDisctrict,
      guider: studentInfo.superVisor,
      enrollAs: studentInfo.registrationType,
      degreeType: studentInfo.degreeType,
      restartExam: studentInfo.refreshingExamination,
      numMandatoryCourses: studentInfo.courseCount
        ? studentInfo.courseCount
        : null,
      location: attentionInformation.placeToAttend,
      message: message,
      studentIdentifier: studentProfile.profileId,
      canPublishName: attentionInformation.publishPermission === "true",
      state: "PENDING",
      attendances: [
        ...attendedSubjectListParsed,
        ...finishedSubjectListParsed,
        ...plannedSubjectListParsed,
      ],
    };

    const requestOptions = {
      method: "PUT",
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
      body: JSON.stringify(matriculationForm),
    };

    fetch(`/rest/matriculation/exams/${this.props.examId}/enrollments`, {
      credentials: "include",
      ...requestOptions,
    })
      .then((response) => {
        if (response.ok) {
          this.setState({ locked: false, saveState: "SUCCESS" });
        } else {
          throw new Error();
        }
      })
      .catch((error) => {
        this.setState({ locked: false, saveState: "FAILED" });
      });
  };

  /**
   * handleErrorMsg
   * @param msg
   */
  handleErrorMsg = (msg: string) => {
    this.setState({
      saveState: undefined,
      errorMsg: msg,
    });
  };

  /**
   * onStepChange
   * @param steps
   * @returns
   */
  onStepChange = (steps: object[]) => (step: any) => {
    if (step === steps.length - 1) {
      console.log([steps, step]);

      this.submit();
    }
  };

  /**
   * onExaminationInformationChange
   * @param examination
   */
  onExaminationInformationChange = (examination: Examination) => {
    this.setState({
      examinationInformation: examination,
    });

    if (this.draftTimer) {
      clearTimeout(this.draftTimer);
      this.draftTimer = undefined;
    }

    this.draftTimer = setTimeout(this.saveDraft, 5000);
  };

  /**
   * Component render
   */
  render() {
    if (!this.state.initialized) {
      return <></>;
    }

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
            examination={this.state.examinationInformation}
            saveState={this.state.saveState}
            draftSaveErrorMsg={this.state.errorMsg}
          />
        ),
      },
      {
        name: "Suorituspaikka",
        component: (
          <Step3
            onChange={this.onExaminationInformationChange}
            examination={this.state.examinationInformation}
            saveState={this.state.saveState}
            draftSaveErrorMsg={this.state.errorMsg}
          />
        ),
      },
      {
        name: "Viimeistely",
        component: <Step4 saveState={this.state.saveState} />,
      },
    ];

    return (
      <div className="wizard">
        <div className="wizard__content">
          <StepZilla
            stepsNavigation={!this.state.locked}
            showNavigation={!this.state.locked}
            steps={steps}
            showSteps={true}
            preventEnterSubmission={true}
            prevBtnOnLastStep={false}
            dontValidate={false}
            nextTextOnFinalActionStep="Ilmoittaudu"
            nextButtonCls="button button--wizard"
            backButtonCls="button button--wizard"
            nextButtonText={this.props.i18n.text.get(
              "plugin.workspace.management.wizard.button.next"
            )}
            backButtonText={this.props.i18n.text.get(
              "plugin.workspace.management.wizard.button.last"
            )}
            onStepChange={this.onStepChange(steps)}
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
