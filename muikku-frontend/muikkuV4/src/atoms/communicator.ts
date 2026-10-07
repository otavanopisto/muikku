import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { getCommunicatorApi } from "~/api";
import type { GetCommunicatorThreadsRequest } from "~/generated/client";

const communicatorApi = getCommunicatorApi();

export const frontpageCommunicatorThreadsQueryAtom = atomWithQuery(() => {
  const params: GetCommunicatorThreadsRequest = {
    firstResult: 0,
    maxResults: 10,
  };

  return {
    queryKey: ["frontpage", "messages"],
    queryFn: () => communicatorApi.getCommunicatorThreads(params),
  };
});

export const frontpageCommunicatorThreadsDataAtom = atom(
  (get) => get(frontpageCommunicatorThreadsQueryAtom).data
);
