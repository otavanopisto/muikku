/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import { DisplayNotificationTriggerType } from "~/actions/base/notifications";

export type UseReadspeakerReader = ReturnType<typeof useReadSpeakerReader>;

type ReadSpeakerUiCallback = (element: Element) => void;

/**
 * Registers ReadSpeaker ui callbacks once, preserving any existing handlers.
 * @param handlers handlers
 * @param handlers.play play callback
 * @param handlers.stop stop callback
 * @param handlers.close close callback
 */
function registerReadSpeakerUiCallbacks(handlers: {
  play?: ReadSpeakerUiCallback;
  stop?: ReadSpeakerUiCallback;
  close?: ReadSpeakerUiCallback;
}) {
  const win = window as Window & {
    rsConf?: {
      cb?: {
        ui?: {
          play?: ReadSpeakerUiCallback;
          stop?: ReadSpeakerUiCallback;
          close?: ReadSpeakerUiCallback;
        };
      };
    };
  };
  win.rsConf = win.rsConf ?? {};
  win.rsConf.cb = win.rsConf.cb ?? {};
  win.rsConf.cb.ui = win.rsConf.cb.ui ?? {};
  const ui = win.rsConf.cb.ui;
  if (handlers.play) {
    const previous = ui.play;
    // eslint-disable-next-line jsdoc/require-jsdoc
    ui.play = function play(this: Element) {
      previous?.call(this);
      handlers.play?.call(this);
    };
  }
  if (handlers.stop) {
    const previous = ui.stop;
    // eslint-disable-next-line jsdoc/require-jsdoc
    ui.stop = function stop(this: Element) {
      previous?.call(this);
      handlers.stop?.call(this);
    };
  }
  if (handlers.close) {
    const previous = ui.close;
    // eslint-disable-next-line jsdoc/require-jsdoc
    ui.close = function close(this: Element) {
      previous?.call(this);
      handlers.close?.call(this);
    };
  }
}

/**
 * Custom hook to load ReadSpeaker reader. Handles loading the script,
 * initializing the reader, and managing the material content revision (if needed).
 *
 * @param displayNotification displayNotification
 */
