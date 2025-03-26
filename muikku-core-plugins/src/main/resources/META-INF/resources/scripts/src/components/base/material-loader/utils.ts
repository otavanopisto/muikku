import { FieldStateStatus } from "~/@types/shared";

/**
 * createFieldSavedStateClass
 * @param state state
 * @returns string
 */
export function createFieldSavedStateClass(state: FieldStateStatus) {
  let fieldSavedStateClass = "";
  if (state === "ERROR") {
    fieldSavedStateClass = "state-ERROR";
  } else if (state === "SAVING") {
    fieldSavedStateClass = "state-SAVING";
  } else if (state === "SAVED") {
    fieldSavedStateClass = "state-SAVED";
  }

  return fieldSavedStateClass;
}
