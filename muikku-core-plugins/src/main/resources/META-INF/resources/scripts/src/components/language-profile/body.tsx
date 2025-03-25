import MainFunctionNavbar from "~/components/base/main-function/navbar";
import * as React from "react";
import { useTranslation } from "react-i18next";
import Application from "./body/application";

/**
 * GuiderBodyProps
 */
interface GuiderBodyProps {}

/**
 * GuiderBody
 * @param props props
 */
const LanguageProfileBody = (props: GuiderBodyProps) => {
  const { t } = useTranslation("common");
  return (
    <div>
      <MainFunctionNavbar
        title={t("labels.languageProfile")}
        activeTrail="language-profile"
      />
      <Application />
    </div>
  );
};

export default LanguageProfileBody;
