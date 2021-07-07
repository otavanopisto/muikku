import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { HOPSDataType } from "~/reducers/main-function/hops";
import { StateType } from "~/reducers";
const StepZilla = require("react-stepzilla").default;

import "~/sass/elements/wizard.scss";
import { Step1, Step2, Step3, Step4 } from "./steps";
import {
  HopsCompulsory,
  BasicInformation,
  Education,
} from "../../../../../../@types/shared";
import StartingLevel from "./steps/starting-level";
import { HopsStudies } from "../../../../../../@types/shared";
import { mockSchoolSubjects } from "../../../../../../mock/mock-data";
import {
  HopsStudentStartingLevel,
  HopsMotivationAndStudy,
} from "../../../../../../@types/shared";

interface CompulsoryEducationHopsWizardProps {
  data?: HOPSDataType;
  defaultData: HOPSDataType;
  onHopsChange?: (hops: HOPSDataType) => any;
  i18n: i18nType;
}

interface CompulsoryEducationHopsWizardState {
  hopsCompulsory: HopsCompulsory;
}

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
        studies: {
          usedHoursPerWeek: 0,
          ethics: false,
          finnishAsSecondLanguage: false,
          selectedSubjects: [...mockSchoolSubjects],
        },
      },
    };
  }

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
   * handleStudiesCHange
   * @param studies
   */
  handleStudiesCHange = (studies: HopsStudies) => {
    this.setState({
      hopsCompulsory: {
        ...this.state.hopsCompulsory,
        studies,
      },
    });
  };

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    let data = this.props.data || this.props.defaultData;
    if (!data || !data.optedIn) {
      return null;
    }

    const steps = [
      {
        name: "Perustiedot",
        component: <Step1 />,
      },
      {
        name: "Osaamisen ja lähtötason arvointi",
        component: (
          <Step2
            studentStartingLevel={this.state.hopsCompulsory.startingLevel}
            onStartingLevelChange={this.handleStartingLevelChange}
          />
        ),
      },
      {
        name: "Opiskelutaidot ja tavoitteet",
        component: (
          <Step3
            motivationAndStudy={this.state.hopsCompulsory.motivationAndStudy}
            onMotivationAndStudyChange={this.handleMotivationAndStudyChange}
          />
        ),
      },
      {
        name: "Opinnot",
        component: (
          <Step4
            studies={this.state.hopsCompulsory.studies}
            onStudiesChange={this.handleStudiesCHange}
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
    defaultData: state.hops && state.hops.value,
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
