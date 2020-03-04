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
        const isYoutube = elementProps.src.includes("//www.youtube.com");
        let containerStyle: any = {height: elementProps.height || 160, width: "100%"};
        delete iframeProps.height;
        if (isYoutube) {
          delete iframeProps.width;
          containerStyle = {
            width: "100%",
            paddingTop: "56.25%",
            position: "relative",
          }
          iframeProps.style = {
            position: "absolute",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
            width: "100%",
            height: "100%",
          }
        } else {
          iframeProps.style = {
            maxWidth: "100%",
            height: "100%",
            width: !iframeProps.width ? "100%" : null,
          }
        }
        return <div className="iframe" style={containerStyle}>
          <Tag {...iframeProps}>{children}</Tag>
        </div>
      }
    });
  }
}