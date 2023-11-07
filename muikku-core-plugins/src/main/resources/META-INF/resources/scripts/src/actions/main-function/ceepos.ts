import actions from "../base/notifications";
import { AnyActionType, SpecificActionType } from "~/actions";
import { StateType } from "~/reducers";
import {
  CeeposStateStatusType,
  CeeposPayStatusCodeType,
} from "~/reducers/main-function/ceepos";
import i18n from "~/locales/i18n";
import { Dispatch } from "react-redux";
import MApi, { isMApiError } from "~/api/api";
import { CeeposOrder } from "~/generated/client";

/**
 * LoadCeeposPurchaseTriggerType
 */
export interface LoadCeeposPurchaseTriggerType {
  (orderId: number): AnyActionType;
}

export type UPDATE_CEEPOS_PURCHASE = SpecificActionType<
  "UPDATE_CEEPOS_PURCHASE",
  CeeposOrder
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
 * @param orderId id of the purchase
 */
const loadCeeposPurchase: LoadCeeposPurchaseTriggerType =
  function loadCeeposPurchase(orderId) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const ceeposApi = MApi.getCeeposApi();

      try {
        dispatch({
          type: "UPDATE_CEEPOS_STATE",
          payload: <CeeposStateStatusType>"LOADING",
        });

        const studentId = getState().status.userSchoolDataIdentifier;

        const order = await ceeposApi.getCeeposUserOrder({
          userIdentifier: studentId,
          orderId: orderId,
        });

        dispatch({
          type: "UPDATE_CEEPOS_PURCHASE",
          payload: order,
        });

        dispatch({
          type: "UPDATE_CEEPOS_STATE",
          payload: <CeeposStateStatusType>"READY",
        });
      } catch (err) {
        if (!isMApiError(err)) {
          throw err;
        }

        dispatch(
          actions.displayNotification(
            i18n.t("notifications.loadError", {
              ns: "orders",
              context: "order",
            }),
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
 * @param orderId id of the purchase
 */
const loadCeeposPurchaseAndPay: LoadCeeposPurchaseTriggerType =
  function loadCeeposPurchase(orderId) {
    return async (
      dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
      getState: () => StateType
    ) => {
      const ceeposApi = MApi.getCeeposApi();

      try {
        dispatch({
          type: "UPDATE_CEEPOS_STATE",
          payload: <CeeposStateStatusType>"LOADING",
        });

        if (getState().status.isActiveUser) {
          const value = await ceeposApi.createCeeposPay({
            orderId: orderId,
          });

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
