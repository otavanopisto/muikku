/* eslint-disable react/no-string-refs */

/**
 * Deprecated refs should be reractored
 */

import * as React from "react";
import CKEditor from "~/components/general/ckeditor";
import { MATHJAXSRC } from "~/lib/mathjax";
import $ from "~/lib/jquery";
import equals = require("deep-equal");
import Synchronizer from "./base/synchronizer";
import TextareaAutosize from "react-textarea-autosize";
import { connect, Dispatch } from "react-redux";
import { StrMathJAX } from "../static/strmathjax";
import { UsedAs, FieldStateStatus } from "~/@types/shared";
import { createFieldSavedStateClass } from "../base/index";
import { WithTranslation, withTranslation } from "react-i18next";
import { ReadspeakerMessage } from "~/components/general/readspeaker";
import { bindActionCreators } from "redux";
import { AnyActionType } from "~/actions/index";
import {
  displayNotification,
  DisplayNotificationTriggerType,
} from "~/actions/base/notifications";
import "~/sass/elements/memofield.scss";

/**
 * MemoFieldProps
 */
interface MemoFieldProps extends WithTranslation {
  type: string;
  content: {
    example: string;
    columns: string;
    rows: string;
    name: string;
    richedit: boolean;
    maxChars: string;
    maxWords: string;
  };
  usedAs: UsedAs;
  readOnly?: boolean;
  initialValue?: string;
  onChange?: (
    context: React.Component<any, any>,
    name: string,
    newValue: any
  ) => any;

  displayCorrectAnswers?: boolean;
  checkAnswers?: boolean;
  onAnswerChange?: (name: string, value: boolean) => any;
  displayNotification: DisplayNotificationTriggerType;
  invisible?: boolean;
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
  isPasting: boolean;
  synced: boolean;
  syncError: string;

  fieldSavedState: FieldStateStatus;
}

/* eslint-disable camelcase */
const ckEditorConfig = {
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
  extraPlugins: "image2,widget,lineutils,autogrow,muikku-mathjax,divarea",
  resize_enabled: true,
};
/* eslint-enable camelcase */

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
 * MemoField
 */
class MemoField extends React.Component<MemoFieldProps, MemoFieldState> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: MemoFieldProps) {
    super(props);

    //get the initial value
    const value = props.initialValue || "";
    // and get the raw text if it's richedit

    // Function to check if a string is valid HTML
    const isValidHTML = (str: string) => {
      const doc = new DOMParser().parseFromString(str, "text/html");
      return Array.from(doc.body.childNodes).some(
        (node) => node.nodeType === 1
      );
    };

    const rawText =
      this.props.content && this.props.content.richedit && isValidHTML(value)
        ? $(value).text()
        : value;

