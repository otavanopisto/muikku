import * as React from "react";
import Link from "../link";

/**
 * EducationOption
 */
interface RecordsEducationTypeOption {
  educationTypeCode: string; // educationTypeCode
  label: string; // e.g. "Lukio", "Peruskoulu"
}

/**
 * EducationSelectorProps
 */
interface RecordsEducationTypeSelectorProps {
  options: RecordsEducationTypeOption[];
  selectedEducationTypeCode: string | null;
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
  const { options, selectedEducationTypeCode, onSelect } = props;
  if (!options.length) return null;

  return (
    <div className="application-list__actions-container">
      {options.map((opt) => (
        <Link
          key={opt.educationTypeCode}
          className="link link--application-list"
          disabled={opt.educationTypeCode === selectedEducationTypeCode}
          onClick={() => onSelect(opt.educationTypeCode)}
        >
          {opt.label}
        </Link>
      ))}
    </div>
  );
};

export default RecordsEducationTypeSelector;
