import equals = require("deep-equal");
import * as React from 'react';
import getCKEDITOR, { CKEDITOR_VERSION } from '~/lib/ckeditor';
import $ from '~/lib/jquery';

//TODO this ckeditor depends externally on CKEDITOR we got to figure out a way to represent an internal dependency
//Right now it doesn't make sense to but once we get rid of all the old js code we should get rid of these
//as well as the external jquery dependency (jquery is available in npm)

const PLUGINS = {
  'widget': `//cdn.muikkuverkko.fi/libs/ckeditor-plugins/widget/${CKEDITOR_VERSION}/`,
  'lineutils': `//cdn.muikkuverkko.fi/libs/ckeditor-plugins/lineutils/${CKEDITOR_VERSION}/`,
  'filetools' : `//cdn.muikkuverkko.fi/libs/ckeditor-plugins/filetools/${CKEDITOR_VERSION}/`,
  'notification' : `//cdn.muikkuverkko.fi/libs/ckeditor-plugins/notification/${CKEDITOR_VERSION}/`,
  'notificationaggregator' : `//cdn.muikkuverkko.fi/libs/ckeditor-plugins/notificationaggregator/${CKEDITOR_VERSION}/`,
  'change' : '//cdn.muikkuverkko.fi/libs/coops-ckplugins/change/0.1.2/plugin.min.js',
  'uploadwidget' : `//cdn.muikkuverkko.fi/libs/ckeditor-plugins/uploadwidget/${CKEDITOR_VERSION}/`,
  'uploadimage' : `//cdn.muikkuverkko.fi/libs/ckeditor-plugins/uploadimage/${CKEDITOR_VERSION}/`,
  'autogrow' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/autogrow/4.5.8/plugin.js',
  'muikku-mathjax': (window as any).CONTEXTPATH + '/scripts/ckplugins/muikku-mathjax/',
  'divarea': '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/divarea/4.11.3/plugin.js'
}
let pluginsLoaded:any = {};

interface CKEditorProps {
  configuration?: any,
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
      basicEntities: false,
      toolbar: [
        { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat' ] },
        { name: 'links', items: [ 'Link' ] },
        { name: 'insert', items: [ 'Image', 'Smiley', 'SpecialChar' ] },
        { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
        { name: 'styles', items: [ 'Format' ] },
        { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', 'Outdent', 'Indent', 'Blockquote', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
        { name: 'tools', items: [ 'Maximize' ] }
      ],
      resize_enabled: false,
      uploadUrl: '/communicatorAttachmentUploadServlet',
      extraPlugins: 'widget,lineutils,filetools,notification,notificationaggregator,change,uploadwidget,uploadimage,divarea'
    };
    
    let configObj = {...extraConfig, ...(this.props.configuration || {})};
    
    let allPlugins = configObj.extraPlugins.split(",");
    for (let plugin of allPlugins){
      if (!pluginsLoaded[plugin]){
        getCKEDITOR().plugins.addExternal(plugin, (PLUGINS as any)[plugin]);
        pluginsLoaded[plugin] = true;
      }
    }
    
    getCKEDITOR().replace(this.name, configObj);
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
