/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-string-refs */

/**
 * Depcrecated refs should be refactored
 */

import equals = require("deep-equal");
import * as React from "react";
import getCKEDITOR, { CKEDITOR_VERSION } from "~/lib/ckeditor";
import { v4 as uuidv4 } from "uuid";

//TODO this ckeditor depends externally on CKEDITOR we got to figure out a way to represent an internal dependency
//Right now it doesn't make sense to but once we get rid of all the old js code we should get rid of these
//as well as the external jquery dependency (jquery is available in npm)

const PLUGINS = {
  widget: `//cdn.muikkuverkko.fi/libs/ckeditor-plugins/widget/${CKEDITOR_VERSION}/`,
  lineutils: `//cdn.muikkuverkko.fi/libs/ckeditor-plugins/lineutils/${CKEDITOR_VERSION}/`,
  filetools: `//cdn.muikkuverkko.fi/libs/ckeditor-plugins/filetools/${CKEDITOR_VERSION}/`,
  notification: `//cdn.muikkuverkko.fi/libs/ckeditor-plugins/notification/${CKEDITOR_VERSION}/`,
  notificationaggregator: `//cdn.muikkuverkko.fi/libs/ckeditor-plugins/notificationaggregator/${CKEDITOR_VERSION}/`,
  uploadwidget: `//cdn.muikkuverkko.fi/libs/ckeditor-plugins/uploadwidget/${CKEDITOR_VERSION}/`,
  uploadimage: `//cdn.muikkuverkko.fi/libs/ckeditor-plugins/uploadimage/${CKEDITOR_VERSION}/`,
  autogrow: `//cdn.muikkuverkko.fi/libs/ckeditor-plugins/autogrow/${CKEDITOR_VERSION}/`,
  divarea: `//cdn.muikkuverkko.fi/libs/ckeditor-plugins/divarea/${CKEDITOR_VERSION}/`,
  language: `//cdn.muikkuverkko.fi/libs/ckeditor-plugins/language/${CKEDITOR_VERSION}/`,
  image2: `//cdn.muikkuverkko.fi/libs/ckeditor-plugins/image2/${CKEDITOR_VERSION}/`,
  oembed: "//cdn.muikkuverkko.fi/libs/ckeditor-plugins/oembed/1.17/",
  audio: "//cdn.muikkuverkko.fi/libs/ckeditor-plugins/audio/1.0.1/",
  scayt: `//cdn.muikkuverkko.fi/libs/ckeditor-plugins/scayt/${CKEDITOR_VERSION}/`,

  // CONTEXTPATHREMOVED
  "muikku-comment": "/scripts/ckplugins/muikku-comment/",
  "muikku-mathjax": "/scripts/ckplugins/muikku-mathjax/",
  "muikku-fields": "/scripts/ckplugins/muikku-fields/",
  "muikku-selection": "/scripts/ckplugins/muikku-selection/",
  "muikku-textfield": "/scripts/ckplugins/muikku-textfield/",
  "muikku-memofield": "/scripts/ckplugins/muikku-memofield/",
  "muikku-filefield": "/scripts/ckplugins/muikku-filefield/",
  "muikku-audiofield": "/scripts/ckplugins/muikku-audiofield/",
  "muikku-connectfield": "/scripts/ckplugins/muikku-connectfield/",
  "muikku-organizerfield": "/scripts/ckplugins/muikku-organizerfield/",
  "muikku-sorterfield": "/scripts/ckplugins/muikku-sorterfield/",
  "muikku-mathexercisefield": "/scripts/ckplugins/muikku-mathexercisefield/",
  "muikku-image-details": "/scripts/ckplugins/muikku-image-details/",
  "muikku-word-definition": "/scripts/ckplugins/muikku-word-definition/",
  "muikku-audio-defaults": "/scripts/ckplugins/muikku-audio-defaults/",
  "muikku-image-target": "/scripts/ckplugins/muikku-image-target/",
  "muikku-embedded": "/scripts/ckplugins/muikku-embedded/",
  "muikku-journalfield": "/scripts/ckplugins/muikku-journalfield/",
  "muikku-details": "/scripts/ckplugins/muikku-details/",
};
const pluginsLoaded: any = {};

