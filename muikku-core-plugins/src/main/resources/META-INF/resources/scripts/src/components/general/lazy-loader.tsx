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

(window as any).TOGGLE_LAZY = () => {
  window.dispatchEvent(new Event("TOGGLE_LAZY"));
}

export default class LazyLoader extends React.Component<LazyLoaderProps, LazyLoaderState>{
  private hasBeenForcefullyToggled: boolean = false;

  constructor(props: LazyLoaderProps){
    super(props);

    this.state = {
      loaded: false
    }

    this.onScroll = this.onScroll.bind(this);
    this.toggleLazy = this.toggleLazy.bind(this);
  }
  componentDidMount(){
    this.checkWhetherInView();
    window.addEventListener('scroll', this.onScroll);
    window.addEventListener("TOGGLE_LAZY", this.toggleLazy);
  }
  toggleLazy() {
    this.hasBeenForcefullyToggled = true;
    this.setState({
      loaded: !this.state.loaded,
    });
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
    if (this.hasBeenForcefullyToggled) {
      return;
    }
    this.checkWhetherInView();
  }
  componentWillUnmount(){
    window.removeEventListener('scroll', this.onScroll);
    window.removeEventListener("TOGGLE_LAZY", this.toggleLazy);
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
