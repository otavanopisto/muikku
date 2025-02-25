/* eslint-disable react/no-string-refs */

import MainFunctionNavbar from "~/components/base/main-function/navbar";
import * as React from "react";
import { useTranslation } from "react-i18next";
import NotFoundApplication from "./body/application";

/**
 * CommunicatorBody
 */
const NotFoundBody = () => {
  const { t } = useTranslation("common");

  return (
    <div>
      <MainFunctionNavbar title="404" activeTrail="404" />
      <NotFoundApplication />
    </div>
  );
};

export default NotFoundBody;
