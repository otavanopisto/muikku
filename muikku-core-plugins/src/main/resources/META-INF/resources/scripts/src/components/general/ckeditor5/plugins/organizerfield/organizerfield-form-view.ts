/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  View,
  LabeledFieldView,
  createLabeledInputText,
  ButtonView,
  submitHandler,
  InputTextView,
} from "ckeditor5";
import { icons } from "ckeditor5";
import { Locale } from "ckeditor5";
import { OrganizerCategory, OrganizerFormData, OrganizerTerm } from "../types";

/**
 * @module muikku-organizerfield
 */
export default class OrganizerFieldFormView extends View {
  // Declare form elements
  public termTitleInput: LabeledFieldView<InputTextView>;
  public addGroupButton: ButtonView;
  public groupsContainer: HTMLDivElement;
  public saveButton: ButtonView;
  public cancelButton: ButtonView;
  private _groups: OrganizerCategory[] = [];
  readonly locale: Locale;

  /**
   * Constructor
   * @param locale - The locale object
   */
  constructor(locale: Locale) {
    super(locale);

    this.locale = locale;

    // Create form elements
    this.termTitleInput = this._createInput("Termien otsikko");
    this.addGroupButton = this._createAddGroupButton();
    this.groupsContainer = this._createGroupsContainer();

    // Create form template
    this.setTemplate({
      tag: "form",
      attributes: {
        class: ["ck", "ck-organizer-field-form"],
        tabindex: "-1",
      },
      children: [
        // Title section
        {
          tag: "div",
          attributes: {
            class: ["ck", "ck-form__row"],
          },
          children: [this.termTitleInput],
        },
        // Groups section
        {
          tag: "div",
          attributes: {
            class: ["ck", "ck-form__row"],
          },
          children: [
            {
              tag: "label",
              attributes: {
                class: ["ck", "ck-label"],
              },
              children: ["Ryhmät"],
            },
            this.groupsContainer,
            this.addGroupButton,
          ],
        },
      ],
    });

    // Initialize event handling
    this._initializeActions();
  }

  /**
   * Create input fields
   * @param label - The label for the input field
   */
  private _createInput(label: string) {
    // Create term title input
    this.termTitleInput = new LabeledFieldView(
      this.locale,
      createLabeledInputText
    );
    this.termTitleInput.placeholder = "Enter term title...";

    return this.termTitleInput;
  }

  /**
   * Create add group button
   * @returns ButtonView instance
   */
  private _createAddGroupButton(): ButtonView {
    const button = new ButtonView(this.locale);
    button.set({
      label: "Lisää ryhmä",
      icon: icons.plus,
      tooltip: true,
      class: "ck-button-add-group",
    });

    button.on("execute", () => {
      this._addNewGroup(this._createEmptyCategoryData());
    });

    return button;
  }

  /**
   * Create the category management section
   * @private
   */
  private _createGroupsContainer(): HTMLDivElement {
    const container = document.createElement("div");
    container.classList.add("ck-organizer-groups-container");
    return container;
  }

  /**
   * Create the form template
   * @private
   */
  private _createFormTemplate() {
    this.setTemplate({
      tag: "form",
      attributes: {
        class: ["ck", "ck-organizer-field-form"],
        tabindex: "-1",
      },
      children: [
        this.termTitleInput,
        {
          tag: "div",
          attributes: {
            class: ["ck", "ck-organizer-field-categories-section"],
          },
          children: [
            {
              tag: "h3",
              attributes: {
                class: ["ck", "ck-organizer-field-categories-header"],
              },
              children: [this.locale.t("Categories")],
            },
            this.groupsContainer,
            this.addGroupButton,
          ],
        },
        {
          tag: "div",
          attributes: {
            class: ["ck", "ck-organizer-field-actions"],
          },
          children: [this.saveButton, this.cancelButton],
        },
      ],
    });
  }

  /**
   * Add a new category
   * @param categoryData - The category data
   * @private
   */
  public addCategory(
    categoryData: OrganizerCategory = this._createEmptyCategoryData()
  ): void {
    const categoryElement = this._createCategoryElement(categoryData);
    this.groupsContainer.appendChild(categoryElement);
    this._groups.push(categoryData);
  }

