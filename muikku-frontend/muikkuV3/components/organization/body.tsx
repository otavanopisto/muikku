import MainFunctionNavbar from "~/components/base/main-function/navbar";
import * as React from "react";
import Application from "./body/application";
import Aside from "./body/aside";
import ScreenContainer from "../general/screen-container";
import { useTranslation } from "react-i18next";

/**
 * OrganizationManagementBodyProps
 */
interface OrganizationManagementBodyProps {}

/**
 * OrganizationManagementBody
 * @param props props
 */
const OrganizationManagementBody = (props: OrganizationManagementBodyProps) => {
  const { t } = useTranslation(["common"]);
  const aside = <Aside />;
  return (
    <div>
      <MainFunctionNavbar
        title={t("labels.organizationManagament")}
        navigation={aside}
        activeTrail="organization"
      />
      <ScreenContainer>
        <Application aside={aside} />
      </ScreenContainer>
    </div>
  );
};

export default OrganizationManagementBody;
