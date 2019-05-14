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
import ConfirmPublishPageWithAnswersDialog from "./confirm-publish-page-with-answers-dialog";
import ConfirmRemovePageWithAnswersDialog from "./confirm-remove-page-with-answers-dialog";

import equals = require("deep-equal");
import Tabs from '~/components/general/tabs';

interface MaterialEditorProps {
  setWorkspaceMaterialEditorState: SetWorkspaceMaterialEditorStateTriggerType,
  i18n: i18nType,
  status: StatusType,
  editorState: WorkspaceMaterialEditorType,
  locale: LocaleListType,
  updateWorkspaceMaterialContentNode: UpdateWorkspaceMaterialContentNodeTriggerType
}

interface MaterialEditorState {
  tab: string;
  producerEntryName: string;
}

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
    this.updateContent = this.updateContent.bind(this);
    this.updateTitle = this.updateTitle.bind(this);
    this.close = this.close.bind(this);
    this.publish = this.publish.bind(this);
    this.revert = this.revert.bind(this);
    this.changeTab = this.changeTab.bind(this);
    this.removeProducer = this.removeProducer.bind(this);
    this.addProducer = this.addProducer.bind(this);
    this.updateProducerEntryName = this.updateProducerEntryName.bind(this);
    
    this.state = {
      tab: "content",
      producerEntryName: "",
    }
  }
  
  changeTab(tab: string) {
    this.setState({tab});
  }
  
  toggleHiddenStatus() {
    // TODO same we need an endpoint for this
    
    this.props.updateWorkspaceMaterialContentNode({
      workspace: this.props.editorState.currentNodeWorkspace,
      material: this.props.editorState.currentDraftNodeValue,
      update: {
        hidden: !this.props.editorState.currentDraftNodeValue.hidden,
      },
      isDraft: true
    });
  }
  
  updateTitle(e: React.ChangeEvent<HTMLInputElement>) {
    this.props.updateWorkspaceMaterialContentNode({
      workspace: this.props.editorState.currentNodeWorkspace,
      material: this.props.editorState.currentDraftNodeValue,
      update: {
        title: e.target.value,
      },
      isDraft: true,
    });
  }
  
  updateContent(content: string) {
    // TODO content update plugin is all
    // going through the collaboration plugin
    // this cannot be achieved until that is modified
    // got to wait
    
    this.props.updateWorkspaceMaterialContentNode({
      workspace: this.props.editorState.currentNodeWorkspace,
      material: this.props.editorState.currentDraftNodeValue,
      update: {
        html: content,
      },
      isDraft: true,
    });
  }
  
  close() {
    this.props.setWorkspaceMaterialEditorState({
      ...this.props.editorState,
      opened: false
    });
    this.setState({
      tab: "content",
      producerEntryName: "",
    })
  }
  
  publish() {
    this.props.updateWorkspaceMaterialContentNode({
      workspace: this.props.editorState.currentNodeWorkspace,
      material: this.props.editorState.currentNodeValue,
      update: this.props.editorState.currentDraftNodeValue,
    });
  }
  
  revert() {
    this.props.updateWorkspaceMaterialContentNode({
      workspace: this.props.editorState.currentNodeWorkspace,
      material: this.props.editorState.currentDraftNodeValue,
      update: this.props.editorState.currentNodeValue,
      isDraft: true,
    });
  }
  
  removeProducer(index: number) {
    const newProducers = [...(this.props.editorState.currentDraftNodeValue.producers || [])];
    newProducers.splice(index, 1);
    
    this.props.updateWorkspaceMaterialContentNode({
      workspace: this.props.editorState.currentNodeWorkspace,
      material: this.props.editorState.currentDraftNodeValue,
      update: {
        producers: newProducers,
      },
      isDraft: true,
    });
  }
  
  addProducer() {
    const newProducers = [...(this.props.editorState.currentDraftNodeValue.producers || [])];
    newProducers.push({
      id: null,
      name: this.state.producerEntryName,
      materialId: this.props.editorState.currentDraftNodeValue.id,
    });
    
    this.setState({
      producerEntryName: "",
    });
    
    this.props.updateWorkspaceMaterialContentNode({
      workspace: this.props.editorState.currentNodeWorkspace,
      material: this.props.editorState.currentDraftNodeValue,
      update: {
        producers: newProducers,
      },
      isDraft: true,
    });
  }
  
  updateProducerEntryName(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      producerEntryName: e.target.value,
    });
  }

  render(){
    if (!this.props.editorState || !this.props.editorState.currentDraftNodeValue) {
      return <div className={`material-editor ${this.props.editorState.opened ? "material-editor--visible" : ""}`}/>
    }
      let materialPageType = this.props.editorState.currentDraftNodeValue.assignmentType ? (this.props.editorState.currentDraftNodeValue.assignmentType === "EXERCISE" ? "exercise" : "assignment") : "textual";
      let assignmentPageType = "material-editor-" + materialPageType;

      let canPublish = !equals(this.props.editorState.currentNodeValue, this.props.editorState.currentDraftNodeValue);
      const publishModifiers = ["material-editor-publish-page","material-editor"];
      const revertModifiers = ["material-editor-revert-page","material-editor"];
      if (!canPublish) {
        publishModifiers.push("disabled");
        revertModifiers.push("disabled");
      }

      let editorButtonSet = <div className="material-editor__buttonset">
        {this.props.editorState.canPublish ? <Dropdown openByHover modifier="material-page-management-tooltip" content={this.props.i18n.text.get("plugin.workspace.materialsManagement.materialEditTooltip")}>
          <ButtonPill buttonModifiers={publishModifiers} onClick={canPublish ? this.publish : null} icon="publish"/>
        </Dropdown> : null}
        {this.props.editorState.canPublish ? <Dropdown openByHover modifier="material-page-management-tooltip" content={this.props.i18n.text.get("plugin.workspace.materialsManagement.materialRevertToPublishedTooltip")}>
          <ButtonPill buttonModifiers={revertModifiers} onClick={canPublish ? this.revert : null} icon="revert"/>
        </Dropdown> : null}
        {this.props.editorState.canHide ? <Dropdown openByHover modifier="material-page-management-tooltip" content={this.props.i18n.text.get("plugin.workspace.materialsManagement.materialHideTooltip")}>
          <ButtonPill buttonModifiers={["material-editor-show-hide-page","material-editor"]} onClick={this.toggleHiddenStatus} icon={this.props.editorState.currentDraftNodeValue.hidden ? "show" : "hide"}/>
        </Dropdown> : null}
        {this.props.editorState.canRestrictView ? <Dropdown openByHover modifier="material-page-management-tooltip" content={this.props.i18n.text.get("plugin.workspace.materialsManagement.materialViewRestrictionTooltip")}>
            <ButtonPill buttonModifiers={["material-editor-restrict-page","material-editor"]} icon="closed-material"/>
          </Dropdown> : null}
          {this.props.editorState.canChangePageType ? <Dropdown openByHover modifier="material-page-management-tooltip" content={this.props.i18n.text.get("plugin.workspace.materialsManagement.materialChangeAssesmentTypeTooltip")}>
            <ButtonPill buttonModifiers={["material-editor-change-page-type","material-editor",assignmentPageType]} icon="assignment"/>
          </Dropdown> : null}
          {this.props.editorState.canChangeExerciseType && this.props.editorState.currentDraftNodeValue.assignmentType === "EXERCISE" ? <Dropdown openByHover modifier="material-page-management-tooltip" content={this.props.i18n.text.get("plugin.workspace.materialsManagement.materialShowAlwaysCorrectAnswersTooltip")}>
            <ButtonPill buttonModifiers={["material-editor-change-answer-reveal-type","material-editor"]} icon="correct-answers"/>
          </Dropdown> : null}
        {this.props.editorState.canDelete ? <DeleteWorkspaceMaterialDialog isSection={this.props.editorState.section} material={this.props.editorState.currentDraftNodeValue}>
          <Dropdown openByHover modifier="material-page-management-tooltip" content={this.props.i18n.text.get("plugin.workspace.materialsManagement.materialDeleteTooltip")}>
            <ButtonPill buttonModifiers={["material-editor-delete-page","material-editor"]} icon="delete"/>
          </Dropdown>
        </DeleteWorkspaceMaterialDialog> : null}
      </div>;

      const allTabs = [{
        id: "content",
        type: "material-editor",
        name: this.props.i18n.text.get("plugin.workspace.materialsManagement.editorView.tabs.label.content"),
        component: () => <div className="material-editor__content-wrapper">
          {editorButtonSet}

          <div className="material-editor__title-container">
            <input className="material-editor__title" onChange={this.updateTitle} value={this.props.editorState.currentDraftNodeValue.title}></input>
          </div> 
          {!this.props.editorState.section && this.props.editorState.canEditContent ? <div className="material-editor__editor-container">
            <CKEditor configuration={CKEditorConfig(
                this.props.locale.current,
                this.props.status.contextPath,
                this.props.editorState.currentNodeWorkspace,
                this.props.editorState.currentDraftNodeValue,
                this.props.editorState.disablePlugins,
              )} onChange={this.updateContent}>
              {this.props.editorState.currentDraftNodeValue.html}
            </CKEditor>
          </div> : null}
        </div>
      }];

      if (this.props.editorState.canSetLicense) {
        allTabs.push({
          id: "license",
          type: "material-editor",
          name: this.props.i18n.text.get("plugin.workspace.materialsManagement.editorView.tabs.label.license"),
          component: () => <div className="material-editor__content-wrapper"></div>,
        })
      }

      if (this.props.editorState.canSetProducers) {
        allTabs.push({
          id: "producers",
          type: "material-editor",
          name: this.props.i18n.text.get("plugin.workspace.materialsManagement.editorView.tabs.label.producers"),
          component: () => <div className="material-editor__content-wrapper">
            {editorButtonSet}

            <div className="material-editor__add-producers">
              <input type="text" value={this.state.producerEntryName} onChange={this.updateProducerEntryName}/>
              <button onClick={this.addProducer}>Enter</button>
            </div>

            <div className="material-editor__list-producers">
              {this.props.editorState.currentDraftNodeValue.producers.map((p, index) => {
                return <div className="material-editor__producer" key={index}>{p.name}<button onClick={this.removeProducer.bind(this, index)}>x</button></div>
              })}
            </div>
          </div>,
        })
      }

      if (this.props.editorState.canAddAttachments) {
        allTabs.push({
          id: "attachments",
          type: "material-editor",
          name: this.props.i18n.text.get("plugin.workspace.materialsManagement.editorView.tabs.label.attachments"),
          component: () => <div className="material-editor__content-wrapper"></div>,
        })
      }
      
      return <div className={`material-editor ${this.props.editorState.opened ? "material-editor--visible" : ""}`}>
        <Tabs activeTab={this.state.tab} onTabChange={this.changeTab} tabs={allTabs}>
          <ButtonPill buttonModifiers="material-page-close-editor" onClick={this.close} icon="close"/>
        </Tabs>
          
        <ConfirmPublishPageWithAnswersDialog/>
        <ConfirmRemovePageWithAnswersDialog/>
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