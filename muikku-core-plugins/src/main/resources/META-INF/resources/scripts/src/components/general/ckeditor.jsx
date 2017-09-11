import equals from 'deep-equal';
import PropTypes from 'prop-types';
import React from 'react';

//TODO this ckeditor depends externally on CKEDITOR we got to figure out a way to represent an internal dependency
//Right now it doesn't make sense to but once we get rid of all the old js code we should get rid of these
//as well as the external jquery dependency (jquery is available in npm)

export default class CKEditor extends React.Component {
  static propTypes = {
    configuration: PropTypes.object,
    extraPlugins: PropTypes.object,
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    onChange: PropTypes.func.isRequired,
    children: PropTypes.string.isRequired
  }
  constructor(props){
    super(props);
    
    this.name = "ckeditor-" + (new Date()).getTime();
    this.currentData = props.children;
    this.resize = this.resize.bind(this);
    
    this.width = null;
    this.height = null;
  }
  resize(width, height){
    let actualHeight = height;
    if (height === "grow"){
      let computedStyle = getComputedStyle(this.refs.ckeditor.parentNode, null);
      actualHeight = parseInt(computedStyle.getPropertyValue("height")) -
          parseInt(computedStyle.getPropertyValue("padding-top")) -
          parseInt(computedStyle.getPropertyValue("padding-top"));
      
      for (let node of Array.from(this.refs.ckeditor.parentNode.childNodes)){
        if (node === this.refs.ckeditor || node.id === ("cke_" + this.name)){
          continue;
        }
        
        let nComputedStyle = getComputedStyle(node, null);
        actualHeight -= parseInt(nComputedStyle.getPropertyValue("height")) +
          parseInt(nComputedStyle.getPropertyValue("margin-top")) +
          parseInt(nComputedStyle.getPropertyValue("margin-bottom"));
      }
    }
    
    if (actualHeight !== this.height || this.width !== width){
      CKEDITOR.instances[this.name].resize(width, actualHeight);
    }
    
    this.width = width;
    this.height = actualHeight;
  }
  componentDidMount(){
    let extraConfig = {
      height: 0
    };
    if (this.props.extraPlugins){
      for (let [plugin, url] of Object.entries(this.props.extraPlugins)){
        CKEDITOR.plugins.addExternal(plugin, url);
      }
      extraConfig.extraPlugins = Object.keys(this.props.extraPlugins).join(',');
    }
    CKEDITOR.replace(this.name, Object.assign(extraConfig, this.props.configuration));
    CKEDITOR.instances[this.name].on('change', ()=>{
      let data = CKEDITOR.instances[this.name].getData();
      this.currentData = data;
      this.props.onChange(data);
    });
    CKEDITOR.instances[this.name].on('instanceReady', ()=>{
      CKEDITOR.instances[this.name].setData(this.props.children);
      if (typeof this.props.width !== "undefined" || typeof this.props.height !== "undefined"){
        this.resize(this.props.width, this.props.height);
      }
    });
  }
  componentWillUnmount(){
    CKEDITOR.instances[this.name].destroy();
  }
  componentWillReceiveProps(nextProps){
    if (!equals(nextProps.configuration, this.props.configuration)){
      CKEDITOR.replace(this.name, this.props.configuration)
    }
    
    if (nextProps.children !== this.currentData){
      CKEDITOR.instances[this.name].setData(nextProps.children);
    }
    
    if (nextProps.children !== this.currentData){
      CKEDITOR.instances[this.name].setData(nextProps.children);
    }
    
    if (nextProps.width !== this.props.width || nextProps.height !== this.props.height){
      this.resize(nextProps.width, nextProps.height);
    }
  }
  shouldComponentUpdate(){
    //this element is managed from componentWillReceiveProps
    return false;
  }
  render(){
    return <textarea ref="ckeditor" name={this.name}/>
  }
}