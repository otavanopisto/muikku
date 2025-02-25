import React from "react";
import { useTranslation } from "react-i18next";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import "~/sass/elements/link.scss";

/**
 * Props for the CommunicatorApplication component
 */
interface NotFoundApplicationProps {
  /** React element to be rendered as an aside */
  aside?: React.ReactElement;
}

/**
 * NotFoundApplication component
 *
 * This component renders the main application panel for the communicator,
 * including messages, toolbar, and various UI elements.
 *
 * @param props - The component props
 */
const NotFoundApplication = (props: NotFoundApplicationProps) => {
  const { aside } = props;
  const { t } = useTranslation(["messaging", "common"]);

  const title = t("labels.communicator", { ns: "common" });

  //The message view actually appears on top and it's not a replacement, this makes it easier to go back without having to refresh from the server
  return (
    <>
      <ApplicationPanel title={title}>
        <div>
          <h1>404</h1>
          <p>Page not found</p>
        </div>
      </ApplicationPanel>
    </>
  );
};

export default NotFoundApplication;
