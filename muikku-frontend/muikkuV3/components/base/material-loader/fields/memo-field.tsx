/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable camelcase */
import * as React from "react";
import CKEditor, {
  CKEditorKeyEventInfo,
  CKEditorPasteEventInfo,
} from "~/components/general/ckeditor";
import equals = require("deep-equal");
import Synchronizer from "./base/synchronizer";
import { connect } from "react-redux";
import { StrMathJAX } from "../static/strmathjax";
import { FieldStateStatus } from "~/@types/shared";
import { createFieldSavedStateClass } from "../base/index";
import { WithTranslation, withTranslation } from "react-i18next";
import { ReadspeakerMessage } from "~/components/general/readspeaker";
import { Action, bindActionCreators, Dispatch } from "redux";
import { AnyActionType } from "~/actions/index";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import "~/sass/elements/memofield.scss";
import { CommonFieldProps } from "../types";
import { IconButton } from "~/components/general/button";
import Dropdown from "~/components/general/dropdown";
import { FieldSnapshotList } from "./field-snapshot/field-snapshot-list";
import { MemoSnapshotContent } from "./field-snapshot/memo-snapshot-content";
import AddEvaluationCommentsDrawer from "./add-evaluation-comments-drawer";
import { htmlToPlainText, toMemoDisplayHtml } from "~/util/html";
import {
  getMemoFieldContentFormat,
  getMemoFieldContentFormatSync,
} from "~/util/memo-content-format";
import { MATHJAXSRC } from "~/lib/mathjax";
import $ from "~/lib/jquery";

/**
 * MemoComment
 */
interface MemoComment {
  text: string;
  id: string;
}

/**
 * Collect evaluation comments from richedit memo HTML.
 * Comments are identified only by data-text.
 * @param html html
 * @returns comment texts in document order
 */
function getMemoComments(html: string): MemoComment[] {
  if (!html) {
    return [];
  }
  const comments: MemoComment[] = [];
  $("<div/>")
    .html(html)
    .find('mark[data-type="comment"]')
    .each(function () {
      const text = $(this).attr("data-text");
      const id = $(this).attr("data-id");
      if (text) {
        comments.push({ text, id });
      }
    });
  return comments;
}

/**
 * parseLimit - Parses the limit
 * @param value value
 */
function parseLimit(value?: string): number | undefined {
  const n = parseInt(value, 10);
  return Number.isFinite(n) && n > 0 ? n : undefined;
}

/**
 * normalizedKeyCode - Normalizes the key code
 * @param keyCode key code
 * @param CKEDITOR CKEDITOR
 */
function normalizedKeyCode(keyCode: number, CKEDITOR: any): number {
  return keyCode & ~(CKEDITOR.SHIFT | CKEDITOR.CTRL | CKEDITOR.ALT);
}

/**
 * characterCount - Counts the amount of characters
 * @param rawText rawText
 * @returns characters void of spaces
 */
function getCharacters(rawText: string) {
  if (rawText === "") return [];

  // force a string just in case
  rawText = String(rawText);

  // Remove any tags
  rawText = rawText.replace(/<[^>]*>/g, "");
  return rawText
    .trim()
    .replace(/(\s|\r\n|\r|\n)+/g, "")
    .split("");
}

/**
 * wordCount - Counts the amount of words
 * @param rawText rawText
 * @returns words
 */
function getWords(rawText: string) {
  if (rawText === "") return [];
  // force a string just in case
  rawText = String(rawText);

  // Remove any tags
  rawText = rawText.replace(/<[^>]*>/g, "");
  return rawText.trim().split(/\s+/);
}

/**
 * replaceNewlinesWithBreaks
 * @param str str
 * @returns string with newlines replaced with <br />
 */
function replaceNewlinesWithBreaks(str: string): string {
  return str.replace(/\n/g, "<br />");
}

