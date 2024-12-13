import MainFunctionNavbar from "../base/main-function/navbar";
import Aside from "./body/aside";
import Application from "./body/application";
import * as React from "react";
import { useTranslation } from "react-i18next";

/**
 * ProfileBody
 */
const ProfileBody = () => {
  const { t } = useTranslation(["common"]);

  const aside = <Aside />;
  return (
    <div>
      <MainFunctionNavbar title={t("labels.personalInfo")} navigation={aside} />
      <Application aside={aside} />
    </div>
  );
};

export default ProfileBody;
