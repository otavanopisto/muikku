import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import { HTMLtoReactComponent, HTMLToReactComponentRule } from "~/util/modifiers";
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
  processingRules: HTMLToReactComponentRule[],

  invisible?: boolean,
}

interface ImageState {
  predictedHeight: number;
  maxWidth: number;
}

export default class Image extends React.Component<ImageProps, ImageState>{
  private predictedAspectRatio: number;
  constructor(props: ImageProps) {
    super(props);

    const img = this.props.element.querySelector("img");
    const aspectRatio = img ? img.width / img.height : 0;

    this.state = {
      predictedHeight: null,
      maxWidth: null,
    }

    if (!isNaN(aspectRatio) && isFinite(aspectRatio)) {
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
      const predictedHeight = (this.refs["img"] as HTMLImageElement).offsetWidth / this.predictedAspectRatio;
      if (predictedHeight !== this.state.predictedHeight && !isNaN(predictedHeight) && isFinite(predictedHeight)) {
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
        this.setState({ maxWidth });
      }
    }
  }
  render() {
    const newRules = this.props.processingRules.filter((r) => r.id !== "image-rule");
    newRules.push({
      shouldProcessHTMLElement: (tag, element) => tag === "figure",
      preprocessReactProperties: (tag, props, children, element) => {
        if (!this.props.invisible && (this.props.dataset.source || this.props.dataset.author || this.props.dataset.license)) {
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

        const img = this.props.element.querySelector("img");
        props.style = props.style || {};
        props.style.width = img ? (img.width || this.state.maxWidth) + "px" : 0;
        props.style.maxWidth = "100%";

        // If we have image without caption and it's set to float we need to get
        // img's float property and place it to wrapping figure element
        if (img && img.style.float) {
          props.style.float = img.style.float;
        }

        // If we have floating image with or without caption we add margin to the opposing side
        // ie. left float adds right margin and vise versa
        if (img && (img.style.float === 'left' || props.style.float === 'left')) {
          props.style.margin = "10px 15px 10px 0";
        }
        if (img && (img.style.float === 'right' || props.style.float === 'right')) {
          props.style.margin = "10px 0 10px 15px";
        }
      }
    });

    newRules.push({
      shouldProcessHTMLElement: (tag) => tag === "img",
      preventChildProcessing: true,
      preprocessReactProperties: (tag, props) => {
        if (this.predictedAspectRatio && this.props.invisible) {
          delete props.src;
          return "div";
        }

        props.style = props.style || {};
        props.style.width = (props.width || this.state.maxWidth) + "px";
        props.style.maxWidth = "100%";
        props.style.height = this.state.predictedHeight;
        props.width = null;
        props.height = null;
        props.ref = "img";
        props.onLoad = this.calculateMaxWidth;
      },
      processingFunction: (Tag, props, children, element) => {
        const src = this.props.dataset.original;
        const isAbsolute = (src.indexOf('/') == 0) || (src.indexOf('mailto:') == 0) ||
          (src.indexOf('data:') == 0) || (src.match("^(?:[a-zA-Z]+:)?\/\/"));
        if (!isAbsolute) {
          props.src = this.props.path + "/" + src;
        } else {
          props.src = src;
        }

        return (
          <Zoom
            key={props.key}
            imgsrc={props.src}
          >
            <Tag {...props}>{children}</Tag>
          </Zoom>
        );
      }
    });

    return HTMLtoReactComponent(this.props.element, newRules);
  }
}