/**
 * CKEditorKeyEventInfo interface definition
 */
export interface CKEditorKeyEventInfo {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editor: any;
  data: {
    keyCode: number;
  };
  // eslint-disable-next-line jsdoc/require-jsdoc
  cancel(): void;
}

/**
 * CKEditorPasteEventInfo interface definition
 */
export interface CKEditorPasteEventInfo {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  editor: any;
  data: {
    dataValue: string;
  };
  // eslint-disable-next-line jsdoc/require-jsdoc
  cancel(): void;
}

/**
 * CKEditorEventInfo class definition
 */
// export interface CKEditorEventInfo {
//   // eslint-disable-next-line @typescript-eslint/no-explicit-any
//   editor: any;
//   data: {
//     dataValue: string;
//   };
//   /**
//    * cancel method
//    */
//   cancel(): void;
//   /**
//    * stop method
//    */
//   stop(): void;
// }

/**
 * CKEditorProps
 */
interface CKEditorProps {
  configuration?: any;
  ancestorHeight?: number;
  onChange: (arg: string) => any;
  onKey?: (event: CKEditorKeyEventInfo) => void;
  onPaste?: (event: CKEditorPasteEventInfo) => void;
  onDrop?: () => any;
  children?: string;
  autofocus?: boolean;
  editorTitle?: string;
  rows?: number;
}

/**
 * CKEditorState
 */
interface CKEditorState {
  contentHeight: number;
}

/**
 * extraConfig
 * @param props props
 * @returns CKEditor config object
 */
const extraConfig = (props: CKEditorProps) => ({
  /* eslint-disable camelcase */
  startupFocus: props.autofocus,
  title: props.editorTitle ? props.editorTitle : "",

  /**
   * We allow style attribute for every element that can be pasted/added to the CKEditor.
   * There is no need to use allowContent: true setting as it will disable ACF alltogether.
   * Therefore we let ACF to work on it's default filtering settings which are based on the toolbar settings.
   */
  extraAllowedContent:
    "*{*}; *[data*]; audio source[*](*){*}; mark; details(*); summary(*);",

  /**
   * We remove every class attribute from every html element and every on* prefixed attributes as well as everything related to font stylings.
   * This sanitation happen during pasting so custom div styles are unaffected.
   */
  disallowedContent:
    "*(dialog*, bubble*, button*, avatar*, pager*, panel*, tab*, zoom*, card*, carousel*, course*, message*, drawer*, filter*, footer*, label*, link*, menu*, meta*, navbar*, toc*, application*); *[on*]; *{-*}; *{--*}; *{font*}; *{margin*}; *{padding*}; *{list*}; *{line-height}; *{white-space}; *{vertical-*}; *{flex*};",

  entities_latin: false,
  entities_greek: false,
  format_tags: "p;h3;h4",
  scayt_sLang: "fi_FI",
  resize_enabled: true,
  entities: false,
  toolbar: [
    {
      name: "clipboard",
      items: ["Cut", "Copy", "Paste", "-", "Undo", "Redo"],
    },
    {
      name: "editing",
      items: ["Find", "-", "SelectAll", "-", "Scayt"],
    },
    {
      name: "basicstyles",
      items: ["Bold", "Italic", "Underline", "Strike", "RemoveFormat"],
    },
    { name: "links", items: ["Link"] },
    {
      name: "insert",
      items: ["Image", "Smiley", "SpecialChar"],
    },
    { name: "colors", items: ["TextColor", "BGColor"] },
    { name: "styles", items: ["Format"] },
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
    { name: "tools", items: ["Maximize"] },
  ],
  uploadUrl: "/communicatorAttachmentUploadServlet",
  extraPlugins:
    "widget,lineutils,filetools,notification,notificationaggregator,uploadwidget,uploadimage,divarea,scayt",
  removePlugins: "exportpdf,wsc",
  /* eslint-enable camelcase */
});

/**
 * CKEditor
 */
export default class CKEditor extends React.Component<
  CKEditorProps,
  CKEditorState
