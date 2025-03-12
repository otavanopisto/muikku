import MainFunctionNavbar from "~/components/base/main-function/navbar";
import WorkspaceNavbar from "~/components/base/workspace/navbar";
import * as React from "react";
import ScreenContainer from "~/components/general/screen-container";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/ordered-container.scss";
import "~/sass/elements/panel.scss";
import { useLocation, useParams } from "react-router-dom";

/**
 * getDefaultMessage
 * @param code code of the error
 * @param isWorkspace whether the error is for a workspace
 */
const getDefaultMessage = (code: number, isWorkspace: boolean) => {
  switch (code) {
    case 401:
      return isWorkspace
        ? "Sinun täytyy kirjautua sisään nähdäksesi tämän työtilan"
        : "Sinun täytyy kirjautua sisään nähdäksesi tämän sivun";
    case 403:
      return isWorkspace
        ? "Sinulla ei ole pääsyä tähän työtilaan"
        : "Sinulla ei ole pääsyä tähän sivulle";
    case 404:
      return isWorkspace
        ? "Haluamasi työtila ei löytynyt"
        : "Haluamasi sivua ei löytynyt";
    default:
      return "Tapahtui odottamaton virhe";
  }
};

/**
 * ErrorBody
 */
const ErrorBody = () => {
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
            {getDefaultMessage(parseInt(status), isWorkspace)}
          </div>
        </div>
      </ScreenContainer>
    </div>
  );
};

export default ErrorBody;
