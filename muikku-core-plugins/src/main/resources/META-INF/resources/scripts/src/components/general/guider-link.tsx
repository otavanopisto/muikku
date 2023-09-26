import * as React from "react";
import Link from "./link";
import { useTranslation } from "react-i18next";

/**
 * GuiderStudentLinkProps
 */
interface GuiderStudentLinkProps {
  schoolDataIdentifier: string;
}

/**
 * GuiderStudentLink
 * @param props props
 * @returns JSX.Element
 */
export const GuiderStudentLink: React.FC<GuiderStudentLinkProps> = (props) => {
  const { schoolDataIdentifier } = props;
  const { t } = useTranslation("guider");
  /**
   * handleOpenLinkClick
   */
  const handleOpenLinkClick = () => {
    onSubmit();
  };

  /**
   * onSubmit
   */
  const onSubmit = () => {
    const url = `https://${window.location.hostname}/guider#?c=${schoolDataIdentifier}`;

    window.open(url);
  };

  return (
    <Link
      aria-label={t("wcag.openStudent")}
      onClick={handleOpenLinkClick}
      className="link link--to-student-guider"
      href={`https://${window.location.hostname}/guider#?c=${schoolDataIdentifier}`}
      openInNewTab="_blank"
    >
      {t("actions.openStudent")}
    </Link>
  );
};
