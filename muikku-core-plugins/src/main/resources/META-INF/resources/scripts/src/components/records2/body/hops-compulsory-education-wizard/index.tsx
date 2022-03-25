import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { StateType } from "~/reducers";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const StepZilla = require("react-stepzilla").default;

import "~/sass/elements/wizard.scss";
import { Step1, Step2, Step3, Step5, Step6 } from "./hops-steps";
import { GuiderType } from "~/reducers/main-function/guider/index";
import promisify from "~/util/promisify";
import mApi from "~/lib/mApi";
import {
  BasicInformation,
  HopsUpdate,
  SaveState,
  FollowUp,
  StudentInfo,
  LanguageGradeEnum,
} from "~/@types/shared";
import {
  HopsCompulsory,
  Education,
  HopsPlanningStudies,
} from "~/@types/shared";
import {
  HopsStudentStartingLevel,
  HopsMotivationAndStudy,
} from "~/@types/shared";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { sleep } from "~/helper-functions/shared";
import { AnyActionType } from "~/actions";
import NewHopsEventDescriptionDialog from "./dialogs/new-hops-event-description-dialog";
import { Textarea } from "./text-area";
import { StatusType } from "~/reducers/base/status";
import EditHopsEventDescriptionDialog from "./dialogs/edit-hops-event-description-dialog";

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
  status: StatusType;
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
  addHopsUpdateDetailsDialogOpen: boolean;
  updateEventToBeEdited?: HopsUpdate;
  hopsUpdateDetails: string;
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
      addHopsUpdateDetailsDialogOpen: false,
      hopsUpdateDetails: "",
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
          )()) as HopsUpdate[];

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
   * handleUpdateHistoryEventDetails
   */
  updateHistoryEventDetails = async () => {
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
      const updatedEvent = (await promisify(
        mApi().hops.student.history.update(
          studentId,
          this.state.updateEventToBeEdited.id,
          {
            details: this.state.updateEventToBeEdited.details,
          }
        ),
        "callback"
      )()) as HopsUpdate;

      const updatedEventList = [...this.state.basicInfo.updates];

      const indexOfEditedEvent = updatedEventList.findIndex(
        (item) => item.id === updatedEvent.id
      );

      updatedEventList[indexOfEditedEvent] = updatedEvent;

      this.setState({
        basicInfo: {
          ...this.state.basicInfo,
          updates: updatedEventList,
        },
      });
    } catch (err) {
      this.props.displayNotification(`Hups errori ${err}`, "error");
      this.setState({ loading: false });
    }
  };

  /**
   * handleSaveHops
   */
  saveHops = async () => {
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
            mApi().hops.student.create(studentId, this.state.hopsCompulsory, {
              details: this.state.hopsUpdateDetails,
            }),
            "callback"
          )();
        })(),
        sleepPromise,
      ]).then(async () => {
        this.loadHopsData().then(() => {
          this.setState({
            loading: false,
            hopsUpdateDetails: "",
            savingStatus: "SUCCESS",
          });
        });
      });
    } catch (err) {
      this.props.displayNotification(`Hups errori ${err}`, "error");
      this.setState({ loading: false, savingStatus: "FAILED" });
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
   * Handles edit history event click and sets that as active edited event to state
   *
   * @param eventId eventId
   */
  handleEditHistoryEventClick = (eventId: number) => {
    this.setState({
      updateEventToBeEdited: this.state.basicInfo.updates.find(
        (item) => item.id === eventId
      ),
    });
  };

  /**
   * Handles change event when editing choosed history event's details
   * @param e e
   */
  handleHopsEditingHistoryEventDetailsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    this.setState({
      updateEventToBeEdited: {
        ...this.state.updateEventToBeEdited,
        details: e.currentTarget.value,
      },
    });
  };

  /**
   * Handles hops update details change
   *
   * @param e e
   */
  handleHopsUpdateDetailsChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    this.setState({
      hopsUpdateDetails: e.currentTarget.value,
    });
  };

  /**
   * Handles save click on details dialog...
   */
  handleSaveClick = () => {
    this.saveHops()
      .then(() => {
        this.setState({
          addHopsUpdateDetailsDialogOpen: false,
        });
      })
      .catch(() => {
        this.setState({ addHopsUpdateDetailsDialogOpen: false });
      });
  };

  /**
   * Handles cancel click on details dialog
   */
  handleCancelClick = () => {
    this.setState({
      addHopsUpdateDetailsDialogOpen: false,
    });
  };

  /**
   * Handles save updated click on updated history event dialog
   */
  handleSaveUpdatedHistoryEventClick = () => {
    this.updateHistoryEventDetails().then(() => {
      this.setState({
        updateEventToBeEdited: undefined,
      });
    });
  };

  /**
   * Handles cancel click on updated history event dialog
   *
   */
  handleCancelUpdatingHistoryEventClick = () => {
    this.setState({
      updateEventToBeEdited: undefined,
    });
  };

  /**
   * Handles when wizard step changes and here check when last step before complete happens,
   * kick offs form submit
   *
   * @param steps steps
   */
  handleStepChange = (steps: object[]) => (step: any) => {
    if (step === steps.length - 1) {
      if (this.props.superVisorModifies) {
        this.setState({
          addHopsUpdateDetailsDialogOpen: true,
        });
      } else {
        this.saveHops();
      }
    }
  };

  /**
   * Component render method
   *
   * @returns JSX.Element
   */
  render() {
    const {
      i18n,
      guider,
      status,
      displayNotification,
      children,
      ...baseProps
    } = this.props;

    const steps = [
      {
        name: "Perustiedot",
        component: (
          <Step1
            {...baseProps}
            loading={this.state.loading}
            basicInformation={this.state.basicInfo}
            loggedUserId={status.userId}
            onHistoryEventClick={this.handleEditHistoryEventClick}
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
        <NewHopsEventDescriptionDialog
          content={
            <div>
              <Textarea
                label="Vapaa kuvaus tapahtuman muutoksista"
                className="form-element__textarea form-element__textarea--resize__vertically"
                onChange={this.handleHopsUpdateDetailsChange}
                value={this.state.hopsUpdateDetails}
              />
            </div>
          }
          isOpen={this.state.addHopsUpdateDetailsDialogOpen}
          onSaveClick={this.handleSaveClick}
          onCancelClick={this.handleCancelClick}
        />
        <EditHopsEventDescriptionDialog
          content={
            <div>
              <Textarea
                label="Muokkaa tapahtuman kuvausta"
                className="form-element__textarea form-element__textarea--resize__vertically"
                onChange={this.handleHopsEditingHistoryEventDetailsChange}
                value={
                  this.state.updateEventToBeEdited &&
                  this.state.updateEventToBeEdited.details
                }
              />
            </div>
          }
          isOpen={!!this.state.updateEventToBeEdited}
          onSaveClick={this.handleSaveUpdatedHistoryEventClick}
          onCancelClick={this.handleCancelUpdatingHistoryEventClick}
        />
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
    status: state.status,
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
    previousLanguageExperience: [
      {
        name: "suomi",
        grade: LanguageGradeEnum.NOT_STUDIED,
        hardCoded: true,
      },
      {
        name: "ruotsi",
        grade: LanguageGradeEnum.NOT_STUDIED,
        hardCoded: true,
      },
      {
        name: "englanti",
        grade: LanguageGradeEnum.NOT_STUDIED,
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
