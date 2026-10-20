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
import {
  Table,
  TableHead,
  Tbody,
  Td,
  Th,
  Tr,
} from "~/components/general/table";
import { useSmowlExamResults } from "./hooks/useSmowlExamResults";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";

/**
 * Get the label for a front camera alarm
 * @param alarmKey - The key of the alarm
 * @param t - The translation function
 * @returns The label for the alarm
 */
const getFrontCameraAlarmLabel = (
  alarmKey: FrontCameraAlarms,
  t: TFunction
): string =>
  t("labels.frontCameraAlarm", {
    ns: "smowl",
    context: alarmKey,
    defaultValue: alarmKey,
  });

/**
 * Get the description for a front camera alarm
 * @param alarmKey - The key of the alarm
 * @param t - The translation function
 * @returns The description for the alarm
 */
const getFrontCameraAlarmDescription = (
  alarmKey: FrontCameraAlarms,
  t: TFunction
): string =>
  t("content.frontCameraAlarm", {
    ns: "smowl",
    context: alarmKey,
    defaultValue: alarmKey,
  });

/**
 * Get the label for a computer monitoring allowed action
 * @param alarmKey - The key of the action
 * @param t - The translation function
 * @returns The label for the action
 */
const getComputerMonitoringActionLabel = (
  alarmKey: ComputerMonitoringAllowedActions,
  t: TFunction
): string =>
  t("labels.computerMonitoringAction", {
    ns: "smowl",
    context: alarmKey,
    defaultValue: alarmKey,
  });

/**
 * Get the description for a computer monitoring allowed action
 * @param alarmKey - The key of the action
 * @param t - The translation function
 * @returns The description for the action
 */
const getComputerMonitoringActionDescription = (
  alarmKey: ComputerMonitoringAllowedActions,
  t: TFunction
): string =>
  t("content.computerMonitoringAction", {
    ns: "smowl",
    context: alarmKey,
    defaultValue: alarmKey,
  });

/**
 * Get the label for a computer monitoring allowed program
 * @param alarmKey - The key of the program
 * @param t - The translation function
 * @returns The label for the program
 */
const getComputerMonitoringProgramLabel = (
  alarmKey: ComputerMonitoringAllowedPrograms,
  t: TFunction
): string =>
  t("labels.computerMonitoringProgram", {
    ns: "smowl",
    context: alarmKey,
    defaultValue: alarmKey,
  });

/**
 * Get the description for a computer monitoring allowed program
 * @param alarmKey - The key of the program
 * @param t - The translation function
 * @returns The description for the program
 */
const getComputerMonitoringProgramDescription = (
  alarmKey: ComputerMonitoringAllowedPrograms,
  t: TFunction
): string =>
  t("content.computerMonitoringProgram", {
    ns: "smowl",
    context: alarmKey,
    defaultValue: alarmKey,
  });

/**
 * Smowl activity props
 */
interface SmowlActivityProps {}

/**
 * Smowl activity component
 * @param props - Smowl activity props
 */
