import React from "react";
import { useSelector } from "react-redux";
import { StateType } from "~/reducers";
import { useTranslation } from "react-i18next";
import "~/sass/elements/item-list.scss";
import GuardianContact from "~/components/records/body/application/summary/guardian-contact";
import OtherContact from "~/components/records/body/application/summary/other-contact";

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
      {others.list.length > 0 && (
        <>
          <h2 className="application-panel__content-header">
            {t("labels.contactInfo", { ns: "users" })}
          </h2>
          <div className="item-list item-list--student-guardians">
            {others.list.map((contact, index) => (
              <OtherContact
                key={contact.id}
                contact={contact}
                studentIdentifier={status.userSchoolDataIdentifier}
                isUnder18={status.isUnder18}
              />
            ))}
          </div>
        </>
      )}
      {guardians.list.length > 0 && (
        <>
          <h2 className="application-panel__content-header">
            {t("labels.guardians", { ns: "users" })}
          </h2>
          <div className="item-list item-list--student-guardians">
            {guardians.list.map((guardian, index) => (
              <GuardianContact
                key={guardian.identifier}
                guardian={guardian}
                studentIdentifier={status.userSchoolDataIdentifier}
                isUnder18={status.isUnder18}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Guardians;
