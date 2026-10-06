/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
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
 * CKEditor 4.12 init is asynchronous and global.
 *
 * Several memo fields call replace() on the same tick. Extra plugins
 * (widget, image2, divarea, ...) are loaded once for the whole page.
 * Overlapping replace() calls share that loader and then throw:
 * - "can't access property allow, a.filter is undefined"
 * - "can't access property unselectable, a.ui.space(...) is null"
 *
 * Serialize every replace() through this queue. Only one editor may be
 * initializing at a time. The next job starts only after instanceReady
 * (or destroy / watchdog), and always on a later macrotask so we do not
 * re-enter CKEditor from inside instanceReady/setMode.
 */
type ReplaceJob = () => void;

const replaceQueue: ReplaceJob[] = [];

// True while a replace() is running and has not yet been released.
let replaceInFlight = false;
let replaceWatchdog: ReturnType<typeof setTimeout> | null = null;

// If instanceReady never fires, unblock later editors.
const REPLACE_WATCHDOG_MS = 15000;

/**
 * Append a replace job and start the queue if it is idle.
 * @param job job
 */
function enqueueReplace(job: ReplaceJob) {
  replaceQueue.push(job);
  pumpReplaceQueue();
}

/**
 * Run the next job only when no other editor is initializing.
 */
function pumpReplaceQueue() {
  if (replaceInFlight || replaceQueue.length === 0) {
    return;
  }
  replaceInFlight = true;
  const job = replaceQueue.shift();
  job();
}

/**
 * releaseReplaceQueue
 * Mark the current job done and start the next one on a later macrotask.
 *
 * Must not call the next CKEDITOR.replace() synchronously. After the first
 * editor, plugins are already in memory, so replace() runs almost immediately.
 * Starting it from inside instanceReady/setMode re-enters CKEditor 4 while
 * ui.space('top'|'bottom') is still null (Firefox especially).
 */
function releaseReplaceQueue() {
  if (replaceWatchdog) {
    clearTimeout(replaceWatchdog);
    replaceWatchdog = null;
  }
  replaceInFlight = false;
  setTimeout(() => {
    pumpReplaceQueue();
  }, 0);
}

/**
 * Plugin init can throw before instanceReady. Without this the queue
 * stays blocked and every later editor on the page never appears.
 */
function armReplaceWatchdog() {
  if (replaceWatchdog) {
    clearTimeout(replaceWatchdog);
  }
  replaceWatchdog = setTimeout(() => {
    replaceWatchdog = null;
    console.warn("CKEditor replace watchdog: instanceReady did not fire");
    releaseReplaceQueue();
  }, REPLACE_WATCHDOG_MS);
}

/**
 * window.CKEDITOR can exist before replace() is usable.
 * @returns boolean
 */
function isCKEditorReady() {
  const ckeditor = getCKEDITOR();
  return !!(
    ckeditor &&
    typeof ckeditor.replace === "function" &&
    ckeditor.status !== "unloaded"
  );
}

/**
 * Safe lookup: CKEditor or the instance may already be gone
 * @param name name
 * @returns instance or null
 */
function getEditorInstance(name: string) {
  const ckeditor = getCKEDITOR();
  if (!ckeditor || !ckeditor.instances) {
    return null;
  }
  return ckeditor.instances[name] || null;
}

/**
 * Do not destroy() while plugin init is still running. CKEditor deletes
 * editor.filter first; leftover init then throws
 * "can't access property allow, a.filter is undefined".
 *
 * If the instance is already ready, destroy immediately.
 * If not, wait for instanceReady or destroy, with a 2s fallback.
 * @param name name
 * @returns Promise that resolves when the instance is gone
 */
function destroyEditorSafely(name: string): Promise<void> {
  const instance = getEditorInstance(name);
  if (!instance || instance.status === "destroyed") {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    let settled = false;
    // eslint-disable-next-line jsdoc/require-jsdoc
    const finish = () => {
      if (settled) {
        return;
      }
      settled = true;
      const current = getEditorInstance(name);
      try {
        if (current && current.status !== "destroyed") {
          current.destroy();
        }
      } catch (err) {
        console.warn("CKEditor destroy failed", err);
      }
      resolve();
    };
    if (instance.status === "ready") {
      finish();
      return;
    }
    instance.once("instanceReady", finish);
    instance.once("destroy", () => {
      settled = true;
      resolve();
    });
    setTimeout(finish, 2000);
  });
}

/**
 * CKEditorEventInfo class definition
 */
export interface CKEditorEventInfo {
  editor: any;
  data: {
    dataValue: string;
  };
  /**
   * cancel method
   */
  cancel(): void;
  /**
   * stop method
   */
  stop(): void;
}

/**
 * CKEditorProps
 */
interface CKEditorProps {
  configuration?: any;
  ancestorHeight?: number;
  onChange: (arg: string, instance: any) => any;
  onPaste?: () => void;
  onDrop?: () => any;
  children?: string;
  autofocus?: boolean;
  maxChars?: number;
  maxWords?: number;
  editorTitle?: string;
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
  customConfig: "",
  startupFocus: props.autofocus,
  title: props.editorTitle ? props.editorTitle : "",

