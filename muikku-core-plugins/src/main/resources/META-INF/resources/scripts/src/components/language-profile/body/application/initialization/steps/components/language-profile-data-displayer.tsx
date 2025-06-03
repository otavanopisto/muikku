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
import "~/sass/elements/table.scss";

/**
 * LanguageProfileDataDisplayerProps
 */
interface LanguageProfileDataDisplayerProps {
  labels?: string[];
  title?: string;
  rows: LanguageData[];
  disabledItems?: string[];

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
  const { labels, rows, title, cellAction, onItemClick } = props;
  return (
    <div className="language-profile__languages-wrapper">
      <Table modifiers={["language-profile__languages"]}>
        {labels && (
          <TableHead modifiers={["sticky"]}>
            <Tr>
              <Th modifiers={["centered"]}>{title ? title : "Kieli"}</Th>
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

            return (
              <Tr
                data-testid={rowId}
                key={rowId}
                onClick={() => onItemClick?.(item)}
                modifiers={[`${isDisabled ? "DISABLED" : ""}`]}
              >
                <Td modifiers={["centered"]} key={item.code}>
                  {item.name}
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
