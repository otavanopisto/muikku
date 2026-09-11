import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import type { LocaleType, LocalizationLocale } from "~/generated/client";
import { getMeApi } from "~/api";
import { LOCALE_QUERY_KEY, queryClient } from "src/queryClient";

const meApi = getMeApi();

const DEFAULT_LANG: LocaleType = "fi";

/** Server cache for locale — do not useAtomValue this in components. */
export const localeQueryAtom = atomWithQuery(() => ({
  queryKey: LOCALE_QUERY_KEY,
  queryFn: async () => {
    const locale = await meApi.getLocale();
    return locale.lang;
  },
  staleTime: Infinity,
  retry: false,
}));

/** App-facing language. */
export const langAtom = atom(
  (get) => get(localeQueryAtom).data ?? DEFAULT_LANG
);

/**
 * Set the locale on the server and update the query cache.
 */
export const setLangAtom = atom(
  null,
  async (_get, _set, newLang: LocaleType) => {
    const locale: LocalizationLocale = { lang: newLang };
    await meApi.setLocale({ localizationLocale: locale });
    queryClient.setQueryData(LOCALE_QUERY_KEY, newLang);
  }
);
