import { Dispatch } from "react-redux";
import { AnyActionType, SpecificActionType } from "~/actions";
import mApi from "~/lib/mApi";
import { LocaleReadResponse, LocaleType } from "~/reducers/base/locales";
import promisify from "~/util/promisify";
import notificationActions from "~/actions/base/notifications";
import i18n, { localizeTime } from "~/locales/i18n";

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
  return async (dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>) => {
    try {
      await promisify(
        mApi().me.locale.create({ lang: data.locale }),
        "callback"
      )();

      localizeTime.language = data.locale;
      i18n.changeLanguage(data.locale);

      dispatch({
        type: "LOCALE_SET",
        payload: data.locale,
      });

      data.onSuccess && data.onSuccess();
    } catch (err) {
      dispatch(
        notificationActions.displayNotification(
          i18n.t("notifications.updateError"),
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
  return async (dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>) => {
    try {
      const locale = (await promisify(
        mApi().me.locale.read(),
        "callback"
      )()) as LocaleReadResponse;

      localizeTime.language = locale.lang;

      dispatch({
        type: "LOCALE_UPDATE",
        payload: locale.lang,
      });
    } catch (err) {
      dispatch(
        notificationActions.displayNotification(
          i18n.t("notifications.loadError", {
            context: "locales",
          }),
          "error"
        )
      );
    }
  };
};

export default { setLocale, loadLocale };
export { setLocale, loadLocale };
