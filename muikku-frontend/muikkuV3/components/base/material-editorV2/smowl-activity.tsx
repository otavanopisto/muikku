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

/**
 * Get the label for a front camera alarm
 * @param alarmKey - The key of the alarm
 * @returns The label for the alarm
 */
const getFrontCameraAlarmLabel = (alarmKey: FrontCameraAlarms): string => {
  const labelMap: Record<FrontCameraAlarms, string> = {
    INCORRECT_USER: "Väärä henkilö",
    MORE_THAN_ONE: "Useita henkilöitä",
    NOBODY: "Kuvassa ei näy ketään",
    WEBCAM_COVERED: "Kamera peitetty",
    OTHER_TAB: "Välilehden vaihto",
    WRONG_LIGHT_POSING: "Huono valaistus tai asento",
    BANNED_ELEMENTS: "Kielletyt esineet",
    SUSPICIOUS_BEHAVIOUR: "Epäilyttävä toiminta",
    MIN_IMAGES_REQUIRED: "Puuttuva kuvamateriaali",
    WEBCAM_REJECTED: "Kameraoikeudet evätty",
    CONFIGURATION_PROBLEM: "Virhe kameran asetuksissa",
    NO_WEBCAM: "Kameraa ei löydy",
    WEBCAM_BLOCKED: "Kamera varattu",
    UNSUPPORTED_BROWSER: "Selain ei ole tuettu",
  };
  return labelMap[alarmKey] || alarmKey;
};

/**
 * Get the description for a front camera alarm
 * @param alarmKey - The key of the alarm
 * @returns The description for the alarm
 */
const getFrontCameraAlarmDescription = (
  alarmKey: FrontCameraAlarms
): string => {
  const labelMap: Record<FrontCameraAlarms, string> = {
    INCORRECT_USER: "Kuvassa on joku muu kuin rekisteröitynyt käyttäjä.",
    MORE_THAN_ONE: "Kuvassa näkyy useampi kuin yksi henkilö.",
    NOBODY: "Kuvassa ei näy yhtään henkilöä.",
    WEBCAM_COVERED: "Kamera on peitetty tai näkyvyys estetty.",
    OTHER_TAB: "Käyttäjä poistuu koeikkunasta tai vaihtaa välilehteä.",
    WRONG_LIGHT_POSING: "Valaistus tai asento estää luotettavan valvonnan.",
    BANNED_ELEMENTS:
      "Kuvassa näkyy kiellettyjä esineitä kuten kuulokkeet tai puhelin.",
    SUSPICIOUS_BEHAVIOUR:
      "Käyttäjä jatkaa aiemmin havaittua epäilyttävää toimintaa.",
    MIN_IMAGES_REQUIRED: "Valvonnan vahvistamiseen tarvittavia kuvia puuttuu.",
    WEBCAM_REJECTED: "Selain ei ole saanut lupaa käyttää kameraa.",
    CONFIGURATION_PROBLEM: "Kameran asetuksissa havaitaan virhe.",
    NO_WEBCAM: "Kokeen aikana ei ole kytkettyä kameraa.",
    WEBCAM_BLOCKED: "Toinen sovellus käyttää kameraa ja estää valvonnan.",
    UNSUPPORTED_BROWSER: "Selain ei tue SMOWL-valvontaa.",
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
    WEB_NAVIGATION: "Nettisivujen selaus",
    VIRTUAL_MACHINE: "Virtuaalikone",
    VIRTUAL_WEBCAM: "Virtuaalikamera",
    MULTIPLE_SCREENS: "Useat näytöt",
    COMMANDS: "Komennot",
    BACKGROUND_PROGRAMS: "Taustaohjelmat",
    EARLY_CLOSE: "Ennenaikainen sulkeminen",
  };
  return labelMap[alarmKey] || alarmKey;
};

/**
 * Get the description for a computer monitoring allowed action
 * @param alarmKey - The key of the action
 * @returns The description for the action
 */
