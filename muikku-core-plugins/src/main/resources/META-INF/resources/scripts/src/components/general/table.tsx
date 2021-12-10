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
 * @return JSX.Element
 */
export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ children, modifiers, className, ...rest }, ref) => {
    let updatedClassName = "table";

    if (className) {
      updatedClassName = className;
    }
    return (
      <table
        ref={ref}
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
  }
);

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
 * @param param0
 * @returns JSX.Element
 */
export const TableHead: React.FC<TableHeaderProps> = ({
  children,
  modifiers,
  className,
  ...rest
}) => {
  let updatedClassName = "table-thead";

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
 * @param param0
 * @returns JSX.Element
 */
export const Tbody: React.FC<TableBodyProps> = ({
  children,
  modifiers,
  className,
  ...rest
}) => {
  let updatedClassName = "table-tbody";

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
  let updatedClassName = "table-tfoot";

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
interface TableRowProps
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
  let updatedClassName = "table-row";

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
  let updatedClassName = "table-head";

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
  let updatedClassName = "table-data";

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
