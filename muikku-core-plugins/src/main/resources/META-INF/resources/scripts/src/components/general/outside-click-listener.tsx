import * as React from "react";
import "~/sass/elements/click-outside-listener.scss";

/**
 * OutsideAlerterProps
 */
interface OutsideClickListenerProps {
  containerStyle?: React.CSSProperties;
  modifiers?: string[];
  onClickOutside: () => void;
  children?: React.ReactNode;
}

/**
 * OutsideAlerterState
 */
interface OutsideClickListenerState {}

/**
 * Component that alerts if you click outside of it
 */
class OutsideClickListener extends React.Component<
  OutsideClickListenerProps,
  OutsideClickListenerState
> {
  private wrapperRef: React.RefObject<HTMLDivElement>;

  /**
   * constructor
   * @param props props
   */
  constructor(props: OutsideClickListenerProps) {
    super(props);

    this.wrapperRef = React.createRef();
    this.handleClickOutside = this.handleClickOutside.bind(this);
  }

  /**
   * componentDidMount
   */
  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  /**
   * componentWillUnmount
   */
  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  /**
   * if clicked on outside of element
   * @param event event
   */
  handleClickOutside(event: MouseEvent) {
    if (
      this.wrapperRef &&
      !this.wrapperRef.current.contains(event.target as Node)
    ) {
      this.props.onClickOutside();
    }
  }

  /**
   * render
   * @returns React.JSX.Element
   */
  render() {
    return (
      <div
        className={`click-outside-listener ${
          this.props.modifiers
            ? this.props.modifiers
                .map((m) => `click-outside-listener--${m}`)
                .join(" ")
            : ""
        }`}
        ref={this.wrapperRef}
        style={this.props.containerStyle}
      >
        {this.props.children}
      </div>
    );
  }
}

export default OutsideClickListener;
