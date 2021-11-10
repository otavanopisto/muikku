import equals = require("deep-equal");
import * as React from 'react';
import getCKEDITOR, { CKEDITOR_VERSION } from '~/lib/ckeditor';
import * as uuid from "uuid";

//TODO this ckeditor depends externally on CKEDITOR we got to figure out a way to represent an internal dependency
//Right now it doesn't make sense to but once we get rid of all the old js code we should get rid of these
//as well as the external jquery dependency (jquery is available in npm)

const PLUGINS = {
  'widget': `//cdn.muikkuverkko.fi/libs/ckeditor-plugins/widget/${CKEDITOR_VERSION}/`,
  'lineutils': `//cdn.muikkuverkko.fi/libs/ckeditor-plugins/lineutils/${CKEDITOR_VERSION}/`,
  'filetools' : `//cdn.muikkuverkko.fi/libs/ckeditor-plugins/filetools/${CKEDITOR_VERSION}/`,
  'notification' : `//cdn.muikkuverkko.fi/libs/ckeditor-plugins/notification/${CKEDITOR_VERSION}/`,
  'notificationaggregator' : `//cdn.muikkuverkko.fi/libs/ckeditor-plugins/notificationaggregator/${CKEDITOR_VERSION}/`,
  'uploadwidget' : `//cdn.muikkuverkko.fi/libs/ckeditor-plugins/uploadwidget/${CKEDITOR_VERSION}/`,
  'uploadimage' : `//cdn.muikkuverkko.fi/libs/ckeditor-plugins/uploadimage/${CKEDITOR_VERSION}/`,
  'autogrow' : `//cdn.muikkuverkko.fi/libs/ckeditor-plugins/autogrow/${CKEDITOR_VERSION}/`,
  'divarea': `//cdn.muikkuverkko.fi/libs/ckeditor-plugins/divarea/${CKEDITOR_VERSION}/`,
  'language': `//cdn.muikkuverkko.fi/libs/ckeditor-plugins/language/${CKEDITOR_VERSION}/`,
  'image2' : `//cdn.muikkuverkko.fi/libs/ckeditor-plugins/image2/${CKEDITOR_VERSION}/`,

  'oembed' : '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/oembed/1.17/',
  'audio': '//cdn.muikkuverkko.fi/libs/ckeditor-plugins/audio/1.0.0/',

  'muikku-mathjax': (window as any).CONTEXTPATH + '/scripts/ckplugins/muikku-mathjax/',
  'muikku-fields': (window as any).CONTEXTPATH + '/scripts/ckplugins/muikku-fields/',
  'muikku-selection': (window as any).CONTEXTPATH + '/scripts/ckplugins/muikku-selection/',
  'muikku-textfield': (window as any).CONTEXTPATH + '/scripts/ckplugins/muikku-textfield/',
  'muikku-memofield': (window as any).CONTEXTPATH + '/scripts/ckplugins/muikku-memofield/',
  'muikku-filefield': (window as any).CONTEXTPATH + '/scripts/ckplugins/muikku-filefield/',
  'muikku-audiofield': (window as any).CONTEXTPATH + '/scripts/ckplugins/muikku-audiofield/',
  'muikku-connectfield': (window as any).CONTEXTPATH + '/scripts/ckplugins/muikku-connectfield/',
  'muikku-organizerfield': (window as any).CONTEXTPATH + '/scripts/ckplugins/muikku-organizerfield/',
  'muikku-sorterfield': (window as any).CONTEXTPATH + '/scripts/ckplugins/muikku-sorterfield/',
  'muikku-mathexercisefield': (window as any).CONTEXTPATH + '/scripts/ckplugins/muikku-mathexercisefield/',
  'muikku-image-details': (window as any).CONTEXTPATH + '/scripts/ckplugins/muikku-image-details/',
  'muikku-word-definition': (window as any).CONTEXTPATH + '/scripts/ckplugins/muikku-word-definition/',
  'muikku-audio-defaults': (window as any).CONTEXTPATH + '/scripts/ckplugins/muikku-audio-defaults/',
  'muikku-image-target': (window as any).CONTEXTPATH + '/scripts/ckplugins/muikku-image-target/',
  'muikku-embedded': (window as any).CONTEXTPATH + '/scripts/ckplugins/muikku-embedded/',
}
let pluginsLoaded:any = {};

