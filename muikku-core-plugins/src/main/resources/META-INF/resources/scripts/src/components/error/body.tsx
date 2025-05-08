import MainFunctionNavbar from "~/components/base/main-function/navbar";
import WorkspaceNavbar from "~/components/base/workspace/navbar";
import * as React from "react";
import ScreenContainer from "~/components/general/screen-container";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/ordered-container.scss";
import "~/sass/elements/panel.scss";
import { useLocation, useParams } from "react-router-dom";
import { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
/**
 * getDefaultMessage
 * @param code code of the error
 * @param isWorkspace whether the error is for a workspace
 * @param t i18next instance
 */
const getDefaultMessage = (
  code: number,
  isWorkspace: boolean,
  t: TFunction
) => {
  switch (code) {
    case 401:
      return isWorkspace
        ? t("notifications.401_workspace")
        : t("notifications.401_page");
    case 403:
      return isWorkspace
        ? t("notifications.403_workspace")
        : t("notifications.403_page");
    case 404:
      return isWorkspace
        ? t("notifications.404_workspace")
        : t("notifications.404_page");
    default:
      return t("notifications.unexpected_error");
  }
};

/**
 * ErrorBody
 */
const ErrorBody = () => {
  const { t } = useTranslation();

  const { status } = useParams<{ status: string }>();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const workspace = params.get("workspace");

  const isWorkspace = workspace === "true";

  return (
    <div>
      {isWorkspace ? (
        <WorkspaceNavbar title={status} workspaceUrl={""} />
      ) : (
        <MainFunctionNavbar title={status} />
      )}
      <ScreenContainer viewModifiers="error">
        <div className="panel panel--error">
          <div className="panel__header">
            <div className="panel__header-icon panel__header-icon--error icon-error"></div>
            <div className="panel__header-title">{status}</div>
          </div>
          <div className="panel__body panel__body--error">
            {getDefaultMessage(parseInt(status), isWorkspace, t)}
          </div>
        </div>
      </ScreenContainer>
    </div>
  );
};

export default ErrorBody;
