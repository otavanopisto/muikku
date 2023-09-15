import actions from "../base/notifications";
import promisify from "~/util/promisify";
import { AnyActionType, SpecificActionType } from "~/actions";
import mApi from "~/lib/mApi";
import { HOPSStatusType } from "~/reducers/main-function/hops";
import { StateType } from "~/reducers";
import { Dispatch } from "react-redux";
import MApi, { isMApiError } from "~/api/api";
import { HopsEligibility, HopsUppersecondary } from "~/generated/client";

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
  (newHops: HopsUppersecondary): AnyActionType;
}

export type UPDATE_HOPS = SpecificActionType<"UPDATE_HOPS", HopsUppersecondary>;
export type UPDATE_HOPS_ELIGIBILITY = SpecificActionType<
  "UPDATE_HOPS_ELIGIBILITY",
  HopsEligibility
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
    dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
    getState: () => StateType
  ) => {
    const hopsUppersecondaryApi = MApi.getHopsUpperSecondaryApi();

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

      const hops = await hopsUppersecondaryApi.getHops();

      const hopsEligibility = await hopsUppersecondaryApi.getHopsEligibility();

      dispatch({
        type: "UPDATE_HOPS_ELIGIBILITY",
        payload: hopsEligibility,
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
      if (!isMApiError(err)) {
        throw err;
      }
      dispatch(
        actions.displayNotification(
          getState().i18n.text.get(
            "plugin.records.hops.errormessage.hopsLoadFailed"
          ),
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
    dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
    getState: () => StateType
  ) => {
    const hopsUppersecondaryApi = MApi.getHopsUpperSecondaryApi();

    try {
      const updatedHops = await hopsUppersecondaryApi.updateHops({
        updateHopsRequest: newHops,
      });

      dispatch({
        type: "UPDATE_HOPS",
        payload: updatedHops,
      });
    } catch (err) {
      if (!isMApiError(err)) {
        throw err;
      }
      dispatch(
        actions.displayNotification(
          getState().i18n.text.get(
            "plugin.records.hops.errormessage.hopsUpdateFailed"
          ),
          "error"
        )
      );
    }
  };
};

export default { updateHops, setHopsTo };
export { updateHops, setHopsTo };
