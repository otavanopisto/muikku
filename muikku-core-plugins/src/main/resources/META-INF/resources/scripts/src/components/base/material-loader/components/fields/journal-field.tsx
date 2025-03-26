/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import CKEditor from "~/components/general/ckeditor";
import { MATHJAXSRC } from "~/lib/mathjax";
import $ from "~/lib/jquery";
import equals = require("deep-equal");
import Synchronizer from "./base/synchronizer";
import { UsedAs, FieldStateStatus } from "~/@types/shared";
import { createFieldSavedStateClass } from "../../utils";
import { withTranslation, WithTranslation } from "react-i18next";
import { ReadspeakerMessage } from "~/components/general/readspeaker";
import { Instructions } from "~/components/general/instructions";
import "~/sass/elements/journalfield.scss";

/**
 * JournalProps
 */
interface JournalFieldProps extends WithTranslation {
  type: string;
  content: {
    name: string;
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

  invisible?: boolean;
}

/**
 * JournalState
 */
interface JournalFieldState {
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
 * @param rawText rawText
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
 * @param rawText rawText
 */
function wordCount(rawText: string) {
  return rawText === "" ? 0 : rawText.trim().split(/\s+/).length;
}

/**
 * Journal
 */
class JournalField extends React.Component<
  JournalFieldProps,
  JournalFieldState
> {
  // Add ref declaration
  private baseRef: React.RefObject<HTMLSpanElement>;

  /**
   * constructor
   * @param props props
   */
  constructor(props: JournalFieldProps) {
    super(props);

    // Initialize ref
    this.baseRef = React.createRef<HTMLSpanElement>();

    //get the initial value
    const value = props.initialValue || "";
    // and get the raw text if it's richedit
    const rawText = $(value).text();

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
  shouldComponentUpdate(
    nextProps: JournalFieldProps,
    nextState: JournalFieldState
  ) {
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
   * onCKEditorChange - this one is for a ckeditor change
   * @param value value
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
   * @returns JSX.Element
   */
  render() {
    const { t } = this.props;

    if (this.props.invisible && !!this.props.readOnly) {
      let unloadedField;
      if (this.props.readOnly) {
        unloadedField = (
          <span
            className="journalfield__ckeditor-replacement journalfield__ckeditor-replacement--readonly"
            dangerouslySetInnerHTML={{ __html: this.state.value }}
          />
        );
      } else {
        unloadedField = <textarea className="journalfield" />;
      }

      return (
        <span ref={this.baseRef} className="journalfield-wrapper">
          {unloadedField}
        </span>
      );
    }

    // now we need the field
    let field;

    if (this.props.usedAs === "default") {
      // if readonly
      if (this.props.readOnly) {
        field = (
          <span
            className="journalfield__ckeditor-replacement journalfield__ckeditor-replacement--readonly"
            dangerouslySetInnerHTML={{ __html: this.state.value }}
          />
        );
      } else {
        // here we make it be a simple textarea or a rich text editor
        // note how somehow numbers come as string...
        field = (
          <>
            <span className="journalfield-header">
              <span className="journalfield-header__title">
                {t("labels.diaryEntry", { ns: "materials" })}
              </span>
              <Instructions
                modifier="instructions"
                alignSelfVertically="top"
                openByHover={false}
                closeOnClick={true}
                closeOnOutsideClick={true}
                persistent
                content={
                  <div
                    dangerouslySetInnerHTML={{
                      __html: t("instructions.journalMemoField", {
                        ns: "materials",
                      }),
                    }}
                  />
                }
              />
            </span>
            <CKEditor
              configuration={ckEditorConfig}
              onChange={this.onCKEditorChange}
            >
              {this.state.value}
            </CKEditor>
          </>
        );
      }
    } else if (this.props.usedAs === "evaluationTool") {
      // if readonly.
      if (this.props.readOnly) {
        // here we make it be a simple textarea or a rich text editor, also we need to escape html to prevent possible script injections
        field = (
          <div
            className="journalfield__ckeditor-replacement journalfield__ckeditor-replacement--readonly journalfield__ckeditor-replacement--evaluation"
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
            context: "journal",
          })}
        />
        <span
          ref={this.baseRef}
          className={`journalfield-wrapper ${fieldSavedStateClass} rs_skip_always`}
        >
          <Synchronizer
            synced={this.state.synced}
            syncError={this.state.syncError}
            onFieldSavedStateChange={this.onFieldSavedStateChange.bind(this)}
          />
          {field}
        </span>
      </>
    );
  }
}

export default withTranslation(["materials", "common"])(JournalField);
