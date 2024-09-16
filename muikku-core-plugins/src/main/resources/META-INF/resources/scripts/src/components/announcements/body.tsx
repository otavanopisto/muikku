import MainFunctionNavbar from "~/components/base/main-function/navbar";
import * as React from "react";
import Application from "./body/application";
import Aside from "./body/aside";
import { useTranslation } from "react-i18next";

/**
 * AnnouncementsBodyProps
 */
interface AnnouncementsBodyProps {}

/**
 * AnnouncerBody
 * @param props props
 */
const AnnouncementsBody = (props: AnnouncementsBodyProps) => {
  const { t } = useTranslation("messaging");

  /**
   * Component render method
   * @returns JSX.Element
   */
  const aside = <Aside />;
  return (
    <div>
      <MainFunctionNavbar
        title={t("labels.announcements")}
        activeTrail="announcements"
        navigation={aside}
      />
      <Application aside={aside} />
    </div>
  );
};

export default AnnouncementsBody;
