import * as React from "react";
import { useTranslation } from "react-i18next";
import CKEditor from "~/components/general/ckeditor";
import Dropdown from "~/components/general/dropdown";
import {
  WorkspaceSignupMessage,
  WorkspaceSignupMessageGroup,
} from "~/generated/client";
import InputSelectAutoFill from "~/components/base/input-select-autofill";
import { UiSelectItem } from "~/components/base/input-select-autofill";
import Button from "~/components/general/button";
/**
 * WorkspaceSignupGroups
 */
interface ManagementSignupMessageProps {
  signupGroups: WorkspaceSignupMessageGroup[];
  workspaceCustomSignupMessages: WorkspaceSignupMessage[];
  onChange?: (workspaceSignupGroups: WorkspaceSignupMessage[]) => void;
}

/**
 * WorkspaceSignupGroup
 * @param props props
 */
const ManagementCustomSignupMessage = (props: ManagementSignupMessageProps) => {
  const { workspaceCustomSignupMessages, signupGroups, onChange } = props;
  const [signupGroupSearchItems, setSignupGroupSearchItems] = React.useState<
    WorkspaceSignupMessageGroup[]
  >([]);
  const { t } = useTranslation(["workspace"]);

  /**
   *
   * @param signupGroups
   * @returns select items frp, signup groups
   */
  const translateToSelectItems = (
    signupGroups: WorkspaceSignupMessageGroup[]
  ): UiSelectItem[] =>
    signupGroups.map((signupGroup) => ({
      id: signupGroup.userGroupEntityId,
      label: signupGroup.userGroupName,
    }));

  /**
   * Creates a custom signup message
   * @param text text
   */
  const createWorkspaceSignupMessage = () => {
    const messages = workspaceCustomSignupMessages || [];

    onChange([
      ...messages,
      { caption: "", content: "", enabled: false, signupGroups: [] },
    ]);
  };

  /**
   * Delete a custom signup message
   * @param text text
   */
  const deleteWorkspaceSignupMessage = (index: number) => {
    const messages = [...workspaceCustomSignupMessages];

    messages.splice(index, 1);

    onChange(messages);
  };

  /**
   * Updates custom signup message
   * @param index index of the message
   * @param e event
   */
  const updateCustomSignupMessageCaption = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const updatedMessages =
      workspaceCustomSignupMessages &&
      workspaceCustomSignupMessages.map((message, i) =>
        i === index
          ? {
              ...message,
              caption: e.target.value,
              enabled: e.target.value.length === 0 ? false : message.enabled,
            }
          : message
      );

    onChange(updatedMessages);
  };

  /**
   * Updates custom signup message
   * @param index index of the message
   * @param text content text
   */
  const updateCustomSignupMessageContent = (index: number, text: string) => {
    const updatedMessages =
      workspaceCustomSignupMessages &&
      workspaceCustomSignupMessages.map((message, i) =>
        i === index
          ? {
              ...message,
              content: text,
              enabled: text.length === 0 ? false : message.enabled,
            }
          : message
      );

    onChange(updatedMessages);
  };

  /**
   * Handles signup group message toggle
   * @param index index of the message,
   * @param enabled overrides the default toggle functionality
   */
  const handleWorkspaceSignupMessageToggle = (
    index: number,
    enabled?: boolean
  ) => {
    const stateToSet =
      enabled !== undefined
        ? enabled
        : !workspaceCustomSignupMessages[index].enabled;

    const updateWorkspaceCustomSignupMessages =
      workspaceCustomSignupMessages &&
      workspaceCustomSignupMessages.map((message, i) =>
        i === index ? { ...message, enabled: stateToSet } : message
      );
    if (onChange) {
      onChange(updateWorkspaceCustomSignupMessages);
    }
  };

  /**
   * Handles message signup group selection. Adds if does not exist, removes if exists.
   * @param index index of the message,
   * @param selectedGroup selected group
   */
  const handleWorkspaceSignupMessageGroupSelect = (
    index: number,
    selectedGroup: UiSelectItem
  ) => {
    const newSignupGroup: WorkspaceSignupMessageGroup = {
      userGroupEntityId: selectedGroup.id as number,
      userGroupName: selectedGroup.label,
    };

    let signupGroups = workspaceCustomSignupMessages[index].signupGroups || [];

    const groupIsSelected = signupGroups.find(
      (group) => selectedGroup.id === group.userGroupEntityId
    );

    // If group is already selected, remove it, otherwise add it
    if (groupIsSelected) {
      signupGroups = signupGroups.filter(
        (group) => group.userGroupEntityId !== selectedGroup.id
      );
    } else {
      signupGroups = [
        ...(workspaceCustomSignupMessages[index].signupGroups || []),
        newSignupGroup,
      ];
    }

    // replace the existing with updated
    const updateWorkspaceCustomSignupMessages =
      workspaceCustomSignupMessages &&
      workspaceCustomSignupMessages.map((message, i) =>
        i === index
          ? {
              ...message,
              enabled: signupGroups.length === 0 ? false : message.enabled,
              signupGroups: signupGroups,
            }
          : message
      );

    if (onChange) {
      onChange(updateWorkspaceCustomSignupMessages);
    }
  };

  const groupLoader = (textInput: string) => {
    // Extract IDs of already selected groups
    const selectedGroupIds = workspaceCustomSignupMessages
      .map((message) => message.signupGroups || [])
      .reduce((acc, groups) => acc.concat(groups), [])
      .map((group) => group.userGroupEntityId);

    // Find groups that match the textinput, filter out groups that are already selected
    const filteredGroups = signupGroups.filter(
      (group) =>
        group.userGroupName.toLowerCase().includes(textInput.toLowerCase()) &&
        !selectedGroupIds.includes(group.userGroupEntityId)
    );

    setSignupGroupSearchItems(filteredGroups);
  };

  return (
    <>
      <h2 className="application-sub-panel__header">
        {t("labels.workspaceUserGroupSignupMessages", {
          ns: "workspace",
        })}
      </h2>
      <div className="application-sub-panel__body">
        <div className="form__container">
          {workspaceCustomSignupMessages &&
            workspaceCustomSignupMessages.map((customSignupMessage, index) => (
              <div key={index} className="form__row">
                <div className="form__row-header">
                  <h3 className="form__container-title">
                    {t("labels.workspaceUserGroupSignupMessage", {
                      ns: "workspace",
                      index: index + 1,
                    })}
                    <Dropdown
                      modifier="instructions"
                      openByHover
                      alignSelfVertically="top"
                      content={
                        <div>
                          {t("content.workspaceSignupGroupMessageInfo", {
                            ns: "workspace",
                          })}
                        </div>
                      }
                    >
                      <span>
                        <label
                          htmlFor="enable-workspace-signup-message"
                          className="visually-hidden"
                        >
                          {t("labels.activateSignupMessage", {
                            ns: "workspace",
                          })}
                        </label>
                        <input
                          id="enable-workspace-signup-message"
                          type="checkbox"
                          className={`button-pill button-pill--autoreply-switch ${
                            customSignupMessage.enabled
                              ? "button-pill--autoreply-switch-active"
                              : ""
                          }`}
                          checked={customSignupMessage.enabled}
                          disabled={
                            customSignupMessage.caption === "" ||
                            customSignupMessage.content === "" ||
                            customSignupMessage.signupGroups?.length === 0
                          }
                          onClick={() =>
                            handleWorkspaceSignupMessageToggle(index)
                          }
                        />
                      </span>
                    </Dropdown>
                  </h3>
                  <Dropdown
                    modifier="instructions"
                    openByHover
                    alignSelfVertically="top"
                    content={
                      <div>
                        {t("content.workspaceSignupGroupMessageDeleteInfo", {
                          ns: "workspace",
                        })}
                      </div>
                    }
                  >
                    <span>
                      <label
                        htmlFor="enable-workspace-signup-message"
                        className="visually-hidden"
                      >
                        {t("labels.deleteCustomSignupMessage", {
                          ns: "workspace",
                        })}
                      </label>
                      <Button
                        disabled={customSignupMessage.enabled}
                        onClick={() => deleteWorkspaceSignupMessage(index)}
                        className="button-pill button-pill--remove-custom-signup-message icon-trash"
                      />
                    </span>
                  </Dropdown>
                </div>
                <div className="form__row">
                  <div className="form-element">
                    <label htmlFor="message-caption">
                      {t("labels.workspaceSignupMessageTitle", {
                        ns: "workspace",
                      })}
                    </label>
                    <input
                      id="message-caption"
                      className="form-element__input"
                      value={customSignupMessage.caption}
                      onChange={(e) =>
                        updateCustomSignupMessageCaption(index, e)
                      }
                      style={{
                        width: "100%",
                      }}
                    />
                  </div>
                </div>
                <div className="form__row">
                  <div className="form-element">
                    <label>
                      {t("labels.workspaceSignupMessageContent", {
                        ns: "workspace",
                      })}
                    </label>
                    <CKEditor
                      editorTitle={t("labels.workspaceSignupMessageContent", {
                        ns: "workspace",
                      })}
                      onChange={(text: string) =>
                        updateCustomSignupMessageContent(index, text)
                      }
                    >
                      {customSignupMessage.content}
                    </CKEditor>
                  </div>
                </div>
                <div className="form__row">
                  <div className="form-element">
                    <InputSelectAutoFill
                      identifier="communicatorRecipients"
                      modifier="signupGroup"
                      loader={(text: string) => groupLoader(text)}
                      placeholder={t("labels.search_target", {
                        ns: "workspace",
                      })}
                      label={t("labels.target", {
                        ns: "workspace",
                      })}
                      searchItems={translateToSelectItems(
                        signupGroupSearchItems
                      )}
                      selectedItems={translateToSelectItems(
                        customSignupMessage.signupGroups || []
                      )}
                      onSelect={(select) =>
                        handleWorkspaceSignupMessageGroupSelect(index, select)
                      }
                      onDelete={(select) =>
                        handleWorkspaceSignupMessageGroupSelect(index, select)
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          <div className="form__row">
            <div className="form-element">
              <button
                className="button button--add-signup-message"
                onClick={() => {
                  createWorkspaceSignupMessage();
                }}
              >
                {t("actions.create", {
                  ns: "workspace",
                  context: "signupMessage",
                })}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const ManagementCustomSignupMessageMemoized = React.memo(
  ManagementCustomSignupMessage
);
