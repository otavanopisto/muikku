import * as React from "react";
import { useTranslation } from "react-i18next";
import Avatar from "~/components/general/avatar";
import moment from "moment";
import { localize } from "~/locales/i18n";

/**
 * Component for displaying contact information for a student such as a counselor or a guardian.
 * It shows the person's name, profile picture, contact information, and any relevant labels (e.g., group counselor, study counselor).
 * It also handles displaying the vacation period if applicable.
 */
interface ContactCardProps {
  firstname: string;
  lastname: string;
  hasImage?: boolean;
  state?: string;
  actions?: React.ReactNode;
  email?: string;
  groupAdvisor?: boolean;
  id?: number;
  phone?: string;
  studyAdvisor?: boolean;
  vacationStart?: string;
  vacationEnd?: string;
}

/**
 * Component for displaying contact information for a student such as a counselor or a guardian.
 * @param props The properties for the ContactCard component.
 * @returns A React element representing the contact card.
 */
const ContactCard: React.FC<ContactCardProps> = (props) => {
  const {
    actions,
    firstname,
    lastname,
    id,
    hasImage,
    state,
    email,
    phone,
    groupAdvisor,
    studyAdvisor,
    vacationStart,
    vacationEnd,
  } = props;

  const { t } = useTranslation();
  let displayVacationPeriod = !!vacationStart;

  if (vacationEnd) {
    // we must check for the ending
    const vacationEndsAt = moment(vacationEnd);
    const today = moment();
    // if it's before or it's today then we display, otherwise nope
    displayVacationPeriod =
      vacationEndsAt.isAfter(today, "day") ||
      vacationEndsAt.isSame(today, "day");
  }

  return (
    <div
      className="item-list__item item-list__item--student-counselor"
      key={firstname}
    >
      <div className="item-list__profile-picture">
        <Avatar
          id={id ? id : Math.random() * 1000}
          userCategory={3}
          name={firstname}
          hasImage={hasImage}
        />
      </div>
      <div className="item-list__text-body item-list__text-body--multiline">
        <div className="item-list__user-name">
          {firstname} {lastname}
        </div>
        <div className="item-list__counselors labels">
          {groupAdvisor && (
            <span className="label">
              <span className="label__text">
                {t("labels.groupCounselor", {
                  ns: "users",
                })}
              </span>
            </span>
          )}
          {studyAdvisor && (
            <span className="label">
              <span className="label__text">
                {t("labels.studyCounselor", {
                  ns: "users",
                })}
              </span>
            </span>
          )}
        </div>
        <div className="item-list__user-state">{state}</div>
        <div className="item-list__user-contact-info">
          {email && (
            <div className="item-list__user-email">
              <div className="glyph icon-envelope"></div>
              {email}
            </div>
          )}
          {phone && (
            <div className="item-list__user-phone">
              <div className="glyph icon-phone"></div>
              {phone}
            </div>
          )}
        </div>
        {displayVacationPeriod && (
          <div className="item-list__user-vacation-period">
            {t("labels.status", {
              context: "xa",
            })}

            {localize.date(vacationStart)}
            {vacationEnd ? "–" + localize.date(vacationEnd) : null}
          </div>
        )}

        <div className="item-list__user-actions">{actions}</div>
      </div>
    </div>
  );
};

export default ContactCard;
