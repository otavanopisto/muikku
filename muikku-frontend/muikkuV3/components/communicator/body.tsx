/* eslint-disable react/no-string-refs */

/**
 * Deprecated refs should be refactored
 */

import MainFunctionNavbar from "~/components/base/main-function/navbar";
import Application, { CommunicatorApplicationRef } from "./body/application";
import Aside from "./body/aside";

import * as React from "react";
import { useTranslation } from "react-i18next";

/**
 * CommunicatorBody
 */
const CommunicatorBody = () => {
  const ref = React.useRef<CommunicatorApplicationRef>(null);
  const { t } = useTranslation("common");

  /**
   * openSignatureDialog
   */
  const openSignatureDialog = () => {
    ref.current?.openDialogSignature();
  };

  const aside = <Aside openSignatureDialog={openSignatureDialog} />;

  return (
    <div>
      <MainFunctionNavbar
        title={t("labels.communicator")}
        activeTrail="communicator"
        navigation={aside}
      />
      <Application aside={aside} ref={ref} />
    </div>
  );
};

export default CommunicatorBody;
