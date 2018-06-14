import equals = require("deep-equal");
import * as React from 'react';
import getCKEDITOR from '~/lib/ckeditor';
import $ from '~/lib/jquery';

//TODO this ckeditor depends externally on CKEDITOR we got to figure out a way to represent an internal dependency
//Right now it doesn't make sense to but once we get rid of all the old js code we should get rid of these
//as well as the external jquery dependency (jquery is available in npm)

interface CKEditorProps {
  configuration: any,
  extraPlugins: {
    [plugin: string] : string
  },
  width?: number | string,
  height?: number | string,
  onChange(arg: string):any,
  children?: string,
  autofocus?: boolean,
  growReference?: string
}

interface CKEditorState {
  
}

export default class CKEditor extends React.Component<CKEditorProps, CKEditorState> {
  private name:string;
  private currentData:string;
  private width: number | string;
  private height: number | string;
  private cancelNextChangeTrigger: boolean;
  
  constructor(props: CKEditorProps){
    super(props);
    
    this.name = "ckeditor-" + (new Date()).getTime();
    this.currentData = props.children;
    this.resize = this.resize.bind(this);
    
    this.width = null;
    this.height = null;
    
    this.cancelNextChangeTrigger = false;
  }
  resize(width: number | string, height: number | string){
    let actualHeight:number | string;
    if (height === "grow"){
      let computedStyle = getComputedStyle(getCKEDITOR().instances[this.name].container.$, null);
      let ckeditorHeight = parseInt(computedStyle.getPropertyValue("height")) -
          parseInt(computedStyle.getPropertyValue("padding-top")) -
          parseInt(computedStyle.getPropertyValue("padding-top"));
      
      let growReference:HTMLElement = $(this.refs["ckeditor"]).closest(this.props.growReference)[0];
      let wholeHeight = growReference.offsetHeight;
      let remainingHeight = wholeHeight;
      Array.from(growReference.childNodes).forEach((node: HTMLElement)=>{
        let nComputedStyle = getComputedStyle(node, null);
        remainingHeight -= parseInt(nComputedStyle.getPropertyValue("height")) +
          parseInt(nComputedStyle.getPropertyValue("margin-top")) +
          parseInt(nComputedStyle.getPropertyValue("margin-bottom"));
      });
      
      actualHeight = remainingHeight + ckeditorHeight - 9;
    } else {
      actualHeight = height;
    }
    
    if (actualHeight !== this.height || this.width !== width){
      getCKEDITOR().instances[this.name].resize(width, actualHeight);
    }
    
    this.width = width;
    this.height = actualHeight;
  }
  componentDidMount(){
    let extraConfig: any = {
      height: 0,
      startupFocus: this.props.autofocus,
      allowedContent: true,
      entities_latin: false,
      entities_greek: false,
      entities: false,
      basicEntities: false
    };
    if (this.props.extraPlugins){
      for (let [plugin, url] of (Object as any).entries(this.props.extraPlugins)){
        getCKEDITOR().plugins.addExternal(plugin, url);
      }
      extraConfig.extraPlugins = Object.keys(this.props.extraPlugins).join(',');
    }
    getCKEDITOR().replace(this.name, Object.assign(extraConfig, {...this.props.configuration, 
      contentsCss: (window as any).CONTEXTPATH + "/javax.faces.resource/scripts/dist/rich-text.css.jsf"}));
    getCKEDITOR().instances[this.name].on('change', ()=>{
      if (this.cancelNextChangeTrigger){
        this.cancelNextChangeTrigger = false;
        return;
      }
      let data = getCKEDITOR().instances[this.name].getData();
      if (data !== this.currentData){
        let avoidChange = false;
        if (data[data.length - 1] === "\n" && data.substr(0, data.length - 1) === this.currentData){
          avoidChange = true;
        } else if (this.currentData[this.currentData.length - 1] === "\n" && this.currentData.substr(0, this.currentData.length - 1) === data){
          avoidChange = true
        }
        this.currentData = data;
        if (!avoidChange){
          if (data[data.length - 1] !== '\n'){
            this.props.onChange(data);
          } else {
            this.props.onChange(data.substr(0, data.length - 1));
          }
        }
      }
    });
    getCKEDITOR().instances[this.name].on('instanceReady', ()=>{
      let instance = getCKEDITOR().instances[this.name];
      instance.setData(this.props.children);
      if (typeof this.props.width !== "undefined" || typeof this.props.height !== "undefined"){
        this.resize(this.props.width, this.props.height);
      }
      
      //TODO somehow, the freaking autofocus doesn't focus in the last row but in the first
      //Ckeditor hasn't implemented the feature, it must be hacked in, somehow
    });
  }
  componentWillUnmount(){
    getCKEDITOR().instances[this.name].destroy();
  }
  componentWillReceiveProps(nextProps: CKEditorProps){
//    if (!equals(nextProps.configuration, this.props.configuration)){
//      getCKEDITOR().replace(this.name, {...this.props.configuration,
//        contentCss: (window as any).CONTEXTPATH + "/javax.faces.resource/scripts/dist/rich-text.css.jsf"})
//    }    
    if (nextProps.children !== this.currentData){
      if (!((nextProps.children[nextProps.children.length - 1] === "\n" && nextProps.children.substr(0, nextProps.children.length - 1) === this.currentData) ||
          (this.currentData[this.currentData.length - 1] === "\n" && this.currentData.substr(0, this.currentData.length - 1) === nextProps.children))){
        this.cancelNextChangeTrigger = true;
        getCKEDITOR().instances[this.name].setData(nextProps.children);
      }
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