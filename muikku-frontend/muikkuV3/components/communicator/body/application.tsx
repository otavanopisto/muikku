import React, { forwardRef, useImperativeHandle, useState } from "react";
import { useTranslation } from "react-i18next";
import ApplicationPanel from "~/components/general/application-panel/application-panel";
import HoverButton from "~/components/general/hover-button";
import Dropdown from "~/components/general/dropdown";
import Link from "~/components/general/link";
import Toolbar from "./application/toolbar";
import CommunicatorMessages from "./application/messages";
import MessageView from "./application/message-view";
import NewMessage from "../dialogs/new-message";
import SignatureUpdateDialog from "../dialogs/signature-update";
import "~/sass/elements/link.scss";
import Button, { ButtonPill } from "~/components/general/button";

/**
 * Props for the CommunicatorApplication component
 */
interface CommunicatorApplicationProps {
  /** React element to be rendered as an aside */
  aside: React.ReactElement;
}

/**
 * Ref interface for CommunicatorApplication
 */
export interface CommunicatorApplicationRef {
  /** Method to open the signature dialog */
  openDialogSignature: () => void;
}

/**
 * CommunicatorApplication component
 *
 * This component renders the main application panel for the communicator,
 * including messages, toolbar, and various UI elements.
 *
 * @param props - The component props
 * @param ref - Ref object for imperative handle
 */
const CommunicatorApplication = forwardRef<
  CommunicatorApplicationRef,
  CommunicatorApplicationProps
>((props, ref) => {
  const [updateSignatureDialogOpened, setUpdateSignatureDialogOpened] =
    useState(false);
  const { aside } = props;
  const { t } = useTranslation(["messaging", "common"]);

  // Expose the openDialogSignature method to parent components
  useImperativeHandle(ref, () => ({
    // eslint-disable-next-line jsdoc/require-jsdoc
    openDialogSignature: () => setUpdateSignatureDialogOpened(true),
  }));

  /**
   * Closes the signature update dialog
   */
  const closeDialogSignature = () => setUpdateSignatureDialogOpened(false);

  const title = t("labels.communicator", { ns: "common" });
  const icon = (
    <Dropdown
      modifier="main-functions-settings"
      items={[
        (closeDropdown) => (
          <Link
            tabIndex={0}
            className="link link--full link--main-functions-settings-dropdown"
            onClick={() => setUpdateSignatureDialogOpened(true)}
          >
            <span>{t("labels.signature", { ns: "messaging" })}</span>
          </Link>
        ),
      ]}
    >
      <ButtonPill buttonModifiers="settings" icon="cog" />
    </Dropdown>
  );
  const primaryOption = (
    <NewMessage>
      <Button buttonModifiers="primary-function">
        {t("actions.create", {
          ns: "messaging",
          context: "message",
        })}
      </Button>
    </NewMessage>
  );
  const toolbar = <Toolbar />;

  //The message view actually appears on top and it's not a replacement, this makes it easier to go back without having to refresh from the server
  return (
    <>
      <ApplicationPanel
        toolbar={toolbar}
        title={title}
        icon={icon}
        primaryOption={primaryOption}
        asideBefore={aside}
      >
        <CommunicatorMessages />
        <MessageView />
      </ApplicationPanel>
      <SignatureUpdateDialog
        isOpen={updateSignatureDialogOpened}
        onClose={closeDialogSignature}
      />
      <NewMessage>
        <HoverButton icon="plus" modifier="new-message" />
      </NewMessage>
    </>
  );
});

CommunicatorApplication.displayName = "CommunicatorApplication";

export default CommunicatorApplication;
