import equals from 'deep-equal';
import React from 'react';

//TODO this ckeditor depends externally on CKEDITOR we got to figure out a way to represent an internal dependency
//Right now it doesn't make sense to but once we get rid of all the old js code we should get rid of these
//as well as the external jquery dependency (jquery is available in npm)

export default class CKEditor extends React.Component {
  static propTypes = {
    width: PropTypes.string,
    height: PropTypes.string,
    configuration: PropTypes.object.isRequired,
    onChange: PropTypes.func.isRequired,
    children: PropTypes.string.isRequired
  }
  constructor(props){
    super(props);
    
    this.name = "ckeditor-" + (new Date()).getTime();
  }
  componentDidMount(){
    CKEDITOR.replace(this.name, this.configuration);
    CKEDITOR.instances[this.name].on('change', ()=>{
      let data = CKEDITOR.instances[this.name].getData();
      this.props.onChange(data);
    });
    CKEDITOR.instances[this.name].setData(this.props.children);
    if (this.props.width || this.props.height){
      CKEDITOR.instances[this.name].resize(this.props.width, this.props.height);
    }
  }
  componentWillReceiveProps(nextProps){
    if (nextProps.children !== this.children){
      CKEDITOR.instances[this.name].setData(nextProps.children);
    }
    
    if (nextProps.width !== this.props.width || nextProps.height !== this.props.height){
      CKEDITOR.instances[this.name].resize(nextProps.width, nextProps.height);
    } 
    
    if (process.env.NODE_ENV !== "production"){
      if (!equals(nextProps.configuration, this.props.configuration)){
        console.warn("You are attempting to change props configuration to an already created instance of ckeditor, this is a no-no, from ",
            this.props.configuration, nextProps.configuration);
      }
    }
  }
  shouldComponentUpdate(){
    //this element is managed from componentWillReceiveProps
    return false;
  }
  render(){
    return <textarea name={this.name}/>
  }
}