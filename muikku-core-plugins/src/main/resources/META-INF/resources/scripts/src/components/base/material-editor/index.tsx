import * as React from 'react';
import Portal from '~/components/general/portal';

import '~/sass/elements/material-editor.scss';
import { bindActionCreators } from 'redux';
import { setWorkspaceMaterialEditorState, SetWorkspaceMaterialEditorStateTriggerType, updateWorkspaceMaterialContentNode, UpdateWorkspaceMaterialContentNodeTriggerType } from '~/actions/workspaces';
import { connect, Dispatch } from 'react-redux';
import { StateType } from '~/reducers';
import { i18nType } from '~/reducers/base/i18n';
import { WorkspaceMaterialEditorType, WorkspaceType, MaterialContentNodeType } from "~/reducers/workspaces";
import { ButtonPill } from '~/components/general/button';
import CKEditor from '~/components/general/ckeditor';
import { StatusType } from '~/reducers/base/status';
import { LocaleListType } from '~/reducers/base/locales';
import DeleteWorkspaceMaterialDialog from "./delete-dialog";

interface MaterialEditorProps {
  setWorkspaceMaterialEditorState: SetWorkspaceMaterialEditorStateTriggerType,
  i18n: i18nType,
  status: StatusType,
  editorState: WorkspaceMaterialEditorType,
  locale: LocaleListType,
  updateWorkspaceMaterialContentNode: UpdateWorkspaceMaterialContentNodeTriggerType
}

interface MaterialEditorState {
}

const CKEditorConfig = (
    locale: string,
    contextPath: string,
    workspace: WorkspaceType,
    materialNode: MaterialContentNodeType
) => ({
  uploadUrl: `/materialAttachmentUploadServlet/workspace/${workspace.urlName}/${materialNode.path}`,
  autoGrowOnStartup : true,
  autoGrow_minHeight: 400,
  linkShowTargetTab: true,
  allowedContent: true, // disable content filtering to preserve all formatting of imported documents; fix for #263
  entities: false,
  entities_latin: false,
  entities_greek: false,
  skin : 'moono',
  height : 500,
  language: locale,
  stylesSet : 'workspace-material-styles:' + contextPath + '/scripts/ckplugins/styles/workspace-material-styles.js',
  contentsCss : contextPath +  '/css/deprecated/custom-ckeditor-contentcss.css',
  format_tags : 'p;h3;h4',
  baseHref: `workspace/${workspace.urlName}/${materialNode.path}/`, 
  mathJaxLib: '//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.1/MathJax.js?config=TeX-MML-AM_HTMLorMML',
  toolbar: [
    { name: 'document', items : [ 'Source' ] },
    { name: 'clipboard', items : [ 'Cut','Copy','Paste','PasteText','PasteFromWord','-','Undo','Redo' ] },
    { name: 'editing', items: [ 'Find', 'Replace', '-', 'SelectAll', '-', 'Scayt' ] },
    { name: 'basicstyles', items : [ 'Bold','Italic','Underline','Strike','Subscript','Superscript','-','RemoveFormat' ] },
    '/',
    { name: 'styles', items : [ 'Styles','Format' ] },
    { name: 'insert', items : [ 'Image','Audio','oembed','Muikku-mathjax','Table','Iframe','SpecialChar', 'CreateDiv' ] },
    { name: 'links', items : [ 'Link','Unlink','Anchor' ] },
    { name: 'colors', items : [ 'TextColor','BGColor' ] },
    '/',
    { name: 'forms', items : ['MuikkuTextField', 'muikku-selection', 'MuikkuMemoField', 'muikku-filefield', 'muikku-audiofield', 'muikku-connectfield', 'muikku-organizerfield', 'muikku-sorterfield', 'muikku-mathexercisefield']},
    { name: 'paragraph', items : [ 'NumberedList','BulletedList','-','Outdent','Indent','-','JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','-','BidiLtr','BidiRtl' ] },          
    { name: 'tools', items : [ 'Maximize', 'ShowBlocks','-','About'] }
  ],
  extraPlugins: "oembed,audio,divarea,image2,muikku-fields,muikku-textfield,muikku-memofield,muikku-filefield,muikku-audiofield,muikku-selection,muikku-connectfield,muikku-organizerfield,muikku-sorterfield,muikku-mathexercisefield,muikku-embedded,muikku-image-details,muikku-word-definition,muikku-audio-defaults,muikku-image-target,muikku-mathjax,autogrow,uploadimage",
  //extraPlugins: 'oembed,audio,image2,muikku-embedded,muikku-image-details,muikku-word-definition,muikku-audio-defaults,muikku-image-target,autogrow,uploadimage'
  //extraPlugins: 'widget,lineutils,filetools,notification,notificationaggregator,uploadwidget,uploadimage,divarea,image2,oembed,audio,muikku-embedded,muikku-image-details,muikku-word-definition,muikku-audio-defaults,muikku-image-target'
});

