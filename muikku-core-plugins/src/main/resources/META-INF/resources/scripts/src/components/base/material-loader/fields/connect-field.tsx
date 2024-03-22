import * as React from "react";
import { shuffle } from "~/util/modifiers";
import Draggable from "~/components/general/draggable";
import equals = require("deep-equal");
import Synchronizer from "./base/synchronizer";
import { StrMathJAX } from "../static/strmathjax";
import { UsedAs, FieldStateStatus } from "~/@types/shared";
import { createFieldSavedStateClass } from "../base/index";
import { ReadspeakerMessage } from "~/components/general/readspeaker";
import { Instructions } from "~/components/general/instructions";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * FieldType
 */
interface FieldType {
  name: string;
  text: string;
}

/**
 * ConnectFieldProps
 */
interface ConnectFieldProps extends WithTranslation {
  type: string;
  content: {
    name: string;
    fields: FieldType[];
    counterparts: FieldType[];
    connections: {
      field: string;
      counterpart: string;
    }[];
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
 * ConnectFieldState
 */
interface ConnectFieldState {
  fields: FieldType[];
  counterparts: FieldType[];
  selectedField: FieldType;
  selectedIsCounterpart: boolean;
  selectedIndex: number;
  editedIds: Set<string>;

  // This state comes from the context handler in the base
  // We can use it but it's the parent managing function that modifies them
  // We only set them up in the initial state
  modified: boolean;
  synced: boolean;
  syncError: string;

  // we check whether each pair passed or failed
  // there is no unknown state here
  answerState: Array<"PASS" | "FAIL">;

  fieldSavedState: FieldStateStatus;
}

/**
 * ConnectField
 */
class ConnectField extends React.Component<
  ConnectFieldProps,
  ConnectFieldState
> {
  itemRefs: HTMLSpanElement[];
  /**
   * constructor
   * @param props props
   */
  constructor(props: ConnectFieldProps) {
    super(props);

    // we need to prepare the initial state
    // this is for the fields
    let fields: FieldType[];
    // and the counterparts
    let counterparts: FieldType[];
    // the fields that have been edited, sadly we don't know from the start
    // but I leave in here just in case
    const editedIdsArray: Array<string> = [];

    // so if we got an initial value
    if (props.initialValue) {
      // we parse the initial value given
      const value = JSON.parse(props.initialValue);
      // let get the fields from the content
      fields = props.content.fields;
      // and the counterparts
      counterparts = [];

      // Set all the counterparts that are used
      const usedCounterparts: string[] = [];
      fields.forEach((field) => {
        const counterpartId = value[field.name];
        // now for some reason we might have uncomplete values
        if (counterpartId) {
          usedCounterparts.push(counterpartId);
        }
      });

      const shuffledCounterparts = shuffle(props.content.counterparts);
      // and now we match the counterpart with the fields as given by the initial value
      fields.forEach((field) => {
        let counterpartId = value[field.name];
        // now for some reason we might have uncomplete values
        if (!counterpartId) {
          counterpartId = shuffledCounterparts.find(
            (c) => !usedCounterparts.includes(c.name)
          ).name;
          usedCounterparts.push(counterpartId);
        }
        const counterpart = props.content.counterparts.find(
          (c) => c.name === counterpartId
        );
        counterparts.push(counterpart);
      });

      // This is where edited ids array could be but it's not possible because
      // the value contains all the combos, even if they weren't edited
    } else {
      // otherwise we just shuffle the thing
      counterparts = shuffle(props.content.counterparts);
      fields = props.content.fields;
    }

    // set the state
    this.state = {
      fields,
      counterparts,
      selectedField: null,
      selectedIsCounterpart: false,
      selectedIndex: null,
      editedIds: new Set(editedIdsArray),

      // modified synced and syncerror are false, true and null by default
      modified: false,
      synced: true,
      syncError: null,
      answerState: null,

      fieldSavedState: null,
    };

    this.swapField = this.swapField.bind(this);
    this.swapCounterpart = this.swapCounterpart.bind(this);
    this.pickField = this.pickField.bind(this);
    this.cancelPreviousPick = this.cancelPreviousPick.bind(this);
    this.triggerChange = this.triggerChange.bind(this);
    this.onFieldSavedStateChange = this.onFieldSavedStateChange.bind(this);

    this.itemRefs = [];
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
    nextProps: ConnectFieldProps,
    nextState: ConnectFieldState
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
   * triggerChange
   */
  triggerChange() {
    // whenever we get a change, check for rightness
    this.checkAnswers();

    // if there is no onchange function then return
    // there is no bussiness with the next code
    if (!this.props.onChange) {
      return;
    }

    // so we create the new value
    const newValue: any = {};
    // get the fields and create the object
    this.state.fields.forEach((field, index) => {
      const counterpart = this.state.counterparts[index];
      newValue[field.name] = counterpart.name;
    });
    // and trigger the change
    if (this.props.content && this.props.content.name) {
      this.props.onChange(
        this,
        this.props.content.name,
        JSON.stringify(newValue)
      );
    }
  }

  /**
   * checkAnswers
   */
  checkAnswers() {
    // if we are not allowed to check for rightness then return
    if (!this.props.checkAnswers || !this.props.content) {
      return;
    }

    // so now we got to assess each change
    const newanswerState: Array<"PASS" | "FAIL"> = this.state.fields.map(
      (field, index) => {
        // get the counterpart from the same index
        const counterpart = this.state.counterparts[index];
        // check whether the connection matches
        const connection = this.props.content.connections.find(
          (connection) => connection.field === field.name
        );
        // and return pass or fail

        if (!connection) {
          return "FAIL";
        } else if (connection && connection.counterpart === counterpart.name) {
          return "PASS";
        }

        const allCounterpartsWithTheSameValue = this.state.counterparts.filter(
          (cp) => cp.text.toLowerCase() === counterpart.text.toLowerCase()
        );
        const allCounterpartsMatchingNameList =
          allCounterpartsWithTheSameValue.map((cp) => cp.name);

        // We try to find all the fields that share the same written text as our field
        const allFieldsWithTheSameValue = this.state.fields.filter(
          (f2) => f2.text.toLocaleLowerCase() === field.text.toLocaleLowerCase()
        );
        // now we find all the connections for each one of those fields
        const allConnectionsForTheSameFieldName = allFieldsWithTheSameValue
          .map((f2) =>
            this.props.content.connections.find((c2) => c2.field === f2.name)
          )
          .filter((c2) => !!c2);
        // we check if the counterpart we have matches one of those connections
        const counterpartIsOneOfThoseConnections =
          allConnectionsForTheSameFieldName.some((c2) =>
            allCounterpartsMatchingNameList.includes(c2.counterpart)
          );
        return counterpartIsOneOfThoseConnections ? "PASS" : "FAIL";
      }
    );

    // if the new state does not equal the current set the state
    if (!equals(newanswerState, this.state.answerState)) {
      this.setState({
        answerState: newanswerState,
      });
    }

    // check whether it is right
    const isCorrect = !newanswerState.includes("FAIL");
    // if we don't have a answer state
    if (!this.state.answerState) {
      // then send it thru
      this.props.onAnswerChange(this.props.content.name, isCorrect);
      return;
    }

    // otherwise lets check which one was the previous
    const wasCorrect = !this.state.answerState.includes("FAIL");
    // and update in a way where it matters if it changed
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
  componentDidUpdate(
    prevProps: ConnectFieldProps,
    prevState: ConnectFieldState
  ) {
    this.checkAnswers();
  }

  /**
   * swapField
   * @param executeTriggerChangeFunction executeTriggerChangeFunction
   * @param fielda fielda
   * @param fieldb fieldb
   */
  swapField(
    executeTriggerChangeFunction: boolean,
    fielda: FieldType,
    fieldb: FieldType
  ) {
    // if the same then it's pointless
    if (fielda.name === fieldb.name) {
      return;
    }

    // basically just swapping the fields from the state
    this.setState(
      {
        fields: this.state.fields.map((f) => {
          if (f.name === fielda.name) {
            return fieldb;
          } else if (f.name === fieldb.name) {
            return fielda;
          }
          return f;
        }),
      },
      executeTriggerChangeFunction ? this.triggerChange : null
    );
  }

  /**
   * swapCounterpart
   * @param executeTriggerChangeFunction executeTriggerChangeFunction
   * @param fielda fielda
   * @param fieldb fieldb
   */
  swapCounterpart(
    executeTriggerChangeFunction: boolean,
    fielda: FieldType,
    fieldb: FieldType
  ) {
    if (fielda.name === fieldb.name) {
      return;
    }
    this.setState(
      {
        counterparts: this.state.counterparts.map((f) => {
          if (f.name === fielda.name) {
            return fieldb;
          } else if (f.name === fieldb.name) {
            return fielda;
          }
          return f;
        }),
      },
      () => {
        if (executeTriggerChangeFunction) {
          this.triggerChange();
        }

        if (document.activeElement) {
          this.focusIndex(
            this.state.counterparts.findIndex((f) => f.name === fielda.name)
          );
        }
      }
    );
  }

  /**
   * pickField
   * @param executeTriggerChangeFunction executeTriggerChangeFunction
   * @param field field
   * @param isCounterpart isCounterpart
   * @param index index
   */
  // ok so this is about picking a field, whether it is counterpart or not, and the index it is in
  // I could've found the index it is in, by searching, but I am lazy
  // and I want it in the function
  pickField(
    executeTriggerChangeFunction: boolean,
    field: FieldType,
    isCounterpart: boolean,
    index: number
  ) {
    // if by the time this function runs there is no selected field
    // then we just set the state that this one is the first selected
    // And we got no business to do
    if (!this.state.selectedField) {
      this.setState({
        selectedField: field,
        selectedIsCounterpart: isCounterpart,
        selectedIndex: index,
      });
      return;
    }

    // otherwise let get the editedIds
    const editedIds = new Set(this.state.editedIds);

    // lets check for the new field name and make sure that is not the same as the selected
    if (field.name !== this.state.selectedField.name) {
      // if the selected is counterpart and this one is counterpart
      // then we need to swap two counterparts
      if (this.state.selectedIsCounterpart && isCounterpart) {
        // we swap them
        this.swapCounterpart(
          executeTriggerChangeFunction,
          this.state.selectedField,
          field
        );

        // however we need to figure out for the edited things
        // the opposite of the
        const diametricOpposite = this.state.fields[this.state.selectedIndex];
        // we remove it
        editedIds.delete(diametricOpposite.name);
        // we also remove the one that we currently selected
        // that's because it is the place we are forcing it to take
        editedIds.delete(field.name);

        // now we get the opposite of the current
        const opposite = this.state.fields[index];
        // and we add it
        editedIds.add(opposite.name);
        // we also add the field that we moved to the new place
        editedIds.add(this.state.selectedField.name);

        // Otherwise if we are doing a field field swap
      } else if (!this.state.selectedIsCounterpart && !isCounterpart) {
        // we do basically the same as before but in the opposite way
        this.swapField(
          executeTriggerChangeFunction,
          this.state.selectedField,
          field
        );

        const diametricOpposite =
          this.state.counterparts[this.state.selectedIndex];
        editedIds.delete(diametricOpposite.name);
        editedIds.delete(field.name);

        const opposite = this.state.counterparts[index];
        editedIds.add(opposite.name);
        editedIds.add(this.state.selectedField.name);
      } else {
        // otherwise in the most complicated way
        // we need the counterpart
        const counterpart: FieldType = this.state.selectedIsCounterpart
          ? this.state.selectedField
          : field;
        // the counterpart index
        const counterpartIndex: number = this.state.selectedIsCounterpart
          ? this.state.selectedIndex
          : index;
        // the field index
        const givenFieldIndex: number = !this.state.selectedIsCounterpart
          ? this.state.selectedIndex
          : index;
        // the opposite of the field (which is a counterpart)
        const opposite = this.state.counterparts[givenFieldIndex];
        // and the opposite of the counterpart (which is a field)
        const diametricOpposite = this.state.fields[counterpartIndex];

        // we swap the counterparts only
        this.swapCounterpart(
          executeTriggerChangeFunction,
          counterpart,
          opposite
        );

        // we delete all the opposites from the edited list
        editedIds.delete(opposite.name);
        editedIds.delete(diametricOpposite.name);

        // and we add the field and the selected field as those are the ones
        // we chose to match each other
        editedIds.add(field.name);
        editedIds.add(this.state.selectedField.name);
      }
    }

    // and we unselect everything
    this.setState({
      selectedField: null,
      selectedIsCounterpart: false,
      selectedIndex: null,
      editedIds,
    });
  }

  /**
   * cancelPreviousPick
   */
  // basically we remove whatever was picked before
  cancelPreviousPick() {
    this.setState({
      selectedField: null,
      selectedIsCounterpart: false,
      selectedIndex: null,
    });
  }

  /**
   * Handle key up
   * @param field field
   */
  handleKeyDown = (field: FieldType) => (e: React.KeyboardEvent) => {
    if (
      e.key === "ArrowUp" ||
      e.key === "ArrowDown" ||
      e.key === "Enter" ||
      e.key === " " ||
      e.key === "Escape"
    ) {
      e.stopPropagation();
      e.preventDefault();
    }

    const fieldIndex = this.state.counterparts.indexOf(field);

    switch (e.key) {
      case "Enter":
      case " ":
        this.pickField(true, field, true, fieldIndex);
        break;

      case "ArrowUp":
        this.focusIndex(fieldIndex - 1);

        break;
      case "ArrowDown":
        this.focusIndex(fieldIndex + 1);
        break;

      case "Escape":
        this.cancelPreviousPick();
        break;
      default:
        return;
    }
  };

  /**
   * focusIndex
   * @param n n
   */
  focusIndex = (n: number) => {
    const element = this.itemRefs[n];

    if (element) {
      element.focus();
    }
  };

  /**
   * render
   */
  render() {
    if (this.props.invisible) {
      return (
        <span className="material-page__connectfield-wrapper">
          <span className="material-page__connectfield">
            <span className="material-page__connectfield-terms-container">
              {this.state.fields.map((field, index) => (
                <span
                  key={index}
                  className="material-page__connectfield-term"
                />
              ))}
            </span>
          </span>
        </span>
      );
    }

    const fieldStateAfterCheck =
      this.props.checkAnswers && this.state.answerState
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

    return (
      <>
        <ReadspeakerMessage
          text={this.props.t("messages.assignment", {
            ns: "readSpeaker",
            context: "connect",
          })}
        />

        <span
          className={`material-page__connectfield-wrapper ${fieldSavedStateClass} rs_skip_always`}
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
                    __html: this.props.t("instructions.connectField", {
                      ns: "materials",
                    }),
                  }}
                />
              }
            />
          </span>
          <span
            className={`material-page__connectfield ${fieldStateAfterCheck} ${elementDisabledStateClassName}`}
          >
            <span className="material-page__connectfield-terms-container">
              {this.state.fields.map((field, index) => {
                // the item answer
                const itemAnswer =
                  this.props.checkAnswers &&
                  this.state.answerState &&
                  this.state.answerState[index];
                // the item class name only necessary if it was a fail and we are checking for rightness
                const itemStateAfterCheck =
                  itemAnswer && this.props.displayCorrectAnswers
                    ? itemAnswer === "FAIL"
                      ? "incorrect-answer"
                      : "correct-answer"
                    : "";
                // so now we get the fields here
                // the fields cannot be dragged and they remain in order
                // they are simple things
                return (
                  <span
                    key={field.name}
                    // onClick={
                    //   this.props.readOnly
                    //     ? null
                    //     : this.pickField.bind(this, true, field, false, index)
                    // }
                  >
                    <span
                      className={`material-page__connectfield-term ${
                        this.state.selectedField &&
                        this.state.selectedField.name === field.name
                          ? "material-page__connectfield-term--selected"
                          : ""
                      } ${
                        this.state.editedIds.has(field.name) && !itemAnswer
                          ? "material-page__connectfield-term--edited"
                          : ""
                      }
                ${itemStateAfterCheck}`}
                    >
                      <span className="material-page__connectfield-term-data-container">
                        <span className="material-page__connectfield-term-number">
                          {index + 1}
                        </span>
                        <span className="material-page__connectfield-term-label">
                          <StrMathJAX>{field.text}</StrMathJAX>
                        </span>
                      </span>
                    </span>
                  </span>
                );
              })}
            </span>
            <span className="material-page__connectfield-counterparts-container">
              {this.state.counterparts.map((field, index) => {
                if (!this.props.content) {
                  return null;
                }
                // the item answer
                const itemAnswer =
                  this.props.checkAnswers &&
                  this.state.answerState &&
                  this.state.answerState[index];
                // the classname state if necessary
                const itemStateAfterCheck =
                  itemAnswer && this.props.displayCorrectAnswers
                    ? itemAnswer === "FAIL"
                      ? "incorrect-answer"
                      : "correct-answer"
                    : "";

                // the basic class name
                const className = `material-page__connectfield-counterpart ${
                  this.state.selectedField &&
                  this.state.selectedField.name === field.name
                    ? "material-page__connectfield-counterpart--selected"
                    : ""
                } ${
                  this.state.editedIds.has(field.name) && !itemAnswer
                    ? "material-page__connectfield-counterpart--edited"
                    : ""
                } ${itemStateAfterCheck}`;

                // if readonly we just add the classname in there
                if (this.props.readOnly) {
                  return (
                    <span className={className} key={field.name}>
                      <span className="material-page__connectfield-counterpart-data-container">
                        <span className="material-page__connectfield-counterpart-icon icon-move"></span>
                        <span className="material-page__connectfield-counterpart-label">
                          <StrMathJAX>{field.text}</StrMathJAX>
                        </span>
                      </span>
                    </span>
                  );
                }

                // if we are asked for correct answers
                let itemCorrectAnswerComponent = null;
                // we need to do this
                if (
                  this.props.displayCorrectAnswers &&
                  !(this.props.checkAnswers && itemAnswer === "PASS")
                ) {
                  // this is just a component giving an overview, of which number was meant to be the right answer
                  itemCorrectAnswerComponent = (
                    <span className="material-page__connectfield-counterpart-number">
                      {this.state.fields.findIndex(
                        (f) =>
                          f.name ===
                          (
                            this.props.content.connections.find(
                              (c) => c.counterpart === field.name
                            ) || { field: null }
                          ).field
                      ) + 1}
                    </span>
                  );
                }

                const ariaLabel =
                  this.state.selectedField &&
                  this.state.selectedField.name === field.name
                    ? this.props.t("wcag.connectFieldTermSelected", {
                        ns: "materials",
                      })
                    : "";

                /**
                 * callBackRef
                 * @param ref ref
                 */
                const callBackRef = (ref: HTMLSpanElement) => {
                  this.itemRefs[index] = ref;
                };

                // ok so the counterpart is draggable
                // the interaction data is the field, index, and whether is counterpart
                // note how the inline function onDropInto handles this data
                // so it can be swapped
                // the interaction group there only for the counterparts
                // on drag we cancel if the field had been picked before with the click event
                // or any other field that had been selected before, and we pick this one
                // on click we just handle it the same way as the standard click
                // the parent container selector is the field on its own
                return (
                  <Draggable
                    as="span"
                    interactionData={{ field, index, isCounterpart: true }}
                    interactionGroup={
                      this.props.content.name + "-counterparts-container"
                    }
                    onDrag={() => {
                      this.cancelPreviousPick();
                      this.pickField(false, field, true, index);
                    }}
                    onClick={this.pickField.bind(
                      this,
                      true,
                      field,
                      true,
                      index
                    )}
                    parentContainerSelector=".material-page__connectfield"
                    onDropInto={(data) =>
                      this.pickField(
                        true,
                        data.field,
                        data.isCounterpart,
                        data.index
                      )
                    }
                    className={className}
                    key={field.name}
                  >
                    <span
                      ref={callBackRef}
                      className="material-page__connectfield-counterpart-data-container"
                      tabIndex={0}
                      onKeyDown={this.handleKeyDown(field)}
                      aria-label={ariaLabel}
                      aria-pressed={
                        this.state.selectedField &&
                        this.state.selectedField.name === field.name
                      }
                    >
                      <span className="material-page__connectfield-counterpart-icon icon-move"></span>
                      <span className="material-page__connectfield-counterpart-label">
                        <StrMathJAX>{field.text}</StrMathJAX>
                      </span>
                      {itemCorrectAnswerComponent}
                    </span>
                  </Draggable>
                );
              })}
            </span>
          </span>
        </span>
      </>
    );
  }
}

export default withTranslation("materials")(ConnectField);