const getComputerMonitoringActionDescription = (
  alarmKey: ComputerMonitoringAllowedActions
): string => {
  const labelMap: Record<ComputerMonitoringAllowedActions, string> = {
    WEB_NAVIGATION:
      "Käyttäjä siirtyy kokeen aikana kokeen ulkopuolisille verkkosivuille. Käydyt sivustot tallennetaan raporttiin.",
    VIRTUAL_MACHINE: "Kokeen suorittamiseen käytetään virtuaalikonetta.",
    VIRTUAL_WEBCAM:
      "Järjestelmä havaitsee virtuaalisen kameran käytön fyysisen webkameran sijasta.",
    MULTIPLE_SCREENS:
      "Järjestelmä havaitsee useamman kuin yhden näytön käytön.",
    COMMANDS:
      "Käyttäjä käyttää kiellettyjä komentoja, kuten kopiointia, liittämistä tai kuvakaappausta.",
    BACKGROUND_PROGRAMS:
      "Taustalla on käynnissä kiellettyjä ohjelmia kokeen aikana.",
    EARLY_CLOSE:
      "SMOWL-sovellus suljetaan ennen kokeen lopullista palauttamista.",
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
    TEXT_EDITOR: "Tekstinkäsittely",
    PDF_READER: "PDF-lukijat",
    SPREADSHEET: "Taulukkolaskenta",
    MAIL: "Sähköposti",
    COMMUNICATION: "Viestintäohjelmat",
    VIRTUAL_WEBCAM: "Virtuaalikamerat",
    FILE_SYSTEM: "Tiedostonhallinta",
    MEDIA_PLAYER: "Mediasoittimet",
    SLIDE_VIEWER: "Esitysohjelmat",
    SCREENSHOTER: "Näytöntallennus",
    REMOTE_CONTROL: "Etähallinta",
    PENTESTING: "Tietoturvatestaus",
    CODE_EDITOR: "Koodieditorit",
    VIRTUAL_MACHINES: "Virtuaalikoneet",
    DATABASE: "Tietokantasovellukset",
    OPEN_SOURCE_OFFICE_SUITE: "Vapaat toimisto-ohjelmat",
  };
  return labelMap[alarmKey] || alarmKey;
};

/**
 * Get the description for a computer monitoring allowed program
 * @param alarmKey - The key of the program
 * @returns The description for the program
 */