// Rich edit CKEditor config
const MEMOFIELD_CKEDITOR_RICHEDIT_CONFIG = {
  autoGrow_onStartup: true,
  mathJaxLib: MATHJAXSRC,
  mathJaxClass: "math-tex", // This CANNOT be changed as cke saves this to database as part of documents' html (wraps the formula in a span with specified className). Don't touch it! ... STOP TOUCHING IT!
  toolbar: [
    {
      name: "basicstyles",
      items: ["Bold", "Italic", "Underline", "Strike", "RemoveFormat"],
    },
    { name: "clipboard", items: ["Cut", "Copy", "Paste", "Undo", "Redo"] },
    { name: "links", items: ["Link"] },
    {
      name: "insert",
      items: ["Image", "Table", "Muikku-mathjax", "Smiley", "SpecialChar"],
    },
    { name: "colors", items: ["TextColor", "BGColor"] },
    { name: "styles", items: ["Format"] },
    {
      name: "paragraph",
      items: [
        "NumberedList",
        "BulletedList",
        "Outdent",
        "Indent",
        "Blockquote",
        "JustifyLeft",
        "JustifyCenter",
        "JustifyRight",
      ],
    },
    { name: "tools", items: ["Maximize"] },
  ],
  removePlugins: "image,exportpdf",
  extraPlugins:
    "image2,widget,lineutils,autogrow,muikku-mathjax,divarea,muikku-comment-remove",
  resize_enabled: true,
};

// Plain text CKEditor config
const MEMOFIELD_CKEDITOR_PLAINTEXT_CONFIG = {
  autoGrow_onStartup: true,
  mathJaxLib: MATHJAXSRC,
  mathJaxClass: "math-tex", // This CANNOT be changed as cke saves this to database as part of documents' html (wraps the formula in a span with specified className). Don't touch it! ... STOP TOUCHING IT!
  toolbar: [{}, {}, { name: "tools", items: ["Maximize"] }],
  removePlugins: "image,exportpdf",
  extraPlugins: "image2,widget,lineutils,autogrow,muikku-mathjax,divarea",
  resize_enabled: true,
};

/**
 * Get the CKEditor config for the memo field based on the richedit flag
 * @param richedit - Whether the memo field is rich edit
 * @param rows - The number of rows to use for the memo field
 * @returns The CKEditor config
 */
function memofieldCkeditorConfig(richedit: boolean, rows?: number) {
  const base = richedit
    ? MEMOFIELD_CKEDITOR_RICHEDIT_CONFIG
    : MEMOFIELD_CKEDITOR_PLAINTEXT_CONFIG;
  if (typeof rows === "number" && rows > 0) {
    return {
      ...base,
      // height comes from CSS --cke-rows on .cke_contents
      autoGrow_onStartup: false,
      extraPlugins: base.extraPlugins
        .split(",")
        .filter((p) => p !== "autogrow")
        .join(","),
      removePlugins: `${base.removePlugins},autogrow`,
    };
  }
  return base;
}

/**
 * MemoFieldProps
 */
interface MemoFieldProps extends CommonFieldProps, WithTranslation {
  content: {
    example: string;
    columns: string;
    rows: string;
    name: string;
    richedit: boolean;
    maxChars: string;
    maxWords: string;
  };
  displayNotification: DisplayNotificationTriggerType;
}

/**
 * MemoFieldState
 */
interface MemoFieldState {
  value: string;
  words: number;
  characters: number;
  // This state comes from the context handler in the base
  // We can use it but it's the parent managing function that modifies them
  // We only set them up in the initial state
  modified: boolean;
  synced: boolean;
  syncError: string;
  fieldSavedState: FieldStateStatus;
  /** False until stored value has been classified and converted for CKEditor. */
  editorReady: boolean;
}

/**
 * MemoField
 */
class MemoField extends React.Component<MemoFieldProps, MemoFieldState> {
  // Add ref declaration
  private baseRef: React.RefObject<HTMLSpanElement>;
  private lastLimitNoticeAt = 0;

  /**
   * constructor
   * @param props props
   */
  constructor(props: MemoFieldProps) {
    super(props);

    // Initialize ref
    this.baseRef = React.createRef<HTMLSpanElement>();

    const storedValue = props.initialValue || "";
    const syncFormat = getMemoFieldContentFormatSync(storedValue);
    const editorReady = true; // always sync now — no componentDidMount async needed
    const value = toMemoDisplayHtml(
      storedValue,
      syncFormat,
      replaceNewlinesWithBreaks
    );
    const rawText = editorReady ? htmlToPlainText(value) : storedValue;

    //console.log("rawText constructor", rawText);

    // set the state with the counts
    this.state = {
      value,
      words: getWords(rawText).length,
      characters: getCharacters(rawText).length,
      modified: false,
      synced: true,
      syncError: null,
      fieldSavedState: null,
      editorReady,
    };

    this.onCKEditorKey = this.onCKEditorKey.bind(this);
    this.onCKEditorPaste = this.onCKEditorPaste.bind(this);
    this.onCKEditorChange = this.onCKEditorChange.bind(this);
    this.onFieldSavedStateChange = this.onFieldSavedStateChange.bind(this);
    this.notifyLimit = this.notifyLimit.bind(this);
    this.renderField = this.renderField.bind(this);
    this.renderAnswerExample = this.renderAnswerExample.bind(this);
  }

