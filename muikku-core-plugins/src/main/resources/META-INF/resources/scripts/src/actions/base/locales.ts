import { setDefaultLocale } from "react-datepicker";
import { SpecificActionType } from "~/actions";
export type SET_LOCALE = SpecificActionType<"SET_LOCALE", string>;

/**
 * SetLocaleTriggerType
 */
export interface SetLocaleTriggerType {
  (locale: string): SET_LOCALE;
}

/**
 * setLocale
 * @param locale locale
 */
const setLocale: SetLocaleTriggerType = function setLocale(locale: string) {
  return {
    type: "SET_LOCALE",
    payload: locale,
  };
};

export default { setLocale };
export { setLocale };
