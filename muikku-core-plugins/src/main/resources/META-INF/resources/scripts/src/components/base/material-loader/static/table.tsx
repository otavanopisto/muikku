import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { HTMLtoReactComponent } from "~/util/modifiers";
import "~/sass/elements/material-table-container.scss";

interface TableProps {
  element: HTMLElement,
  path: string,
  i18n: i18nType
}

export default class Table extends React.Component<TableProps, {}>{
  constructor(props: TableProps){
    super(props);
  }
  render (){
    return <div className="material-table-container" dangerouslySetInnerHTML={{__html: this.props.element.outerHTML}}/>
  }
}