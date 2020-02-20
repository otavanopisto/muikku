import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { HTMLtoReactComponent } from "~/util/modifiers";

interface IframeProps {
  element: HTMLElement,
  path: string,
  dataset: {
    //Someone thought it was smart to set up two versions of data
    url?: string
  },
  i18n: i18nType
  invisible?: boolean,
}

export default class Iframe extends React.Component<IframeProps, {}>{
  constructor(props: IframeProps){
    super(props);
  }
  render (){
    return HTMLtoReactComponent(this.props.element, (Tag: string, elementProps: any, children: Array<any>, element: HTMLElement)=>{
      if (Tag === "iframe" && this.props.invisible){
        return <div style={{height: elementProps.height || 160}}/>
      }
      
      if (Tag === "iframe" && this.props.dataset.url){
        elementProps.src = this.props.dataset.url;
      }
      
      if (Tag === "iframe") {
        const iframeProps = {...elementProps};
        delete iframeProps.height;
        iframeProps.style = {
          maxWidth: "100%",
          height: "100%",
          width: !iframeProps.width ? "100%" : null,
        }
        return <div className="iframe" style={{height: elementProps.height || 160, width: "100%"}}>
          <Tag {...iframeProps}>{children}</Tag>
        </div>
      }
    });
  }
}