import * as React from "react";
import equals = require("deep-equal");
import Dropdown from "~/components/general/dropdown";
import Synchronizer from "./base/synchronizer";
import AutosizeInput from "react-input-autosize";
import { FieldStateStatus } from "~/@types/shared";
import { createFieldSavedStateClass } from "../base/index";
import { WithTranslation, withTranslation } from "react-i18next";
import { ReadspeakerMessage } from "~/components/general/readspeaker";
import "~/sass/elements/textfield.scss";
import { CommonFieldProps } from "../types";

/**
 * TextFieldProps
 */
interface TextFieldProps extends CommonFieldProps, WithTranslation {
  content: {
    autogrow: boolean;
    columns: string;
    hint: string;
    name: string;
    rightAnswers: Array<{
      caseSensitive: boolean;
      correct: boolean;
      normalizeWhitespace: boolean;
      text: string;
    }>;
  };
}

/**
 * TextFieldState
 */
interface TextFieldState {
  value: string;

  // This state comes from the context handler in the base
  // We can use it but it's the parent managing function that modifies them
  // We only set them up in the initial state
  modified: boolean;
  synced: boolean;
  syncError: string;

  // The text field might have a answer state of unknown pass or fail
  answerState: "UNKNOWN" | "PASS" | "FAIL";

  fieldSavedState: FieldStateStatus;
}

/**
 * TextField
 */
class TextField extends React.Component<TextFieldProps, TextFieldState> {
  // Add ref declaration
  private baseRef: React.RefObject<HTMLSpanElement>;

  /**
   * constructor
   * @param props props
   */
  constructor(props: TextFieldProps) {
    super(props);

    // Initialize ref
    this.baseRef = React.createRef<HTMLSpanElement>();

    this.state = {
      // Set the initial value
      value: props.initialValue || "",
      // modified synced and syncerror are false, true and null by default
      modified: false,
      synced: true,
      syncError: null,

      // the intial answer state is totally unknown, not UNKNOWN but literally unknown if it's even UNKNOWN
      answerState: null,

      fieldSavedState: null,
    };

    this.onInputChange = this.onInputChange.bind(this);
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
  shouldComponentUpdate(nextProps: TextFieldProps, nextState: TextFieldState) {
    // So we only update if these props change and any of the state
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
   * onInputChange - when the input change
   * @param e e
   */
  onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!this.props.content) {
      return;
    }
    // we call the on change function with the context and the name
    this.props.onChange &&
      this.props.onChange(this, this.props.content.name, e.target.value);
    this.setState(
      {
        value: e.target.value,
      },
      this.checkAnswers
    );
  }

  /**
   * checkAnswers
   */
  checkAnswers() {
    // if the property is not there we cancel
    if (!this.props.checkAnswers || !this.props.content) {
      return;
    }

    // Check for all the correct answers and filter which ones are set to be correct
    const actuallyCorrectAnswers = this.props.content
      ? this.props.content.rightAnswers.filter((a) => a.correct)
      : [];

    // If there's not a single one that has the flag of being the correct answer
    if (!actuallyCorrectAnswers.length) {
      // the answer state is UNKNOWN
      if (this.state.answerState !== "UNKNOWN") {
        this.setState({
          answerState: "UNKNOWN",
        });
        // The rightness is sent as aunknownny to the function
        this.props.onAnswerChange(this.props.content.name, null);
      }
      return;
    }

    // Otherwise we gotta check each
    let isCorrect: boolean;
    let answer;

    // We loop in the correct answers
    for (answer of actuallyCorrectAnswers) {
      // And compare them according to the rules
      let comparerAnswer = answer.text;
      let comparerValue = this.state.value;
      if (!answer.caseSensitive) {
        comparerAnswer = comparerAnswer.toLocaleLowerCase();
        comparerValue = comparerValue.toLocaleLowerCase();
      }
      if (answer.normalizeWhitespace) {
        comparerAnswer.trim().replace(/\s+/gi, " ");
        comparerValue.trim().replace(/\s+/gi, " ");
      }

      isCorrect = comparerValue === comparerAnswer;
      // if we get a match we break
      if (isCorrect) {
        break;
      }
    }

    // Now we compare and call the rightness change function
    if (isCorrect && this.state.answerState !== "PASS") {
      this.setState({
        answerState: "PASS",
      });
      this.props.onAnswerChange(this.props.content.name, true);
    } else if (!isCorrect && this.state.answerState !== "FAIL") {
      this.setState({
        answerState: "FAIL",
      });
      this.props.onAnswerChange(this.props.content.name, false);
    }
  }

