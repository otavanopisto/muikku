import {
  View,
  Locale,
  Collection,
  createDropdown,
  LabeledFieldView,
  ViewModel,
  ListDropdownButtonDefinition,
  DropdownView,
  addListToDropdown,
  createLabeledInputText,
  InputTextView,
  submitHandler,
} from "ckeditor5";
import { stylesSet } from "../styles";
import { DivBlockFormData } from "../types";
import { directionOptions, textPartLanguages } from "../../configs";
/**
 * Form view for the DivBlock plugin
 */
export default class DivBlockFormView extends View {
  private styleDropdown: DropdownView;
  private selectedStyleClassField: LabeledFieldView<InputTextView>;
  private titleField: LabeledFieldView<InputTextView>;
  private idField: LabeledFieldView<InputTextView>;
  private langDropdown: DropdownView;
  private selectedLangField: LabeledFieldView<InputTextView>;
  private dirDropdown: DropdownView;
  private selectedDirField: LabeledFieldView<InputTextView>;

  /**
   * Constructor for the DivBlockFormView class
   * @param locale - The locale to use for the form
   */
  constructor(locale: Locale) {
    super(locale);

    const styleOptions = stylesSet.map((style) => ({
      label: style.name,
      value: style.attributes.class as string,
    }));

    const langOptions = textPartLanguages.map((lang) => ({
      label: lang.title,
      value: lang.languageCode,
    }));

    const dirOptions = directionOptions.map((dir) => ({
      label: dir.title,
      value: dir.direction,
    }));

    // Create style dropdown
    this.styleDropdown = this._createDropdownView(
      "Select style",
      "No style selected",
      styleOptions,
      (evt, optionsCollection, dropdown) => {
        const selectedValue = evt.source.label;
        const selectedStyle = optionsCollection.find(
          (option) => option.model.label === selectedValue
        );

        // Update dropdown label
        dropdown.buttonView.set({
          label: selectedValue,
        });

        // Update custom class field with the selected style's class
        if (selectedStyle) {
          this.selectedStyleClassField.fieldView.value = selectedStyle.model
            .value as string;
        } else {
          // If "No style" is selected, clear the custom class
          this.selectedStyleClassField.fieldView.value = "";
        }

        optionsCollection.forEach((option) => {
          option.model.isOn = option.model.label === selectedValue;
        });
      }
    );

    this.langDropdown = this._createDropdownView(
      "Select language",
      "No language selected",
      langOptions,
      (evt, optionsCollection, dropdown) => {
        const selectedValue = evt.source.label;
        const selectedLang = optionsCollection.find(
          (option) => option.model.label === selectedValue
        );

        // Update dropdown label
        dropdown.buttonView.set({
          label: selectedValue,
        });

        // Update custom class field with the selected style's class
        if (selectedLang) {
          this.selectedLangField.fieldView.value = selectedLang.model
            .value as string;
        } else {
          this.selectedLangField.fieldView.value = "";
        }

        optionsCollection.forEach((option) => {
          option.model.isOn = option.model.label === selectedValue;
        });
      }
    );

    this.dirDropdown = this._createDropdownView(
      "Select direction",
      "No direction selected",
      dirOptions,
      (evt, optionsCollection, dropdown) => {
        const selectedValue = evt.source.label;
        const selectedDir = optionsCollection.find(
          (option) => option.model.label === selectedValue
        );

        // Update dropdown label
        dropdown.buttonView.set({
          label: selectedValue,
        });

        if (selectedDir) {
          this.selectedDirField.fieldView.value = selectedDir.model
            .value as string;
        } else {
          this.selectedDirField.fieldView.value = "";
        }

        optionsCollection.forEach((option) => {
          option.model.isOn = option.model.label === selectedValue;
        });
      }
    );

    // Create custom class field
    this.selectedStyleClassField = this._createInputField(
      "Selected style class",
      true
    );

    // Create language field
    this.selectedLangField = this._createInputField("Selected language", true);

    // Create direction field
    this.selectedDirField = this._createInputField("Selected direction", true);

    // Create id field
    this.idField = this._createInputField("ID");

    // Create title field
    this.titleField = this._createInputField("Title");

    this.setTemplate({
      tag: "form",
      attributes: {
        class: ["ck", "ck-divblock-form"],
        tabindex: "-1",
      },
      children: [
        {
          tag: "div",
          attributes: {
            class: ["ck", "ck-form__row", "ck-form__row--horizontal"],
            style: "display: flex; gap: 8px; align-items: flex-end;", // Inline style for quick test
          },
          children: [this.idField, this.titleField],
        },
        {
          tag: "div",
          attributes: {
            class: ["ck", "ck-form__row", "ck-form__row--horizontal"],
            style: "display: flex; gap: 8px; align-items: flex-end;", // Inline style for quick test
          },
          children: [this.styleDropdown, this.selectedStyleClassField],
        },
        {
          tag: "div",
          attributes: {
            class: ["ck", "ck-form__row", "ck-form__row--horizontal"],
            style: "display: flex; gap: 8px; align-items: flex-end;", // Inline style for quick test
          },
          children: [this.langDropdown, this.selectedLangField],
        },
        {
          tag: "div",
          attributes: {
            class: ["ck", "ck-form__row", "ck-form__row--horizontal"],
            style: "display: flex; gap: 8px; align-items: flex-end;", // Inline style for quick test
          },
          children: [this.dirDropdown, this.selectedDirField],
        },
      ],
    });
  }

