/* eslint-disable react/no-string-refs */

/**
 * Deprecated refs should be refactored
 */

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
  /**
   * constructor
   * @param props
   */
  constructor(props: TableProps) {
    super(props);
  }

  /**
   * componentDidMount
   */
  componentDidMount() {
    (this.refs["table"] as any).border = (this.props.element as any).border;
    (this.refs["table"] as any).align = (this.props.element as any).align;
  }

  /**
   * componentDidUpdate
   */
  componentDidUpdate() {
    (this.refs["table"] as any).border = (this.props.element as any).border;
    (this.refs["table"] as any).align = (this.props.element as any).align;
  }

  /**
   * render
   */
  render() {
    return (
      <table ref="table" {...this.props.props}>
        {this.props.children}
      </table>
    );
  }
}
