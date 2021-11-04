import * as React from "react";
import Portal from "~/components/general/portal";
import "~/sass/elements/material-editor.scss";
import { bindActionCreators } from "redux";
import {
  setWorkspaceMaterialEditorState,
  SetWorkspaceMaterialEditorStateTriggerType,
  updateWorkspaceMaterialContentNode,
  UpdateWorkspaceMaterialContentNodeTriggerType,
  createWorkspaceMaterialAttachment,
  CreateWorkspaceMaterialAttachmentTriggerType,
  RequestWorkspaceMaterialContentNodeAttachmentsTriggerType,
  requestWorkspaceMaterialContentNodeAttachments,
} from "~/actions/workspaces";
import { connect, Dispatch } from "react-redux";
import { StateType } from "~/reducers";
import i18n, { i18nType } from "~/reducers/base/i18n";
import {
  WorkspaceMaterialEditorType,
  WorkspaceType,
  MaterialContentNodeType,
} from "~/reducers/workspaces";
import Button, { ButtonPill } from "~/components/general/button";
import CKEditor from "~/components/general/ckeditor";
import { StatusType } from "~/reducers/base/status";
import { LocaleListType } from "~/reducers/base/locales";
import DeleteWorkspaceMaterialDialog from "./delete-dialog";
import Dropdown from "~/components/general/dropdown";
import ConfirmPublishPageWithAnswersDialog from "./confirm-publish-page-with-answers-dialog";
import ConfirmRemovePageWithAnswersDialog from "./confirm-remove-page-with-answers-dialog";
import ConfirmRemoveAttachment from "./confirm-remove-attachment";
import ConfirmPublishPageWithLinkedMaterialDialog from "./confirm-publish-page-with-linked-material-dialog";

import equals = require("deep-equal");
import Tabs, {TabType} from "~/components/general/tabs";
import AddProducer from "~/components/general/add-producer";
import { LicenseSelector } from "~/components/general/license-selector";
import FileUploader from "~/components/general/file-uploader";
import Link from "~/components/general/link";
import { PageLocation, UploadingValue } from "../../../@types/shared";

interface MaterialEditorProps {
  setWorkspaceMaterialEditorState: SetWorkspaceMaterialEditorStateTriggerType;
  i18n: i18nType;
  status: StatusType;
  editorState: WorkspaceMaterialEditorType;
  locale: LocaleListType;
  locationPage: PageLocation;
  updateWorkspaceMaterialContentNode: UpdateWorkspaceMaterialContentNodeTriggerType;
  createWorkspaceMaterialAttachment: CreateWorkspaceMaterialAttachmentTriggerType;
  requestWorkspaceMaterialContentNodeAttachments: RequestWorkspaceMaterialContentNodeAttachmentsTriggerType;
}

interface MaterialEditorState {
  tab: string;
  producerEntryName: string;
  height: number;
  uploadingValues: UploadingValue[];
}

