import MainFunctionNavbar from "../base/main-function/navbar";
import Application from "./body/application";
import Aside from "./body/aside";
import * as React from "react";
import { useTranslation } from "react-i18next";

/**
 * EvaluationBody
 */
const EvaluationBody = () => {
  const { t } = useTranslation("common");

  const aside = <Aside />;
  return (
    <div>
      <MainFunctionNavbar
        title={t("labels.coursepicker")}
        activeTrail="evaluation"
        navigation={aside}
      />
      <Application />
    </div>
  );
};

export default EvaluationBody;
