import { SpecificActionType } from "~/actions";
import { ErrorType } from "~/reducers/base/error";
export type UPDATE_ERROR = SpecificActionType<"UPDATE_ERROR", ErrorType>;

/**
 * UpdateErrorTriggerType
 */
export interface UpdateErrorTriggerType {
  (error: ErrorType): UPDATE_ERROR;
}

/**
 * updateError
 * @param error error
 */
const updateError: UpdateErrorTriggerType = function updateError(error) {
  return {
    type: "UPDATE_ERROR",
    payload: error,
  };
};

export default { updateError };
export { updateError };
