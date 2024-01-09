import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { StateType } from "~/reducers";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const StepZilla = require("react-stepzilla").default;
import "~/sass/elements/wizard.scss";
import { Step1, Step2, Step3, Step5, Step6 } from "./hops-steps";
import {
  BasicInformation,
  SaveState,
  HopsStudyPeriodPlan,
  HopsCompulsory,
  Education,
} from "~/@types/shared";
import {
  HopsStudentStartingLevel,
  HopsMotivationAndStudy,
} from "~/@types/shared";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { AnyActionType } from "~/actions";
import NewHopsEventDescriptionDialog from "./dialogs/new-hops-event-description-dialog";
import { Textarea } from "./text-area";
import { StatusType } from "~/reducers/base/status";
import EditHopsEventDescriptionDialog from "./dialogs/edit-hops-event-description-dialog";
import StudyProgressContextProvider from "~/components/general/study-progress/context";
import MApi, { isMApiError } from "~/api/api";
import { HopsGoals, HopsHistoryEntry } from "~/generated/client";

export const COMPULSORY_HOPS_VISIBLITY = [
  "Nettiperuskoulu",
  "Aikuisten perusopetuksen päättövaihe",
  "Nettiperuskoulu/yksityisopiskelu",
];

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

export type HopsUsePlace = "guider" | "studies";

/**
 * HopsSteps
 */
export interface HopsBaseProps {
  /**
   * User of hops. Difference between functionalities
   * with specific users
   */
  user: HopsUser;
  /**
   * Use case of hops. Difference between functionalities with
   * specific use places/cases
   */
  usePlace: HopsUsePlace;
  /**
   * phase limits what parts and features are available
   * for student depending what phase is on
   */
  phase?: number;
  disabled: boolean;
  superVisorModifies: boolean;
  studentId: string;
}

/**
 * CompulsoryEducationHopsWizardProps
 */
