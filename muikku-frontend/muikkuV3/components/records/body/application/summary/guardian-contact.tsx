import * as React from "react";
import { Guardian } from "~/generated/client";
import GuardianPermissionsDialog from "~/components/profile/dialogs/guardian-permissions";
import Link from "~/components/general/link";
import { useTranslation } from "react-i18next";
import { getName } from "~/util/modifiers";
import ContactCard, { ContactState } from "~/components/general/contact-card";

/**
 * GuardianContactProps
 */
interface GuardianContactProps {
  guardian: Guardian;
  studentIdentifier: string;
  isUnder18: boolean;
}

/**
 * Guardian
 * @param props
 * @returns JSX.Element
 */
const GuardianContact: React.FC<GuardianContactProps> = (props) => {
  const { guardian, studentIdentifier, isUnder18 } = props;
  const { t } = useTranslation();
  const guardianState: ContactState = guardian.continuedViewPermission
    ? {
        modifier: "APPROVED",
        icon: "icon-thumb-up",
        text: t("labels.hasContinuedViewPermission", {
          ns: "users",
        }),
      }
    : {
        modifier: "DENIED",
        icon: "icon-cross",
        text: t("labels.noContinuedViewPermission", {
          ns: "users",
        }),
      };
  const guardianActions = (
    <GuardianPermissionsDialog
      guardian={guardian}
      userIdentifier={studentIdentifier}
    >
      <Link className="link">
        {t("actions.editPermissions", {
          ns: "users",
        })}
      </Link>
    </GuardianPermissionsDialog>
  );

  return (
    <ContactCard
      key={studentIdentifier}
      actions={!isUnder18 && guardianActions}
      fullName={getName(guardian, true)}
      state={!isUnder18 && guardianState}
    />
  );
};

export default GuardianContact;
