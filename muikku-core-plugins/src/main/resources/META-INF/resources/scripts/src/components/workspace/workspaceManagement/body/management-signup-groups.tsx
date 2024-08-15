import * as React from "react";
import { useTranslation } from "react-i18next";
import { SearchFormElement } from "~/components/general/form-element";
import { WorkspaceSignupGroup } from "~/generated/client";
import { filterHighlight, filterMatch } from "~/util/modifiers";

/**
 * WorkspaceSignupGroups
 */
interface ManagementSignupGroupsProps {
  workspaceName: string;
  workspaceSignupGroups: WorkspaceSignupGroup[];
  /**
   * Handle signup group change
   * @param workspaceSignupGroup workspaceSignupGroup
   */
  onChange?: (workspaceSignupGroup: WorkspaceSignupGroup) => void;
}

/**
 * WorkspaceSignupGroup
 * @param props props
 */
const ManagementSignupGroups = (props: ManagementSignupGroupsProps) => {
  const { t } = useTranslation(["workspace"]);
  const { onChange } = props;
  const [workspaceSignupGroupFilter, setWorkspaceSignupGroupFilter] =
    React.useState<string>("");

  /**
   * Handles workspaceSignupGroupFilter change
   * @param workspaceSignupGroupFilter workspaceSignupGroupFilter
   */
  const handleFilterChange = (workspaceSignupGroupFilter: string) => {
    setWorkspaceSignupGroupFilter(workspaceSignupGroupFilter);
  };

  // Expensive operation, memoize the list
  const memoizedList = React.useMemo(
    () =>
      props.workspaceSignupGroups.filter((permission) =>
          filterMatch(permission.userGroupName, workspaceSignupGroupFilter)
        )
        .sort((a, b) => a.userGroupName.localeCompare(b.userGroupName)),
    [props.workspaceSignupGroups, workspaceSignupGroupFilter]
  );

  return (
    <>
      <h2 className="application-sub-panel__header">
        {t("labels.signUpRights", { ns: "workspace" })}
      </h2>
      <div className="application-sub-panel__body">
        <div className="form__row">
          <SearchFormElement
            delay={0}
            id="workspacePermissions"
            modifiers="subpanel-search"
            name="workspace-permissions"
            placeholder={t("labels.search", {
              ns: "users",
              context: "userGroups",
            })}
            value={workspaceSignupGroupFilter}
            updateField={handleFilterChange}
          />
        </div>

        <div className="form__row">
          <fieldset className="form__fieldset">
            <legend className="form__legend">
              {t("labels.userGroups", { ns: "users" })}
            </legend>
            <div className="form__fieldset-content form__fieldset-content--vertical">
              {memoizedList.map((permission) => (
                <ManagementSignupGroupItemMemoized
                  key={permission.userGroupEntityId}
                  workspaceName={props.workspaceName}
                  workspaceSignupGroup={permission}
                  workspaceSignupGroupFilter={workspaceSignupGroupFilter}
                  onChange={onChange}
                />
              ))}
            </div>
          </fieldset>
        </div>
      </div>
    </>
  );
};

export const ManagementSignupGroupsMemoized = React.memo(
  ManagementSignupGroups
);

/**
 * WorkspaceSignupGroupItem
 */
interface ManagementSignupGroupItem {
  workspaceName: string;
  workspaceSignupGroup: WorkspaceSignupGroup;
  workspaceSignupGroupFilter: string;
  onChange: (signupGroup: WorkspaceSignupGroup) => void;
}

/**
 * WorkspaceSignupGroupItem
 * @param props props
 */
const ManagementSignupGroupItem = (props: ManagementSignupGroupItem) => {
  const { workspaceSignupGroup } = props;

  /**
   * Handles toggle
   * @param event event
   */
  const handleToggleWorkspaceSignupGroup = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedWorkspaceSignupGroup = {
      ...workspaceSignupGroup,
      canSignup: event.target.checked,
    };

    props.onChange(updatedWorkspaceSignupGroup);
  };

  return (
      <div>
        <span className="form-element form-element--checkbox-radiobutton">
          <input
            id={`usergroup${workspaceSignupGroup.userGroupEntityId}`}
            type="checkbox"
            checked={workspaceSignupGroup.canSignup}
            onChange={handleToggleWorkspaceSignupGroup}
          />

          <label htmlFor={`usergroup${workspaceSignupGroup.userGroupEntityId}`}>
            {filterHighlight(
              workspaceSignupGroup.userGroupName,
              props.workspaceSignupGroupFilter
            )}
          </label>
        </span>
      </div>  );

};

// Memoized component, using deepEqual to compare props for memoization
// so that the component is not re-rendered if the props are equal
const ManagementSignupGroupItemMemoized = React.memo(ManagementSignupGroupItem);
