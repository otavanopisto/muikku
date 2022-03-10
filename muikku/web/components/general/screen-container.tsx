import * as React from "react";
import "~/sass/elements/screen-container.scss";

/**
 * ScreenContainerProps
 */
interface ScreenContainerProps {
  children?: any;
  viewModifiers?: string | Array<string>;
}

/**
 * ScreenContainerState
 */
interface ScreenContainerState {}

/**
 * ScreenContainer
 */
export default class ScreenContainer extends React.Component<
  ScreenContainerProps,
  ScreenContainerState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: ScreenContainerProps) {
    super(props);
  }

  /**
   * render
   * @returns JSX.Element
   */
  render() {
    const modifiers: Array<string> =
      typeof this.props.viewModifiers === "string"
        ? [this.props.viewModifiers]
        : this.props.viewModifiers;
    return (
      <main className="screen-container">
        <div
          className={`screen-container__wrapper ${(modifiers || [])
            .map((s) => `screen-container__wrapper--${s}`)
            .join(" ")}`}
        >
          {this.props.children}
        </div>
      </main>
    );
  }
}
