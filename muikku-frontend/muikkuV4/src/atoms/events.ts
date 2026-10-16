import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { userAtom } from "./auth";
import { getEventsApi, isMApiError, isResponseError } from "~/api";
import { ListEventsTypeEnum } from "~/generated/client";
import { FRONTPAGE_ABSENCES_QUERY_KEY } from "~/src/queryClient";

const eventsApi = getEventsApi();

const absencesStartDate = new Date();
absencesStartDate.setMonth(absencesStartDate.getMonth() - 12);
const absencesEndDate = new Date();
absencesEndDate.setMonth(absencesStartDate.getMonth() + 6);

export const absencesQueryAtom = atomWithQuery((get) => {
  const userId = get(userAtom)?.id;

  if (!userId) {
    throw new Error("User ID is required");
  }
  return {
    queryKey: [...FRONTPAGE_ABSENCES_QUERY_KEY, userId],
    enabled: typeof userId === "number",
    queryFn: async () => {
      try {
        return await eventsApi.listEvents({
          type: ListEventsTypeEnum.Absence,
          user: userId,
          start: absencesStartDate,
          end: absencesEndDate,
        });
      } catch (error) {
        if (!isMApiError(error)) throw error;
        if (isResponseError(error)) throw new Error(error.message);
        throw new Error("Failed to load absences");
      }
    },
  };
});

export const absencesDataAtom = atom((get) => get(absencesQueryAtom).data);