export const useReadSpeakerReader = (
  displayNotification: DisplayNotificationTriggerType
) => {
  const url =
    "https://cdn-eu.readspeaker.com/script/13624/webReader/webReader.js?pids=wr";
  const rspkr = React.useRef<any>(null);
  const [rspkrLoaded, setRspkrLoaded] = React.useState(false);
  const [materialContentRevisionByPage, setMaterialContentRevisionByPage] =
    React.useState<Record<number, number>>({});
  const pendingReadAreaIdsRef = React.useRef<string[]>([]);
  const activeReadAreaIdsRef = React.useRef<string[]>([]);
  const lastSessionEndBumpAtRef = React.useRef(0);

  /**
   * Bumps material content revision for pages.
   * @param workspaceMaterialIds workspaceMaterialIds
   */
  const bumpMaterialContentRevisionForPages = React.useCallback(
    (workspaceMaterialIds: number[]) => {
      if (!workspaceMaterialIds.length) {
        return;
      }
      setMaterialContentRevisionByPage((prev) => {
        const next = { ...prev };
        for (const workspaceMaterialId of workspaceMaterialIds) {
          next[workspaceMaterialId] = (next[workspaceMaterialId] ?? 0) + 1;
        }
        return next;
      });
    },
    []
  );

  /**
   * Notifies read speaker about read areas. Specifically useful
   * with material pages that needs to be bumped for content revision.
   * @param readAreaIds readAreaIds
   */
  const notifyReadSpeakerReadAreas = React.useCallback(
    (readAreaIds: string[]) => {
      if (!readAreaIds.length) {
        return;
      }
      pendingReadAreaIdsRef.current = [
        ...new Set([...pendingReadAreaIdsRef.current, ...readAreaIds]),
      ];
    },
    []
  );

  /**
   * Gets material content revision.
   * @param workspaceMaterialId workspaceMaterialId
   */
  const getMaterialContentRevision = React.useCallback(
    (workspaceMaterialId: number) =>
      materialContentRevisionByPage[workspaceMaterialId] ?? 0,
    [materialContentRevisionByPage]
  );

  /**
   * Handles read speaker session start.
   * @param playerElement playerElement
   */

  const handleReadSpeakerSessionStart = React.useCallback(
    (playerElement: Element) => {
      const fromPlayer = extractReadAreaIdsFromReadSpeakerPlayer(playerElement);
      const pending = pendingReadAreaIdsRef.current;
      pendingReadAreaIdsRef.current = [];
      activeReadAreaIdsRef.current = [...new Set([...fromPlayer, ...pending])];
    },
    []
  );

  /**
   * Handles read speaker session end.
   * @param playerElement playerElement
   */
  const handleReadSpeakerSessionEnd = React.useCallback(
    (playerElement: Element) => {
      const now = Date.now();
      // stop + close can fire back-to-back for one user action
      if (now - lastSessionEndBumpAtRef.current < 250) {
        activeReadAreaIdsRef.current = [];
        pendingReadAreaIdsRef.current = [];
        return;
      }

      // Get read area ids from active read area ids or player element
      const readAreaIds = activeReadAreaIdsRef.current.length
        ? activeReadAreaIdsRef.current
        : extractReadAreaIdsFromReadSpeakerPlayer(playerElement);
      activeReadAreaIdsRef.current = [];
      pendingReadAreaIdsRef.current = [];

      // Get workspace material ids from read area ids
      // We only need to bump material content revision if we have workspace material ids
      // Bumping is only needed for material pages
      const workspaceMaterialIds = toWorkspaceMaterialIds(readAreaIds);
      if (!workspaceMaterialIds.length) {
        return;
      }
      lastSessionEndBumpAtRef.current = now;
      bumpMaterialContentRevisionForPages(workspaceMaterialIds);
    },
    [bumpMaterialContentRevisionForPages]
  );

  // Register read speaker ui callbacks
  React.useEffect(() => {
    registerReadSpeakerUiCallbacks({
      play: handleReadSpeakerSessionStart,
      stop: handleReadSpeakerSessionEnd,
      close: handleReadSpeakerSessionEnd,
    });
  }, [handleReadSpeakerSessionStart, handleReadSpeakerSessionEnd]);

  // Load read speaker script
  React.useEffect(() => {
    let oScript: HTMLScriptElement | null = document.querySelector(
      `script[src="${url}"]`
    );
    /**
     * Handles loading script and initializing ReadSpeaker reader
     * @param e e
     */
    const handleLoad = (e: Event) => {
      if (e.type !== "load") {
        return;
      }
      rspkr.current = (window as any).ReadSpeaker;
      if (!rspkr.current) {
        return;
      }
      rspkr.current.init();
      rspkr.current.q(function () {
        rspkr.current.ui.addClickEvents();
      });
      setRspkrLoaded(true);
    };

    /**
     * Handles error when loading script
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
      oScript.onload = handleLoad;
      oScript.onerror = handleError;
      document.head.appendChild(oScript);
    };

    if (!oScript) {
      handleCreateScript();
    } else {
      oScript.onload = handleLoad;
      oScript.onerror = handleError;
      rspkr.current = (window as any).ReadSpeaker;
      if (rspkr.current) {
        rspkr.current.p(rspkr.current.init());
        setRspkrLoaded(true);
      }
    }

    return () => {
      if (rspkr.current?.ui && rspkr.current.ui.getActivePlayer()) {
        rspkr.current.ui.getActivePlayer().close();
      }
    };
  }, [displayNotification]);

  return {
    rspkr,
    rspkrLoaded,
    getMaterialContentRevision,
    notifyReadSpeakerReadAreas,
  };
};

const MATERIAL_PAGE_READ_AREA_PREFIX = "p-";

/**
 * Parses workspaceMaterialId from ReadSpeaker read area id (e.g. "p-123" -> 123).
 * @param readAreaId readAreaId
 */
export function parseWorkspaceMaterialIdFromReadAreaId(
  readAreaId: string
): number | null {
  if (!readAreaId.startsWith(MATERIAL_PAGE_READ_AREA_PREFIX)) {
    return null;
  }

  const parsed = Number.parseInt(
    readAreaId.slice(MATERIAL_PAGE_READ_AREA_PREFIX.length),
    10
  );

  return Number.isFinite(parsed) ? parsed : null;
}

/**
 * Extracts readid values from a ReadSpeaker player/link (comma-separated "p-123,p-456").
 * @param playerElement playerElement
 */
export function extractReadAreaIdsFromReadSpeakerPlayer(
  playerElement: unknown
): string[] {
  if (!(playerElement instanceof Element)) {
    return [];
  }

  const container = playerElement.closest(".rsbtn") ?? playerElement;
  const playLink = container.querySelector(".rsbtn_play");

  if (!(playLink instanceof HTMLAnchorElement) || !playLink.href) {
    return [];
  }

  try {
    // Get readid from play link href
    const url = new URL(playLink.href);
    const readid = url.searchParams.get("readid");
    if (!readid) {
      return [];
    }

    // Because readid is a comma-separated list of readareaids,
    // we need to split it and return the list of readareaids
    return readid
      .split(",")
      .map((part) => part.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

/**
 * Unique material page ids from read area ids.
 * @param readAreaIds readAreaIds
 */
export function toWorkspaceMaterialIds(readAreaIds: string[]): number[] {
  const ids = new Set<number>();

  for (const readAreaId of readAreaIds) {
    const workspaceMaterialId =
      parseWorkspaceMaterialIdFromReadAreaId(readAreaId);
    if (workspaceMaterialId != null) {
      ids.add(workspaceMaterialId);
    }
  }

  return [...ids];
}
