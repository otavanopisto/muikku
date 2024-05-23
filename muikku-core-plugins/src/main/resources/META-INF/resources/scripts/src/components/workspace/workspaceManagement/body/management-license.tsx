import * as React from "react";
import { useTranslation } from "react-i18next";
import LicenseSelector from "~/components/general/license-selector";

/**
 * WorkspaceSignupGroups
 */
interface ManagementLicenseProps {
  workspaceLicense: string;
  onChange?: (license: string) => void;
}

/**
 * WorkspaceSignupGroup
 * @param props props
 */
const ManagementLicense = (props: ManagementLicenseProps) => {
  const { workspaceLicense, onChange } = props;

  const { t } = useTranslation(["workspace"]);

  /**
   * setWorkspaceChatTo
   * @param value value
   */
  const handleUpdateWorkspaceLicenses = (value: string) => {
    if (onChange) {
      onChange(value);
    }
  };

  return (
    <>
      <h2 className="application-sub-panel__header">
        {t("labels.license", { ns: "workspace" })}
      </h2>
      <div className="application-sub-panel__body">
        <LicenseSelector
          wcagLabel="workspaceLicense"
          wcagDesc={t("wcag.workspaceLicense", { ns: "workspace" })}
          modifier="workspace-management"
          value={workspaceLicense}
          onChange={handleUpdateWorkspaceLicenses}
        />
      </div>
    </>
  );
};

export const ManagementLicenseMemoized = React.memo(ManagementLicense);
