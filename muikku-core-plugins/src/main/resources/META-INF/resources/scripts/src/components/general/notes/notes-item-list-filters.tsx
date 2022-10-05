import * as React from "react";
import { NotesLocation, NotesItemFilters } from "~/@types/notes";
import { IconButton } from "~/components/general/button";
import Dropdown from "~/components/general/dropdown";
import NotesItemFilterChip from "./notes-item-list-filters-chip";
import { i18nType } from "~/reducers/base/i18n";

import "~/sass/elements/filter.scss";

/**
 * NotesItemListProps
 */
interface NotesItemListFilttersProps {
  usePlace: NotesLocation;
  filters: NotesItemFilters;
  i18n: i18nType;
  onFilttersChange: (updatedFilters: NotesItemFilters) => void;
}

/**
 * Creater NotesItem list component
 * @param props props
 * @returns JSX.Element
 */
const NotesItemListFilters: React.FC<NotesItemListFilttersProps> = (props) => {
  const { filters, onFilttersChange, usePlace } = props;

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
          label={props.i18n.text.get(
            "plugin.records.tasks.priority.high.label"
          )}
          modifier="note-priority-high"
          activeModifier={filters.high ? "active" : null}
          name="high"
          onChipClick={handleFilterChipClick}
        />
        <NotesItemFilterChip
          label={props.i18n.text.get(
            "plugin.records.tasks.priority.normal.label"
          )}
          modifier="note-priority-normal"
          activeModifier={filters.normal ? "active" : null}
          name="normal"
          onChipClick={handleFilterChipClick}
        />
        <NotesItemFilterChip
          label={props.i18n.text.get("plugin.records.tasks.priority.low.label")}
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
                  {props.i18n.text.get("plugin.records.tasks.filter.label")}
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
                  {props.i18n.text.get(
                    "plugin.records.tasks.filter.createdbyme"
                  )}
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
                  {props.i18n.text.get(
                    "plugin.records.tasks.filter.createdbyguidanceCounselor"
                  )}
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