  /**
   * componentDidMount
   */
  componentDidMount() {
    if (this.state.editorReady) {
      return;
    }
    // console.log("componentDidMount");
    const storedValue = this.props.initialValue || "";
    getMemoFieldContentFormat(storedValue).then((format) => {
      const html = toMemoDisplayHtml(
        storedValue,
        format,
        replaceNewlinesWithBreaks
      );
      const rawText = htmlToPlainText(html);
      this.setState({
        value: html,
        words: getWords(rawText).length,
        characters: getCharacters(rawText).length,
        editorReady: true,
      });
    });
  }

  /**
   * onFieldSavedStateChange
   * @param savedState savedState
   */
  onFieldSavedStateChange(savedState: FieldStateStatus) {
    this.setState({
      fieldSavedState: savedState,
    });
  }

  /**
   * shouldComponentUpdate
   * @param nextProps nextProps
   * @param nextState nextState
   */
  shouldComponentUpdate(nextProps: MemoFieldProps, nextState: MemoFieldState) {
    return (
      !equals(nextProps.content, this.props.content) ||
      this.props.readOnly !== nextProps.readOnly ||
      !equals(nextState, this.state) ||
      this.props.displayCorrectAnswers !== nextProps.displayCorrectAnswers ||
      this.props.checkAnswers !== nextProps.checkAnswers ||
      this.state.modified !== nextState.modified ||
      this.state.synced !== nextState.synced ||
      this.state.syncError !== nextState.syncError ||
      nextProps.invisible !== this.props.invisible ||
      !equals(nextProps.snapshots, this.props.snapshots) ||
      !equals(
        nextProps.fieldFeaturesCapabilities,
        this.props.fieldFeaturesCapabilities
      )
    );
  }

  /**
   * notifyLimit - Notifies the user that the limit has been reached
   * @param context context
   */
  notifyLimit(context: "words" | "characters") {
    const now = Date.now();
    if (now - this.lastLimitNoticeAt < 1500) {
      return;
    }
    this.lastLimitNoticeAt = now;
    this.props.displayNotification(
      this.props.t("notifications.contentLimitReached", {
        ns: "materials",
        context,
      }),
      "info"
    );
  }

  /**
   * Block keys that would exceed limits. Content is not in the editor yet.
   * @param evt evt
   */
  onCKEditorKey(evt: CKEditorKeyEventInfo) {
    const CKEDITOR = (window as any).CKEDITOR;
    const maxChars = parseLimit(this.props.content.maxChars);
    const maxWords = parseLimit(this.props.content.maxWords);
    if (!maxChars && !maxWords) {
      return;
    }
    const keyCode = normalizedKeyCode(evt.data.keyCode, CKEDITOR);
    const isDelete = keyCode === 8 || keyCode === 46;
    const isSpace = keyCode === 32;
    const isEnter = keyCode === 13;
    const isNavigation =
      keyCode === 9 || keyCode === 27 || (keyCode >= 33 && keyCode <= 40);
    if (
      isDelete ||
      isNavigation ||
      evt.data.keyCode & CKEDITOR.CTRL ||
      evt.data.keyCode & CKEDITOR.ALT
    ) {
      return;
    }
    const rawText = evt.editor.editable().getText();
    const selectedText = evt.editor.getSelection()?.getSelectedText() || "";
    const characters = getCharacters(rawText).length;
    const selectedChars = getCharacters(selectedText).length;
    const words = getWords(rawText).length;
    const insertedChars = isSpace || isEnter ? 0 : 1;
    const nextChars = characters - selectedChars + insertedChars;
    if (maxChars && nextChars > maxChars) {
      evt.cancel();
      this.notifyLimit("characters");
      return;
    }
    // At cap with no counted characters selected (collapsed caret, or only spaces):
    // do not insert more spaces / letters.
    if (maxChars && characters >= maxChars && selectedChars === 0) {
      evt.cancel();
      this.notifyLimit("characters");
      return;
    }
    // Space/Enter at word cap: allow when replacing a selection (Ctrl+A then space).
    if (
      maxWords &&
      words >= maxWords &&
      (isSpace || isEnter) &&
      selectedText.length === 0
    ) {
      evt.cancel();
      this.notifyLimit("words");
    }
  }

