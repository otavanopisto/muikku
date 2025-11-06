import MainFunctionNavbar from "~/components/base/main-function/navbar";
import * as React from "react";
import Application from "./body/application";
import Aside from "./body/aside";
import { useTranslation } from "react-i18next";

/**
 * AnnouncerBodyProps
 */
interface AnnouncerBodyProps {}

/**
 * AnnouncerBody
 * @param props props
 */
const AnnouncerBody = (props: AnnouncerBodyProps) => {
  const { t } = useTranslation("common");

  const aside = <Aside />;
  return (
    <div>
      <MainFunctionNavbar
        title={t("labels.announcer")}
        activeTrail="announcer"
        navigation={aside}
      />
      <Application aside={aside} />
    </div>
  );
};

export default AnnouncerBody;
