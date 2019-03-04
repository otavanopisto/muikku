import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { HTMLtoReactComponent } from "~/util/modifiers";
import FieldBase from "../fields/base";

interface ImageProps {
  element: HTMLElement,
  path: string,
  dataset: {
    author: string,
    authorUrl: string,
    licence: string,
    licenseUrl: string,
    source: string,
    sourceUrl: string,
    
    //Someone thought it was smart to set up two versions of data
    original?: string
  },
  i18n: i18nType
}

interface ImageState {
  aspectRatio: number,
  width: number,
  height: number
}

export default class Image extends FieldBase<ImageProps, ImageState>{
  constructor(props: ImageProps){
    super(props);
    
    this.state = {
        aspectRatio: null,
        width: null,
        height: null
    }
  }
  componentDidMount(){
    super.componentDidMount();
    
    let img = this.props.element.querySelector("img");
    let aspectRatio = img.width/img.height;
    this.setState({
      aspectRatio,
      width: (this.refs["img"] as HTMLElement).offsetWidth,
      height: (this.refs["img"] as HTMLElement).offsetWidth/aspectRatio
    });
  }
  render(){
    console.log(this.props.dataset, this.props.element);
    return HTMLtoReactComponent(this.props.element, (Tag: string, elementProps: any, children: Array<any>, element: HTMLElement)=>{
      if (Tag === "figure" && (this.props.dataset.source || this.props.dataset.author || this.props.dataset.licence)){
        children.push(<div className="image-details icon-copyright" key="details">
          <div className="image-details-container">
            <span className="image-details-label">{this.props.i18n.text.get("plugin.workspace.materials.detailsSourceLabel")} </span>
            {this.props.dataset.source ?  <a href={this.props.dataset.sourceUrl} target="_blank">{this.props.dataset.source}</a> : null}
            {this.props.dataset.source ? <span>&nbsp;/&nbsp;</span> : null}
            {this.props.dataset.author ? <a href={this.props.dataset.authorUrl} target="_blank">{this.props.dataset.author}</a> : null}
            {this.props.dataset.author ? <span>,&nbsp;</span> : null}
            {this.props.dataset.licence ? <a href={this.props.dataset.licenseUrl} target="_blank">{this.props.dataset.licence}</a> : null}
          </div>
        </div>);
      }
      
      if (Tag === "img"){
        if (!this.state.width){
          elementProps.style = elementProps.style || {};
          elementProps.style.maxWidth = elementProps.width + "px";
          elementProps.style.width = "100%";
          elementProps.width = null;
          elementProps.height = null;
        } else {
          elementProps.width = this.state.width;
          elementProps.height = this.state.height;
        }
        elementProps.ref = "img";
      }
      
      //I don't know who thought it was a clever idea to have
      //two alternatives of image, one with src, and another one
      //where the source would be data-original
      if (Tag === "img" && this.props.dataset.original){
        if (!this.props.dataset.original.includes("//")){
          elementProps.src = this.props.path + "/" + this.props.dataset.original;
        } else {
          elementProps.src = this.props.dataset.original;
        }
      }
      
      if (!this.loaded){
        delete elementProps.src;
      }
      
      return <Tag {...elementProps}>{children}</Tag>
    });
  }
}