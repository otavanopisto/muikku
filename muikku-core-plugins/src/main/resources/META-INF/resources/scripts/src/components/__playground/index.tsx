import * as React from "react";
import AceEditor from "react-ace";

import "brace/mode/html";
import "brace/theme/github";
import "~/sass/elements/rich-text.scss";

/**
 * PlaygroundProps
 */
interface PlaygroundProps {}

/**
 * PlaygroundState
 */
interface PlaygroundState {
  html: string;
  codeDisplayed: boolean;
}

/**
 * Playground
 */
export default class Playground extends React.Component<
  PlaygroundProps,
  PlaygroundState
> {
  /**
   * PlaygroundProps
   * @param props props
   */
  constructor(props: PlaygroundProps) {
    super(props);

    this.onChange = this.onChange.bind(this);
    this.reloadStylesheets = this.reloadStylesheets.bind(this);
    this.showURLEncoded = this.showURLEncoded.bind(this);

    const data = window.location.hash.replace("#", "").split("?")[1];
    let def;
    if (data) {
      const url = new (window as any).URL("http://__playground?" + data);
      def = url.searchParams.get("__playground");
    }

    this.state = {
      html: def || localStorage.getItem("HTML") || "",
      codeDisplayed: true,
    };
  }

  /**
   * componentDidMount
   */
  componentDidMount() {
    document.addEventListener("keyup", (e) => {
      if (e.keyCode == 27 && !e.ctrlKey) {
        this.setState({ codeDisplayed: !this.state.codeDisplayed });
      } else if (e.keyCode == 27 && e.ctrlKey) {
        this.reloadStylesheets();
      } else if (e.keyCode == 81 && e.ctrlKey) {
        this.showURLEncoded();
      }
    });
  }

  /**
   * reloadStylesheets
   */
  reloadStylesheets() {
    const links = document.getElementsByTagName("link");
    for (let i = 0; i < links.length; i++) {
      const link = links[i];
      if (link.rel === "stylesheet") {
        link.href += "?";
      }
    }
  }
  /**
   * showURLEncoded
   */
  showURLEncoded() {
    const text = encodeURIComponent(this.state.html);
    let newHash = location.hash;
    if (newHash && newHash.indexOf("?")) {
      newHash += "&__playground=" + text;
    } else if (newHash) {
      newHash += "?__playground=" + text;
    } else {
      newHash += "#?__playground=" + text;
    }
    const url =
      location.protocol +
      "//" +
      location.host +
      location.pathname +
      location.search +
      newHash;
    prompt("copy this", url);
  }

  /**
   * onChange
   * @param newHTML
   */
  onChange(newHTML: string) {
    this.setState({ html: newHTML });
    localStorage.setItem("HTML", newHTML);
  }
  /**
   * Component render methodrender
   */
  render() {
    const style = { width: "100%", height: "100%" };
    const codeThingStyle = {
      position: "fixed" as const,
      width: "35%",
      height: "100%",
      display: this.state.codeDisplayed ? "block" : "none",
      backgroundColor: "white",
      right: 0,
      top: 0,
      borderLeft: "solid 1px #ccc",
      zIndex: 99999999999,
    };
    return (
      <div style={Object.assign(style, { zIndex: 99999999999 })}>
        <div
          style={style}
          className="rich-text"
          dangerouslySetInnerHTML={{ __html: this.state.html }}
        ></div>
        <div style={codeThingStyle}>
          <AceEditor
            focus
            mode="html"
            theme="github"
            onChange={this.onChange}
            value={this.state.html}
            name="html"
            editorProps={{ $blockScrolling: true }}
            width="100%"
            height="100%"
          />
        </div>
      </div>
    );
  }
}
