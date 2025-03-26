import { FieldStateStatus } from "~/@types/shared";
import CKEditor4Parser from "./components/fields/parser/ckeditor4";
import CKEditor5Parser from "./components/fields/parser/ckeditor5";

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

/**
 * getParser
 * @param editorVersion editorVersion
 * @returns FieldDataParser
 */
export const getParser = (editorVersion: "ckeditor4" | "ckeditor5") => {
  switch (editorVersion) {
    case "ckeditor4":
      return new CKEditor4Parser();
    case "ckeditor5":
      return new CKEditor5Parser();
    default:
      throw new Error(`Unknown editor version: ${editorVersion}`);
  }
};