const CKEditorConfig = (
  locale: string,
  contextPath: string,
  workspace: WorkspaceType,
  materialNode: MaterialContentNodeType,
  disablePlugins: boolean
) => ({
  uploadUrl: `/materialAttachmentUploadServlet/workspace/${workspace.urlName}/materials/${materialNode.path}`,
  linkShowTargetTab: true,
  allowedContent: true, // disable content filtering to preserve all formatting of imported documents; fix for #263
  entities: false,
  entities_latin: false,
  entities_greek: false,
  language: locale,
  language_list: [
    "fi:Suomi",
    "en:Englanti",
    "sv:Ruotsi",
    "de:Saksa",
    "es:Espanja",
    "ru:Venäjä",
    "ja:Japani",
    "fr:Ranska",
    "it:Italia",
    "la:Latina",
    "el:Kreikka",
  ],
  stylesSet:
    "workspace-material-styles:" +
    contextPath +
    "/scripts/ckplugins/styles/workspace-material-styles.js",
  format_tags: "p;h3;h4",
  baseHref: `/workspace/${workspace.urlName}/materials/${materialNode.path}/`,
  mathJaxLib:
    "//cdnjs.cloudflare.com/ajax/libs/mathjax/2.7.5/MathJax.js?config=TeX-MML-AM_SVG",
  mathJaxClass: "math-tex", // This CANNOT be changed as cke saves this to database as part of documents html (wraps the formula in a span with specified className). Don't touch it! ... STOP TOUCHING IT!
  toolbar: [
    { name: "document", items: ["Source"] },
    {
      name: "clipboard",
      items: [
        "Cut",
        "Copy",
        "Paste",
        "PasteText",
        "PasteFromWord",
        "-",
        "Undo",
        "Redo",
      ],
    },
    {
      name: "editing",
      items: [
        "Find",
        "Replace",
        "-",
        "SelectAll",
        "-",
        "Scayt",
        "-",
        "Language",
        "-",
        "A11ychecker",
      ],
    },
    {
      name: "basicstyles",
      items: [
        "Bold",
        "Italic",
        "Underline",
        "Strike",
        "Subscript",
        "Superscript",
        "-",
        "RemoveFormat",
      ],
    },
    "/",
    { name: "styles", items: ["Styles", "Format"] },
    {
      name: "insert",
      items: [
        "Image",
        "Audio",
        "oembed",
        "Muikku-mathjax",
        "Table",
        "Iframe",
        "Smiley",
        "SpecialChar",
        "CreateDiv",
      ],
    },
    { name: "links", items: ["Link", "Unlink", "Anchor"] },
    { name: "colors", items: ["TextColor", "BGColor"] },
    "/",
    {
      name: "forms",
      items: [
        "MuikkuTextField",
        "muikku-selection",
        "MuikkuMemoField",
        "muikku-filefield",
        "muikku-audiofield",
        "muikku-connectfield",
        "muikku-organizerfield",
        "muikku-sorterfield",
        "muikku-mathexercisefield",
      ],
    },
    {
      name: "paragraph",
      items: [
        "NumberedList",
        "BulletedList",
        "-",
        "Outdent",
        "Indent",
        "-",
        "JustifyLeft",
        "JustifyCenter",
        "JustifyRight",
        "JustifyBlock",
        "-",
        "BidiLtr",
        "BidiRtl",
      ],
    },
    { name: "tools", items: ["Maximize", "ShowBlocks", "-", "About"] },
  ],
  removePlugins: "image,exportpdf",
  extraPlugins: disablePlugins
    ? "divarea,language,oembed,audio,image2,muikku-embedded,muikku-image-details,muikku-image-target,muikku-word-definition,muikku-audio-defaults,muikku-image-target,widget,lineutils,filetools,uploadwidget,uploadimage,muikku-mathjax"
    : "divarea,language,oembed,audio,image2,muikku-embedded,muikku-image-details,muikku-image-target,muikku-word-definition,muikku-audio-defaults,muikku-image-target,widget,lineutils,filetools,uploadwidget,uploadimage,muikku-fields,muikku-textfield,muikku-memofield,muikku-filefield,muikku-audiofield,muikku-selection,muikku-connectfield,muikku-organizerfield,muikku-sorterfield,muikku-mathexercisefield,muikku-mathjax",
});

// First we need to modify the material content nodes end point to be able to receive hidden
// nodes, we need those to be able to modify here
class MaterialEditor extends React.Component<
  MaterialEditorProps,
  MaterialEditorState
