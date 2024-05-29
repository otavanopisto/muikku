import * as React from "react";
import { useTranslation } from "react-i18next";

/**
 * WorkspaceSignupGroups
 */
interface ManagementChatSettingsProps {
  chatEnabled: boolean;
  onChange?: (chatEnabled: boolean) => void;
}

/**
 * WorkspaceSignupGroup
 * @param props props
 */
const ManagementChatSettings = (props: ManagementChatSettingsProps) => {
  const { chatEnabled, onChange } = props;

  const { t } = useTranslation(["workspace"]);

  /**
   * setWorkspaceChatTo
   * @param e e
   */
  const handleWorkspaceChatChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (onChange) {
      onChange(e.currentTarget.checked);
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
                  type="checkbox"
                  checked={chatEnabled}
                  onChange={handleWorkspaceChatChange}
                />
                <label htmlFor="chatEnabled">
                  {t("labels.chatEnabled", { ns: "workspace" })}
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
