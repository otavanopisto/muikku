import Body from "../components/error/body";
import * as React from "react";
import "~/sass/util/base.scss";

export default class Error extends React.Component<
  Record<string, unknown>,
  Record<string, unknown>
> {
  render() {
    return (
      <div id="root">
        <Body></Body>
      </div>
    );
  }
}
