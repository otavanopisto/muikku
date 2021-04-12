import * as React from 'react';

interface ApplicationPanelBodyProps {
  modifier? : string,
  primaryOption?: React.ReactElement<any>,
  toolbar?: React.ReactElement<any>,
  asideBefore?: React.ReactElement<any>,
  asideAfter?: React.ReactElement<any>,
  children?: React.ReactElement<any> | Array<React.ReactElement<any>>,
  disableStickyScrolling?: boolean
}

interface ApplicationPanelBodyState {
  sticky: boolean,
  remainingHeight: number,
  stickyHeight: number,
  offsetElementAgainstTop: number,
  extraPaddingLeft: number,
  extraPaddingRight: number,
  asideBeforeWidth: number,
  mobileWidth: boolean,
}

export default class ApplicationPanelBody extends React.Component<ApplicationPanelBodyProps, ApplicationPanelBodyState> {
  private offsetElementAgainstTop:number;
  private offsetStickyElementTop: number;
  private offsetBorderAgainstBottom: number;
  private stickyHeight: number;
  private extraPaddingLeft: number;
  private extraPaddingRight: number;
  private asideBeforeWidth: number;
  private borderWidth: number;
  private disabled: boolean;

  constructor(props: ApplicationPanelBodyProps){
    super(props);
    this.state = {
      sticky: false,
      remainingHeight: null,
      stickyHeight: null,
      offsetElementAgainstTop: null,
      extraPaddingLeft: null,
      extraPaddingRight: null,
      asideBeforeWidth: null,
      mobileWidth: false,

    }
    this.onScroll = this.onScroll.bind(this);
    this.calculate = this.calculate.bind(this);
    this.calculateSides = this.calculateSides.bind(this);
    this.checkWidth = this.checkWidth.bind(this);

  }

  componentDidMount(){
    window.addEventListener("resize", this.checkWidth);

    this.calculate();
    if (!this.disabled){
      window.addEventListener("scroll", this.onScroll);
      window.addEventListener("resize", this.calculateSides);
    }
  }

  componentWillUnmount(){
    window.removeEventListener("resize", this.checkWidth);

    if (!this.disabled){
      window.removeEventListener("scroll", this.onScroll);
      window.removeEventListener("resize", this.calculateSides);
    }
  }
  
  /**
   * calculate
   * @returns
   */
  calculate(){
    this.disabled = this.props.disableStickyScrolling;
    if (this.disabled){
      return;
    }

    const computedStyle = document.defaultView.getComputedStyle(this.refs["sticky"] as HTMLElement);

    //Sticky height represents the height of the sticky thing on top
    this.stickyHeight = parseInt(computedStyle.getPropertyValue("height"));
    this.setState({
      stickyHeight: this.stickyHeight
    });

    //offset top represents the amount of offset that the sticky has to the top of the screen
    this.offsetStickyElementTop = (this.refs["sticky"] as HTMLElement).offsetTop;

    //We take the element that is supposed to stick to
    const element:Element = document.querySelector("#stick");
    if (!element){
      this.offsetElementAgainstTop = 0;
    } else {
      const stickyElementComputedStyle = document.defaultView.getComputedStyle(element);
      //this one represents the navbar basically the amount of pixels to the bottom
      this.offsetElementAgainstTop = parseInt(stickyElementComputedStyle.getPropertyValue("height"));
    }

    //So we save that here
    this.setState({
      offsetElementAgainstTop: this.offsetElementAgainstTop
    })

    // offsetBorderAgainstBottom is lacking at the moment. before the change it used "panel" ref, I changed it to body. Maybe it works, maybe not.
    const panelComputedStyle = document.defaultView.getComputedStyle(this.refs["body"] as HTMLElement);
    this.offsetBorderAgainstBottom = parseInt(panelComputedStyle.getPropertyValue("padding-bottom"));

    const asideBefore:HTMLElement = (this.refs["asideBefore"] as HTMLElement);
    if (asideBefore){
      this.asideBeforeWidth = asideBefore.offsetWidth;
      this.setState({
        asideBeforeWidth: this.asideBeforeWidth
      });
    }

    this.borderWidth = parseInt(document.defaultView.getComputedStyle(this.refs["body"] as HTMLElement).getPropertyValue("border-left-width"));
    this.calculateSides();
    this.setRemainingHeight(false);
  }

