import * as React from "react";

interface OverflowDetectorProps {
  classNameWhenOverflown: string,
  className: string,
  as: string,
  [prop: string]: any
}

interface OverflowDetectorState {
  overflown: boolean
}

export default class OverflowDetector extends React.Component<OverflowDetectorProps, OverflowDetectorState> {
  constructor(props: OverflowDetectorProps){
    super(props);
    
    this.state = {
      overflown: false
    }
    
    this.checkOverflown = this.checkOverflown.bind(this);
  }
  componentDidMount(){
    this.checkOverflown();
  }
  componentDidReceiveProps(){
    this.checkOverflown();
  }
  checkOverflown(){
    let element:HTMLElement = this.refs["element"] as HTMLElement;
    let overflown = element.scrollHeight > element.offsetHeight;
    if (this.state.overflown !== overflown){
      this.setState({
        overflown
      });
    }
  }
  render(){
    let Element = this.props.as;
    return <Element {...this.props} className={`${this.props.className} ${this.state.overflown ? this.props.classNameWhenOverflown : ""}`} ref="element"/>
  }
}