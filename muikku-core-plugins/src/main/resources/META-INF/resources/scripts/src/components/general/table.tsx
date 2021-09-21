import { stringify } from "query-string";
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

/* export const Table: React.FC<TableProps> = ({ children, ...rest }) => {
  return (
    <table className="table" {...rest}>
      {children}
    </table>
  );
}; */

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ children, ...rest }, ref) => {
    return (
      <table ref={ref} className="table" {...rest}>
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
      className={`table-row ${
        modifiers ? modifiers.map((m) => `table-row--${m}`).join(" ") : ""
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
      className={`table-head ${
        modifiers ? modifiers.map((m) => `table-head--${m}`).join(" ") : ""
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
      className={`table-data ${
        modifiers ? modifiers.map((m) => `table-data--${m}`).join(" ") : ""
      }`}
      {...rest}
    >
      {children}
    </td>
  );
};

interface TableAnimationWatcherProps {
  tableRef: React.MutableRefObject<HTMLTableElement>;
  tableDataRef: React.RefObject<HTMLDivElement>;
  children: (props: TableAnimationWatcherProps, state: any) => JSX.Element;
}

interface TableAnimationWatcherState {}

export class TableAnimationWatcher extends React.Component<
  TableAnimationWatcherProps,
  TableAnimationWatcherState
> {
  constructor(props: TableAnimationWatcherProps) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    /* let childElement = React.Children.only(
      this.props.children(this.props, this.state)
    );

    childElement = React.cloneElement(childElement, {
      ref: "table-element-content",
    }); */

    console.log("this.props", this.props);
  }

  render() {
    return this.props.children(this.props, this.state);
  }
}
