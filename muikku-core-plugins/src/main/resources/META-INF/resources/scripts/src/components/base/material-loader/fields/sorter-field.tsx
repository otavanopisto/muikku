/* eslint-disable react/no-string-refs */

/**
 * Deprecated refs should be reractored
 */

import * as React from "react";
import { shuffle } from "~/util/modifiers";
import Draggable from "~/components/general/draggable";
import equals = require("deep-equal");
import Synchronizer from "./base/synchronizer";
import { StrMathJAX } from "../static/strmathjax";
import { UsedAs, FieldStateStatus } from "~/@types/shared";
import { createFieldSavedStateClass } from "../base/index";
import { WithTranslation, withTranslation } from "react-i18next";
import { ReadspeakerMessage } from "~/components/general/readspeaker";
import { Instructions } from "~/components/general/instructions";

/**
 * SorterFieldItemType
 */
interface SorterFieldItemType {
  id: string;
  name: string;
}

/**
 * SorterFieldProps
 */
interface SorterFieldProps extends WithTranslation {
  type: string;
  content: {
    name: string;
    orientation: "vertical" | "horizontal";
    capitalize: boolean;
    items: Array<SorterFieldItemType>;
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
 * SorterFieldState
 */
interface SorterFieldState {
  items: Array<SorterFieldItemType>;
  selectedItem: SorterFieldItemType;

  // This state comes from the context handler in the base
  // We can use it but it's the parent managing function that modifies them
  // We only set them up in the initial state
  modified: boolean;
  synced: boolean;
  syncError: string;

  // We have a answer state for each element in the sorter field
  // so we know which ones are messed up
  answerState: Array<"PASS" | "FAIL">;

  fieldSavedState: FieldStateStatus;
}

/**
 * SorterField
 */
class SorterField extends React.Component<SorterFieldProps, SorterFieldState> {
  itemRefs: HTMLSpanElement[];
  focusIndexRef: number;

  /**
   * constructor
   * @param props props
   */
  constructor(props: SorterFieldProps) {
    super(props);

    let value = null;
    let items: Array<SorterFieldItemType>;
    // We take the initial value and parse it because somehow it comes as a string
    // this comes from the composite reply as so
    if (props.initialValue) {
      value = JSON.parse(props.initialValue);
      // We set it up properly
      items = value
        .map(
          (v: string) =>
            this.props.content &&
            this.props.content.items.find((i) => i.id === v)
        )
        .filter((v: any) => !!v);
      const itemsSuffled = shuffle(props.content.items) || [];
      itemsSuffled.forEach((i) => {
        if (!items.find((si) => si.id === i.id)) {
          items.push(i);
        }
      });
    } else {
      // if we don't have a value, we
      items = shuffle(props.content ? props.content.items : []) || [];
    }

    this.state = {
      items,
      selectedItem: null,

      // modified synced and syncerror are false, true and null by default
      modified: false,
      synced: true,
      syncError: null,

      // initial answer state is not known
      answerState: null,

      fieldSavedState: null,
    };

    this.swap = this.swap.bind(this);
    this.selectItem = this.selectItem.bind(this);
    this.cancelSelectedItem = this.cancelSelectedItem.bind(this);
    this.onFieldSavedStateChange = this.onFieldSavedStateChange.bind(this);

    this.itemRefs = [];
    this.focusIndexRef = 0;
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
    nextProps: SorterFieldProps,
    nextState: SorterFieldState
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
   * swap - Swaps two items
   * @param triggerChange triggerChange
   * @param itemA itemA
   * @param itemB itemB
   */
  swap(
    triggerChange: boolean,
    itemA: SorterFieldItemType,
    itemB: SorterFieldItemType
  ) {
    if (itemA.id === itemB.id) {
      return;
    }

    // this is a basic function for swapping
    const items = this.state.items.map((item) => {
      if (item.id === itemA.id) {
        return itemB;
      } else if (item.id === itemB.id) {
        return itemA;
      }
      return item;
    });

    if (triggerChange && this.props.onChange) {
      this.props.onChange(
        this,
        this.props.content.name,
        JSON.stringify(items.map((item) => item.id))
      );
    }

    // items are update with the swapped version, and after that's done we check for rightness
    this.setState(
      {
        items,
      },
      () => {
        this.checkAnswers();
        if (document.activeElement) {
          this.focusTo(items.findIndex((i) => i.id === itemB.id));
        }
      }
    );
  }

  /**
   * checkAnswers
   */
  checkAnswers() {
    // if not set to actually do we cancel
    if (!this.props.checkAnswers) {
      return;
    }

    // ok so now we loop per item
    const newanswerState: Array<"PASS" | "FAIL"> = this.state.items.map(
      (item, index) => {
        // we check the answer from the property of the content, using the index we get what
        // element had to be in that specific index
        const answer = this.props.content.items[index];
        // if the ids are equal then the answer was correct
        const isAnswerProper =
          answer.id === item.id ||
          item.name.toLocaleLowerCase() === answer.name.toLocaleLowerCase();
        return isAnswerProper ? "PASS" : "FAIL";
      }
    );

    // We check if the new state is different before update
    if (!equals(newanswerState, this.state.answerState)) {
      this.setState({
        answerState: newanswerState,
      });
    }

    // In this case whether it overall right or not depends son whether
    // one of them failed, so we check
    const isCorrect = !newanswerState.includes("FAIL");
    // If we have no answer state to compare with, we just send the result
    if (!this.state.answerState) {
      this.props.onAnswerChange(this.props.content.name, isCorrect);
      return;
    }

    // Otherwise we compare and update accordingly only when necessary
    const wasCorrect = !this.state.answerState.includes("FAIL");
    if (isCorrect && !wasCorrect) {
      this.props.onAnswerChange(this.props.content.name, true);
    } else if (!isCorrect && wasCorrect) {
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
  componentDidUpdate(prevProps: SorterFieldProps, prevState: SorterFieldState) {
    this.checkAnswers();
  }

  /**
   * selectItem
   * @param item item
   */
  selectItem(item: SorterFieldItemType) {
    if (this.state.selectedItem) {
      this.swap(true, item, this.state.selectedItem);
      this.setState({
        selectedItem: null,
      });
      return;
    }

    this.setState({
      selectedItem: item,
    });
  }

  /**
   * Set focus to the ordered list first element
   * @param e event
   */
  handleOrderedListKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();

      this.focusIndexRef = 0;

      this.itemRefs[this.focusIndexRef].setAttribute("tabindex", "0");
      this.itemRefs[this.focusIndexRef].focus();
    }
  };

  /**
   * Handles focus and blur events
   * @param index index
   */
  handleFocusBlur = (index: number) => (e: React.FocusEvent) => {
    this.itemRefs[index].setAttribute("tabindex", "-1");
  };

  /**
   * Handles key down events
   * @param item item
   */
  handleKeyDown = (item: SorterFieldItemType) => (e: React.KeyboardEvent) => {
    if (
      e.key === "ArrowUp" ||
      e.key === "ArrowDown" ||
      e.key === "ArrowLeft" ||
      e.key === "ArrowRight" ||
      e.key === "Enter" ||
      e.key === " " ||
      e.key === "Escape"
    ) {
      e.stopPropagation();
      e.preventDefault();
    }

    switch (e.key) {
      case "Enter":
      case " ":
        this.selectItem(item);
        return;

      case "ArrowUp":
        this.props.content.orientation === "vertical" &&
          this.termFocusChange("decrement");
        return;

      case "ArrowDown":
        this.props.content.orientation === "vertical" &&
          this.termFocusChange("increment");
        return;

      case "ArrowLeft":
        this.props.content.orientation === "horizontal" &&
          this.termFocusChange("decrement");
        return;

      case "ArrowRight":
        this.props.content.orientation === "horizontal" &&
          this.termFocusChange("increment");
        return;

      case "Escape":
        this.cancelSelectedItem();
        return;

      default:
        return;
    }
  };

  /**
   * Change the focus of the term
   * @param operation operation
   */
  termFocusChange = (operation: "increment" | "decrement") => {
    if (operation === "increment") {
      this.focusIndexRef++;
    } else {
      this.focusIndexRef--;
    }

    if (this.focusIndexRef > this.itemRefs.length - 1) {
      this.focusIndexRef = 0;
    } else if (this.focusIndexRef < 0) {
      this.focusIndexRef = this.itemRefs.length - 1;
    }

    this.itemRefs[this.focusIndexRef].setAttribute("tabindex", "0");
    this.itemRefs[this.focusIndexRef].focus();
  };

  /**
   * Focus to the specific term
   * @param n n
   */
  focusTo = (n: number) => {
    const element = this.itemRefs[n];

    if (element) {
      element.setAttribute("tabindex", "0");
      element.focus();
    }
  };

  /**
   * cancelSelectedItem
   */
  cancelSelectedItem() {
    this.setState({
      selectedItem: null,
    });

    // if we got on change we call it and we remember to stringify the answer because it wants strings
    this.props.onChange &&
      this.props.onChange(
        this,
        this.props.content.name,
        JSON.stringify(this.state.items.map((item) => item.id))
      );
  }

  /**
   * render
   */
  render() {
    const { t } = this.props;

    if (!this.props.content) {
      return null;
    }
    const elementClassName =
      this.props.content.orientation === "vertical" ? "vertical" : "horizontal";

    // The summary for the correct answers
    let correctAnswersummaryComponent = null;
    const answerIsBeingCheckedAndItisCorrect =
      this.props.checkAnswers &&
      this.state.answerState &&
      !this.state.answerState.includes("FAIL");
    // We only display the correct answers if we got them wrong or they are not being checked at all
    if (
      this.props.displayCorrectAnswers &&
      !answerIsBeingCheckedAndItisCorrect
    ) {
      // We create the summary witih the correct answers
      correctAnswersummaryComponent = (
        <span className="material-page__field-answer-examples material-page__field-answer-examples--sorterfield">
          <span className="material-page__field-answer-examples-title">
            {t("labels.answer", { ns: "materials", context: "correct" })}:{" "}
          </span>
          {this.props.content.items.map((answer, index) => (
            <span
              key={answer.id}
              className="material-page__field-answer-example"
            >
              <StrMathJAX>{answer.name}</StrMathJAX>
            </span>
          ))}
        </span>
      );
    }

    if (this.props.invisible) {
      const filler = this.state.items.map((i, index) => {
        let text = i.name;
        if (index === 0 && this.props.content.capitalize) {
          text = text.charAt(0).toUpperCase() + text.slice(1);
        }
        return (
          <span className="material-page__sorterfield-item" key={i.id}>
            <span className="material-page__sorterfield-item-icon icon-move"></span>
            <span className="material-page__sorterfield-item-label">
              <StrMathJAX invisible={true}>{text}</StrMathJAX>
            </span>
          </span>
        );
      });
      return (
        <>
          <ReadspeakerMessage
            text={t("messages.assignment", {
              ns: "readSpeaker",
              context: "sorter",
            })}
          />
          <span
            ref="base"
            className="material-page__sorterfield-wrapper rs_skip_always"
          >
            <span
              className={`material-page__sorterfield material-page__sorterfield--${elementClassName}`}
            >
              {filler}
            </span>
            {correctAnswersummaryComponent}
          </span>
        </>
      );
    }

    // Lets get the class name to match the state of the entire field if necessary
    const fieldStateAfterCheck =
      this.props.displayCorrectAnswers &&
      this.props.checkAnswers &&
      this.state.answerState
        ? this.state.answerState.includes("FAIL")
          ? "incorrect-answer"
          : "correct-answer"
        : "";

    // if elements is disabled
    const elementDisabledStateClassName = this.props.readOnly
      ? "material-page__taskfield-disabled"
      : "";

    const fieldSavedStateClass = createFieldSavedStateClass(
      this.state.fieldSavedState
    );

    // we use that element and the class to create the field
    return (
      <>
        <ReadspeakerMessage
          text={t("messages.assignment", {
            ns: "readSpeaker",
            context: "sorter",
          })}
        />
        <span
          className={`material-page__sorterfield-wrapper ${fieldSavedStateClass} rs_skip_always`}
        >
          <Synchronizer
            synced={this.state.synced}
            syncError={this.state.syncError}
            onFieldSavedStateChange={this.onFieldSavedStateChange.bind(this)}
          />
          <span className="material-page__taskfield-header">
            <span></span>
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
                    __html: t("instructions.sorterField", { ns: "materials" }),
                  }}
                />
              }
            />
          </span>
          <ol
            tabIndex={0}
            onKeyDown={this.handleOrderedListKeyDown}
            className={`material-page__sorterfield material-page__sorterfield--${elementClassName} ${fieldStateAfterCheck} ${elementDisabledStateClassName}`}
          >
            {this.state.items.map((item, index) => {
              // We get the text
              let text = item.name;
              // if we are wanted to capitalize we do so
              if (index === 0 && this.props.content.capitalize) {
                text = text.charAt(0).toUpperCase() + text.slice(1);
              }
              // Now we might be able if we are asked to to show the rightness of the very specific item
              // this only happens if the answer is wrong total because otherwise is right and it's unecessary
              // we set them up so that they show each if they are right or wrong

              const itemStateAfterCheck =
                this.props.displayCorrectAnswers &&
                this.props.checkAnswers &&
                !answerIsBeingCheckedAndItisCorrect &&
                this.state.answerState &&
                this.state.answerState[index]
                  ? this.state.answerState[index].includes("FAIL")
                    ? "incorrect-answer"
                    : "correct-answer"
                  : "";

              if (this.props.readOnly) {
                // readonly component
                return (
                  <li
                    className={`material-page__sorterfield-item ${itemStateAfterCheck}`}
                    key={item.id}
                  >
                    <span className="material-page__sorterfield-item-icon icon-move"></span>
                    <span className="material-page__sorterfield-item-label">
                      <StrMathJAX>{text}</StrMathJAX>
                    </span>
                  </li>
                );
              }

              const ariaLabel =
                this.state.selectedItem &&
                this.state.selectedItem.id === item.id
                  ? this.props.t("wcag.sorterTermSelected", { ns: "materials" })
                  : "";

              /**
               * callBackRef
               * @param ref ref
               */
              const callBackRef = (ref: HTMLSpanElement) => {
                this.itemRefs[index] = ref;
              };

              // The draggable version, note how on interaction we swap
              // the parent component is a class name always make sure to have the right class name not to overflow
              // the interaction data is the item itself so the argument would be that
              return (
                <Draggable
                  denyWidth={this.props.content.orientation === "horizontal"}
                  as="li"
                  parentContainerSelector=".material-page__sorterfield"
                  className={`material-page__sorterfield-item ${
                    this.state.selectedItem &&
                    this.state.selectedItem.id === item.id
                      ? "material-page__sorterfield-item--selected"
                      : ""
                  } ${itemStateAfterCheck} rs_skip_always`}
                  key={item.id}
                  interactionGroup={this.props.content.name}
                  interactionData={item}
                  onInteractionWith={this.swap.bind(this, false, item)}
                  onClick={this.selectItem.bind(this, item)}
                  onDrag={this.selectItem.bind(this, item)}
                  onDropInto={this.cancelSelectedItem}
                >
                  <span
                    role="button"
                    tabIndex={0}
                    ref={callBackRef}
                    onKeyDown={this.handleKeyDown(item)}
                    onBlur={this.handleFocusBlur(index)}
                    aria-label={ariaLabel}
                    aria-pressed={
                      this.state.selectedItem &&
                      this.state.selectedItem.id === item.id
                    }
                  >
                    <span className="material-page__sorterfield-item-icon icon-move"></span>
                    <span className="material-page__sorterfield-item-label">
                      <StrMathJAX>{text}</StrMathJAX>
                    </span>
                  </span>
                </Draggable>
              );
            })}
          </ol>
          {correctAnswersummaryComponent}
        </span>
      </>
    );
  }
}

export default withTranslation(["materials", "common"])(SorterField);
