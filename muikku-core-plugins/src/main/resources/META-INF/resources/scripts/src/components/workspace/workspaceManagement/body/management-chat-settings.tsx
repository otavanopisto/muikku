import * as React from "react";
import { useTranslation } from "react-i18next";
import { WorkspaceChatStatus } from "~/generated/client";

/**
 * WorkspaceSignupGroups
 */
interface ManagementChatSettingsProps {
  chatStatus: WorkspaceChatStatus;
  onChange?: (chatStatus: WorkspaceChatStatus) => void;
}

/**
 * WorkspaceSignupGroup
 * @param props props
 */
const ManagementChatSettings = (props: ManagementChatSettingsProps) => {
  const { chatStatus, onChange } = props;

  const { t } = useTranslation(["workspace"]);

  /**
   * setWorkspaceChatTo
   * @param value value
   */
  const handleWorkspaceChatChange =
    (value: WorkspaceChatStatus) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) {
        onChange(value);
      }
    };

  return (
    <>
      <h2 className="application-sub-panel__header">{t("labels.chat")}</h2>
      <div className="application-sub-panel__body">
        <div className="form__row">
          <fieldset className="form__fieldset">
            <legend className="form__legend">
              {t("labels.chatStatus", { ns: "workspace" })}
            </legend>
            <div className="form__fieldset-content form__fieldset-content--horizontal">
              <div className="form-element form-element--checkbox-radiobutton">
                <input
                  id="chatEnabled"
                  name="chat-enabled"
                  type="radio"
                  checked={chatStatus === "ENABLED"}
                  onChange={handleWorkspaceChatChange("ENABLED")}
                />
                <label htmlFor="chatEnabled">
                  {t("labels.chatEnabled", { ns: "workspace" })}
                </label>
              </div>
              <div className="form-element form-element--checkbox-radiobutton">
                <input
                  id="chatDisabled"
                  name="chat-disabled"
                  type="radio"
                  checked={chatStatus === "DISABLED"}
                  onChange={handleWorkspaceChatChange("DISABLED")}
                />
                <label htmlFor="chatDisabled">
                  {t("labels.chatDisabled", { ns: "workspace" })}
                </label>
              </div>
            </div>
          </fieldset>
        </div>
      </div>
    </>
  );
};

export const ManagementChatSettingsMemoized = React.memo(
  ManagementChatSettings
);
