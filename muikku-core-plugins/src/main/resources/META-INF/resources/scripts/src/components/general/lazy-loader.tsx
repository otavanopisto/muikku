import * as React from 'react';

interface LazyLoaderProps {
  className: string,
  width?: string | number,
  height?: string | number,
  useChildrenAsLazy?: boolean,
  children?: any,
}

interface LazyLoaderState {
  loaded: boolean
}

export default class LazyLoader extends React.Component<LazyLoaderProps, LazyLoaderState>{
  constructor(props: LazyLoaderProps){
    super(props);
    
    this.state = {
      loaded: false
    }
    
    this.onScroll = this.onScroll.bind(this);
  }
  componentDidMount(){
    this.checkWhetherInView();
    window.addEventListener('scroll', this.onScroll);
  }
  componentDidUpdate(){
    this.checkWhetherInView();
  }
  componentWillReceiveProps(){
    this.checkWhetherInView();
  }
  checkWhetherInView(){
    if (this.state.loaded){
      return;
    }
    
    let el:HTMLDivElement = this.refs["lazycomponent"] as HTMLDivElement;
    
    let rect = el.getBoundingClientRect();
    let elemTop = rect.top;
    let elemBottom = rect.bottom;
    
    let isVisible = elemTop < window.innerHeight && elemBottom >= 0;
    
    if (isVisible){
      this.setState({
        loaded: true
      });
    }
  }
  onScroll(){
    this.checkWhetherInView();
  }
  componentWillUnmount(){
    window.removeEventListener('scroll', this.onScroll);
  }
  render(){
    if (this.state.loaded){
      if (this.props.useChildrenAsLazy) {
        return this.props.children(true);
      }
      return this.props.children;
    }
    return <div ref="lazycomponent" data-lazycomponent="true"
      className={this.props.className} style={{width: this.props.width, height: this.props.height}}>
      {this.props.useChildrenAsLazy ? this.props.children(false) : null}
    </div>
  }
}