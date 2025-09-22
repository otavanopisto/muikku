import { atom } from "jotai";
import MApi from "~/api";
import type { LocaleType, LocalizationLocale } from "~/generated/client";

const meApi = MApi.getMeApi();

export const langAtom = atom<LocaleType>("fi");

/**
 * Load the locale from the server using atom action
 */
export const loadLangAtom = atom(null, async (_, set) => {
  const locale = await meApi.getLocale();

  set(langAtom, locale.lang);
});

/**
 * Set the locale on the server and update local state
 */
export const setLangAtom = atom(null, async (_, set, newLang: LocaleType) => {
  const locale: LocalizationLocale = { lang: newLang };
  await meApi.setLocale({ localizationLocale: locale });
  set(langAtom, newLang);
});
