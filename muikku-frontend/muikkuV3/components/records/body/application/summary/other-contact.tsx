import * as React from "react";
import { UserContact } from "~/generated/client";
import Link from "~/components/general/link";
import { useTranslation } from "react-i18next";
import ContactCard, { ContactState } from "~/components/general/contact-card";
import ContactPermissionsDialog from "~/components/profile/dialogs/contact-permissions";
/**
 * ContactProps
 */
interface OtherContactProps {
  contact: UserContact;
  studentIdentifier: string;
  isUnder18: boolean;
}

/**
 * Contact
 * @param props
 * @returns JSX.Element
 */

const OtherContact: React.FC<OtherContactProps> = (props) => {
  const { contact, studentIdentifier, isUnder18 } = props;
  const { name, id, phoneNumber, email, contactType, allowStudyDiscussions } =
    contact;
  const { t } = useTranslation();
  const contactState: ContactState = allowStudyDiscussions
    ? {
        modifier: "APPROVED",
        icon: "icon-thumb-up",
        text: t("labels.hasContinuedDiscussionPermission", {
          ns: "users",
        }),
      }
    : {
        modifier: "DENIED",
        icon: "icon-cross",
        text: t("labels.noContinuedDiscussionPermission", {
          ns: "users",
        }),
      };

  const otherContactActions = (
    <ContactPermissionsDialog
      userIdentifier={studentIdentifier}
      contact={contact}
    >
      <Link className="link">
        {t("actions.editPermissions", {
          ns: "users",
        })}
      </Link>
    </ContactPermissionsDialog>
  );

  return (
    <ContactCard
      key={id}
      tag={contactType}
      actions={isUnder18 && otherContactActions}
      state={isUnder18 && contactState}
      fullName={name}
      streetAddress={contact.streetAddress}
      postalCode={contact.postalCode}
      city={contact.city}
      country={contact.country}
      id={id}
      email={email}
      phone={phoneNumber}
    />
  );
};

export default OtherContact;
