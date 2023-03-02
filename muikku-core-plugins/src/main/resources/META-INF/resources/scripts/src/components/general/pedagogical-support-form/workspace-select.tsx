import * as React from "react";
import { connect, Dispatch } from "react-redux";
import Select from "react-select";
import { AnyActionType } from "~/actions";
import { StateType } from "~/reducers";
import { WorkspaceType } from "~/reducers/workspaces";
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
  selectedValue?: OptionDefault<WorkspaceType>;
  /**
   * On change
   */
  onChange: (selectedWorkspace?: OptionDefault<WorkspaceType>) => void;
  /**
   * If select is disabled
   */
  disabled: boolean;
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * WorkspaceSelect
 * @param props props
 */
const WorkspaceSelect: React.FC<WorkspaceSelectProps> = (props) => {
  const { workspaces, loadingWorkspaces, handleTextInput } = useWorkspaces(
    props.displayNotification
  );

  /**
   * handleSelectChange
   * @param option option
   */
  const handleSelectChange = (option: OptionDefault<WorkspaceType>) => {
    props.onChange(option);
  };

  const options: OptionDefault<WorkspaceType>[] = workspaces.map(
    (workspace) => ({
      value: workspace,
      label: workspace.name,
    })
  );

  return (
    <Select
      isClearable
      placeholder="Search workspaces..."
      options={options}
      value={props.selectedValue}
      onChange={handleSelectChange}
      onInputChange={handleTextInput}
      noOptionsMessage={() => "No workspaces Found"}
      isLoading={loadingWorkspaces}
      isDisabled={props.disabled}
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