  /**
   * componentDidMount
   */
  componentDidMount() {
    this.checkAnswers();
  }

  /**
   * componentDidUpdate
   * @param prevProps prevProps
   * @param prevState prevState
   */
  componentDidUpdate(prevProps: TextFieldProps, prevState: TextFieldState) {
    this.checkAnswers();
  }

  /**
   * render
   * @returns JSX.Element
   */
  render() {
    const { t } = this.props;

    if (!this.props.content) {
      return null;
    }
    // This is the component that provides the summary of the correct answers
    let correctAnswersummaryComponent = null;
    // a boolean representing whether the answer is correct and we are actually checking for it
    const checkAnswersAndAnswerIsCorrect =
      this.props.checkAnswers && this.state.answerState === "PASS";
    // If we are told to display the correct answers (we don't do that if the answer is checked and right because it's pointless)
    // UNKNOWN also gets there, so the correct answers will be shown even if the state is unknown
    if (
      this.props.displayCorrectAnswers &&
      this.props.content &&
      this.props.content.rightAnswers &&
      !checkAnswersAndAnswerIsCorrect
    ) {
      // find the actually correct answers
      let actuallyCorrectAnswers = this.props.content.rightAnswers.filter(
        (a) => a.correct
      );
      // answers are example is for language, this happens if we have no correct answers
      let answersAreExample = false;
      // if we don't have correct answers
      if (!actuallyCorrectAnswers.length) {
        // We just set them all as right and make it be an example, this happens for example when the answer state is UNKNOWN
        answersAreExample = true;
        actuallyCorrectAnswers = this.props.content.rightAnswers;
      }

      // We create the component
      correctAnswersummaryComponent = actuallyCorrectAnswers.length ? (
        <span className="material-page__field-answer-examples">
          <span className="material-page__field-answer-examples-title">
            {answersAreExample
              ? t("labels.answer", { ns: "materials", context: "example" })
              : t("labels.answer", {
                  ns: "materials",
                  context: "correct",
                })}
            :
          </span>
          {actuallyCorrectAnswers.map((answer, index) => (
            <span key={index} className="material-page__field-answer-example">
              {answer.text}
            </span>
          ))}
        </span>
      ) : null;
    }

    if (this.props.invisible) {
      return (
        <>
          <ReadspeakerMessage
            text={t("messages.assignment", {
              ns: "readSpeaker",
              context: "text",
            })}
          />
          <span ref={this.baseRef} className="textfield-wrapper rs_skip_always">
            <span className="textfield">
              <input readOnly />
            </span>
            {correctAnswersummaryComponent}
          </span>
        </>
      );
    }

    /**
     * Component
     * @param props props
     */
    /* const Component = (props: any) => {
      if (this.props.content.autogrow) {
        return <AutosizeInput {...props} />;
      } else {
        const newProps = { ...props };
        delete newProps.injectStyles;
        delete newProps.minWidth;
        delete newProps.className;
        delete newProps.style;
        return (
          <span className={props.className} style={props.style}>
            <input {...newProps} />
          </span>
        );
      }
    }; */

    // Lets calculate textfield width based on textfield size option.
    // If no option size has been set then we use 50 as a default value.
    // This sets baseline width for normal textfields and autogrow textfields so they appear at same width when they have same size set.
    const textfieldWidth =
      this.props.content.columns && !isNaN(Number(this.props.content.columns))
        ? Number(this.props.content.columns) * 10
        : 50;

    const textfieldStyle: React.CSSProperties = {
      width: textfieldWidth,
      boxSizing: "content-box",
    };

    const doNotInjectStyles = {
      injectStyles: false,
      minWidth: textfieldWidth,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any;

    const wrapperStyle = {
      display: "inherit",
    };

    const objectStyle = {
      boxSizing: "content-box",
    };

    // The state of the whole field
    const fieldStateAfterCheck =
      this.state.answerState !== "UNKNOWN" && this.props.checkAnswers
        ? this.state.answerState === "FAIL"
          ? "incorrect-answer"
          : "correct-answer"
        : "";

    if (this.props.readOnly && this.props.usedAs === "default") {
      const component = this.props.content.autogrow ? (
        <AutosizeInput
          style={wrapperStyle}
          inputStyle={objectStyle}
          {...doNotInjectStyles}
          readOnly
          className={`textfield ${fieldStateAfterCheck}`}
          type="text"
          value={this.state.value}
          size={
            this.props.content.columns && parseInt(this.props.content.columns)
          }
        />
      ) : (
        <span className={`textfield ${fieldStateAfterCheck}`}>
          <input
            type="text"
            value={this.state.value}
            readOnly
            size={
              this.props.content.columns && parseInt(this.props.content.columns)
            }
            style={textfieldStyle}
          />
        </span>
      );
      return (
        <>
          <ReadspeakerMessage
            text={t("messages.assignment", {
              ns: "readSpeaker",
              context: "text",
            })}
          />
          <span className="textfield-wrapper rs_skip_always">
            {component}
            {correctAnswersummaryComponent}
          </span>
        </>
      );
    }

    // Read only version for evaluation tool.
    else if (this.props.readOnly && this.props.usedAs === "evaluationTool") {
      const component = (
        <span
          className={`textfield ${fieldStateAfterCheck} textfield--evaluation`}
        >
          {this.state.value ? this.state.value : <>&nbsp;</>}
        </span>
      );

      return (
        <>
          <ReadspeakerMessage
            text={t("messages.assignment", {
              ns: "readSpeaker",
              context: "text",
            })}
          />
          <span className="textfield-wrapper rs_skip_always">
            {component}
            {correctAnswersummaryComponent}
          </span>
        </>
      );
    }

    let component: React.ReactElement;
    if (this.props.content.autogrow) {
      component = (
        <AutosizeInput
          {...doNotInjectStyles}
          style={wrapperStyle}
          inputStyle={objectStyle}
          placeholderIsMinWidth={true}
          className={`textfield ${fieldStateAfterCheck}`}
          type="text"
          value={this.state.value}
          size={
            this.props.content.columns && parseInt(this.props.content.columns)
          }
          placeholder={this.props.content.hint}
          onChange={this.onInputChange}
        />
      );
    } else {
      component = (
        <>
          <ReadspeakerMessage
            text={t("messages.assignment", {
              ns: "readSpeaker",
              context: "text",
            })}
          />
          <span className={`textfield ${fieldStateAfterCheck} rs_skip_always`}>
            <input
              type="text"
              value={this.state.value}
              size={
                this.props.content.columns &&
                parseInt(this.props.content.columns)
              }
              placeholder={this.props.content.hint}
              style={textfieldStyle}
              onChange={this.onInputChange}
            />
          </span>
        </>
      );
    }

    const fieldSavedStateClass = createFieldSavedStateClass(
      this.state.fieldSavedState
    );

    // Standard modifiable version
    return (
      <>
        <ReadspeakerMessage
          text={t("messages.assignment", {
            ns: "readSpeaker",
            context: "text",
          })}
        />
        <span
          ref={this.baseRef}
          className={`textfield-wrapper ${fieldSavedStateClass} rs_skip_always`}
        >
          <Synchronizer
            synced={this.state.synced}
            syncError={this.state.syncError}
            onFieldSavedStateChange={this.onFieldSavedStateChange.bind(this)}
          />
          {this.props.content.hint ? (
            <Dropdown
              modifier="material-page-field-hint"
              content={this.props.content.hint}
            >
              {component}
            </Dropdown>
          ) : (
            component
          )}
          {correctAnswersummaryComponent}
        </span>
      </>
    );
  }
}

export default withTranslation(["materials", "common"])(TextField);
