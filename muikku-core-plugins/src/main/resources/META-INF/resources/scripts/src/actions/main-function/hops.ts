import actions from "../base/notifications";
import { AnyActionType, SpecificActionType } from "~/actions";
import { HOPSStatusType } from "~/reducers/main-function/hops";
import { StateType } from "~/reducers";
import { Dispatch } from "react-redux";
import MApi, { isMApiError } from "~/api/api";
import { HopsEligibility, HopsUppersecondary } from "~/generated/client";
import i18n from "~/locales/i18n";

/**
 * UpdateHopsTriggerType
 */
export interface UpdateHopsTriggerType {
  (callback?: () => void, userId?: string): AnyActionType;
}
/**
 * GetHopsPhaseTriggerType
 */
export interface SetHopsPhaseTriggerType {
  (userEntityId: number): AnyActionType;
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
 *
 * @param userEntityId numeric user id
 * @returns a thunk function
 */
const setHopsPhase: SetHopsPhaseTriggerType = function setHopsPhase(
  userEntityId: number
) {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
    getState: () => StateType
  ) => {
    if (getState().hops.hopsPhase) {
      return;
    }
    const userApi = MApi.getUserApi();
    const properties = await userApi.getUserProperties({
      userEntityId: userEntityId,
      properties: "hopsPhase",
    });

    dispatch({
      type: "SET_HOPS_PHASE",
      payload: properties[0].value,
    });
  };
};

/**
 * updateHops
 * @param callback callback
 * @param userIdentifier muikku user identifier
 */
const updateHops: UpdateHopsTriggerType = function updateHops(
  callback,
  userIdentifier
) {
  return async (
    dispatch: (arg: AnyActionType) => Dispatch<AnyActionType>,
    getState: () => StateType
  ) => {
    const state = getState();
    const hopsUppersecondaryApi = MApi.getHopsUpperSecondaryApi();
    const userApi = MApi.getUserApi();

    const studentIdentifier = userIdentifier
      ? userIdentifier
      : state.status.userSchoolDataIdentifier;

    try {
      if (getState().hops.status !== "WAIT") {
        callback && callback();
        return;
      }
      dispatch({
        type: "UPDATE_HOPS_STATUS",
        payload: <HOPSStatusType>"LOADING",
      });

      // If userIdentifier is provided,
      // this is not your own HOPS and this will be done elsewhere at a better time
      if (!userIdentifier) {
        const properties = await userApi.getUserProperties({
          userEntityId: state.status.userId,
          properties: "hopsPhase",
        });

        dispatch({
          type: "SET_HOPS_PHASE",
          payload: properties[0].value,
        });
      }

      const hops = userIdentifier
        ? await hopsUppersecondaryApi.getHopsByUser({
            userIdentifier,
          })
        : await hopsUppersecondaryApi.getHops();

      const hopsEligibility = await hopsUppersecondaryApi.getHopsEligibility({
        studentIdentifier,
      });

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
          i18n.t("notifications.updateError", { ns: "hops" }),
          "error"
        )
      );
    }
  };
};

export default { updateHops, setHopsTo };
export { updateHops, setHopsPhase, setHopsTo };
