import * as React from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "~/reducers";
import { resetPedagogySupport } from "~/actions/main-function/pedagogy-support";
import { OptionDefault } from "~/components/general/react-select/types";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import { useTranslation } from "react-i18next";
import { Tab } from "~/components/general/tabs";
import ApplicationPanelBody from "~/components/general/application-panel/components/application-panel-body";
import Summary from "./application/summary";
import Records from "./application/records";
import PedagogySupport from "~/components/pedagogy-support";
import Select from "react-select";
import { getName } from "~/util/modifiers";
import { PedagogySupportPermissions } from "~/components/pedagogy-support/helpers";
import {
  loadCurrentDependantActivityGraphData,
  loadCurrentDependantContactGroups,
  loadCurrentDependantCourseMatrix,
  loadCurrentDependantPedagogyFormAccess,
  loadCurrentDependantStudentInfo,
  loadCurrentDependantStudyActivity,
  resetCurrentDependantState,
} from "~/actions/main-function/guardian";

/**
 * StudiesTab
 */
type StudiesTab =
  | "RECORDS"
  | "CURRENT_RECORD"
  | "SUMMARY"
  | "STUDY_INFO"
  | "PEDAGOGY_FORM";

/**
 * DependantApplicationProps
 */
interface DependantApplicationProps {}

/**
 * DependantApplication
 * @param props props
 * @returns DependantApplication
 */
const DependantApplication = (props: DependantApplicationProps) => {
  const { t } = useTranslation(["common", "studies"]);
  const { identifier } = useParams<{ identifier: string }>();
  const history = useHistory();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState<StudiesTab>("SUMMARY");

  const dependants = useSelector(
    (state: StateType) => state.guardian.dependants
  );
  const currentDependant = useSelector(
    (state: StateType) => state.guardian.currentDependant
  );
  const dispatch = useDispatch();

  // Redirect if no identifier
  useEffect(() => {
    if (!identifier && dependants.length > 0) {
      const firstDependant = dependants[0];
      history.replace(`/guardian/${firstDependant.identifier}`);
    }
  }, [identifier, dependants, history]);

  // Load data when identifier changes
  useEffect(() => {
    if (identifier) {
      // Reset current dependant state
      dispatch(resetCurrentDependantState());
      // Load current dependant course matrix
      dispatch(loadCurrentDependantCourseMatrix(identifier));
      dispatch(loadCurrentDependantStudyActivity(identifier));
      dispatch(loadCurrentDependantPedagogyFormAccess(identifier));
    }
  }, [dispatch, identifier]);

  // Handle tab from hash
  useEffect(() => {
    const tab = location.hash.replace("#", "");
    switch (tab) {
      case "summary":
        setActiveTab("SUMMARY");
        break;
      case "records":
        setActiveTab("RECORDS");
        break;
      case "pedagogy-form":
        setActiveTab("PEDAGOGY_FORM");
        break;
      default:
        setActiveTab("SUMMARY");
        break;
    }

    if (identifier) {
      const givenLocation = tab;

      if (givenLocation === "summary" || !givenLocation) {
        // Summary needs counselors and student info
        dispatch(loadCurrentDependantContactGroups("counselors", identifier));
        dispatch(loadCurrentDependantStudentInfo(identifier));
        dispatch(loadCurrentDependantActivityGraphData(identifier));
      }
    }
  }, [location.hash, dispatch, identifier]);

  // Navigation handlers
  const handleDependantSelectChange = useCallback(
    async (option: OptionDefault<string>) => {
      history.push(`/guardian/${option.value}`);
      dispatch(resetPedagogySupport());
      setActiveTab("SUMMARY");
    },
    [dispatch, history]
  );

  const onTabChange = useCallback(
    (id: StudiesTab, hash?: string | Tab) => {
      if (hash && identifier) {
        const hashValue = typeof hash === "string" ? hash : hash.hash;
        history.replace(`/guardian/${identifier}#${hashValue}`);
      }
      setActiveTab(id);
    },
    [identifier, history]
  );

  // Helper functions
  const getDependantStudyProgramme = useCallback(
    (dependantId: string) =>
      dependants.find((d) => d.identifier === dependantId)?.studyProgrammeName,
    [dependants]
  );

  const pedagogySupportPermissions = new PedagogySupportPermissions(
    getDependantStudyProgramme(identifier)
  );

  const panelTabs: Tab[] = [
    {
      id: "SUMMARY",
      name: t("labels.summary", { ns: "studies" }),
      hash: "summary",
      type: "summary",
      component: (
        <ApplicationPanelBody modifier="tabs">
          <Summary />
        </ApplicationPanelBody>
      ),
    },
    {
      id: "RECORDS",
      name: t("labels.records", { ns: "studies" }),
      hash: "records",
      type: "records",
      component: (
        <ApplicationPanelBody modifier="tabs">
          <Records />
        </ApplicationPanelBody>
      ),
    },
  ];

  if (pedagogySupportPermissions.hasAnyAccess()) {
    panelTabs.push({
      id: "PEDAGOGY_FORM",
      name: t("labels.pedagogySupport", { ns: "pedagogySupportPlan" }),
      hash: "pedagogy-form",
      type: "pedagogy-form",
      component: (
        <ApplicationPanelBody modifier="tabs">
          <PedagogySupport
            userRole="STUDENT_PARENT"
            studentIdentifier={identifier}
            pedagogySupportStudentPermissions={pedagogySupportPermissions}
            pedagogyFormAccess={currentDependant.dependantPedagogyFormAccess}
          />
        </ApplicationPanelBody>
      ),
    });
  }

  const title = t("labels.dependant", {
    count: dependants.length,
  });

  const dependantsOptions = dependants
    ? dependants.map((student) => ({
        label: getName(student, true),
        value: student.identifier,
      }))
    : ([] as OptionDefault<string>[]);

  const selectedDependantOption = dependantsOptions.find(
    (option) => option.value === identifier
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
      ></Select>
    ) : (
      <span>{selectedDependantOption?.label}</span>
    );

  return (
    <>
      <ApplicationPanel
        title={title}
        panelOptions={dependantSelect}
        onTabChange={onTabChange}
        activeTab={activeTab}
        panelTabs={panelTabs}
      />
    </>
  );
};

export default DependantApplication;
