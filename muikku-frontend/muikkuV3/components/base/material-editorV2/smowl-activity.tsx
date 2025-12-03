import * as React from "react";
import { useSmowlActivity } from "./hooks/useSmowlActivity";
import { useSelector } from "react-redux";
import { StateType } from "~/reducers";
import Button from "~/components/general/button";
import "~/sass/elements/smowl.scss";
import { useSmowlAlarms } from "./hooks/useSmowlAlarms";
import AnimateHeight from "react-animate-height";
import {
  ComputerMonitoringAllowedActions,
  ComputerMonitoringAllowedPrograms,
  FrontCameraAlarms,
} from "~/api_smowl/types";

/**
 * Get the label for a front camera alarm
 * @param alarmKey - The key of the alarm
 * @returns The label for the alarm
 */
const getFrontCameraAlarmLabel = (alarmKey: FrontCameraAlarms): string => {
  const labelMap: Record<FrontCameraAlarms, string> = {
    INCORRECT_USER: "Incorrect user",
    MORE_THAN_ONE: "More than one person",
    NOBODY: "Nobody in front of the camera",
    WEBCAM_COVERED: "Webcam covered",
    OTHER_TAB: "Other tab",
    WRONG_LIGHT_POSING: "Wrong light/posing",
    BANNED_ELEMENTS: "Banned elements",
    SUSPICIOUS_BEHAVIOUR: "Suspicious behaviour",
    MIN_IMAGES_REQUIRED: "Not even one correct image",
    WEBCAM_REJECTED: "Webcam rejected",
    CONFIGURATION_PROBLEM: "Configuration problem",
    NO_WEBCAM: "No webcam",
    WEBCAM_BLOCKED: "Webcam blocked",
    UNSUPPORTED_BROWSER: "Unsupported browser",
  };
  return labelMap[alarmKey] || alarmKey;
};

/**
 * Get the label for a computer monitoring allowed action
 * @param alarmKey - The key of the action
 * @returns The label for the action
 */
const getComputerMonitoringActionLabel = (
  alarmKey: ComputerMonitoringAllowedActions
): string => {
  const labelMap: Record<ComputerMonitoringAllowedActions, string> = {
    WEB_NAVIGATION: "Web navigation",
    VIRTUAL_MACHINE: "Virtual machine",
    VIRTUAL_WEBCAM: "Virtual webcam",
    MULTIPLE_SCREENS: "Multiple screens",
    COMMANDS: "Commands",
    BACKGROUND_PROGRAMS: "Background programs",
    EARLY_CLOSE: "Early close",
  };
  return labelMap[alarmKey] || alarmKey;
};

/**
 * Get the label for a computer monitoring allowed program
 * @param alarmKey - The key of the program
 * @returns The label for the program
 */
const getComputerMonitoringProgramLabel = (
  alarmKey: ComputerMonitoringAllowedPrograms
): string => {
  const labelMap: Record<ComputerMonitoringAllowedPrograms, string> = {
    TEXT_EDITOR: "Text editor",
    PDF_READER: "PDF reader",
    SPREADSHEET: "Spreadsheet",
    MAIL: "Mail",
    COMMUNICATION: "Communication",
    VIRTUAL_WEBCAM: "Virtual webcam",
    FILE_SYSTEM: "File system",
    MEDIA_PLAYER: "Media player",
    SLIDE_VIEWER: "Slide viewer",
    SCREENSHOTER: "Screenshoter",
    REMOTE_CONTROL: "Remote control",
    PENTESTING: "Pentesting",
    CODE_EDITOR: "Code editor",
    VIRTUAL_MACHINES: "Virtual machines",
    DATABASE: "Database",
    OPEN_SOURCE_OFFICE_SUITE: "Open source office suite",
  };
  return labelMap[alarmKey] || alarmKey;
};

/**
 * Smowl activity props
 */
interface SmowlActivityProps {}

/**
 * Smowl activity component
 * @param props - Smowl activity props
 */
