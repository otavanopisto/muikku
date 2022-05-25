import * as React from "react";
import { NotesLocation, NotesItemFilters } from "~/@types/notes";
import { IconButton } from "~/components/general/button";
import Dropdown from "~/components/general/dropdown";
import NotesItemPriorityChip from "./notes-item-list-filtters-chip";
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
const NotesItemListFiltters: React.FC<NotesItemListFilttersProps> = (props) => {
  const { filters, onFilttersChange, usePlace } = props;

  /**
   * handleFiltterChipClick
   * @param name name
   */
  const handleFiltterChipClick = (name: keyof NotesItemFilters) => {
    const updatedFilters: NotesItemFilters = {
      ...filters,
      [name]: !filters[name],
    };

    if (onFilttersChange) {
      onFilttersChange(updatedFilters);
    }
  };

  /**
   * handleFiltersChange
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
        <NotesItemPriorityChip
          label={props.i18n.text.get("plugin.records.priority.high.label")}
          modifier="note-priority-high"
          activeModifier={filters.high ? "active" : null}
          name="high"
          onChipClick={handleFiltterChipClick}
        />
        <NotesItemPriorityChip
          label={props.i18n.text.get("plugin.records.priority.normal.label")}
          modifier="note-priority-normal"
          activeModifier={filters.normal ? "active" : null}
          name="normal"
          onChipClick={handleFiltterChipClick}
        />
        <NotesItemPriorityChip
          label={props.i18n.text.get("plugin.records.priority.low.label")}
          modifier="note-priority-low"
          activeModifier={filters.low ? "active" : null}
          name="low"
          onChipClick={handleFiltterChipClick}
        />
      </div>
      <div className="notes__toolbar-section">
        <Dropdown
          items={[
            <div key="filterTitle" className="filter-category">
              <div className="filter-category__label">
                {props.i18n.text.get("plugin.records.notes.filter.label")}
              </div>
            </div>,

            <div key="filterMyOwn" className="filter-item">
              <input
                type="checkbox"
                id="notesFilterMyOwn"
                onChange={handleCheckboxesChange("own")}
                checked={filters.own}
              />
              <label htmlFor="notesFilterMyOwn" className="filter-item__label">
                {props.i18n.text.get("plugin.records.notes.filter.createdbyme")}
              </label>
            </div>,

            usePlace === "records" && (
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
                    "plugin.records.notes.filter.createdbyguidanceCounselor"
                  )}
                </label>
              </div>
            ),
          ]}
        >
          <div tabIndex={0}>
            <IconButton icon="more_vert" />
          </div>
        </Dropdown>
      </div>
    </>
  );
};
export default NotesItemListFiltters;
