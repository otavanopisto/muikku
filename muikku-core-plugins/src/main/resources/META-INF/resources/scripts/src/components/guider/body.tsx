import MainFunctionNavbar from "~/components/base/main-function/navbar";
import Application from "./body/application";
import Aside from "./body/aside";

import * as React from "react";
import { useTranslation } from "react-i18next";

/**
 * GuiderBodyProps
 */
interface GuiderBodyProps {}

/**
 * GuiderBody
 * @param props props
 */
const GuiderBody = (props: GuiderBodyProps) => {
  const { t } = useTranslation("common");

  const aside = <Aside />;
  return (
    <div>
      <MainFunctionNavbar
        title={t("labels.guider")}
        activeTrail="guider"
        navigation={aside}
      />
      <Application aside={aside} />
    </div>
  );
};

export default GuiderBody;
