import * as React from 'react';
import Portal from '~/components/general/portal';

import '~/sass/elements/material-editor.scss';
import { bindActionCreators } from 'redux';
import { setWorkspaceMaterialEditorState, SetWorkspaceMaterialEditorStateTriggerType,
  updateWorkspaceMaterialContentNode, UpdateWorkspaceMaterialContentNodeTriggerType,
  createWorkspaceMaterialAttachment, CreateWorkspaceMaterialAttachmentTriggerType } from '~/actions/workspaces';
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
import ConfirmRemoveAttachment from "./confirm-remove-attachment";
import ModifyWorkspaceMaterialAttachmentDataDialog from "./modify-attachment-data-dialog";

import equals = require("deep-equal");
import Tabs from '~/components/general/tabs';
import AddProducer from '~/components/general/add-producer';
import { LicenseSelector } from '~/components/general/license-selector';
import FileUploader from '~/components/general/file-uploader';
import Link from '~/components/general/link';

interface MaterialEditorProps {
  setWorkspaceMaterialEditorState: SetWorkspaceMaterialEditorStateTriggerType,
  i18n: i18nType,
  status: StatusType,
  editorState: WorkspaceMaterialEditorType,
  locale: LocaleListType,
  updateWorkspaceMaterialContentNode: UpdateWorkspaceMaterialContentNodeTriggerType,
  createWorkspaceMaterialAttachment: CreateWorkspaceMaterialAttachmentTriggerType
}

interface MaterialEditorState {
  tab: string;
  producerEntryName: string;
  uploading: boolean;
  height: number;
}

