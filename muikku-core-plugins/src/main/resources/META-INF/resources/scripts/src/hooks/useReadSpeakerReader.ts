/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";

export type UseReadspeakerReader = ReturnType<typeof useReadSpeakerReader>;

/**
 * Custom hook to load ReadSpeaker reader
 *
 * @param displayNotification displayNotification
 * @returns {React.MutableRefObject<any>} ReadSpeaker reader
 */
export const useReadSpeakerReader = (
  displayNotification: DisplayNotificationTriggerType
): { rspkr: React.MutableRefObject<any>; rspkrLoaded: boolean } => {
  const url =
    "https://cdn-eu.readspeaker.com/script/13624/webReader/webReader.js?pids=wr";

  const rspkr = React.useRef(null);

  const [rspkrLoaded, setRspkrLoaded] = React.useState(false);

  React.useEffect(() => {
    let oScript: HTMLScriptElement = document.querySelector(
      `script[src="${url}"]`
    );

    /**
     * Handles loading script and initializing ReadSpeaker reader
     *
     * @param e e
     */
    const handleLoad = (e: Event) => {
      if (e.type === "load") {
        rspkr.current = (window as any).ReadSpeaker;

        if (rspkr.current) {
          rspkr.current.init();
          rspkr.current.q(function () {
            rspkr.current.ui.addClickEvents();
          });
          setRspkrLoaded(true);
        }
      }
    };

    /**
     * Handles error when loading script
     *
     * @param e e
     */
    const handleError = (e: Event) => {
      if (e.type === "error") {
        displayNotification(
          "ReadSpeaker reader failed to load, try refreshing the page",
          "error"
        );
      }
    };

    /**
     * Handles creating script and appending it to the DOM
     */
    const handleCreateScript = () => {
      oScript = document.createElement("script");
      oScript.type = "text/javascript";
      oScript.src = url;
      oScript.id = "rs_req_Init";
      // eslint-disable-next-line jsdoc/require-jsdoc
      oScript.onload = handleLoad;
      // eslint-disable-next-line jsdoc/require-jsdoc
      oScript.onerror = handleError;

      document.head.appendChild(oScript);
    };

    // Check if script exists
    // If not, create it
    // If yes, add listeners and check if ReadSpeaker is loaded
    // and re-initialize it
    if (!oScript) {
      handleCreateScript();
    } else {
      // eslint-disable-next-line jsdoc/require-jsdoc
      oScript.onload = handleLoad;
      // eslint-disable-next-line jsdoc/require-jsdoc
      oScript.onerror = handleError;

      rspkr.current = (window as any).ReadSpeaker;

      if (rspkr.current) {
        rspkr.current.p(rspkr.current.init());

        setRspkrLoaded(true);
      }
    }

    // Cleanup active players
    return () => {
      if (
        rspkr.current &&
        rspkr.current.ui &&
        rspkr.current.ui.getActivePlayer()
      ) {
        rspkr.current.ui.getActivePlayer().close();
      }
    };
  }, [displayNotification]);

  return { rspkr, rspkrLoaded };
};
