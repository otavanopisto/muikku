import * as React from "react";
import { useSelector } from "react-redux";
import { StateType } from "~/reducers";
import { useTranslation } from "react-i18next";
import { LanguageData } from "~/@types/shared";
import { LanguageLevels } from "~/reducers/main-function/language-profile";
import { availableLanguages } from "~/mock/mock-data";

export type LanguageCode = (typeof availableLanguages)[number]["code"];

interface LanguageProfileDataDisplayerProps {
  labels?: string[];
  title?: string;
  rows: LanguageData[];
  cellAction?: (
    languageCode: LanguageCode,
    cellId: string,
    index: number
  ) => React.ReactNode;
  onItemClick?: (language: LanguageData) => void;
}

const DisplayLanguages = (props: LanguageProfileDataDisplayerProps) => {
  //   const { t } = useTranslation("languageProfile");
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
          {rows.map((item) => (
            <tr
              key={item.code}
              onClick={() => onItemClick?.(item)}
              className="language-profile__language"
            >
              <td className="language-profile__language-label" key={item.code}>
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
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DisplayLanguages;