const SmowlActivity = (props: SmowlActivityProps) => {
  const { t } = useTranslation(["smowl"]);

  const editorState = useSelector(
    (state: StateType) => state.workspaces.materialEditor
  );

  const { status } = useSelector((state: StateType) => state);

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

  const { hasProctoredData, loadingExamResults } = useSmowlExamResults({
    examId: currentDraftNodeValue.workspaceMaterialId,
    sysEnvironment: status.sysEnvironment,
    isAvailable: status.services.smowl?.isAvailable ?? false,
  });

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

    const isMonitored =
      currentValue !== 0 &&
      currentValue !== "0" &&
      currentValue !== null &&
      currentValue !== undefined;

    handleSmowlFrontCameraAlarmChange({
      ...smowlFrontCameraAlarmDraft,
      alarms: {
        ...smowlFrontCameraAlarmDraft.alarms,
        [alarmKey]: isMonitored ? "0" : "1",
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
   * Checks if a computer monitoring action is currently monitored
   * @param alarmKey - The key of the action to check
   * @returns false if the action is monitored, true otherwise
   */
  const isComputerMonitoringActionMonitored = (
    alarmKey: ComputerMonitoringAllowedActions
  ): boolean => {
    if (!smowlComputerMonitoringAlarmDraft.alarms) return true;

    const subCategory =
      smowlComputerMonitoringAlarmDraft.alarms.allowed_actions;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return subCategory[alarmKey] === false;
  };

  /**
   * Checks if a computer monitoring program is currently monitored
   * @param alarmKey - The key of the alarm to check within the sub-category
   * @returns false if the program is monitored, true otherwise
   */
  const isComputerMonitoringProgramMonitored = (
    alarmKey: ComputerMonitoringAllowedPrograms
  ): boolean => {
    if (!smowlComputerMonitoringAlarmDraft.alarms) return true;

    const subCategory =
      smowlComputerMonitoringAlarmDraft.alarms.allowed_programs;
    return subCategory[alarmKey] === false;
  };

  /**
   * Checks if a front camera alarm is currently monitored (checks pending state if available)
   * @param alarmKey - The key of the alarm to check
   * @returns true if the alarm is monitored, false otherwise
   */
  const isFrontCameraAlarmMonitored = (
    alarmKey: FrontCameraAlarms
  ): boolean => {
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
      {hasProctoredData && (
        <div className="material-editor__smowl-warning">
          {t("content.settingsLocked", {
            ns: "smowl",
          })}
        </div>
      )}
      <div className="material-editor__smowl-header">
        <div className="material-editor__smowl-header-title">
          {t("labels.examName", {
            ns: "smowl",
            name: smowlActivityDraft?.displayName,
          })}
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
              {t("labels.cameraRequired", {
                ns: "smowl",
              })}
            </label>
            <button
              type="button"
              id="computer-monitoring-enabled"
              className={`button-pill button-pill--switch-horizontal ${
                smowlActivityDraft?.FrontCamera
                  ? "button-pill--switch-horizontal-active"
                  : ""
              }`}
              disabled={
                !smowlActivityDraft?.enabled ||
                loadingExamResults ||
                hasProctoredData
              }
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
                  <Table className="material-editor__smowl-table">
                    <TableHead>
                      <Tr>
                        <Th modifiers={["left"]}>
                          {t("labels.monitoredActivity", {
                            ns: "smowl",
                          })}
                        </Th>
                        <Th modifiers={["centered"]}>
                          {t("labels.monitored", {
                            ns: "smowl",
                          })}
                        </Th>
                        <Th modifiers={["centered"]}>
                          {t("labels.notMonitored", {
                            ns: "smowl",
                          })}
                        </Th>
                      </Tr>
                    </TableHead>
                    <Tbody>
                      {(
                        Object.keys(smowlFrontCameraAlarmDraft.alarms) as Array<
                          keyof typeof smowlFrontCameraAlarmDraft.alarms
                        >
                      ).map((alarmKey) => {
                        const monitored = isFrontCameraAlarmMonitored(alarmKey);
                        const disabled =
                          !smowlActivityDraft?.enabled ||
                          !smowlActivityDraft?.FrontCamera ||
                          loadingExamResults ||
                          hasProctoredData;

                        return (
                          <Tr key={alarmKey}>
                            <Td modifiers={["left"]}>
                              <div className="material-editor__smowl-option-title">
                                {getFrontCameraAlarmLabel(alarmKey, t)}
                              </div>
                              <div className="material-editor__smowl-option-description">
                                {getFrontCameraAlarmDescription(alarmKey, t)}
                              </div>
                            </Td>

                            <Td modifiers={["centered"]}>
                              <span className="form-element form-element--smowl">
                                <input
                                  type="radio"
                                  name={`alarm-${alarmKey}`}
                                  checked={monitored}
                                  disabled={disabled}
                                  onChange={() => {
                                    if (!monitored)
                                      toggleFrontCameraAlarm(alarmKey);
                                  }}
                                  aria-label={`${t("wcag.setAlarmOn", {
                                    ns: "smowl",
                                    name: getFrontCameraAlarmLabel(alarmKey, t),
                                  })}`}
                                />
                              </span>
                            </Td>

                            <Td modifiers={["centered"]}>
                              <span className="form-element form-element--smowl">
                                <input
                                  type="radio"
                                  name={`alarm-${alarmKey}`}
                                  checked={!monitored}
                                  disabled={disabled}
                                  onChange={() => {
                                    if (monitored)
                                      toggleFrontCameraAlarm(alarmKey);
                                  }}
                                  aria-label={`${t("wcag.setAlarmOff", {
                                    ns: "smowl",
                                    name: getFrontCameraAlarmLabel(alarmKey, t),
                                  })}`}
                                />
                              </span>
                            </Td>
                          </Tr>
                        );
                      })}
                    </Tbody>
                  </Table>
                </div>
              ) : (
                <div className="material-editor__smowl-option-placeholder">
                  <p>
                    {t("content.noFrontCameraAlarms", {
                      ns: "smowl",
                    })}
                  </p>
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
              {t("labels.computerMonitoringRequired", {
                ns: "smowl",
              })}
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
              disabled={
                !smowlActivityDraft?.enabled ||
                loadingExamResults ||
                hasProctoredData
              }
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
                    <Table className="material-editor__smowl-table">
                      <TableHead>
                        <Tr>
                          <Th modifiers={["left"]}>
                            {t("labels.monitoredActivity", {
                              ns: "smowl",
                            })}
                          </Th>
                          <Th modifiers={["centered"]}>
                            {t("labels.monitored", {
                              ns: "smowl",
                            })}
                          </Th>
                          <Th modifiers={["centered"]}>
                            {t("labels.notMonitored", {
                              ns: "smowl",
                            })}
                          </Th>
                        </Tr>
                      </TableHead>

                      <Tbody>
                        {(
                          Object.keys(
                            smowlComputerMonitoringAlarmDraft.alarms
                              .allowed_actions
                          ) as Array<ComputerMonitoringAllowedActions>
                        ).map((alarmKey) => {
                          const monitored =
                            isComputerMonitoringActionMonitored(alarmKey);

                          const disabled =
                            !smowlActivityDraft?.enabled ||
                            !smowlActivityDraft?.ComputerMonitoring ||
                            loadingExamResults ||
                            hasProctoredData;

                          return (
                            <Tr key={alarmKey}>
                              <Td modifiers={["left"]}>
                                <div className="material-editor__smowl-option-title">
                                  {getComputerMonitoringActionLabel(
                                    alarmKey,
                                    t
                                  )}
                                </div>
                                <div className="material-editor__smowl-option-description">
                                  {getComputerMonitoringActionDescription(
                                    alarmKey,
                                    t
                                  )}
                                </div>
                              </Td>

                              <Td modifiers={["centered"]}>
                                <span className="form-element form-element--smowl">
                                  <input
                                    type="radio"
                                    name={`cm-action-${alarmKey}`}
                                    checked={monitored}
                                    disabled={disabled}
                                    onChange={() => {
                                      if (!monitored)
                                        toggleComputerMonitoringAlarm(
                                          "allowed_actions",
                                          alarmKey
                                        );
                                    }}
                                    aria-label={`${t("wcag.setAlarmOn", {
                                      ns: "smowl",
                                      name: getComputerMonitoringActionLabel(
                                        alarmKey,
                                        t
                                      ),
                                    })}`}
                                  />
                                </span>
                              </Td>

                              <Td modifiers={["centered"]}>
                                <span className="form-element form-element--smowl">
                                  <input
                                    type="radio"
                                    name={`cm-action-${alarmKey}`}
                                    checked={!monitored}
                                    disabled={disabled}
                                    onChange={() => {
                                      if (monitored)
                                        toggleComputerMonitoringAlarm(
                                          "allowed_actions",
                                          alarmKey
                                        );
                                    }}
                                    aria-label={`${t("wcag.setAlarmOff", {
                                      ns: "smowl",
                                      name: getComputerMonitoringActionLabel(
                                        alarmKey,
                                        t
                                      ),
                                    })}`}
                                  />
                                </span>
                              </Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                  </div>

                  {/* Allowed Programs Section */}
                  <div className="material-editor__smowl-alarms-section">
                    <Table className="material-editor__smowl-table">
                      <TableHead>
                        <Tr>
                          <Th modifiers={["left"]}>
                            {t("labels.monitoredApplications", {
                              ns: "smowl",
                            })}
                          </Th>
                          <Th modifiers={["centered"]}>
                            {t("labels.monitored", {
                              ns: "smowl",
                            })}
                          </Th>
                          <Th modifiers={["centered"]}>
                            {t("labels.notMonitored", {
                              ns: "smowl",
                            })}
                          </Th>
                        </Tr>
                      </TableHead>

                      <Tbody>
                        {(
                          Object.keys(
                            smowlComputerMonitoringAlarmDraft.alarms
                              .allowed_programs
                          ) as Array<ComputerMonitoringAllowedPrograms>
                        ).map((alarmKey) => {
                          const monitored =
                            isComputerMonitoringProgramMonitored(alarmKey);

                          const disabled =
                            !smowlActivityDraft?.enabled ||
                            !smowlActivityDraft?.ComputerMonitoring ||
                            loadingExamResults ||
                            hasProctoredData;

                          return (
                            <Tr key={alarmKey}>
                              <Td modifiers={["left"]}>
                                <div className="material-editor__smowl-option-title">
                                  {getComputerMonitoringProgramLabel(
                                    alarmKey,
                                    t
                                  )}
                                </div>
                                <div className="material-editor__smowl-option-description">
                                  {getComputerMonitoringProgramDescription(
                                    alarmKey,
                                    t
                                  )}
                                </div>
                              </Td>

                              <Td modifiers={["centered"]}>
                                <span className="form-element form-element--smowl">
                                  <input
                                    type="radio"
                                    name={`cm-program-${alarmKey}`}
                                    checked={monitored}
                                    disabled={disabled}
                                    onChange={() => {
                                      if (!monitored)
                                        toggleComputerMonitoringAlarm(
                                          "allowed_programs",
                                          alarmKey
                                        );
                                    }}
                                    aria-label={`${t("wcag.setAlarmOn", {
                                      ns: "smowl",
                                      name: getComputerMonitoringProgramLabel(
                                        alarmKey,
                                        t
                                      ),
                                    })}`}
                                  />
                                </span>
                              </Td>

                              <Td modifiers={["centered"]}>
                                <span className="form-element form-element--smowl">
                                  <input
                                    type="radio"
                                    name={`cm-program-${alarmKey}`}
                                    checked={!monitored}
                                    disabled={disabled}
                                    onChange={() => {
                                      if (monitored)
                                        toggleComputerMonitoringAlarm(
                                          "allowed_programs",
                                          alarmKey
                                        );
                                    }}
                                    aria-label={`${t("wcag.setAlarmOff", {
                                      ns: "smowl",
                                      name: getComputerMonitoringProgramLabel(
                                        alarmKey,
                                        t
                                      ),
                                    })}`}
                                  />
                                </span>
                              </Td>
                            </Tr>
                          );
                        })}
                      </Tbody>
                    </Table>
                  </div>
                </>
              ) : (
                <div className="material-editor__smowl-option-placeholder">
                  <p>
                    {t("content.noComputerMonitoringAlarms", {
                      ns: "smowl",
                    })}
                  </p>
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
              {t("labels.testExamMode", {
                ns: "smowl",
              })}
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
              disabled={
                !smowlActivityDraft?.enabled ||
                loadingExamResults ||
                hasProctoredData
              }
            />
          </div>
        </div>
      </div>
    </div>
  );

  return renderContent();
};

export default SmowlActivity;
