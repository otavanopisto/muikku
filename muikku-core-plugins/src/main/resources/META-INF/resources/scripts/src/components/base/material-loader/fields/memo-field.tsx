/* eslint-disable react/no-string-refs */

/**
 * Deprecated refs should be reractored
 */

import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import CKEditor from "~/components/general/ckeditor";
import { MATHJAXSRC } from "~/lib/mathjax";
import $ from "~/lib/jquery";
import equals = require("deep-equal");
import Synchronizer from "./base/synchronizer";
import TextareaAutosize from "react-textarea-autosize";
import { StrMathJAX } from "../static/mathjax";
import { UsedAs, FieldStateStatus } from "~/@types/shared";
import { createFieldSavedStateClass } from "../base/index";

/**
 * MemoFieldProps
 */
interface MemoFieldProps {
  type: string;
  content: {
    example: string;
    columns: string;
    rows: string;
    name: string;
    richedit: boolean;
  };
  usedAs: UsedAs;
  i18n: i18nType;
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
 * @param rawText
 * @returns
 */
function characterCount(rawText: string) {
  return rawText === ""
    ? 0
    : rawText
        .trim()
        .replace(/(\s|\r\n|\r|\n)+/g, "")
        .split("").length;
}

/**
 * wordCount - Counts the amount of words
 * @param rawText
 * @returns
 */
function wordCount(rawText: string) {
  return rawText === "" ? 0 : rawText.trim().split(/\s+/).length;
}

/**
 * MemoField
 */
export default class MemoField extends React.Component<
  MemoFieldProps,
  MemoFieldState
> {
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
      words: wordCount(rawText),
      characters: characterCount(rawText),

      // modified synced and syncerror are false, true and null by default
      modified: false,
      synced: true,
      syncError: null,

      fieldSavedState: null,
    };

    this.onInputChange = this.onInputChange.bind(this);
    this.onCKEditorChange = this.onCKEditorChange.bind(this);
    this.onFieldSavedStateChange = this.onFieldSavedStateChange.bind(this);
  }

  /**
   * onFieldSavedStateChange
   * @param savedState
   */
  onFieldSavedStateChange(savedState: FieldStateStatus) {
    this.setState({
      fieldSavedState: savedState,
    });
  }

  /**
   * shouldComponentUpdate
   * @param nextProps
   * @param nextState
   * @returns
   */
  shouldComponentUpdate(nextProps: MemoFieldProps, nextState: MemoFieldState) {
    return (
      !equals(nextProps.content, this.props.content) ||
      this.props.readOnly !== nextProps.readOnly ||
      !equals(nextState, this.state) ||
      this.props.i18n !== nextProps.i18n ||
      this.props.displayCorrectAnswers !== nextProps.displayCorrectAnswers ||
      this.props.checkAnswers !== nextProps.checkAnswers ||
      this.state.modified !== nextState.modified ||
      this.state.synced !== nextState.synced ||
      this.state.syncError !== nextState.syncError ||
      nextProps.invisible !== this.props.invisible
    );
  }

  /**
   * onInputChange - very simple this one is for only when raw input from the textarea changes
   * @param e
   */
  onInputChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    // and update the count
    this.setState({
      value: e.target.value,
      words: wordCount(e.target.value),
      characters: characterCount(e.target.value),
    });

    //we call the on change
    this.props.onChange &&
      this.props.onChange(this, this.props.content.name, e.target.value);
  }

  /**
   * onCKEditorChange - this one is for a ckeditor change
   * @param value
   */
  onCKEditorChange(value: string) {
    // we need the raw text
    const rawText = $(value).text();
    // and update the state
    this.setState({
      value,
      words: wordCount(rawText),
      characters: characterCount(rawText),
    });

    this.props.onChange &&
      this.props.onChange(this, this.props.content.name, value);
  }

  /**
   * render
   * @returns
   */
  render() {
    // we have a right answer example for when
    // we are asked for displaying right answer
    // so we need to set it up
    let answerExampleComponent = null;
    // it's simply set when we get it
    if (this.props.displayCorrectAnswers && this.props.content.example) {
      answerExampleComponent = (
        <span className="material-page__field-answer-examples material-page__field-answer-examples--memofield">
          <span className="material-page__field-answer-examples-title material-page__field-answer-examples-title--memofield">
            {this.props.i18n.text.get(
              "plugin.workspace.assigment.checkAnswers.detailsSummary.title"
            )}
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
          />
        ) : (
          <CKEditor
            configuration={ckEditorConfig}
            onChange={this.onCKEditorChange}
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
      <span
        className={`material-page__memofield-wrapper ${fieldSavedStateClass}`}
      >
        <Synchronizer
          synced={this.state.synced}
          syncError={this.state.syncError}
          i18n={this.props.i18n}
          onFieldSavedStateChange={this.onFieldSavedStateChange.bind(this)}
        />
        {field}
        <span className="material-page__counter-wrapper">
          <span className="material-page__word-count-container">
            <span className="material-page__word-count-title">
              {this.props.i18n.text.get("plugin.workspace.memoField.wordCount")}
            </span>
            <span className="material-page__word-count">
              {this.state.words}
            </span>
          </span>
          <span className="material-page__character-count-container">
            <span className="material-page__character-count-title">
              {this.props.i18n.text.get(
                "plugin.workspace.memoField.characterCount"
              )}
            </span>
            <span className="material-page__character-count">
              {this.state.characters}
            </span>
          </span>
        </span>
        {answerExampleComponent}
      </span>
    );
  }
}
