import React from "react";
import { useSelector } from "react-redux";
import { StateType } from "~/reducers";
import { useTranslation } from "react-i18next";
import "~/sass/elements/item-list.scss";
import Link from "~/components/general/link";
import GuardianPermissionsDialog from "~/components/profile/dialogs/guardian-permissions";
import ContactPermissionsDialog from "~/components/profile/dialogs/contact-permissions";
import ContactCard from "~/components/general/contact-card";
import { getName } from "~/util/modifiers";
/**
 * Guardians component props.
 */
interface GuardiansProps {}

/**
 * Renders the student's guardians list.
 */
const Guardians: React.FC<GuardiansProps> = () => {
  const { t } = useTranslation();
  const { guardians, others } = useSelector(
    (state: StateType) => state.contacts
  );
  const { profile, status } = useSelector((state: StateType) => state);

  if (!profile || !status.profile) {
    return null;
  }
  if (profile.location !== "guardians") {
    return null;
  }

  return (
    <div>
      {guardians.list.length > 0 && (
        <>
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
                ? t("labels.hasContinuedViewPermission", {
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
                  fullName={getName(guardian, true)}
                  state={guardianState}
                />
              );
            })}
          </div>
        </>
      )}
      {others.list.length > 0 && (
        <>
          <h2>{t("labels.contactInfo", { ns: "users" })}</h2>
          <div className="item-list item-list--student-guardians">
            {others.list.map((contact, index) => {
              const actions = (
                <ContactPermissionsDialog
                  contact={contact}
                  userIdentifier={status.userSchoolDataIdentifier}
                >
                  <Link className="link">
                    {t("actions.editPermissions", {
                      ns: "users",
                    })}
                  </Link>
                </ContactPermissionsDialog>
              );

              const contactState = contact.allowStudyDiscussions
                ? t("labels.hasContinuedDiscussionPermission", {
                    ns: "users",
                  })
                : t("labels.noContinuedDiscussionPermission", {
                    ns: "users",
                  });

              if (profile.location !== "guardians" || !others.list) {
                return null;
              }
              return (
                <ContactCard
                  key={index}
                  actions={actions}
                  fullName={contact.name}
                  state={contactState}
                />
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Guardians;
