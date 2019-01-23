import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { HTMLtoReactComponent } from "~/util/modifiers";

interface ImageProps {
  element: HTMLElement,
  path: string,
  dataset: {
    //Someone thought it was smart to set up two versions of data
    url?: string
  },
  i18n: i18nType
}

export default function image(props: ImageProps){
  return HTMLtoReactComponent(props.element, (Tag: string, elementProps: any, children: Array<any>, element: HTMLElement)=>{
    if (Tag === "iframe" && props.dataset.url){
      elementProps.src = props.dataset.url;
    }
    
    return <Tag {...elementProps}>{children}</Tag>
  });
}