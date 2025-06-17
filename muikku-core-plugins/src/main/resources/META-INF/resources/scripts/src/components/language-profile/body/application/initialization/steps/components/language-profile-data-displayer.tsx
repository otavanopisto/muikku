import * as React from "react";
import { LanguageData } from "~/@types/shared";
import {
  Table,
  TableHead,
  Tbody,
  Td,
  Th,
  Tr,
} from "~/components/general/table";
import { useTranslation } from "react-i18next";
import "~/sass/elements/table.scss";

/**
 * LanguageProfileDataDisplayerProps
 */
interface LanguageProfileDataDisplayerProps {
  labels?: string[];
  title?: string;
  rows: LanguageData[];
  disabledItems?: string[];
  singleColumn?: boolean;

  cellAction?: (
    code: string,
    cellId: string,
    rowId?: string,
    index?: number
  ) => React.ReactNode;
  onItemClick?: (language: LanguageData) => void;
}

/**
 *DusplayLanguages
 * @param props props the props of the component
 * @returns JSX element that displays the languages in a table format
 */
const DisplayLanguages = (props: LanguageProfileDataDisplayerProps) => {
  const { t } = useTranslation(["languageProfile", "common"]);
  const { labels, rows, title, singleColumn, cellAction, onItemClick } = props;
  return (
    <div className="language-profile__languages-wrapper">
      <Table modifiers={["language-profile__languages"]}>
        {labels && (
          <TableHead modifiers={["sticky"]}>
            <Tr>
              <Th modifiers={["centered", "language-profile-first-cell"]}>
                {title
                  ? title
                  : t("labels.language", {
                      ns: "common",
                    })}
              </Th>
              {labels.map((label) => (
                <Th modifiers={["centered"]} key={label}>
                  {label}
                </Th>
              ))}
            </Tr>
          </TableHead>
        )}
        <Tbody>
          {rows.map((item) => {
            const isDisabled = props.disabledItems?.includes(item.code);
            const rowId = item.code + item.name;

            const tableRowModifiers = [];

            if (isDisabled) {
              tableRowModifiers.push("disabled");
            } else if (onItemClick) {
              tableRowModifiers.push("clickable");
            }

            return (
              <Tr
                data-testid={rowId}
                key={rowId}
                onClick={() => onItemClick?.(item)}
                modifiers={tableRowModifiers}
              >
                {singleColumn ? (
                  <Td
                    modifiers={["language-profile-first-cell"]}
                    key={item.code}
                  >
                    {item.name}
                  </Td>
                ) : (
                  <Td
                    modifiers={["centered", "language-profile-first-cell"]}
                    key={item.code + "-name"}
                  >
                    {isDisabled ? (
                      <span className="language-profile__disabled-language">
                        {item.name}
                      </span>
                    ) : (
                      item.name
                    )}
                  </Td>
                )}
                {labels &&
                  labels.map((label, index) => {
                    const cellId = item.code + "-" + index;
                    return (
                      <Td
                        modifiers={["centered"]}
                        data-testid={item.name + "-" + cellId}
                        key={item.name + "-" + cellId}
                      >
                        {cellAction &&
                          cellAction(item.code, cellId, rowId, index)}
                      </Td>
                    );
                  })}
              </Tr>
            );
          })}
        </Tbody>
      </Table>
    </div>
  );
};

export default DisplayLanguages;
