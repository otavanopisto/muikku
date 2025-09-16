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
import { m } from "framer-motion";

/**
 * DisplayLanguagesProps
 */
interface DisplayLanguagesProps {
  rows: LanguageData[];
  modifier?: string;
  labels?: string[];
  title?: string;
  disabledItems?: string[];
  singleColumn?: boolean;

  cellAction?: (
    code: string,
    cellId: string,
    rowId?: string,
    index?: number,
    identifier?: string
  ) => React.ReactNode;
  columnAction?: (language: LanguageData) => JSX.Element;
  onItemClick?: (language: LanguageData) => void;
}

/**
 *DusplayLanguages
 * @param props props the props of the component
 * @returns JSX element that displays the languages in a table format
 */
const DisplayLanguages = (props: DisplayLanguagesProps) => {
  const { t } = useTranslation(["languageProfile", "common"]);
  const {
    labels,
    rows,
    title,
    singleColumn,
    modifier,
    cellAction,
    columnAction,
    onItemClick,
  } = props;

  const firstCellModifiers = [
    ...(!singleColumn
      ? ["centered", "language-profile-first-cell"]
      : ["language-profile-single-column"]),
    ...(modifier ? [modifier] : []),
  ];

  return (
    <div className="language-profile__languages-wrapper">
      <Table modifiers={["language-profile__languages"]}>
        {labels && (
          <TableHead modifiers={["sticky"]}>
            <Tr>
              <Th
                modifiers={[
                  "centered",
                  "language-profile-first-cell",
                  modifier && modifier,
                ]}
              >
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
            const rowId = item.code + item.identifier;

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
                <Td modifiers={firstCellModifiers} key={item.code + "-name"}>
                  <span>{item.name}</span>
                  {columnAction && !isDisabled && (
                    <span>{columnAction(item)}</span>
                  )}
                </Td>

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
                          cellAction(
                            item.code,
                            cellId,
                            rowId,
                            index,
                            item.identifier
                          )}
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
