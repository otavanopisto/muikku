import * as React from "react";
import {
  HTMLtoReactComponent,
  HTMLToReactComponentRule,
} from "~/util/modifiers";
import Zoom from "~/components/general/zoom";
import { WithTranslation, withTranslation } from "react-i18next";
import { ReadspeakerMessage } from "~/components/general/readspeaker";
import { ImageDataset } from "../../types";

/**
 * ImageProps
 */
interface ImageProps extends WithTranslation {
  element: HTMLElement;
  path: string;
  dataset: ImageDataset;
  processingRules: HTMLToReactComponentRule[];

  invisible?: boolean;
}

/**
 * ImageState
 */
interface ImageState {
  predictedHeight: number;
  maxWidth: number;
}

/**
 * Image
 */
class Image extends React.Component<ImageProps, ImageState> {
  private predictedAspectRatio: number;
  private imgRef: React.RefObject<HTMLImageElement>;

  /**
   * constructor
   * @param props props
   */
  constructor(props: ImageProps) {
    super(props);

    const img = this.props.element.querySelector("img");
    const aspectRatio = img ? img.width / img.height : 0;

    this.state = {
      predictedHeight: null,
      maxWidth: null,
    };

    this.imgRef = React.createRef();

    if (!isNaN(aspectRatio) && isFinite(aspectRatio)) {
      this.predictedAspectRatio = aspectRatio;
    }

    this.calculatePredictedHeight = this.calculatePredictedHeight.bind(this);
    this.calculateMaxWidth = this.calculateMaxWidth.bind(this);
  }

  /**
   * componentDidMount
   */
  componentDidMount() {
    window.addEventListener("resize", this.calculatePredictedHeight);
    this.calculatePredictedHeight();
  }

  /**
   * componentDidUpdate
   */
  componentDidUpdate() {
    this.calculatePredictedHeight();
  }

  /**
   * componentWillUnmount
   */
  componentWillUnmount() {
    window.addEventListener("resize", this.calculatePredictedHeight);
  }

  /**
   * calculatePredictedHeight
   */
  calculatePredictedHeight() {
    if (this.predictedAspectRatio && this.imgRef.current) {
      const predictedHeight =
        this.imgRef.current.offsetWidth / this.predictedAspectRatio;
      if (
        predictedHeight !== this.state.predictedHeight &&
        !isNaN(predictedHeight) &&
        isFinite(predictedHeight)
      ) {
        this.setState({
          predictedHeight,
        });
      }
    }
  }
  /**
   * calculateMaxWidth
   */
  calculateMaxWidth() {
    const image = this.imgRef.current;
    if (image && image.src) {
      const maxWidth = image.naturalWidth;
      if (maxWidth !== this.state.maxWidth) {
        this.setState({ maxWidth });
      }
    }
  }

  /**
   * render
   */
  render() {
    const { t } = this.props;

    const newRules = this.props.processingRules.filter(
      (r) => r.id !== "image-rule"
    );
    newRules.push({
      /**
       * shouldProcessHTMLElement
       * @param tag tag
       * @param element element
       */
      shouldProcessHTMLElement: (tag, element) =>
        tag === "figure" || tag === "span",

      /**
       * preprocessReactProperties
       * @param tag tag
       * @param props props
       * @param children children
       * @param element element
       */
      preprocessReactProperties: (tag, props, children, element) => {
        if (
          !this.props.invisible &&
          (this.props.dataset.source ||
            this.props.dataset.author ||
            this.props.dataset.license)
        ) {
          children.push(
            <span
              className="image__details icon-copyright rs_skip_always"
              key="details"
            >
              <span className="image__details-container">
                <span className="image__details-label">
                  {t("labels.source", { ns: "materials" })}:{" "}
                </span>
                {this.props.dataset.source || this.props.dataset.sourceUrl ? (
                  this.props.dataset.sourceUrl ? (
                    <a
                      href={this.props.dataset.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {this.props.dataset.source ||
                        this.props.dataset.sourceUrl}
                    </a>
                  ) : (
                    <span>{this.props.dataset.source}</span>
                  )
                ) : null}
                {(this.props.dataset.author || this.props.dataset.authorUrl) &&
                (this.props.dataset.source || this.props.dataset.sourceUrl) ? (
                  <span>&nbsp;/&nbsp;</span>
                ) : null}
                {this.props.dataset.author || this.props.dataset.authorUrl ? (
                  this.props.dataset.authorUrl ? (
                    <a
                      href={this.props.dataset.authorUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {this.props.dataset.author ||
                        this.props.dataset.authorUrl}
                    </a>
                  ) : (
                    <span>{this.props.dataset.author}</span>
                  )
                ) : null}
                {(this.props.dataset.license ||
                  this.props.dataset.licenseUrl) &&
                (this.props.dataset.author ||
                  this.props.dataset.authorUrl ||
                  this.props.dataset.source ||
                  this.props.dataset.sourceUrl) ? (
                  <span>,&nbsp;</span>
                ) : null}
                {this.props.dataset.license || this.props.dataset.licenseUrl ? (
                  this.props.dataset.licenseUrl ? (
                    <a
                      href={this.props.dataset.licenseUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {this.props.dataset.license ||
                        this.props.dataset.licenseUrl}
                    </a>
                  ) : (
                    <span>{this.props.dataset.license}</span>
                  )
                ) : null}
              </span>
            </span>
          );
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
        if (
          img &&
          (img.style.float === "left" || props.style.float === "left")
        ) {
          props.style.margin = "10px 15px 10px 0";
        }
        if (
          img &&
          (img.style.float === "right" || props.style.float === "right")
        ) {
          props.style.margin = "10px 0 10px 15px";
        }
      },
    });

    newRules.push({
      /**
       * shouldProcessHTMLElement
       * @param tag tag
       */
      shouldProcessHTMLElement: (tag) => tag === "img",
      preventChildProcessing: true,
      /**
       * preprocessReactProperties
       * @param tag tag
       * @param props props
       */
      preprocessReactProperties: (tag, props) => {
        if (this.predictedAspectRatio && this.props.invisible) {
          delete props.src;
          return "span";
        }

        props.style = props.style || {};
        props.style.width = (props.width || this.state.maxWidth) + "px";
        props.style.maxWidth = "100%";
        props.style.height = this.state.predictedHeight;
        props.width = null;
        props.height = null;
        props.ref = this.imgRef;
        props.onLoad = this.calculateMaxWidth;
      },
      /**
       * processingFunction
       * @param Tag Tag
       * @param props props
       * @param children children
       * @param element element
       */
      processingFunction: (Tag, props, children, element) => {
        const src = this.props.dataset.original || "";
        const isAbsolute =
          src.indexOf("/") == 0 ||
          src.indexOf("mailto:") == 0 ||
          src.indexOf("data:") == 0 ||
          src.match("^(?:[a-zA-Z]+:)?//");
        if (!isAbsolute) {
          props.src = this.props.path + "/" + src;
        } else {
          props.src = src;
        }

        return (
          <>
            <ReadspeakerMessage
              text={this.props.t("messages.image", {
                ns: "readSpeaker",
              })}
            />
            <Zoom key={props.key} imgsrc={props.src}>
              <Tag {...props}>{children}</Tag>
            </Zoom>
          </>
        );
      },
    });

    return HTMLtoReactComponent(this.props.element, newRules);
  }
}

export default withTranslation(["workspace", "readSpeaker"])(Image);
