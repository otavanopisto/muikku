import * as React from "react";
import { NotesLocation, NotesItemFilters } from "~/@types/notes";
import { IconButton } from "~/components/general/button";
import Dropdown from "~/components/general/dropdown";
import NotesItemFilterChip from "./notes-item-list-filters-chip";
import { useTranslation } from "react-i18next";
import "~/sass/elements/filter.scss";

/**
 * NotesItemListProps
 */
interface NotesItemListFilttersProps {
  usePlace: NotesLocation;
  filters: NotesItemFilters;
  onFilttersChange: (updatedFilters: NotesItemFilters) => void;
}

/**
 * Creater NotesItem list component
 * @param props props
 * @returns JSX.Element
 */
const NotesItemListFilters: React.FC<NotesItemListFilttersProps> = (props) => {
  const { filters, onFilttersChange, usePlace } = props;
  const { t } = useTranslation("tasks");
  /**
   * Handles filter chip click
   * @param name name
   */
  const handleFilterChipClick = (name: keyof NotesItemFilters) => {
    const updatedFilters: NotesItemFilters = {
      ...filters,
      [name]: !filters[name],
    };

    if (onFilttersChange) {
      onFilttersChange(updatedFilters);
    }
  };

  /**
   * Handles checkbox change
   * @param name name
   */
  const handleCheckboxesChange =
    (name: keyof NotesItemFilters) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const updatedFilters: NotesItemFilters = {
        ...filters,
        [name]: !filters[name],
      };

      if (onFilttersChange) {
        onFilttersChange(updatedFilters);
      }
    };

  return (
    <>
      <div className="notes__toolbar-section">
        <NotesItemFilterChip
          label={t("labels.priority", { context: "high" })}
          modifier="note-priority-high"
          activeModifier={filters.high ? "active" : null}
          name="high"
          onChipClick={handleFilterChipClick}
        />
        <NotesItemFilterChip
          label={t("labels.priority", { context: "normal" })}
          modifier="note-priority-normal"
          activeModifier={filters.normal ? "active" : null}
          name="normal"
          onChipClick={handleFilterChipClick}
        />
        <NotesItemFilterChip
          label={t("labels.priority", { context: "low" })}
          modifier="note-priority-low"
          activeModifier={filters.low ? "active" : null}
          name="low"
          onChipClick={handleFilterChipClick}
        />
      </div>
      <div className="notes__toolbar-section">
        {usePlace === "records" ? (
          <Dropdown
            items={[
              <div key="filterTitle" className="filter-category">
                <div className="filter-category__label">
                  {t("labels.filter")}
                </div>
              </div>,

              <div key="filterMyOwn" className="filter-item">
                <input
                  type="checkbox"
                  id="notesFilterMyOwn"
                  onChange={handleCheckboxesChange("own")}
                  checked={filters.own}
                />
                <label
                  htmlFor="notesFilterMyOwn"
                  className="filter-item__label"
                >
                  {t("labels.own")}
                </label>
              </div>,

              <div key="filterFromGuider" className="filter-item">
                <input
                  type="checkbox"
                  id="notesFilterFromGuider"
                  onChange={handleCheckboxesChange("guider")}
                  checked={filters.guider}
                />
                <label
                  htmlFor="notesFilterFromGuider"
                  className="filter-item__label"
                >
                  {t("labels.createdByCounselors")}
                </label>
              </div>,
            ]}
          >
            <div tabIndex={0}>
              <IconButton icon="more_vert" />
            </div>
          </Dropdown>
        ) : null}
      </div>
    </>
  );
};
export default NotesItemListFilters;