interface CKEditorProps {
  configuration?: any,
  ancestorHeight? : number;
  onChange(arg: string):any,
  onDrop?():any,
  children?: string,
  autofocus?: boolean,
  editorTitle?: string,
}

interface CKEditorState {
  contentHeight: number;
}

const extraConfig = (props: CKEditorProps) => ({
  startupFocus: props.autofocus,
  title: props.editorTitle ? props.editorTitle : "",
  allowedContent: true,
  entities_latin: false,
  entities_greek: false,
  entities: false,
  format_tags: "p;h3;h4",
  toolbar: [
    { name: 'basicstyles', items: [ 'Bold', 'Italic', 'Underline', 'Strike', 'RemoveFormat' ] },
    { name: 'links', items: [ 'Link' ] },
    { name: 'insert', items: [ 'Image', 'Smiley', 'SpecialChar' ] },
    { name: 'colors', items: [ 'TextColor', 'BGColor' ] },
    { name: 'styles', items: [ 'Format' ] },
    { name: 'paragraph', items: [ 'NumberedList', 'BulletedList', 'Outdent', 'Indent', 'Blockquote', 'JustifyLeft', 'JustifyCenter', 'JustifyRight'] },
    { name: 'tools', items: [ 'Maximize' ] }
  ],
  resize_enabled: true,
  uploadUrl: "/communicatorAttachmentUploadServlet",
  extraPlugins: "widget,lineutils,filetools,notification,notificationaggregator,uploadwidget,uploadimage,divarea",
  removePlugins: 'exportpdf',
});

export default class CKEditor extends React.Component<CKEditorProps, CKEditorState> {
  private name:string;
  private currentData:string;

  private cancelChangeTrigger: boolean;
  private timeout: NodeJS.Timer;
  private timeoutProps: CKEditorProps;
  private previouslyAppliedConfig: any;