  /**
   * Create an empty category data
   * @returns The empty category data
   * @private
   */
  private _createEmptyCategoryData(): OrganizerCategory {
    return {
      id: this._generateUniqueId(),
      name: "",
      terms: [],
    };
  }

  /**
   * Create an empty term data
   * @returns The empty term data
   * @private
   */
  private _createEmptyTermData(): OrganizerTerm {
    return {
      id: this._generateUniqueId(),
      text: "",
    };
  }

  /**
   * Create a category element
   * @param categoryData - The category data
   * @private
   */
  private _createCategoryElement(categoryData: OrganizerCategory): HTMLElement {
    const categoryDiv = document.createElement("div");
    categoryDiv.classList.add("ck-organizer-group");
    categoryDiv.dataset.categoryId = categoryData.id;

    const nameInput = this._createCategoryNameInput(categoryData);
    const termsContainer = this._createTermsContainer(categoryData);
    const termInput = this._createTermInput(termsContainer, categoryData);
    const deleteButton = this._createDeleteCategoryButton(
      categoryDiv,
      categoryData
    );

    categoryDiv.append(nameInput, deleteButton, termsContainer, termInput);

    return categoryDiv;
  }

  /**
   * Create a category name input
   * @param categoryData - The category data
   * @private
   */
  private _createCategoryNameInput(
    categoryData: OrganizerCategory
  ): HTMLInputElement {
    const nameInput = document.createElement("input");
    nameInput.type = "text";
    nameInput.value = categoryData.name;
    nameInput.placeholder = "Ryhmän otsikko...";
    nameInput.classList.add("ck-input", "ck-group-title");

    nameInput.addEventListener("change", () => {
      categoryData.name = nameInput.value;
    });

    return nameInput;
  }

  /**
   * Create a terms container
   * @param categoryData - The category data
   * @private
   */
  private _createTermsContainer(categoryData: OrganizerCategory): HTMLElement {
    const termsContainer = document.createElement("div");
    termsContainer.classList.add("ck-group-terms");

    categoryData.terms.forEach((term) => {
      this._addTermToCategory(termsContainer, term, categoryData);
    });

    return termsContainer;
  }

  /**
   * Create a term input
   * @param termsContainer - The terms container element
   * @param categoryData - The category data
   * @private
   */
  private _createTermInput(
    termsContainer: HTMLElement,
    categoryData: OrganizerCategory
  ): HTMLInputElement {
    const termInput = document.createElement("input");
    termInput.type = "text";
    termInput.placeholder = "Add term...";
    termInput.classList.add("ck-input", "term-input");

    termInput.addEventListener("keypress", (e: KeyboardEvent) => {
      if (e.key === "Enter") {
        e.preventDefault();
        const termText = termInput.value.trim();
        if (termText) {
          const newTerm: OrganizerTerm = {
            id: this._generateUniqueId(),
            text: termText,
          };
          this._addTermToCategory(termsContainer, newTerm, categoryData);
          termInput.value = "";
        }
      }
    });

    return termInput;
  }

  /**
   * Add a term to a category
   * @param container - The container element
   * @param term - The term
   * @param categoryData - The category data
   * @private
   */
  private _addTermToCategory(
    container: HTMLElement,
    term: OrganizerTerm,
    categoryData: OrganizerCategory
  ): void {
    const termSpan = document.createElement("span");
    termSpan.classList.add("category-term");
    termSpan.dataset.termId = term.id;
    termSpan.textContent = term.text;

    const deleteButton = this._createDeleteTermButton(
      termSpan,
      term,
      categoryData
    );
    termSpan.appendChild(deleteButton);
    container.appendChild(termSpan);

    if (!categoryData.terms.some((t) => t.id === term.id)) {
      categoryData.terms.push(term);
    }
  }

  /**
   * Create a delete term button
   * @param termElement - The term element
   * @param term - The term
   * @param categoryData - The category data
   * @returns The delete term button
   * @private
   */
  private _createDeleteTermButton(
    termElement: HTMLElement,
    term: OrganizerTerm,
    categoryData: OrganizerCategory
  ): HTMLButtonElement {
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("term-delete");
    deleteButton.innerHTML = "×";

    deleteButton.addEventListener("click", () => {
      termElement.remove();
      categoryData.terms = categoryData.terms.filter((t) => t.id !== term.id);
    });

    return deleteButton;
  }

