import * as React from "react";
import {
  JournalCenterUsePlaceType,
  JournalFiltters,
} from "~/@types/journal-center";
import { IconButton } from "~/components/general/button";
import Dropdown from "~/components/general/dropdown";
import JournalPriorityChip from "./journal-list-filtters-chip";

/**
 * JournalListProps
 */
interface JournalListFilttersProps {
  usePlace: JournalCenterUsePlaceType;
  filtters: JournalFiltters;
  onFilttersChange: (updatedFilters: JournalFiltters) => void;
}

/**
 * Creater Journal list component
 * @param props props
 * @returns JSX.Element
 */
const JournalListFiltters: React.FC<JournalListFilttersProps> = (props) => {
  const { filtters, onFilttersChange, usePlace } = props;

  /**
   * handleFiltterChipClick
   * @param name name
   */
  const handleFiltterChipClick = (name: keyof JournalFiltters) => {
    const updatedFilters: JournalFiltters = {
      ...filtters,
      [name]: !filtters[name],
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
    (name: keyof JournalFiltters) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const updatedFilters: JournalFiltters = {
        ...filtters,
        [name]: !filtters[name],
      };

      if (onFilttersChange) {
        onFilttersChange(updatedFilters);
      }
    };

  return (
    <div
      style={{
        height: "50px",
        width: "100%",
        display: "flex",
        alignItems: "center",
      }}
    >
      <div style={{ display: "flex", flexGrow: 1 }}>
        <JournalPriorityChip
          label="Tärkeä"
          colour={filtters.high ? "red" : "#ff00009e"}
          name="high"
          onChipClick={handleFiltterChipClick}
        />
        <JournalPriorityChip
          label="Melko tärkeä"
          colour={filtters.normal ? "orange" : "#ffa5009c"}
          name="normal"
          onChipClick={handleFiltterChipClick}
        />
        <JournalPriorityChip
          label="Ei tärkeä"
          colour={filtters.low ? "green" : "#0080008a"}
          name="low"
          onChipClick={handleFiltterChipClick}
        />
        {/* <JournalPriorityChip
          label="Omat"
          colour={filtters.own ? "teal" : "#0080809e"}
          name="own"
          onChipClick={handleFiltterChipClick}
        /> */}
      </div>
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
              <input type="checkbox" onChange={handleCheckboxesChange("own")} />
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
                />
              </div>
            )}
          </div>
        }
      >
        <div tabIndex={0}>
          <IconButton icon="cogs" />
        </div>
      </Dropdown>
    </div>
  );
};
export default JournalListFiltters;
