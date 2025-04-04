import * as React from "react";
import { useSelector } from "react-redux";
import { StateType } from "~/reducers";
import { useTranslation } from "react-i18next";
import { Language } from "~/@types/shared";
import { LanguageLevels } from "~/reducers/main-function/language-profile";
import { availableLanguages } from "~/mock/mock-data";

export type LanguageCode = (typeof availableLanguages)[number]["code"];

interface DisplayLanguageProps {
  labels?: string[];
  cellAction?: (languageCode: LanguageCode, cellId: string) => React.ReactNode;
  onItemClick?: (language: Language) => void;
}

const DisplayLanguages = (props: DisplayLanguageProps) => {
  //   const { t } = useTranslation("languageProfile");
  const { labels, cellAction, onItemClick } = props;
  const { languages } = useSelector(
    (state: StateType) => state.languageProfile.data
  );

  return (
    <div className="language-profile__languages-wrapper">
      <table className="language-profile__languages">
        {labels && (
          <thead>
            <tr className="language-profile__languages-header">
              <th className="language-profile__languages-label">Kieli</th>
              {labels.map((label) => (
                <th key={label} className="language-profile__languages-label">
                  {label}
                </th>
              ))}
            </tr>
          </thead>
        )}
        <tbody>
          {languages.map((language) => (
            <tr
              key={language.code}
              onClick={() => onItemClick?.(language)}
              className="language-profile__language"
            >
              <td
                className="language-profile__language-label"
                key={language.code}
              >
                {language.name}
              </td>
              {labels &&
                labels.map((label, index) => (
                  <td
                    key={label}
                    id={language.code + index}
                    className="language-profile__language-data"
                  >
                    {cellAction &&
                      cellAction(language.code, language.code + index)}
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
