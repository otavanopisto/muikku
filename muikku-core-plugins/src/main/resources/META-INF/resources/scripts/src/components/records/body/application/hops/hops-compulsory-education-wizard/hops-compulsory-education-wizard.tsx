import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { HOPSDataType } from "~/reducers/main-function/hops";
import { StateType } from "~/reducers";
const StepZilla = require("react-stepzilla").default;

import "~/sass/elements/wizard.scss";
import { Step1, Step2, Step3, Step5, Step6 } from "./steps";
import {
  GuiderType,
  GuiderStudentType,
} from "../../../../../../reducers/main-function/guider/index";
import promisify from "../../../../../../util/promisify";
import mApi from "~/lib/mApi";
import {
  BasicInformation,
  HopsUpdates,
  FollowUp,
  StudentInfo,
} from "../../../../../../@types/shared";
import {
  HopsCompulsory,
  Education,
  HopsPlanningStudies,
} from "../../../../../../@types/shared";
import {
  HopsStudentStartingLevel,
  HopsMotivationAndStudy,
} from "../../../../../../@types/shared";

export const NEEDED_OPTIONAL_COURSES = 9;
export const NEEDED_STUDIES_IN_TOTAL = 46;

/**
 * CompulsoryEducationHopsWizardProps
 */
interface CompulsoryEducationHopsWizardProps {
  user: "supervisor" | "student";
  onHopsChange?: (hops: HOPSDataType) => any;
  i18n: i18nType;
  testData?: number;
  disabled: boolean;
  superVisorModifies: boolean;
  guider: GuiderType;
}

/**
 * CompulsoryEducationHopsWizardState
 */
interface CompulsoryEducationHopsWizardState {
  basicInfo: BasicInformation;
  hopsCompulsory: HopsCompulsory;
  hopsFollowUp?: FollowUp;
  loading: boolean;
}

/**
 * CompulsoryEducationHopsWizard
 */
class CompulsoryEducationHopsWizard extends React.Component<
  CompulsoryEducationHopsWizardProps,
  CompulsoryEducationHopsWizardState
