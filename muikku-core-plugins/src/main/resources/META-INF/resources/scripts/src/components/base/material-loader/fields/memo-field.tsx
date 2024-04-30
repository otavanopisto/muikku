/* eslint-disable react/no-string-refs */

/**
 * Deprecated refs should be reractored
 */

import * as React from "react";
import CKEditor, { CKEditorEventInfo } from "~/components/general/ckeditor";
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
    const rawText = this.props.content
      ? this.props.content.richedit
        ? $(value).text()
        : value
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
    this.onInputPaste = this.onInputPaste.bind(this);
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
    // any content should be parsed from tags before this
    const characters = getCharacters(content);
    const words = getWords(content);
    const maxCharacterLimit = parseInt(this.props.content.maxChars);
    const maxWordLimit = parseInt(this.props.content.maxWords);

    if (
      characters.length >= maxCharacterLimit ||
      words.length >= maxWordLimit
    ) {
      // If the pasted data exceeds the limit, trim it
      if (characters.length >= maxCharacterLimit) {
        this.props.displayNotification(
          "Pasted content exceeds the character limit",
          "error"
        );
        let count = 0;
        let newData = "";
        for (const char of content) {
          if (count < maxCharacterLimit) {
            newData += char;
            if (char !== " ") {
              count++;
            }
          } else {
            break;
          }
        }
        content = newData;
      }

      // If the number of words exceeds the limit, trim it
      if (words.length >= maxWordLimit) {
        this.props.displayNotification(
          "Pasted content exceeds the word limit",
          "error"
        );
        content = words.slice(0, maxWordLimit).join(" ");
      }
      return content;
    }
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
   * onInputChange - very simple this one is for only when raw input from the textarea changes
   * @param e e
   */
  onInputPaste(e: React.ClipboardEvent) {
    let newValue = e.clipboardData.getData("text");
    const textarea = e.target as HTMLTextAreaElement;
    e.preventDefault(); // Prevent the default paste action

    // Get the start and end indices of the selected text
    const selectionStart = textarea.selectionStart;
    const selectionEnd = textarea.selectionEnd;

    newValue =
      textarea.value.substring(0, selectionStart) +
      newValue +
      textarea.value.substring(selectionEnd);

    newValue = this.trimPastedContent(newValue);

    this.setState({
      value: newValue,
      words: getWords(newValue).length,
      characters: getCharacters(newValue).length,
      isPasting: true,
    });

    //we call the on change
    this.props.onChange &&
      this.props.onChange(this, this.props.content.name, newValue);
  }

  /**
   * onInputChange - very simple this one is for only when raw input from the textarea changes
   * @param e e
   */
  onInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    let newValue = e.target.value;
    const maxCharacters = parseInt(this.props.content.maxChars);
    const maxWords = parseInt(this.props.content.maxWords);
    const isBeingDeleted =
      getCharacters(e.target.value).length <
      getCharacters(this.state.value).length;

    if (this.state.isPasting) {
      this.setState({
        isPasting: false,
      });
      return;
    }
    const exceedsCharacterLimit =
      getCharacters(e.target.value).length > maxCharacters;

    const exceedsWordLimit = getWords(e.target.value).length >= maxWords;

    if (exceedsCharacterLimit || exceedsWordLimit) {
      const localeContext = exceedsCharacterLimit ? "character" : "word";

      if (!isBeingDeleted && !this.isInsideLastWord(newValue)) {
        this.props.displayNotification(
          "Written content exceeds the " + localeContext + " limit",
          "error"
        );
        newValue = this.state.value;
      }

      const textarea = e.target;
      textarea.selectionStart = textarea.selectionEnd =
        this.state.value.length + 1;
    }

    // and update the count
    this.setState({
      value: newValue,
      words: getWords(newValue).length,
      characters: getCharacters(newValue).length,
    });

    //we call the on change
    this.props.onChange &&
      this.props.onChange(this, this.props.content.name, newValue);
  }

  /**
   * onCkeditorPaste
   * @param event ckeditor event
   * @param isPasting isPasting state
   */
  onCkeditorPaste(event: CKEditorEventInfo) {
    // Prevent the original paste event
    let newData = event.data.dataValue;
    const characterCount = getCharacters(newData).length;
    const wordCount = getWords(newData).length;

    if (
      characterCount > parseInt(this.props.content.maxChars) ||
      wordCount > parseInt(this.props.content.maxWords)
    ) {
      event.stop();

      // Get the pasted data      content = content.replace(/<[^>]*>/g, "");
      const pastedData = event.data.dataValue.replace(/<\/?p>/g, "");

      // Get the existing content
      const existingContent = event.editor.getData().replace(/<\/?p>/g, "");

      // Get the current selection
      const selection = event.editor.getSelection();
      const ranges = selection.getRanges();
      const cursorPosition = ranges[0].startOffset;
      const selectionEndPosition = ranges[0].endOffset;

      // Combine the existing content and the pasted data
      const combinedData =
        existingContent.slice(0, cursorPosition) +
        pastedData +
        existingContent.slice(selectionEndPosition);

      newData = combinedData;

      // Trim the combined data if it exceeds the character or word limit

      newData = "<p>" + this.trimPastedContent(combinedData) + "</p>";

      event.editor.setData(newData);

      // Update the state
      this.setState(
        {
          value: newData,
          words: wordCount,
          isPasting: true,
          characters: characterCount,
        },
        () => {
          // This is to set the cursor at the end of the content
          const range = event.editor.createRange();
          range.moveToElementEditEnd(range.root);
          event.editor.getSelection().selectRanges([range]);
        }
      );
    }
    // else {
    //   newData = "<p>" + newData + "</p>";

    //   event.editor.setData(newData);

    //   // Update the state
    //   this.setState(
    //     {
    //       value: newData,
    //       words: wordCount,
    //       isPasting: true,
    //       characters: characterCount,
    //     },
    //     () => {
    //       // This is to set the cursor at the end of the content
    //       const range = event.editor.createRange();
    //       range.moveToElementEditEnd(range.root);
    //       event.editor.getSelection().selectRanges([range]);
    //     }
    //   );
    // }

    // Set the trimmed data as the editor content
  }

  /**
   * onCKEditorChange - this one is for a ckeditor change
   * @param value value
   * @param instance editor instance for manipulation
   */
  onCKEditorChange(value: string, instance: any) {
    // we need the raw text and raw value
    const rawText = $(value).text();
    const rawValue = $(this.state.value).text();

    const maxCharacters = parseInt(this.props.content.maxChars);
    const maxWords = parseInt(this.props.content.maxWords);

    if (this.state.isPasting) {
      this.setState({
        isPasting: false,
      });
      return;
    }

    const exceedsCharacterLimit = getCharacters(rawText).length > maxCharacters;
    const exceedsWordLimit = getWords(rawText).length >= maxWords;

    // If there's a restriction to the amount of characters or words, we need to check if the user has exceeded the limit

    if (exceedsCharacterLimit || exceedsWordLimit) {
      // If the user has exceeded the limit, we need to revert the changes
      //Then we set the cursor at the end of the content

      const isBeingDeleted =
        getCharacters(rawText).length < getCharacters(rawValue).length;

      if (!isBeingDeleted && !this.isInsideLastWord(rawText)) {
        value = this.state.value;

        this.props.displayNotification(
          "Written content exceeds the word limit",
          "error"
        );
      }
    }
    this.setState({
      value,
      words: getWords(value).length,
      characters: getCharacters(value).length,
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
            maxLength={parseInt(this.props.content.maxChars)}
            className="material-page__memofield"
            rows={parseInt(this.props.content.rows)}
          />
        ) : (
          <span
            className="material-page__ckeditor-replacement material-page__ckeditor-replacement--readonly"
            dangerouslySetInnerHTML={{ __html: this.state.value }}
          />
        );
      } else {
        unloadedField = (
          <textarea
            maxLength={parseInt(this.props.content.maxChars)}
            className="material-page__memofield"
            rows={parseInt(this.props.content.rows)}
          />
        );
      }

      return (
        <span ref="base" className="material-page__memofield-wrapper">
          {unloadedField}
          <span className="material-page__counter-wrapper" />
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
            className="material-page__memofield"
            cols={parseInt(this.props.content.columns)}
            minRows={minRows}
            value={this.state.value}
            onChange={this.onInputChange}
            onPaste={this.onInputPaste}
          />
        ) : (
          <span
            className="material-page__ckeditor-replacement material-page__ckeditor-replacement--readonly"
            dangerouslySetInnerHTML={{ __html: this.state.value }}
          />
        );
      } else {
        // here we make it be a simple textarea or a rich text editor
        // note how somehow numbers come as string...
        field = !this.props.content.richedit ? (
          <TextareaAutosize
            className="material-page__memofield"
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
            maxChars={parseInt(this.props.content.maxChars)}
            maxWords={parseInt(this.props.content.maxWords)}
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
            className="material-page__memofield material-page__memofield--evaluation"
            value={this.state.value}
            onChange={this.onInputChange}
            onPaste={this.onInputPaste}
          />
        ) : (
          <div
            className="material-page__ckeditor-replacement material-page__ckeditor-replacement--readonly material-page__ckeditor-replacement--evaluation"
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
          className={`material-page__memofield-wrapper ${fieldSavedStateClass} rs_skip_always`}
        >
          <Synchronizer
            synced={this.state.synced}
            syncError={this.state.syncError}
            onFieldSavedStateChange={this.onFieldSavedStateChange.bind(this)}
          />
          {field}
          <span className="material-page__counter-wrapper">
            <span
              className={`material-page__word-count-container ${
                this.state.words >= parseInt(this.props.content.maxWords)
                  ? "LIMIT-REACHED"
                  : ""
              }`}
            >
              <span className="material-page__word-count-title">
                {t("labels.wordCount", { ns: "materials" })}
              </span>
              <span className="material-page__word-count">
                {this.state.words} / {this.props.content.maxWords}
              </span>
            </span>
            <span
              className={`material-page__character-count-container ${
                this.state.characters >= parseInt(this.props.content.maxChars)
                  ? "LIMIT-REACHED"
                  : ""
              }`}
            >
              <span className="material-page__character-count-title">
                {t("labels.characterCount", { ns: "materials" })}
              </span>
              <span className="material-page__character-count">
                {this.state.characters} / {this.props.content.maxChars}
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