  /**
   * Create a delete category button
   * @param categoryElement - The category element
   * @param categoryData - The category data
   * @returns The delete category button
   * @private
   */
  private _createDeleteCategoryButton(
    categoryElement: HTMLElement,
    categoryData: OrganizerCategory
  ): HTMLButtonElement {
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("ck-button", "ck-delete-group");
    deleteButton.innerHTML = "×";

    deleteButton.addEventListener("click", () => {
      categoryElement.remove();
      this._groups = this._groups.filter((c) => c.id !== categoryData.id);
    });

    return deleteButton;
  }

  /**
   * Get form data
   * @returns The form data
   */
  public getData(): OrganizerFormData {
    const categories = Array.from(this.groupsContainer.children).map(
      (categoryEl) => {
        const titleInput = categoryEl.querySelector(
          ".ck-group-title"
        ) as HTMLInputElement;
        const termInputs = categoryEl.querySelectorAll(
          ".ck-term-input"
        ) as NodeListOf<HTMLInputElement>;

        return {
          id: "",
          name: titleInput.value,
          // eslint-disable-next-line arrow-body-style
          terms: Array.from(termInputs).map((input) => {
            return {
              id: "",
              text: input.value,
            };
          }),
        };
      }
    );

    return {
      termTitle: this.termTitleInput.fieldView.element.value,
      categories,
      terms: [],
    };
  }

  /**
   * Set form data
   * @param data - The form data
   */
  public setData(data: OrganizerFormData): void {
    this.termTitleInput.fieldView.element.value = data.termTitle || "";
    this.groupsContainer.innerHTML = "";

    (data.categories || []).forEach((category) => {
      this._addNewGroup(category);
    });
  }

  /**
   * Resets the form
   */
  reset(): void {
    this.setData({
      termTitle: "",
      categories: [],
      terms: [],
    });
  }

  /**
   * Focus the first input when form opens
   */
  public focus(): void {
    this.termTitleInput.focus();
  }

  /**
   * Generate a unique ID
   * @returns The unique ID
   * @private
   */
  private _generateUniqueId(): string {
    return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Add a new group
   * @param categoryData - The category data
   * @private
   */
  private _addNewGroup(categoryData: OrganizerCategory): void {
    const groupElement = document.createElement("div");
    groupElement.classList.add("ck-organizer-group");

    // Group title input
    const titleInput = document.createElement("input");
    titleInput.type = "text";
    titleInput.classList.add("ck-input", "ck-group-title");
    titleInput.placeholder = "Ryhmän otsikko...";
    titleInput.value = categoryData.name;

    // Terms container
    const termsContainer = document.createElement("div");
    termsContainer.classList.add("ck-group-terms");

    // Add term button
    const addTermButton = document.createElement("button");
    addTermButton.classList.add("ck-button", "ck-add-term");
    addTermButton.innerHTML = "+";
    // eslint-disable-next-line jsdoc/require-jsdoc
    addTermButton.onclick = () => this._addNewTerm(termsContainer);

    // Delete group button
    const deleteButton = document.createElement("button");
    deleteButton.classList.add("ck-button", "ck-delete-group");
    deleteButton.innerHTML = "×";
    // eslint-disable-next-line jsdoc/require-jsdoc
    deleteButton.onclick = () => groupElement.remove();

    groupElement.append(
      titleInput,
      deleteButton,
      termsContainer,
      addTermButton
    );
    this.groupsContainer.appendChild(groupElement);
  }

  /**
   * Add a new term
   * @param container - The container element
   * @param termText - The term text
   * @private
   */
  private _addNewTerm(container: HTMLElement, termText = ""): void {
    const termElement = document.createElement("div");
    termElement.classList.add("ck-term");

    const termInput = document.createElement("input");
    termInput.type = "text";
    termInput.classList.add("ck-input", "ck-term-input");
    termInput.placeholder = "Termi...";
    termInput.value = termText;

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("ck-button", "ck-delete-term");
    deleteButton.innerHTML = "×";
    // eslint-disable-next-line jsdoc/require-jsdoc
    deleteButton.onclick = () => termElement.remove();

    termElement.append(termInput, deleteButton);
    container.appendChild(termElement);
  }

  /**
   * Initialize event handlers
   * @private
   */
  private _initializeActions(): void {
    submitHandler({ view: this });
  }
}
