import * as React from "react";
import { NotesLocation, NotesItemFilters } from "~/@types/notes";
import { IconButton } from "~/components/general/button";
import Dropdown from "~/components/general/dropdown";
import NotesItemPriorityChip from "./notes-item-list-filtters-chip";
import { i18nType } from "~/reducers/base/i18n";

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
          content={
            <div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  margin: "5px 0px",
                }}
              >
                <label style={{ marginRight: "5px" }}>Omat</label>
                <input
                  type="checkbox"
                  onChange={handleCheckboxesChange("own")}
                  checked={filters.own}
                />
              </div>

              {usePlace === "records" && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    margin: "5px 0px",
                  }}
                >
                  <label style={{ marginRight: "5px" }}>Ohjaajien</label>
                  <input
                    type="checkbox"
                    onChange={handleCheckboxesChange("guider")}
                    checked={filters.guider}
                  />
                </div>
              )}
            </div>
          }
        >
          <div tabIndex={0}>
            <IconButton icon="filter" />
          </div>
        </Dropdown>
      </div>
    </>
  );
};
export default NotesItemListFiltters;
