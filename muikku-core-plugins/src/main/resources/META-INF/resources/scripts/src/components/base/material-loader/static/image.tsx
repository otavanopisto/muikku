import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { HTMLtoReactComponent } from "~/util/modifiers";
import Zoom from "~/components/general/zoom";

interface ImageProps {
  element: HTMLElement,
  path: string,
  dataset: {
    author: string,
    authorUrl: string,
    license: string,
    licenseUrl: string,
    source: string,
    sourceUrl: string,

    // Someone thought it was smart to set up two versions of data
    // Just no!, data-original was NEVER saved to database as part of img attribute nor it does not have any use anymore, it's was added when preprocessing images with jquery for lazyloader was active
    original?: string
  },
  i18n: i18nType,
  processingFunction: any,

  invisible?: boolean,
}

interface ImageState {
  predictedHeight: number;
  maxWidth: number;
}

export default class Image extends React.Component<ImageProps, ImageState>{
  private predictedAspectRatio: number;
  constructor(props: ImageProps){
    super(props);

    const img = this.props.element.querySelector("img");
    const aspectRatio = img.width/img.height;

    this.state = {
      predictedHeight: null,
      maxWidth: null,
    }

    if (!isNaN(aspectRatio)) {
      this.predictedAspectRatio = aspectRatio;
    }

    this.calculatePredictedHeight = this.calculatePredictedHeight.bind(this);
    this.calculateMaxWidth = this.calculateMaxWidth.bind(this);
  }
  componentDidMount() {
    window.addEventListener("resize", this.calculatePredictedHeight);
    this.calculatePredictedHeight();
  }
  componentDidUpdate() {
    this.calculatePredictedHeight();
  }
  componentWillUnmount() {
    window.addEventListener("resize", this.calculatePredictedHeight);
  }
  calculatePredictedHeight() {
    if (this.predictedAspectRatio && this.refs["img"]) {
      const predictedHeight = (this.refs["img"] as HTMLImageElement).offsetWidth/this.predictedAspectRatio;
      if (predictedHeight !== this.state.predictedHeight) {
        this.setState({
          predictedHeight
        });
      }
    }
  }
  calculateMaxWidth() {
    const image = (this.refs["img"] as HTMLImageElement);
    if (image && image.src) {
      const maxWidth = image.naturalWidth;
      if (maxWidth !== this.state.maxWidth) {
        this.setState({maxWidth});
      }
    }
  }
  render(){
    const reprocessingFunction = (Tag: string, elementProps: any, children: Array<any>, element: HTMLElement)=>{
      if (Tag === "figure" && (this.props.dataset.source || this.props.dataset.author || this.props.dataset.license)){
        if (!this.props.invisible) {
          children.push(<div className="image__details icon-copyright" key="details">
            <div className="image__details-container">
              <span className="image__details-label">{this.props.i18n.text.get("plugin.workspace.materials.detailsSourceLabel")} </span>
              {this.props.dataset.source || this.props.dataset.sourceUrl
                ? (this.props.dataset.sourceUrl ?
                    <a href={this.props.dataset.sourceUrl} target="_blank">{this.props.dataset.source || this.props.dataset.sourceUrl}</a> :
                    <span>{this.props.dataset.source}</span>) : null}
              {(this.props.dataset.author || this.props.dataset.authorUrl) &&
                (this.props.dataset.source || this.props.dataset.sourceUrl) ? <span>&nbsp;/&nbsp;</span> : null}
              {this.props.dataset.author || this.props.dataset.authorUrl ? (
                  this.props.dataset.authorUrl ?
                    <a href={this.props.dataset.authorUrl} target="_blank">{this.props.dataset.author || this.props.dataset.authorUrl}</a> :
                    <span>{this.props.dataset.author}</span>
              ) : null}
              {(this.props.dataset.license || this.props.dataset.licenseUrl) &&
                (this.props.dataset.author || this.props.dataset.authorUrl ||
                    this.props.dataset.source || this.props.dataset.sourceUrl) ? <span>,&nbsp;</span> : null}
              {this.props.dataset.license || this.props.dataset.licenseUrl ? (
                  this.props.dataset.licenseUrl ?
                    <a href={this.props.dataset.licenseUrl} target="_blank">{this.props.dataset.license || this.props.dataset.licenseUrl}</a> :
                    <span>{this.props.dataset.license}</span>
              ) : null}
            </div>
          </div>);
        }
      }

      if (Tag === "figure") {
        const img = this.props.element.querySelector("img");
        elementProps.style = elementProps.style || {};
        elementProps.style.width = (img.width || this.state.maxWidth) + "px";
        elementProps.style.maxWidth = "100%";

        // If we have image without caption and it's set to float we need to get
        // img's float property and place it to wrapping figure element
        if (img.style.float) {
          elementProps.style.float = img.style.float;
        }

        // If we have floating image with or without caption we add padding to the opposing side
        // ie. left float adds right padding and vise versa
        if (img.style.float === 'left' || elementProps.style.float === 'left') {
          elementProps.style.paddingRight = "15px";
        }
        if (img.style.float === 'right' || elementProps.style.float === 'right') {
          elementProps.style.paddingLeft = "15px";
        }
      }

      if (Tag === "img"){
        if (this.predictedAspectRatio && this.props.invisible) {
          Tag = "div";
          delete elementProps.src;
        }

        elementProps.style = elementProps.style || {};
        elementProps.style.width = (elementProps.width || this.state.maxWidth) + "px";
        elementProps.style.maxWidth = "100%";
        elementProps.style.height = this.state.predictedHeight;
        elementProps.width = null;
        elementProps.height =  null;
        elementProps.ref = "img";
        elementProps.onLoad = this.calculateMaxWidth;
      }

      if (Tag === "img"){
        const src = this.props.dataset.original;
        const isAbsolute = (src.indexOf('/') == 0) || (src.indexOf('mailto:') == 0) ||
          (src.indexOf('data:') == 0) || (src.match("^(?:[a-zA-Z]+:)?\/\/"));
        if (!isAbsolute){
          elementProps.src = this.props.path + "/" + src;
        } else {
          elementProps.src = src;
        }

        return (
          <Zoom
            key={elementProps.key}
            imgsrc={elementProps.src}
          >
            <Tag {...elementProps}>{children}</Tag>
         </Zoom>
        );
      }

      return <Tag {...elementProps}>{children}</Tag>
    };
    return HTMLtoReactComponent(this.props.element, this.props.processingFunction.bind(this, "figure", reprocessingFunction));
  }
}