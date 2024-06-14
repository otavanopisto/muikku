/* eslint-disable react/no-string-refs */

/**
 * Deprecated refs should be reractored
 */

import * as React from "react";
import equals = require("deep-equal");
import Dropdown from "~/components/general/dropdown";
import Synchronizer from "./base/synchronizer";
import { v4 as uuidv4 } from "uuid";
import { StrMathJAX } from "../static/strmathjax";
import { UsedAs, FieldStateStatus } from "~/@types/shared";
import { createFieldSavedStateClass } from "../base/index";
import { WithTranslation, withTranslation } from "react-i18next";
import { ReadspeakerMessage } from "~/components/general/readspeaker";
import "~/sass/elements/selectfield.scss";
import "~/sass/elements/radiobuttonfield.scss";

/**
 * SelectFieldProps
 */
interface SelectFieldProps extends WithTranslation {
  type: string;
  content: {
    name: string;
    explanation: string;
    listType: "dropdown" | "list" | "radio-horizontal" | "radio-vertical";
    options: Array<{
      name: string;
      text: string;
      correct: boolean;
    }>;
  };
  readOnly?: boolean;
  initialValue?: string;
  onChange?: (
    context: React.Component<any, any>,
    name: string,
    newValue: any
  ) => any;

  usedAs: UsedAs;
  displayCorrectAnswers?: boolean;
  checkAnswers?: boolean;
  onAnswerChange?: (name: string, value: boolean) => any;

  invisible?: boolean;
}

/**
 * SelectFieldState
 */
interface SelectFieldState {
  value: string;

  // This state comes from the context handler in the base
  // We can use it but it's the parent managing function that modifies them
  // We only set them up in the initial state
  modified: boolean;
  synced: boolean;
  syncError: string;

  // The answer might be unknown pass or fail, sometimes there's just no right answer
  answerState: "UNKNOWN" | "PASS" | "FAIL";

  fieldSavedState: FieldStateStatus;
}

/**
 * SelectField
 */
class SelectField extends React.Component<SelectFieldProps, SelectFieldState> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: SelectFieldProps) {
    super(props);

    this.onSelectChange = this.onSelectChange.bind(this);
    this.onFieldSavedStateChange = this.onFieldSavedStateChange.bind(this);

    this.state = {
      value: props.initialValue || "",

      // modified synced and syncerror are false, true and null by default
      modified: false,
      synced: true,
      syncError: null,

      // We dunno what the answer state is
      answerState: null,

      fieldSavedState: null,
    };
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
   * onSelectChange
   * @param e e
   */
  onSelectChange(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) {
    // When the select changes, we gotta call it up
    this.props.onChange &&
      this.props.onChange(this, this.props.content.name, e.target.value);
    // we update the state and check answers
    this.setState({ value: e.target.value }, this.checkAnswers);
  }

