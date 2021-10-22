import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { HOPSDataType } from "~/reducers/main-function/hops";
import { StateType } from "~/reducers";
const StepZilla = require("react-stepzilla").default;

import "~/sass/elements/wizard.scss";
import { Step1, Step2, Step3, Step5 } from "./steps";
import {
  GuiderType,
  GuiderStudentType,
} from "../../../../../../reducers/main-function/guider/index";
import promisify from "../../../../../../util/promisify";
import mApi from "~/lib/mApi";
import { BasicInformation, HopsUpdates } from "../../../../../../@types/shared";
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
  guider: GuiderType;
}

/**
 * CompulsoryEducationHopsWizardState
 */
interface CompulsoryEducationHopsWizardState {
  basicInfo: BasicInformation;
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
          graduationGoal: "",
          scaleSize: 5,
          scaleName: "0-5",
        },
        studiesPlanning: {
          usedHoursPerWeek: 0,
          graduationGoal: "",
          ethics: false,
          finnishAsSecondLanguage: false,
          selectedListOfIds: [],
        },
      },
    };
  }

  /**
   * componentDidMount
   */
  componentDidMount = async () => {
    const { testData } = this.props;

    this.setState({
      loading: true,
    });

    const studentId =
      this.props.user === "supervisor"
        ? this.props.guider.currentStudent.basic.id
        : (window as any).MUIKKU_LOGGED_USER;

    const studentHopsHistory = (await promisify(
      mApi().hops.student.history.read(studentId),
      "callback"
    )()) as HopsUpdates[];

    const studentBasicInfo = (await promisify(
      mApi().guider.students.read(studentId),
      "callback"
    )()) as GuiderStudentType;

    const hops = (await promisify(
      mApi().hops.student.read(studentId),
      "callback"
    )()) as HopsCompulsory;

    console.log("Tiedot :::>", [hops, studentHopsHistory, studentBasicInfo]);

    const loadedHops =
      hops !== undefined
        ? hops
        : {
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
              someOtherWay: undefined,
              byMemorizing: 0,
              byTakingNotes: 0,
              byDrawing: 0,
              byListeningTeacher: 0,
              byWatchingVideos: 0,
              byFollowingOthers: 0,
              someOtherMethod: undefined,
              noSupport: 0,
              family: 0,
              friend: 0,
              supportPerson: 0,
              teacher: 0,
              somethingElse: undefined,
              graduationGoal: "",
              scaleSize: 5,
              scaleName: "0-5",
            },
            studiesPlanning: {
              usedHoursPerWeek: 0,
              graduationGoal: "",
              ethics: false,
              finnishAsSecondLanguage: false,
              selectedListOfIds: [],
            },
          };

    this.setState({
      loading: false,
      basicInfo: {
        name: `${studentBasicInfo.firstName} ${studentBasicInfo.lastName}`,
        guider: "???Joku ohjaaja???",
        updates: studentHopsHistory,
      },
      hopsCompulsory: loadedHops,
    });
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
    /* this.setState({
      hopsCompulsory: {
        ...this.state.hopsCompulsory,
        studiesPlanning: {
          ...this.state.hopsCompulsory.studiesPlanning,
          supervisorSugestedSubjectListOfIds: [],
        },
      },
    }); */
  };

  /**
   * handleDeleteSuggestedNextSelections
   */
  handleDeleteSuggestedNextSelections = () => {
    /* this.setState({
      hopsCompulsory: {
        ...this.state.hopsCompulsory,
        studiesPlanning: {
          ...this.state.hopsCompulsory.studiesPlanning,
          supervisorSuggestedNextListOfIds: [],
        },
      },
    }); */
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
            studentId={this.props.guider.currentStudent.basic.id}
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