const SmowlActivity = (props: SmowlActivityProps) => {
  const editorState = useSelector(
    (state: StateType) => state.workspaces.materialEditor
  );
  const currentWorkspace = useSelector(
    (state: StateType) => state.workspaces.currentWorkspace
  );
  const { currentNodeValue } = editorState;

  // Smowl activity hook
  const {
    activity,
    createExamActivity,
    toggleActivityEnabled,
    toggleComputerMonitoring,
    toggleTestExamMode,
  } = useSmowlActivity({
    activityId: `${currentNodeValue?.workspaceMaterialId}`,
    activityType: "exam",
  });

  const { activity: activityConfig, loading, noDataAvailable } = activity;

  // Smowl alarms hook
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const {
    // Front Camera Service alarms
    frontCameraAlarms,
    frontCameraAlarmsChanged,
    toggleFrontCameraAlarm,
    isFrontCameraAlarmAllowed,
    saveFrontCameraAlarms,
    cancelFrontCameraAlarms,

    // Computer Monitoring Service alarms
    computerMonitoringAlarms,
    computerMonitoringAlarmsChanged,
    toggleComputerMonitoringAlarm,
    isComputerMonitoringAlarmAllowed,
    saveComputerMonitoringAlarms,
    cancelComputerMonitoringAlarms,
  } = useSmowlAlarms({
    activityId: `${currentNodeValue?.workspaceMaterialId}`,
    activityType: "exam",
  });

  // State for expanded options
  const [expandedOptions, setExpandedOptions] = React.useState<{
    [key: string]: boolean;
  }>({});

  /**
   * Toggles the expanded state of an option
   * @param optionId - The ID of the option to toggle
   */
  const toggleOptionExpanded = (optionId: string) => {
    setExpandedOptions((prev) => ({
      ...prev,
      [optionId]: !prev[optionId],
    }));
  };

  /**
   * Renders the content of the smowl activity
   * @returns The content of the smowl activity
   */
  const renderContent = () => {
    if (loading) {
      return (
        <div className="smowl-activity">
          <div className="loader-empty" />
        </div>
      );
    }
    if (noDataAvailable) {
      return (
        <div className="smowl-activity">
          <div className="smowl-activity_basic-info">
            <p className="smowl-activity_basic-info_description">
              No data available for the submitted activity Type and Id. Please
              create a new activity.
            </p>
            <Button
              buttonModifiers="primary"
              onClick={() =>
                createExamActivity({
                  activityType: "exam",
                  activityId: `${currentNodeValue.workspaceMaterialId}`,
                  displayName: currentNodeValue.title,
                  courseId: `${currentWorkspace.id}`,
                  numberUsers: `999`,
                  startDate: new Date(),
                  endDate: new Date(new Date().getDay() + 7),
                })
              }
            >
              Create exam activity
            </Button>
          </div>
        </div>
      );
    }

    return (
      <div className="smowl-activity">
        <div className="smowl-activity__card">
          <div className="smowl-activity_basic-info">
            <h2 className="smowl-activity__title">
              Activity: {activityConfig?.displayName}
            </h2>
            <div className="smowl-activity__option">
              <span className="smowl-activity__icon icon-cogs"></span>
              <label
                htmlFor="smowl-activity-enabled"
                className="smowl-activity__label"
              >
                Proktorointi käytössä
              </label>
              <button
                type="button"
                id="smowl-activity-enabled"
                className={`button-pill button-pill--switch-horizontal ${
                  activityConfig?.enabled
                    ? "button-pill--switch-horizontal-active"
                    : ""
                }`}
                onClick={() => toggleActivityEnabled()}
              />
            </div>
          </div>
          <div
            className={`smowl-activity_monitoring-services ${
              !activityConfig?.enabled
                ? "smowl-activity_monitoring-services--disabled"
                : ""
            }`}
          >
            <div className="smowl-activity__option-container">
              <div className="smowl-activity__option">
                <span className="smowl-activity__icon icon-exams"></span>
                <label
                  htmlFor="computer-monitoring-enabled"
                  className="smowl-activity__label"
                >
                  Front Camera käytössä
                </label>
                <button
                  type="button"
                  id="computer-monitoring-enabled"
                  className={`button-pill button-pill--switch-horizontal ${
                    activityConfig?.FrontCamera
                      ? "button-pill--switch-horizontal-active"
                      : ""
                  }`}
                  disabled={!activityConfig?.enabled}
                />
                <button
                  type="button"
                  className={`smowl-activity__expand-button ${
                    expandedOptions["front-camera"]
                      ? "icon-arrow-down"
                      : "icon-arrow-right"
                  }`}
                  onClick={() => toggleOptionExpanded("front-camera")}
                  aria-expanded={expandedOptions["front-camera"]}
                />
              </div>
              <AnimateHeight
                duration={300}
                height={expandedOptions["front-camera"] ? "auto" : 0}
              >
                <div
                  className={`smowl-activity__option-content ${
                    !activityConfig?.enabled || !activityConfig?.FrontCamera
                      ? "smowl-activity__option-content--disabled"
                      : ""
                  }`}
                >
                  {frontCameraAlarms.loading ? (
                    <div className="loader-empty" />
                  ) : frontCameraAlarms.error ? (
                    <div className="smowl-activity__option-placeholder">
                      <p>Error loading front camera alarms configuration.</p>
                    </div>
                  ) : frontCameraAlarms.alarms ? (
                    <>
                      <div className="smowl-activity__alarms-list">
                        {(
                          Object.keys(frontCameraAlarms.alarms) as Array<
                            keyof typeof frontCameraAlarms.alarms
                          >
                        ).map((alarmKey) => (
                          <div
                            key={alarmKey}
                            className="smowl-activity__alarm-item"
                          >
                            <label
                              htmlFor={`alarm-${alarmKey}`}
                              className="smowl-activity__alarm-label"
                            >
                              {getFrontCameraAlarmLabel(alarmKey)}
                            </label>
                            <button
                              type="button"
                              id={`alarm-${alarmKey}`}
                              className={`button-pill button-pill--switch-horizontal ${
                                isFrontCameraAlarmAllowed(alarmKey)
                                  ? "button-pill--switch-horizontal-active"
                                  : ""
                              }`}
                              onClick={() => toggleFrontCameraAlarm(alarmKey)}
                              disabled={
                                !activityConfig?.enabled ||
                                !activityConfig?.FrontCamera
                              }
                              aria-label={`Toggle ${getFrontCameraAlarmLabel(alarmKey)}`}
                            />
                          </div>
                        ))}
                      </div>

                      {frontCameraAlarmsChanged && (
                        <div className="smowl-activity__alarms-actions">
                          <Button
                            buttonModifiers="primary"
                            onClick={saveFrontCameraAlarms}
                            disabled={
                              !activityConfig?.enabled ||
                              !activityConfig?.FrontCamera
                            }
                          >
                            Update
                          </Button>
                          <Button
                            buttonModifiers="default"
                            onClick={cancelFrontCameraAlarms}
                            disabled={
                              !activityConfig?.enabled ||
                              !activityConfig?.FrontCamera
                            }
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="smowl-activity__option-placeholder">
                      <p>No front camera alarms configuration available.</p>
                    </div>
                  )}
                </div>
              </AnimateHeight>
            </div>
            <div className="smowl-activity__option-container">
              <div className="smowl-activity__option">
                <span className="smowl-activity__icon icon-exams"></span>
                <label
                  htmlFor="computer-monitoring-enabled"
                  className="smowl-activity__label"
                >
                  Computer Monitoring käytössä
                </label>
                <button
                  type="button"
                  id="computer-monitoring-enabled"
                  className={`button-pill button-pill--switch-horizontal ${
                    activityConfig?.ComputerMonitoring
                      ? "button-pill--switch-horizontal-active"
                      : ""
                  }`}
                  onClick={toggleComputerMonitoring}
                  disabled={!activityConfig?.enabled}
                />
                <button
                  type="button"
                  className={`smowl-activity__expand-button ${
                    expandedOptions["computer-monitoring"]
                      ? "icon-arrow-down"
                      : "icon-arrow-right"
                  }`}
                  onClick={() => toggleOptionExpanded("computer-monitoring")}
                  aria-expanded={expandedOptions["computer-monitoring"]}
                />
              </div>
              <AnimateHeight
                duration={300}
                height={expandedOptions["computer-monitoring"] ? "auto" : 0}
              >
                <div
                  className={`smowl-activity__option-content ${
                    !activityConfig?.enabled ||
                    !activityConfig?.ComputerMonitoring
                      ? "smowl-activity__option-content--disabled"
                      : ""
                  }`}
                >
                  {computerMonitoringAlarms.loading ? (
                    <div className="loader-empty" />
                  ) : computerMonitoringAlarms.error ? (
                    <div className="smowl-activity__option-placeholder">
                      <p>
                        Error loading computer monitoring alarms configuration.
                      </p>
                    </div>
                  ) : computerMonitoringAlarms.alarms ? (
                    <>
                      {/* Allowed Actions Section */}
                      <div className="smowl-activity__alarms-section">
                        <h3 className="smowl-activity__alarms-section-title">
                          Allowed actions
                        </h3>
                        <div className="smowl-activity__alarms-list">
                          {(
                            Object.keys(
                              computerMonitoringAlarms.alarms.allowed_actions
                            ) as Array<ComputerMonitoringAllowedActions>
                          ).map((alarmKey) => (
                            <div
                              key={alarmKey}
                              className="smowl-activity__alarm-item"
                            >
                              <label
                                htmlFor={`cm-action-${alarmKey}`}
                                className="smowl-activity__alarm-label"
                              >
                                {getComputerMonitoringActionLabel(alarmKey)}
                              </label>
                              <button
                                type="button"
                                id={`cm-action-${alarmKey}`}
                                className={`button-pill button-pill--switch-horizontal ${
                                  isComputerMonitoringAlarmAllowed(
                                    "allowed_actions",
                                    alarmKey
                                  )
                                    ? "button-pill--switch-horizontal-active"
                                    : ""
                                }`}
                                onClick={() =>
                                  toggleComputerMonitoringAlarm(
                                    "allowed_actions",
                                    alarmKey
                                  )
                                }
                                disabled={
                                  !activityConfig?.enabled ||
                                  !activityConfig?.ComputerMonitoring
                                }
                                aria-label={`Toggle ${getComputerMonitoringActionLabel(alarmKey)}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Allowed Programs Section */}
                      <div className="smowl-activity__alarms-section">
                        <h3 className="smowl-activity__alarms-section-title">
                          Allowed programs
                        </h3>
                        <div className="smowl-activity__alarms-list">
                          {(
                            Object.keys(
                              computerMonitoringAlarms.alarms.allowed_programs
                            ) as Array<ComputerMonitoringAllowedPrograms>
                          ).map((alarmKey) => (
                            <div
                              key={alarmKey}
                              className="smowl-activity__alarm-item"
                            >
                              <label
                                htmlFor={`cm-program-${alarmKey}`}
                                className="smowl-activity__alarm-label"
                              >
                                {getComputerMonitoringProgramLabel(alarmKey)}
                              </label>
                              <button
                                type="button"
                                id={`cm-program-${alarmKey}`}
                                className={`button-pill button-pill--switch-horizontal ${
                                  isComputerMonitoringAlarmAllowed(
                                    "allowed_programs",
                                    alarmKey
                                  )
                                    ? "button-pill--switch-horizontal-active"
                                    : ""
                                }`}
                                onClick={() =>
                                  toggleComputerMonitoringAlarm(
                                    "allowed_programs",
                                    alarmKey
                                  )
                                }
                                disabled={
                                  !activityConfig?.enabled ||
                                  !activityConfig?.ComputerMonitoring
                                }
                                aria-label={`Toggle ${getComputerMonitoringProgramLabel(alarmKey)}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      {computerMonitoringAlarmsChanged && (
                        <div className="smowl-activity__alarms-actions">
                          <Button
                            buttonModifiers="primary"
                            onClick={saveComputerMonitoringAlarms}
                            disabled={
                              !activityConfig?.enabled ||
                              !activityConfig?.ComputerMonitoring
                            }
                          >
                            Update
                          </Button>
                          <Button
                            buttonModifiers="default"
                            onClick={cancelComputerMonitoringAlarms}
                            disabled={
                              !activityConfig?.enabled ||
                              !activityConfig?.ComputerMonitoring
                            }
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="smowl-activity__option-placeholder">
                      <p>
                        No computer monitoring alarms configuration available.
                      </p>
                    </div>
                  )}
                </div>
              </AnimateHeight>
            </div>
            <div className="smowl-activity__option-separator" />
            <div className="smowl-activity__option-container">
              <div className="smowl-activity__option">
                <span className="smowl-activity__icon icon-tag"></span>
                <label
                  htmlFor="test-exam-mode-enabled"
                  className="smowl-activity__label"
                >
                  Test Exam Mode käytössä
                </label>
                <button
                  type="button"
                  id="test-exam-mode-enabled"
                  className={`button-pill button-pill--switch-horizontal ${
                    activityConfig?.TestExamMode
                      ? "button-pill--switch-horizontal-active"
                      : ""
                  }`}
                  onClick={toggleTestExamMode}
                  disabled={!activityConfig?.enabled}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return renderContent();
};

export default SmowlActivity;
