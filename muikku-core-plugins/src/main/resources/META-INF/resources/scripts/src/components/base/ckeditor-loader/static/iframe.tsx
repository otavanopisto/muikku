import * as React from "react";
import OutsideClickListener from "~/components/general/outside-click-listener";
import { ReadspeakerMessage } from "~/components/general/readspeaker";
import { prepareH5POn } from "~/lib/h5p";
import {
  HTMLtoReactComponent,
  HTMLToReactComponentRule,
} from "~/util/modifiers";
import { WithTranslation, withTranslation } from "react-i18next";

/**
 * IframeProps
 */
interface IframeProps extends WithTranslation {
  element: HTMLElement;
  path: string;
  dataset: {
    //two versions of data
    url?: string;
  };
  invisible?: boolean;
}

/**
 * IframeState
 */
interface IframeState {
  active: boolean;
}

/**
 * Iframe
 */
class Iframe extends React.Component<IframeProps, IframeState> {
  private mainParentRef: React.RefObject<HTMLDivElement>;
  private loadedH5P = false;

  /**
   * constructor
   * @param props props
   */
  constructor(props: IframeProps) {
    super(props);

    this.mainParentRef = React.createRef();

    this.loadH5PIfNecessary = this.loadH5PIfNecessary.bind(this);

    this.state = {
      active: false,
    };
  }

  /**
   * componentDidUpdate
   */
  componentDidUpdate() {
    this.loadH5PIfNecessary();
  }

  /**
   * iframeClickEventListener
   * @param e e
   */
  handleOverlayClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    this.setState({
      active: true,
    });
  };

  /**
   * Alert if clicked on outside of element
   */
  handleClickOutside = () => {
    this.setState({
      active: false,
    });
  };

  /**
   * loadH5PIfNecessary
   */
  loadH5PIfNecessary() {
    if (!this.loadedH5P) {
      const iframe =
        this.mainParentRef.current &&
        this.mainParentRef.current.querySelector("iframe");
      if (iframe) {
        iframe.addEventListener("load", () => {
          prepareH5POn(iframe);
        });

        this.loadedH5P = true;
      }
    }
  }

  /**
   * render
   */
  render() {
    const iframeOnlySpecificRules: HTMLToReactComponentRule[] = [
      {
        /**
         * shouldProcessHTMLElement
         * @param tag tag
         * @param element element
         */
        shouldProcessHTMLElement: (tag, element) => tag === "iframe",
        preventChildProcessing: true,
        /**
         * processingFunction
         * @param Tag Tag
         * @param elementProps elementProps
         * @param children children
         * @param element element
         */
        processingFunction: (Tag, elementProps, children, element) => {
          if (this.props.invisible) {
            const isYoutube =
              elementProps.src &&
              elementProps.src.includes("//www.youtube.com");
            if (isYoutube) {
              return (
                <span
                  style={{
                    height: elementProps.height + "px" || "160px",
                    width: "100%",
                    paddingTop: "56.25%",
                    position: "relative",
                    display: "block",
                  }}
                />
              );
            } else {
              return (
                <span
                  style={{
                    height: elementProps.height + "px" || "160px",
                    display: "block",
                  }}
                />
              );
            }
          }

          if (this.props.dataset.url || elementProps.src) {
            const src = this.props.dataset.url || elementProps.src;
            const isAbsolute =
              src.indexOf("/") == 0 ||
              src.indexOf("mailto:") == 0 ||
              src.indexOf("data:") == 0 ||
              src.match("^(?:[a-zA-Z]+:)?//");
            if (!isAbsolute) {
              elementProps.src = this.props.path + "/" + src;
            } else {
              elementProps.src = src;
            }
          }

          const iframeProps = { ...elementProps };
          const isYoutube =
            elementProps.src && elementProps.src.includes("//www.youtube.com");

          let containerStyle: React.CSSProperties = {
            height: elementProps.height + "px" || "160px",
            width: "100%",
          };

          delete iframeProps.height;
          if (isYoutube) {
            delete iframeProps.width;
            containerStyle = {
              ...containerStyle,
              paddingTop: "56.25%",
              position: "relative",
            };
            iframeProps.allowFullScreen = true;
            iframeProps.style = {
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              width: "100%",
              height: "100%",
            };
          } else {
            iframeProps.style = {
              maxWidth: "100%",
              height: "100%",
              width: !iframeProps.width ? "100%" : null,
            };
          }

          return (
            <>
              <ReadspeakerMessage
                text={this.props.t("messages.assignment", {
                  ns: "readSpeaker",
                  context: "iframe",
                })}
              />
              <span className="material-page__iframe-wrapper rs_skip_always">
                <OutsideClickListener
                  containerStyle={containerStyle}
                  onClickOutside={this.handleClickOutside}
                >
                  {!this.state.active && (
                    <div onClick={this.handleOverlayClick} />
                  )}

                  <Tag {...iframeProps}>{children}</Tag>
                </OutsideClickListener>
              </span>
            </>
          );
        },
      },
    ];

    return HTMLtoReactComponent(this.props.element, iframeOnlySpecificRules);
  }
}

export default withTranslation(["workspace", "readSpeaker"])(Iframe);
