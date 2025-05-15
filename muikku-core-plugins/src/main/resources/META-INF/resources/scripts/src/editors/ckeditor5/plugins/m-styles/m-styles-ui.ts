import {
  Plugin,
  createDropdown,
  addListToDropdown,
  Collection,
  ListDropdownItemDefinition,
  ListDropdownButtonDefinition,
  ViewModel,
  Command,
} from "ckeditor5";
import { MuikkuStyleDefinition } from "../types";
import { stylesSet } from "../styles";

/**
 * Checks if the item is a ListDropdownButtonDefinition
 * @param item - The item to check
 * @returns True if the item is a ListDropdownButtonDefinition, false otherwise
 */
function isListDropdownButtonDefinition(
  item: ListDropdownItemDefinition
): item is ListDropdownButtonDefinition {
  return item.type === "button";
}

/**
 * MStyles UI plugin
 */
export default class MStylesUI extends Plugin {
  private dropdownOptions: Collection<ListDropdownItemDefinition> | null = null;
  private command: Command | null = null;

  /**
   * Initialize the plugin
   */
  init() {
    if (!this.editor) {
      throw new Error("Editor instance is not available in MStylesUI");
    }

    this.command = this.editor.commands.get("mStylesApply");

    this.dropdownOptions = new Collection<ListDropdownButtonDefinition>();

    stylesSet.forEach((style) => {
      this.dropdownOptions.add({
        type: "button",
        model: new ViewModel({
          id: style.name,
          withText: true,
          label: style.name,
          styleDefinition: style,
        }),
      });
    });

    this.dropdownOptions.forEach((item) => {
      if (isListDropdownButtonDefinition(item)) {
        item.model
          .bind("isOn")
          .to(this.command, "value", (value: MuikkuStyleDefinition) => {
            if (!value) return false;

            return (
              value.name ===
              (item.model.styleDefinition as MuikkuStyleDefinition).name
            );
          });
      }
    });

    this._createDropdownView(this.dropdownOptions);
  }

  /**
   * Creates a new dropdown view
   * @param dropdownOptions - The dropdown options
   */
  private _createDropdownView(
    dropdownOptions: Collection<ListDropdownItemDefinition>
  ): void {
    this.editor.ui.componentFactory.add("muikku-m-styles", (locale) => {
      const dropdownView = createDropdown(locale);

      addListToDropdown(dropdownView, dropdownOptions);

      dropdownView.buttonView.set({
        label: "Muikku Styles",
        tooltip: true,
        withText: true,
      });

      dropdownView.buttonView
        .bind("label")
        .to(
          this.command,
          "value",
          (value: MuikkuStyleDefinition) => value?.name || "Muikku Styles"
        );

      // No action on click yet
      dropdownView.on("execute", (evt, data) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const styleDefinition = (evt.source as any).styleDefinition;

        if (styleDefinition) {
          this.editor.execute("mStylesApply", styleDefinition);
        }
      });

      return dropdownView;
    });
  }
}
