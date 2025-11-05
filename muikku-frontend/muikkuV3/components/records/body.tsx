import MainFunctionNavbar from "../base/main-function/navbar";
import Application from "./body/application";
import * as React from "react";
import ScreenContainer from "~/components/general/screen-container";
import { useTranslation } from "react-i18next";

/**
 * RecordsBody
 */
const RecordsBody = () => {
  const { t } = useTranslation(["common"]);

  return (
    <div>
      <MainFunctionNavbar title={t("labels.studies")} activeTrail="records" />
      <ScreenContainer>
        <Application />
      </ScreenContainer>
    </div>
  );
};

export default RecordsBody;
