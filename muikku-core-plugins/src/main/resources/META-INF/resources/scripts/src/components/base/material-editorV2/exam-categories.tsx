import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ExamSettingsCategory } from "~/generated/client";
import { StateType } from "~/reducers";

/**
 * ExamCategoriesProps
 */
interface ExamCategoriesProps {
  categories: ExamSettingsCategory[];
  onUpdate: (categories: ExamSettingsCategory[]) => void;
  disabled?: boolean;
}

/**
 * ExamCategories
 * @param props - Props
 * @returns Exam categories
 */
export const ExamCategories: React.FC<ExamCategoriesProps> = (props) => {
  const { categories, onUpdate, disabled = false } = props;

  const currentExamSectionPages = useSelector(
    (state: StateType) =>
      state.workspaces.materialEditor.currentNodeValue.children
  );

  const [newCategoryName, setNewCategoryName] = useState("");

  /**
   * Add category
   */
  const addCategory = () => {
    if (!newCategoryName.trim()) return;

    const newCategory: ExamSettingsCategory = {
      name: newCategoryName.trim(),
      randomCount: 1,
      workspaceMaterialIds: [],
    };

    onUpdate([...categories, newCategory]);
    setNewCategoryName("");
  };

  /**
   * Update category
   * @param index - Index
   * @param field - Field
   * @param value - Value
   */
  const updateCategory = <T extends keyof ExamSettingsCategory>(
    index: number,
    field: T,
    value: ExamSettingsCategory[T]
  ) => {
    const updatedCategories = [...categories];
    updatedCategories[index] = {
      ...updatedCategories[index],
      [field]: value,
    };
    onUpdate(updatedCategories);
  };

  /**
   * Remove category
   * @param index - Index
   */
  const removeCategory = (index: number) => {
    const updatedCategories = categories.filter((_, i) => i !== index);
    onUpdate(updatedCategories);
  };

  /**
   * Get page title
   * @param pageId - Page id
   * @returns Page title
   */
  const getPageTitle = (pageId: number) => {
    const page = currentExamSectionPages.find(
      (p) => p.workspaceMaterialId === pageId
    );
    return page ? page.title : `Unknown Page (ID: ${pageId})`;
  };

  /**
   * Get available pages
   * @param categoryIndex - Category index
   * @returns Available pages
   */
  const getAvailablePages = (categoryIndex: number) => {
    const category = categories[categoryIndex];
    const selectedIds = category.workspaceMaterialIds;

    return currentExamSectionPages.filter(
      (page) => !selectedIds.includes(page.workspaceMaterialId)
    );
  };

  /**
   * Add page to category
   * @param categoryIndex - Category index
   * @param pageId - Page id
   */
  const addPageToCategory = (categoryIndex: number, pageId: number) => {
    const updatedCategories = [...categories];
    const category = updatedCategories[categoryIndex];

    if (!category.workspaceMaterialIds.includes(pageId)) {
      category.workspaceMaterialIds = [
        ...category.workspaceMaterialIds,
        pageId,
      ];
      onUpdate(updatedCategories);
    }
  };

  /**
   * Remove page from category
   * @param categoryIndex - Category index
   * @param pageId - Page id
   */
  const removePageFromCategory = (categoryIndex: number, pageId: number) => {
    const updatedCategories = [...categories];
    const category = updatedCategories[categoryIndex];

    category.workspaceMaterialIds = category.workspaceMaterialIds.filter(
      (id) => id !== pageId
    );
    onUpdate(updatedCategories);
  };

  return (
    <div className="material-editor__exam-categories">
      <h4>Kategoriat</h4>

      {/* Add new category */}
      <div className="material-editor__add-category">
        <div className="form__row">
          <div className="form-element">
            <input
              className="form-element__input"
              value={newCategoryName}
              onChange={(e) => setNewCategoryName(e.target.value)}
              placeholder="Kategorian nimi"
              disabled={disabled}
            />
          </div>
          <button
            className="button button--primary"
            onClick={addCategory}
            disabled={disabled || !newCategoryName.trim()}
          >
            Lisää kategoria
          </button>
        </div>
      </div>

      {/* Existing categories */}
      {categories.map((category, index) => (
        <div key={index} className="material-editor__category-item">
          <div className="material-editor__category-header">
            <h5>Kategoria {index + 1}</h5>
            <button
              className="button button--danger"
              onClick={() => removeCategory(index)}
              disabled={disabled}
            >
              Poista
            </button>
          </div>

          <div className="material-editor__category-fields">
            {/* Category name */}
            <div className="form__row">
              <div className="form-element">
                <label>Nimi:</label>
                <input
                  className="form-element__input"
                  value={category.name}
                  onChange={(e) =>
                    updateCategory(index, "name", e.target.value)
                  }
                  disabled={disabled}
                />
              </div>
            </div>

            {/* Random count */}
            <div className="form__row">
              <div className="form-element">
                <label>Satunnaisten tehtävien määrä:</label>
                <input
                  className="form-element__input"
                  value={category.randomCount}
                  onChange={(e) =>
                    updateCategory(
                      index,
                      "randomCount",
                      parseInt(e.target.value) || 0
                    )
                  }
                  min={0}
                  max={category.workspaceMaterialIds.length}
                  disabled={disabled}
                />
                <small>
                  Max: {category.workspaceMaterialIds.length} tehtävää
                </small>
              </div>
            </div>

            {/* Selected pages (assignments) */}
            <div className="form__row">
              <div className="form-element">
                <label>Valitut sivut:</label>

                {/* Selected pages list */}
                <div className="material-editor__selected-pages">
                  {category.workspaceMaterialIds.length > 0 ? (
                    category.workspaceMaterialIds.map((pageId) => (
                      <div
                        key={pageId}
                        className="material-editor__selected-page"
                      >
                        <span className="material-editor__page-title">
                          {getPageTitle(pageId)}
                        </span>
                        <button
                          className="button button--small button--danger"
                          onClick={() => removePageFromCategory(index, pageId)}
                          disabled={disabled}
                          title="Poista sivu kategoriasta"
                        >
                          ×
                        </button>
                      </div>
                    ))
                  ) : (
                    <p className="material-editor__no-pages">
                      Ei valittuja sivuja
                    </p>
                  )}
                </div>

                {/* Add new page dropdown */}
                <div className="material-editor__add-page">
                  <select
                    className="form-element__select"
                    onChange={(e) => {
                      const pageId = parseInt(e.target.value);
                      if (pageId && !isNaN(pageId)) {
                        addPageToCategory(index, pageId);
                        e.target.value = ""; // Reset selection
                      }
                    }}
                    disabled={disabled || getAvailablePages(index).length === 0}
                  >
                    <option value="">Lisää sivu kategoriaan...</option>
                    {getAvailablePages(index).map((page) => (
                      <option
                        key={page.workspaceMaterialId}
                        value={page.workspaceMaterialId}
                      >
                        {page.title}
                      </option>
                    ))}
                  </select>
                  {getAvailablePages(index).length === 0 && (
                    <small>Kaikki sivut on jo lisätty kategoriaan</small>
                  )}
                </div>

                <small>
                  {category.workspaceMaterialIds.length} sivu(a) valittuna
                  kategoriassa
                </small>
              </div>
            </div>
          </div>
        </div>
      ))}

      {categories.length === 0 && (
        <div className="material-editor__no-categories">
          <p>Ei kategorioita vielä. Lisää kategoria yllä.</p>
        </div>
      )}
    </div>
  );
};
