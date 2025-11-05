import { Modal } from "@mantine/core";
import { websocketDisconnectedAtom } from "~/src/atoms/websocket";
import { useAtom } from "jotai";

/**
 * DisconnectModal
 * @returns
 */
export function DisconnectModal() {
  const [websocketDisconnected, setWebsocketDisconnected] = useAtom(
    websocketDisconnectedAtom
  );

  /**
   * Handles the content of the modal
   * @returns React.ReactNode
   */
  const renderContent = () => {
    switch (websocketDisconnected.code) {
      case 403:
        return "Muikku-istuntosi on vanhentunut. Jos olet vastaamassa tehtäviin, kopioi varmuuden vuoksi vastauksesi talteen omalle koneellesi ja kirjaudu uudelleen sisään.";

      case 502:
        return "Muikkuun ei saada yhteyttä. Jos olet vastaamassa tehtäviin, kopioi varmuuden vuoksi vastauksesi talteen omalle koneellesi ja lataa sivu uudelleen. Mikäli ongelma ei katoa, tarkista vielä verkkoyhteytesi. Ota tarvittaessa yhteyttä helpdeskiin helpdesk(a)muikkuverkko.fi";

      default:
        return "Oi voi! Mitä nyt tapahtuu?";
    }
  };

  return (
    <>
      <Modal
        opened={websocketDisconnected.showModal}
        onClose={() =>
          setWebsocketDisconnected({ showModal: false, code: null })
        }
        title="Oi voi! Mitä nyt tapahtuu?"
        centered
      >
        <div>{renderContent()}</div>
      </Modal>
    </>
  );
}