  /**
   * calculateSides
   */
  calculateSides(){
    this.extraPaddingLeft = (this.refs["body"] as HTMLElement).getBoundingClientRect().left + this.borderWidth;

    const root:Element = document.querySelector("#root");
    this.extraPaddingRight = root.getBoundingClientRect().width -
      ((this.refs["body"] as HTMLElement).getBoundingClientRect().width + this.extraPaddingLeft) + (this.borderWidth*2);

    this.setState({
      extraPaddingLeft: this.extraPaddingLeft,
      extraPaddingRight: this.extraPaddingRight
    });
  }

  /**
   * setRemainingHeight
   * @param isSticky
   * @returns
   */
  setRemainingHeight(isSticky: boolean){
    if (!this.props.asideBefore){
     return;
    }

    const top = (document.documentElement.scrollTop || document.body.scrollTop);
    const height = document.documentElement.offsetHeight;
    const scrollHeight = document.documentElement.scrollHeight;

    const offsetTopHeight = isSticky ?
      this.offsetElementAgainstTop + (this.refs["sticky"] as HTMLElement).offsetHeight :
      (this.refs["sticky"] as HTMLElement).offsetHeight + (this.refs["sticky"] as HTMLElement).offsetTop - top;
    const bottom = Math.round(scrollHeight - top) - height;
    let borderBottomSize = this.offsetBorderAgainstBottom - bottom + this.borderWidth;
    if (borderBottomSize < 0){
      borderBottomSize = 0;
    }
    const remainingUsableWindow = height - offsetTopHeight - borderBottomSize;
    this.setState({remainingHeight: remainingUsableWindow});
  }

  /**
   * onScroll
   * Fires when scrolling happens
   * sets offsetvalues to state and trickers calculatesSides and setRemainingHeight
   * to calculate new values
   * @param e
   */
  onScroll(e: Event){
    const top = (document.documentElement.scrollTop || document.body.scrollTop);
    const diff = this.offsetStickyElementTop - top;

    const element:Element = document.querySelector("#stick");
    if (!element){
      this.offsetElementAgainstTop = 0;
    } else {
      const stickyElementComputedStyle = document.defaultView.getComputedStyle(element);
      this.offsetElementAgainstTop = parseInt(stickyElementComputedStyle.getPropertyValue("height"));
    }
    this.setState({
      offsetElementAgainstTop: this.offsetElementAgainstTop
    })

    const isSticky = (diff < this.offsetElementAgainstTop);

    if (isSticky !== this.state.sticky){
      this.setState({sticky: isSticky});
      if (isSticky){
        this.calculateSides();
      }
    }
    this.setRemainingHeight(isSticky);
  }

  /**
   * checkWidth
   * Checks when window size in within Mobile and Pad sizes
   * This then sets boolean variable to state indicating that Mobile/Pad width is active
   * @param e
   */
  checkWidth(e: Event) {
    const match = window.matchMedia(`(max-width: 768px)`);
    if(this.state.mobileWidth !== match.matches){
      this.setState({
        mobileWidth: match.matches
      })
    }
  }

  /**
   * render
   * @returns
   */
  render(){
    return (
      <div className={`application-panel__body ${this.props.modifier ? "application-panel__body--" + this.props.modifier : ""}`} ref="body">
        <div className="application-panel__actions" ref="sticky" style={ this.state.sticky ? {
             top: this.state.offsetElementAgainstTop,
             left: !this.state.mobileWidth ? this.state.extraPaddingLeft : 0,
             right: !this.state.mobileWidth ? this.state.extraPaddingRight : 0
           } : null }>
          {this.props.primaryOption ? <div className={`application-panel__helper-container application-panel__helper-container--main-action ${this.props.modifier ? "application-panel__helper-container--" + this.props.modifier : ""}`}>{this.props.primaryOption}</div> : null}
          {this.props.toolbar ? <div className={`application-panel__main-container application-panel__main-container--actions ${this.props.modifier ? "application-panel__main-container--" + this.props.modifier : ""}`}>{this.props.toolbar}</div> : null}
        </div>
        <div className="application-panel__content">
          {this.props.asideBefore ? <div className="application-panel__helper-container" ref="asideBefore" style={{
             position: this.state.sticky ? "sticky" : null,
             top: this.state.sticky ? this.state.offsetElementAgainstTop + this.state.stickyHeight : null,
             left: this.state.sticky ? this.state.extraPaddingLeft : null,
             height: this.state.remainingHeight,
             width: this.state.sticky ? this.state.asideBeforeWidth : null,
             overflowY: "auto"
           }}>{this.props.asideBefore}</div> : null}
          <div className={`application-panel__main-container loader-empty`}>{this.props.children}</div>
          {this.props.asideAfter ? <div className="application-panel__helper-container" style={{height: this.state.remainingHeight}}>{this.props.asideAfter}</div> : null}
        </div>
      </div>
    )
  };
}