const getComputerMonitoringProgramDescription = (
  alarmKey: ComputerMonitoringAllowedPrograms
): string => {
  const labelMap: Record<ComputerMonitoringAllowedPrograms, string> = {
    TEXT_EDITOR:
      "Merkitään poikkeamaksi, jos avoinna on tekstinkäsittelyohjelmia kuten Word.",
    PDF_READER:
      "Merkitään poikkeamaksi, jos avoinna on PDF-tiedostojen luku- tai muokkausohjelmia kuten Adobe Reader.",
    SPREADSHEET:
      "Merkitään poikkeamaksi, jos avoinna on taulukkolaskentaohjelmia kuten Excel.",
    MAIL: "Merkitään poikkeamaksi, jos avoinna on sähköpostiohjelmia kuten Outlook.",
    COMMUNICATION:
      "Merkitään poikkeamaksi, jos avoinna on viestintä- tai kokoussovelluksia kuten Zoom tai Discord.",
    VIRTUAL_WEBCAM:
      "Merkitään poikkeamaksi, jos avoinna on virtuaalikameran käyttöön tarkoitettuja ohjelmia kuten OBS Studio.",
    FILE_SYSTEM:
      "Merkitään poikkeamaksi, jos käytetään laitteen tiedostonhallintatyökaluja kuten Resurssienhallinta.",
    MEDIA_PLAYER:
      "Merkitään poikkeamaksi, jos avoinna on musiikki- tai videopalveluita kuten Spotify tai iTunes.",
    SLIDE_VIEWER:
      "Merkitään poikkeamaksi, jos avoinna on esitysgrafiikkaohjelmia kuten PowerPoint.",
    SCREENSHOTER:
      "Merkitään poikkeamaksi, jos avoinna on näytön kaappaamiseen tai live-tallennukseen tarkoitettuja ohjelmia.",
    REMOTE_CONTROL:
      "Merkitään poikkeamaksi, jos avoinna on laitteen etähallintaan tarkoitettuja ohjelmia kuten Teamviewer tai Anydesk.",
    PENTESTING:
      "Merkitään poikkeamaksi, jos avoinna on tietoturva-analyysiin tarkoitettuja ohjelmia kuten Burp Suite.",
    CODE_EDITOR:
      "Merkitään poikkeamaksi, jos avoinna on ohjelmointiin tarkoitettuja koodieditoreita.",
    VIRTUAL_MACHINES:
      "Merkitään poikkeamaksi, jos avoinna on virtuaalikoneohjelmistoja kuten Virtualbox tai VMware.",
    DATABASE:
      "Merkitään poikkeamaksi, jos avoinna on tietokantojen hallintaan tai lukuun tarkoitettuja ohjelmia.",
    OPEN_SOURCE_OFFICE_SUITE:
      "Merkitään poikkeamaksi, jos avoinna on avoimen lähdekoodin toimisto-ohjelmistoja.",
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

  const { hasProctoredData, loadingExamResults } = useSmowlExamResults({
    examId: currentDraftNodeValue.workspaceMaterialId,
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
      {hasProctoredData && (
        <div className="material-editor__smowl-warning">
          Kokeen asetuksiin ei voi enää tehdä muutoksia koska kokeesta on jo
          tallennettu valvottuja suorituksia.
        </div>
      )}
      <div className="material-editor__smowl-header">
        <div className="material-editor__smowl-header-title">
          Kokeen nimi: {smowlActivityDraft?.displayName}
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
              Kamera vaaditaan
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
                        <Th modifiers={["left"]}>Tarkkailtava toiminta</Th>
                        <Th modifiers={["centered"]}>Tarkkaillaan</Th>
                        <Th modifiers={["centered"]}>Ei tarkkailla</Th>
                      </Tr>
                    </TableHead>
                    <Tbody>
                      {(
                        Object.keys(smowlFrontCameraAlarmDraft.alarms) as Array<
                          keyof typeof smowlFrontCameraAlarmDraft.alarms
                        >
                      ).map((alarmKey) => {
                        const allowed = isFrontCameraAlarmAllowed(alarmKey);
                        const disabled =
                          !smowlActivityDraft?.enabled ||
                          !smowlActivityDraft?.FrontCamera ||
                          loadingExamResults ||
                          hasProctoredData;

                        return (
                          <Tr key={alarmKey}>
                            <Td modifiers={["left"]}>
                              <div className="material-editor__smowl-option-title">
                                {getFrontCameraAlarmLabel(alarmKey)}
                              </div>
                              <div className="material-editor__smowl-option-description">
                                {getFrontCameraAlarmDescription(alarmKey)}
                              </div>
                            </Td>

                            <Td modifiers={["centered"]}>
                              <span className="form-element form-element--smowl">
                                <input
                                  type="radio"
                                  name={`alarm-${alarmKey}`}
                                  checked={allowed}
                                  disabled={disabled}
                                  onChange={() => {
                                    if (!allowed)
                                      toggleFrontCameraAlarm(alarmKey);
                                  }}
                                  aria-label={`Set ${getFrontCameraAlarmLabel(alarmKey)} on`}
                                />
                              </span>
                            </Td>

                            <Td modifiers={["centered"]}>
                              <span className="form-element form-element--smowl">
                                <input
                                  type="radio"
                                  name={`alarm-${alarmKey}`}
                                  checked={!allowed}
                                  disabled={disabled}
                                  onChange={() => {
                                    if (allowed)
                                      toggleFrontCameraAlarm(alarmKey);
                                  }}
                                  aria-label={`Set ${getFrontCameraAlarmLabel(alarmKey)} off`}
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
              Valvontasovellus vaaditaan
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
                          <Th modifiers={["left"]}>Tarkkailtava toiminta</Th>
                          <Th modifiers={["centered"]}>Tarkkaillaan</Th>
                          <Th modifiers={["centered"]}>Ei tarkkailla</Th>
                        </Tr>
                      </TableHead>

                      <Tbody>
                        {(
                          Object.keys(
                            smowlComputerMonitoringAlarmDraft.alarms
                              .allowed_actions
                          ) as Array<ComputerMonitoringAllowedActions>
                        ).map((alarmKey) => {
                          const allowed = isComputerMonitoringAlarmAllowed(
                            "allowed_actions",
                            alarmKey
                          );
                          const disabled =
                            !smowlActivityDraft?.enabled ||
                            !smowlActivityDraft?.ComputerMonitoring ||
                            loadingExamResults ||
                            hasProctoredData;

                          return (
                            <Tr key={alarmKey}>
                              <Td modifiers={["left"]}>
                                <div className="material-editor__smowl-option-title">
                                  {getComputerMonitoringActionLabel(alarmKey)}
                                </div>
                                <div className="material-editor__smowl-option-description">
                                  {getComputerMonitoringActionDescription(
                                    alarmKey
                                  )}
                                </div>
                              </Td>

                              <Td modifiers={["centered"]}>
                                <span className="form-element form-element--smowl">
                                  <input
                                    type="radio"
                                    name={`cm-action-${alarmKey}`}
                                    checked={allowed}
                                    disabled={disabled}
                                    onChange={() => {
                                      if (!allowed)
                                        toggleComputerMonitoringAlarm(
                                          "allowed_actions",
                                          alarmKey
                                        );
                                    }}
                                    aria-label={`Set ${getComputerMonitoringActionLabel(alarmKey)} on`}
                                  />
                                </span>
                              </Td>

                              <Td modifiers={["centered"]}>
                                <span className="form-element form-element--smowl">
                                  <input
                                    type="radio"
                                    name={`cm-action-${alarmKey}`}
                                    checked={!allowed}
                                    disabled={disabled}
                                    onChange={() => {
                                      if (allowed)
                                        toggleComputerMonitoringAlarm(
                                          "allowed_actions",
                                          alarmKey
                                        );
                                    }}
                                    aria-label={`Set ${getComputerMonitoringActionLabel(alarmKey)} off`}
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
                            Tarkkailtavat sovellukset
                          </Th>
                          <Th modifiers={["centered"]}>Tarkkaillaan</Th>
                          <Th modifiers={["centered"]}>Ei tarkkailla</Th>
                        </Tr>
                      </TableHead>

                      <Tbody>
                        {(
                          Object.keys(
                            smowlComputerMonitoringAlarmDraft.alarms
                              .allowed_programs
                          ) as Array<ComputerMonitoringAllowedPrograms>
                        ).map((alarmKey) => {
                          const allowed = isComputerMonitoringAlarmAllowed(
                            "allowed_programs",
                            alarmKey
                          );
                          const disabled =
                            !smowlActivityDraft?.enabled ||
                            !smowlActivityDraft?.ComputerMonitoring ||
                            loadingExamResults ||
                            hasProctoredData;

                          return (
                            <Tr key={alarmKey}>
                              <Td modifiers={["left"]}>
                                <div className="material-editor__smowl-option-title">
                                  {getComputerMonitoringProgramLabel(alarmKey)}
                                </div>
                                <div className="material-editor__smowl-option-description">
                                  {getComputerMonitoringProgramDescription(
                                    alarmKey
                                  )}
                                </div>
                              </Td>

                              <Td modifiers={["centered"]}>
                                <span className="form-element form-element--smowl">
                                  <input
                                    type="radio"
                                    name={`cm-program-${alarmKey}`}
                                    checked={allowed}
                                    disabled={disabled}
                                    onChange={() => {
                                      if (!allowed)
                                        toggleComputerMonitoringAlarm(
                                          "allowed_programs",
                                          alarmKey
                                        );
                                    }}
                                    aria-label={`Set ${getComputerMonitoringProgramLabel(alarmKey)} on`}
                                  />
                                </span>
                              </Td>

                              <Td modifiers={["centered"]}>
                                <span className="form-element form-element--smowl">
                                  <input
                                    type="radio"
                                    name={`cm-program-${alarmKey}`}
                                    checked={!allowed}
                                    disabled={disabled}
                                    onChange={() => {
                                      if (allowed)
                                        toggleComputerMonitoringAlarm(
                                          "allowed_programs",
                                          alarmKey
                                        );
                                    }}
                                    aria-label={`Set ${getComputerMonitoringProgramLabel(alarmKey)} off`}
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