  /**
   * Block paste that would exceed limits. Content is not in the editor yet.
   * @param evt evt
   */
  onCKEditorPaste(evt: CKEditorPasteEventInfo) {
    const maxChars = parseLimit(this.props.content.maxChars);
    const maxWords = parseLimit(this.props.content.maxWords);
    if (!maxChars && !maxWords) {
      return;
    }
    const currentText = evt.editor.editable().getText();
    const selectedText = evt.editor.getSelection()?.getSelectedText() || "";
    const pastedText = htmlToPlainText(evt.data.dataValue || "");
    const nextText = currentText.replace(selectedText, pastedText);
    const nextChars = getCharacters(nextText).length;
    const nextWords = getWords(nextText).length;
    if (maxChars && nextChars >= maxChars) {
      evt.cancel();
      this.notifyLimit("characters");
      return;
    }
    if (maxWords && nextWords >= maxWords) {
      evt.cancel();
      this.notifyLimit("words");
    }
  }

  /**
   * onCKEditorChange - Handles the change event from the CKEditor
   * @param value value
   */
  onCKEditorChange(value: string) {
    const rawText = htmlToPlainText(value);
    this.setState({
      value,
      words: getWords(rawText).length,
      characters: getCharacters(rawText).length,
    });

    this.props.onChange &&
      this.props.onChange(this, this.props.content.name, value);
  }

  /**
   * Renders the field
   * @returns JSX.Element
   */
  renderField(): JSX.Element {
    if (!this.state.editorReady) {
      return (
        <span className="memofield__ckeditor-replacement memofield__ckeditor-replacement--readonly" />
      );
    } else if (this.props.usedAs === "default") {
      if (this.props.readOnly) {
        return (
          <span
            className="memofield__ckeditor-replacement memofield__ckeditor-replacement--readonly"
            dangerouslySetInnerHTML={{ __html: this.state.value }}
          />
        );
      } else {
        return (
          <>
            <span className="memofield-header" aria-hidden="true" />
            <CKEditor
              configuration={memofieldCkeditorConfig(
                this.props.content.richedit,
                this.props.content.rows !== "" &&
                  !isNaN(Number(this.props.content.rows))
                  ? Number(this.props.content.rows)
                  : 3
              )}
              onChange={this.onCKEditorChange}
              onKey={this.onCKEditorKey}
              onPaste={this.onCKEditorPaste}
              rows={
                this.props.content.rows &&
                this.props.content.rows !== "" &&
                !isNaN(Number(this.props.content.rows))
                  ? Number(this.props.content.rows)
                  : 3
              }
              ancestorHeight={200}
            >
              {this.state.value}
            </CKEditor>
          </>
        );
      }
    } else if (this.props.usedAs === "evaluationTool") {
      if (this.props.readOnly) {
        return (
          <div
            className="memofield__ckeditor-replacement memofield__ckeditor-replacement--readonly memofield__ckeditor-replacement--evaluation"
            dangerouslySetInnerHTML={{ __html: this.state.value }}
          />
        );
      }
    }

    return null;
  }

  /**
   * Renders the answer example
   * @returns JSX.Element
   */
  renderAnswerExample() {
    const { t } = this.props;
    if (this.props.displayCorrectAnswers && this.props.content.example) {
      return (
        <span className="material-page__field-answer-examples material-page__field-answer-examples--memofield">
          <span className="material-page__field-answer-examples-title material-page__field-answer-examples-title--memofield">
            {t("labels.answer", {
              ns: "materials",
              context: "example",
            })}
            :
          </span>
          <span className="material-page__field-answer-example">
            <StrMathJAX html={true}>
              {this.props.content.example.replace(/\n/g, "<br/>")}
            </StrMathJAX>
          </span>
        </span>
      );
    }

    return null;
  }