  /**
   * We allow style attribute for every element that can be pasted/added to the CKEditor.
   * There is no need to use allowContent: true setting as it will disable ACF alltogether.
   * Therefore we let ACF to work on it's default filtering settings which are based on the toolbar settings.
   *
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
  // Ignore queued callbacks after unmount.
  private unmounted: boolean;

  //Bumped on each setup/unmount. Stale queue jobs see a mismatch and
  // release the queue instead of calling replace() on a dead textarea.
  private setupGeneration: number;

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

    this.unmounted = false;
    this.setupGeneration = 0;

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
   * Invalidate pending jobs, then destroy only after init has finished
   * (or the 2s fallback), so we do not tear down editor.filter mid-init.
   */
  componentWillUnmount() {
    this.unmounted = true;
    this.setupGeneration += 1;
    clearTimeout(this.timeout);
    this.timeoutProps = null;
    if (this.props.configuration && this.props.configuration.baseHref) {
      const base = document.getElementById("basehref") as HTMLBaseElement;
      if (base) {
        document.head.removeChild(base);
      }
    }
    void destroyEditorSafely(this.name);
  }

  /**
   * Config change must wait until destroy finishes. The old code called
   * destroy() and replace() in the same turn, which overlaps init.
   * Content-only updates use setData, and only when status is ready.
   * @param nextProps nextProps
   */
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps: CKEditorProps) {
    if (this.unmounted) {
      return;
    }
    if (this.timeoutProps) {
      this.timeoutProps = nextProps;
      return;
    }
    const configObj = {
      ...extraConfig(nextProps),
      ...(nextProps.configuration || {}),
    };
    const instance = getEditorInstance(this.name);
    if (!equals(configObj, this.previouslyAppliedConfig)) {
      const generation = this.setupGeneration;
      void destroyEditorSafely(this.name).then(() => {
        if (this.unmounted || generation !== this.setupGeneration) {
          return;
        }
        this.setupCKEditor(nextProps);
      });
    } else if ((nextProps.children || "") !== this.currentData) {
      this.currentData = nextProps.children || "";
      if (!instance || instance.status !== "ready") {
        return;
      }
      this.enableCancelChangeTrigger();
      instance.setData(nextProps.children || "");
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

    const instance = getEditorInstance(this.name);
    if (!instance || instance.status !== "ready") {
      return;
    }
    const data = instance.getData();
    if (data !== this.currentData) {
      this.currentData = data;
      props.onChange(data, instance);
    }
  }

  /**
   * setupCKEditor
   * @param props props
   */
  setupCKEditor(props: CKEditorProps = this.props) {
    if (this.unmounted) {
      return;
    }
    clearTimeout(this.timeout);
    const configObj = { ...extraConfig(props), ...(props.configuration || {}) };
    if (!isCKEditorReady()) {
      this.timeoutProps = props;
      this.timeout = setTimeout(() => {
        this.setupCKEditor(this.timeoutProps);
      }, 10) as any;
      return;
    }
    this.timeoutProps = null;
    this.previouslyAppliedConfig = configObj;
    const extraPlugins = configObj.extraPlugins || "";
    const allPlugins = extraPlugins
      .split(",")
      .map((plugin: string) => plugin.trim())
      .filter(Boolean);
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

    // Do not call replace() here. Enqueue so this instance waits until
    // any other editor has finished init, then destroy leftovers, then
    // replace. generation catches unmount/recreate while we were waiting.
    const generation = ++this.setupGeneration;
    enqueueReplace(() => {
      if (this.unmounted || generation !== this.setupGeneration) {
        releaseReplaceQueue();
        return;
      }
      void destroyEditorSafely(this.name).then(() => {
        if (this.unmounted || generation !== this.setupGeneration) {
          releaseReplaceQueue();
          return;
        }
        this.replaceCKEditor(props, configObj, generation);
      });
    });
  }

  /**
   * replaceCKEditor
   * @param props props
   * @param configObj configObj
   * @param generation generation
   */
  replaceCKEditor(props: CKEditorProps, configObj: any, generation: number) {
    let instance: any;
    try {
      getCKEDITOR().replace(this.name, configObj);
      instance = getEditorInstance(this.name);
    } catch (err) {
      console.error("CKEditor.replace failed", err);
      releaseReplaceQueue();
      return;
    }
    if (!instance) {
      releaseReplaceQueue();
      return;
    }

    // instanceReady and destroy can both try to free the queue.
    // Only the first one may start the next editor.
    let released = false;
    // eslint-disable-next-line jsdoc/require-jsdoc
    const releaseOnce = () => {
      if (released) {
        return;
      }
      released = true;
      releaseReplaceQueue();
    };

    armReplaceWatchdog();
    // If init throws, instanceReady never runs; destroy still unblocks the queue.
    instance.once("destroy", releaseOnce);

    instance.on("change", () => {
      this.onDataChange();
    });
    instance.on("key", () => {
      this.cancelChangeTrigger = false;
    });

    /**
     * Finish local wiring (drop/paste, height, setData) first.
     * Release the queue in finally — never at the start of this handler —
     * so the next replace() cannot start while we still call setData/resize.
     *
     * If plugins were cached, instanceReady can fire during replace(),
     * before this listener is attached. Callers must also check
     * instance.status === "ready" below.
     * @param ev ev
     */
    const handleInstanceReady = (ev: any) => {
      if (this.unmounted || generation !== this.setupGeneration) {
        void destroyEditorSafely(this.name).then(releaseOnce);
        return;
      }

      try {
        if (ev.editor && ev.editor.document) {
          ev.editor.document.on("drop", () => {
            this.props.onDrop && this.props.onDrop();
            // CKEditor bug, the event of dropping doesn't generate any change
            // to the get data, so I need to wait, I can't tell
            // how much time so, 1, 2, 3 seconds are a guess
            // it might misbehave
            setTimeout(this.onDataChange, 1000);
            setTimeout(this.onDataChange, 2000);
            setTimeout(this.onDataChange, 3000);
          });
          ev.editor.document.on("paste", (event: CKEditorEventInfo) => {
            if (this.props.onPaste && (props.maxChars || props.maxWords)) {
              props.onPaste();
            }
            // Same as above. When pasting an image, onDataChange doesn't fire at all because text hasn't changed.
            // Also, the image has to be uploaded to the server first, hence these timeout shenanigans
            setTimeout(this.onDataChange, 1000);
            setTimeout(this.onDataChange, 2000);
            setTimeout(this.onDataChange, 3000);
          });
        }

        const readyInstance = getEditorInstance(this.name);
        if (
          !readyInstance ||
          !readyInstance.container ||
          !readyInstance.container.$
        ) {
          return;
        }
        this.enableCancelChangeTrigger();

        // Height can be given from the ancestor or from instance container.
        // Instance container is "unstable" and changes according to the content it seems, so for example
        // material editor is given the ancestorHeight - the dialog height, which is stable.
        // We need to get .cke_top and .cke_bottom elements height, which are the editor's toolbar and footer, so we can retract those from overall height
        // Under div.cke_inner childNodes[0] is span.cke_top and childNodes[2] is span.cke_bottom
        // This should be fairly stable way to get the height of these element as the DOM seems to be steady already
        // We rely on this when we use editor parent container's height as a starting point for cke height calculations
        const inner = readyInstance.container.$.querySelector(".cke_inner");
        const topEl = inner && inner.childNodes[0];
        const bottomEl = inner && inner.childNodes[2];
        const ckeTopHeight =
          topEl && topEl.getBoundingClientRect
            ? topEl.getBoundingClientRect().height
            : 0;
        const ckeBottomHeight =
          bottomEl && bottomEl.getBoundingClientRect
            ? bottomEl.getBoundingClientRect().height
            : 0;
        // We use generic 2px all around border and that value (times 2)) has to be retracted from the height calculations also
        const ckeBorder = 4;
        // We need to retract the ckeTop and ckeBottom height form the overall cke height, if we don't then the cke container's height will be translated to
        // cke_contents element and it will cause the editor to overflow the screen in mobile views.
        const height = this.props.ancestorHeight
          ? this.props.ancestorHeight
          : readyInstance.container.$.getBoundingClientRect().height -
            ckeTopHeight -
            ckeBottomHeight -
            ckeBorder;
        // CKE content-element id
        const contentElementId: string = readyInstance.id + "_contents";
        // CKeditor offset from top when ancestor height is given, when there's no ancestor height provided, it is supposed no offset is needed
        const contentEl = document.getElementById(contentElementId);
        const contentElementOffset: number = this.props.ancestorHeight
          ? contentEl
            ? contentEl.offsetTop
            : 0
          : 0;
        // Calculate the height
        const contentHeight: number = height - contentElementOffset;
        // Resize
        if (typeof readyInstance.resize === "function") {
          readyInstance.resize("100%", contentHeight, true);
        }
        // This prevents empty children from overriding current data.
        // It is a problem in the workspace management where the props
        // are at an initial empty state when the editor is setup
        // current data gets overridden by the empty children
        // I did not find any case where this would break anything
        if ((props.children || "").trim() !== "") {
          readyInstance.setData(props.children || "");
        }
        //TODO somehow, the autofocus doesn't focus in the last row but in the first
        //Ckeditor hasn't implemented the feature, it must be hacked in, somehow
      } catch (err) {
        console.warn("CKEditor instanceReady setup failed", err);
      } finally {
        releaseOnce();
      }
    };

    // Cached plugins: replace() may have finished before we subscribed.
    if (instance.status === "ready") {
      handleInstanceReady({ editor: instance });
    } else {
      instance.once("instanceReady", handleInstanceReady);
    }
  }

  /**
   * updateCKEditor
   * @param data data
   */
  updateCKEditor(data: string) {
    const instance = getEditorInstance(this.name);
    if (!instance || instance.status !== "ready") {
      return;
    }
    instance.setData(data);
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
        <textarea
          className="cke"
          ref="ckeditor"
          id={this.name}
          name={this.name}
        />
      </div>
    );
  }
}
