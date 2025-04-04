/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  View,
  LabeledFieldView,
  createLabeledInputText,
  submitHandler,
  InputTextView,
  ButtonView,
  icons,
  ViewCollection,
  KeystrokeHandler,
  uid,
} from "ckeditor5";
import { Locale } from "ckeditor5";
import {
  OrganizerFormData,
  OrganizerForTermmData,
  OrganizerFormCategoryData,
  OrganizerTerm,
  OrganizerCategory,
  OrganizerCategoryTerm,
} from "../types";

/**
 * Organizer field form view
 * @module muikku-organizerfield
 */
export default class OrganizerFieldFormView extends View {
  /**
   * The title input field
   */
  public titleInput: LabeledFieldView<InputTextView>;

  /**
   * Button to add new categories
   */
  public addCategoryButton: ButtonView;

  /**
   * The container view for categories
   */
  public categoriesView: View;

  /**
   * Collection of category views
   */
  private readonly _categoriesViewCollection: ViewCollection;

  private readonly _categories: Map<string, OrganizerFormCategoryData> =
    new Map();
  private readonly _terms: Map<string, OrganizerForTermmData> = new Map();

  /**
   * Constructor
   * @param locale - The locale
   */
  constructor(locale: Locale) {
    super(locale);

    this._categoriesViewCollection = new ViewCollection();
    this.categoriesView = this._createCategoriesContainer();

    // Create form elements
    this.titleInput = this._createInput("Termien otsikko");
    this.addCategoryButton = this._createAddCategoryButton();

    // Set up the form template
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
          children: [this.titleInput],
        },
        // Categories section
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
          ],
        },
        {
          tag: "div",
          attributes: {
            class: ["ck", "ck-form__row"],
          },
          children: [this.categoriesView],
        },
        {
          tag: "div",
          attributes: {
            class: ["ck", "ck-form__row"],
          },
          children: [this.addCategoryButton],
        },
      ],
    });
  }

  /**
   * Creates a labeled input field
   * @param label - The label text
   * @returns The labeled input field
   * @private
   */
  private _createInput(label: string): LabeledFieldView<InputTextView> {
    const labeledInput = new LabeledFieldView(
      this.locale,
      createLabeledInputText
    );
    labeledInput.label = label;
    return labeledInput;
  }

  /**
   * Creates the add category button
   * @returns The button view
   * @private
   */
  private _createAddCategoryButton(): ButtonView {
    const button = new ButtonView(this.locale);

    button.set({
      label: "Lisää ryhmä",
      icon: icons.plus,
      tooltip: true,
      withText: true,
    });

    button.on("execute", () => {
      this._addNewCategory();
    });

    return button;
  }

  /**
   * Creates the categories container using CKEditor's view system
   * @returns The container view
   * @private
   */
  private _createCategoriesContainer(): View {
    const containerView = new View(this.locale);

    containerView.setTemplate({
      tag: "div",
      attributes: {
        class: ["ck-organizer-categories-container"],
      },
      // Bind children to the categories collection
      children: this._categoriesViewCollection,
    });

    return containerView;
  }

  /**
   * Updates _addNewCategory to use the view collection
   * @private
   */
  private _addNewCategory(): void {
    const categoryView = new View(this.locale);
    const categoryId = `c-${uid()}`;

    // Create name input
    const nameInput = new LabeledFieldView(this.locale, createLabeledInputText);
    nameInput.label = "Ryhmän nimi";

    // Create delete button
    const deleteButton = new ButtonView(this.locale);
    deleteButton.set({
      label: "Poista",
      icon: icons.cancel,
      class: "ck-organizer-category-delete",
    });

    // Create terms container view with its own ViewCollection
    const termsViewCollection = new ViewCollection();
    const termsContainerView = new View(this.locale);
    termsContainerView.setTemplate({
      tag: "div",
      attributes: {
        class: ["ck-organizer-category-terms"],
      },
      children: termsViewCollection,
    });

    // Create term input
    const termInput = new InputTextView(this.locale);
    termInput.set({
      placeholder: "Uusi termi",
    });
    termInput.render(); // Render the input view first
    const keystrokes = new KeystrokeHandler();

    // Set up keystroke handler after rendering
    keystrokes.listenTo(termInput.element);
    keystrokes.set("Enter", (evt, cancel) => {
      evt.preventDefault();
      const termText = termInput.element.value.trim();
      if (termText) {
        this._addNewTerm(termsViewCollection, termText, categoryId);
        termInput.element.value = ""; // Clear the input
      }
    });

    // Set up category view template
    categoryView.setTemplate({
      tag: "div",
      attributes: {
        class: ["ck-organizer-category"],
        style: "margin-bottom: 10px;",
        "data-category-id": categoryId,
      },
      children: [
        // Header section
        {
          tag: "div",
          attributes: {
            class: ["ck-organizer-category-header"],
            style: "display: flex;",
          },
          children: [nameInput, deleteButton],
        },
        // Term input
        termInput,
        // Terms container
        termsContainerView,
      ],
    });

    // Set up event handling
    deleteButton.on("execute", () => {
      // Clean up all term views before destroying category
      // Remove all terms for this category
      for (const [termId, termData] of this._terms.entries()) {
        if (termData.categoryId === categoryId) {
          this._terms.delete(termId);
        }
      }

      // Remove category
      this._categories.delete(categoryId);

      termsViewCollection.map((view) => view.destroy());
      termsViewCollection.clear();
      this._categoriesViewCollection.remove(categoryView);
      categoryView.destroy();
    });

    // Add to collection
    this._categoriesViewCollection.add(categoryView);

    // Add to categories map
    this._categories.set(categoryId, {
      id: categoryId,
      view: categoryView,
      nameInput: nameInput,
      termsCollection: termsViewCollection,
    });
  }

  /**
   * Creates and adds a new term view to the terms collection
   * @param termsCollection - The ViewCollection for terms
   * @param termText - The text for the new term
   * @param categoryId - The id of the category
   * @private
   */
  private _addNewTerm(
    termsCollection: ViewCollection,
    termText: string,
    categoryId: string
  ): void {
    const termView = new View(this.locale);
    const termId = `t-${uid()}`;

    // Store term data in the terms map
    this._terms.set(termId, {
      id: termId,
      text: termText,
      categoryId: categoryId,
    });

    // Create delete button for term
    const deleteButton = new ButtonView(this.locale);
    deleteButton.set({
      label: "Poista",
      icon: icons.cancel,
      class: "ck-organizer-term-delete",
    });

    // Set up term view template
    termView.setTemplate({
      tag: "div",
      attributes: {
        class: ["ck-organizer-term"],
        style: "display: flex; align-items: center; margin: 5px 0;",
        "data-term-id": termId,
      },
      children: [
        {
          tag: "span",
          attributes: {
            class: ["ck-organizer-term-text"],
            style: "flex: 1; padding: 4px;",
          },
          children: [termText],
        },
        deleteButton,
      ],
    });

    // Handle term deletion
    deleteButton.on("execute", () => {
      this._terms.delete(termId);
      termsCollection.remove(termView);
      termView.destroy();
    });

    // Add to collection
    termsCollection.add(termView);
  }

  /**
   * Focuses the title input
   */
  focus(): void {
    this.titleInput.focus();
  }

  /**
   * Resets the form
   */
  reset(): void {
    this.titleInput.fieldView.element.value = "";
  }

  /**
   * Gets the form data
   * @returns The form data
   */
  getData(): OrganizerFormData {
    const categories: OrganizerCategory[] = [];
    const categoryTerms: OrganizerCategoryTerm[] = [];
    const terms: OrganizerTerm[] = [];

    // Build categories and categoryTerms lists
    for (const [categoryId, categoryData] of this._categories) {
      // Add category
      categories.push({
        id: categoryId,
        name: categoryData.nameInput.fieldView.element.value,
      });

      // Add category terms mapping
      const categoryTermIds = Array.from(this._terms.values())
        .filter((term) => term.categoryId === categoryId)
        .map((term) => term.id);

      categoryTerms.push({
        category: categoryId,
        terms: categoryTermIds,
      });
    }

    // Build terms list
    for (const [termId, termData] of this._terms) {
      terms.push({
        id: termId,
        name: termData.text,
      });
    }

    // Return the form data
    return {
      termTitle: this.titleInput.fieldView.element.value,
      categories: categories,
      categoryTerms: categoryTerms,
      terms: terms,
    };
  }

  /**
   * Sets the form field values
   * @param data - OrganizerFormData object containing values to set
   */
  setData(data: OrganizerFormData): void {
    this.titleInput.fieldView.value = data.termTitle || "";

    // Clear existing data
    this._terms.clear();
    this._categories.clear();
    this._categoriesViewCollection.clear();

    // If no categories data, return early
    if (data.categories.length === 0) {
      return;
    }

    // Create categories and their terms
    data.categories.forEach((category) => {
      // Create new category
      const categoryView = new View(this.locale);
      const categoryId = category.id || `c-${uid()}`;

      // Create name input
      const nameInput = new LabeledFieldView(
        this.locale,
        createLabeledInputText
      );
      nameInput.label = "Ryhmän nimi";
      nameInput.fieldView.value = category.name;

      // Create delete button
      const deleteButton = new ButtonView(this.locale);
      deleteButton.set({
        label: "Poista",
        icon: icons.cancel,
        class: "ck-organizer-category-delete",
      });

      // Create terms container
      const termsViewCollection = new ViewCollection();
      const termsContainerView = new View(this.locale);
      termsContainerView.setTemplate({
        tag: "div",
        attributes: {
          class: ["ck-organizer-category-terms"],
        },
        children: termsViewCollection,
      });

      // Create term input
      const termInput = new InputTextView(this.locale);
      termInput.set({
        placeholder: "Uusi termi",
      });
      termInput.render();

      // Set up keystroke handler
      const keystrokes = new KeystrokeHandler();
      keystrokes.listenTo(termInput.element);
      keystrokes.set("Enter", (evt, cancel) => {
        evt.preventDefault();
        const termText = termInput.element.value.trim();
        if (termText) {
          this._addNewTerm(termsViewCollection, termText, categoryId);
          termInput.element.value = "";
        }
      });

      // Set up category view template
      categoryView.setTemplate({
        tag: "div",
        attributes: {
          class: ["ck-organizer-category"],
          style: "margin-bottom: 10px;",
          "data-category-id": categoryId,
        },
        children: [
          {
            tag: "div",
            attributes: {
              class: ["ck-organizer-category-header"],
              style: "display: flex;",
            },
            children: [nameInput, deleteButton],
          },
          termInput,
          termsContainerView,
        ],
      });

      // Set up delete handler
      deleteButton.on("execute", () => {
        // Remove all terms for this category
        for (const [termId, termData] of this._terms.entries()) {
          if (termData.categoryId === categoryId) {
            this._terms.delete(termId);
          }
        }

        // Remove category
        this._categories.delete(categoryId);
        termsViewCollection.map((view) => view.destroy());
        termsViewCollection.clear();
        this._categoriesViewCollection.remove(categoryView);
        categoryView.destroy();
      });

      // Add to collections
      this._categoriesViewCollection.add(categoryView);
      this._categories.set(categoryId, {
        id: categoryId,
        view: categoryView,
        nameInput: nameInput,
        termsCollection: termsViewCollection,
      });

      // Add terms for this category
      const categoryTerms = data.categoryTerms?.find(
        (ct) => ct.category === categoryId
      );
      if (categoryTerms?.terms?.length) {
        const termsData = categoryTerms.terms
          .map((termId) => data.terms?.find((t) => t.id === termId))
          .filter((term) => term); // Filter out undefined terms

        termsData.forEach((term) => {
          if (term) {
            this._addNewTerm(termsViewCollection, term.name, categoryId);
          }
        });
      }
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

  /**
   * @inheritDoc
   */
  destroy(): void {
    this._categoriesViewCollection.map((view) => view.destroy());
    this._categoriesViewCollection.clear();
    super.destroy();
  }
}
