import * as React from "react";
import Button, { ButtonPill } from "./button";
import { useTranslation } from "react-i18next";

/**
 * WhatsappLinkProps
 */
interface WhatsappLinkProps {
  mobileNumber?: string;
}

/**
 * WhatsappLink
 * @param props props
 * @returns React.JSX.Element
 */
export const WhatsappLink: React.FC<WhatsappLinkProps> = (props) => {
  const { t } = useTranslation(["profile", "common"]);
  const { mobileNumber } = props;

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
    if (mobileNumber) {
      // Regex expression to remove all characters which are NOT alphanumeric
      const number = mobileNumber.replace(/[^\w\s]/gi, "").replace(/ /g, "");

      const url = `https://web.whatsapp.com/send?phone=${number}`;

      window.open(url);
    }
  };

  return (
    <Button
      icon="whatsapp"
      buttonModifiers="whatsapp-me"
      onClick={handleOpenLinkClick}
    >
      {t("labels.whatsApp")}
    </Button>
  );
};

/**
 * WhatsappLink
 * @param props props
 * @returns React.JSX.Element
 */
export const WhatsappButtonLink: React.FC<WhatsappLinkProps> = (props) => {
  const { t } = useTranslation(["profile", "common"]);
  const { mobileNumber } = props;

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
    if (mobileNumber) {
      // Regex expression to remove all characters which are NOT alphanumeric
      const number = mobileNumber.replace(/[^\w\s]/gi, "").replace(/ /g, "");

      const url = `https://web.whatsapp.com/send?phone=${number}`;

      window.open(url);
    }
  };

  return (
    <ButtonPill
      aria-label={t("labels.whatsApp")}
      icon="whatsapp"
      title={t("labels.whatsApp")}
      buttonModifiers="whatsapp-me"
      onClick={handleOpenLinkClick}
    ></ButtonPill>
  );
};
