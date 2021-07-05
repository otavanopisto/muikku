import * as React from "react";
import "~/sass/elements/table.scss";

/**
 * TableProps
 */
interface TableProps
  extends React.DetailedHTMLProps<
    React.TableHTMLAttributes<HTMLTableElement>,
    HTMLTableElement
  > {}

export const Table: React.FC<TableProps> = ({ children, ...rest }) => {
  return (
    <table className="table" {...rest}>
      {children}
    </table>
  );
};

/**
 * TableHeaderProps
 */
interface TableHeaderProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLTableSectionElement>,
    HTMLTableSectionElement
  > {}

export const TableHead: React.FC<TableHeaderProps> = ({
  children,
  ...rest
}) => {
  return <thead {...rest}>{children}</thead>;
};

/**
 * TableHeaderProps
 */
interface TableBodyProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLTableSectionElement>,
    HTMLTableSectionElement
  > {}

export const Tbody: React.FC<TableBodyProps> = ({ children, ...rest }) => {
  return <tbody {...rest}>{children}</tbody>;
};

/**
 * TableHeaderProps
 */
interface TableFooterProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLTableSectionElement>,
    HTMLTableSectionElement
  > {}

export const Tfooter: React.FC<TableFooterProps> = ({ children, ...rest }) => {
  return <tfoot {...rest}>{children}</tfoot>;
};

/**
 * TableRowProps
 */
interface TableRowProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLTableRowElement>,
    HTMLTableRowElement
  > {
  modifiers?: string[];
}

export const Tr: React.FC<TableRowProps> = ({
  children,
  modifiers,
  ...rest
}) => {
  return (
    <tr
      className={`table__row ${
        modifiers ? modifiers.map((m) => `table__row--${m}`).join(" ") : ""
      }`}
      {...rest}
    >
      {children}
    </tr>
  );
};

/**
 * TableHeadProps
 */
interface TableHeadProps
  extends React.DetailedHTMLProps<
    React.ThHTMLAttributes<HTMLTableHeaderCellElement>,
    HTMLTableHeaderCellElement
  > {
  modifiers?: string[];
}

export const Th: React.FC<TableHeadProps> = ({
  children,
  modifiers,
  ...rest
}) => {
  return (
    <th
      className={`table__head ${
        modifiers ? modifiers.map((m) => `table__head--${m}`).join(" ") : ""
      }`}
      {...rest}
    >
      {children}
    </th>
  );
};

/**
 * TableDataProps
 */
interface TableDataProps
  extends React.DetailedHTMLProps<
    React.TdHTMLAttributes<HTMLTableDataCellElement>,
    HTMLTableDataCellElement
  > {
  modifiers?: string[];
}

export const Td: React.FC<TableDataProps> = ({
  children,
  modifiers,
  ...rest
}) => {
  return (
    <td
      className={`table__data ${
        modifiers ? modifiers.map((m) => `table__data--${m}`).join(" ") : ""
      }`}
      {...rest}
    >
      {children}
    </td>
  );
};
