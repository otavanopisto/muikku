import * as React from "react";
import { connect } from "react-redux";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import { StateType } from "~/reducers";
import ApplicationPanelBody from "../../general/application-panel/components/application-panel-body";
import { Tab } from "~/components/general/tabs";
import { AnyActionType } from "~/actions";
import "~/sass/elements/link.scss";
import "~/sass/elements/application-list.scss";
import "~/sass/elements/assignment.scss";
import "~/sass/elements/rich-text.scss";
import "~/sass/elements/application-list.scss";
import "~/sass/elements/journal.scss";
import "~/sass/elements/workspace-assessment.scss";
import { withTranslation, WithTranslation } from "react-i18next";
import Matriculation from "~/components/hops/body/application/matriculation/matriculation";
import { DependantsState } from "~/reducers/main-function/dependants";
import Select from "react-select";
import { getName } from "~/util/modifiers";
import { OptionDefault } from "~/components/general/react-select/types";
import {
  initializeHops,
  InitializeHopsTriggerType,
  resetHopsData,
  ResetHopsDataTriggerType,
} from "~/actions/main-function/hops/";
import { Action, bindActionCreators, Dispatch } from "redux";
import { HopsBasicInfoProvider } from "~/context/hops-basic-info-context";
import WebsocketWatcher from "~/components/hops/body/application/helper/websocket-watcher";
import StudyPlan from "~/components/hops/body/application/study-planing/study-plan";
import {
  LoadCourseMatrixTriggerType,
  loadCourseMatrix,
  LoadUserStudyActivityTriggerType,
  loadUserStudyActivity,
  ResetStudyActivityStateTriggerType,
  resetStudyActivityState,
} from "~/actions/study-activity";
import { StudyActivityState } from "~/reducers/study-activity";

const UPPERSECONDARY_PROGRAMMES = [
  "Nettilukio",
  "Aikuislukio",
  "Nettilukio/yksityisopiskelu (aineopintoina)",
  "Aineopiskelu/yo-tutkinto",
  "Aineopiskelu/lukio",
  "Aineopiskelu/lukio (oppivelvolliset)",
  "Aineopiskelu/valmistuneet",
  "Kahden tutkinnon opinnot",
];

/**
 * GuardianHopsTab. Restricted to only MATRICULATION tab and upcoming STUDYPLAN tab.
 */
type GuardianHopsTab = "MATRICULATION" | "STUDYPLAN";

/**
 * GuardianHopsApplicationProps
 */
interface GuardianHopsApplicationProps extends WithTranslation {
  dependants: DependantsState;
  studyActivity: StudyActivityState;
  initializeHops: InitializeHopsTriggerType;
  resetHopsData: ResetHopsDataTriggerType;
  loadCourseMatrix: LoadCourseMatrixTriggerType;
  loadUserStudyActivity: LoadUserStudyActivityTriggerType;
  resetStudyActivityState: ResetStudyActivityStateTriggerType;
}

/**
 * GuardianHopsApplicationState
 */
interface GuardianHopsApplicationState {
  activeTab: GuardianHopsTab;
  selectedDependantIdentifier: string;
}

/**
 * HopsApplication
 * @param props props
 */
