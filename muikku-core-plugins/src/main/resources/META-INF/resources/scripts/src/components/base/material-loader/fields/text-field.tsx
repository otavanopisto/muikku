import * as React from "react";
import equals = require("deep-equal");
import { i18nType } from "~/reducers/base/i18n";
import Dropdown from "~/components/general/dropdown";
import Synchronizer from "./base/synchronizer";
import AutosizeInput from "react-input-autosize";
import { UsedAs } from "~/@types/shared";

interface TextFieldProps {
  type: string;
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
  onChange?: (
    context: React.Component<any, any>,
    name: string,
    newValue: any
  ) => any;
  readOnly?: boolean;
  initialValue?: string;
  i18n: i18nType;
  usedAs: UsedAs;
  displayCorrectAnswers?: boolean;
  checkAnswers?: boolean;
  onAnswerChange?: (name: string, value: boolean) => any;

  invisible: boolean;
}

interface TextFieldState {
  value: string;

  //This state comes from the context handler in the base
  //We can use it but it's the parent managing function that modifies them
  //We only set them up in the initial state
  modified: boolean;
  synced: boolean;
  syncError: string;

  //The text field might have a answer state of unknown pass or fail
  answerState: "UNKNOWN" | "PASS" | "FAIL";
}

export default class TextField extends React.Component<
  TextFieldProps,
  TextFieldState
