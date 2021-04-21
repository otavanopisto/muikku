import * as React from "react"

interface ApplicationPanelBodyProps {
  modifier?: string
  primaryOption?: React.ReactElement<any>
  toolbar?: React.ReactElement<any>
  asideBefore?: React.ReactElement<any>
  asideAfter?: React.ReactElement<any>
  children?: React.ReactElement<any> | Array<React.ReactElement<any>>
  disableStickyScrolling?: boolean
  offsetBorderAgainstBottom?: number
}

interface ApplicationPanelBodyState {
  sticky: boolean
  remainingHeight: number
  stickyHeight: number
  offsetElementAgainstTop: number
  extraPaddingLeft: number
  extraPaddingRight: number
  asideBeforeWidth: number
}

export default class ApplicationPanelBody extends React.Component<
  ApplicationPanelBodyProps,
  ApplicationPanelBodyState
> {
  private offsetElementAgainstTop: number
  private offsetStickyElementTop: number
  private stickyHeight: number
  private extraPaddingLeft: number
  private extraPaddingRight: number
  private asideBeforeWidth: number
  private borderWidth: number
  private disabled: boolean

  constructor(props: ApplicationPanelBodyProps) {
    super(props)
    this.state = {
      sticky: false,
      remainingHeight: null,
      stickyHeight: null,
      offsetElementAgainstTop: null,
      extraPaddingLeft: null,
      extraPaddingRight: null,
      asideBeforeWidth: null,
    }
    this.onScroll = this.onScroll.bind(this)
    this.calculate = this.calculate.bind(this)
    this.calculateSides = this.calculateSides.bind(this)
  }

  componentDidMount() {
    this.calculate()
    if (!this.disabled) {
      window.addEventListener("scroll", this.onScroll)
      window.addEventListener("resize", this.calculateSides)
    }
  }

  componentWillUnmount() {
    if (!this.disabled) {
      window.removeEventListener("scroll", this.onScroll)
      window.removeEventListener("resize", this.calculateSides)
    }
  }

  calculateSides() {
    this.extraPaddingLeft =
      (this.refs["body"] as HTMLElement).getBoundingClientRect().left +
      this.borderWidth

    const root: Element = document.querySelector("#root")
    this.extraPaddingRight =
      root.getBoundingClientRect().width -
      ((this.refs["body"] as HTMLElement).getBoundingClientRect().width +
        this.extraPaddingLeft) +
      this.borderWidth * 2

    this.setState({
      extraPaddingLeft: this.extraPaddingLeft,
      extraPaddingRight: this.extraPaddingRight,
    })
  }

  calculate() {
    this.disabled = this.props.disableStickyScrolling
    if (this.disabled) {
      return
    }

    const computedStyle = document.defaultView.getComputedStyle(
      this.refs["sticky"] as HTMLElement
    )
    if (computedStyle.getPropertyValue("position") === "fixed") {
      this.disabled = true
      return
    }

    //Sticky height represents the height of the sticky thing on top
    this.stickyHeight = parseInt(computedStyle.getPropertyValue("height"))
    this.setState({
      stickyHeight: this.stickyHeight,
    })

    //offset top represents the amount of offset that the sticky has to the top of the screen

    this.offsetStickyElementTop = (this.refs["sticky"] as HTMLElement).offsetTop

    //We take the element that is supposed to stick to
    const element: Element = document.querySelector("#stick")
    if (!element) {
      this.offsetElementAgainstTop = 0
    } else {
      const stickyElementComputedStyle = document.defaultView.getComputedStyle(
        element
      )
      //this one represents the navbar basically the amount of pixels to the bottom
      this.offsetElementAgainstTop = parseInt(
        stickyElementComputedStyle.getPropertyValue("height")
      )
    }

    //So we save that here
    this.setState({
      offsetElementAgainstTop: this.offsetElementAgainstTop,
    })

    const asideBefore: HTMLElement = this.refs["asideBefore"] as HTMLElement
    if (asideBefore) {
      this.asideBeforeWidth = asideBefore.offsetWidth
      this.setState({
        asideBeforeWidth: this.asideBeforeWidth,
      })
    }

    this.borderWidth = parseInt(
      document.defaultView
        .getComputedStyle(this.refs["body"] as HTMLElement)
        .getPropertyValue("border-left-width")
    )
    this.calculateSides()
    this.setRemainingHeight(false)
  }

  setRemainingHeight(isSticky: boolean) {
    if (!this.props.asideBefore) {
      return
    }

    const top = document.documentElement.scrollTop || document.body.scrollTop
    const height = document.documentElement.offsetHeight
    const scrollHeight = document.documentElement.scrollHeight
    const offsetTopHeight = isSticky
      ? this.offsetElementAgainstTop +
        (this.refs["sticky"] as HTMLElement).offsetHeight
      : (this.refs["sticky"] as HTMLElement).offsetHeight +
        (this.refs["sticky"] as HTMLElement).offsetTop -
        top

    const bottom = scrollHeight - top - height

    let borderBottomSize = bottom + this.borderWidth

    if (borderBottomSize < 0) {
      borderBottomSize = 0
    }

    const remainingUsableWindow = height - offsetTopHeight - borderBottomSize

    this.setState({ remainingHeight: remainingUsableWindow })
  }

  onScroll(e: Event) {
    const top = document.documentElement.scrollTop || document.body.scrollTop
    const diff = this.offsetStickyElementTop - top
    const isSticky = diff < this.offsetElementAgainstTop
    if (isSticky !== this.state.sticky) {
      this.setState({ sticky: isSticky })
      if (isSticky) {
        this.calculateSides()
      }
    }
    this.setRemainingHeight(isSticky)
  }

  render() {
    const {
      offsetBorderAgainstBottom,
      modifier,
      primaryOption,
      toolbar,
      children,
      asideAfter,
      asideBefore,
    } = this.props

    const {
      remainingHeight,
      sticky,
      stickyHeight,
      offsetElementAgainstTop,
      extraPaddingLeft,
      extraPaddingRight,
      asideBeforeWidth,
    } = this.state

    /**
     * Calculating remaining helperContainerHeight if parrent panel component has passed padding-bottom value
     */
    const helperContainerHeight =
      remainingHeight - offsetBorderAgainstBottom || "auto"

    return (
      <div
        className={`application-panel__body ${
          modifier ? "application-panel__body--" + modifier : ""
        }`}
        ref="body"
      >
        <div
          style={{
            display: sticky ? "block" : "none",
            height: stickyHeight,
          }}
        ></div>
        <div
          className="application-panel__actions"
          ref="sticky"
          style={
            sticky
              ? {
                  position: "fixed",
                  top: offsetElementAgainstTop,
                  left: extraPaddingLeft,
                  right: extraPaddingRight,
                }
              : null
          }
        >
          {primaryOption ? (
            <div
              className={`application-panel__helper-container application-panel__helper-container--main-action ${
                modifier
                  ? "application-panel__helper-container--" + modifier
                  : ""
              }`}
            >
              {primaryOption}
            </div>
          ) : null}
          {toolbar ? (
            <div
              className={`application-panel__main-container application-panel__main-container--actions ${
                modifier ? "application-panel__main-container--" + modifier : ""
              }`}
            >
              {toolbar}
            </div>
          ) : null}
        </div>
        <div
          className="application-panel__content"
          style={sticky ? { paddingLeft: asideBeforeWidth } : null}
        >
          {asideBefore ? (
            <div
              className="application-panel__helper-container"
              ref="asideBefore"
              style={{
                position: sticky ? "fixed" : null,
                top: sticky ? offsetElementAgainstTop + stickyHeight : null,
                left: sticky ? extraPaddingLeft : null,
                height: helperContainerHeight,
                width: sticky ? asideBeforeWidth : null,
                overflowY: "auto",
              }}
            >
              {asideBefore}
            </div>
          ) : null}
          <div className={`application-panel__main-container loader-empty`}>
            {children}
          </div>
          {asideAfter ? (
            <div
              className="application-panel__helper-container"
              style={{
                height: helperContainerHeight,
              }}
            >
              {asideAfter}
            </div>
          ) : null}
        </div>
      </div>
    )
  }
}
