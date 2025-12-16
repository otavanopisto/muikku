import * as React from "react";
import "~/sass/elements/table.scss";

/**
 * TableProps
 */
interface TableProps
  extends React.DetailedHTMLProps<
    React.TableHTMLAttributes<HTMLTableElement>,
    HTMLTableElement
  > {
  modifiers?: string[];
}

/**
 * Table
 * @param props props
 * @returns JSX.Element
 */
export const Table: React.FC<TableProps> = (props) => {
  const { children, modifiers, className, ...rest } = props;

  let updatedClassName = "table";

  if (className) {
    updatedClassName = className;
  }
  return (
    <table
      className={`${updatedClassName} ${
        modifiers
          ? modifiers.map((m) => `${updatedClassName}--${m}`).join(" ")
          : ""
      }`}
      {...rest}
    >
      {children}
    </table>
  );
};

/**
 * ScrollableTableWrapperProps
 */
interface ScrollableTableWrapperProps {
  children: React.ReactNode;
  modifiers?: string[];
}

/**
 * ScrollableTableWrapper
 * @param props props
 * @returns JSX.Element
 */
export const ScrollableTableWrapper: React.FC<ScrollableTableWrapperProps> = (
  props
) => {
  const { children, modifiers } = props;

  return (
    <div
      className={`table__scrollable-wrapper ${
        modifiers
          ? modifiers.map((m) => `table__scrollable-wrapper--${m}`).join(" ")
          : ""
      }`}
    >
      {children}
    </div>
  );
};

/**
 * TableHeaderProps
 */
interface TableHeaderProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLTableSectionElement>,
    HTMLTableSectionElement
  > {
  modifiers?: string[];
}

/**
 * TableHead
 * @param props props
 * @returns JSX.Element
 */
export const TableHead: React.FC<TableHeaderProps> = (props) => {
  const { children, modifiers, className, ...rest } = props;

  let updatedClassName = "table__thead";

  if (className) {
    updatedClassName = className;
  }
  return (
    <thead
      className={`${updatedClassName} ${
        modifiers
          ? modifiers.map((m) => `${updatedClassName}--${m}`).join(" ")
          : ""
      }`}
      {...rest}
    >
      {children}
    </thead>
  );
};

/**
 * TableHeaderProps
 */
interface TableBodyProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLTableSectionElement>,
    HTMLTableSectionElement
  > {
  modifiers?: string[];
}

/**
 * Tbody
 * @param props props
 * @returns JSX.Element
 */
export const Tbody: React.FC<TableBodyProps> = (props) => {
  const { children, modifiers, className, ...rest } = props;

  let updatedClassName = "table__tbody";

  if (className) {
    updatedClassName = className;
  }

  return (
    <tbody
      className={`${updatedClassName} ${
        modifiers
          ? modifiers.map((m) => `${updatedClassName}--${m}`).join(" ")
          : ""
      }`}
      {...rest}
    >
      {children}
    </tbody>
  );
};

/**
 * TableHeaderProps
 */
interface TableFooterProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLTableSectionElement>,
    HTMLTableSectionElement
  > {
  modifiers?: string[];
}

/**
 * Tfooter
 * @param param0
 * @returns JSX.Element
 */
export const Tfooter: React.FC<TableFooterProps> = ({
  children,
  modifiers,
  className,
  ...rest
}) => {
  let updatedClassName = "table__tfoot";

  if (className) {
    updatedClassName = className;
  }

  return (
    <tfoot
      className={`${updatedClassName} ${
        modifiers
          ? modifiers.map((m) => `${updatedClassName}--${m}`).join(" ")
          : ""
      }`}
      {...rest}
    >
      {children}
    </tfoot>
  );
};

/**
 * TableRowProps
 */
export interface TableRowProps
  extends React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLTableRowElement>,
    HTMLTableRowElement
  > {
  modifiers?: string[];
}

/**
 * Tr
 * @param param0
 * @returns JSX.Element
 */
export const Tr: React.FC<TableRowProps> = ({
  children,
  modifiers,
  className,
  ...rest
}) => {
  let updatedClassName = "table__row";

  if (className) {
    updatedClassName = className;
  }

  return (
    <tr
      className={`${updatedClassName} ${
        modifiers
          ? modifiers.map((m) => `${updatedClassName}--${m}`).join(" ")
          : ""
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

/**
 * Th
 * @param param0
 * @returns JSX.Element
 */
export const Th: React.FC<TableHeadProps> = ({
  children,
  modifiers,
  className,
  ...rest
}) => {
  let updatedClassName = "table__head";

  if (className) {
    updatedClassName = className;
  }

  return (
    <th
      className={`${updatedClassName} ${
        modifiers
          ? modifiers.map((m) => `${updatedClassName}--${m}`).join(" ")
          : ""
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

/**
 * Td
 * @param param0
 * @returns JSX.Element
 */
export const Td: React.FC<TableDataProps> = ({
  children,
  modifiers,
  className,
  ...rest
}) => {
  let updatedClassName = "table__data";

  if (className) {
    updatedClassName = className;
  }

  return (
    <td
      className={`${updatedClassName} ${
        modifiers
          ? modifiers.map((m) => `${updatedClassName}--${m}`).join(" ")
          : ""
      }`}
      {...rest}
    >
      {children}
    </td>
  );
};