interface CompulsoryEducationHopsWizardProps extends HopsBaseProps {
  status: StatusType;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * CompulsoryEducationHopsWizardState
 */
interface CompulsoryEducationHopsWizardState {
  basicInfo: BasicInformation;
  hopsCompulsory: HopsCompulsory;
  hopsFollowUp?: HopsGoals;
  loading: boolean;
  loadingHistoryEvents: boolean;
  allHistoryEventsLoaded: boolean;
  savingStatus?: SaveState;
  addHopsUpdateDetailsDialogOpen: boolean;
  updateEventToBeEdited?: HopsHistoryEntry;
  hopsUpdateDetails: string;
}

/**
 * CompulsoryEducationHopsWizard
 */
class CompulsoryEducationHopsWizard extends React.Component<
  CompulsoryEducationHopsWizardProps,
  CompulsoryEducationHopsWizardState
> {
  private isComponentMounted: boolean;

  /**
   * Constructor method
   *
   * @param props props
   */
  constructor(props: CompulsoryEducationHopsWizardProps) {
    super(props);

    this.state = {
      loading: false,
      loadingHistoryEvents: false,
      allHistoryEventsLoaded: false,
      savingStatus: undefined,
      basicInfo: {
        name: "",
        studentUserEntityId: null,
        curriculumName: null,
      },
      hopsCompulsory: {
        ...initializeHops(),
      },
      addHopsUpdateDetailsDialogOpen: false,
      hopsUpdateDetails: "",
    };

    this.isComponentMounted = false;
  }

  /**
   * componentDidMount
   */
  componentDidMount() {
    this.isComponentMounted = true;

    this.loadHopsData();
  }

  /**
   * componentDidUpdate
   * @param prevProps prevProps
   */
  componentDidUpdate(
    prevProps: Readonly<CompulsoryEducationHopsWizardProps>
  ): void {
    /**
     * If disabled props change, restore all data by loading it again
     */
    if (prevProps.disabled !== this.props.disabled) {
      this.loadHopsData();
    }
  }

  /**
   * componentWillUnmount
   */
  componentWillUnmount(): void {
    this.isComponentMounted = false;
  }

  /**
   * Loads more history events
   */
  loadMoreHistoryEvents = async () => {
    this.setState({
      loadingHistoryEvents: true,
    });

    const hopsApi = MApi.getHopsApi();

    /**
     * Student id get from guider or logged in student
     */
    const studentId = this.props.studentId;

    try {
      /**
       * loaded history data
       */
      const [studentHopsHistory] = await Promise.all([
        (async () => {
          const studentHopsHistory = await hopsApi.getStudentHopsHistoryEntries(
            {
              studentIdentifier: studentId,
              firstResult: 6,
              maxResults: 999,
            }
          );

          return studentHopsHistory;
        })(),
      ]);

      const updatedList: HopsHistoryEntry[] = [].concat(
        this.state.basicInfo.updates,
        studentHopsHistory
      );

      if (this.isComponentMounted) {
        this.setState({
          allHistoryEventsLoaded: true,
          loadingHistoryEvents: false,
          basicInfo: {
            ...this.state.basicInfo,
            updates: updatedList,
          },
        });
      }
    } catch (err) {
      if (this.isComponentMounted) {
        if (!isMApiError(err)) {
          throw err;
        }
        this.props.displayNotification(err.message, "error");
        this.setState({ loadingHistoryEvents: false });
      }
    }
  };

  /**
   * Loads hops data
   */
  loadHopsData = async () => {
    this.setState({
      loading: true,
    });

    const hopsApi = MApi.getHopsApi();

    /**
     * Student id get from guider or logged in student
     */
    const studentId = this.props.studentId;

    try {
      /**
       * loaded hops data
       */
      const [loadedHops] = await Promise.all([
        (async () => {
          const studentHopsHistory = await hopsApi.getStudentHopsHistoryEntries(
            {
              studentIdentifier: studentId,
            }
          );

          const studentBasicInfo = await hopsApi.getStudentInfo({
            studentIdentifier: studentId,
          });

          const hops: HopsCompulsory = await hopsApi.getStudentHops({
            studentIdentifier: studentId,
          });

          const loadedHops = {
            basicInfo: {
              studentUserEntityId: studentBasicInfo.id,
              name: `${studentBasicInfo.firstName} ${studentBasicInfo.lastName}`,
              updates: studentHopsHistory,
              counselorList: studentBasicInfo.counselorList,
              studyTimeEnd: studentBasicInfo.studyTimeEnd,
              educationalLevel: studentBasicInfo.studyProgrammeEducationType
                ? studentBasicInfo.studyProgrammeEducationType
                : "Ei asetettu",
              curriculumName: studentBasicInfo.curriculumName,
            } as BasicInformation,
            hopsCompulsory: {
              ...initializeHops(),
              ...hops,
            },
          };

          return loadedHops;
        })(),
      ]);

      if (this.isComponentMounted) {
        this.setState({
          loading: false,
          ...loadedHops,
        });
      }
    } catch (err) {
      if (this.isComponentMounted) {
        this.props.displayNotification(err.message, "error");
        this.setState({ loading: false });
      }
    }
  };

  /**
   * Update history event details
   */
  updateHistoryEventDetails = async () => {
    const hopsApi = MApi.getHopsApi();

    /**
     * Student id get from guider or logged in student
     */
    const studentId = this.props.studentId;

    try {
      const updatedEvent = await hopsApi.updateStudentHopsHistoryEntry({
        studentIdentifier: studentId,
        entryId: this.state.updateEventToBeEdited.id,
        updateStudentHopsHistoryEntryRequest: {
          details: this.state.updateEventToBeEdited.details,
        },
      });

      /**
       * initialize list to be updated
       */
      const updatedEventList = [...this.state.basicInfo.updates];

      /**
       * Index of edited item
       */
      const indexOfEditedEvent = updatedEventList.findIndex(
        (item) => item.id === updatedEvent.id
      );

      updatedEventList[indexOfEditedEvent] = updatedEvent;

      if (this.isComponentMounted) {
        this.setState({
          basicInfo: {
            ...this.state.basicInfo,
            updates: updatedEventList,
          },
        });
      }
    } catch (err) {
      if (this.isComponentMounted) {
        if (!isMApiError(err)) {
          throw err;
        }
        this.props.displayNotification(err.message, "error");
        this.setState({ loading: false });
      }
    }
  };

  /**
   * Save hops
   */
  saveHops = async () => {
    this.setState({
      loading: true,
      savingStatus: "IN_PROGRESS",
    });

    const hopsApi = MApi.getHopsApi();

    /**
     * Student id get from guider or logged in student
     */
    const studentId = this.props.studentId;

    try {
      Promise.all([
        (async () => {
          await hopsApi.saveStudentHops({
            studentIdentifier: studentId,
            saveStudentHopsRequest: {
              formData: JSON.stringify(this.state.hopsCompulsory),
              historyDetails: this.state.hopsUpdateDetails,
            },
          });
        })(),
      ]).then(async () => {
        if (this.isComponentMounted) {
          this.loadHopsData().then(() => {
            this.setState({
              loading: false,
              allHistoryEventsLoaded: false,
              hopsUpdateDetails: "",
              savingStatus: "SUCCESS",
            });
          });
        }
      });
    } catch (err) {
      if (this.isComponentMounted) {
        if (!isMApiError(err)) {
          throw err;
        }
        this.props.displayNotification(err.message, "error");
        this.setState({ loading: false, savingStatus: "FAILED" });
      }
    }
  };

  /**
   * Handles starting level change
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
   * Handles motivation and study change
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
   * Handles studies planning changes
   *
   * @param studyPeriodPlan studyPeriodPlan
   */
  handleStudyPeriodPlanChange = (studyPeriodPlan: HopsStudyPeriodPlan) => {
    this.setState({
      hopsCompulsory: {
        ...this.state.hopsCompulsory,
        studyPeriodPlan,
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
        if (this.isComponentMounted) {
          this.setState({ addHopsUpdateDetailsDialogOpen: false });
        }
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
   * Handles load more history events click
   */
  handleLoadMOreHistoryEventsClick = () => {
    this.loadMoreHistoryEvents();
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
  handleStepChange = (steps: object[]) => (step: number) => {
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { status, displayNotification, children, ...baseProps } = this.props;

    /**
     * Default steps
     */
    let steps = [
      {
        name: "Perustiedot",
        component: (
          <Step1
            {...baseProps}
            loading={this.state.loading}
            basicInformation={this.state.basicInfo}
            loggedUserId={status.userId}
            status={status}
            loadingHistoryEvents={this.state.loadingHistoryEvents}
            allHistoryEventLoaded={this.state.allHistoryEventsLoaded}
            superVisorModifies={this.props.superVisorModifies}
            onHistoryEventClick={this.handleEditHistoryEventClick}
            onLoadMOreHistoryEventsClick={this.loadMoreHistoryEvents}
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
        name: "Opiskelutaidot ja motivaatio",
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
            studentsUserEntityId={this.state.basicInfo.studentUserEntityId}
            studyTimeEnd={this.state.basicInfo.studyTimeEnd}
            followUp={this.state.hopsFollowUp}
            superVisorModifies={this.props.superVisorModifies}
            studyPeriodPlan={this.state.hopsCompulsory.studyPeriodPlan}
            onStudyPeriodPlanChange={this.handleStudyPeriodPlanChange}
          />
        ),
      },
      {
        name: "Tallennus",
        component: <Step6 {...baseProps} saveState={this.state.savingStatus} />,
      },
    ];

    /**
     * If Hops is disabled state. Then following steps are used.
     */
    if (baseProps.disabled) {
      steps = [
        {
          name: "Perustiedot",
          component: (
            <Step1
              {...baseProps}
              loading={this.state.loading}
              basicInformation={this.state.basicInfo}
              loggedUserId={status.userId}
              status={status}
              loadingHistoryEvents={this.state.loadingHistoryEvents}
              allHistoryEventLoaded={this.state.allHistoryEventsLoaded}
              superVisorModifies={this.props.superVisorModifies}
              onHistoryEventClick={this.handleEditHistoryEventClick}
              onLoadMOreHistoryEventsClick={this.loadMoreHistoryEvents}
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
          name: "Opiskelutaidot ja motivaatio",
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
              studentsUserEntityId={this.state.basicInfo.studentUserEntityId}
              studyTimeEnd={this.state.basicInfo.studyTimeEnd}
              followUp={this.state.hopsFollowUp}
              superVisorModifies={this.props.superVisorModifies}
              studyPeriodPlan={this.state.hopsCompulsory.studyPeriodPlan}
              onStudyPeriodPlanChange={this.handleStudyPeriodPlanChange}
            />
          ),
        },
      ];
    }

    return (
      <StudyProgressContextProvider
        user={this.props.user}
        useCase="hops-planning"
        studentId={this.props.studentId}
        studentUserEntityId={this.state.basicInfo.studentUserEntityId}
        dataToLoad={[
          "studentActivity",
          "studentChoices",
          "optionalSuggestions",
        ]}
      >
        <div className="wizard">
          <div className="wizard_container">
            {baseProps.disabled ? (
              <StepZilla
                steps={steps}
                dontValidate={false}
                preventEnterSubmission={true}
                showNavigation={!this.state.loading}
                showSteps={true}
                prevBtnOnLastStep={true}
                nextButtonCls="button button--wizard"
                backButtonCls="button button--wizard"
                nextButtonText="Seuraava"
                backButtonText="Edellinen"
              />
            ) : (
              <StepZilla
                steps={steps}
                dontValidate={false}
                preventEnterSubmission={true}
                showNavigation={!this.state.loading}
                showSteps={true}
                prevBtnOnLastStep={true}
                nextTextOnFinalActionStep="Tallenna"
                nextButtonCls="button button--wizard"
                backButtonCls="button button--wizard"
                nextButtonText="Seuraava"
                backButtonText="Edellinen"
                onStepChange={this.handleStepChange(steps)}
              />
            )}
          </div>
          <NewHopsEventDescriptionDialog
            content={
              <div className="hops-container__row">
                <div className="hops__form-element-container">
                  <Textarea
                    id="hopsUpdateDetailsExplanation"
                    label="Vapaa kuvaus tapahtuman muutoksista"
                    className="form-element__textarea form-element__textarea--resize__vertically"
                    onChange={this.handleHopsUpdateDetailsChange}
                    value={this.state.hopsUpdateDetails}
                  />
                </div>
              </div>
            }
            isOpen={this.state.addHopsUpdateDetailsDialogOpen}
            onSaveClick={this.handleSaveClick}
            onCancelClick={this.handleCancelClick}
          />
          <EditHopsEventDescriptionDialog
            content={
              <div className="hops-container__row">
                <div className="hops__form-element-container">
                  <Textarea
                    id="updateEventToBeEditedExplanation"
                    label="Muokkaa tapahtuman kuvausta"
                    className="form-element__textarea form-element__textarea--resize__vertically"
                    onChange={this.handleHopsEditingHistoryEventDetailsChange}
                    value={
                      this.state.updateEventToBeEdited &&
                      this.state.updateEventToBeEdited.details
                    }
                  />
                </div>
              </div>
            }
            isOpen={!!this.state.updateEventToBeEdited}
            onSaveClick={this.handleSaveUpdatedHistoryEventClick}
            onCancelClick={this.handleCancelUpdatingHistoryEventClick}
          />
        </div>
      </StudyProgressContextProvider>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
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
    previousWorkExperienceField: "",
    previousLanguageExperience: [
      {
        name: "suomi",
        hardCoded: true,
      },
      {
        name: "ruotsi",
        hardCoded: true,
      },
      {
        name: "englanti",
        hardCoded: true,
      },
    ],
  },
  motivationAndStudy: {
    wayToLearn: {
      byReadingMaterials: undefined,
      byTakingNotes: undefined,
      byDoingExercises: undefined,
      byMemorizing: undefined,
      byWatchingVideos: undefined,
      byListeningTeaching: undefined,
      byExplaining: undefined,
      byDiscussing: undefined,
      byWatchingOrDoingExamples: undefined,
      someOtherWay: "",
    },

    studySupport: {
      fromFamilyMember: false,
      fromFriend: false,
      fromSupportPerson: false,
      noSupport: false,
      somethingElse: false,
    },

    selfImageAsStudent: {
      likeStudying: undefined,
      haveGoals: undefined,
      readyToAchieveGoals: undefined,
      alwaysFinishJobs: undefined,
      bePedantic: undefined,
      studyingConcentration: undefined,
      affectedByNoise: undefined,
      canFollowInstructions: undefined,
      canEvaluateOwnWork: undefined,
      canTakeFeedback: undefined,
      canUseBasicComputerFunctionalities: undefined,
      somethingElse: "",
      wishesForTeachersAndSupervisors: "",
    },
  },
  studyPeriodPlan: {
    month1: "",
    month2: "",
    month3: "",
    month4: "",
    month5: "",
    month6: "",
  },
});
