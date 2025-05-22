import * as React from "react";
import "~/sass/elements/material-editor.scss";
import "~/sass/elements/form.scss";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { StateType } from "~/reducers";
import Link from "~/components/general/link";
import {
  WorkspaceMaterialEditorType,
  WorkspaceDataType,
  languageOptions,
  MaterialContentNodeWithIdAndLogic,
} from "~/reducers/workspaces";
import { ButtonPill } from "~/components/general/button";
import CKEditor from "~/components/general/ckeditor";
import { MATHJAXSRC } from "~/lib/mathjax";
import { StatusType } from "~/reducers/base/status";
import { LocaleState } from "~/reducers/base/locales";
import DeleteWorkspaceMaterialDialog from "./delete-dialog";
import Dropdown from "~/components/general/dropdown";
import ConfirmPublishPageWithAnswersDialog from "./confirm-publish-page-with-answers-dialog";
import ConfirmRemovePageWithAnswersDialog from "./confirm-remove-page-with-answers-dialog";
import ConfirmRemoveAttachment from "./confirm-remove-attachment";
import ConfirmPublishPageWithLinkedMaterialDialog from "./confirm-publish-page-with-linked-material-dialog";
import ConfirmPublishRemovePageWithLinkedAnswersDialog from "./confirm-remove-page-with-linked-answers-dialog";
import equals = require("deep-equal");
import Tabs, { Tab } from "~/components/general/tabs";
import AddProducer from "~/components/general/add-producer";
import LicenseSelector from "~/components/general/license-selector";
import FileUploader from "~/components/general/file-uploader";
import { PageLocation, UploadingValue } from "~/@types/shared";
import {
  setWorkspaceMaterialEditorState,
  updateWorkspaceMaterialContentNode,
  createWorkspaceMaterialAttachment,
  requestWorkspaceMaterialContentNodeAttachments,
  CreateWorkspaceMaterialAttachmentTriggerType,
  RequestWorkspaceMaterialContentNodeAttachmentsTriggerType,
  SetWorkspaceMaterialEditorStateTriggerType,
  UpdateWorkspaceMaterialContentNodeTriggerType,
} from "~/actions/workspaces/material";
import { withTranslation, WithTranslation } from "react-i18next";
import {
  Language,
  MaterialAI,
  MaterialAssigmentType,
  MaterialViewRestriction,
} from "~/generated/client";
import { NumberFormatValues, NumericFormat } from "react-number-format";
import { AppDispatch } from "~/reducers/configureStore";

/**
 * MaterialEditorProps
 */
interface MaterialEditorProps extends WithTranslation {
  setWorkspaceMaterialEditorState: SetWorkspaceMaterialEditorStateTriggerType;
  status: StatusType;
  editorState: WorkspaceMaterialEditorType;
  locale: LocaleState;
  locationPage: PageLocation;
  updateWorkspaceMaterialContentNode: UpdateWorkspaceMaterialContentNodeTriggerType;
  createWorkspaceMaterialAttachment: CreateWorkspaceMaterialAttachmentTriggerType;
  requestWorkspaceMaterialContentNodeAttachments: RequestWorkspaceMaterialContentNodeAttachmentsTriggerType;
}

/**
 * MaterialEditorState
 */
interface MaterialEditorState {
  tab: string;
  producerEntryName: string;
  height: number;
  uploadingValues: UploadingValue[];
}

/**
 * CKEditorConfig
 * @param locale locale
 * @param contextPath contextPath
 * @param workspace workspace
 * @param materialNode materialNode
 * @param disablePlugins disablePlugins
 */
