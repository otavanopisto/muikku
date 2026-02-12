import * as React from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "~/reducers";
import { OptionDefault } from "~/components/general/react-select/types";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import { useTranslation } from "react-i18next";
import { Tab } from "~/components/general/tabs";
import ApplicationPanelBody from "~/components/general/application-panel/components/application-panel-body";
import Matriculation from "~/components/hops/body/application/matriculation/matriculation";
import Select from "react-select";
import { getName } from "~/util/modifiers";
import { initializeHops, resetHopsData } from "~/actions/main-function/hops/";
import { Action } from "redux";
import { HopsBasicInfoProvider } from "~/context/hops-basic-info-context";
import WebsocketWatcher from "~/components/hops/body/application/helper/websocket-watcher";
import StudyPlan from "~/components/hops/body/application/study-planing/study-plan";
import {
  loadCourseMatrix,
  loadUserStudyActivity,
  resetStudyActivityState,
} from "~/actions/study-activity";

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
interface GuardianHopsApplicationProps {}

/**
 * GuardianHopsApplication
 * @param props props
 * @returns GuardianHopsApplication
 */
const GuardianHopsApplication = (props: GuardianHopsApplicationProps) => {
  const { t } = useTranslation(["studies", "common", "hops_new"]);
  const { identifier } = useParams<{ identifier: string }>();
  const history = useHistory();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<GuardianHopsTab>("STUDYPLAN");

  const dependants = useSelector((state: StateType) => state.dependants);
  const studyActivity = useSelector((state: StateType) => state.studyActivity);
  const dispatch = useDispatch();

  // Get current dependant info
  const selectedDependant = dependants.list.find(
    (d) => d.identifier === identifier
  );

  // Redirect if no identifier
  useEffect(() => {
    if (!identifier && dependants.list.length > 0) {
      const firstHopsDependant = dependants.list[0];

      history.replace(`/guardian_hops/${firstHopsDependant.identifier}`);
    }
  }, [identifier, dependants.list, history]);

  // Initialize HOPS and load data when identifier changes
  useEffect(() => {
    if (identifier) {
      // Reset previous state
      dispatch(resetStudyActivityState());
      dispatch(resetHopsData());

      // Load essential data
      dispatch(loadCourseMatrix({ userIdentifier: identifier }) as Action);
      dispatch(loadUserStudyActivity({ userIdentifier: identifier }) as Action);

      // Initialize HOPS
      dispatch(
        initializeHops({
          userIdentifier: identifier,
        }) as Action
      );
    }
  }, [dispatch, identifier]);

  // Handle tab from hash
  useEffect(() => {
    const tab = location.hash.replace("#", "");
    switch (tab) {
      case "matriculation":
        setActiveTab("MATRICULATION");
        break;
      case "studyplan":
        setActiveTab("STUDYPLAN");
        break;
      default:
        setActiveTab("STUDYPLAN");
        break;
    }
  }, [location.hash]);

  // Navigation handlers
  const handleDependantSelectChange = useCallback(
    async (option: OptionDefault<string>) => {
      history.push(`/guardian_hops/${option.value}`);

      setActiveTab("STUDYPLAN");
    },
    [history]
  );

  const handleTabChange = useCallback(
    (id: GuardianHopsTab, hash?: string | Tab) => {
      if (hash && identifier) {
        const hashValue = typeof hash === "string" ? hash : hash.hash;
        history.replace(`/guardian_hops/${identifier}#${hashValue}`);
      }
      setActiveTab(id);
    },
    [identifier, history]
  );

  // Returns whether section with given hash should be visible or not
  const isVisible = useCallback(
    (tab: Tab) => {
      const selectUserStudyProgramme = selectedDependant?.studyProgrammeName;

      switch (tab.id) {
        case "MATRICULATION":
          return UPPERSECONDARY_PROGRAMMES.includes(
            selectUserStudyProgramme || ""
          );
        case "STUDYPLAN":
          return true;
        default:
          return false;
      }
    },
    [selectedDependant]
  );

  // Prepare dependants options
  const dependantsOptions = dependants.list
    ? dependants.list.map((d) => ({
        label: getName(d, true),
        value: d.identifier,
        ...d,
      }))
    : [];

  const selectedDependantOption = dependantsOptions.find(
    (dependant) => dependant.value === identifier
  );

  const dependantSelect =
    dependantsOptions.length > 1 ? (
      <Select
        className="react-select-override"
        classNamePrefix="react-select-override"
        onChange={handleDependantSelectChange}
        options={dependantsOptions}
        isOptionDisabled={(option) => option.value === identifier}
        value={selectedDependantOption}
        isSearchable={false}
      />
    ) : (
      <span>{selectedDependantOption?.label}</span>
    );

  // Prepare tabs
  let panelTabs: Tab[] = [
    {
      id: "STUDYPLAN",
      name: t("labels.hopsStudyPlanning", { ns: "hops_new" }),
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
      name: t("labels.hopsMatriculation", { ns: "hops_new" }),
      hash: "matriculation",
      type: "matriculation",
      component: (
        <ApplicationPanelBody modifier="tabs">
          <Matriculation />
        </ApplicationPanelBody>
      ),
    },
  ];

  // Filter tabs based on visibility
  panelTabs = panelTabs.filter(isVisible);

  return (
    <WebsocketWatcher studentIdentifier={selectedDependant?.identifier}>
      <HopsBasicInfoProvider
        useCase="GUARDIAN"
        studentInfo={{
          identifier: selectedDependant?.identifier || "",
          studyStartDate: selectedDependant?.studyStartDate || new Date(),
        }}
        curriculumConfig={studyActivity.curriculumConfig}
        userStudyActivity={studyActivity.userStudyActivity}
      >
        <ApplicationPanel
          title="HOPS"
          onTabChange={handleTabChange}
          activeTab={activeTab}
          panelTabs={panelTabs}
          panelOptions={dependantSelect}
        />
      </HopsBasicInfoProvider>
    </WebsocketWatcher>
  );
};

export default GuardianHopsApplication;
