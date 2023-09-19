import actions from "../base/notifications";
import promisify from "~/util/promisify";
import { AnyActionType, SpecificActionType } from "~/actions";
import mApi, { MApiError } from "~/lib/mApi";
import {
  HOPSDataType,
  HOPSStatusType,
  HOPSEligibilityType,
} from "~/reducers/main-function/hops";
import { StateType } from "~/reducers";
import i18n from "~/locales/i18n";

/**
 * UpdateHopsTriggerType
 */
export interface UpdateHopsTriggerType {
  (callback?: () => void): AnyActionType;
}

/**
 * SetHopsToTriggerType
 */
export interface SetHopsToTriggerType {
  (newHops: HOPSDataType): AnyActionType;
}

export type UPDATE_HOPS = SpecificActionType<"UPDATE_HOPS", HOPSDataType>;
export type UPDATE_HOPS_ELIGIBILITY = SpecificActionType<
  "UPDATE_HOPS_ELIGIBILITY",
  HOPSEligibilityType
>;
export type UPDATE_HOPS_STATUS = SpecificActionType<
  "UPDATE_HOPS_STATUS",
  HOPSStatusType
>;

export type SET_HOPS_PHASE = SpecificActionType<"SET_HOPS_PHASE", string>;

/**
 * updateHops
 * @param callback callback
 */
const updateHops: UpdateHopsTriggerType = function updateHops(callback) {
  return async (
    dispatch: (arg: AnyActionType) => any,
    getState: () => StateType
  ) => {
    try {
      if (getState().hops.status !== "WAIT") {
        callback && callback();
        return null;
      }
      dispatch({
        type: "UPDATE_HOPS_STATUS",
        payload: <HOPSStatusType>"LOADING",
      });

      const properties: any = await promisify(
        mApi().user.properties.read(getState().status.userId, {
          properties: "hopsPhase",
        }),
        "callback"
      )();

      dispatch({
        type: "SET_HOPS_PHASE",
        payload: properties[0].value,
      });

      const hops = <HOPSDataType>(
        await promisify(mApi().records.hops.read(), "callback")()
      );

      dispatch({
        type: "UPDATE_HOPS_ELIGIBILITY",
        payload: <HOPSEligibilityType>(
          await promisify(mApi().records.hopseligibility.read(), "callback")()
        ),
      });
      dispatch({
        type: "UPDATE_HOPS",
        payload: hops,
      });
      dispatch({
        type: "UPDATE_HOPS_STATUS",
        payload: <HOPSStatusType>"READY",
      });

      callback && callback();
    } catch (err) {
      if (!(err instanceof MApiError)) {
        throw err;
      }
      dispatch(
        actions.displayNotification(
          i18n.t("notifications.loadError", {
            ns: "hops",
          }),
          "error"
        )
      );
      dispatch({
        type: "UPDATE_HOPS_STATUS",
        payload: <HOPSStatusType>"ERROR",
      });
    }
  };
};

/**
 * setHopsTo
 * @param newHops newHops
 */
const setHopsTo: SetHopsToTriggerType = function setHopsTo(newHops) {
  return async (
    dispatch: (arg: AnyActionType) => any,
    getState: () => StateType
  ) => {
    try {
      dispatch({
        type: "UPDATE_HOPS",
        payload: <HOPSDataType>(
          await promisify(mApi().records.hops.update(newHops), "callback")()
        ),
      });
    } catch (err) {
      if (!(err instanceof MApiError)) {
        throw err;
      }
      dispatch(
        actions.displayNotification(
          i18n.t("notifications.updateError", { ns: "hops" }),
          "error"
        )
      );
    }
  };
};

export default { updateHops, setHopsTo };
export { updateHops, setHopsTo };