> {
  constructor(props: TextFieldProps) {
    super(props);

    this.state = {
      //Set the initial value
      value: props.initialValue || "",
      //modified synced and syncerror are false, true and null by default
      modified: false,
      synced: true,
      syncError: null,

      //the intial answer state is totally unknown, not UNKNOWN but literally unknown if it's even UNKNOWN
      answerState: null,
    };

    this.onInputChange = this.onInputChange.bind(this);
  }
  shouldComponentUpdate(nextProps: TextFieldProps, nextState: TextFieldState) {
    //So we only update if these props change and any of the state
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
  //when the input change
  onInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!this.props.content) {
      return;
    }
    //we call the on change function with the context and the name
    this.props.onChange &&
      this.props.onChange(this, this.props.content.name, e.target.value);
    this.setState(
      {
        value: e.target.value,
      },
      this.checkAnswers
    );
  }
  checkAnswers() {
    //if the property is not there we cancel
    if (!this.props.checkAnswers || !this.props.content) {
      return;
    }

    //Check for all the correct answers and filter which ones are set to be correct
    let actuallyCorrectAnswers = this.props.content
      ? this.props.content.rightAnswers.filter((a) => a.correct)
      : [];

    //If there's not a single one that has the flag of being the correct answer
    if (!actuallyCorrectAnswers.length) {
      //the answer state is UNKNOWN
      if (this.state.answerState !== "UNKNOWN") {
        this.setState({
          answerState: "UNKNOWN",
        });
        //The rightness is sent as unknown to the function
        this.props.onAnswerChange(this.props.content.name, null);
      }
      return;
    }

    //Otherwise we gotta check each
    let isCorrect: boolean;
    let answer;

    //We loop in the correct answers
    for (answer of actuallyCorrectAnswers) {
      //And compare them according to the rules
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
      //if we get a match we break
      if (isCorrect) {
        break;
      }
    }

    //Now we compare and call the rightness change function
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
  //We check for rightness on mount and update
  componentDidMount() {
    this.checkAnswers();
  }
  componentDidUpdate(prevProps: TextFieldProps, prevState: TextFieldState) {
    this.checkAnswers();
  }
  render() {
    if (!this.props.content) {
      return null;
    }
    //This is the component that provides the summary of the correct answers
    let correctAnswersummaryComponent = null;
    //a boolean representing whether the answer is correct and we are actually checking for it
    let checkAnswersAndAnswerIsCorrect =
      this.props.checkAnswers && this.state.answerState === "PASS";
    //If we are told to display the correct answers (we don't do that if the answer is checked and right because it's pointless)
    //UNKNOWN also gets there, so the correct answers will be shown even if the state is unknown
    if (
      this.props.displayCorrectAnswers &&
      this.props.content &&
      this.props.content.rightAnswers &&
      !checkAnswersAndAnswerIsCorrect
    ) {
      //find the actually correct answers
      let actuallyCorrectAnswers = this.props.content.rightAnswers.filter(
        (a) => a.correct
      );
      //answers are example is for language, this happens if we have no correct answers
      let answersAreExample = false;
      //if we don't have correct answers
      if (!actuallyCorrectAnswers.length) {
        //We just set them all as right and make it be an example, this happens for example when the answer state is UNKNOWN
        answersAreExample = true;
        actuallyCorrectAnswers = this.props.content.rightAnswers;
      }
      //We create the component
      correctAnswersummaryComponent = actuallyCorrectAnswers.length ? (
        <span className="material-page__field-answer-examples">
          <span className="material-page__field-answer-examples-title">
            {this.props.i18n.text.get(
              answersAreExample
                ? "plugin.workspace.assigment.checkAnswers.detailsSummary.title"
                : "plugin.workspace.assigment.checkAnswers.correctSummary.title"
            )}
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
        <span ref="base" className="material-page__textfield-wrapper">
          <span className="material-page__textfield">
            <input readOnly />
          </span>
          {correctAnswersummaryComponent}
        </span>
      );
    }

    const Component = (props: any) => {
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
    };

    // Lets calculate textfield width based on textfield size option.
    // If no option size has been set then we use 50 as a default value.
    // This sets baseline width for normal textfields and autogrow textfields so they appear at same width when they have same size set.
    const textfieldWidth =
      this.props.content.columns && !isNaN(Number(this.props.content.columns))
        ? Number(this.props.content.columns) * 10
        : 50;

    const textfieldStyle = {
      width: textfieldWidth,
      "box-sizing": "content-box",
    };

    const doNotInjectStyles = {
      injectStyles: false,
      minWidth: textfieldWidth,
    } as any;

    const wrapperStyle = {
      display: "inherit",
    };

    const objectStyle = {
      boxSizing: "content-box",
    };

    // The state of the whole field
    let fieldStateAfterCheck =
      this.state.answerState !== "UNKNOWN" &&
      this.props.displayCorrectAnswers &&
      this.props.checkAnswers
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
          className={`material-page__textfield ${fieldStateAfterCheck}`}
          type="text"
          value={this.state.value}
          size={
            this.props.content.columns && parseInt(this.props.content.columns)
          }
        />
      ) : (
        <span className={`material-page__textfield ${fieldStateAfterCheck}`}>
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
        <span className="material-page__textfield-wrapper">
          {component}
          {correctAnswersummaryComponent}
        </span>
      );
    }

    // Read only version for evaluation tool. PLEASE ADD STYLES
    else if (this.props.readOnly && this.props.usedAs === "evaluationTool") {
      const component = (
        <span
          className={`material-page__textfield ${fieldStateAfterCheck} material-page__textfield--evaluation`}
        >
          {this.state.value ? this.state.value : <>&nbsp;</>}
        </span>
      );

      return (
        <span className="material-page__textfield-wrapper">
          {component}
          {correctAnswersummaryComponent}
        </span>
      );
    }

    let component: React.ReactNode;
    if (this.props.content.autogrow) {
      component = (
        <AutosizeInput
          {...doNotInjectStyles}
          style={wrapperStyle}
          inputStyle={objectStyle}
          placeholderIsMinWidth={true}
          className={`material-page__textfield ${fieldStateAfterCheck}`}
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
        <span className={`material-page__textfield ${fieldStateAfterCheck}`}>
          <input
            type="text"
            value={this.state.value}
            size={
              this.props.content.columns && parseInt(this.props.content.columns)
            }
            placeholder={this.props.content.hint}
            style={textfieldStyle}
            onChange={this.onInputChange}
          />
        </span>
      );
    }

    //Standard modifiable version
    return (
      <span className="material-page__textfield-wrapper">
        <Synchronizer
          synced={this.state.synced}
          syncError={this.state.syncError}
          i18n={this.props.i18n}
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
    );
  }
}
