import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { StateType } from "~/reducers";
import AnimateHeight from "react-animate-height";
import {
  ActivityConfig,
  ComputerMonitoringAlarmsConfig,
  ComputerMonitoringAllowedActions,
  ComputerMonitoringAllowedPrograms,
  FrontCameraAlarms,
  FrontCameraAlarmsConfig,
  MonitoringAlarmsActivityResult,
} from "~/api_smowl/";
import { updateWorkspaceMaterialContentNode } from "~/actions/workspaces/material";

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

  const { currentDraftNodeValue } = editorState;

  const {
    smowlActivity: smowlActivityDraft,
    smowlFrontCameraAlarm: smowlFrontCameraAlarmDraft,
    smowlComputerMonitoringAlarm: smowlComputerMonitoringAlarmDraft,
  } = currentDraftNodeValue;

  // State for expanded options
  const [expandedOptions, setExpandedOptions] = React.useState<{
    [key: string]: boolean;
  }>({});

  const dispatch = useDispatch();

  /**
   * Handles smowl activity change
   * @param value value
   */
  const handleSmowlActivityChange = (value: ActivityConfig) => {
    dispatch(
      updateWorkspaceMaterialContentNode({
        workspace: editorState.currentNodeWorkspace,
        material: editorState.currentDraftNodeValue,
        update: {
          smowlActivity: value,
        },
        isDraft: true,
      })
    );
  };

  /**
   * Handles exam settings change
   * @param value value
   */
  const handleSmowlFrontCameraAlarmChange = (
    value: MonitoringAlarmsActivityResult<FrontCameraAlarmsConfig>
  ) => {
    dispatch(
      updateWorkspaceMaterialContentNode({
        workspace: editorState.currentNodeWorkspace,
        material: editorState.currentDraftNodeValue,
        update: {
          smowlFrontCameraAlarm: value,
        },
        isDraft: true,
      })
    );
  };

  /**
   * Handles computer monitoring alarm change
   * @param value value
   */
  const handleSmowlComputerMonitoringAlarmChange = (
    value: MonitoringAlarmsActivityResult<ComputerMonitoringAlarmsConfig>
  ) => {
    dispatch(
      updateWorkspaceMaterialContentNode({
        workspace: editorState.currentNodeWorkspace,
        material: editorState.currentDraftNodeValue,
        update: {
          smowlComputerMonitoringAlarm: value,
        },
        isDraft: true,
      })
    );
  };

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
   * Toggles the computer monitoring enabled state
   */
  const toggleComputerMonitoringEnabled = () => {
    if (!smowlActivityDraft) return;

    handleSmowlActivityChange({
      ...smowlActivityDraft,
      ComputerMonitoring: !smowlActivityDraft?.ComputerMonitoring,
    });
  };

  /**
   * Toggles the test exam mode enabled state
   */
  const toggleTestExamModeEnabled = () => {
    if (!smowlActivityDraft) return;

    handleSmowlActivityChange({
      ...smowlActivityDraft,
      TestExamMode: !smowlActivityDraft?.TestExamMode,
    });
  };

  /**
   * Toggles a front camera alarm between allowed and not allowed (local state only)
   * @param alarmKey - The key of the alarm to toggle
   */
  const toggleFrontCameraAlarm = (alarmKey: FrontCameraAlarms) => {
    if (!smowlFrontCameraAlarmDraft.alarms) return;

    const currentValue = smowlFrontCameraAlarmDraft.alarms[alarmKey];

    const isAllowed =
      currentValue !== 0 &&
      currentValue !== "0" &&
      currentValue !== null &&
      currentValue !== undefined;

    handleSmowlFrontCameraAlarmChange({
      ...smowlFrontCameraAlarmDraft,
      alarms: {
        ...smowlFrontCameraAlarmDraft.alarms,
        [alarmKey]: isAllowed ? "0" : "1",
      },
    });
  };

  /**
   * Toggles a computer monitoring alarm between allowed and not allowed (local state only)
   * @param subKey - The key of the sub-alarm to toggle
   * @param alarmKey - The key of the alarm to toggle
   */
  const toggleComputerMonitoringAlarm = (
    subKey: keyof ComputerMonitoringAlarmsConfig,
    alarmKey:
      | ComputerMonitoringAllowedActions
      | ComputerMonitoringAllowedPrograms
  ) => {
    if (!smowlComputerMonitoringAlarmDraft.alarms) return;

    const currentSubCategory = smowlComputerMonitoringAlarmDraft.alarms[subKey];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const currentValue = (currentSubCategory as any)[alarmKey];

    handleSmowlComputerMonitoringAlarmChange({
      ...smowlComputerMonitoringAlarmDraft,
      alarms: {
        ...smowlComputerMonitoringAlarmDraft.alarms,
        [subKey]: {
          ...currentSubCategory,
          [alarmKey]: !currentValue,
        },
      },
    });
  };

  /**
   * Checks if a computer monitoring alarm is currently allowed
   * @param subKey - The key of the sub-category ('allowed_actions' or 'allowed_programs')
   * @param alarmKey - The key of the alarm to check within the sub-category
   * @returns true if the alarm is allowed, false otherwise
   */
  const isComputerMonitoringAlarmAllowed = (
    subKey: keyof ComputerMonitoringAlarmsConfig,
    alarmKey:
      | ComputerMonitoringAllowedActions
      | ComputerMonitoringAllowedPrograms
  ): boolean => {
    if (!smowlComputerMonitoringAlarmDraft.alarms) return false;

    const subCategory = smowlComputerMonitoringAlarmDraft.alarms[subKey];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (subCategory as any)[alarmKey] === true;
  };

  /**
   * Checks if a front camera alarm is currently allowed (checks pending state if available)
   * @param alarmKey - The key of the alarm to check
   * @returns true if the alarm is allowed, false otherwise
   */
  const isFrontCameraAlarmAllowed = (alarmKey: FrontCameraAlarms): boolean => {
    const alarmsToCheck = smowlFrontCameraAlarmDraft.alarms;
    if (!alarmsToCheck) return false;

    const value = alarmsToCheck[alarmKey];
    return (
      value !== 0 && value !== "0" && value !== null && value !== undefined
    );
  };

  /**
   * Renders the content of the smowl activity
   * @returns The content of the smowl activity
   */
  const renderContent = () => (
    <div className="material-editor__smowl-item">
      <div className="material-editor__smowl-header">
        <div className="material-editor__smowl-header-title">
          Activity: {smowlActivityDraft?.displayName}
        </div>
      </div>
      <div
        className={`material-editor__smowl-body ${
          !smowlActivityDraft?.enabled
            ? "material-editor__smowl-body--disabled"
            : ""
        }`}
      >
        <div className="material-editor__smowl-option-container">
          <div className="material-editor__smowl-option">
            <label
              htmlFor="computer-monitoring-enabled"
              className="material-editor__smowl-label"
            >
              Webbi kamera vaadittuna
            </label>
            <button
              type="button"
              id="computer-monitoring-enabled"
              className={`button-pill button-pill--switch-horizontal ${
                smowlActivityDraft?.FrontCamera
                  ? "button-pill--switch-horizontal-active"
                  : ""
              }`}
              disabled={!smowlActivityDraft?.enabled}
            />
            <button
              type="button"
              className={`material-editor__smowl-expand-button ${
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
              className={`material-editor__smowl-option-content ${
                !smowlActivityDraft?.enabled || !smowlActivityDraft?.FrontCamera
                  ? "material-editor__smowl-option-content--disabled"
                  : ""
              }`}
            >
              {smowlFrontCameraAlarmDraft?.alarms ? (
                <div className="material-editor__smowl-alarms-section">
                  <div className="material-editor__smowl-alarms-list">
                    {(
                      Object.keys(smowlFrontCameraAlarmDraft.alarms) as Array<
                        keyof typeof smowlFrontCameraAlarmDraft.alarms
                      >
                    ).map((alarmKey) => (
                      <div
                        key={alarmKey}
                        className="material-editor__smowl-alarm-item"
                      >
                        <label
                          htmlFor={`alarm-${alarmKey}`}
                          className="material-editor__smowl-alarm-label"
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
                            !smowlActivityDraft?.enabled ||
                            !smowlActivityDraft?.FrontCamera
                          }
                          aria-label={`Toggle ${getFrontCameraAlarmLabel(alarmKey)}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="material-editor__smowl-option-placeholder">
                  <p>No front camera alarms configuration available.</p>
                </div>
              )}
            </div>
          </AnimateHeight>
        </div>
        <div className="material-editor__smowl-option-container">
          <div className="material-editor__smowl-option">
            <label
              htmlFor="computer-monitoring-enabled"
              className="material-editor__smowl-label"
            >
              SMOWLCM sovellus vaadittuna
            </label>
            <button
              type="button"
              id="computer-monitoring-enabled"
              className={`button-pill button-pill--switch-horizontal ${
                smowlActivityDraft?.ComputerMonitoring
                  ? "button-pill--switch-horizontal-active"
                  : ""
              }`}
              onClick={toggleComputerMonitoringEnabled}
              disabled={!smowlActivityDraft?.enabled}
            />
            <button
              type="button"
              className={`material-editor__smowl-expand-button ${
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
              className={`material-editor__smowl-option-content ${
                !smowlActivityDraft?.enabled ||
                !smowlActivityDraft?.ComputerMonitoring
                  ? "material-editor__smowl-option-content--disabled"
                  : ""
              }`}
            >
              {smowlComputerMonitoringAlarmDraft?.alarms ? (
                <>
                  {/* Allowed Actions Section */}
                  <div className="material-editor__smowl-alarms-section">
                    <label className="material-editor__smowl-alarms-label">
                      Allowed actions
                    </label>
                    <div className="material-editor__smowl-alarms-list">
                      {(
                        Object.keys(
                          smowlComputerMonitoringAlarmDraft.alarms
                            .allowed_actions
                        ) as Array<ComputerMonitoringAllowedActions>
                      ).map((alarmKey) => (
                        <div
                          key={alarmKey}
                          className="material-editor__smowl-alarm-item"
                        >
                          <label
                            htmlFor={`cm-action-${alarmKey}`}
                            className="material-editor__smowl-alarm-label"
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
                              !smowlActivityDraft?.enabled ||
                              !smowlActivityDraft?.ComputerMonitoring
                            }
                            aria-label={`Toggle ${getComputerMonitoringActionLabel(alarmKey)}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Allowed Programs Section */}
                  <div className="material-editor__smowl-alarms-section">
                    <label className="material-editor__smowl-alarms-label">
                      Allowed programs
                    </label>
                    <div className="material-editor__smowl-alarms-list">
                      {(
                        Object.keys(
                          smowlComputerMonitoringAlarmDraft.alarms
                            .allowed_programs
                        ) as Array<ComputerMonitoringAllowedPrograms>
                      ).map((alarmKey) => (
                        <div
                          key={alarmKey}
                          className="material-editor__smowl-alarm-item"
                        >
                          <label
                            htmlFor={`cm-program-${alarmKey}`}
                            className="material-editor__smowl-alarm-label"
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
                              !smowlActivityDraft?.enabled ||
                              !smowlActivityDraft?.ComputerMonitoring
                            }
                            aria-label={`Toggle ${getComputerMonitoringProgramLabel(alarmKey)}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              ) : (
                <div className="material-editor__smowl-option-placeholder">
                  <p>No computer monitoring alarms configuration available.</p>
                </div>
              )}
            </div>
          </AnimateHeight>
        </div>
        <div className="material-editor__smowl-option-container">
          <div className="material-editor__smowl-option">
            <label
              htmlFor="test-exam-mode-enabled"
              className="material-editor__smowl-label"
            >
              Kokeen testaus tila
            </label>
            <button
              type="button"
              id="test-exam-mode-enabled"
              className={`button-pill button-pill--switch-horizontal ${
                smowlActivityDraft?.TestExamMode
                  ? "button-pill--switch-horizontal-active"
                  : ""
              }`}
              onClick={toggleTestExamModeEnabled}
              disabled={!smowlActivityDraft?.enabled}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return renderContent();
};

export default SmowlActivity;
