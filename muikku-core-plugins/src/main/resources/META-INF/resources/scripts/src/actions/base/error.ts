import { SpecificActionType } from "~/actions";
import { ErrorType } from "~/reducers/base/error";
export interface UPDATE_ERROR
  extends SpecificActionType<"UPDATE_ERROR", ErrorType> {}

export interface UpdateErrorTriggerType {
  (error: ErrorType): UPDATE_ERROR;
}

let updateError: UpdateErrorTriggerType = function updateError(error) {
  return {
    type: "UPDATE_ERROR",
    payload: error
  };
};

export default { updateError };
export { updateError };
