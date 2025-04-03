import {
  View,
  Locale,
  DropdownButtonView,
  DropdownView,
  DropdownPanelView,
  ButtonView,
  submitHandler,
} from "ckeditor5";
import { SelectionFieldFormData, SelectionFieldType } from "../types";

// The options for the list type select
const options: {
  label: string;
  value: SelectionFieldType;
}[] = [
  { label: "Dropdown", value: "dropdown" },
  { label: "List", value: "list" },
  { label: "Radio - Vaaka", value: "radio-horizontal" },
  { label: "Radio - Pysty", value: "radio-vertical" },
  { label: "Checkbox - Vaaka", value: "checkbox-horizontal" },
  { label: "Checkbox - Pysty", value: "checkbox-vertical" },
];

/**
 * Selection field form view
 */
export default class SelectionFieldFormView extends View {
  private listTypeSelectValue: SelectionFieldType = "dropdown";

  private listTypeSelect: DropdownView;

  /**
   * Constructor
   * @param locale - The locale
   */
  constructor(locale: Locale) {
    super(locale);

    this.listTypeSelect = this._createListTypeSelect();

    this.setTemplate({
      tag: "form",
      attributes: {
        class: ["ck", "ck-field-form"],
        tabindex: "-1",
      },
      children: [
        {
          tag: "div",
          attributes: {
            class: ["ck", "ck-form__body"],
            style: "padding: 10px;",
          },
          children: [
            {
              tag: "div",
              attributes: {
                class: ["ck", "ck-form__row"],
              },
              children: [this.listTypeSelect],
            },
          ],
        },
      ],
    });
  }

  /**
   * @returns The directionSelect dropdown field
   */
  private _createListTypeSelect(): DropdownView {
    const button = new DropdownButtonView(this.locale);
    const panel = new DropdownPanelView(this.locale);
    const dropdown = new DropdownView(this.locale, button, panel);

    button.set({
      label: "Tyyppi",
      withText: true,
      tooltip: true,
    });

    // Create items collection and add options
    const itemsView = new View(this.locale);
    const items: ButtonView[] = [];

    options.forEach((option) => {
      const buttonView = new ButtonView(this.locale);

      buttonView.set({
        label: option.label,
        withText: true,
      });

      // Handle option selection
      buttonView.on("execute", () => {
        this.listTypeSelectValue = option.value;
        button.label = option.label; // Update button label
        dropdown.isOpen = false; // Close the dropdown after selection
      });

      items.push(buttonView);
    });

    // Set up the items view
    itemsView.setTemplate({
      tag: "div",
      attributes: {
        class: ["ck", "ck-dropdown__panel-items"],
        style: "display: flex; flex-direction: column; gap: 4px;",
      },
      children: items,
    });

    // Add items view to the panel
    dropdown.panelView.children.add(itemsView);

    // Bind panel to button
    dropdown.bind("isEnabled").to(button);

    // Enable the dropdown
    dropdown.isEnabled = true;

    return dropdown;
  }

  /**
   * Gets the form data
   * @returns The form data
   */
  getData(): SelectionFieldFormData {
    return {
      listType: this.listTypeSelectValue,
    };
  }

  /**
   * Sets the form data
   * @param data The form data
   */
  setData(data: SelectionFieldFormData): void {
    this.listTypeSelectValue = data.listType;

    const selectedOption = options.find((opt) => opt.value === data.listType);

    if (selectedOption) {
      this.listTypeSelect.buttonView.label = selectedOption.label;
    }
  }

  /**
   * Resets the form
   */
  reset(): void {
    this.setData({
      listType: "dropdown",
    });
  }

  /**
   * Renders the form
   */
  render(): void {
    super.render();

    // Submit the form when the user clicked the save button
    // or pressed enter in the input.
    submitHandler({
      view: this,
    });
  }
}