    // set the state with the counts
    this.state = {
      value,
      words: getWords(rawText).length,
      characters: getCharacters(rawText).length,
      isPasting: false,
      // modified synced and syncerror are false, true and null by default
      modified: false,
      synced: true,
      syncError: null,
      fieldSavedState: null,
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.onInputPaste = this.onInputPaste.bind(this);
    this.isInsideLastWord = this.isInsideLastWord.bind(this);
    this.trimPastedContent = this.trimPastedContent.bind(this);
    this.onCkeditorPaste = this.onCkeditorPaste.bind(this);
    this.onCKEditorChange = this.onCKEditorChange.bind(this);
    this.onFieldSavedStateChange = this.onFieldSavedStateChange.bind(this);
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
      nextProps.invisible !== this.props.invisible
    );
  }

  /**
   * trimPastedContent - Trims the pasted content if it exceeds the character or word limit
   * @param content
   * @returns trimmed content
   */
  trimPastedContent(content: string): string {
    // This will only work on plain text content

    const characters = getCharacters(content);
    let words = getWords(content);
    const maxCharacterLimit = parseInt(this.props.content.maxChars);
    const maxWordLimit = parseInt(this.props.content.maxWords);
    let localeContext = "";

    // If the pasted data exceeds the limit, trim it
    if (characters.length > maxCharacterLimit) {
      let count = 0;
      let newData = "";
      for (const char of content) {
        if (count < maxCharacterLimit) {
          newData += char;
          // we count only non-space characters
          if (/\S/.test(char)) {
            count++;
          }
        } else {
          break;
        }
      }
      // reset content
      content = newData;
      // reset words so that we can check if the word limit
      // is exceeded even after this trim
      words = getWords(newData);
      localeContext = "characters";
    }

    // If the number of words exceeds the limit, trim it
    if (words.length > maxWordLimit) {
      content = words.slice(0, maxWordLimit).join(" ");
      localeContext = "words";
    }
    this.props.displayNotification(
      this.props.t("notifications.contentLimitReached", {
        ns: "materials",
        context: localeContext,
      }),
      "info"
    );
    return content;
  }

  /**
   * A function tha checks if it is the last word we are writing
   * @param value
   * @returns boolean
   */
  isInsideLastWord = (value: string) => {
    const words = getWords(value);
    const maxWords = parseInt(this.props.content.maxWords);

    const atCharacterLimit =
      getCharacters(value).length > parseInt(this.props.content.maxChars);

    return (
      // If the character limit is reached, then just stop this madness
      !atCharacterLimit &&
      // If the last word is not empty, then we are inside the last word
      words.length === maxWords &&
      words[words.length - 1].length >= 1
    );
  };

  /**
   * onInputPaste - paste handling for memofield
   *
   * @param e e
   */
  onInputPaste() {
    this.setState({ isPasting: true });
  }

  /**
   * onInputChange - very simple this one is for only when raw input from the textarea changes
   * @param e e
   */
  onInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    let newValue = e.target.value;
    const maxCharacters = parseInt(this.props.content.maxChars);
    const maxWords = parseInt(this.props.content.maxWords);

    const exceedsCharacterLimit =
      getCharacters(e.target.value).length > maxCharacters;

    const exceedsWordLimit = getWords(e.target.value).length >= maxWords;

    if (exceedsCharacterLimit || exceedsWordLimit) {
      if (this.state.isPasting) {
        e.preventDefault(); // Prevent the default action
        newValue = this.trimPastedContent(newValue);
      } else {
        const isBeingDeleted =
          getCharacters(e.target.value).length <
          getCharacters(this.state.value).length;
        // If the content is not being deleted or we are not inside the last word
        // we reset the value to the state value
        if (!isBeingDeleted && !this.isInsideLastWord(newValue)) {
          // Limit is exceeded, we set the locale context for notification
          const localeContext = exceedsCharacterLimit ? "characters" : "words";

          this.props.displayNotification(
            this.props.t("notifications.contentLimitReached", {
              ns: "materials",
              context: localeContext,
            }),
            "info"
          );
          newValue = this.state.value;
        }
      }
    }

    this.setState({
      value: newValue,
      words: getWords(newValue).length,
      characters: getCharacters(newValue).length,
    });

    this.props.onChange &&
      this.props.onChange(this, this.props.content.name, newValue);
  }

  /**
   * onCkeditorPaste
   * @param event ckeditor event
   * @param isPasting isPasting state
   */
  onCkeditorPaste() {
    this.setState({
      isPasting: true,
    });
  }
  /**
   * onCKEditorChange - this one is for a ckeditor change
   * @param value value
   * @param instance editor instance
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onCKEditorChange(value: string, instance: any) {
    // we need the raw text and raw existing value
    const rawText = $(value).text();
    const rawValue = $(this.state.value).text();

    const maxCharacters = parseInt(this.props.content.maxChars);
    const maxWords = parseInt(this.props.content.maxWords);

    const exceedsCharacterLimit = getCharacters(rawText).length > maxCharacters;
    const exceedsWordLimit = getWords(rawText).length > maxWords;

    // If there's a restriction to the amount of characters or words,
    // we need to check if the user has exceeded the limit

    if (exceedsCharacterLimit || exceedsWordLimit) {
      const localeContext = exceedsWordLimit ? "words" : "characters";
      // If the user is pasting content, we need to check if the content
      //exceeds the character or word limit

      if (this.state.isPasting) {
        value = this.state.value;
        instance.setData(value, {
          /**
           * callback function
           */
          callback: () => {
            // Move the cursor to the end of the content
            const range = instance.createRange();
            range.moveToElementEditEnd(range.root);
            instance.getSelection().selectRanges([range]);
          },
        });
        this.props.displayNotification(
          this.props.t("notifications.pastedContentLimitReached", {
            ns: "materials",
            context: localeContext,
          }),
          "info"
        );
      } else {
        // If the user has exceeded the limit and is not pasting, we need to revert the changes

        const isBeingDeleted =
          getCharacters(rawText).length < getCharacters(rawValue).length;

        // if the content is not being deleted, or we are not inside the last word
        // we reset the value to the state value
        if (!isBeingDeleted && !this.isInsideLastWord(rawText)) {
          // over the limit, not being deleted and outside the last word, reset to state value
          value = this.state.value;

          // no point in setting state or saving anything, we return the original value
          instance.setData(value, {
            /**
             * callback function
             */
            callback: () => {
              // Move the cursor to the end of the content
              const range = instance.createRange();
              range.moveToElementEditEnd(range.root);
              instance.getSelection().selectRanges([range]);
            },
          });
          this.props.displayNotification(
            this.props.t("notifications.contentLimitReached", {
              ns: "materials",
              context: localeContext,
            }),
            "info"
          );
        }
      }
      return;
    }
    this.setState({
      value,
      words: getWords(rawText).length,
      characters: getCharacters(rawText).length,
      isPasting: false,
    });
    this.props.onChange &&
      this.props.onChange(this, this.props.content.name, value);
  }

  /**
   * render
   * @returns JSX.Element
   */
  render() {
    const { t } = this.props;

    // we have a right answer example for when
    // we are asked for displaying right answer
    // so we need to set it up
    let answerExampleComponent = null;
    // it's simply set when we get it
    if (this.props.displayCorrectAnswers && this.props.content.example) {
      answerExampleComponent = (
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

    if (
      this.props.invisible &&
      !(!this.props.readOnly && this.props.content.richedit)
    ) {
      let unloadedField;
      if (this.props.readOnly) {
        unloadedField = !this.props.content.richedit ? (
          <textarea
            readOnly
            maxLength={
              this.props.content.maxChars &&
              parseInt(this.props.content.maxChars)
            }
            className="memofield"
            rows={parseInt(this.props.content.rows)}
          />
        ) : (
          <span
            className="memofield__ckeditor-replacement memofield__ckeditor-replacement--readonly"
            dangerouslySetInnerHTML={{ __html: this.state.value }}
          />
        );
      } else {
        unloadedField = (
          <textarea
            maxLength={
              this.props.content.maxChars &&
              parseInt(this.props.content.maxChars)
            }
            className="memofield"
            rows={parseInt(this.props.content.rows)}
          />
        );
      }

      return (
        <span ref="base" className="memofield-wrapper">
          {unloadedField}
          <span className="memofield__counter-wrapper" />
          {answerExampleComponent}
        </span>
      );
    }

    // now we need the field
    let field;
    const minRows =
      this.props.content.rows &&
      this.props.content.rows !== "" &&
      !isNaN(Number(this.props.content.rows))
        ? Number(this.props.content.rows)
        : 3;

    if (this.props.usedAs === "default") {
      // if readonly
      if (this.props.readOnly) {
        // depending to whether rich edit or not we make it be with the value as inner html or just raw text
        field = !this.props.content.richedit ? (
          <TextareaAutosize
            readOnly
            className="memofield"
            cols={parseInt(this.props.content.columns)}
            minRows={minRows}
            value={this.state.value}
            onChange={this.onInputChange}
            onPaste={this.onInputPaste}
          />
        ) : (
          <span
            className="memofield__ckeditor-replacement memofield__ckeditor-replacement--readonly"
            dangerouslySetInnerHTML={{ __html: this.state.value }}
          />
        );
      } else {
        // here we make it be a simple textarea or a rich text editor
        // note how somehow numbers come as string...
        field = !this.props.content.richedit ? (
          <TextareaAutosize
            className="memofield"
            cols={parseInt(this.props.content.columns)}
            minRows={minRows}
            value={this.state.value}
            onChange={this.onInputChange}
            onPaste={this.onInputPaste}
          />
        ) : (
          <CKEditor
            configuration={ckEditorConfig}
            onChange={this.onCKEditorChange}
            onPaste={this.onCkeditorPaste}
            maxChars={
              this.props.content.maxChars &&
              parseInt(this.props.content.maxChars)
            }
            maxWords={
              this.props.content.maxWords &&
              parseInt(this.props.content.maxWords)
            }
          >
            {this.state.value}
          </CKEditor>
        );
      }
    } else if (this.props.usedAs === "evaluationTool") {
      // if readonly.
      if (this.props.readOnly) {
        // here we make it be a simple textarea or a rich text editor, also we need to escape html to prevent possible script injections
        field = !this.props.content.richedit ? (
          <TextareaAutosize
            readOnly
            className="memofield memofield--evaluation"
            value={this.state.value}
            onChange={this.onInputChange}
            onPaste={this.onInputPaste}
          />
        ) : (
          <div
            className="memofield__ckeditor-replacement memofield__ckeditor-replacement--readonly memofield__ckeditor-replacement--evaluation"
            dangerouslySetInnerHTML={{ __html: this.state.value }}
          />
        );
      }
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
          className={`memofield-wrapper ${fieldSavedStateClass} rs_skip_always`}
        >
          <Synchronizer
            synced={this.state.synced}
            syncError={this.state.syncError}
            onFieldSavedStateChange={this.onFieldSavedStateChange.bind(this)}
          />
          {field}
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
        </span>
      </>
    );
  }
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ displayNotification }, dispatch);
}

export default withTranslation(["materials", "common"])(
  connect(null, mapDispatchToProps)(MemoField)
);