  /**
   * render
   * @returns JSX.Element
   */
  render() {
    const { t } = this.props;

    const comments = getMemoComments(this.state.value);

    // we have a right answer example for when
    // we are asked for displaying right answer
    // so we need to set it up
    const answerExampleComponent = this.renderAnswerExample();

    if (this.props.invisible && this.props.readOnly) {
      return (
        <span ref={this.baseRef} className="memofield-wrapper">
          <span className="memofield__ckeditor-replacement memofield__ckeditor-replacement--readonly" />
          <span className="memofield__counter-wrapper" />
          {answerExampleComponent}
        </span>
      );
    }

    const fieldSavedStateClass = createFieldSavedStateClass(
      this.state.fieldSavedState
    );

    // and here the element itself
    return (
      <>
        <ReadspeakerMessage
          text={t("messages.assignment", {
            ns: "readSpeaker",
            context: "memo",
          })}
        />
        <span
          ref={this.baseRef}
          className={`memofield-wrapper ${fieldSavedStateClass} rs_skip_always`}
        >
          <Synchronizer
            synced={this.state.synced}
            syncError={this.state.syncError}
            onFieldSavedStateChange={this.onFieldSavedStateChange.bind(this)}
            alwaysPresent
          />
          {this.renderField()}
          <span className="memofield__counter-wrapper">
            <span
              className={`memofield__word-count-container ${
                this.state.words >= parseInt(this.props.content.maxWords)
                  ? "LIMIT-REACHED"
                  : ""
              }`}
            >
              <span className="memofield__word-count-title">
                {t("labels.wordCount", { ns: "materials" })}
              </span>
              <span className="memofield__word-count">
                {" "}
                {this.state.words}{" "}
                {this.props.content.maxWords &&
                  ` / ${this.props.content.maxWords}`}
              </span>
            </span>
            <span
              className={`memofield__character-count-container ${
                this.state.characters >= parseInt(this.props.content.maxChars)
                  ? "LIMIT-REACHED"
                  : ""
              }`}
            >
              <span className="memofield__character-count-title">
                {t("labels.characterCount", { ns: "materials" })}
              </span>
              <span className="memofield__character-count">
                {this.state.characters}{" "}
                {this.props.content.maxChars &&
                  ` / ${this.props.content.maxChars}`}
              </span>
            </span>
          </span>
          {answerExampleComponent}
          {this.props.fieldFeaturesCapabilities?.comments.canView &&
            comments.length > 0 && (
              <ul className="memofield__comment-list">
                {comments.map((comment) => (
                  <li key={comment.id} className="memofield__comment-list-item">
                    {comment.text}
                  </li>
                ))}
              </ul>
            )}

          {this.props.fieldFeaturesCapabilities?.snapshot.canCreate &&
            this.props.onTakeFieldSnapshot && (
              <Dropdown
                content={t("labels.takeSnapshot", { ns: "materials" })}
                openByHover
              >
                <IconButton
                  buttonModifiers="snapshot"
                  icon="plus"
                  disabled={!this.state.value}
                  onClick={() =>
                    this.props.onTakeFieldSnapshot(this.props.content.name)
                  }
                />
              </Dropdown>
            )}

          {this.props.fieldFeaturesCapabilities?.comments.enabled && (
            <AddEvaluationCommentsDrawer
              html={this.state.value}
              fieldName={this.props.content.name}
              onUpdateFieldWithComments={this.props.onUpdateFieldWithComments}
            >
              <IconButton
                buttonModifiers="snapshot"
                icon="bubbles"
                disabled={
                  !this.state.value ||
                  !this.props.fieldFeaturesCapabilities?.comments.canCreate
                }
              />
            </AddEvaluationCommentsDrawer>
          )}

          {this.props.fieldFeaturesCapabilities?.snapshot.canView && (
            <FieldSnapshotList
              snapshots={this.props.snapshots}
              fieldName={this.props.content.name}
              onDeleteFieldSnapshot={
                this.props.fieldFeaturesCapabilities?.snapshot.canDelete
                  ? this.props.onDeleteFieldSnapshot
                  : undefined
              }
              renderSnapshot={(snapshot) => (
                <MemoSnapshotContent
                  value={snapshot.value}
                  maxWords={this.props.content.maxWords}
                  maxChars={this.props.content.maxChars}
                  replaceNewlinesWithBreaks={replaceNewlinesWithBreaks}
                  getWords={getWords}
                  getCharacters={getCharacters}
                  wordCountLabel={t("labels.wordCount", { ns: "materials" })}
                  characterCountLabel={t("labels.characterCount", {
                    ns: "materials",
                  })}
                />
              )}
            />
          )}
        </span>
      </>
    );
  }
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators({ displayNotification }, dispatch);
}

export default withTranslation(["materials", "common"])(
  connect(null, mapDispatchToProps)(MemoField)
);
