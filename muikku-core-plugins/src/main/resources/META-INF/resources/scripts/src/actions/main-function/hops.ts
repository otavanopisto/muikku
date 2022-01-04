import actions from "../base/notifications";
import promisify from "~/util/promisify";
import { AnyActionType, SpecificActionType } from "~/actions";
import mApi, { MApiError } from "~/lib/mApi";
import {
  HOPSDataType,
  HOPSStatusType,
  HOPSEligibilityType
} from "~/reducers/main-function/hops";
import { StateType } from "~/reducers";
import {
  YOMatriculationSubjectType,
  SubjectEligibilityType,
  EligibleStatusType
} from "~/reducers/main-function/records/yo";

export interface UpdateHopsTriggerType {
  (callback?: () => void): AnyActionType;
}

export interface SetHopsToTriggerType {
  (newHops: HOPSDataType): AnyActionType;
}

export interface UPDATE_HOPS
  extends SpecificActionType<"UPDATE_HOPS", HOPSDataType> {}
export interface UPDATE_HOPS_ELIGIBILITY
  extends SpecificActionType<"UPDATE_HOPS_ELIGIBILITY", HOPSEligibilityType> {}
export interface UPDATE_HOPS_STATUS
  extends SpecificActionType<"UPDATE_HOPS_STATUS", HOPSStatusType> {}

let updateHops: UpdateHopsTriggerType = function updateHops(callback) {
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
        payload: <HOPSStatusType>"LOADING"
      });

      let hops = <HOPSDataType>(
        await promisify(mApi().records.hops.read(), "callback")()
      );

      dispatch({
        type: "UPDATE_HOPS_ELIGIBILITY",
        payload: <HOPSEligibilityType>(
          await promisify(mApi().records.hopseligibility.read(), "callback")()
        )
      });
      dispatch({
        type: "UPDATE_HOPS",
        payload: hops
      });
      dispatch({
        type: "UPDATE_HOPS_STATUS",
        payload: <HOPSStatusType>"READY"
      });

      callback && callback();
    } catch (err) {
      if (!(err instanceof MApiError)) {
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
        payload: <HOPSStatusType>"ERROR"
      });
    }
  };
};

let setHopsTo: SetHopsToTriggerType = function setHopsTo(newHops) {
  return async (
    dispatch: (arg: AnyActionType) => any,
    getState: () => StateType
  ) => {
    try {
      dispatch({
        type: "UPDATE_HOPS",
        payload: <HOPSDataType>(
          await promisify(mApi().records.hops.update(newHops), "callback")()
        )
      });
    } catch (err) {
      if (!(err instanceof MApiError)) {
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
