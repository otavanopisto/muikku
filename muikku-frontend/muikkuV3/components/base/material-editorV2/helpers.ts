import _ from "lodash";
import {
  MaterialAnswersType,
  MaterialAssigmentType,
  MaterialViewRestriction,
} from "~/generated/client";
import { MATHJAXSRC } from "~/lib/mathjax";
import {
  MaterialContentNodeWithIdAndLogic,
  WorkspaceDataType,
} from "~/reducers/workspaces";

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

type AnswersTypeLocales =
  | "labels.showAnswersAlways"
  | "labels.showAnswersOnRequest"
  | "labels.showAnswersNever";

/**
 * MaterialPageTypeConfig
 */
export interface MaterialPageTypeConfig {
  type: MaterialAssigmentType | null;
  classNameMod: string;
  text: PageTypeLocales;
}

/**
 * MaterialRestrictTypeConfig
 */
export interface MaterialRestrictTypeConfig {
  type: MaterialViewRestriction | null;
  classNameMod: string;
  text: RestrictTypeLocales;
}

/**
 * MaterialAnswersTypeConfig
 */
export interface MaterialAnswersTypeConfig {
  type: MaterialAnswersType;
  classNameMod: string;
  text: AnswersTypeLocales;
}

export const MATERIAL_RESTRICT_TYPE_CONFIGS: MaterialRestrictTypeConfig[] = [
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

export const MATERIAL_PAGE_TYPE_CONFIGS: MaterialPageTypeConfig[] = [
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

export const MATERIAL_ANSWERS_TYPE_CONFIGS: MaterialAnswersTypeConfig[] = [
  {
    type: "ALWAYS",
    classNameMod: "material-editor-dropdown-always",
    text: "labels.showAnswersAlways",
  },
  {
    type: "ON_REQUEST",
    classNameMod: "material-editor-dropdown-on-request",
    text: "labels.showAnswersOnRequest",
  },
  {
    type: "NEVER",
    classNameMod: "material-editor-dropdown-never",
    text: "labels.showAnswersNever",
  },
];

/**
 * restrictType
 * @param viewRestrict viewRestrict
 * @returns restrictType
 */
export const restrictType = (viewRestrict: MaterialViewRestriction | null) => {
  if (viewRestrict) {
    switch (viewRestrict) {
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
 * @param assignmentType assignmentType
 * @returns assignment page type
 */
export const assignmentPageType = (
  assignmentType: MaterialAssigmentType | null
) => {
  if (assignmentType) {
    switch (assignmentType) {
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
 * answersType
 * @param correctAnswers correctAnswers
 * @returns answers type
 */
export const answersType = (correctAnswers: MaterialAnswersType | null) => {
  if (correctAnswers) {
    switch (correctAnswers) {
      case "ALWAYS":
        return "always-show";

      case "ON_REQUEST":
        return "on-request";

      case "NEVER":
        return "never-show";
    }
  }
  return "never-show";
};

/**
 * Check if the section or page has changed
 * @param currentNodeValue currentNodeValue
 * @param currentDraftNodeValue currentDraftNodeValue
 * @returns boolean
 */
export const materialSectionOrPageChanges = (
  currentNodeValue: MaterialContentNodeWithIdAndLogic,
  currentDraftNodeValue: MaterialContentNodeWithIdAndLogic
) => {
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
    "exam",
    "examSettings",
    "smowlActivity",
    "smowlFrontCameraAlarm",
    "smowlComputerMonitoringAlarm",
  ];

  let canPublish = false;
  for (const point of comparerPoints) {
    if (!_.isEqual(currentNodeValue[point], currentDraftNodeValue[point])) {
      canPublish = true;
      break;
    }
  }

  return canPublish;
};

/**
 * CKEditorConfig
 * @param locale locale
 * @param contextPath contextPath
 * @param workspace workspace
 * @param materialNode materialNode
 * @param disablePlugins disablePlugins
 */
export const CKEditorConfig = (
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