class GuardianHopsApplication extends React.Component<
  GuardianHopsApplicationProps,
  GuardianHopsApplicationState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: GuardianHopsApplicationProps) {
    super(props);

    this.state = {
      activeTab: "STUDYPLAN",
      selectedDependantIdentifier: this.getCurrentDependantIdentifier(),
    };
  }

  /**
   * componentDidUpdate
   */
  async componentDidUpdate() {
    if (!window.location.hash && this.props.dependants.state === "READY") {
      // Dependants are loaded, but there's none selected, we pick the first one
      // that has an upper secondary programme
      const selectedDependantIdentifier = this.props.dependants.list.find(
        (dependant) =>
          UPPERSECONDARY_PROGRAMMES.includes(dependant.studyProgrammeName)
      )?.identifier;
      window.location.hash = selectedDependantIdentifier;

      this.setState({
        selectedDependantIdentifier,
      });
    }
  }

  /**
   * componentDidMount
   */
  async componentDidMount() {
    const tab = window.location.hash.replace("#", "").split("/")?.[1];

    /**
     * If page is refreshed, we need to check hash which
     * tab was opened and set that at the start to state as
     * opened tab again
     */
    switch (tab) {
      case "matriculation":
        this.setState({
          activeTab: "MATRICULATION",
        });
        break;

      case "studyplan":
        this.setState({
          activeTab: "STUDYPLAN",
        });
        break;

      default:
        this.setState({
          activeTab: "STUDYPLAN",
        });

        break;
    }
  }

  /**
   * getCurrentDependantIdentifier
   * @returns a string identifier from hash
   */
  getCurrentDependantIdentifier = () =>
    window.location.hash.replace("#", "").split("/")[0];

  /**
   * Returns whether section with given hash should be visible or not
   *
   * @param tab tab
   * @returns whether section with given hash should be visible or not
   */
  isVisible = (tab: Tab) => {
    const currentDependantIdentifier = this.getCurrentDependantIdentifier();
    const selectUserStudyProgramme = this.props.dependants.list.find(
      (dependant) => dependant.identifier === currentDependantIdentifier
    )?.studyProgrammeName;

    switch (tab.id) {
      case "MATRICULATION":
        return UPPERSECONDARY_PROGRAMMES.includes(selectUserStudyProgramme);

      case "STUDYPLAN":
        return true;

      default:
        return false;
    }
  };

  /**
   * handleTabChange
   * @param id id
   * @param hash hash
   */
  handleTabChange = (id: GuardianHopsTab, hash?: string | Tab) => {
    if (hash) {
      const user = window.location.hash.replace("#", "").split("/")[0];
      if (typeof hash === "string" || hash instanceof String) {
        window.location.hash = (user + "/" + hash) as string;
      } else if (typeof hash === "object" && hash !== null) {
        window.location.hash = user + "/" + hash.hash;
      }
    }

    this.setState({
      activeTab: id,
    });
  };

  /**
   * Handles change of dependant. Resets data and loads new data for HOPS form and history by default.
   * @param option selectedOptions
   */
  handleDependantSelectChange = async (option: OptionDefault<string>) => {
    window.location.hash = option.value;

    // Resetting data and initializing HOPS with new user identifier
    this.props.resetStudyActivityState();
    this.props.resetHopsData();
    this.props.initializeHops({ userIdentifier: option.value });
    this.props.loadCourseMatrix({ userIdentifier: option.value });
    this.props.loadUserStudyActivity({ userIdentifier: option.value });

    this.setState({
      activeTab: "STUDYPLAN",
      selectedDependantIdentifier: option.value,
    });
  };

  /**
   * Render method
   * @returns JSX.Element
   */
  render() {
    const dependants = this.props.dependants
      ? this.props.dependants.list.map((d) => ({
          label: getName(d, true),
          value: d.identifier,
          ...d,
        }))
      : [];

    const selectedDependant = dependants.find(
      (dependant) => dependant.value === this.state.selectedDependantIdentifier
    );

    const dependantSelect =
      dependants.length > 1 ? (
        <Select
          className="react-select-override"
          classNamePrefix="react-select-override"
          onChange={this.handleDependantSelectChange}
          options={dependants}
          isOptionDisabled={(option) =>
            option.value === this.state.selectedDependantIdentifier
          }
          value={selectedDependant}
          isSearchable={false}
        />
      ) : (
        <span>{selectedDependant?.label}</span>
      );

    let panelTabs: Tab[] = [
      {
        id: "STUDYPLAN",
        name: this.props.t("labels.hopsStudyPlanning", { ns: "hops_new" }),
        hash: "studyplan",
        type: "studyplan",
        component: (
          <ApplicationPanelBody modifier="tabs">
            <StudyPlan />
          </ApplicationPanelBody>
        ),
      },
      {
        id: "MATRICULATION",
        name: this.props.t("labels.hopsMatriculation", { ns: "hops_new" }),
        hash: "matriculation",
        type: "matriculation",
        component: (
          <ApplicationPanelBody modifier="tabs">
            <Matriculation />
          </ApplicationPanelBody>
        ),
      },
    ];

    panelTabs = panelTabs.filter(this.isVisible);

    return (
      <WebsocketWatcher studentIdentifier={selectedDependant?.identifier}>
        <HopsBasicInfoProvider
          useCase="GUARDIAN"
          studentInfo={{
            identifier: selectedDependant?.identifier || "",
            studyStartDate: selectedDependant?.studyStartDate || new Date(),
          }}
          curriculumConfig={this.props.studyActivity.curriculumConfig}
          userStudyActivity={this.props.studyActivity.userStudyActivity}
        >
          <ApplicationPanel
            title="HOPS"
            onTabChange={this.handleTabChange}
            activeTab={this.state.activeTab}
            panelTabs={panelTabs}
            panelOptions={dependantSelect}
          />
        </HopsBasicInfoProvider>
      </WebsocketWatcher>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    dependants: state.dependants,
    studyActivity: state.studyActivity,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    {
      initializeHops,
      resetHopsData,
      loadCourseMatrix,
      loadUserStudyActivity,
      resetStudyActivityState,
    },
    dispatch
  );
}

export default withTranslation(["studies", "common", "hops_new"])(
  connect(mapStateToProps, mapDispatchToProps)(GuardianHopsApplication)
);