const CKEditorConfig = (
  /* eslint-disable camelcase */
  locale: string,
  contextPath: string,
  workspace: WorkspaceDataType,
  materialNode: MaterialContentNodeWithIdAndLogic,
  disablePlugins: boolean
) => ({
  uploadUrl: `/materialAttachmentUploadServlet/workspace/${workspace.urlName}/materials/${materialNode.path}`,
  linkShowTargetTab: true,
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
  baseHref: `/workspace/${workspace.urlName}/materials/${materialNode.path}/`,
  mathJaxLib: MATHJAXSRC,
  mathJaxClass: "math-tex", // This CANNOT be changed as cke saves this to database as part of documents html (wraps the formula in a span with specified className). Don't touch it! ... STOP TOUCHING IT!
  disallowedContent:
    "*(dialog*, bubble*, button*, avatar*, pager*, panel*, tab*, zoom*, card*, carousel*, course*, message*, drawer*, filter*, footer*, label*, link*, menu*, meta*, navbar*, toc*, application*); *[-*]; *[--*]; *[on*]; *{white-space}; *{flex*};",
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
        "Muikku-details",
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
        "muikku-journalfield",
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
        "Blockquote",
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
  resize_enabled: false,
  removePlugins: "image,exportpdf,wsc",
  extraPlugins: disablePlugins
    ? "divarea,language,oembed,audio,image2,muikku-embedded,muikku-image-details,muikku-image-target,muikku-word-definition,muikku-audio-defaults,muikku-image-target,widget,lineutils,filetools,uploadwidget,uploadimage,muikku-mathjax,muikku-details"
    : "divarea,language,oembed,audio,image2,muikku-embedded,muikku-image-details,muikku-image-target,muikku-word-definition,muikku-audio-defaults,muikku-image-target,widget,lineutils,filetools,uploadwidget,uploadimage,muikku-fields,muikku-textfield,muikku-memofield,muikku-filefield,muikku-audiofield,muikku-selection,muikku-connectfield,muikku-organizerfield,muikku-sorterfield,muikku-mathexercisefield,muikku-mathjax,muikku-journalfield,muikku-details",
});

type PageTypeLocales =
  | "labels.exercise"
  | "labels.evaluable"
  | "labels.journalAssignment"
  | "labels.interimEvaluation"
  | "labels.theoryPage";

type RestrictTypeLocales =
  | "labels.visibleRestrictionAll"
  | "labels.visibleRestrictionLoggedIn"
  | "labels.visibleRestrictionMembers";

/**
 * MaterialPageTypeConfig
 */
interface MaterialPageTypeConfig {
  type: MaterialAssigmentType | null;
  classNameMod: string;
  text: PageTypeLocales;
}

/**
 * MaterialRestrictTypeConfig
 */
interface MaterialRestrictTypeConfig {
  type: MaterialViewRestriction | null;
  classNameMod: string;
  text: RestrictTypeLocales;
}

const MATERIAL_RESTRICT_TYPE_CONFIGS: MaterialRestrictTypeConfig[] = [
  {
    type: MaterialViewRestriction.None,
    classNameMod: "restrict-type-dropdown-enabled",
    text: "labels.visibleRestrictionAll",
  },
  {
    type: MaterialViewRestriction.LoggedIn,
    classNameMod: "restrict-type-dropdown-disabled",
    text: "labels.visibleRestrictionLoggedIn",
  },
  {
    type: MaterialViewRestriction.WorkspaceMembers,
    classNameMod: "restrict-type-dropdown-members-only",
    text: "labels.visibleRestrictionMembers",
  },
];

const MATERIAL_PAGE_TYPE_CONFIGS: MaterialPageTypeConfig[] = [
  {
    type: "EXERCISE",
    classNameMod: "material-editor-dropdown-exercise",
    text: "labels.exercise",
  },
  {
    type: "EVALUATED",
    classNameMod: "material-editor-dropdown-assignment",
    text: "labels.evaluable",
  },
  {
    type: "JOURNAL",
    classNameMod: "material-editor-dropdown-journal",
    text: "labels.journalAssignment",
  },
  {
    type: "INTERIM_EVALUATION",
    classNameMod: "material-editor-dropdown-interim-evaluation",
    text: "labels.interimEvaluation",
  },
  {
    type: null,
    classNameMod: "material-editor-dropdown-theory",
    text: "labels.theoryPage",
  },
];

/* eslint-enable camelcase */

// First we need to modify the material content nodes end point to be able to receive hidden
// nodes, we need those to be able to modify here
/**
 * MaterialEditor
 */
