import { SpecificActionType } from "~/actions";
export type SET_LOCALE = SpecificActionType<"SET_LOCALE", string>;

export interface SetLocaleTriggerType {
  (locale: string): SET_LOCALE;
}

const setLocale: SetLocaleTriggerType = function setLocale(locale: string) {
  return {
    type: "SET_LOCALE",
    payload: locale,
  };
};

export default { setLocale };
export { setLocale };