  constructor(props: CKEditorProps){
    super(props);

    this.name = "ckeditor-" + uuid.v4();
    this.currentData = props.children || "";

    //CKeditor tends to trigger change on setup for no reason at all
    //we don't expect the user to type anything at all when ckeditor is starting up
    this.cancelChangeTrigger = true;

    this.onDataChange = this.onDataChange.bind(this);
  }
  componentDidMount(){
    this.setupCKEditor();
  }
  onDataChange(props: CKEditorProps = this.props) {
    if (this.cancelChangeTrigger){
      return;
    }

    const instance = getCKEDITOR().instances[this.name];
    if (!instance) {
      return;
    }
    let data = instance.getData();
    if (data !== this.currentData){
      this.currentData = data;
      props.onChange(data);
    }
  }
  setupCKEditor(props: CKEditorProps = this.props){
    const configObj = {...extraConfig(props), ...(props.configuration || {})};
    if (!getCKEDITOR()){
      this.timeoutProps = props;
      this.timeout = setTimeout(()=>{
        this.setupCKEditor(this.timeoutProps);
      }, 10) as any;
      return;
    }

    this.timeoutProps = null;
    this.previouslyAppliedConfig = configObj;

    let allPlugins = configObj.extraPlugins.split(",");
    for (let plugin of allPlugins){
      if (!pluginsLoaded[plugin]){
        if ((PLUGINS as any)[plugin]) {
          getCKEDITOR().plugins.addExternal(plugin, (PLUGINS as any)[plugin]);
          pluginsLoaded[plugin] = true;
        }
      }
    }

    if (configObj.baseHref) {
      const base = document.getElementById("basehref") as HTMLBaseElement;
      if (base) {
        base.href = configObj.baseHref;
      } else {
        const newBase = document.createElement("base");
        newBase.id = "basehref";
        newBase.target = "_blank";
        newBase.href = configObj.baseHref;
        document.head.appendChild(newBase);
      }
    }
    getCKEDITOR().replace(this.name, configObj);
    getCKEDITOR().instances[this.name].on('change', () => {
      this.onDataChange();
    });
    getCKEDITOR().instances[this.name].on('key', ()=>{
      this.cancelChangeTrigger = false;
    })
    getCKEDITOR().instances[this.name].on('instanceReady', (ev: any)=>{
      ev.editor.document.on('drop', () => {
        this.props.onDrop && this.props.onDrop();

        // CKEditor bug, the event of dropping doesn't generate any change
        // to the get data, so I need to wait, I can't tell
        // how much time so, 1, 2, 3 seconds are a guess
        // it might misbehave
        setTimeout(this.onDataChange, 1000);
        setTimeout(this.onDataChange, 2000);
        setTimeout(this.onDataChange, 3000);
      });
      let instance = getCKEDITOR().instances[this.name];
      this.enableCancelChangeTrigger();

      // Height can be given from the ancestor or from instance container.
      // Instance container is "unstable" and changes according to the content it seems, so for example
      // material editor is given the ancestorHeight - the dialog height, which is stable.

      // We need to get .cke_top and .cke_bottom elements height, which are the editor's toolbar and footer, so we can retract those from overall height
      // Under div.cke_inner childNodes[0] is span.cke_top and childNodes[2] is span.cke_bottom
      // This should be fairly stable way to get the height of these element as the DOM seems to be steady already
      // We rely on this when we use editor parent container's height as a starting point for cke height calculations
      const ckeTopHeight = instance.container.$.querySelector(".cke_inner").childNodes[0].getBoundingClientRect().height;
      const ckeBottomHeight = instance.container.$.querySelector(".cke_inner").childNodes[2].getBoundingClientRect().height;

      // We use generic 2px all around border and that value (times 2)) has to be retracted from the height calculations also
      const ckeBorder = 4;

      // We need to retract the ckeTop and ckeBottom height form the overall cke height, if we don't then the cke container's height will be translated to
      // cke_contents element and it will cause the editor to overflow the screen in mobile views.
      const height = this.props.ancestorHeight ? this.props.ancestorHeight : instance.container.$.getBoundingClientRect().height - ckeTopHeight - ckeBottomHeight - ckeBorder;

      // CKE content-element id

      const contentElementId:string  = instance.id  + "_contents";

      // CKeditor offset from top when ancestor height is given, when there's no ancestor height provided, it is supposed no offset is needed

      let contentElementOffset:number = this.props.ancestorHeight ?  document.getElementById(contentElementId).offsetTop : 0;

      // Calculate the height

      let contentHeight:number = height - contentElementOffset;

      // Resize
      instance.resize("100%", contentHeight, true);

      instance.setData(props.children || "");

      //TODO somehow, the autofocus doesn't focus in the last row but in the first
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
    if (this.props.configuration && this.props.configuration.baseHref) {
      const base = document.getElementById("basehref") as HTMLBaseElement;
      if (base) {
        document.head.removeChild(base);
      }
    }

    if (!getCKEDITOR()){
      clearTimeout(this.timeout);
      return;
    }
    if (getCKEDITOR().instances[this.name]) {
      getCKEDITOR().instances[this.name].destroy();
    }
  }
  enableCancelChangeTrigger(){
    setTimeout(()=>{
      this.cancelChangeTrigger = false;
    }, 300);
    this.cancelChangeTrigger = true;
  }
  componentWillReceiveProps(nextProps: CKEditorProps){

    if (this.timeoutProps) {
      this.timeoutProps = nextProps;
      return;
    }

    let configObj = {...extraConfig(nextProps), ...(nextProps.configuration || {})};

    if (!equals(configObj, this.previouslyAppliedConfig)) {
      getCKEDITOR().instances[this.name].destroy();
      this.setupCKEditor(nextProps);
    } else if ((nextProps.children || "") !== this.currentData){
      this.enableCancelChangeTrigger();
      getCKEDITOR().instances[this.name].setData(nextProps.children || "");

    }
  }
  shouldComponentUpdate(){
    //this element is managed from componentWillReceiveProps
    return false;
  }
  render(){
    return <textarea className="cke" ref="ckeditor" name={this.name}/>
  }
}
