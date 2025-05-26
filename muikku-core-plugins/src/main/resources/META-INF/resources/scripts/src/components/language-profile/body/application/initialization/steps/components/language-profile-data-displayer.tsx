import { is } from "@amcharts/amcharts4/core";
import * as React from "react";
import { LanguageData } from "~/@types/shared";
import { LanguageCode } from "~/@types/shared";

/**
 * LanguageProfileDataDisplayerProps
 */
interface LanguageProfileDataDisplayerProps {
  labels?: string[];
  title?: string;
  rows: LanguageData[];
  disabledItems?: string[];

  cellAction?: (
    languageCode: LanguageCode,
    cellId: string,
    index: number
  ) => React.ReactNode;
  onItemClick?: (language: LanguageData) => void;
}

/**
 *DusplayLanguages
 * @param props props the props of the component
 * @returns JSX element that displays the languages in a table format
 */
const DisplayLanguages = (props: LanguageProfileDataDisplayerProps) => {
  const { labels, rows, title, cellAction, onItemClick } = props;
  return (
    <div className="language-profile__languages-wrapper">
      <table className="language-profile__languages">
        {labels && (
          <thead>
            <tr className="language-profile__languages-header">
              <th className="language-profile__languages-label">
                {title ? title : "Kieli"}
              </th>
              {labels.map((label) => (
                <th key={label} className="language-profile__languages-label">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {rows.map((item) => {
            const isDisabled = props.disabledItems?.includes(item.code);

            return (
              <tr
                key={item.code}
                onClick={() => onItemClick?.(item)}
                className={`language-profile__language ${isDisabled ? "DISABLED" : ""}`}
              >
                <td
                  className="language-profile__language-label"
                  key={item.code}
                >
                  {item.name}
                </td>
                {labels &&
                  labels.map((label, index) => (
                    <td
                      key={label}
                      id={item.code + index}
                      className="language-profile__language-data"
                    >
                      {cellAction &&
                        cellAction(item.code, item.code + "-" + index, index)}
                    </td>
                  ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default DisplayLanguages;