// First we need to modify the material content nodes endpoint to be able to recieve hidden
// nodes, we need those to be able to modify here
class MaterialEditor extends React.Component<MaterialEditorProps, MaterialEditorState> {
  private oldOverflow:string;

  constructor(props: MaterialEditorProps){
    super(props);

    this.toggleHiddenStatus = this.toggleHiddenStatus.bind(this);
    this.delete = this.delete.bind(this);
    this.updateContent = this.updateContent.bind(this);
    this.updateTitle = this.updateTitle.bind(this);
    this.close = this.close.bind(this);
  }
  
  toggleHiddenStatus() {
    // TODO same we need an endpoint for this
    
    this.props.updateWorkspaceMaterialContentNode(this.props.editorState.currentNodeValue, {
      hidden: !this.props.editorState.currentNodeValue.hidden,
    });
  }
  
  delete() {
    // TODO not sure what to do here
  }
  
  updateTitle(e: React.ChangeEvent<HTMLInputElement>) {
    // TODO, the current endpoint currently doesn't work
    // we need an unified endpoint that would take any
    // content node the other one is controlled by the
    // collaboration plugin
    // all this function does is to update the title but
    // does not do anything to the server
    
    // there's a functional endpoint right now for normal
    // chapters but we need an unified one
    
    this.props.updateWorkspaceMaterialContentNode(this.props.editorState.currentNodeValue, {
      title: e.target.value,
    });
  }
  
  updateContent(content: string) {
    // TODO content update plugin is all
    // going through the collaboration plugin
    // this cannot be achieved until that is modified
    // got to wait
    
    this.props.updateWorkspaceMaterialContentNode(this.props.editorState.currentNodeValue, {
      html: content,
    });
  }
  
  close() {
    this.props.setWorkspaceMaterialEditorState({
      ...this.props.editorState,
      opened: false
    });
  }

  render(){
    if (!this.props.editorState || !this.props.editorState.currentNodeValue) {
      return <div className={`material-editor ${this.props.editorState.opened ? "material-editor--visible" : ""}`}/>
    }
      return <div className={`material-editor ${this.props.editorState.opened ? "material-editor--visible" : ""}`}>
        <div className="material-editor__header">
          <ButtonPill buttonModifiers="material-page-close-editor" onClick={this.close} icon="close"/>
          <div className="material-editor__tabs-container">
            <div className="material-editor__tabs-item active">Sisältö</div>
            <div className="material-editor__tabs-item">Lisenssi</div>
            <div className="material-editor__tabs-item">Tuottajat</div>
            <div className="material-editor__tabs-item">Liitetiedostot</div>
          </div>
        </div>

        <div className="material-editor__content-wrapper">
          <div className="material-editor__title-container">
            <input className="material-editor__title" onChange={this.updateTitle} value={this.props.editorState.currentNodeValue.title}></input>
          </div>
          {!this.props.editorState.section ? <div className="material-editor__editor-container">
            <CKEditor configuration={CKEditorConfig(
                this.props.locale.current,
                this.props.status.contextPath,
                this.props.editorState.workspace,
                this.props.editorState.currentNodeValue
              )} onChange={this.updateContent}>
              {this.props.editorState.currentNodeValue.html}
            </CKEditor>
          </div> : null}
        </div>

        <div className="materia-editor__buttonset">
          <DeleteWorkspaceMaterialDialog isSection={this.props.editorState.section} material={this.props.editorState.currentNodeValue}>
            <ButtonPill onClick={this.delete} icon="delete"/>
          </DeleteWorkspaceMaterialDialog>
          <ButtonPill onClick={this.toggleHiddenStatus} icon={this.props.editorState.currentNodeValue.hidden ? "show" : "hide"}/>
        </div>
     </div>
  }
}
  
function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    editorState: state.workspaces.materialEditor,
    status: state.status,
    locale: state.locales,
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return bindActionCreators({setWorkspaceMaterialEditorState, updateWorkspaceMaterialContentNode}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MaterialEditor);