> {
  /**
   * constructor
   * @param props
   */
  constructor(props: CompulsoryEducationHopsWizardProps) {
    super(props);

    this.state = {
      loading: false,
      basicInfo: {
        name: "",
        guider: "",
      },
      hopsCompulsory: {
        startingLevel: {
          previousEducation: Education.COMPULSORY_SCHOOL,
          previousWorkExperience: "0-6",
          previousYearsUsedInStudies: "",
          finnishAsMainOrSecondaryLng: false,
          previousLanguageExperience: [
            {
              name: "Englanti",
              grade: 1,
              hardCoded: true,
            },
            {
              name: "Ruotsi",
              grade: 1,
              hardCoded: true,
            },
          ],
        },
        motivationAndStudy: {
          byReading: 0,
          byListening: 0,
          byDoing: 0,
          someOtherWay: "",
          byMemorizing: 0,
          byTakingNotes: 0,
          byDrawing: 0,
          byListeningTeacher: 0,
          byWatchingVideos: 0,
          byFollowingOthers: 0,
          someOtherMethod: "",
          noSupport: 0,
          family: 0,
          friend: 0,
          supportPerson: 0,
          teacher: 0,
          somethingElse: "",
          scaleSize: 5,
          scaleName: "0-5",
        },
        studiesPlanning: {
          usedHoursPerWeek: 0,
          ethics: false,
          finnishAsSecondLanguage: false,
        },
      },
    };
  }

  /**
   * componentDidMount
   */
  componentDidMount = async () => {
    this.setState({
      loading: true,
    });

    /**
     * Student id get from guider or logged in student
     */
    const studentId =
      this.props.user === "supervisor"
        ? this.props.guider.currentStudent.basic.id
        : (window as any).MUIKKU_LOGGED_USER;

    /**
     * Sleeper to delay data fetching if it happens faster than 1s
     */
    const sleep = await this.sleep(1000);

    /**
     * loaded hops data
     */
    const [loadedHops] = await Promise.all([
      (async () => {
        const studentHopsHistory = (await promisify(
          mApi().hops.student.history.read(studentId),
          "callback"
        )()) as HopsUpdates[];

        const studentBasicInfo = (await promisify(
          mApi().hops.student.studentInfo.read(studentId),
          "callback"
        )()) as StudentInfo;

        const hops = (await promisify(
          mApi().hops.student.read(studentId),
          "callback"
        )()) as HopsCompulsory;

        const followUp = (await promisify(
          mApi().hops.student.hopsGoals.read(studentId),
          "callback"
        )()) as FollowUp;

        let loadedHops = {
          basicInfo: {
            name: `${studentBasicInfo.firstName} ${studentBasicInfo.lastName}`,
            guider: `${studentBasicInfo.counselorName}`,
            updates: studentHopsHistory,
          },
          hopsCompulsory: hops !== undefined ? hops : initializeHops(),
          hopsFollowUp: followUp,
        };

        return loadedHops;
      })(),
      sleep,
    ]);

    this.setState({
      loading: false,
      ...loadedHops,
    });
  };

  /**
   * sleep
   * @param m milliseconds
   * @returns Promise
   */
  sleep = (m: number) => new Promise((r) => setTimeout(r, m));

  /**
   * handleStartingLevelChange
   * @param startingLevel
   */
  handleStartingLevelChange = (startingLevel: HopsStudentStartingLevel) => {
    this.setState({
      hopsCompulsory: {
        ...this.state.hopsCompulsory,
        startingLevel,
      },
    });
  };

  /**
   * handleMotivationAndStudyChange
   * @param motivationAndStudy
   */
  handleMotivationAndStudyChange = (
    motivationAndStudy: HopsMotivationAndStudy
  ) => {
    this.setState({
      hopsCompulsory: {
        ...this.state.hopsCompulsory,
        motivationAndStudy,
      },
    });
  };

  /**
   * handleStudiesPlanningChange
   * @param studiesPlanning
   */
  handleStudiesPlanningChange = (studiesPlanning: HopsPlanningStudies) => {
    this.setState({
      hopsCompulsory: {
        ...this.state.hopsCompulsory,
        studiesPlanning,
      },
    });
  };

  /**
   * handleFollowUpChange
   * @param followUp
   */
  handleFollowUpChange = (followUp: FollowUp) => {
    this.setState({
      hopsFollowUp: followUp,
    });
  };

  /**
   * handleDeleteCourseSelections
   */
  handleDeleteCourseSelections = () => {
    this.setState({
      hopsCompulsory: {
        ...this.state.hopsCompulsory,
        studiesPlanning: {
          ...this.state.hopsCompulsory.studiesPlanning,
        },
      },
    });
  };

  /**
   * handleSaveHops
   */
  handleSaveHops = async () => {
    this.setState({
      loading: true,
    });

    const studentId =
      this.props.user === "supervisor"
        ? this.props.guider.currentStudent.basic.id
        : (window as any).MUIKKU_LOGGED_USER;

    Promise.all([
      promisify(
        mApi().hops.student.create(studentId, this.state.hopsCompulsory),
        "callback"
      )().then((hops: any) => {
        console.log("tallennettu", hops);
      }),
      promisify(
        mApi().hops.student.hopsGoals.create(
          studentId,
          this.state.hopsFollowUp
        ),
        "callback"
      )().then((followUp: any) => {
        console.log("tallennettu", followUp);
      }),
    ]).then(() => {
      this.setState({ loading: false });
    });

    /* const parsedHops = { ...this.state.hopsCompulsory }; */
  };

  /**
   * handles when wizard step changes and here check when last step before complete happens,
   * kick offs form submit
   * @param steps
   * @returns
   */
  handleStepChange = (steps: object[]) => (step: any) => {
    if (step === steps.length - 1) {
      this.handleSaveHops();
    }
  };

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const steps = [
      {
        name: "Perustiedot",
        component: (
          <Step1
            disabled={this.props.disabled}
            loading={this.state.loading}
            basicInformation={this.state.basicInfo}
          />
        ),
      },
      {
        name: "Osaamisen ja lähtötason arvointi",
        component: (
          <Step2
            disabled={this.props.disabled}
            studentStartingLevel={this.state.hopsCompulsory.startingLevel}
            onStartingLevelChange={this.handleStartingLevelChange}
          />
        ),
      },
      {
        name: "Opiskelutaidot ja Motivaatio",
        component: (
          <Step3
            disabled={this.props.disabled}
            motivationAndStudy={this.state.hopsCompulsory.motivationAndStudy}
            onMotivationAndStudyChange={this.handleMotivationAndStudyChange}
          />
        ),
      },
      {
        name: "Tavoitteet ja opintojen suunnittelu",
        component: (
          <Step5
            user={this.props.user}
            disabled={this.props.disabled}
            studentId={
              this.props.user === "supervisor"
                ? this.props.guider.currentStudent.basic.id
                : (window as any).MUIKKU_LOGGED_USER
            }
            followUp={this.state.hopsFollowUp}
            studies={{
              ...this.state.hopsCompulsory.studiesPlanning,
            }}
            superVisorModifies={this.props.superVisorModifies}
            ethics={this.state.hopsCompulsory.studiesPlanning.ethics}
            finnishAsSecondLanguage={
              this.state.hopsCompulsory.studiesPlanning.finnishAsSecondLanguage
            }
            onStudiesPlanningChange={this.handleStudiesPlanningChange}
            onStudiesGoalsChange={this.handleFollowUpChange}
          />
        ),
      },
      {
        name: "Tallennus",
        component: <Step6 />,
      },
    ];

    return (
      <div className="wizard">
        <div className="wizard_container">
          <StepZilla
            steps={steps}
            showNavigation={true}
            showSteps={true}
            preventEnterSubmission={true}
            prevBtnOnLastStep={true}
            nextTextOnFinalActionStep="Tallenna"
            nextButtonCls="button button--wizard"
            backButtonCls="button button--wizard"
            nextButtonText="Seuraava"
            backButtonText="Edellinen"
            onStepChange={this.handleStepChange(steps)}
          />
        </div>
      </div>
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
    guider: state.guider,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompulsoryEducationHopsWizard);

const initializeHops = (): HopsCompulsory => ({
  startingLevel: {
    previousEducation: Education.COMPULSORY_SCHOOL,
    previousWorkExperience: "0-6",
    previousYearsUsedInStudies: "",
    finnishAsMainOrSecondaryLng: false,
    previousLanguageExperience: [
      {
        name: "Englanti",
        grade: 1,
        hardCoded: true,
      },
      {
        name: "Ruotsi",
        grade: 1,
        hardCoded: true,
      },
    ],
  },
  motivationAndStudy: {
    byReading: 0,
    byListening: 0,
    byDoing: 0,
    byMemorizing: 0,
    byTakingNotes: 0,
    byDrawing: 0,
    byListeningTeacher: 0,
    byWatchingVideos: 0,
    byFollowingOthers: 0,
    noSupport: 0,
    family: 0,
    friend: 0,
    supportPerson: 0,
    teacher: 0,
    scaleSize: 5,
    scaleName: "0-5",
  },
  studiesPlanning: {
    usedHoursPerWeek: 0,
    ethics: false,
    finnishAsSecondLanguage: false,
  },
});
