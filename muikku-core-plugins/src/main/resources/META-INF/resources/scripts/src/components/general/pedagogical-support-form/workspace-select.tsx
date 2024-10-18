import * as React from "react";
import { connect } from "react-redux";
import Select from "react-select";
import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import { OptionDefault } from "../react-select/types";
import { useWorkspaces } from "./hooks/useWorkspaces";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import { useTranslation } from "react-i18next";
import { PedagogyWorkspace } from "~/generated/client";
import { Action, Dispatch } from "redux";

/**
 * WorkspaceSelectProps
 */
interface WorkspaceSelectProps {
  /**
   * Selected value
   */
  selectedValue?: OptionDefault<PedagogyWorkspace>;
  /**
   * On change
   */
  onChange: (selectedWorkspace?: OptionDefault<PedagogyWorkspace>) => void;
  /**
   * If select is disabled
   */
  disabled: boolean;
  /**
   * Student identifier
   */
  studentIdentifier: string;
  id: string;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * WorkspaceSelect
 * @param props props
 */
const WorkspaceSelect: React.FC<WorkspaceSelectProps> = (props) => {
  const { t } = useTranslation(["pedagogySupportPlan", "common"]);
  const {
    selectedValue,
    id,
    onChange,
    disabled,
    displayNotification,
    studentIdentifier,
  } = props;
  const { workspaces, loadingWorkspaces, handleTextInput } = useWorkspaces(
    studentIdentifier,
    displayNotification
  );

  /**
   * handleSelectChange
   * @param option option
   */
  const handleSelectChange = (option: OptionDefault<PedagogyWorkspace>) => {
    onChange(option);
  };

  const options: OptionDefault<PedagogyWorkspace>[] = workspaces.map(
    (workspace) => ({
      value: workspace,
      label: workspace.nameExtension
        ? `${workspace.name} (${workspace.nameExtension}))`
        : workspace.name,
    })
  );

  return (
    <Select
      id={id}
      className="react-select-override react-select-override--hops"
      classNamePrefix="react-select-override"
      isClearable
      placeholder={t("labels.search", {
        ns: "pedagogySupportPlan",
        context: "course",
      })}
      options={options}
      value={selectedValue}
      onChange={handleSelectChange}
      onInputChange={handleTextInput}
      noOptionsMessage={() =>
        t("content.empty", { ns: "common", context: "courses" })
      }
      isLoading={loadingWorkspaces}
      isDisabled={disabled}
    />
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {};
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return {
    displayNotification,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkspaceSelect);
