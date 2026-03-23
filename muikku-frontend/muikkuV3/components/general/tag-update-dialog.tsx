import * as React from "react";
import { useSelector } from "react-redux";
import Dialog from "~/components/general/dialog";
import { ChromePicker, ColorState } from "react-color";
import "~/sass/elements/form.scss";
import Button from "~/components/general/button";
import "~/sass/elements/glyph.scss";
import "~/sass/elements/color-picker.scss";
import { colorIntToHex, hexToColorInt } from "~/util/modifiers";
import { useTranslation } from "react-i18next";

import { ContactRecipientType } from "~/reducers/user-index";
import InputContactsAutofill from "~/components/base/input-contacts-autofill";
import { StateType } from "~/reducers";

const KEYCODES = {
  ENTER: 13,
};

export type Collaborator = {
  name: string;
  id: number;
  identifier: string;
};

export type GenericTag = {
  id: number;
  label: string;
  color: number;
  description?: string;
  collaborators?: Collaborator[];
  includeRecipients?: boolean;
  ownerIdentifier?: string;
};

/**
 * TagUpdateDialogProps
 */
interface TagUpdateDialogProps {
  children: React.ReactElement;
  title?: string;
  tag: GenericTag;
  isOpen?: boolean;
  onOpen?: () => void;
  onClose?: () => void;
  onUpdate: (tag: GenericTag, success?: () => void, fail?: () => void) => void;
}

/**
 * TagUpdateDialogState
 */
interface TagUpdateDialogState {
  displayColorPicker: boolean;
  color: string;
  name: string;
  description: string;
  collaborators: ContactRecipientType[];
  locked: boolean;
}

type TagUpdateDialogAction =
  | { type: "SET_COLOR"; payload: string }
  | { type: "SET_NAME"; payload: string }
  | { type: "SET_DESCRIPTION"; payload: string }
  | { type: "SET_COLLABORATORS"; payload: ContactRecipientType[] }
  | { type: "TOGGLE_COLOR_PICKER" }
  | { type: "CLOSE_COLOR_PICKER" }
  | { type: "SET_LOCKED"; payload: boolean }
  | {
      type: "RESET";
      payload: { tag: GenericTag; collaborators: ContactRecipientType[] };
    };

/**
 * Reducer for tag update dialog state
 * @param state current state
 * @param action action to perform
 * @returns new state
 */
const tagUpdateDialogReducer = (
  state: TagUpdateDialogState,
  action: TagUpdateDialogAction
): TagUpdateDialogState => {
  switch (action.type) {
    case "SET_COLOR":
      return { ...state, color: action.payload };
    case "SET_NAME":
      return { ...state, name: action.payload };
    case "SET_DESCRIPTION":
      return { ...state, description: action.payload };
    case "SET_COLLABORATORS":
      return { ...state, collaborators: action.payload };
    case "TOGGLE_COLOR_PICKER":
      return { ...state, displayColorPicker: !state.displayColorPicker };
    case "CLOSE_COLOR_PICKER":
      return { ...state, displayColorPicker: false };
    case "SET_LOCKED":
      return { ...state, locked: action.payload };
    case "RESET":
      return {
        ...state,
        color: colorIntToHex(action.payload.tag.color),
        name: action.payload.tag.label,
        description: action.payload.tag.description || "",
        collaborators: action.payload.collaborators,
        //collaboratorsToAdd: [],
        //collaboratorsToRemove: [],
        locked: false,
        displayColorPicker: false,
      };
    default:
      return state;
  }
};

/**
 * TagUpdateDialog component
 * @param props component props
 * @returns JSX.Element
 */
