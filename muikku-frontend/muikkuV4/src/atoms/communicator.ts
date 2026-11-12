import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { getCommunicatorApi } from "~/api";
import type { GetCommunicatorThreadsRequest } from "~/generated/client";
import i18n from "~/src/locales/i18n";
import { handleApiError } from "./helpers/error";

const communicatorApi = getCommunicatorApi();
const { t } = i18n;

export const frontpageCommunicatorThreadsQueryAtom = atomWithQuery(() => {
  const params: GetCommunicatorThreadsRequest = {
    firstResult: 0,
    maxResults: 10,
  };

  return {
    queryKey: ["frontpage", "messages"],
    queryFn: async () => {
      try {
        return await communicatorApi.getCommunicatorThreads(params);
      } catch (error) {
        handleApiError(error, t("errors.load", { ns: "messages" }));
      }
    },
  };
});

export const frontpageCommunicatorThreadsDataAtom = atom(
  (get) => get(frontpageCommunicatorThreadsQueryAtom).data
);