class MaterialEditor extends React.Component<
  MaterialEditorProps,
  MaterialEditorState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: MaterialEditorProps) {
    super(props);
    this.toggleHiddenStatus = this.toggleHiddenStatus.bind(this);
    // this.cycleViewRestrictionStatus =
    //   this.cycleViewRestrictionStatus.bind(this);
    this.cycleCorrectAnswers = this.cycleCorrectAnswers.bind(this);
    this.updateContent = this.updateContent.bind(this);
    this.updateTitle = this.updateTitle.bind(this);
    this.updateMaterialAiUse = this.updateMaterialAiUse.bind(this);
    this.updateMaxPoints = this.updateMaxPoints.bind(this);
    this.updateTitleLanguage = this.updateTitleLanguage.bind(this);
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
    const offset = 40;
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
   * @param offset offset
   */
  updateHeight(offset?: number) {
    const heightOffset: number = offset ? offset : 0;
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
   * cycleAssignmentType
   * @param type type
   * @param onClose onClose
   */
  handleChangeAssignmentType =
    (type: MaterialAssigmentType, onClose: () => void) =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      this.props.updateWorkspaceMaterialContentNode({
        workspace: this.props.editorState.currentNodeWorkspace,
        material: this.props.editorState.currentDraftNodeValue,
        update: {
          assignmentType: type,
        },
        isDraft: true,
      });
      onClose();
    };

  /**
   * handleChangeRestrictType
   * @param type type
   * @param onClose onClose
   */
  handleChangeRestrictType =
    (type: MaterialViewRestriction, onClose: () => void) =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      this.props.updateWorkspaceMaterialContentNode({
        workspace: this.props.editorState.currentNodeWorkspace,
        material: this.props.editorState.currentDraftNodeValue,
        update: {
          viewRestrict: type,
        },
        isDraft: true,
      });
      onClose();
    };

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
   * @param e e
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
   * updateTitleLanguage
   * @param e e
   */
  updateTitleLanguage(e: React.ChangeEvent<HTMLSelectElement>) {
    this.props.updateWorkspaceMaterialContentNode({
      workspace: this.props.editorState.currentNodeWorkspace,
      material: this.props.editorState.currentDraftNodeValue,
      update: {
        titleLanguage:
          e.currentTarget.value !== ""
            ? (e.currentTarget.value as Language)
            : null,
      },
      isDraft: true,
    });
  }

  /**
   * updateMaterialAiUse
   * @param e e
   */
  updateMaterialAiUse(e: React.ChangeEvent<HTMLSelectElement>) {
    this.props.updateWorkspaceMaterialContentNode({
      workspace: this.props.editorState.currentNodeWorkspace,
      material: this.props.editorState.currentDraftNodeValue,
      update: {
        ai:
          e.currentTarget.value !== ""
            ? (e.currentTarget.value as MaterialAI)
            : null,
      },
      isDraft: true,
    });
  }

  /**
   * updateMaxPoints
   * @param values values
   */
  updateMaxPoints = (values: NumberFormatValues) => {
    this.props.updateWorkspaceMaterialContentNode({
      workspace: this.props.editorState.currentNodeWorkspace,
      material: this.props.editorState.currentDraftNodeValue,
      update: {
        // With two decimal places
        maxPoints: values.floatValue,
      },
      isDraft: true,
    });
  };

  /**
   * updateContent
   * @param content content
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
   * @param index index
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
   * @param name name
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
   * @param newLicense newLicense
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
   * updateUploadingValues
   * @param updatedValues updatedValues
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
   * @param percent percent
   * @returns progress string
   */
  handleUploadingTextProcesser = (percent: number) => `
      ${this.props.t("content.statusUploading", {
        ns: "materials",
        progress: percent,
      })}`;

  /**
   * onClickClose
   */
  onClickClose = () => {
    this.close();
  };

  /**
   * onTabChange
   * @param tab tab
   */
  onTabChange(tab: string) {
    this.setState({ tab });
  }

  /**
   * onFilesUpload
   * @param e e
   */
  onFilesUpload(e: React.ChangeEvent<HTMLInputElement>) {
    this.props.createWorkspaceMaterialAttachment(
      {
        workspace: this.props.editorState.currentNodeWorkspace,
        material: this.props.editorState.currentNodeValue,
        files: Array.from(e.target.files),
        uploadingValues: [...this.state.uploadingValues].concat(
          Array.from(e.target.files).map((file) => ({
            name: file.name,
            contentType: file.type,
            progress: 0,
            file,
          }))
        ),
        /**
         * success
         */
        success: () => {
          this.setState({
            uploadingValues: [],
          });
        },
        /**
         * fail
         */
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
   * restrictType
   * @returns restrictType
   */
  restrictType = () => {
    if (this.props.editorState.currentDraftNodeValue.viewRestrict) {
      switch (this.props.editorState.currentDraftNodeValue.viewRestrict) {
        case MaterialViewRestriction.None:
          return "enabled";

        case MaterialViewRestriction.WorkspaceMembers:
          return "members-only";

        case MaterialViewRestriction.LoggedIn:
          return "disabled";

        default:
          return "none";
      }
    }
    return "none";
  };

  /**
   * assignmentPageType
   * @returns assignment page type
   */
  assignmentPageType = () => {
    if (this.props.editorState.currentDraftNodeValue.assignmentType) {
      switch (this.props.editorState.currentDraftNodeValue.assignmentType) {
        case MaterialAssigmentType.Exercise:
          return "exercise";

        case MaterialAssigmentType.Evaluated:
          return "assignment";

        case MaterialAssigmentType.Journal:
          return "journal";

        case MaterialAssigmentType.InterimEvaluation:
          return "interim-evaluation";

        default:
          return "theory";
      }
    }
    return "theory";
  };

  /**
   * renderRestrictTypeButton
   * @param materialRestrictConfig materialRestrictConfig
   * @param key key
   * @param onClose onClose
   * @returns renderRestrictTypeButton
   */
  renderRestrictTypeButton = (
    materialRestrictConfig: MaterialRestrictTypeConfig,
    key: string | number,
    onClose: () => void
  ) => {
    const { type, classNameMod, text } = materialRestrictConfig;

    const isActive =
      this.props.editorState.currentDraftNodeValue.viewRestrict === type;

    const restrictTypeClassName = classNameMod ? "link--" + classNameMod : "";

    const activePageTypeClassName = isActive
      ? "link--material-editor-dropdown-active"
      : "";

    return (
      <Link
        key={key}
        className={`link link--full link--material-editor-dropdown ${restrictTypeClassName} ${activePageTypeClassName}`}
        onClick={this.handleChangeRestrictType(type, onClose)}
      >
        <span className="link__icon icon-restriction"></span>
        <span>
          {this.props.t(text, {
            ns: "materials",
          })}
        </span>
      </Link>
    );
  };

  /**
   * renderAssignmentPageButton
   * @param materialPageConfig materialPageConfig
   * @param key key
   * @param onClose onClose
   * @returns assignment page type button
   */
  renderAssignmentPageButton = (
    materialPageConfig: MaterialPageTypeConfig,
    key: string | number,
    onClose: () => void
  ) => {
    const { assignmentType } = this.props.editorState.currentDraftNodeValue;

    const currentAssignmentType = assignmentType || null;

    const isActive = currentAssignmentType === materialPageConfig.type;

    const activePageTypeClassName = isActive
      ? "link--material-editor-dropdown-active"
      : "";

    const pageTypeClassName = materialPageConfig.classNameMod
      ? "link--" + materialPageConfig.classNameMod
      : "";

    return (
      <Link
        key={key}
        className={`link link--full link--material-editor-dropdown ${pageTypeClassName} ${activePageTypeClassName}`}
        onClick={this.handleChangeAssignmentType(
          materialPageConfig.type,
          onClose
        )}
      >
        <span className="link__icon icon-puzzle"></span>
        <span>
          {this.props.t(materialPageConfig.text, { ns: "materials" })}
        </span>
      </Link>
    );
  };

  /**
   * render
   */
  render() {
    const { t } = this.props;

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

    const materialPageType = this.assignmentPageType();

    const assignmentPageType = "material-editor-" + materialPageType;

    const restrictType = this.restrictType();

    const restrictTypeClassName = "material-editor-" + restrictType;

    const comparerPoints: (keyof MaterialContentNodeWithIdAndLogic)[] = [
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
      "titleLanguage",
      "maxPoints",
      "ai",
    ];

    let canPublish = false;
    for (const point of comparerPoints) {
      if (
        !equals(
          this.props.editorState.currentNodeValue[point],
          this.props.editorState.currentDraftNodeValue[point]
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
        ? t("labels.showAnswersAlways", { ns: "materials" })
        : this.props.editorState.currentDraftNodeValue.correctAnswers ===
            "ON_REQUEST"
          ? t("labels.showAnswersOnRequest", { ns: "materials" })
          : t("labels.showAnswersNever", { ns: "materials" });

    const editorButtonSet = (
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
                  ? t("labels.setVisible", { ns: "materials" })
                  : t("labels.hide", { ns: "materials" })
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
              openByHover={false}
              modifier="material-editor-restriction-type"
              persistent
              items={MATERIAL_RESTRICT_TYPE_CONFIGS.map(
                (config, index) => (closeDropdown: () => void) =>
                  this.renderRestrictTypeButton(config, index, closeDropdown)
              )}
            >
              <ButtonPill
                buttonModifiers={[
                  "material-editor-restrict-page",
                  "material-editor",
                  restrictTypeClassName,
                ]}
                icon="restriction"
              />
            </Dropdown>
          ) : null}
          {this.props.editorState.canChangePageType ? (
            <Dropdown
              modifier="material-editor-page-type"
              openByHover={false}
              persistent
              items={MATERIAL_PAGE_TYPE_CONFIGS.map(
                (config, index) => (closeDropdown: () => void) =>
                  this.renderAssignmentPageButton(config, index, closeDropdown)
              )}
            >
              <ButtonPill
                buttonModifiers={[
                  "material-editor-change-page-type",
                  "material-editor",
                  assignmentPageType,
                ]}
                icon="puzzle"
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
              content={t("labels.publish", { ns: "materials" })}
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
              content={t("actions.revert", { ns: "materials" })}
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
                content={t("labels.remove", { ns: "materials" })}
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

    const closeDialog = (
      <ButtonPill
        buttonModifiers={[
          "material-page-close-editor",
          "material-page-close-mobile-editor",
        ]}
        onClick={this.onClickClose}
        icon="arrow-left"
      />
    );

    const materialEditorTabs: Tab[] = [
      {
        id: "content",
        type: "material-editor",
        mobileAction: closeDialog,
        name: t("labels.content"),
        component: (
          <div className="material-editor__content-wrapper">
            {editorButtonSet}

            {this.props.editorState.canSetTitle ? (
              <div className="form__row">
                <div className="form-element">
                  <input
                    className="form-element__input form-element__input--material-editor-title"
                    onChange={this.updateTitle}
                    value={this.props.editorState.currentDraftNodeValue.title}
                  ></input>
                </div>
              </div>
            ) : null}

            {(this.props.editorState.section ||
              this.props.locationPage === "Home") && (
              <div className="material-editor__sub-section">
                <h3 className="material-editor__sub-title">
                  {this.props.i18n.t("labels.language")}
                </h3>
                <div className="material-editor__select-locale-container">
                  <div className="form__row">
                    <div className="form-element">
                      <select
                        className="form-element__select form-element__select--material-editor"
                        onChange={this.updateTitleLanguage}
                        value={
                          this.props.editorState.currentDraftNodeValue
                            .titleLanguage || ""
                        }
                      >
                        <option value="">
                          {this.props.i18n.t("labels.inherited", {
                            ns: "workspace",
                          })}
                        </option>
                        {languageOptions.map((language: string) => (
                          <option key={language} value={language}>
                            {this.props.i18n.t("labels.language", {
                              context: language,
                              ns: "workspace",
                            })}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

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
      materialEditorTabs.push({
        id: "metadata",
        type: "material-editor",
        mobileAction: closeDialog,
        name: t("labels.metaData", { ns: "materials" }),
        component: (
          <div className="material-editor__content-wrapper">
            {editorButtonSet}

            {this.props.editorState.canSetProducers ? (
              <div className="material-editor__sub-section">
                <h3 className="material-editor__sub-title">
                  {t("labels.producers", { ns: "users" })}
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
                    />
                  </div>
                ) : null}
              </div>
            ) : null}

            {this.props.editorState.canSetLicense ? (
              <div className="material-editor__sub-section">
                <h3 className="material-editor__sub-title">
                  {t("labels.license", { ns: "workspace" })}
                </h3>
                <div className="material-editor__add-license-container">
                  <LicenseSelector
                    wcagLabel="materialLicense"
                    wcagDesc={t("wcag.materialLicense", { ns: "workspace" })}
                    modifier="material-editor"
                    value={this.props.editorState.currentDraftNodeValue.license}
                    onChange={this.updateLicense}
                  />
                </div>
              </div>
            ) : null}

            <div className="material-editor__sub-section">
              <h3 className="material-editor__sub-title">
                {this.props.i18n.t("labels.language")}
              </h3>
              <div className="material-editor__select-locale-container">
                <div className="form__row">
                  <div className="form-element">
                    <select
                      className="form-element__select form-element__select--material-editor"
                      onChange={this.updateTitleLanguage}
                      value={
                        this.props.editorState.currentDraftNodeValue
                          .titleLanguage || ""
                      }
                    >
                      <option value="">
                        {this.props.i18n.t("labels.inherited", {
                          ns: "workspace",
                        })}
                      </option>
                      {languageOptions.map((language: string) => (
                        <option key={language} value={language}>
                          {this.props.i18n.t("labels.language", {
                            context: language,
                            ns: "workspace",
                          })}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="material-editor__sub-section">
              <h3 className="material-editor__sub-title">
                {this.props.i18n.t("labels.materialAiUse", { ns: "materials" })}
              </h3>
              <div className="material-editor__select-locale-container">
                <div className="form__row">
                  <div className="form-element">
                    <select
                      className="form-element__select form-element__select--material-editor"
                      onChange={this.updateMaterialAiUse}
                      value={
                        this.props.editorState.currentDraftNodeValue.ai || ""
                      }
                    >
                      <option value="">
                        {this.props.i18n.t("labels.materialAiNotDefined", {
                          ns: "materials",
                        })}
                      </option>
                      <option value="ALLOWED">
                        {this.props.i18n.t("labels.materialAiAllowed", {
                          ns: "materials",
                        })}
                      </option>
                      <option value="DISALLOWED">
                        {this.props.i18n.t("labels.materialAiDisallowed", {
                          ns: "materials",
                        })}
                      </option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div className="material-editor__sub-section">
              <h3 className="material-editor__sub-title">
                {this.props.i18n.t("labels.pointsMax", { ns: "workspace" })}
              </h3>
              <div className="material-editor__select-locale-container">
                <div className="form__row">
                  <div className="form-element">
                    <NumericFormat
                      className="form-element__input form-element__input--material-editor-assignment-points"
                      value={
                        this.props.editorState.currentDraftNodeValue.maxPoints
                      }
                      decimalScale={2}
                      decimalSeparator=","
                      allowNegative={false}
                      onValueChange={this.updateMaxPoints}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        ),
      });
    }

    if (this.props.editorState.canAddAttachments) {
      materialEditorTabs.push({
        id: "attachments",
        type: "material-editor",
        mobileAction: closeDialog,
        name: t("labels.attachments", { ns: "materials" }),
        component: (
          <div className="material-editor__content-wrapper">
            {editorButtonSet}

            <FileUploader
              uploadingValues={this.state.uploadingValues}
              onFileInputChange={this.onFilesUpload}
              modifier="material-editor"
              displayNotificationOnError
              fileTooLargeErrorText={t("notifications.sizeTooLarge", {
                ns: "files",
              })}
              files={
                this.props.editorState.currentNodeValue.childrenAttachments
              }
              fileIdKey="materialId"
              fileNameKey="title"
              fileUrlGenerator={(a) =>
                `/workspace/${this.props.editorState.currentNodeWorkspace.urlName}/materials/${a.path}`
              }
              deleteDialogElement={ConfirmRemoveAttachment}
              hintText={t("content.add", { ns: "materials", context: "file" })}
              deleteFileText={t("actions.remove")}
              downloadFileText={t("actions.download")}
              notificationOfSuccessText={t("notifications.uploadSuccess", {
                ns: "files",
              })}
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
          tabs={materialEditorTabs}
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
        <ConfirmPublishRemovePageWithLinkedAnswersDialog />
      </div>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    editorState: state.workspaces.materialEditor,
    status: state.status,
    locale: state.locales,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: AppDispatch) {
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

export default withTranslation(["materials", "files", "workspace", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(MaterialEditor)
);
