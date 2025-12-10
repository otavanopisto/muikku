import * as React from "react";
import Dialog from "~/components/general/dialog";
import { ChromePicker, ColorState } from "react-color";
import "~/sass/elements/form.scss";
import Button from "~/components/general/button";
import "~/sass/elements/glyph.scss";
import "~/sass/elements/color-picker.scss";
import { colorIntToHex, hexToColorInt } from "~/util/modifiers";
import { useTranslation } from "react-i18next";

const KEYCODES = {
  ENTER: 13,
};

export type GenericTag = {
  id: number;
  label: string;
  color: number;
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
 * TagUpdateDialog component
 * @param props component props
 * @returns JSX.Element
 */
const TagUpdateDialog: React.FC<TagUpdateDialogProps> = (props) => {
  const { tag, title, isOpen, onClose, onOpen, onUpdate, children } = props;
  const { t } = useTranslation();
  const [displayColorPicker, setDisplayColorPicker] = React.useState(false);
  const [color, setColor] = React.useState(colorIntToHex(tag.color));
  const [name, setName] = React.useState(tag.label);
  const [locked, setLocked] = React.useState(false);

  /**
   * handleColorPickerToggle handler for color picker display toggle
   */
  const handleColorPickerToggle = () => {
    setDisplayColorPicker(!displayColorPicker);
  };

  /**
   * handleColorPickerClose handler for color picker close
   */
  const handleColorPickerClose = () => {
    setDisplayColorPicker(false);
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
    setColor(color.hex);
  };

  /**
   * handleNameChange handler for name input change
   * @param e event
   */
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setName(e.target.value);
  };

  /**
   * handleUpdate handler for update action
   * @param closeDialog closeDialog function
   */
  const handleUpdate = (closeDialog: () => void) => {
    if (locked) {
      return;
    }
    /**
     * success callback
     */
    const success = () => {
      setLocked(false);
      closeDialog();
    };

    /**
     * fail callback
     */
    const fail = () => {
      setLocked(false);
    };

    if (name !== tag.label || color !== colorIntToHex(tag.color)) {
      setLocked(true);

      const data: GenericTag = {
        id: tag.id,
        label: name,
        color: hexToColorInt(color),
      };

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
        disabled={locked}
        onClick={() => handleUpdate(closeDialog)}
      >
        {t("actions.save")}
      </Button>
      <Button
        buttonModifiers={["cancel", "standard-cancel"]}
        disabled={locked}
        onClick={closeDialog}
      >
        {t("actions.cancel")}
      </Button>
    </div>
  );

  const sliderPicker = (
    <ChromePicker disableAlpha color={color} onChange={handleColorChange} />
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
            borderColor: color,
          }}
          onClick={handleColorPickerToggle}
        >
          <span
            className={`glyph icon-tag`}
            style={{
              color: color,
            }}
          />
        </div>
        {displayColorPicker && (
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
          <label htmlFor="announcementCategoryName">{t("labels.name")}</label>
          <input
            id="announcementCategoryName"
            placeholder={t("labels.name")}
            value={name}
            className="form-element__input form-element__input--announcement-category-name"
            onChange={handleNameChange}
          />
        </div>
      </div>
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
