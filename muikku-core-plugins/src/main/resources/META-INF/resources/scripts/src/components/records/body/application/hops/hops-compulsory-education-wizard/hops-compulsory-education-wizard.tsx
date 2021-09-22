import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { HOPSDataType } from "~/reducers/main-function/hops";
import { StateType } from "~/reducers";
const StepZilla = require("react-stepzilla").default;

import "~/sass/elements/wizard.scss";
import { Step1, Step2, Step3, Step4, Step5 } from "./steps";
import {
  HopsCompulsory,
  Education,
  HopsPlanningStudies,
} from "../../../../../../@types/shared";
import {
  hopsMock1,
  hopsMock2,
  hopsMock3,
  hopsMock4,
  mockSchoolSubjects,
} from "../../../../../../mock/mock-data";
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
}

/**
 * CompulsoryEducationHopsWizardState
 */
interface CompulsoryEducationHopsWizardState {
  hopsCompulsory: HopsCompulsory;
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
      hopsCompulsory: {
        basicInfo: {
          name: "",
          guider: "",
        },
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
          byReading: false,
          byListening: false,
          byDoing: false,
          someOtherWay: "",
          byMemorizing: false,
          byTakingNotes: false,
          byDrawing: false,
          byListeningTeacher: false,
          byWatchingVideos: false,
          byFollowingOthers: false,
          someOtherMethod: "",
          noSupport: false,
          family: false,
          friend: false,
          supportPerson: false,
          teacher: false,
          somethingElse: "",
          graduationGoal: "",
          followUpGoal: "",
        },
        studiesPlanning: {
          usedHoursPerWeek: 0,
          selectedSubjects: [...mockSchoolSubjects],
          graduationGoal: "",
          followUpGoal: "",
          ethics: false,
          finnishAsSecondLanguage: false,
          selectedListOfIds: [],
          supervisorSugestedSubjectListOfIds: [6, 40, 51, 59, 64],
          supervisorSuggestedNextListOfIds: [],
        },
        studiesCourseData: {
          approvedSubjectListOfIds: [
            1, 2, 13, 21, 22, 32, 33, 45, 48, 53, 54, 57, 61, 62,
          ],
          completedSubjectListOfIds: [
            3, 4, 14, 23, 24, 34, 35, 36, 41, 46, 47, 50, 58, 63,
          ],
          inprogressSubjectListOfIds: [5, 15, 37, 42, 46],
        },
      },
    };
  }

  /**
   * componentDidMount
   */
  componentDidMount = () => {
    const { testData } = this.props;

    this.setState({
      loading: true,
    });

    /**
     * Mocks data loading!
     */
    setTimeout(() => {
      switch (testData) {
        case 1:
          this.setState({
            hopsCompulsory: hopsMock1,
          });
          break;

        case 2:
          this.setState({
            hopsCompulsory: hopsMock2,
          });
          break;

        case 3:
          this.setState({
            hopsCompulsory: hopsMock3,
          });
          break;

        case 4:
          this.setState({
            hopsCompulsory: hopsMock4,
          });
          break;

        default:
          break;
      }

      this.setState({ loading: false });
    }, 1500);
  };

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
   * handleDeleteCourseSelections
   */
  handleDeleteCourseSelections = () => {
    this.setState({
      hopsCompulsory: {
        ...this.state.hopsCompulsory,
        studiesPlanning: {
          ...this.state.hopsCompulsory.studiesPlanning,
          selectedListOfIds: [],
        },
      },
    });
  };

  /**
   * handleDeleteSuperVisorSelections
   */
  handleDeleteSuperVisorSelections = () => {
    this.setState({
      hopsCompulsory: {
        ...this.state.hopsCompulsory,
        studiesPlanning: {
          ...this.state.hopsCompulsory.studiesPlanning,
          supervisorSugestedSubjectListOfIds: [],
        },
      },
    });
  };

  /**
   * handleDeleteSuggestedNextSelections
   */
  handleDeleteSuggestedNextSelections = () => {
    this.setState({
      hopsCompulsory: {
        ...this.state.hopsCompulsory,
        studiesPlanning: {
          ...this.state.hopsCompulsory.studiesPlanning,
          supervisorSuggestedNextListOfIds: [],
        },
      },
    });
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
            basicInformation={this.state.hopsCompulsory.basicInfo}
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
            studies={{
              ...this.state.hopsCompulsory.studiesPlanning,
            }}
            ethics={this.state.hopsCompulsory.studiesPlanning.ethics}
            finnishAsSecondLanguage={
              this.state.hopsCompulsory.studiesPlanning.finnishAsSecondLanguage
            }
            onStudiesPlanningChange={this.handleStudiesPlanningChange}
            onDeleteSelection={
              this.props.user === "supervisor"
                ? this.handleDeleteSuperVisorSelections
                : this.handleDeleteCourseSelections
            }
            onDeleteNextSelection={this.handleDeleteSuggestedNextSelections}
            {...this.state.hopsCompulsory.studiesCourseData}
          />
        ),
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
            nextTextOnFinalActionStep="Jatka"
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
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
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
