import { AppThunkAction, SpecificActionType } from "~/actions";
import { LocaleType } from "~/reducers/base/locales";
import notificationActions from "~/actions/base/notifications";
import i18n, { localize } from "~/locales/i18n";
import MApi, { isMApiError } from "~/api/api";

// ACTIONS for locale
export type LOCALE_SET = SpecificActionType<"LOCALE_SET", LocaleType>;
export type LOCALE_UPDATE = SpecificActionType<"LOCALE_UPDATE", LocaleType>;

// TRIGGER types for locale

/**
 * SetLocaleTriggerType
 */
export interface SetLocaleTriggerType {
  (data: {
    locale: LocaleType;
    onSuccess?: () => void;
    onFail?: () => void;
  }): AppThunkAction;
}

/**
 * LoadLocaleTriggerType
 */
export interface LoadLocaleTriggerType {
  (): AppThunkAction;
}

/**
 * Sets locale
 *
 * @param data locale
 */
const setLocale: SetLocaleTriggerType = function setLocale(data) {
  return async (dispatch) => {
    const meApi = MApi.getMeApi();

    try {
      await meApi.setLocale({
        localizationLocale: {
          lang: data.locale,
        },
      });

      localize.language = data.locale;

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
  return async (dispatch) => {
    const meApi = MApi.getMeApi();

    try {
      const locale = await meApi.getLocale();

      localize.language = locale.lang;

      dispatch({
        type: "LOCALE_UPDATE",
        payload: locale.lang,
      });
    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      }

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
