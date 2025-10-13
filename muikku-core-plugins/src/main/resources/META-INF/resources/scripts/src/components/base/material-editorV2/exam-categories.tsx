import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import { ExamSettingsCategory, ExamSettingsRandom } from "~/generated/client";
import { StateType } from "~/reducers";
import Button from "~/components/general/button";
import Dropdown from "~/components/general/dropdown";

/**
 * ExamCategoriesProps
 */
interface ExamCategoriesProps {
  examRandom: ExamSettingsRandom;
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
  const { t } = useTranslation();
  const { categories, onUpdate, disabled = false, examRandom } = props;

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
   * @returns Available pages
   */
  const getAvailablePages = () => {
    // Get all page IDs that are already assigned to any category
    const allSelectedIds = categories.reduce<number[]>(
      (acc, cat) => [...acc, ...cat.workspaceMaterialIds],
      []
    );

    return currentExamSectionPages.filter(
      (page) => !allSelectedIds.includes(page.workspaceMaterialId)
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

  /**
   * Handle key press in category name input
   * @param e - Event
   */
  const handleCategoryNameKeyPress = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addCategory();
    }
  };

  return (
    <div className="material-editor__exam-categories">
      {/* Add new category */}
      <div className="form__row">
        <div className="form-element form-element--add-exam-category">
          <label className="visually-hidden">
            {t("labels.addCategory", {
              ns: "exams",
            })}
          </label>
          <input
            className="form-element__input form-element__input--add-exam-category"
            value={newCategoryName}
            onChange={(e) => {
              setNewCategoryName(e.target.value);
            }}
            onKeyPress={handleCategoryNameKeyPress}
            placeholder={t("labels.addCategory", {
              ns: "exams",
            })}
            disabled={disabled}
          />
          <div
            className="form-element__input-decoration form-element__input-decoration--add-exam-category icon-plus"
            onClick={addCategory}
            // disabled={disabled || !newCategoryName.trim()}
          ></div>
        </div>
      </div>

      {/* Existing categories */}
      {categories.map((category, index) => (
        <div key={index} className="material-editor__category-item">
          <div className="material-editor__category-header">
            {t("labels.category", {
              ns: "common",
            })}{" "}
            {index + 1}
            <Dropdown
              openByHover
              key="frontpage"
              content={t("actions.remove", {
                ns: "common",
              })}
            >
              <Button
                icon="trash"
                buttonModifiers={"remove-extra-row"}
                onClick={() => removeCategory(index)}
                disabled={disabled}
              ></Button>
            </Dropdown>
          </div>

          <div className="material-editor__category-fields">
            {/* Category name */}
            <div className="form__row form__row--split">
              <div className="form__subdivision">
                <div className="form__row">
                  <div className="form-element">
                    <label htmlFor="exam-category-name">
                      {t("labels.name", {
                        ns: "common",
                      })}
                    </label>
                    <input
                      id="exam-category-name"
                      className="form-element__input form-element__input--material-editor"
                      value={category.name}
                      onChange={(e) =>
                        updateCategory(index, "name", e.target.value)
                      }
                      disabled={disabled}
                    />
                  </div>
                </div>
              </div>

              {/* Random count. Show only if exam random setting value is category */}
              {examRandom === ExamSettingsRandom.Category && (
                <div className="form__subdivision">
                  <div className="form__row">
                    <div className="form-element">
                      <label htmlFor="exam-random-assignments-count">
                        {t("labels.randomizedQuestionCount", {
                          ns: "exams",
                        })}
                      </label>
                      <input
                        id="exam-random-assignments-count"
                        className="form-element__input form-element__input--material-editor"
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
                      <div className="form-element__description">
                        {t("labels.maxQuestionCount", {
                          ns: "exams",
                          count: category.workspaceMaterialIds.length,
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Selected pages (assignments) */}
            {currentExamSectionPages.length > 0 && (
              <div className="form__row">
                <div className="form-element">
                  <label>
                    {t("labels.selectedPages", {
                      ns: "exams",
                    })}
                  </label>

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
                          <Button
                            icon="cross"
                            iconPosition="right"
                            className="button button--delete-chip button--danger"
                            onClick={() =>
                              removePageFromCategory(index, pageId)
                            }
                            disabled={disabled}
                            title="Poista sivu kategoriasta"
                          ></Button>
                        </div>
                      ))
                    ) : (
                      <div className="form-element__description">
                        {t("content.noSelectedPages", {
                          ns: "exams",
                        })}
                      </div>
                    )}
                  </div>

                  {/* Add new page dropdown */}
                  <div className="material-editor__add-page">
                    <select
                      className="form-element__select form-element__select--material-editor"
                      onChange={(e) => {
                        const pageId = parseInt(e.target.value);
                        if (pageId && !isNaN(pageId)) {
                          addPageToCategory(index, pageId);
                          e.target.value = ""; // Reset selection
                        }
                      }}
                      disabled={disabled || getAvailablePages().length === 0}
                    >
                      <option value="">
                        {t("labels.addPageToCategory", {
                          ns: "exams",
                        })}
                      </option>
                      {getAvailablePages().map((page) => (
                        <option
                          key={page.workspaceMaterialId}
                          value={page.workspaceMaterialId}
                        >
                          {page.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  {getAvailablePages().length === 0 && (
                    <div className="form-element__description">
                      {t("content.allPagesAdded", {
                        ns: "exams",
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {categories.length === 0 && (
        <div className="empty">
          <span>
            {t("content.empty", {
              ns: "exams",
              context: "categories",
            })}
          </span>
        </div>
      )}
    </div>
  );
};