> {
  private name: string;
  private currentData: string;

  private cancelChangeTrigger: boolean;
  private timeout: NodeJS.Timer;
  private timeoutProps: CKEditorProps;
  private previouslyAppliedConfig: any;

  /**
   * constructor
   * @param props props
   */
  constructor(props: CKEditorProps) {
    super(props);

    this.name = "ckeditor-" + uuidv4();
    this.currentData = props.children || "";

    //CKeditor tends to trigger change on setup for no reason at all
    //we don't expect the user to type anything at all when ckeditor is starting up
    this.cancelChangeTrigger = true;

    this.onDataChange = this.onDataChange.bind(this);
  }

  /**
   * componentDidMount
   */
  componentDidMount() {
    this.setupCKEditor();
  }

  /**
   * componentWillUnmount
   */
  componentWillUnmount() {
    if (this.props.configuration && this.props.configuration.baseHref) {
      const base = document.getElementById("basehref") as HTMLBaseElement;
      if (base) {
        document.head.removeChild(base);
      }
    }

    if (!getCKEDITOR()) {
      clearTimeout(this.timeout);
      return;
    }
    if (getCKEDITOR().instances[this.name]) {
      getCKEDITOR().instances[this.name].destroy();
    }
  }

  /**
   * UNSAFE_componentWillReceiveProps
   * @param nextProps nextProps
   */
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps: CKEditorProps) {
    if (this.timeoutProps) {
      this.timeoutProps = nextProps;
      return;
    }
    const configObj = {
      ...extraConfig(nextProps),
      ...(nextProps.configuration || {}),
    };

    const instance = getCKEDITOR().instances[this.name];

    if (!equals(configObj, this.previouslyAppliedConfig)) {
      instance.destroy();
      this.setupCKEditor(nextProps);
    } else if ((nextProps.children || "") !== this.currentData) {
      this.currentData = nextProps.children || "";
      this.enableCancelChangeTrigger();

      // Reset undo history to prevent undo history from being corrupted when setting data
      instance.setData(nextProps.children || "", {
        // eslint-disable-next-line jsdoc/require-jsdoc
        callback: function () {
          instance.resetUndo();
        },
      });
    }
  }

  /**
   * shouldComponentUpdate
   * @returns boolean
   */
  shouldComponentUpdate() {
    //this element is managed from UNSAFE_componentWillReceiveProps
    return false;
  }

  /**
   * onDataChange
   * @param props props
   */
  onDataChange(props: CKEditorProps = this.props) {
    if (this.cancelChangeTrigger) {
      return;
    }

    const instance = getCKEDITOR().instances[this.name];
    if (!instance) {
      return;
    }
    const data = instance.getData();
    if (data !== this.currentData) {
      this.currentData = data;
      props.onChange(data);
    }
  }

  /**
   * setupCKEditor
   * @param props props
   */
  setupCKEditor(props: CKEditorProps = this.props) {
    const configObj = { ...extraConfig(props), ...(props.configuration || {}) };
    if (!getCKEDITOR()) {
      this.timeoutProps = props;
      this.timeout = setTimeout(() => {
        this.setupCKEditor(this.timeoutProps);
      }, 10) as any;
      return;
    }

    this.timeoutProps = null;
    this.previouslyAppliedConfig = configObj;

    const allPlugins = configObj.extraPlugins.split(",");
    for (const plugin of allPlugins) {
      if (!pluginsLoaded[plugin]) {
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

    // On change, we need to check if the user has exceeded the limit of characters or words
    getCKEDITOR().instances[this.name].on("change", () => {
      this.onDataChange();
    });

    // On key, we need to check if the user has exceeded the limit of characters or words
    getCKEDITOR().instances[this.name].on(
      "key",
      (evt: CKEditorKeyEventInfo) => {
        this.cancelChangeTrigger = false;
        this.props.onKey && this.props.onKey(evt);
      }
    );

    // On paste, we need to check if the user has exceeded the limit of characters or words
    getCKEDITOR().instances[this.name].on(
      "paste",
      (evt: CKEditorPasteEventInfo) => {
        this.props.onPaste && this.props.onPaste(evt);
      }
    );

    getCKEDITOR().instances[this.name].on("instanceReady", (ev: any) => {
      ev.editor.document.on("drop", () => {
        this.props.onDrop && this.props.onDrop();
        setTimeout(this.onDataChange, 1000);
        setTimeout(this.onDataChange, 2000);
        setTimeout(this.onDataChange, 3000);
      });
      ev.editor.document.on("paste", () => {
        // Image paste still needs delayed getData; limit policy lives on editor "paste" above
        setTimeout(this.onDataChange, 1000);
        setTimeout(this.onDataChange, 2000);
        setTimeout(this.onDataChange, 3000);
      });

      const instance = getCKEDITOR().instances[this.name];
      this.enableCancelChangeTrigger();

      let contentHeight: number;

      // Height calculation order if rows are used:
      if (typeof this.props.rows === "number" && this.props.rows > 0) {
        // Match memofield.scss line-heights: 1.25rem default, 1.75rem from $breakpoint-pad (48em)
        const rootFontSize =
          parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
        const isPadUp = window.matchMedia("(min-width: 48em)").matches;
        const lineHeightPx = (isPadUp ? 1.75 : 1.25) * rootFontSize;
        // Approximate vertical padding of .cke_editable / memofield content area
        const verticalPaddingPx = 16;
        contentHeight = Math.round(
          this.props.rows * lineHeightPx + verticalPaddingPx
        );
      } else {
        // Height calculation order if rows are not used:
        const ckeTopHeight =
          instance.container.$.querySelector(
            ".cke_inner"
          ).childNodes[0].getBoundingClientRect().height;

        const ckeBottomHeight =
          instance.container.$.querySelector(
            ".cke_inner"
          ).childNodes[2].getBoundingClientRect().height;

        // Generic 2px border on all sides; (2 * 2) is retracted from container-based height calc
        const ckeBorder = 4;

        // We need to retract the ckeTop and ckeBottom height form the overall cke height, if we don't then the cke container's height will be translated to
        // cke_contents element and it will cause the editor to overflow the screen in mobile views.
        const height = this.props.ancestorHeight
          ? this.props.ancestorHeight
          : instance.container.$.getBoundingClientRect().height -
            ckeTopHeight -
            ckeBottomHeight -
            ckeBorder;

        // CKE content-element id (needed for ancestorHeight offset)
        const contentElementId: string = instance.id + "_contents";

        // CKeditor offset from top when ancestor height is given, when there's no ancestor height provided, it is supposed no offset is needed

        const contentElementOffset: number = this.props.ancestorHeight
          ? document.getElementById(contentElementId).offsetTop
          : 0;

        contentHeight = height - contentElementOffset;
      }

      // Resize editable contents area (isContentHeight = true)
      instance.resize("100%", contentHeight, true);

      // This prevents empty children from overriding current data.
      // It is a problem in the workspace management where the props
      // are at an initial empty state when the editor is setup
      // current data gets overridden by the empty children
      // I did not find any case where this would break anything

      if ((props.children || "").trim() !== "") {
        // Reset undo history to prevent undo history from being corrupted when setting data
        instance.setData(props.children || "", {
          // eslint-disable-next-line jsdoc/require-jsdoc
          callback: function () {
            instance.resetUndo();
          },
        });
      }

      //TODO somehow, the autofocus doesn't focus in the last row but in the first
      //Ckeditor hasn't implemented the feature, it must be hacked in, somehow
    });
  }

  /**
   * updateCKEditor
   * @param data data
   */
  updateCKEditor(data: string) {
    if (!getCKEDITOR()) {
      return;
    }
    getCKEDITOR().instances[this.name].setData(data);
  }

  /**
   * enableCancelChangeTrigger
   */
  enableCancelChangeTrigger() {
    setTimeout(() => {
      this.cancelChangeTrigger = false;
    }, 300);
    this.cancelChangeTrigger = true;
  }

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    return (
      <div className="rs_skip_always" style={{ display: "contents" }}>
        <textarea className="cke" ref="ckeditor" name={this.name} />
      </div>
    );
  }
}