> {
  /**
   * constructor
   * @param props
   */
  constructor(props: MaterialEditorProps) {
    super(props);
    this.toggleHiddenStatus = this.toggleHiddenStatus.bind(this);
    this.toggleViewRestrictionStatus =
      this.toggleViewRestrictionStatus.bind(this);
    this.cycleAssignmentType = this.cycleAssignmentType.bind(this);
    this.cycleCorrectAnswers = this.cycleCorrectAnswers.bind(this);
    this.updateContent = this.updateContent.bind(this);
    this.updateTitle = this.updateTitle.bind(this);
    this.close = this.close.bind(this);
    this.publish = this.publish.bind(this);
    this.revert = this.revert.bind(this);
    this.onTabChange = this.onTabChange.bind(this);
    this.removeProducer = this.removeProducer.bind(this);
    this.addProducer = this.addProducer.bind(this);
    this.updateLicense = this.updateLicense.bind(this);
    this.onFilesUpload = this.onFilesUpload.bind(this);
    this.updateHeight = this.updateHeight.bind(this);
    this.refreshAttachments = this.refreshAttachments.bind(this);

    this.state = {
      uploadingValues: [],
      tab: "content",
      producerEntryName: "",
      height: 0,
    };
  }

  /**
   * componentDidMount
   */
  componentDidMount() {
    let offset: number = 40;
    this.updateHeight(offset);
    window.addEventListener("resize", () => this.updateHeight(offset));
  }

  /**
   * componentWillUnMount
   */
  componentWillUnMount() {
    window.removeEventListener("resize", () => this.updateHeight);
  }

  /**
   * updateHeight
   * @param offset
   */
  updateHeight(offset?: number) {
    let heightOffset: number = offset ? offset : 0;
    this.setState({ height: window.innerHeight - heightOffset });
  }

  /**
   * refreshAttachments
   */
  refreshAttachments() {
    if (
      this.props.editorState.currentNodeValue &&
      this.props.editorState.currentNodeWorkspace
    ) {
      // due to a ckeditor bug I cannot know when the image has done uploading
      // I guess 3 seconds
      setTimeout(() => {
        this.props.requestWorkspaceMaterialContentNodeAttachments(
          this.props.editorState.currentNodeWorkspace,
          this.props.editorState.currentNodeValue
        );
      }, 3000);
    }
  }

  /**
   * toggleHiddenStatus
   */
  toggleHiddenStatus() {
    this.props.updateWorkspaceMaterialContentNode({
      workspace: this.props.editorState.currentNodeWorkspace,
      material: this.props.editorState.currentDraftNodeValue,
      update: {
        hidden: !this.props.editorState.currentDraftNodeValue.hidden,
      },
      isDraft: true,
    });
  }

  /**
   * toggleViewRestrictionStatus
   */
  toggleViewRestrictionStatus() {
    this.props.updateWorkspaceMaterialContentNode({
      workspace: this.props.editorState.currentNodeWorkspace,
      material: this.props.editorState.currentDraftNodeValue,
      update: {
        viewRestrict:
          this.props.editorState.currentDraftNodeValue.viewRestrict === "NONE"
            ? "LOGGED_IN"
            : "NONE",
      },
      isDraft: true,
    });
  }

  /**
   * cycleAssignmentType
   */
  cycleAssignmentType() {
    this.props.updateWorkspaceMaterialContentNode({
      workspace: this.props.editorState.currentNodeWorkspace,
      material: this.props.editorState.currentDraftNodeValue,
      update: {
        assignmentType: !this.props.editorState.currentDraftNodeValue
          .assignmentType
          ? "EXERCISE"
          : this.props.editorState.currentDraftNodeValue.assignmentType ===
            "EXERCISE"
          ? "EVALUATED"
          : null,
      },
      isDraft: true,
    });
  }

  /**
   * cycleCorrectAnswers
   */
  cycleCorrectAnswers() {
    this.props.updateWorkspaceMaterialContentNode({
      workspace: this.props.editorState.currentNodeWorkspace,
      material: this.props.editorState.currentDraftNodeValue,
      update: {
        correctAnswers:
          !this.props.editorState.currentDraftNodeValue.correctAnswers ||
          this.props.editorState.currentDraftNodeValue.correctAnswers ===
            "ALWAYS"
            ? "ON_REQUEST"
            : this.props.editorState.currentDraftNodeValue.correctAnswers ===
              "ON_REQUEST"
            ? "NEVER"
            : "ALWAYS",
      },
      isDraft: true,
    });
  }

  /**
   * updateTitle
   * @param e
   */
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

  /**
   * updateContent
   * @param content
   */
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

  /**
   * close
   */
  close() {
    this.props.setWorkspaceMaterialEditorState({
      ...this.props.editorState,
      opened: false,
    });
    this.setState({
      tab: "content",
      producerEntryName: "",
    });
  }

  /**
   * publish
   */
  publish() {
    this.props.updateWorkspaceMaterialContentNode({
      workspace: this.props.editorState.currentNodeWorkspace,
      material: this.props.editorState.currentNodeValue,
      update: this.props.editorState.currentDraftNodeValue,
    });
  }

  /**
   * revert
   */
  revert() {
    this.props.updateWorkspaceMaterialContentNode({
      workspace: this.props.editorState.currentNodeWorkspace,
      material: this.props.editorState.currentDraftNodeValue,
      update: this.props.editorState.currentNodeValue,
      isDraft: true,
    });
  }

  /**
   * removeProducer
   * @param index
   */
  removeProducer(index: number) {
    const newProducers = [
      ...(this.props.editorState.currentDraftNodeValue.producers || []),
    ];
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

  /**
   * addProducer
   * @param name
   */
  addProducer(name: string) {
    const newProducers = [
      ...(this.props.editorState.currentDraftNodeValue.producers || []),
    ];
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

  /**
   * updateLicense
   * @param newLicense
   */
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

  /**
   * Builds locale string depending what page component is used
   * and if page is already view restricted
   * @param isRestricted
   * @returns localeString
   */
  buildRestrictViewLocale = (isRestricted: boolean): string => {
    let localeString: string;
    switch (this.props.locationPage) {
      case "Help":
        localeString = isRestricted
          ? this.props.i18n.text.get(
              "plugin.workspace.helpManagement.disableViewRestrictionPageTooltip"
            )
          : this.props.i18n.text.get(
              "plugin.workspace.helpManagement.enableViewRestrictionPageTooltip"
            );
        break;
      case "Materials":
        localeString = isRestricted
          ? this.props.i18n.text.get(
              "plugin.workspace.materialsManagement.disableViewRestrictionPageTooltip"
            )
          : this.props.i18n.text.get(
              "plugin.workspace.materialsManagement.enableViewRestrictionPageTooltip"
            );
        break;
      default:
        localeString = "";
        break;
    }

    return localeString;
  };

  /**
   * updateUploadingValues
   * @param updatedValues
   */
  updateUploadingValues = (
    updatedValues: {
      name: string;
      contentType: string;
      progress: number;
      file: File;
    }[]
  ) => {
    this.setState({
      uploadingValues: updatedValues,
    });
  };

  /**
   * handleUploadingTextProcesser
   * @param percent
   * @returns progress string
   */
  handleUploadingTextProcesser = (percent: number) => {
    return `
      ${this.props.i18n.text.get(
        "plugin.guider.user.details.files.uploading"
      )} ${percent}%`;
  };

  /**
   * onClickClose
   */
  onClickClose = () => {
    this.close();
  };

  /**
   * onTabChange
   * @param tab
   */
  onTabChange(tab: string) {
    this.setState({ tab });
  }

  /**
   * onFilesUpload
   * @param e
   */
  onFilesUpload(e: React.ChangeEvent<HTMLInputElement>) {
    this.props.createWorkspaceMaterialAttachment(
      {
        workspace: this.props.editorState.currentNodeWorkspace,
        material: this.props.editorState.currentNodeValue,
        files: Array.from(e.target.files),
        uploadingValues: [...this.state.uploadingValues].concat(
          Array.from(e.target.files).map((file) => {
            return {
              name: file.name,
              contentType: file.type,
              progress: 0,
              file,
            };
          })
        ),
        success: () => {
          this.setState({
            uploadingValues: [],
          });
        },
        fail: () => {
          this.setState({
            uploadingValues: [],
          });
        },
      },
      this.updateUploadingValues
    );
  }

  /**
   * render
   * @returns
   */
  render() {
    if (
      !this.props.editorState ||
      !this.props.editorState.currentDraftNodeValue
    ) {
      return (
        <div
          className={`material-editor ${
            this.props.editorState.opened ? "material-editor--visible" : ""
          }`}
        />
      );
    }
    const materialPageType = this.props.editorState.currentDraftNodeValue
      .assignmentType
      ? this.props.editorState.currentDraftNodeValue.assignmentType ===
        "EXERCISE"
        ? "exercise"
        : "assignment"
      : "textual";
    const assignmentPageType = "material-editor-" + materialPageType;

    const comparerPoints = [
      "assignmentType",
      "correctAnswers",
      "hidden",
      "html",
      "license",
      "path",
      "producers",
      "title",
      "type",
      "viewRestrict",
    ];
    let canPublish = false;
    for (let point of comparerPoints) {
      if (
        !equals(
          (this.props.editorState.currentNodeValue as any)[point],
          (this.props.editorState.currentDraftNodeValue as any)[point]
        )
      ) {
        canPublish = true;
        break;
      }
    }

    const publishModifiers = [
      "material-editor-publish-page",
      "material-editor",
    ];
    const revertModifiers = ["material-editor-revert-page", "material-editor"];
    if (!canPublish) {
      publishModifiers.push("disabled");
      revertModifiers.push("disabled");
    }

    const isHidden =
      this.props.editorState.currentDraftNodeValue.hidden ||
      (this.props.editorState.parentNodeValue &&
        this.props.editorState.parentNodeValue.hidden);
    const hideShowButtonModifiers = [
      "material-editor-show-hide-page",
      "material-editor",
    ];
    if (isHidden) {
      hideShowButtonModifiers.push("material-editor-disabled");
    } else {
      hideShowButtonModifiers.push("material-editor-enabled");
    }

    const isViewRestricted =
      this.props.editorState.currentDraftNodeValue.viewRestrict === "LOGGED_IN";
    const viewRestrictionButtonModifiers = [
      "material-editor-restrict-page",
      "material-editor",
    ];
    if (isViewRestricted) {
      viewRestrictionButtonModifiers.push("material-editor-disabled");
    } else {
      viewRestrictionButtonModifiers.push("material-editor-enabled");
    }

    const exerciseRevealType =
      !this.props.editorState.currentDraftNodeValue.correctAnswers ||
      this.props.editorState.currentDraftNodeValue.correctAnswers === "ALWAYS"
        ? "always-show"
        : this.props.editorState.currentDraftNodeValue.correctAnswers ===
          "ON_REQUEST"
        ? "on-request"
        : "never-show";

    const correctAnswersModifiers = [
      "material-editor-change-answer-reveal-type",
      "material-editor",
      "material-editor-" + exerciseRevealType,
    ];
    const correctAnswersTooltips =
      !this.props.editorState.currentDraftNodeValue.correctAnswers ||
      this.props.editorState.currentDraftNodeValue.correctAnswers === "ALWAYS"
        ? this.props.i18n.text.get(
            "plugin.workspace.materialsManagement.showAlwaysCorrectAnswersPageTooltip"
          )
        : this.props.editorState.currentDraftNodeValue.correctAnswers ===
          "ON_REQUEST"
        ? this.props.i18n.text.get(
            "plugin.workspace.materialsManagement.showOnRequestCorrectAnswersPageTooltip"
          )
        : this.props.i18n.text.get(
            "plugin.workspace.materialsManagement.showNeverCorrectAnswersPageTooltip"
          );

    const canRestrictViewLocale =
      this.buildRestrictViewLocale(isViewRestricted);

    let editorButtonSet = (
      <div className="material-editor__buttonset">
        <div className="material-editor__buttonset-primary">
          {this.props.editorState.canHide &&
          (!this.props.editorState.parentNodeValue ||
            !this.props.editorState.parentNodeValue.hidden) ? (
            <Dropdown
              openByHover
              modifier="material-management-tooltip"
              content={
                isHidden
                  ? this.props.i18n.text.get(
                      "plugin.workspace.materialsManagement.showPageTooltip"
                    )
                  : this.props.i18n.text.get(
                      "plugin.workspace.materialsManagement.hidePageTooltip"
                    )
              }
            >
              <ButtonPill
                buttonModifiers={hideShowButtonModifiers}
                onClick={this.toggleHiddenStatus}
                icon="eye"
              />
            </Dropdown>
          ) : null}
          {this.props.editorState.canRestrictView ? (
            <Dropdown
              openByHover
              modifier="material-management-tooltip"
              content={canRestrictViewLocale}
            >
              <ButtonPill
                buttonModifiers={viewRestrictionButtonModifiers}
                icon="restriction"
                onClick={this.toggleViewRestrictionStatus}
              />
            </Dropdown>
          ) : null}
          {this.props.editorState.canChangePageType ? (
            <Dropdown
              openByHover
              modifier="material-management-tooltip"
              content={this.props.i18n.text.get(
                "plugin.workspace.materialsManagement.changeAssesmentTypePageTooltip"
              )}
            >
              <ButtonPill
                buttonModifiers={[
                  "material-editor-change-page-type",
                  "material-editor",
                  assignmentPageType,
                ]}
                icon="puzzle"
                onClick={this.cycleAssignmentType}
              />
            </Dropdown>
          ) : null}

          {this.props.editorState.canChangeExerciseType &&
          this.props.editorState.currentDraftNodeValue.assignmentType ===
            "EXERCISE" ? (
            <Dropdown
              openByHover
              modifier="material-management-tooltip"
              content={correctAnswersTooltips}
            >
              <ButtonPill
                buttonModifiers={correctAnswersModifiers}
                icon="lightbulb"
                onClick={this.cycleCorrectAnswers}
              />
            </Dropdown>
          ) : null}
        </div>
        <div className="material-editor__buttonset-secondary">
          {this.props.editorState.canPublish ? (
            <Dropdown
              openByHover
              modifier="material-management-tooltip"
              content={this.props.i18n.text.get(
                "plugin.workspace.materialsManagement.publishPageTooltip"
              )}
            >
              <ButtonPill
                buttonModifiers={publishModifiers}
                onClick={canPublish ? this.publish : null}
                icon="leanpub"
              />
            </Dropdown>
          ) : null}
          {this.props.editorState.canRevert ? (
            <Dropdown
              openByHover
              modifier="material-management-tooltip"
              content={this.props.i18n.text.get(
                "plugin.workspace.materialsManagement.revertToPublishedPageTooltip"
              )}
            >
              <ButtonPill
                buttonModifiers={revertModifiers}
                onClick={canPublish ? this.revert : null}
                icon="undo"
              />
            </Dropdown>
          ) : null}
          {this.props.editorState.canDelete ? (
            <DeleteWorkspaceMaterialDialog
              isSection={this.props.editorState.section}
              material={this.props.editorState.currentDraftNodeValue}
              onDeleteSuccess={this.close}
            >
              <Dropdown
                openByHover
                modifier="material-management-tooltip"
                content={this.props.i18n.text.get(
                  "plugin.workspace.materialsManagement.deletePageTooltip"
                )}
              >
                <ButtonPill
                  buttonModifiers={[
                    "material-editor-delete-page",
                    "material-editor",
                  ]}
                  icon="trash"
                />
              </Dropdown>
            </DeleteWorkspaceMaterialDialog>
          ) : null}
        </div>
      </div>
    );

    const closeDialog =  <ButtonPill
      buttonModifiers={["material-page-close-editor", "material-page-close-mobile-editor" ]}
      onClick={this.onClickClose}
      icon="arrow-left"
  />;

    const allTabs: TabType[] = [
      {
        id: "content",
        type: "material-editor",
        mobileAction: closeDialog,
        name: this.props.i18n.text.get(
          "plugin.workspace.materialsManagement.editorView.tabs.label.content"
        ),
        component: () => (
          <div className="material-editor__content-wrapper">
            {editorButtonSet}

            {this.props.editorState.canSetTitle ? (
              <div className="material-editor__title-container">
                <input
                  className="material-editor__title"
                  onChange={this.updateTitle}
                  value={this.props.editorState.currentDraftNodeValue.title}
                ></input>
              </div>
            ) : null}
            {!this.props.editorState.section &&
            this.props.editorState.canEditContent &&
            this.props.editorState.opened ? (
              <div
                id="materialEditorContainer"
                className="material-editor__editor-container"
              >
                <CKEditor
                  ancestorHeight={this.state.height}
                  configuration={CKEditorConfig(
                    this.props.locale.current,
                    this.props.status.contextPath,
                    this.props.editorState.currentNodeWorkspace,
                    this.props.editorState.currentDraftNodeValue,
                    this.props.editorState.disablePlugins
                  )}
                  onChange={this.updateContent}
                  onDrop={this.refreshAttachments}
                >
                  {this.props.editorState.currentDraftNodeValue.html}
                </CKEditor>
              </div>
            ) : null}
          </div>
        ),
      },
    ];

    if (
      this.props.editorState.canSetLicense ||
      this.props.editorState.canSetProducers
    ) {
      allTabs.push({
        id: "metadata",
        type: "material-editor",
        mobileAction: closeDialog,
        name: this.props.i18n.text.get(
          "plugin.workspace.materialsManagement.editorView.tabs.label.metadata"
        ),
        component: () => (
          <div className="material-editor__content-wrapper">
            {editorButtonSet}

            {this.props.editorState.canSetProducers ? (
              <div className="material-editor__sub-section">
                <h3 className="material-editor__sub-title">
                  {this.props.i18n.text.get(
                    "plugin.workspace.materialsManagement.editorView.subTitle.producers"
                  )}
                </h3>
                {this.props.editorState.currentDraftNodeValue.producers ? (
                  <div className="material-editor__add-producer-container">
                    <AddProducer
                      modifier="add-material-producer"
                      removeProducer={this.removeProducer}
                      addProducer={this.addProducer}
                      producers={
                        this.props.editorState.currentDraftNodeValue.producers
                      }
                      i18n={this.props.i18n}
                    />
                  </div>
                ) : null}
              </div>
            ) : null}

            {this.props.editorState.canSetLicense ? (
              <div className="material-editor__sub-section">
                <h3 className="material-editor__sub-title">
                  {this.props.i18n.text.get(
                    "plugin.workspace.materialsManagement.editorView.subTitle.license"
                  )}
                </h3>
                <div className="material-editor__add-license-container">
                  <LicenseSelector
                    wcagLabel="materialLicense"
                    wcagDesc={this.props.i18n.text.get(
                      "plugin.wcag.materialLicense.label"
                    )}
                    modifier="material-editor"
                    value={this.props.editorState.currentDraftNodeValue.license}
                    onChange={this.updateLicense}
                    i18n={this.props.i18n}
                  />
                </div>
              </div>
            ) : null}
          </div>
        ),
      });
    }

    if (this.props.editorState.canAddAttachments) {
      allTabs.push({
        id: "attachments",
        type: "material-editor",
        mobileAction: closeDialog,
        name: this.props.i18n.text.get(
          "plugin.workspace.materialsManagement.editorView.tabs.label.attachments"
        ),
        component: () => (
          <div className="material-editor__content-wrapper">
            {editorButtonSet}

            <FileUploader
              uploadingValues={this.state.uploadingValues}
              onFileInputChange={this.onFilesUpload}
              modifier="material-editor"
              displayNotificationOnError
              fileTooLargeErrorText={this.props.i18n.text.get(
                "plugin.workspace.fileFieldUpload.fileSizeTooLarge"
              )}
              files={
                this.props.editorState.currentNodeValue.childrenAttachments
              }
              fileIdKey="materialId"
              fileNameKey="title"
              fileUrlGenerator={(a) =>
                `/workspace/${this.props.editorState.currentNodeWorkspace.urlName}/materials/${a.path}`
              }
              deleteDialogElement={ConfirmRemoveAttachment}
              hintText={this.props.i18n.text.get(
                "plugin.workspace.fileField.fieldHint"
              )}
              deleteFileText={this.props.i18n.text.get(
                "plugin.workspace.fileField.removeLink"
              )}
              downloadFileText={this.props.i18n.text.get(
                "plugin.workspace.fileField.downloadLink"
              )}
              showURL
              notificationOfSuccessText={this.props.i18n.text.get(
                "plugin.workspace.fileFieldUpload.uploadSuccessful"
              )}
              displayNotificationOnSuccess
              uploadingTextProcesser={this.handleUploadingTextProcesser}
            />
          </div>
        ),
      });
    }

    return (
      <div
        className={`material-editor ${
          this.props.editorState.opened ? "material-editor--visible" : ""
        }`}
      >
        <Tabs
          modifier="material-editor"
          activeTab={this.state.tab}
          onTabChange={this.onTabChange}
          tabs={allTabs}
        >
          <ButtonPill
            buttonModifiers="material-page-close-editor"
            onClick={this.onClickClose}
            icon="arrow-left"
          />
        </Tabs>
        <ConfirmPublishPageWithAnswersDialog />
        <ConfirmRemovePageWithAnswersDialog onDeleteSuccess={this.close} />
        <ConfirmPublishPageWithLinkedMaterialDialog />
      </div>
    );
  }
}

/**
 * mapStateToProps
 * @param state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    editorState: state.workspaces.materialEditor,
    status: state.status,
    locale: state.locales,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators(
    {
      setWorkspaceMaterialEditorState,
      updateWorkspaceMaterialContentNode,
      createWorkspaceMaterialAttachment,
      requestWorkspaceMaterialContentNodeAttachments,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(MaterialEditor);
