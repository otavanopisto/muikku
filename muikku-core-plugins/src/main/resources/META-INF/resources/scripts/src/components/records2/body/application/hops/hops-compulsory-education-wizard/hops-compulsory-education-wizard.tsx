import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { StateType } from "~/reducers";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const StepZilla = require("react-stepzilla").default;

import "~/sass/elements/wizard.scss";
import { Step1, Step2, Step3, Step5, Step6 } from "./steps";
import { GuiderType } from "../../../../../../reducers/main-function/guider/index";
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
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { sleep } from "~/helper-functions/shared";
import { SaveState } from "~/@types/shared";
import { AnyActionType } from "~/actions";

/**
 * Total needed optional studies without modifiers to graduate
 */
export const NEEDED_OPTIONAL_COURSES = 9;
/**
 * Default total studies to graduate
 */
export const NEEDED_STUDIES_IN_TOTAL = 46;

/**
 * User of hops. Can only be supervisor or student
 * and depending of that there is different amount
 * functionalities in study tool for example
 */
export type HopsUser = "supervisor" | "student";

/**
 * HopsSteps
 */
export interface HopsBaseProps {
  user: HopsUser;
  /**
   * phase limits what parts and features are available
   * for student depending what phase is on
   */
  phase?: number;
  disabled: boolean;
  superVisorModifies: boolean;
}

/**
 * CompulsoryEducationHopsWizardProps
 */
interface CompulsoryEducationHopsWizardProps extends HopsBaseProps {
  i18n: i18nType;
  guider: GuiderType;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * CompulsoryEducationHopsWizardState
 */
interface CompulsoryEducationHopsWizardState {
  basicInfo: BasicInformation;
  hopsCompulsory: HopsCompulsory;
  hopsFollowUp?: FollowUp;
  loading: boolean;
  savingStatus?: SaveState;
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
   * @param props props
   */
  constructor(props: CompulsoryEducationHopsWizardProps) {
    super(props);

    this.state = {
      loading: false,
      savingStatus: undefined,
      basicInfo: {
        name: "",
      },
      hopsCompulsory: {
        ...initializeHops(),
      },
    };
  }

  /**
   * componentDidMount
   */
  async componentDidMount() {
    this.loadHopsData();
  }

  /**
   * loadHopsData
   */
  loadHopsData = async () => {
    this.setState({
      loading: true,
    });

    /**
     * Student id get from guider or logged in student
     */
    const studentId =
      this.props.user === "supervisor"
        ? this.props.guider.currentStudent.basic.id
        : document
            .querySelector('meta[name="muikku:loggedUser"]')
            .getAttribute("value");

    try {
      /**
       * Sleeper to delay data fetching if it happens faster than 1s
       */
      const sleepPromise = await sleep(1000);

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

          const loadedHops = {
            basicInfo: {
              name: `${studentBasicInfo.firstName} ${studentBasicInfo.lastName}`,
              updates: studentHopsHistory,
              counselorList: studentBasicInfo.counselorList,
            },
            hopsCompulsory: hops !== undefined ? hops : initializeHops(),
          };

          return loadedHops;
        })(),
        sleepPromise,
      ]);

      this.setState({
        loading: false,
        ...loadedHops,
      });
    } catch (err) {
      this.props.displayNotification(`Hups errori ${err}`, "error");
      this.setState({ loading: false });
    }
  };

  /**
   * handleStartingLevelChange
   * @param startingLevel startingLevel
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
   * @param motivationAndStudy motivationAndStudy
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
   * @param studiesPlanning studiesPlanning
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
   * @param followUp followUp
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
      savingStatus: "IN_PROGRESS",
    });

    /**
     * Student id get from guider or logged in student
     */
    const studentId =
      this.props.user === "supervisor"
        ? this.props.guider.currentStudent.basic.id
        : document
            .querySelector('meta[name="muikku:loggedUser"]')
            .getAttribute("value");

    /**
     * Sleeper to delay data fetching if it happens faster than 1s
     */
    const sleepPromise = sleep(1000);

    try {
      Promise.all([
        (async () => {
          await promisify(
            mApi().hops.student.create(studentId, this.state.hopsCompulsory),
            "callback"
          )();
        })(),
        sleepPromise,
      ]).then(() => {
        this.setState({ loading: false, savingStatus: "SUCCESS" });
      });
    } catch (err) {
      this.props.displayNotification(`Hups errori ${err}`, "error");
      this.setState({ loading: false, savingStatus: "FAILED" });
    }
  };

  /**
   * handles when wizard step changes and here check when last step before complete happens,
   * kick offs form submit
   * @param steps steps
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
    const { i18n, guider, displayNotification, children, ...baseProps } =
      this.props;

    const steps = [
      {
        name: "Perustiedot",
        component: (
          <Step1
            {...baseProps}
            loading={this.state.loading}
            basicInformation={this.state.basicInfo}
          />
        ),
      },
      {
        name: "Osaamisen ja lähtötason arvointi",
        component: (
          <Step2
            {...baseProps}
            studentStartingLevel={this.state.hopsCompulsory.startingLevel}
            onStartingLevelChange={this.handleStartingLevelChange}
          />
        ),
      },
      {
        name: "Opiskelutaidot ja Motivaatio",
        component: (
          <Step3
            {...baseProps}
            motivationAndStudy={this.state.hopsCompulsory.motivationAndStudy}
            onMotivationAndStudyChange={this.handleMotivationAndStudyChange}
          />
        ),
      },
      {
        name: "Tavoitteet ja opintojen suunnittelu",
        component: (
          <Step5
            {...baseProps}
            studentId={
              this.props.user === "supervisor"
                ? this.props.guider.currentStudent.basic.id
                : document
                    .querySelector('meta[name="muikku:loggedUser"]')
                    .getAttribute("value")
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
        component: <Step6 {...baseProps} saveState={this.state.savingStatus} />,
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
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    guider: state.guider,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return {
    displayNotification,
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CompulsoryEducationHopsWizard);

/**
 * initializeHops
 * @returns object of initial hops state
 */
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
