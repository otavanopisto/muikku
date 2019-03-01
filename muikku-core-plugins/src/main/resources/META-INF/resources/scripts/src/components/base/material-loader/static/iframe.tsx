import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { HTMLtoReactComponent } from "~/util/modifiers";
import FieldBase from '../fields/base';

interface IframeProps {
  element: HTMLElement,
  path: string,
  dataset: {
    //Someone thought it was smart to set up two versions of data
    url?: string
  },
  i18n: i18nType
}

export default class Iframe extends FieldBase<IframeProps, {}>{
  constructor(props: IframeProps){
    super(props);
  }
  render (){
    return HTMLtoReactComponent(this.props.element, (Tag: string, elementProps: any, children: Array<any>, element: HTMLElement)=>{
      if (Tag === "iframe" && !this.loaded){
        return <div style={{height: elementProps.height}}/>
      }
      
      if (Tag === "iframe" && this.props.dataset.url){
        elementProps.src = this.props.dataset.url;
      }
      
      return <Tag {...elementProps}>{children}</Tag>
    });
  }
}