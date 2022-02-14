import * as React from "react";
import { prepareH5POn } from "~/lib/h5p";
import { i18nType } from "~/reducers/base/i18n";
import {
  HTMLtoReactComponent,
  HTMLToReactComponentRule,
} from "~/util/modifiers";

interface IframeProps {
  element: HTMLElement;
  path: string;
  dataset: {
    //two versions of data
    url?: string;
  };
  i18n: i18nType;
  invisible?: boolean;
}

export default class Iframe extends React.Component<IframeProps, {}> {
  private mainParentRef: React.RefObject<HTMLDivElement>;
  private loadedH5P: boolean = false;
  constructor(props: IframeProps) {
    super(props);

    this.mainParentRef = React.createRef();

    this.loadH5PIfNecessary = this.loadH5PIfNecessary.bind(this);
  }
  componentDidMount() {
    this.loadH5PIfNecessary();
  }
  componentDidUpdate() {
    this.loadH5PIfNecessary();
  }
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
  render() {
    const iframeOnlySpecificRules: HTMLToReactComponentRule[] = [
      {
        shouldProcessHTMLElement: (tag, element) => {
          return tag === "iframe";
        },
        preventChildProcessing: true,
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
          let containerStyle: any = {
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
            <span
              className="material-page__iframe-wrapper"
              style={containerStyle}
            >
              <Tag {...iframeProps}>{children}</Tag>
            </span>
          );
        },
      },
    ];

    return HTMLtoReactComponent(this.props.element, iframeOnlySpecificRules);
  }
}
