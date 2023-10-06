import actions from "../base/notifications";
import promisify from "~/util/promisify";
import { AnyActionType, SpecificActionType } from "~/actions";
import mApi, { MApiError } from "~/lib/mApi";
import { StateType } from "~/reducers";
import {
  CeeposStateStatusType,
  CeeposPayStatusCodeType,
} from "~/reducers/main-function/ceepos";
import { PurchaseType } from "~/reducers/main-function/profile";
import i18n from "~/locales/i18n";

/**
 * LoadCeeposPurchaseTriggerType
 */
export interface LoadCeeposPurchaseTriggerType {
  (purchaseId: number): AnyActionType;
}

export type UPDATE_CEEPOS_PURCHASE = SpecificActionType<
  "UPDATE_CEEPOS_PURCHASE",
  PurchaseType
>;
export type UPDATE_CEEPOS_STATE = SpecificActionType<
  "UPDATE_CEEPOS_STATE",
  CeeposStateStatusType
>;
export type UPDATE_CEEPOS_PAY_STATUS = SpecificActionType<
  "UPDATE_CEEPOS_PAY_STATUS",
  CeeposPayStatusCodeType
>;

/**
 * loadCeeposPurchase
 * @param purchaseId id of the purchase
 */
const loadCeeposPurchase: LoadCeeposPurchaseTriggerType =
  function loadCeeposPurchase(purchaseId) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      try {
        dispatch({
          type: "UPDATE_CEEPOS_STATE",
          payload: <CeeposStateStatusType>"LOADING",
        });

        const studentId = getState().status.userSchoolDataIdentifier;
        const purchase = (await promisify(
          mApi().ceepos.user.order.read(studentId, purchaseId),
          "callback"
        )()) as PurchaseType;

        dispatch({
          type: "UPDATE_CEEPOS_PURCHASE",
          payload: purchase,
        });

        dispatch({
          type: "UPDATE_CEEPOS_STATE",
          payload: <CeeposStateStatusType>"READY",
        });
      } catch (err) {
        if (!(err instanceof MApiError)) {
          throw err;
        }

        dispatch(
          actions.displayNotification(
            i18n.t("notifications.loadError", { ns: "orders", context: "order" }),
            "error"
          )
        );

        dispatch({
          type: "UPDATE_CEEPOS_STATE",
          payload: <CeeposStateStatusType>"ERROR",
        });
      }
    };
  };

/**
 * loadCeeposPurchase
 * @param purchaseId id of the purchase
 */
const loadCeeposPurchaseAndPay: LoadCeeposPurchaseTriggerType =
  function loadCeeposPurchase(purchaseId) {
    return async (
      dispatch: (arg: AnyActionType) => any,
      getState: () => StateType
    ) => {
      try {
        dispatch({
          type: "UPDATE_CEEPOS_STATE",
          payload: <CeeposStateStatusType>"LOADING",
        });

        if (getState().status.isActiveUser) {
          const value: string = (await promisify(
            mApi().ceepos.pay.create(purchaseId),
            "callback"
          )()) as string;

          location.href = value;
        }

        dispatch({
          type: "UPDATE_CEEPOS_STATE",
          payload: <CeeposStateStatusType>"READY",
        });
      } catch (err) {
        dispatch({
          type: "UPDATE_CEEPOS_STATE",
          payload: <CeeposStateStatusType>"ERROR",
        });

        dispatch({
          type: "UPDATE_CEEPOS_PAY_STATUS",
          payload: err.message,
        });
      }
    };
  };

export default { loadCeeposPurchase, loadCeeposPurchaseAndPay };
export { loadCeeposPurchase, loadCeeposPurchaseAndPay };
