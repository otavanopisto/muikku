import * as React from "react";
import Link from "../link";

/**
 * EducationOption
 */
interface RecordsEducationTypeOption {
  identifier: string; // identifier or educationTypeCode
  label: string; // e.g. "Lukio", "Peruskoulu"
}

/**
 * EducationSelectorProps
 */
interface RecordsEducationTypeSelectorProps {
  options: RecordsEducationTypeOption[];
  selectedIdentifier: string | null;
  onSelect: (id: string) => void;
}

/**
 * RecordsEducationTypeSelector
 * @param props props
 * @returns JSX.Element
 */
const RecordsEducationTypeSelector = (
  props: RecordsEducationTypeSelectorProps
) => {
  const { options, selectedIdentifier, onSelect } = props;
  if (!options.length) return null;

  return (
    <div className="application-list__actions-container">
      {options.map((opt) => (
        <Link
          key={opt.identifier}
          className="link link--application-list"
          disabled={opt.identifier === selectedIdentifier}
          onClick={() => onSelect(opt.identifier)}
        >
          {opt.label}
        </Link>
      ))}
    </div>
  );
};

export default RecordsEducationTypeSelector;
