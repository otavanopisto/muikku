import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { HTMLtoReactComponent } from "~/util/modifiers";

interface LinkProps {
  element: HTMLElement,
  path: string,
  dataset: {
    //Someone thought it was smart to set up two versions of data
    url?: string
  },
  i18n: i18nType
}

export default class Link extends React.Component<LinkProps, {}>{
  constructor(props: LinkProps){
    super(props);
  }
  render (){
    return HTMLtoReactComponent(this.props.element, (Tag: string, elementProps: any, children: Array<any>, element: HTMLElement)=>{
      if (Tag === "a" && elementProps.href && !elementProps.href.includes("//") && elementProps.href[0] !== "#"){
        elementProps.href = this.props.path + "/" + elementProps.href;
      }
      
      return <Tag {...elementProps}>{children}</Tag>
    });
  }
}