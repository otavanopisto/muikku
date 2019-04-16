import * as React from 'react';
import Portal from '~/components/general/portal';

import '~/sass/elements/material-editor.scss';
import { bindActionCreators } from 'redux';
import { setWorkspaceMaterialEditorState, SetWorkspaceMaterialEditorStateTriggerType, updateWorkspaceMaterialContentNode, UpdateWorkspaceMaterialContentNodeTriggerType } from '~/actions/workspaces';
import { connect, Dispatch } from 'react-redux';
import { StateType } from '~/reducers';
import { i18nType } from '~/reducers/base/i18n';
import { WorkspaceMaterialEditorType, WorkspaceType, MaterialContentNodeType } from "~/reducers/workspaces";
import Button, { ButtonPill } from '~/components/general/button';
import CKEditor from '~/components/general/ckeditor';
import { StatusType } from '~/reducers/base/status';
import { LocaleListType } from '~/reducers/base/locales';
import DeleteWorkspaceMaterialDialog from "./delete-dialog";
import Dropdown from "~/components/general/dropdown"; 

interface MaterialEditorProps {
  setWorkspaceMaterialEditorState: SetWorkspaceMaterialEditorStateTriggerType,
  i18n: i18nType,
  status: StatusType,
  editorState: WorkspaceMaterialEditorType,
  locale: LocaleListType,
  updateWorkspaceMaterialContentNode: UpdateWorkspaceMaterialContentNodeTriggerType
}

interface MaterialEditorState {
}4

const CKEditorConfig = (
    locale: string,
    contextPath: string,
    workspace: WorkspaceType,
    materialNode: MaterialContentNodeType,
    disablePlugins: boolean,
) => ({
  uploadUrl: `/materialAttachmentUploadServlet/workspace/${workspace.urlName}/${materialNode.path}`,
  autoGrowOnStartup : true,
  autoGrow_minHeight: 400,
  linkShowTargetTab: true,
  allowedContent: true, // disable content filtering to preserve all formatting of imported documents; fix for #263
  entities: false,
  entities_latin: false,
  entities_greek: false,
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
  extraPlugins: disablePlugins ? 'oembed,muikku-embedded,muikku-image-details,muikku-word-definition,muikku-audio-defaults,muikku-image-target,autogrow,widget,lineutils,filetools,uploadwidget,uploadimage,divarea' :
    "oembed,audio,divarea,image2,muikku-fields,muikku-textfield,muikku-memofield,muikku-filefield,muikku-audiofield,muikku-selection,muikku-connectfield,muikku-organizerfield,muikku-sorterfield,muikku-mathexercisefield,muikku-embedded,muikku-image-details,muikku-word-definition,muikku-audio-defaults,muikku-image-target,muikku-mathjax,autogrow,uploadimage",
});

// First we need to modify the material content nodes endpoint to be able to receive hidden
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
      let materialPageType = this.props.editorState.currentNodeValue.assignmentType ? (this.props.editorState.currentNodeValue.assignmentType === "EXERCISE" ? "exercise" : "assignment") : "textual";
      let assignmentPageType = "material-editor-" + materialPageType;
      
      return <div className={`material-editor ${this.props.editorState.opened ? "material-editor--visible" : ""}`}>
        <div className="material-editor__header">
          <ButtonPill buttonModifiers="material-page-close-editor" onClick={this.close} icon="close"/>
          <div className="material-editor__tabs-container">
            <div className="material-editor__tabs-item active">{this.props.i18n.text.get("plugin.workspace.materialsManagement.editorView.tabs.label.content")}</div>
            {this.props.editorState.canSetLicense ? <div className="material-editor__tabs-item">{this.props.i18n.text.get("plugin.workspace.materialsManagement.editorView.tabs.label.license")}</div> : null}
            {this.props.editorState.canSetProducers ? <div className="material-editor__tabs-item">{this.props.i18n.text.get("plugin.workspace.materialsManagement.editorView.tabs.label.producers")}</div> : null}
            {this.props.editorState.canAddAttachments ? <div className="material-editor__tabs-item">{this.props.i18n.text.get("plugin.workspace.materialsManagement.editorView.tabs.label.attachments")}</div> : null}
          </div>
        </div>

        <div className="material-editor__buttonset">
          {this.props.editorState.canPublish ? <Dropdown openByHover modifier="material-page-management-tooltip" content={this.props.i18n.text.get("plugin.workspace.materialsManagement.materialEditTooltip")}>
            <ButtonPill buttonModifiers={["material-editor-publish-page","material-editor", "disabled"]} icon="publish"/>
          </Dropdown> : null}
          {this.props.editorState.canPublish ? <Dropdown openByHover modifier="material-page-management-tooltip" content={this.props.i18n.text.get("plugin.workspace.materialsManagement.materialRevertToPublishedTooltip")}>
            <ButtonPill buttonModifiers={["material-editor-revert-page","material-editor", "disabled"]} icon="revert"/>
          </Dropdown> : null}
          {this.props.editorState.canHide ? <Dropdown openByHover modifier="material-page-management-tooltip" content={this.props.i18n.text.get("plugin.workspace.materialsManagement.materialHideTooltip")}>
            <ButtonPill buttonModifiers={["material-editor-show-hide-page","material-editor"]} onClick={this.toggleHiddenStatus} icon={this.props.editorState.currentNodeValue.hidden ? "show" : "hide"}/>
          </Dropdown> : null}
          {this.props.editorState.canRestrictView ? <Dropdown openByHover modifier="material-page-management-tooltip" content={this.props.i18n.text.get("plugin.workspace.materialsManagement.materialViewRestrictionTooltip")}>
              <ButtonPill buttonModifiers={["material-editor-restrict-page","material-editor"]} icon="closed-material"/>
            </Dropdown> : null}
            {this.props.editorState.canChangePageType ? <Dropdown openByHover modifier="material-page-management-tooltip" content={this.props.i18n.text.get("plugin.workspace.materialsManagement.materialChangeAssesmentTypeTooltip")}>
              <ButtonPill buttonModifiers={["material-editor-change-page-type","material-editor",assignmentPageType]} icon="assignment"/>
            </Dropdown> : null}
            {this.props.editorState.canChangeExerciseType && this.props.editorState.currentNodeValue.assignmentType === "EXERCISE" ? <Dropdown openByHover modifier="material-page-management-tooltip" content={this.props.i18n.text.get("plugin.workspace.materialsManagement.materialShowAlwaysCorrectAnswersTooltip")}>
              <ButtonPill buttonModifiers={["material-editor-change-answer-reveal-type","material-editor"]} icon="correct-answers"/>
            </Dropdown> : null}
          {this.props.editorState.canDelete ? <DeleteWorkspaceMaterialDialog isSection={this.props.editorState.section} material={this.props.editorState.currentNodeValue}>
            <Dropdown openByHover modifier="material-page-management-tooltip" content={this.props.i18n.text.get("plugin.workspace.materialsManagement.materialDeleteTooltip")}>
              <ButtonPill buttonModifiers={["material-editor-delete-page","material-editor"]} icon="delete" onClick={this.delete}/>
            </Dropdown>
          </DeleteWorkspaceMaterialDialog> : null}
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
                this.props.editorState.currentNodeValue,
                this.props.editorState.disablePlugins,
              )} onChange={this.updateContent}>
              {this.props.editorState.currentNodeValue.html}
            </CKEditor>
          </div> : null}
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