  /**
   * Creates a dropdown view
   * @param label - The label for the dropdown
   * @param notSelectedLabel - The label for the "not selected" option
   * @param options - The options for the dropdown
   * @param callback - The callback to execute when the dropdown is selected
   * @returns The dropdown view
   */
  private _createDropdownView(
    label: string,
    notSelectedLabel: string,
    options: Array<{ label: string; value: string }>,
    callback: (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      evt: any,
      optionsCollection: Collection<ListDropdownButtonDefinition>,
      dropdown: DropdownView
    ) => void
  ) {
    const dropdown = createDropdown(this.locale);
    const optionsCollection = new Collection<ListDropdownButtonDefinition>();

    // Add "No style" option
    optionsCollection.add({
      type: "button",
      model: new ViewModel({
        label: notSelectedLabel,
        value: "",
        withText: true,
      }),
    });

    options.forEach((option) => {
      optionsCollection.add({
        type: "button",
        model: new ViewModel({
          label: option.label,
          value: option.value,
          withText: true,
        }),
      });
    });

    addListToDropdown(dropdown, optionsCollection);

    // Set the label for the dropdown
    dropdown.buttonView.set({
      label,
      withText: true,
    });

    // Listen to item selection
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dropdown.on("execute", (evt: any) =>
      callback(evt, optionsCollection, dropdown)
    );

    return dropdown;
  }

  /**
   * Creates an input field
   * @param label - The label for the input field
   * @param disabled - Whether the input field is disabled
   * @returns The input field
   */
  private _createInputField(label: string, disabled: boolean = false) {
    const labeledField = new LabeledFieldView(
      this.locale,
      createLabeledInputText
    );

    labeledField.label = label;
    labeledField.isEnabled = !disabled;

    return labeledField;
  }

  /**
   * Gets the data from the form
   * @returns The data from the form
   */
  public getData(): DivBlockFormData {
    // Find the selected style
    const selectedStyle = stylesSet.find(
      (style) => style.name === this.styleDropdown.buttonView.label
    );

    // Find the selected language
    const selectedLang = textPartLanguages.find(
      (lang) => lang.title === this.langDropdown.buttonView.label
    );

    // Find the selected direction
    const selectedDir = directionOptions.find(
      (dir) => dir.title === this.dirDropdown.buttonView.label
    );

    return {
      styleSet: (selectedStyle?.attributes.class as string) || "",
      title: this.titleField.fieldView.element.value,
      id: this.idField.fieldView.element.value,
      lang: selectedLang?.languageCode || "",
      dir: selectedDir?.direction || "",
    };
  }

  /**
   * Sets the data for the form
   * @param data - The data to set for the form
   */
  public setData(data: DivBlockFormData) {
    // Find the selected style
    const selectedStyle = stylesSet.find(
      (style) => style.name === data.styleSet
    );

    // Find the selected language
    const selectedLang = textPartLanguages.find(
      (lang) => lang.languageCode === data.lang
    );

    // Find the selected direction
    const selectedDir = directionOptions.find(
      (dir) => dir.direction === data.dir
    );

    // Set the data for the form
    this.styleDropdown.buttonView.label = selectedStyle?.name || "";
    this.selectedStyleClassField.fieldView.value =
      (selectedStyle?.attributes.class as string) || "";
    this.titleField.fieldView.value = data.title || "";
    this.idField.fieldView.value = data.id || "";
    this.langDropdown.buttonView.label = selectedLang?.title || "";
    this.dirDropdown.buttonView.label = selectedDir?.title || "";
  }

  /**
   * Resets the form
   */
  public reset() {
    this.setData({
      styleSet: "",
      title: "",
      id: "",
      lang: "",
      dir: "",
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