const TagUpdateDialog: React.FC<TagUpdateDialogProps> = (props) => {
  const { tag, title, isOpen, onClose, onOpen, onUpdate, children } = props;
  const { t } = useTranslation();
  const status = useSelector((state: StateType) => state.status);

  const [state, dispatchState] = React.useReducer(tagUpdateDialogReducer, {
    displayColorPicker: false,
    color: colorIntToHex(tag.color),
    name: tag.label,
    description: tag.description,
    collaborators: [],
    locked: false,
  });

  // Sync collaborators from tag prop to state whenever they change
  React.useEffect(() => {
    if (tag.collaborators && Array.isArray(tag.collaborators)) {
      const loadedCollaborators = tag.collaborators
        .map(
          (result: Collaborator): ContactRecipientType => ({
            type: "staff",
            value: {
              id: result.id,
              name: result.name,
              email: "unknown",
              identifier: result.identifier,
            },
          })
        )
        .filter((r: ContactRecipientType) => r !== null);

      dispatchState({
        type: "SET_COLLABORATORS",
        payload: loadedCollaborators,
      });
    }
  }, [tag.collaborators]);

  /**
   * handleColorPickerToggle handler for color picker display toggle
   */
  const handleColorPickerToggle = () => {
    dispatchState({ type: "TOGGLE_COLOR_PICKER" });
  };

  /**
   * handleColorPickerClose handler for color picker close
   */
  const handleColorPickerClose = () => {
    dispatchState({ type: "CLOSE_COLOR_PICKER" });
  };

  /**
   * handleKeydown handler for keydown events
   * @param code key code
   * @param closeDialog closeDialog function
   */
  const handleKeydown = (code: number, closeDialog: () => void) => {
    if (code === KEYCODES.ENTER) {
      handleUpdate(closeDialog);
    }
  };

  /**
   * handleColorChange handler for color picker color change
   * @param color color picker color state
   */
  const handleColorChange = (color: ColorState) => {
    dispatchState({ type: "SET_COLOR", payload: color.hex });
  };

  /**
   * handleNameChange handler for name input change
   * @param e event
   */
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatchState({ type: "SET_NAME", payload: e.target.value });
  };

  /**
   * handleDescriptionChange handler for description input change
   * @param e event
   */
  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    dispatchState({ type: "SET_DESCRIPTION", payload: e.target.value });
  };

  /**
   * handleCollaboratorsChange handler for collaborators input change
   * @param selectedCollaborators selected collaborators
   */
  const handleCollaboratorsChange = (
    selectedCollaborators: ContactRecipientType[]
  ) => {
    dispatchState({
      type: "SET_COLLABORATORS",
      payload: selectedCollaborators,
    });
  };

  /**
   * handleUpdate handler for update action
   * @param closeDialog closeDialog function
   */
  const handleUpdate = (closeDialog: () => void) => {
    if (state.locked) {
      return;
    }
    /**
     * success callback
     */
    const success = () => {
      dispatchState({ type: "SET_LOCKED", payload: false });
      closeDialog();
    };

    /**
     * fail callback
     */
    const fail = () => {
      dispatchState({ type: "SET_LOCKED", payload: false });
    };

    if (
      state.name !== tag.label ||
      state.color !== colorIntToHex(tag.color) ||
      state.description !== (tag.description || "") ||
      state.collaborators.length !== tag.collaborators.length ||
      !state.collaborators.every((c) =>
        tag.collaborators?.some((tc) => tc.id === c.value.id)
      )
    ) {
      dispatchState({ type: "SET_LOCKED", payload: true });

      // Transform collaborators to Collaborator type
      const collaborators = state.collaborators.map(
        (c) =>
          ({
            name: c.value.name,
            id: c.value.id,
            identifier: c.value.identifier,
          }) as Collaborator
      );

      const data: GenericTag = {
        id: tag.id,
        label: state.name,
        color: hexToColorInt(state.color),
        description: state.description,
        collaborators,
      };
      dispatchState({
        type: "RESET",
        payload: { tag: data, collaborators: state.collaborators },
      });
      onUpdate(data, success, fail);
    } else {
      closeDialog();
    }
  };

  /**
   * footer component
   * @param closeDialog close dialog function
   * @returns footer component
   */
  const footer = (closeDialog: () => void) => (
    <div className="dialog__button-set">
      <Button
        buttonModifiers={["success", "standard-ok"]}
        disabled={state.locked}
        onClick={() => handleUpdate(closeDialog)}
      >
        {t("actions.save")}
      </Button>
      <Button
        buttonModifiers={["cancel", "standard-cancel"]}
        disabled={state.locked}
        onClick={closeDialog}
      >
        {t("actions.cancel")}
      </Button>
    </div>
  );

  const sliderPicker = (
    <ChromePicker
      disableAlpha
      color={state.color}
      onChange={handleColorChange}
    />
  );

  /**
   * content component
   * @param closeDialog dialog close function
   * @returns content component
   */
  const content = (closeDialog: () => void) => (
    <div className="dialog__content-row dialog__content-row--label">
      <div className="dialog__container dialog__container--color-picker">
        <div
          className="dialog__icon-container"
          style={{
            borderColor: state.color,
          }}
          onClick={handleColorPickerToggle}
        >
          <span
            className={`glyph icon-tag`}
            style={{
              color: state.color,
            }}
          />
        </div>
        {state.displayColorPicker && (
          <div className="color-picker">
            <div
              className="color-picker-overlay"
              onClick={handleColorPickerClose}
            />
            {sliderPicker}
          </div>
        )}
      </div>
      <div className="dialog__container dialog__container--label-form">
        <div className="form-element form-element--edit-label">
          <label htmlFor="tagCategoryName">{t("labels.name")}</label>
          <input
            id="tagCategoryName"
            placeholder={t("labels.name")}
            value={state.name}
            className="form-element__input form-element__input--announcement-category-name"
            onChange={handleNameChange}
          />
        </div>
      </div>
      {state.description !== undefined && (
        <div className="form-element form-element--edit-label">
          <label htmlFor="guiderLabelDescription">
            {t("labels.description")}
          </label>
          <textarea
            id="guiderLabelDescription"
            placeholder={t("labels.description")}
            className="form-element__textarea form-element__textarea--edit-label"
            value={state.description}
            onChange={handleDescriptionChange}
          />
        </div>
      )}
      {tag.ownerIdentifier === status.userSchoolDataIdentifier &&
        tag.collaborators && (
          <div className="form-element form-element--edit-label">
            <InputContactsAutofill
              label={t("labels.addCollaborators", { ns: "flags" })}
              identifier="guiderLabelShare"
              modifier="guider"
              onChange={handleCollaboratorsChange}
              selectedItems={state.collaborators}
              hasGroupPermission={false}
              hasUserPermission={false}
              hasWorkspacePermission={false}
              hasStaffPermission
              showEmails={false}
              showFullNames
            />
          </div>
        )}
    </div>
  );

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      onKeyStroke={handleKeydown}
      onOpen={onOpen}
      modifier="communicator-edit-label"
      title={title ? title : t("labels.edit")}
      content={content}
      footer={footer}
    >
      {children}
    </Dialog>
  );
};

export default TagUpdateDialog;
