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

  return (
    <>
      <Modal
        opened={websocketDisconnected.showModal}
        onClose={() =>
          setWebsocketDisconnected({ showModal: false, code: null })
        }
        title="Authentication"
        centered
      >
        <div>Istunto on päättynyt. Kirjaudu sisään uudelleen.</div>
      </Modal>
    </>
  );
}
