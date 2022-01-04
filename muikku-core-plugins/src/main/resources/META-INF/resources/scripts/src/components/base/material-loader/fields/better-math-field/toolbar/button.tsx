import * as React from "react";

interface ToolbarButtonProps {
  className: string;
  image?: string;
  html?: string;
  tooltip: string;
  tooltipClassName: string;
  onTrigger: (e: React.MouseEvent<any> | React.TouchEvent<any>) => any;
}

interface ToolbarButtonState {
  tooltipVisible: boolean;
}

export default class ToolbarButton extends React.Component<
  ToolbarButtonProps,
  ToolbarButtonState
> {
  avoidDuplicate: boolean;
  avoidDuplicateCaller: string;
  constructor(props: ToolbarButtonProps) {
    super(props);

    this.state = {
      tooltipVisible: false
    };

    this.toggleTooltip = this.toggleTooltip.bind(this);
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
    this.onMouseLeave = this.onMouseLeave.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
  }
  toggleTooltip(to: boolean) {
    this.setState({
      tooltipVisible: to
    });
  }
  onTouchStart(e: React.TouchEvent<any>) {
    //AVOID browser bug where they both trigger no matter what you do
    if (this.avoidDuplicate && this.avoidDuplicateCaller === "mousedown") {
      this.avoidDuplicate = false;
      return;
    }
    this.avoidDuplicate = true;
    this.avoidDuplicateCaller = "touchstart";
    setTimeout(() => {
      this.avoidDuplicate = false;
    }, 300);
    this.toggleTooltip(true);
    this.props.onTrigger(e);
  }
  onMouseDown(e: React.MouseEvent<any>) {
    //AVOID browser bug where they both trigger no matter what you do
    if (this.avoidDuplicate && this.avoidDuplicateCaller === "touchstart") {
      this.avoidDuplicate = false;
      return;
    }
    this.avoidDuplicate = true;
    this.avoidDuplicateCaller = "mousedown";
    setTimeout(() => {
      this.avoidDuplicate = false;
    }, 300);

    this.props.onTrigger(e);
  }
  disableMenu(e: React.ChangeEvent<any>) {
    e.preventDefault();
    e.stopPropagation();
    return false;
  }
  onMouseEnter(e: React.MouseEvent<any>) {
    e.preventDefault();

    this.toggleTooltip(true);
  }
  onMouseLeave(e: React.MouseEvent<any>) {
    e.preventDefault();

    this.toggleTooltip(false);
  }
  onTouchEnd(e: React.TouchEvent<any>) {
    e.preventDefault();

    //A delay is added in touch devices
    setTimeout(() => this.toggleTooltip(false), 2000);
  }
  render() {
    return (
      <button
        className={this.props.className}
        onMouseDown={this.onMouseDown}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onTouchStart={this.onTouchStart}
        onTouchEnd={this.onTouchEnd}
        onContextMenu={this.disableMenu}
        style={{ userSelect: "none" }}
      >
        {this.props.html ? (
          <span dangerouslySetInnerHTML={{ __html: this.props.html }} />
        ) : null}
        {this.props.image ? <img src={this.props.image} /> : null}
        {this.state.tooltipVisible ? (
          <span className={this.props.tooltipClassName}>
            {this.props.tooltip}
          </span>
        ) : null}
      </button>
    );
  }
}