const CKEditorConfig = (
    locale: string,
    contextPath: string,
    workspace: WorkspaceType,
    materialNode: MaterialContentNodeType,
    disablePlugins: boolean,
) => ({
  uploadUrl: `/materialAttachmentUploadServlet/workspace/${workspace.urlName}/${materialNode.path}`,
  linkShowTargetTab: true,
  allowedContent: true, // disable content filtering to preserve all formatting of imported documents; fix for #263
  entities: false,
  entities_latin: false,
  entities_greek: false,
  language: locale,
  language_list: ['fi:Suomi', 'en:Englanti', 'de:Saksa', 'fr:Ranska', 'it:Italia', 'ru:Venäjä', 'sv:Ruotsi'],
  stylesSet : 'workspace-material-styles:' + contextPath + '/scripts/ckplugins/styles/workspace-material-styles.js',
  format_tags : 'p;h3;h4',
  baseHref: `workspace/${workspace.urlName}/${materialNode.path}/`,
  mathJaxLib: '//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_SVG',
  mathJaxClass: 'material-page__math-formula',
  toolbarCanCollapse: true,
  toolbar: [
    { name: 'document', items : [ 'Source' ] },
    { name: 'clipboard', items : [ 'Cut','Copy','Paste','PasteText','PasteFromWord','-','Undo','Redo' ] },
    { name: 'editing', items: [ 'Find', 'Replace', '-', 'SelectAll', '-', 'Scayt', '-', 'Language', '-', 'A11ychecker' ] },
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
  extraPlugins: disablePlugins ? 'oembed,muikku-embedded,muikku-image-details,muikku-word-definition,muikku-audio-defaults,muikku-image-target,autogrow,widget,lineutils,filetools,uploadwidget,uploadimage' :
    "language,oembed,audio,image2,muikku-fields,muikku-textfield,muikku-memofield,muikku-filefield,muikku-audiofield,muikku-selection,muikku-connectfield,muikku-organizerfield,muikku-sorterfield,muikku-mathexercisefield,muikku-embedded,muikku-image-details,muikku-word-definition,muikku-audio-defaults,muikku-image-target,muikku-mathjax,uploadimage,divarea",
});

// First we need to modify the material content nodes end point to be able to receive hidden
// nodes, we need those to be able to modify here
class MaterialEditor extends React.Component<MaterialEditorProps, MaterialEditorState> {
  constructor(props: MaterialEditorProps){
    super(props);

    this.toggleHiddenStatus = this.toggleHiddenStatus.bind(this);
    this.toggleViewRestrictionStatus = this.toggleViewRestrictionStatus.bind(this);
    this.cycleAssignmentType = this.cycleAssignmentType.bind(this);
    this.cycleCorrectAnswers = this.cycleCorrectAnswers.bind(this);
    this.updateContent = this.updateContent.bind(this);
    this.updateTitle = this.updateTitle.bind(this);
    this.close = this.close.bind(this);
    this.publish = this.publish.bind(this);
    this.revert = this.revert.bind(this);
    this.changeTab = this.changeTab.bind(this);
    this.removeProducer = this.removeProducer.bind(this);
    this.addProducer = this.addProducer.bind(this);
    this.updateLicense = this.updateLicense.bind(this);
    this.onFilesUpload = this.onFilesUpload.bind(this);
    this.updateHeight = this.updateHeight.bind(this);

    this.state = {
      tab: "content",
      producerEntryName: "",
      uploading: false,
      height: 0
    }
  }
  


  updateHeight() {
    this.setState({height: window.innerHeight - 167});
  }

  onFilesUpload(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({
      uploading: true
    });
    this.props.createWorkspaceMaterialAttachment({
      workspace: this.props.editorState.currentNodeWorkspace,
      material: this.props.editorState.currentNodeValue,
      files: Array.from(e.target.files),
      success: () => {
        this.setState({
          uploading: false
        });
      },
      fail: () => {
        this.setState({
          uploading: false
        });
      }
    })
  }

  changeTab(tab: string) {
    this.setState({tab});
  }

  toggleHiddenStatus() {
    this.props.updateWorkspaceMaterialContentNode({
      workspace: this.props.editorState.currentNodeWorkspace,
      material: this.props.editorState.currentDraftNodeValue,
      update: {
        hidden: !this.props.editorState.currentDraftNodeValue.hidden,
      },
      isDraft: true
    });
  }

  toggleViewRestrictionStatus() {
    this.props.updateWorkspaceMaterialContentNode({
      workspace: this.props.editorState.currentNodeWorkspace,
      material: this.props.editorState.currentDraftNodeValue,
      update: {
        viewRestrict: this.props.editorState.currentDraftNodeValue.viewRestrict === "NONE" ? "LOGGED_IN" : "NONE",
      },
      isDraft: true
    });
  }

  cycleAssignmentType() {
    this.props.updateWorkspaceMaterialContentNode({
      workspace: this.props.editorState.currentNodeWorkspace,
      material: this.props.editorState.currentDraftNodeValue,
      update: {
        assignmentType: !this.props.editorState.currentDraftNodeValue.assignmentType ? "EXERCISE" : (
          this.props.editorState.currentDraftNodeValue.assignmentType === "EXERCISE" ? "EVALUATED" : null
        ),
      },
      isDraft: true
    });
  }

  cycleCorrectAnswers() {
    this.props.updateWorkspaceMaterialContentNode({
      workspace: this.props.editorState.currentNodeWorkspace,
      material: this.props.editorState.currentDraftNodeValue,
      update: {
        correctAnswers: !this.props.editorState.currentDraftNodeValue.correctAnswers ||
          this.props.editorState.currentDraftNodeValue.correctAnswers === "ALWAYS"  ? "ON_REQUEST" : (
          this.props.editorState.currentDraftNodeValue.correctAnswers === "ON_REQUEST" ? "NEVER" : "ALWAYS"
        ),
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
    // TODO content update plug-in is all
    // going through the collaboration plug-in
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

  addProducer(name: string) {
    const newProducers = [...(this.props.editorState.currentDraftNodeValue.producers || [])];
    newProducers.push({
      id: null,
      name,
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


  updateLicense(newLicense: string) {
    this.props.updateWorkspaceMaterialContentNode({
      workspace: this.props.editorState.currentNodeWorkspace,
      material: this.props.editorState.currentDraftNodeValue,
      update: {
        license: newLicense,
      },
      isDraft: true,
    });
  }
  
  componentDidMount() {
    let containerTopOffset:number = 167;
    this.updateHeight();
    window.addEventListener('resize', this.updateHeight);
  }
  componentWillUnMount() {
    window.removeEventListener('resize', this.updateHeight);    
  }
  
  render(){
    if (!this.props.editorState || !this.props.editorState.currentDraftNodeValue) {
      return <div className={`material-editor ${this.props.editorState.opened ? "material-editor--visible" : ""}`}/>
    }
      const materialPageType = this.props.editorState.currentDraftNodeValue.assignmentType ? (this.props.editorState.currentDraftNodeValue.assignmentType === "EXERCISE" ? "exercise" : "assignment") : "textual";
      const assignmentPageType = "material-editor-" + materialPageType;

      const comparerPoints = ["assignmentType", "hidden", "html", "license", "path", "producers", "title", "type", "viewRestrict"];
      let canPublish = false;
      for (let point of comparerPoints) {
        if (!equals((this.props.editorState.currentNodeValue as any)[point],
            (this.props.editorState.currentDraftNodeValue as any)[point])) {
          canPublish = true;
          break;
        }
      }
      
      const publishModifiers = ["material-editor-publish-page","material-editor"];
      const revertModifiers = ["material-editor-revert-page","material-editor"];
      if (!canPublish) {
        publishModifiers.push("disabled");
        revertModifiers.push("disabled");
      }

      const isHidden = this.props.editorState.currentDraftNodeValue.hidden;
      const hideShowButtonModifiers = ["material-editor-show-hide-page","material-editor"];
      if (isHidden) {
        hideShowButtonModifiers.push("material-editor-disabled");
      } else {
        hideShowButtonModifiers.push("material-editor-enabled");
      }

      const isViewRestricted = this.props.editorState.currentDraftNodeValue.viewRestrict === "LOGGED_IN";
      const viewRestrictionButtonModifiers = ["material-editor-restrict-page","material-editor"];
      if (isViewRestricted) {
        viewRestrictionButtonModifiers.push("material-editor-disabled");
      } else {
        viewRestrictionButtonModifiers.push("material-editor-enabled");
      }

      const exerciseRevealType = !this.props.editorState.currentDraftNodeValue.correctAnswers ||
        this.props.editorState.currentDraftNodeValue.correctAnswers === "ALWAYS" ? "always-show" :
          (this.props.editorState.currentDraftNodeValue.correctAnswers === "ON_REQUEST" ? "on-request" : "never-show");
      
      const correctAnswersModifiers = ["material-editor-change-answer-reveal-type", "material-editor", "material-editor-" + exerciseRevealType];
      const correctAnswersTooltips =  !this.props.editorState.currentDraftNodeValue.correctAnswers || this.props.editorState.currentDraftNodeValue.correctAnswers === "ALWAYS" ? 
          this.props.i18n.text.get("plugin.workspace.materialsManagement.showAlwaysCorrectAnswersPageTooltip") : 
            (this.props.editorState.currentDraftNodeValue.correctAnswers === "ON_REQUEST" ? this.props.i18n.text.get("plugin.workspace.materialsManagement.showOnRequestCorrectAnswersPageTooltip") :
              this.props.i18n.text.get("plugin.workspace.materialsManagement.showNeverCorrectAnswersPageTooltip"));

      let editorButtonSet = <div className="material-editor__buttonset">
        <div className="material-editor__buttonset-primary">
          {this.props.editorState.canHide ? <Dropdown openByHover modifier="material-management-tooltip" content={isHidden ? this.props.i18n.text.get("plugin.workspace.materialsManagement.showPageTooltip") : this.props.i18n.text.get("plugin.workspace.materialsManagement.hidePageTooltip")}>
            <ButtonPill buttonModifiers={hideShowButtonModifiers} onClick={this.toggleHiddenStatus} icon="show"/>
          </Dropdown> : null}
          {this.props.editorState.canRestrictView ? <Dropdown openByHover modifier="material-management-tooltip" content={isViewRestricted ? this.props.i18n.text.get("plugin.workspace.materialsManagement.disableViewRestrictionPageTooltip") : this.props.i18n.text.get("plugin.workspace.materialsManagement.enableViewRestrictionPageTooltip")}>
            <ButtonPill buttonModifiers={viewRestrictionButtonModifiers} icon="closed-material" onClick={this.toggleViewRestrictionStatus}/>
          </Dropdown> : null}
          {this.props.editorState.canChangePageType ? <Dropdown openByHover modifier="material-management-tooltip" content={this.props.i18n.text.get("plugin.workspace.materialsManagement.changeAssesmentTypePageTooltip")}>
            <ButtonPill buttonModifiers={["material-editor-change-page-type","material-editor", assignmentPageType]} icon="assignment" onClick={this.cycleAssignmentType}/>
          </Dropdown> : null}

          {this.props.editorState.canChangeExerciseType && this.props.editorState.currentDraftNodeValue.assignmentType === "EXERCISE" ? <Dropdown openByHover modifier="material-management-tooltip" content={correctAnswersTooltips}>
            <ButtonPill buttonModifiers={correctAnswersModifiers} icon="correct-answers" onClick={this.cycleCorrectAnswers}/>
          </Dropdown> : null}

        </div>
        <div className="material-editor__buttonset-secondary">
          {this.props.editorState.canPublish ? <Dropdown openByHover modifier="material-management-tooltip"
              content={this.props.i18n.text.get("plugin.workspace.materialsManagement.publishPageTooltip")}>
            <ButtonPill buttonModifiers={publishModifiers} onClick={canPublish ? this.publish : null} icon="publish"/>
          </Dropdown> : null}
          {this.props.editorState.canPublish ? <Dropdown openByHover modifier="material-management-tooltip"
              content={this.props.i18n.text.get("plugin.workspace.materialsManagement.revertToPublishedPageTooltip")}>
            <ButtonPill buttonModifiers={revertModifiers} onClick={canPublish ? this.revert : null} icon="revert"/>
          </Dropdown> : null}
          {this.props.editorState.canDelete ? <DeleteWorkspaceMaterialDialog
              isSection={this.props.editorState.section}
              material={this.props.editorState.currentDraftNodeValue}
              onDeleteSuccess={this.close}>
            <Dropdown openByHover modifier="material-management-tooltip" content={this.props.i18n.text.get("plugin.workspace.materialsManagement.deletePageTooltip")}>
              <ButtonPill buttonModifiers={["material-editor-delete-page","material-editor"]} icon="delete"/>
            </Dropdown>
          </DeleteWorkspaceMaterialDialog> : null}
        </div>
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
          {!this.props.editorState.section && this.props.editorState.canEditContent ? <div id="materialEditorContainer" className="material-editor__editor-container">
            <CKEditor height={this.state.height} configuration={CKEditorConfig(
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

      if (this.props.editorState.canSetLicense || this.props.editorState.canSetProducers) {
        allTabs.push({
          id: "metadata",
          type: "material-editor",
          name: this.props.i18n.text.get("plugin.workspace.materialsManagement.editorView.tabs.label.metadata"),
          component: () => <div className="material-editor__content-wrapper">
            {editorButtonSet}

            {this.props.editorState.canSetLicense ? 
              <div className="material-editor__sub-section">
                <h3 className="material-editor__sub-title">{this.props.i18n.text.get("plugin.workspace.materialsManagement.editorView.subTitle.license")}</h3>
                <div className="material-editor__add-license-container">
                  <LicenseSelector modifier="material-editor" value={this.props.editorState.currentDraftNodeValue.license} onChange={this.updateLicense} i18n={this.props.i18n}/>
                </div>
              </div>
            : null}

            {this.props.editorState.canSetProducers ?
              <div className="material-editor__sub-section">
                <h3 className="material-editor__sub-title">{this.props.i18n.text.get("plugin.workspace.materialsManagement.editorView.subTitle.producers")}</h3>
                {this.props.editorState.currentDraftNodeValue.producers?
                  <div className="material-editor__add-producer-container">
                    <AddProducer modifier="add-material-producer" removeProducer={this.removeProducer} addProducer={this.addProducer} producers={this.props.editorState.currentDraftNodeValue.producers} i18n={this.props.i18n}/>
                  </div>
              : null}

              </div>
            : null}
          </div>,
        })
      }

      if (this.props.editorState.canAddAttachments) {
        allTabs.push({
          id: "attachments",
          type: "material-editor",
          name: this.props.i18n.text.get("plugin.workspace.materialsManagement.editorView.tabs.label.attachments"),
          component: () => <div className="material-editor__content-wrapper">
            {editorButtonSet}

            <FileUploader onFileInputChange={this.onFilesUpload} modifier="material-editor" displayNotificationOnError
            fileTooLargeErrorText={this.props.i18n.text.get("TODO file too large")}
            files={this.props.editorState.currentNodeValue.childrenAttachments} fileIdKey="materialId" fileNameKey="title"
            fileUrlGenerator={(a)=>`/workspace/${this.props.editorState.currentNodeWorkspace.urlName}/${this.props.editorState.currentNodeValue.path}/${a.path}`}
            deleteDialogElement={ConfirmRemoveAttachment}
            hintText={this.props.i18n.text.get("plugin.workspace.fileField.fieldHint")}
            deleteFileText={this.props.i18n.text.get("plugin.workspace.fileField.removeLink")}
            downloadFileText={this.props.i18n.text.get("plugin.workspace.fileField.downloadLink")} showURL
            fileExtraNodeGenerator={(a)=>{
              return <ModifyWorkspaceMaterialAttachmentDataDialog attachment={a}>
                <Link disablePropagation className="file-uploader__item-delete-icon icon-edit"/>
              </ModifyWorkspaceMaterialAttachmentDataDialog>
            }}/>
          </div>,
        })
      }

      return <div className={`material-editor ${this.props.editorState.opened ? "material-editor--visible" : ""}`}>
        <Tabs modifier="material-editor" activeTab={this.state.tab} onTabChange={this.changeTab} tabs={allTabs}>
          <ButtonPill buttonModifiers="material-page-close-editor" onClick={this.close} icon="arrow-left-thin"/>
        </Tabs>
        <ConfirmPublishPageWithAnswersDialog/>
        <ConfirmRemovePageWithAnswersDialog onDeleteSuccess={this.close}/>
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
  return bindActionCreators({setWorkspaceMaterialEditorState, updateWorkspaceMaterialContentNode, createWorkspaceMaterialAttachment}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MaterialEditor);