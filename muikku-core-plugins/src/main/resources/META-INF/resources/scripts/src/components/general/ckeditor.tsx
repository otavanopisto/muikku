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
  autofocus?: boolean
}

interface CKEditorState {
  
}

export default class CKEditor extends React.Component<CKEditorProps, CKEditorState> {
  private name:string;
  private currentData:string;
  private width: number | string;
  private height: number | string;
  private cancelChangeTrigger: boolean;
  private timeout: NodeJS.Timer;
  
  constructor(props: CKEditorProps){
    super(props);
    
    this.name = "ckeditor-" + (new Date()).getTime();
    this.currentData = props.children;
    this.resize = this.resize.bind(this);
    
    this.width = null;
    this.height = null;
    
    //CKeditor tends to trigger change on setup for no reason at all
    //we don't expect the user to type anything at all when ckeditor is starting up
    this.cancelChangeTrigger = true;
  }
  resize(width: number | string, height: number | string){
    getCKEDITOR().instances[this.name].resize(width, height);
    
    this.width = width;
    this.height = height;
  }
  componentDidMount(){
    this.setupCKEditor();
  }
  setupCKEditor(){
    if (!getCKEDITOR()){
      this.timeout = setTimeout(()=>{
        this.setupCKEditor();
      }, 10);
      return;
    }
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
        if (this.cancelChangeTrigger){
          return;
        }
        
        let data = getCKEDITOR().instances[this.name].getData();
        if (data !== this.currentData){
          this.currentData = data;
          this.props.onChange(data);
        }
      });
      getCKEDITOR().instances[this.name].on('key', ()=>{
        this.cancelChangeTrigger = false;
      })
      getCKEDITOR().instances[this.name].on('instanceReady', ()=>{
        let instance = getCKEDITOR().instances[this.name];
        this.enableCancelChangeTrigger();
        instance.setData(this.props.children);
        if (typeof this.props.width !== "undefined" || typeof this.props.height !== "undefined"){
          this.resize(this.props.width, this.props.height);
        }
        
        //TODO somehow, the freaking autofocus doesn't focus in the last row but in the first
        //Ckeditor hasn't implemented the feature, it must be hacked in, somehow
      });
  }
  updateCKEditor(data: string){
    if (!getCKEDITOR()){
      return;
    }
    getCKEDITOR().instances[this.name].setData(data);
  }
  componentWillUnmount(){
    if (!getCKEDITOR()){
      clearTimeout(this.timeout);
      return;
    }
    getCKEDITOR().instances[this.name].destroy();
  }
  enableCancelChangeTrigger(){
    setTimeout(()=>{
      this.cancelChangeTrigger = false;
    }, 300);
    this.cancelChangeTrigger = true;
  }
  componentWillReceiveProps(nextProps: CKEditorProps){
    if (nextProps.children !== this.currentData){
      this.enableCancelChangeTrigger();
      getCKEDITOR().instances[this.name].setData(nextProps.children);
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
