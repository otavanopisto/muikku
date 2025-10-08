import * as React from "react";
import { useTranslation } from "react-i18next";
import DisplayLanguages from "./components/language-profile-data-displayer";
import { StateType } from "~/reducers";
import { ActionType } from "~/actions";
import { useDispatch, useSelector } from "react-redux";
import { LanguageData } from "~/@types/shared";
import { LanguageProfileLanguage } from "~/reducers/main-function/language-profile";
import MApi, { isMApiError } from "~/api/api";
import { useEffect } from "react";
import Select from "react-select";
import { OptionDefault } from "~/components/general/react-select/types";
import { displayNotification } from "~/actions/base/notifications";
import Button from "~/components/general/button";
import PromptDialog from "~/components/general/prompt-dialog";

const recordsApi = MApi.getRecordsApi();

/**
 * AccomplishmentEvaluation component
 * This component displays the accomplishment evaluation for each language
 * @returns JSX element that displays the accomplishment evaluation section
 */
const AccomplishmentEvaluation = () => {
  const { t } = useTranslation(["languageProfile"]);
  const dispatch = useDispatch();
  const { languageProfile, status } = useSelector((state: StateType) => state);
  const [passedWorkspaces, setPassedWorkspaces] = React.useState<
    LanguageData[]
  >([]);

  const languages = languageProfile.data.languages;

  useEffect(() => {
    /**
     * fetchData
     * Fetches the passed workspaces from the API and sets them in the state
     */
    const fetchData = async () => {
      try {
        const workspaceActivity = await recordsApi.getWorkspaceActivity({
          identifier: status.userSchoolDataIdentifier,
          includeTransferCredits: "true",
        });

        const workspaceData = workspaceActivity.activities
          .filter((a) => a.assessmentStates.some((state) => state.passingGrade))
          .map((workspace) => ({
            identifier: workspace.identifier
              ? workspace.identifier
              : workspace.name.toLowerCase().replace(/[^a-z0-9]/g, "-"), // Fallback if identifier is missing, sanitizes the name
            name: workspace.name,
          }));

        setPassedWorkspaces(workspaceData);
      } catch (error) {
        if (isMApiError(error)) {
          throw error;
        } else {
          dispatch(
            displayNotification(
              t("notifications.loadError", {
                ns: "languageProfile",
                context: "workspaces",
                error: error,
              }),
              "error"
            )
          );
        }
      }
    };
    fetchData();
  }, [t, dispatch, status.userSchoolDataIdentifier]);

  /**
   * createRows
   * @param language the language profile language
   * @returns an array of rows for the DisplayLanguages component
   */
  const createRows = (language: LanguageProfileLanguage) => {
    const workspaces = language.workspaces || [];
    return workspaces.map((workspace) => ({
      identifier: workspace.identifier,
      name: workspace.name,
      code: language.code,
    }));
  };

  /**
   * accomplishmentEvaluationSelect
   * @param code the language code
   * @param cellId the cell ID for the radio input
   * @param rowId the row ID for the radio input
   * @param index the index of the evaluation option
   * @param identifier the row ID for the radio input
   * @returns a radio input for selecting an accomplishment evaluation
   */
  const accomplishmentEvaluationSelect = (
    code: string,
    cellId: string,
    rowId: string,
    index: number,
    identifier: string
  ) => {
    const isChecked = languages.some(
      (language) =>
        language.code === code &&
        language.workspaces?.some(
          (workspace) =>
            workspace.identifier === identifier &&
            workspace.value === (index + 1).toString()
        )
    );
    return (
      <input
        type="radio"
        className="language-profile__input"
        checked={isChecked}
        onChange={(e) => handleAccomplishmentEvaluation(e, code, identifier)}
        name={rowId}
        value={(index + 1).toString()}
      />
    );
  };

  /**
   * handleAccomplishmentEvaluation
   * @param e event
   * @param code language code
   * @param identifier the row ID for the radio input
   */
  const handleAccomplishmentEvaluation = (
    e: React.ChangeEvent<HTMLInputElement>,
    code: string,
    identifier: string
  ) => {
    dispatch({
      type: "LANGUAGE_PROFILE_UPDATE_LANGUAGE_WORKSPACE_VALUE",
      payload: {
        code,
        identifier,
        value: e.target.value,
      },
    } as ActionType);
  };

  /**
   * handleRemoveWorkspace
   * @param workspace workspace to remove
   */
  const handleRemoveWorkspace = (workspace: LanguageData) => {
    dispatch({
      type: "LANGUAGE_PROFILE_REMOVE_LANGUAGE_WORKSPACE",
      payload: {
        code: workspace.code,
        identifier: workspace.identifier,
      },
    } as ActionType);
  };

  /**
   * removeWorkspace
   * @param workspace the workspace to remove
   */
  const removeWorkspace = (workspace: LanguageData) => (
    <PromptDialog
      title={t("labels.remove", {
        context: "workspace",
        workspace: workspace.name,
      })}
      content={t("content.removing", {
        context: "workspace",
      })}
      onExecute={() => handleRemoveWorkspace(workspace)}
    >
      <Button buttonModifiers={["remove-language"]} icon="trash" />
    </PromptDialog>
  );

  /**
   * handleAddLanguage
   * @param value the value of the new language to add
   * @param code the language code
   */
  const handleAddLanguageWorkspace = (value: string, code: string) => {
    const workspace = passedWorkspaces.find(
      (workspace) => workspace.identifier === value
    );

    dispatch({
      type: "LANGUAGE_PROFILE_ADD_LANGUAGE_WORKSPACE",
      payload: {
        code: code,
        identifier: value,
        name: workspace.name,
        value: "",
      },
    } as ActionType);
  };

  const workspaceOptions: OptionDefault<string>[] = passedWorkspaces.map(
    (workspace) => ({
      value: workspace.identifier,
      label: workspace.name,
    })
  );
  return (
    <div className="language-profile-container">
      <fieldset className="language-profile-container__fieldset">
        <legend className="language-profile-container__subheader">
          {t("labels.courseLearning", {
            ns: "languageProfile",
          })}
        </legend>
        <div className="language-profile-container__fieldset-description">
          {t("content.courseLearning", {
            ns: "languageProfile",
          })}
        </div>
        <div className="language-profile-container__fieldset-description language-profile-container__fieldset-description--table-legend">
          {t("content.courseLearningLevels", {
            ns: "languageProfile",
          })}
        </div>
        {languages.map((language) => (
          <div key={language.code}>
            <DisplayLanguages
              key={language.code}
              rows={createRows(language)}
              cellAction={accomplishmentEvaluationSelect}
              columnAction={removeWorkspace}
              modifier="evaluate-workspaces"
              labels={Array.from(Array(5).keys()).map((i) =>
                (i + 1).toString()
              )}
              title={language.name}
            />
            <Select
              isDisabled={passedWorkspaces.length === 0}
              placeholder={t("labels.addPassedWorkspace", {
                ns: "languageProfile",
              })}
              className="react-select-override react-select-override--language-profile-form"
              classNamePrefix="react-select-override"
              onChange={(option) =>
                handleAddLanguageWorkspace(option.value, language.code)
              }
              options={workspaceOptions}
            />
          </div>
        ))}
      </fieldset>
    </div>
  );
};

export default AccomplishmentEvaluation;
