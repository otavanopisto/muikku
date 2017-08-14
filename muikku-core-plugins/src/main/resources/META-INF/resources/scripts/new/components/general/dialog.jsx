import PropTypes from 'prop-types';
import Portal from './portal.jsx';

export default class Dialog extends React.Component {
  static propTypes = {
    children: PropTypes.element.isRequired,
    title: PropTypes.string.isRequired,
    classNameExtension: PropTypes.string.isRequired,
    content: PropTypes.element.isRequired,
    footer: PropTypes.func.isRequired
  }
  constructor(props){
    super(props);
    
    this.close = this.close.bind(this);
    this.onOverlayClick = this.onOverlayClick.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.beforeClose = this.beforeClose.bind(this);
    
    this.state = {
      visible: false
    }
  }
  close(){
    this.refs.portal.closePortal();
  }
  onOverlayClick(e){
    if (e.target === e.currentTarget){
      this.close();
    }
  }
  onOpen(){
    setTimeout(()=>{
      this.setState({
        visible: true
      });
    }, 10);
  }
  beforeClose(DOMNode, removeFromDOM){
    this.setState({
      visible: false
    });
    setTimeout(removeFromDOM, 300);
  }
  render(){
    return (<Portal ref="portal" openByClickOn={this.props.children} onOpen={this.onOpen} beforeClose={this.beforeClose} closeOnEsc>
<div className={`dialog ${this.props.classNameExtension}-dialog ${this.state.visible ? "visible" : ""}`} onClick={this.onOverlayClick}>
  <div className="dialog-window">
      <div className="dialog-header">
        <div className="dialog-title">
            {this.props.title}
            <span className="dialog-close icon icon-close" onClick={this.close}></span>
        </div>
      </div>
      <div className="dialog-content">
        {this.props.content}
      </div>
      <div className="dialog-footer">
        {this.props.footer(this.close)}
      </div>
  </div>
</div>
        </Portal>);
  }
}