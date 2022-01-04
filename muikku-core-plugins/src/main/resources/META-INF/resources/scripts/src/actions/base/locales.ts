import { SpecificActionType } from "~/actions";
export interface SET_LOCALE extends SpecificActionType<"SET_LOCALE", string> {}

export interface SetLocaleTriggerType {
  (locale: string): SET_LOCALE;
}

let setLocale: SetLocaleTriggerType = function setLocale(locale: string) {
  return {
    type: "SET_LOCALE",
    payload: locale
  };
};

export default { setLocale };
export { setLocale };
