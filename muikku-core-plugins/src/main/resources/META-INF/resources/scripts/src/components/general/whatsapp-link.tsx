import * as React from "react";
import { IconButton } from "./button";

/**
 * WhatsappLinkProps
 */
interface WhatsappLinkProps {
  mobileNumber?: string;
}

/**
 * WhatsappLink
 * @param props props
 * @returns JSX.Element
 */
export const WhatsappLink: React.FC<WhatsappLinkProps> = (props) => {
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
    <IconButton
      icon="whatsapp"
      buttonModifiers="whatsapp-me"
      onClick={handleOpenLinkClick}
    />
  );
};
