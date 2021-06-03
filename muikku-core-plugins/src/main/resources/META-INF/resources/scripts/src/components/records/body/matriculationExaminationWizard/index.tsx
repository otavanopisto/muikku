import * as React from "react";
import { WorkspaceType } from "~/reducers/workspaces";
import { i18nType } from "~/reducers/base/i18n";
import { MatriculationExaminationEnrollmentInfo as Step1 } from "./matriculation-examination-enrollment-info";
import { MatriculationExaminationEnrollmentInformation as Step2 } from "./matriculation-examination-enrollment-information";
import { MatrMatriculationExaminationEnrollmentAct as Step3 } from "./matriculation-examination-enrollment-act";
import { MatriculationExaminationEnrollmentSummary as Step4 } from "./matriculation-examination-enrollment-summary";
import { MatriculationExaminationEnrollmentCompleted as Step5 } from "./matriculation-examination-enrollment-completed";

const StepZilla = require("react-stepzilla").default;
import "~/sass/elements/wizard.scss";
import { connect, Dispatch } from "react-redux";
import { StateType } from "~/reducers";
import "~/sass/elements/matriculation.scss";
import {
  SaveState,
  ExaminationSubject,
  MatriculationExaminationApplication,
} from "../../../../@types/shared";
import { StatusType } from "../../../../reducers/base/status";
import {
  MatriculationExaminationDraft,
  ExaminationInformation,
} from "../../../../@types/shared";
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
export const REQUIRED_NUM_OF_COURSES = 20;
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
  initialized: boolean;
  savingDraft: boolean;
  examId: any;
  errorMsg?: string;
  saveState?: SaveState;
  examinationInformation: ExaminationInformation;
}

class MatriculationExaminationWizard extends React.Component<
  MatriculationExaminationWizardProps,
  MatriculationExaminationWizardState