  /**
   * shouldComponentUpdate
   * @param nextProps nextProps
   * @param nextState nextState
   */
  shouldComponentUpdate(
    nextProps: SelectFieldProps,
    nextState: SelectFieldState
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
   * checkAnswers
   */
  checkAnswers() {
    // if we are allowed to check answers
    if (!this.props.checkAnswers || !this.props.content) {
      return;
    }

    // So just like text-field, there might be no right answer
    const actuallyCorrectAnswers = this.props.content.options.filter(
      (a) => a.correct
    );
    if (!actuallyCorrectAnswers.length) {
      // And equally we just call the state UNKNOWN
      if (this.state.answerState !== "UNKNOWN") {
        this.setState({
          answerState: "UNKNOWN",
        });
        // And call a answer change for it to be unknown
        this.props.onAnswerChange(this.props.content.name, null);
      }
      return;
    }

    // we do the same and start looping
    let isCorrect: boolean;
    let answer;
    for (answer of actuallyCorrectAnswers) {
      // somehow the value and the name mix up here but it works out
      isCorrect = this.state.value === answer.name;
      // if we found that this check was right
      if (isCorrect) {
        // we break
        break;
      }
    }

    // We update accordingly only if the answer has changed
    if (isCorrect && this.state.answerState !== "PASS") {
      this.setState({
        answerState: "PASS",
      });
      // and call the function accordingly
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
  componentDidUpdate(prevProps: SelectFieldProps, prevState: SelectFieldState) {
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
    if (this.props.invisible) {
      if (
        this.props.content.listType === "dropdown" ||
        this.props.content.listType === "list"
      ) {
        return (
          <>
            <ReadspeakerMessage
              text={t("messages.assignment", {
                ns: "readSpeaker",
                context: "select",
              })}
            />
            <span className="selectfield-wrapper rs_skip_always">
              <select
                className="selectfield"
                size={
                  this.props.content.listType === "list"
                    ? this.props.content.options.length
                    : null
                }
                disabled
              />
            </span>
          </>
        );
      }

      return (
        <>
          <ReadspeakerMessage
            text={t("messages.assignment", {
              ns: "readSpeaker",
              context: "select",
            })}
          />
          <span className="radiobuttonfield-wrapper rs_skip_always" ref="base">
            {this.props.content.options.map((o) => (
              <span
                className={`radiobuttonfield__items-wrapper radiobuttonfield__items-wrapper--${
                  this.props.content.listType === "radio-horizontal"
                    ? "horizontal"
                    : "vertical"
                }`}
                key={o.name}
              >
                <span className="radiobuttonfield__item-container">
                  <input className="radiobuttonfield" type="radio" disabled />
                  <label className="radiobuttonfield__checkable-label">
                    {o.text}
                  </label>
                </span>
              </span>
            ))}
          </span>
        </>
      );
    }

    // Select field is able to mark what were meant to be the correct answers in the field itself
    let markcorrectAnswers = false;

    // It also has a summary component of what the correct answers were meant to be
    let correctAnswersummaryComponent = null;

    // So we only care about this logic if we didn't get the answer right and we are asking for show the right thing
    // Note that a state of UNKNOWN also goes through here, but not a state of PASS
    if (this.props.displayCorrectAnswers) {
      // find the correct answers from the list
      const correctAnswersFound = this.props.content.options.filter(
        (a) => a.correct
      );
      // if we have some correct answers
      if (correctAnswersFound.length) {
        // We say we will mark those that are correct
        markcorrectAnswers = true;
        // we make the summary component, note we might have an explanation
        // For some reason it saves to no explanation
        correctAnswersummaryComponent = (
          <span className="material-page__field-answer-examples">
            <span className="material-page__field-answer-examples-title">
              {t("labels.answer", { ns: "materials", context: "correct" })}:{" "}
            </span>
            {correctAnswersFound.map((answer, index) => (
              <span key={index} className="material-page__field-answer-example">
                <StrMathJAX>{answer.text}</StrMathJAX>
              </span>
            ))}
            {this.props.content.explanation ? (
              <span className="material-page__field-explanation-wrapper">
                <Dropdown
                  modifier="material-page-field-explanation"
                  content={
                    <StrMathJAX>{this.props.content.explanation}</StrMathJAX>
                  }
                >
                  <span className="material-page__field-explanation-button icon-question" />
                </Dropdown>
              </span>
            ) : null}
          </span>
        );
      } else if (this.props.content.explanation) {
        // Otherwise if there were no right answer say with a state of UNKNOWN, then we show the explanation if avaliable
        correctAnswersummaryComponent = (
          <span className="material-page__field-answer-examples">
            <span className="material-page__field-answer-examples-title">
              {this.props.i18n.t("labels.answer", {
                ns: "materials",
                context: "example",
              })}
            </span>
            <span className="material-page__field-answer-example">
              <StrMathJAX>{this.props.content.explanation}</StrMathJAX>
            </span>
          </span>
        );
      }
    }

    const fieldSavedStateClass = createFieldSavedStateClass(
      this.state.fieldSavedState
    );

    // The classname that represents the state of the whole field
    const fieldStateAfterCheck =
      this.state.answerState !== "UNKNOWN" && this.props.checkAnswers
        ? this.state.answerState === "FAIL"
          ? "incorrect-answer"
          : "correct-answer"
        : "";

    // So the dropdown and list type are handled differently
    if (
      this.props.content.listType === "dropdown" ||
      this.props.content.listType === "list"
    ) {
      const selectFieldType =
        this.props.content.listType === "list" ? "list" : "dropdown";
      return (
        <>
          <ReadspeakerMessage
            text={t("messages.assignment", {
              ns: "readSpeaker",
              context: "select",
            })}
          />
          <span
            className={`selectfield-wrapper selectfield-wrapper--${selectFieldType} ${fieldSavedStateClass} rs_skip_always`}
          >
            <Synchronizer
              synced={this.state.synced}
              syncError={this.state.syncError}
              onFieldSavedStateChange={this.onFieldSavedStateChange.bind(this)}
            />
            <select
              className={`selectfield ${fieldStateAfterCheck}`}
              size={
                this.props.content.listType === "list"
                  ? this.props.content.options.length
                  : null
              }
              value={this.state.value}
              onChange={this.onSelectChange}
              disabled={this.props.readOnly}
            >
              {this.props.content.listType === "dropdown" ? (
                <option value="" />
              ) : null}
              {this.props.content.options.map((o) => (
                <option
                  className="selectfield__item-container"
                  key={o.name}
                  value={o.name}
                >
                  {o.text}
                </option>
              ))}
            </select>
            {correctAnswersummaryComponent}
          </span>
        </>
      );
    }

    //this is for the standard
    return (
      <>
        <ReadspeakerMessage
          text={t("messages.assignment", {
            ns: "readSpeaker",
            context: "select",
          })}
        />
        <span
          className={`radiobuttonfield-wrapper ${fieldSavedStateClass} rs_skip_always`}
        >
          <Synchronizer
            synced={this.state.synced}
            syncError={this.state.syncError}
            onFieldSavedStateChange={this.onFieldSavedStateChange.bind(this)}
          />
          <span
            className={`radiobuttonfield__items-wrapper radiobuttonfield__items-wrapper--${
              this.props.content.listType === "radio-horizontal"
                ? "horizontal"
                : "vertical"
            } ${fieldStateAfterCheck}`}
          >
            {this.props.content.options.map((o) => {
              // lets generate unique id for labels and radio buttons
              const uniqueElementID = "rb-" + uuidv4();

              // Classname that represents the state of the individual radio button
              let radioButtonStateAfterCheck = "";

              if (
                this.state.answerState !== "UNKNOWN" &&
                this.props.checkAnswers &&
                this.props.displayCorrectAnswers
              ) {
                radioButtonStateAfterCheck =
                  this.state.answerState === "FAIL"
                    ? "incorrect-answer"
                    : "correct-answer";
              }

              return (
                <span
                  className={`radiobuttonfield__item-container ${radioButtonStateAfterCheck}`}
                  key={o.name}
                >
                  <input
                    id={uniqueElementID}
                    className="radiobuttonfield"
                    type="radio"
                    value={o.name}
                    checked={this.state.value === o.name}
                    onChange={this.onSelectChange}
                    disabled={this.props.readOnly}
                  />
                  <label
                    htmlFor={uniqueElementID}
                    className="radiobuttonfield__checkable-label"
                  >
                    <StrMathJAX>{o.text}</StrMathJAX>
                  </label>
                </span>
              );
            })}
          </span>
          {correctAnswersummaryComponent}
        </span>
      </>
    );
  }
}

export default withTranslation(["materials", "common"])(SelectField);
