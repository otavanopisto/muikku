import MainFunctionNavbar from "~/components/base/main-function/navbar";
import Application from "./body/application";
import Aside from "./body/aside";

import * as React from "react";
import { useTranslation } from "react-i18next";

/**
 * CoursepickerBodyProps
 */
interface CoursepickerBodyProps {}

/**
 * CoursepickerBody
 * @param props props
 */
const CoursepickerBody = (props: CoursepickerBodyProps) => {
  const { t } = useTranslation("common");

  const aside = <Aside />;
  return (
    <div>
      <MainFunctionNavbar
        title={t("labels.coursepicker")}
        activeTrail="coursepicker"
        navigation={aside}
      />
      <Application aside={aside} />
    </div>
  );
};

export default CoursepickerBody;
