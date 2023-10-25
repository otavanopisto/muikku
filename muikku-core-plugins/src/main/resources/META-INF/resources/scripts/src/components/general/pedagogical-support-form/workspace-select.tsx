import * as React from "react";
import { connect, Dispatch } from "react-redux";
import Select from "react-select";
import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import { WorkspaceDataType } from "~/reducers/workspaces";
import { OptionDefault } from "../react-select/types";
import { useWorkspaces } from "./hooks/useWorkspaces";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";

/**
 * WorkspaceSelectProps
 */
interface WorkspaceSelectProps {
  /**
   * Selected value
   */
  selectedValue?: OptionDefault<WorkspaceDataType>;
  /**
   * On change
   */
  onChange: (selectedWorkspace?: OptionDefault<WorkspaceDataType>) => void;
  /**
   * If select is disabled
   */
  disabled: boolean;
  id: string;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * WorkspaceSelect
 * @param props props
 */
const WorkspaceSelect: React.FC<WorkspaceSelectProps> = (props) => {
  const { selectedValue, id, onChange, disabled, displayNotification } = props;
  const { workspaces, loadingWorkspaces, handleTextInput } =
    useWorkspaces(displayNotification);

  /**
   * handleSelectChange
   * @param option option
   */
  const handleSelectChange = (option: OptionDefault<WorkspaceDataType>) => {
    onChange(option);
  };

  const options: OptionDefault<WorkspaceDataType>[] = workspaces.map(
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
      placeholder="Etsi kursseja..."
      options={options}
      value={selectedValue}
      onChange={handleSelectChange}
      onInputChange={handleTextInput}
      noOptionsMessage={() => "Ei vaihtoehtoja"}
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
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return {
    displayNotification,
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(WorkspaceSelect);
