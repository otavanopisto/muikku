import * as React from 'react';

export default class FieldBase<T, S> extends React.Component<T, S>{
  public loaded: boolean;
  constructor(props: T){
    super(props);
    
    //TODO enable
    //this.loaded = false;
    this.loaded = true;
    this.onScroll = this.onScroll.bind(this);
  }
  componentDidMount(){
    this.checkWhetherInView();
    window.addEventListener('scroll', this.onScroll);
  }
  componentDidUpdate(prevProps: T, prevState: S){
    this.checkWhetherInView();
  }
  componentWillReceiveProps(nextProps: T){
    this.checkWhetherInView();
  }
  checkWhetherInView(){
    //TODO remove this
    return;
    
//    if (this.loaded){
//      return;
//    }
//    
//    let el:HTMLDivElement = this.refs["base"] || this.refs["base"].getBase() as HTMLElement;
//    
//    let rect = el.getBoundingClientRect();
//    let elemTop = rect.top;
//    let elemBottom = rect.bottom;
//    
//    let isVisible = elemTop < window.innerHeight && elemBottom >= 0;
//    
//    if (isVisible){
//      this.loaded = true;
//      this.forceUpdate();
//    }
  }
  onScroll(){
    this.checkWhetherInView();
  }
  componentWillUnmount(){
    window.removeEventListener('scroll', this.onScroll);
  }
}