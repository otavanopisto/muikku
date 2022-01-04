import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { HTMLtoReactComponent } from "~/util/modifiers";

interface TableProps {
  element: HTMLElement;
  props: any;
  children: any;
}

export default class Table extends React.Component<TableProps, {}> {
  constructor(props: TableProps) {
    super(props);
  }
  componentDidMount() {
    (this.refs["table"] as any).border = (this.props.element as any).border;
    (this.refs["table"] as any).align = (this.props.element as any).align;
  }
  componentDidUpdate() {
    (this.refs["table"] as any).border = (this.props.element as any).border;
    (this.refs["table"] as any).align = (this.props.element as any).align;
  }
  render() {
    return (
      <table ref="table" {...this.props.props}>
        {this.props.children}
      </table>
    );
  }
}
