import React from "react";
import { useSelector } from "react-redux";
import { StateType } from "~/reducers";
import { useTranslation } from "react-i18next";
import "~/sass/elements/item-list.scss";
import Link from "~/components/general/link";
import GuardianPermissionsDialog from "~/components/profile/body/application/dialog/guardian-permissions";
import ContactCard from "~/components/general/contact-card";
/**
 * Guardians component props.
 */
interface GuardiansProps {}

/**
 * Renders the student's guardians list.
 */
const Guardians: React.FC<GuardiansProps> = () => {
  const { t } = useTranslation();
  const guardians = useSelector((state: StateType) => state.contacts.guardians);
  const { profile, status } = useSelector((state: StateType) => state);

  return (
    <div>
      <h2>{t("labels.guardians", { ns: "users" })}</h2>
      <div className="item-list item-list--student-guardians">
        {guardians.list.map((guardian, index) => {
          const actions = (
            <GuardianPermissionsDialog
              guardian={guardian}
              userIdentifier={status.userSchoolDataIdentifier}
            >
              <Link className="link">
                {t("actions.editPermissions", {
                  ns: "users",
                })}
              </Link>
            </GuardianPermissionsDialog>
          );

          const guardianState = guardian.continuedViewPermission
            ? t("labels.continuedViewPermission", {
                ns: "users",
              })
            : t("labels.noContinuedViewPermission", {
                ns: "users",
              });

          if (profile.location !== "guardians" || !guardians.list) {
            return null;
          }
          return (
            <ContactCard
              key={index}
              actions={actions}
              firstname={guardian.firstName}
              lastname={guardian.lastName}
              state={guardianState}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Guardians;
