import {
  View,
  LabeledFieldView,
  InputTextView,
  createLabeledInputText,
  SwitchButtonView,
  submitHandler,
  Locale,
  DropdownView,
  createDropdown,
  addListToDropdown,
  Collection,
  ViewModel,
  ListDropdownButtonDefinition,
} from "ckeditor5";
import { AudioFormData } from "../types";

/**
 * Form view class for the TextField plugin.
 * Handles the UI form that appears when creating or editing a text field.
 */
export default class AudioFormView extends View {
  // Form elements
  public srcInput: LabeledFieldView<InputTextView>;
  public autoplayCheckbox: SwitchButtonView;
  public loopCheckbox: SwitchButtonView;
  public audioTypeDropdown: DropdownView;
  public controlsDropdown: DropdownView;

  /**
   * Creates an instance of TextFieldFormView.
   * @param locale - The locale instance for internationalization
   */
  constructor(locale: Locale) {
    super(locale);

    // Create form elements
    this.srcInput = this._createInput("Audio Source URL");
    this.autoplayCheckbox = this._createCheckbox("Autoplay");
    this.loopCheckbox = this._createCheckbox("Loop");
    this.audioTypeDropdown = this._createAudioTypeDropdown();
    this.controlsDropdown = this._createControlsDropdown();

    // Define the form template structure
    this.setTemplate({
      tag: "form",
      attributes: {
        class: ["ck", "ck-audio-form"],
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
            this.srcInput,
            {
              tag: "div",
              attributes: {
                class: ["ck", "ck-form__row"],
              },
              children: [this.autoplayCheckbox],
            },
            {
              tag: "div",
              attributes: {
                class: ["ck", "ck-form__row"],
              },
              children: [this.loopCheckbox],
            },
            {
              tag: "div",
              attributes: {
                class: ["ck", "ck-form__row"],
              },
              children: [this.audioTypeDropdown],
            },
            {
              tag: "div",
              attributes: {
                class: ["ck", "ck-form__row"],
              },
              children: [this.controlsDropdown],
            },
          ],
        },
      ],
    });
  }

  /**
   * Creates an input field with a label
   * @param label - The label text for the input field
   * @returns LabeledFieldView instance
   */
  private _createInput(label: string) {
    const labeledInput = new LabeledFieldView(
      this.locale,
      createLabeledInputText
    );

    labeledInput.label = label;

    return labeledInput;
  }

  /**
   * Creates a checkbox with a label
   * @param label - The label text for the checkbox
   * @returns LabeledFieldView instance
   */
  private _createCheckbox(label: string) {
    const checkbox = new SwitchButtonView(this.locale);

    checkbox.set({
      label,
      tooltip: true,
      isToggleable: true,
    });

    // Handle the execute event to toggle the switch state
    checkbox.on("execute", (evt) => {
      checkbox.set({
        isOn: !checkbox.isOn,
      });
    });

    return checkbox;
  }

  /**
   * Creates a dropdown for selecting the audio type
   * @returns DropdownView instance
   */
  private _createAudioTypeDropdown() {
    const dropdown = createDropdown(this.locale);
    const options = new Collection<ListDropdownButtonDefinition>();

    options.add({
      type: "button",
      model: new ViewModel({
        label: "WAV",
        value: "audio/wav",
        withText: true,
        isOn: false,
      }),
    });

    options.add({
      type: "button",
      model: new ViewModel({
        label: "MP3",
        value: "audio/mpeg",
        withText: true,
        isOn: false,
      }),
    });

    addListToDropdown(dropdown, options);

    dropdown.buttonView.set({
      label: "Audio Type",
      withText: true,
    });

    // Listen to item selection
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dropdown.on("execute", (evt: any) => {
      const selectedValue = evt.source.label;
      dropdown.buttonView.set({
        label: selectedValue,
      });

      options.forEach((option) => {
        option.model.isOn = option.model.label === selectedValue;
      });
    });
    return dropdown;
  }

  /**
   * Creates a dropdown for selecting the controls
   * @returns DropdownView instance
   */
  private _createControlsDropdown() {
    const dropdown = createDropdown(this.locale);
    const options = new Collection<ListDropdownButtonDefinition>();

    options.add({
      type: "button",
      model: new ViewModel({
        label: "Active",
        value: "active",
        withText: true,
        isOn: false,
      }),
    });

    options.add({
      type: "button",
      model: new ViewModel({
        label: "Hidden",
        value: "hidden",
        withText: true,
        isOn: false,
      }),
    });

    addListToDropdown(dropdown, options);

    dropdown.buttonView.set({
      label: "Controls",
      withText: true,
    });

    // Listen to item selection
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    dropdown.on("execute", (evt: any) => {
      const selectedValue = evt.source.label;
      dropdown.buttonView.set({
        label: selectedValue,
      });

      options.forEach((item) => {
        item.model.isOn = item.model.label === selectedValue;
      });
    });

    return dropdown;
  }

  /**
   * Focuses the width input field
   */
  focus(): void {
    this.srcInput.focus();
  }

  /**
   * Resets the form
   */
  reset(): void {
    this.setData({
      src: "",
      autoplay: false,
      loop: false,
      audioType: "audio/mpeg",
      controls: "active",
    });
  }

  /**
   * Gets the current form data
   * @returns TextFieldFormData object containing form values
   */
  getData(): AudioFormData {
    return {
      src: this.srcInput.fieldView.element.value,
      autoplay: this.autoplayCheckbox.isOn,
      loop: this.loopCheckbox.isOn,
      audioType:
        this.audioTypeDropdown.buttonView.label === "WAV"
          ? "audio/wav"
          : "audio/mpeg",
      controls:
        this.controlsDropdown.buttonView.label === "Active"
          ? "active"
          : "hidden",
    };
  }

  /**
   * Sets the form field values
   * @param data - TextFieldFormData object containing values to set
   */
  setData(data: AudioFormData): void {
    this.srcInput.fieldView.value = data.src || "";
    this.autoplayCheckbox.isOn = data.autoplay || false;
    this.loopCheckbox.isOn = data.loop || false;

    // Set audio type
    this.audioTypeDropdown.buttonView.set({
      label: data.audioType === "audio/wav" ? "WAV" : "MP3",
    });

    // Set controls
    this.controlsDropdown.buttonView.set({
      label: data.controls === "active" ? "Active" : "Hidden",
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
