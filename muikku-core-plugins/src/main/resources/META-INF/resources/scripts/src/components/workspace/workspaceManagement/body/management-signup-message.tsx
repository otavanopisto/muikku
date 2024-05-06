import * as React from "react";
import { useTranslation } from "react-i18next";
import CKEditor from "~/components/general/ckeditor";
import Dropdown from "~/components/general/dropdown";
import { WorkspaceSignupMessage } from "~/generated/client";

/**
 * WorkspaceSignupGroups
 */
interface ManagementSignupMessageProps {
  workspaceName: string;
  workspaceSignupMessage: WorkspaceSignupMessage;
  onChange?: (workspaceSignupGroups: WorkspaceSignupMessage) => void;
}

/**
 * WorkspaceSignupGroup
 * @param props props
 */
const ManagementSignupMessage = (props: ManagementSignupMessageProps) => {
  const { workspaceSignupMessage, workspaceName, onChange } = props;

  const { t } = useTranslation(["workspace"]);

  /**
   * Handles signup group message save
   * @param e e
   */
  const handleWorkspaceSignupMessageCaptionChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = e.target;

    const updateWorkspaceSignupMessage = {
      ...workspaceSignupMessage,
      caption: value,
    };

    if (onChange) {
      onChange(updateWorkspaceSignupMessage);
    }
  };

  /**
   * Handles signup group message save
   * @param text text
   */
  const handleWorkspaceSignupMessageContentChange = (text: string) => {
    const updateWorkspaceSignupMessage = {
      ...workspaceSignupMessage,
      content: text,
    };

    if (onChange) {
      onChange(updateWorkspaceSignupMessage);
    }
  };

  /**
   * Handles signup group message toggle
   * @param e e
   */
  const handleWorkspaceSignupMessageToggle = (
    e: React.MouseEvent<HTMLInputElement, MouseEvent>
  ) => {
    const updateWorkspaceSignupMessage = {
      ...workspaceSignupMessage,
      enabled: !workspaceSignupMessage.enabled,
    };

    if (onChange) {
      onChange(updateWorkspaceSignupMessage);
    }
  };

  return (
    <>
      <h2 className="application-sub-panel__header">
        {t("labels.workspaceSignupMessage", {
          ns: "workspace",
        })}
        <Dropdown
          openByHover
          alignSelfVertically="top"
          content={
            <p>
              {t("content.workspaceSignupMessageInfo", {
                ns: "workspace",
              })}
            </p>
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
                workspaceSignupMessage.enabled
                  ? "button-pill--autoreply-switch-active"
                  : ""
              }`}
              checked={workspaceSignupMessage.enabled}
              disabled={
                workspaceSignupMessage.caption === "" ||
                workspaceSignupMessage.content === ""
              }
              onClick={handleWorkspaceSignupMessageToggle}
            />
          </span>
        </Dropdown>
      </h2>
      <div className="application-sub-panel__body">
        <div className="form__container">
          <div className="form__row">
            <div className="form-element">
              <label htmlFor="message-caption">
                {t("labels.workspaceSignupMessageTitle", {
                  ns: "workspace",
                })}
              </label>
              <input
                id="message-caption"
                placeholder={`Tervetuloa kurssille ${workspaceName}`}
                className="form-element__input"
                value={workspaceSignupMessage.caption}
                onChange={handleWorkspaceSignupMessageCaptionChange}
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
                ancestorHeight={200}
                onChange={handleWorkspaceSignupMessageContentChange}
              >
                {workspaceSignupMessage.content}
              </CKEditor>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const ManagementSignupMessageMemoized = React.memo(
  ManagementSignupMessage
);
