import * as React from "react";

/**
 * TableProps
 */
interface TableProps {
  element: HTMLElement;
  props: any;
  children: any;
}

/**
 * Table
 */
export default class Table extends React.Component<
  TableProps,
  Record<string, unknown>
> {
  private tableRef: React.RefObject<HTMLTableElement>;

  /**
   * constructor
   * @param props props
   */
  constructor(props: TableProps) {
    super(props);
    this.tableRef = React.createRef();
  }

  /**
   * componentDidMount
   */
  componentDidMount() {
    if (this.tableRef.current) {
      this.tableRef.current.setAttribute(
        "border",
        (this.props.element as any).border
      );
      this.tableRef.current.setAttribute(
        "align",
        (this.props.element as any).align
      );
    }
  }

  /**
   * componentDidUpdate
   */
  componentDidUpdate() {
    if (this.tableRef.current) {
      this.tableRef.current.setAttribute(
        "border",
        (this.props.element as any).border
      );
      this.tableRef.current.setAttribute(
        "align",
        (this.props.element as any).align
      );
    }
  }

  /**
   * render
   */
  render() {
    return (
      <table ref={this.tableRef} {...this.props.props}>
        {this.props.children}
      </table>
    );
  }
}
