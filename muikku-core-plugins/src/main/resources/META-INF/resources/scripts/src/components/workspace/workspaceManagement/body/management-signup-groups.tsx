import * as React from "react";
import { useTranslation } from "react-i18next";
import CKEditor from "~/components/general/ckeditor";
import Dropdown from "~/components/general/dropdown";
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
      props.workspaceSignupGroups
        .map((permission) => {
          if (permission.signupMessage === null) {
            permission.signupMessage = {
              caption: "",
              content: "",
              enabled: false,
            };

            return permission;
          }

          return permission;
        })
        .filter((permission) =>
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

  const { t } = useTranslation(["workspace"]);

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

  /**
   * Handles workspace signup group message caption change
   * @param signupGroup signupGroup
   */
  const handleWorkspaceSignupGroupCaptionChange =
    (signupGroup: WorkspaceSignupGroup) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const updatedWorkspaceSignupGroup = {
        ...signupGroup,
        signupMessage: {
          ...signupGroup.signupMessage,
          caption: event.target.value,
        },
      };

      props.onChange(updatedWorkspaceSignupGroup);
    };

  /**
   * Handles workspace signup group message caption change
   * @param signupGroup signupGroup
   */
  const handleWorkspaceSignupGroupContentChange =
    (signupGroup: WorkspaceSignupGroup) => (text: string) => {
      const updatedWorkspaceSignupGroup = {
        ...signupGroup,
        signupMessage: {
          ...signupGroup.signupMessage,
          content: text,
        },
      };

      props.onChange(updatedWorkspaceSignupGroup);
    };

  /**
   * Handles workspace signup group enabled change
   * @param signupGroup signupGroup
   */
  const handleWorkspaceSignupGroupMessageToggle =
    (signupGroup: WorkspaceSignupGroup) => (event: React.ChangeEvent) => {
      const updatedWorkspaceSignupGroup = {
        ...signupGroup,
        signupMessage: {
          ...signupGroup.signupMessage,
          enabled: !signupGroup.signupMessage.enabled,
        },
      };

      props.onChange(updatedWorkspaceSignupGroup);
    };

  return (
    <details>
      <summary>
        <span className="form-element form-element--checkbox-radiobutton-inside-summary">
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

        <Dropdown
          modifier="instructions"
          openByHover
          alignSelfVertically="top"
          content={
            <p>
              {t("content.workspaceSignupGroupMessageInfo", {
                ns: "workspace",
              })}
            </p>
          }
        >
          <span>
            <label htmlFor="enable-signup-message" className="visually-hidden">
              {t("labels.activateSignupMessage", {
                ns: "workspace",
              })}
            </label>
            <input
              id="enable-signup-message"
              type="checkbox"
              className={`button-pill button-pill--autoreply-switch ${
                workspaceSignupGroup.signupMessage.enabled
                  ? "button-pill--autoreply-switch-active"
                  : ""
              }`}
              checked={workspaceSignupGroup.signupMessage.enabled}
              disabled={
                workspaceSignupGroup.signupMessage.caption === "" ||
                workspaceSignupGroup.signupMessage.content === ""
              }
              onChange={handleWorkspaceSignupGroupMessageToggle(
                workspaceSignupGroup
              )}
            />
          </span>
        </Dropdown>
      </summary>

      <div className="details__content">
        <div className="form__container">
          <div className="form__row">
            <div className="form-element form-element--sign-up-message">
              <label htmlFor="message-caption">
                {t("labels.workspaceSignupMessageTitle", {
                  ns: "workspace",
                })}
              </label>
              <input
                id="message-caption"
                className="form-element__input"
                value={workspaceSignupGroup.signupMessage.caption}
                onChange={handleWorkspaceSignupGroupCaptionChange(
                  workspaceSignupGroup
                )}
              />
            </div>
          </div>
          <div className="form__row">
            <div className="form-element form-element--sign-up-message">
              <label>
                {t("labels.workspaceSignupMessageContent", {
                  ns: "workspace",
                })}
              </label>
              <CKEditor
                editorTitle={t("labels.workspaceSignupMessageContent", {
                  ns: "workspace",
                })}
                ancestorHeight={200}
                onChange={handleWorkspaceSignupGroupContentChange(
                  workspaceSignupGroup
                )}
              >
                {workspaceSignupGroup.signupMessage.content}
              </CKEditor>
            </div>
          </div>
        </div>
      </div>
    </details>
  );
};

// Memoized component, using deepEqual to compare props for memoization
// so that the component is not re-rendered if the props are equal
const ManagementSignupGroupItemMemoized = React.memo(ManagementSignupGroupItem);
