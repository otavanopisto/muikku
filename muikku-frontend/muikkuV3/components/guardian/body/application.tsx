import * as React from "react";
import { useParams, useHistory, useLocation } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "~/reducers";
import { loadStudentPedagogyFormAccess } from "~/actions/main-function/guider";
import { clearDependantState } from "~/actions/main-function/dependants";
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
  setLocationToInfoInTranscriptOfRecords,
  setLocationToPedagogyFormInTranscriptOfRecords,
  setLocationToStatisticsInTranscriptOfRecords,
  setLocationToSummaryInTranscriptOfRecords,
  updateAllStudentUsersAndSetViewToRecords,
} from "~/actions/main-function/records";
import { loadContactGroup } from "~/actions/base/contacts";
import { Action } from "redux";
import { updateStatistics } from "~/actions/main-function/records/statistics";
import { updateSummary } from "~/actions/main-function/records/summary";
import {
  loadCourseMatrix,
  loadUserStudyActivity,
} from "~/actions/study-activity";

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
  const [loading, setLoading] = useState(false);

  const dependants = useSelector((state: StateType) => state.dependants);
  const guider = useSelector((state: StateType) => state.guider);
  const dispatch = useDispatch();

  // Get current dependant info
  const selectedDependant = dependants.list.find(
    (d) => d.identifier === identifier
  );

  // Redirect if no identifier
  useEffect(() => {
    if (!identifier && dependants.list.length > 0) {
      const firstDependant = dependants.list[0];
      history.replace(`/guardian/${firstDependant.identifier}`);
    }
  }, [identifier, dependants.list, history]);

  // Load data when identifier changes
  useEffect(() => {
    if (identifier) {
      dispatch(loadStudentPedagogyFormAccess(identifier));
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

      // IMPORTANT
      // These two thunk calls are here only for reason, that guardian view has shared reducer logic
      // with student view, which will have its own complications currently.
      dispatch(
        loadUserStudyActivity({
          userIdentifier: identifier,
        }) as Action
      );

      dispatch(
        loadCourseMatrix({
          userIdentifier: identifier,
        }) as Action
      );

      if (givenLocation === "summary" || !givenLocation) {
        dispatch(setLocationToSummaryInTranscriptOfRecords() as Action);
        // Summary needs counselors
        dispatch(loadContactGroup("counselors", identifier) as Action);
        dispatch(updateSummary(identifier) as Action);
      } else if (givenLocation === "records") {
        dispatch(
          updateAllStudentUsersAndSetViewToRecords(identifier) as Action
        );
      } else if (givenLocation === "pedagogy-form") {
        dispatch(setLocationToPedagogyFormInTranscriptOfRecords() as Action);
      } else if (givenLocation === "statistics") {
        dispatch(setLocationToStatisticsInTranscriptOfRecords() as Action);
        dispatch(updateStatistics() as Action);
      } else if (givenLocation === "info") {
        dispatch(setLocationToInfoInTranscriptOfRecords() as Action);
        dispatch(updateSummary(identifier) as Action);
      }
    }
  }, [location.hash, dispatch, identifier]);

  // Handle pedagogy form loading
  useEffect(() => {
    if (identifier && selectedDependant?.userEntityId && !loading) {
      setLoading(true);
      dispatch(
        loadStudentPedagogyFormAccess(identifier, undefined, () => {
          setLoading(false);
        })
      );
    }
  }, [dispatch, identifier, selectedDependant, loading]);

  // Navigation handlers
  const handleDependantSelectChange = useCallback(
    async (option: OptionDefault<string>) => {
      history.push(`/guardian/${option.value}`);
      dispatch(clearDependantState());
      dispatch(resetPedagogySupport());

      if (option.value) {
        dispatch(loadStudentPedagogyFormAccess(option.value, true));
      }
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
      dependants.list.find((d) => d.identifier === dependantId)
        ?.studyProgrammeName,
    [dependants.list]
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
            pedagogyFormAccess={guider.currentStudent.pedagogyFormAvailable}
          />
        </ApplicationPanelBody>
      ),
    });
  }

  // ... rest of render logic

  const title = t("labels.dependant", {
    count: dependants.list.length,
  });

  const dependantsOptions = dependants.list
    ? dependants.list.map((student) => ({
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
