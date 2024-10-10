import MainFunctionNavbar from "../base/main-function/navbar";
import Application from "./body/application";
import * as React from "react";
import ScreenContainer from "~/components/general/screen-container";
import { useTranslation } from "react-i18next";

/**
 * GuardianBody
 */
const GuardianBody = () => {
  const { t } = useTranslation("common");

  return (
    <div>
      <MainFunctionNavbar
        title={t("labels.dependant", { count: 0 })}
        activeTrail="guardian"
      />
      <ScreenContainer>
        <Application />
      </ScreenContainer>
    </div>
  );
};

export default GuardianBody;