> {
  private draftTimer?: NodeJS.Timer = undefined;
  private draftedFields = [
    "changedContactInfo",
    "guider",
    "enrollAs",
    "degreeType",
    "numMandatoryCourses",
    "restartExam",
    "message",
    "location",
    "canPublishName",
    "enrolledAttendances",
    "plannedAttendances",
    "finishedAttendances",
  ];

  /**
   * constructor
   * @param props
   */
  constructor(props: MatriculationExaminationWizardProps) {
    super(props);
    const date = new Date();

    this.state = {
      saveState: undefined,
      examId: undefined,
      initialized: false,
      savingDraft: false,
      errorMsg: undefined,
      examinationInformation: {
        name: "",
        email: "",
        phone: "",
        address: "",
        postalCode: "",
        locality: "",
        changedContactInfo: "",
        guider: "",
        enrollAs: "UPPERSECONDARY",
        degreeType: "MATRICULATIONEXAMINATION",
        numMandatoryCourses: "",
        restartExam: false,
        location: "Mikkeli",
        message: "",
        studentIdentifier: "",
        initialized: false,
        enrolledAttendances: [],
        plannedAttendances: [],
        finishedAttendances: [],
        canPublishName: "true",
        enrollmentSent: false,
        guidanceCounselor: "",
        ssn: "",
        date:
          date.getDate() +
          "." +
          (date.getMonth() + 1) +
          "." +
          date.getFullYear(),
      },
    };
  }

  /**
   * Fetches student information from backend and sets those to state
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
        this.setState(
          (prevState) => ({
            initialized: false,
            examinationInformation: {
              ...prevState.examinationInformation,
              ...data,
            },
          }),
          () => this.fetchSavedEnrollment()
        );
      });
  }

  /**
   * Fetch saved enrollment data and set those to state and set initialized status true.
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
        this.setState((prevState) => ({
          initialized: true,
          examinationInformation: {
            ...prevState.examinationInformation,
            ...data,
            restartExam: Boolean(data.restartExam),
          },
        }));
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
      enrolledAttendances,
      plannedAttendances,
      finishedAttendances,
      canPublishName,
      location,
      message,
      restartExam,
      numMandatoryCourses,
      degreeType,
      enrollAs,
      guider,
      changedContactInfo,
    } = this.state.examinationInformation;

    const matriculationForm: MatriculationExaminationDraft = {
      changedContactInfo,
      guider,
      enrollAs,
      degreeType,
      numMandatoryCourses,
      restartExam: restartExam.toString(),
      message,
      location,
      canPublishName,
      enrolledAttendances,
      plannedAttendances,
      finishedAttendances,
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
      saveState: "IN_PROGRESS",
    });

    const {
      changedContactInfo,
      message,
      enrolledAttendances,
      finishedAttendances,
      plannedAttendances,
      name,
      email,
      ssn,
      phone,
      address,
      postalCode,
      locality,
      guider,
      enrollAs,
      degreeType,
      restartExam,
      numMandatoryCourses,
      location,
      studentIdentifier,
      canPublishName,
    } = this.state.examinationInformation;

    let modifiedMessage = message;

    if (changedContactInfo) {
      modifiedMessage =
        "Yhteystiedot:\n" + changedContactInfo + "\n\n" + message;
    }

    /**
     * Parsed list of enrolled Attendances
     * This must be done because backend takes it this form
     */
    const attendedSubjectListParsed = enrolledAttendances.map((aSubject) => ({
      subject: aSubject.subject,
      mandatory: aSubject.mandatory === "true",
      repeat: aSubject.repeat === "true",
      year: null,
      term: null,
      status: aSubject.status,
    }));

    /**
     * Parsed list of finished Attendances
     */
    const finishedSubjectListParsed = finishedAttendances.map((fsubject) => ({
      subject: fsubject.subject,
      mandatory: fsubject.mandatory === "true",
      year: fsubject.term ? Number(fsubject.term.substring(6)) : null,
      term: fsubject.term ? fsubject.term.substring(0, 6) : null,
      status: fsubject.status,
      grade: fsubject.grade,
    }));

    /**
     * Parsed list of planned Attendances
     */
    const plannedSubjectListParsed = plannedAttendances.map((pSubject) => ({
      subject: pSubject.subject,
      mandatory: pSubject.mandatory === "true",
      year: pSubject.term ? Number(pSubject.term.substring(6)) : null,
      term: pSubject.term ? pSubject.term.substring(0, 6) : null,
      status: pSubject.status,
    }));

    const matriculationForm: MatriculationExaminationApplication = {
      examId: this.props.examId.toString(),
      name,
      ssn,
      email,
      phone,
      address,
      postalCode,
      city: locality,
      guider,
      enrollAs,
      degreeType,
      restartExam: restartExam.toString(),
      numMandatoryCourses: parseInt(numMandatoryCourses),
      location,
      message: modifiedMessage,
      studentIdentifier: studentIdentifier,
      canPublishName: canPublishName === "true",
      state: "PENDING",
      attendances: [
        ...attendedSubjectListParsed,
        ...finishedSubjectListParsed,
        ...plannedSubjectListParsed,
      ],
    };

    const requestOptions = {
      method: "POST",
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
          this.setState({ saveState: "SUCCESS" });
        } else {
          throw new Error();
        }
      })
      .catch((error) => {
        this.setState({ saveState: "FAILED" });
      });
  };

  /**
   * handles possible error messages setting those to state
   * @param msg
   */
  handleErrorMsg = (msg: string) => {
    this.setState({
      saveState: undefined,
      errorMsg: msg,
    });
  };

  /**
   * handles when wizard step changes and here check when last step before complete happens,
   * kick offs form submit
   * @param steps
   * @returns
   */
  onStepChange = (steps: object[]) => (step: any) => {
    if (step === steps.length - 1) {
      this.submit();
    }
  };

  /**
   * Handles examination information change and start draft saving timer, clears existing timer
   * if changes happens before existing timer happens to end
   * @param examination
   */
  onExaminationInformationChange = (examination: ExaminationInformation) => {
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
   * Render method
   */
  render() {
    if (!this.state.initialized) {
      return <></>;
    }

    /**
     * StepZilla steps
     */
    const steps = [
      {
        name: "Info",
        component: <Step1 />,
      },
      {
        name: "Opiskelijatiedot",
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
        name: "Yhteenveto",
        component: (
          <Step4
            examination={this.state.examinationInformation}
            saveState={this.state.saveState}
            draftSaveErrorMsg={this.state.errorMsg}
          />
        ),
      },
      {
        name: "Valmis",
        component: <Step5 saveState={this.state.saveState} />,
      },
    ];

    return (
      <div className="wizard">
        <div className="wizard__content">
          <StepZilla
            stepsNavigation={false}
            showNavigation={true}
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
              "plugin.workspace.management.wizard.button.prev"
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
