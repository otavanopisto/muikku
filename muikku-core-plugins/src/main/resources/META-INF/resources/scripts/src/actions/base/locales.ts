import { Dispatch } from "react-redux";
import { AnyActionType, SpecificActionType } from "~/actions";
import mApi from "~/lib/mApi";
import { StateType } from "~/reducers";
import { LocaleReadResponse, LocaleType } from "~/reducers/base/locales";
import promisify from "~/util/promisify";
import notificationActions from "~/actions/base/notifications";

// ACTIONS for locale
export type LOCALE_SET = SpecificActionType<"LOCALE_SET", string>;

export type LOCALE_UPDATE = SpecificActionType<"LOCALE_UPDATE", string>;

// TRIGGER types for locale

/**
 * SetLocaleTriggerType
 */
export interface SetLocaleTriggerType {
  (data: {
    locale: LocaleType;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AnyActionType;
}

/**
 * LoadLocaleTriggerType
 */
export interface LoadLocaleTriggerType {
  (): AnyActionType;
}

/**
 * Sets locale
 *
 * @param data locale
 */
const setLocale: SetLocaleTriggerType = function setLocale(data) {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
    getState: () => StateType
  ) => {
    const state = getState();

    try {
      await promisify(
        mApi().me.locale.create({ lang: data.locale }),
        "callback"
      )();

      dispatch({
        type: "LOCALE_SET",
        payload: data.locale,
      });

      data.onSuccess && data.onSuccess();
    } catch (err) {
      dispatch(
        notificationActions.displayNotification(
          state.i18n.text.get("Hups", err.message),
          "error"
        )
      );
    }
  };
};

/**
 * loadLocale
 */
const loadLocale: LoadLocaleTriggerType = function loadLocale() {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
    getState: () => StateType
  ) => {
    const state = getState();

    try {
      const locale = (await promisify(
        mApi().me.locale.read(),
        "callback"
      )()) as LocaleReadResponse;

      dispatch({
        type: "LOCALE_UPDATE",
        payload: locale.lang,
      });
    } catch (err) {
      dispatch(
        notificationActions.displayNotification(
          state.i18n.text.get("Hups", err.message),
          "error"
        )
      );
    }
  };
};

export default { setLocale, loadLocale };
export { setLocale, loadLocale };
