import * as React from "react";
import { shuffle, arrayToObject } from "~/util/modifiers";
import Draggable, { Droppable } from "~/components/general/draggable";
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
/* interface FieldType {
  name: string;
  text: string;
} */

/**
 * TermType
 */
interface TermType {
  id: string;
  name: string;
}

/**
 * CategoryType
 */
interface CategoryType {
  id: string;
  name: string;
}

/**
 * CategoryTerm
 */
interface CategoryTerm {
  category: string;
  terms: Array<string>;
}

/**
 * OrganizerFieldProps
 */
interface OrganizerFieldProps extends WithTranslation {
  type: string;
  content: {
    name: string;
    termTitle: string;
    terms: Array<TermType>;
    categories: Array<CategoryType>;
    categoryTerms: Array<CategoryTerm>;
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

type OrganizerFieldanswerStateType = {
  [categoryId: string]: { [termId: string]: "PASS" | "FAIL" };
};
type OrganizerFieldanswerStateMissingTermsType = {
  [categoryId: string]: Array<string>;
};

/**
 * OrganizerFieldState
 */
interface OrganizerFieldState {
  terms: {
    [termId: string]: string;
  };
  boxes: {
    [categoryId: string]: Array<string>;
  };
  order: Array<string>;
  useList: Array<string>;
  selectedItemId: string;

  // This state comes from the context handler in the base
  // We can use it but it's the parent managing function that modifies them
  // We only set them up in the initial state
  modified: boolean;
  synced: boolean;
  syncError: string;

  // Wheter it was right or wrong overall
  answerStateOverall: "PASS" | "FAIL";
  // contains and object which contains and object saying whether the terms currently in the object passed or failed
  answerState: OrganizerFieldanswerStateType;
  // contains an object with a list with the missing items in each box
  answerStateMissingTerms: OrganizerFieldanswerStateMissingTermsType;

  fieldSavedState: FieldStateStatus;
}

/**
 * OrganizerField
 */
class OrganizerField extends React.Component<
  OrganizerFieldProps,
  OrganizerFieldState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: OrganizerFieldProps) {
    super(props);

    this.onDropDraggableItem = this.onDropDraggableItem.bind(this);
    this.deleteTermFromBox = this.deleteTermFromBox.bind(this);
    this.checkAnswers = this.checkAnswers.bind(this);

    // set up the initial value, parse it because it comes as string
    const value = props.initialValue ? JSON.parse(props.initialValue) : null;
    //The list of used items
    let useList: Array<string> = [];
    // if we got some values
    if (value) {
      // the value is an object with key, the key is the boxId we put all of that we have used in
      // the use list, the value[key] is an array too
      Object.keys(value).forEach((categoryId) => {
        useList = [...useList, ...value[categoryId]];
      });
    }
    this.state = {
      // we shuffle the order of the items on top
      order: shuffle(props.content.terms).map((term) => term.id),
      // get all the terms id and name, where id becomes the key and name becomes the value
      terms: arrayToObject(props.content.terms, "id", "name"),
      // we do the same to boxes but the value comes from the value object we defined before that we parsed
      boxes: arrayToObject(props.content.categories, "id", (category) => {
        // So that was on top before if we got it
        if (value) {
          // we return that array that is in there or empty array as value of the attributr
          return value[category.id] || [];
        }
        // Do the same here
        return [] as Array<string>;
      }),
      useList,
      selectedItemId: null,

      // modified synced and syncerror are false, true and null by default
      modified: false,
      synced: true,
      syncError: null,

      // We don't know any of this
      answerStateOverall: null,
      answerState: null,
      answerStateMissingTerms: null,

      fieldSavedState: null,
    };

    this.cancelSelectedItemId = this.cancelSelectedItemId.bind(this);
    this.selectItemId = this.selectItemId.bind(this);
    this.selectBox = this.selectBox.bind(this);
    this.preventPropagation = this.preventPropagation.bind(this);
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
    nextProps: OrganizerFieldProps,
    nextState: OrganizerFieldState
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
    // if we are allowed
    if (!this.props.checkAnswers || !this.props.content) {
      return;
    }

    // we set up the terms
    const newanswerState: OrganizerFieldanswerStateType = {};
    const newMissingTerms: OrganizerFieldanswerStateMissingTermsType = {};
    let overallanswerState: "PASS" | "FAIL" = "PASS";

    // We loop from the boxes, the boxId is the same as the categoryId
    Object.keys(this.state.boxes).forEach((boxId) => {
      // We find the correlation from the results as they are given by the properties
      const categoryTermCorrelation = this.props.content.categoryTerms.find(
        (categoryTerm) => categoryTerm.category === boxId
      );
      // We create an array with all the elements ids that are supposed to be in that cateogory
      const elementsLeft = new Set(categoryTermCorrelation.terms);
      // the box itself has a state of PASS by default
      newanswerState[boxId] = { "*": "PASS" };

      // so we loop in the terms within that box
      this.state.boxes[boxId].forEach((termId) => {
        // we check whether it is correct, that is, if it in the category term correlation array
        const isCorrect = categoryTermCorrelation.terms.includes(termId);
        // we set the state in the answer state box per item
        newanswerState[boxId][termId] = isCorrect ? "PASS" : "FAIL";
        // if it's not correct the overall is fail, and the specific box is fail too
        if (!isCorrect) {
          overallanswerState = "FAIL";
          newanswerState[boxId]["*"] = "FAIL";
        }
        // we delete the term we have used already from the elements left set
        elementsLeft.delete(termId);
      });

      // Now the elements left set represent the elements we didn't check against
      // which means they weren't in the box and they are missing, we create an array
      const elementsLeftArray = Array.from(elementsLeft);
      // if there are missing from there, the box and the task itself fails too
      if (elementsLeftArray.length) {
        overallanswerState = "FAIL";
        newanswerState[boxId]["*"] = "FAIL";
      }
      // and we set it up as in the missing terms list
      newMissingTerms[boxId] = elementsLeftArray;
    });

    // We update the state based on whether any of these attributes changed
    if (
      overallanswerState !== this.state.answerStateOverall ||
      !equals(newanswerState, this.state.answerState) ||
      !equals(newMissingTerms, this.state.answerStateMissingTerms)
    ) {
      this.setState({
        answerState: newanswerState,
        answerStateMissingTerms: newMissingTerms,
        answerStateOverall: overallanswerState,
      });
    }

    // And we use the overall state to call the rightness change function
    const isCorrect = overallanswerState === "PASS";
    const wasCorrect = this.state.answerStateOverall === "PASS";
    if (isCorrect !== wasCorrect || !this.state.answerState) {
      this.props.onAnswerChange(this.props.content.name, isCorrect);
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
    prevProps: OrganizerFieldProps,
    prevState: OrganizerFieldState
  ) {
    this.checkAnswers();
  }

  /**
   * onDropDraggableItem
   * @param termId termId
   * @param categoryId categoryId
   */
  onDropDraggableItem(termId: string, categoryId: string) {
    if (!this.props.content) {
      return;
    }
    // So when we drop a termId onto a category box
    // we first check that it's not there already in that box otherwise
    // it's pointless
    if (this.state.boxes[categoryId].indexOf(termId) === -1) {
      // we create the new boxes object
      const nBox = { ...this.state.boxes };
      // we change the box for the category id and concat the
      // new term id at the end
      nBox[categoryId] = [...nBox[categoryId], termId];

      // we update the state
      this.setState(
        {
          boxes: nBox,
          // and the use list too, note how the use list might have duplicated term ids
          // this is fancy as if two boxes share the same termId in their array then it will be
          // in the use list twice
          useList: [...this.state.useList, termId],
          selectedItemId: null,
        },
        this.checkAnswers
      );

      // Call the onchange function stringifying as usual
      this.props.onChange &&
        this.props.onChange(
          this,
          this.props.content.name,
          JSON.stringify(nBox)
        );
    }
  }

  /**
   * deleteTermFromBox
   * @param categoryId categoryId
   * @param termId termId
   */
  deleteTermFromBox(categoryId: string, termId: string) {
    // And so when we delete from the item
    const newUseList = [...this.state.useList];
    // we just need to find the first index of the term id
    const index = newUseList.indexOf(termId);
    // and delete it, another termId equal might be still there, but, that
    // then should mean the term is being used several times and so
    // this is fine
    newUseList.splice(index, 1);

    // we get the new boxes
    const nBox = { ...this.state.boxes };
    // make a clone for the category box
    nBox[categoryId] = [...nBox[categoryId]];
    // find the index for the termId within the box
    const index2 = nBox[categoryId].indexOf(termId);
    // and we delete it
    nBox[categoryId].splice(index2, 1);

    // update the state
    this.setState(
      {
        boxes: nBox,
        useList: newUseList,
      },
      this.checkAnswers
    );

    // Call the onchange function stringifying as usual
    this.props.onChange &&
      this.props.onChange(this, this.props.content.name, JSON.stringify(nBox));
  }

  /**
   * selectItemId
   * @param id id
   */
  selectItemId(id: string) {
    if (this.state.selectedItemId === id) {
      this.setState({
        selectedItemId: null,
      });
    } else {
      this.setState({
        selectedItemId: id,
      });
    }
  }

  /**
   * selectBox
   * @param box box
   */
  selectBox(box: CategoryType) {
    if (this.state.selectedItemId) {
      this.onDropDraggableItem(this.state.selectedItemId, box.id);
      this.setState({
        selectedItemId: null,
      });
    }
  }

  /**
   * cancelSelectedItemId
   */
  cancelSelectedItemId() {
    this.setState({
      selectedItemId: null,
    });
  }

  /**
   * handleKeyUp
   * @param id id
   */
  handleDraggableKeyDown = (id: string) => (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.stopPropagation();
      e.preventDefault();

      this.selectItemId(id);
    }
  };

  /**
   * handleDroppableKeyDown
   * @param box box
   */
  handleDroppableKeyDown = (box: CategoryType) => (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.stopPropagation();
      e.preventDefault();
      this.selectBox(box);
    }
  };

  /**
   * handleOrganizedFieldKeyDown
   * @param categoryId categoryId
   * @param termId termId
   */
  handleOrganizedFieldKeyDown =
    (categoryId: string, termId: string) => (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.stopPropagation();
        e.preventDefault();

        this.deleteTermFromBox(categoryId, termId);
      }
    };

  /**
   * preventPropagation
   * @param e e
   */
  preventPropagation(e: React.MouseEvent<any>) {
    e.stopPropagation();
    e.preventDefault();
    return false;
  }

  /**
   * render
   * @returns JSX.Element
   */
  render() {
    if (!this.props.content) {
      return null;
    }
    if (this.props.invisible) {
      return (
        <>
          <ReadspeakerMessage
            text={this.props.t("messages.assignment", {
              ns: "readSpeaker",
              context: "organizer",
            })}
          />
          <span className="material-page__organizerfield-wrapper rs_skip_always">
            <span className="material-page__organizerfield">
              <span className="material-page__organizerfield-terms">
                <span className="material-page__organizerfield-terms-title">
                  {this.props.content.termTitle}
                </span>
                <span className="material-page__organizerfield-terms-container">
                  {this.state.order.map((id) => (
                    <span
                      className="material-page__organizerfield-term"
                      key={id}
                    >
                      <span className="material-page__organizerfield-term-icon icon-move"></span>
                      <span className="material-page__organizerfield-term-label">
                        <StrMathJAX invisible={true}>
                          {this.state.terms[id]}
                        </StrMathJAX>
                      </span>
                    </span>
                  ))}
                </span>
              </span>
              <span className="material-page__organizerfield-categories">
                {this.props.content.categories.map((category) => (
                  <span
                    className="material-page__organizerfield-category"
                    key={category.id}
                  >
                    <span className="material-page__organizerfield-category-title">
                      {category.name}
                    </span>
                    <span className="material-page__organizerfield-category-terms-container" />
                  </span>
                ))}
              </span>
            </span>
          </span>
        </>
      );
    }

    // The overall state if we got one and we check answers
    const fieldStateAfterCheck =
      this.props.checkAnswers && this.state.answerStateOverall
        ? this.state.answerStateOverall === "FAIL"
          ? "incorrect-answer"
          : "correct-answer"
        : "";

    // the classic variable
    const answerIsCheckedAndItisCorrect =
      this.props.checkAnswers && this.state.answerStateOverall === "PASS";

    // if elements is disabled
    const elementDisabledStateClassName = this.props.readOnly
      ? "material-page__taskfield-disabled"
      : "";

    const fieldSavedStateClass = createFieldSavedStateClass(
      this.state.fieldSavedState
    );

    // we add that class name in our component
    return (
      <>
        <ReadspeakerMessage
          text={this.props.t("messages.assignment", {
            ns: "readSpeaker",
            context: "organizer",
          })}
        />
        <span
          className={`material-page__organizerfield-wrapper ${fieldSavedStateClass} rs_skip_always`}
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
                    __html: this.props.t("instructions.organizationField", {
                      ns: "materials",
                    }),
                  }}
                />
              }
            />
          </span>
          <span
            className={`material-page__organizerfield ${fieldStateAfterCheck} ${elementDisabledStateClassName}`}
          >
            <span className="material-page__organizerfield-terms">
              <span className="material-page__organizerfield-terms-title">
                {this.props.content.termTitle}
              </span>
              <span className="material-page__organizerfield-terms-container">
                {this.state.order.map((id) => {
                  // add the term in use class if in the uselist
                  const className = `material-page__organizerfield-term ${
                    this.state.useList.indexOf(id) !== -1
                      ? "material-page__organizerfield-term--in-use"
                      : ""
                  } ${
                    this.state.selectedItemId === id
                      ? "material-page__organizerfield-term--selected"
                      : ""
                  }`;

                  let ariaLabel = "";

                  if (this.state.selectedItemId === id) {
                    ariaLabel = this.props.t("wcag.organizerTermSelected", {
                      ns: "materials",
                    });
                  }

                  if (this.state.useList.indexOf(id) !== -1) {
                    ariaLabel = this.props.t("wcag.organizerTermInUse", {
                      ns: "materials",
                    });

                    if (this.state.selectedItemId === id) {
                      ariaLabel = this.props.t(
                        "wcag.organizerTermInUseAndSelected",
                        {
                          ns: "materials",
                        }
                      );
                    }
                  }

                  if (this.props.readOnly) {
                    // if readOnly we just return a non draggable thingy
                    return (
                      <span tabIndex={0} className={className} key={id}>
                        <span className="material-page__organizerfield-term-icon icon-move"></span>
                        <span className="material-page__organizerfield-term-label">
                          <StrMathJAX>{this.state.terms[id]}</StrMathJAX>
                        </span>
                      </span>
                    );
                  }
                  // Otherwise we run a draggable, where the field itself is the parent container
                  // the interaction group is only for this field, and it will clone the draggable instead of removing the entire thing
                  // on move, it has no interaction data so draggables won't interact with each other, and when it's dropped it
                  // calls the on drop into function using its own termId binding and the argument will be the data of the droppables
                  return (
                    <Draggable
                      tabIndex={0}
                      as="button"
                      parentContainerSelector=".material-page__organizerfield"
                      className={className}
                      interactionGroup={this.props.content.name}
                      clone
                      key={id}
                      onDropInto={this.onDropDraggableItem.bind(this, id)}
                      onDrag={this.selectItemId.bind(this, id)}
                      onClick={this.selectItemId.bind(this, id)}
                      onKeyDown={this.handleDraggableKeyDown(id)}
                      aria-label={ariaLabel}
                    >
                      <span className="material-page__organizerfield-term-icon icon-move"></span>
                      <span className="material-page__organizerfield-term-label">
                        <StrMathJAX>{this.state.terms[id]}</StrMathJAX>
                      </span>
                    </Draggable>
                  );
                })}
              </span>
            </span>
            <span className="material-page__organizerfield-categories">
              {this.props.content.categories.map((category) => {
                // we make a category class name for if the answer state is there, only worth it if the whole thing is not right
                // if the whole thing is right then every category is right
                const fieldCategoryStateAfterCheck =
                  this.props.displayCorrectAnswers &&
                  this.props.checkAnswers &&
                  !answerIsCheckedAndItisCorrect &&
                  this.state.answerState &&
                  this.state.answerState[category.id]
                    ? this.state.answerState[category.id]["*"] === "FAIL"
                      ? "incorrect-answer"
                      : "correct-answer"
                    : "";

                // Showing the missing terms is only reasonable when display correct answers is there
                // we first check whether the category is right
                const wecheckAnswersAndCategoryisCorrect =
                  this.props.checkAnswers &&
                  this.state.answerState &&
                  this.state.answerState[category.id] &&
                  this.state.answerState[category.id]["*"] === "PASS";
                let itemCorrectAnswerMissingTerms: any = null;
                // if we are asked to display and the answers are not right then we add the missing items
                if (
                  this.props.displayCorrectAnswers &&
                  !wecheckAnswersAndCategoryisCorrect
                ) {
                  itemCorrectAnswerMissingTerms =
                    this.state.answerStateMissingTerms &&
                    this.state.answerStateMissingTerms[category.id] &&
                    this.state.answerStateMissingTerms[category.id].map(
                      (missingTermId) => (
                        <span
                          key={missingTermId}
                          className="material-page__organizerfield-term material-page__organizerfield-term--missing"
                        >
                          <StrMathJAX>
                            {this.state.terms[missingTermId]}
                          </StrMathJAX>
                        </span>
                      )
                    );
                }

                return (
                  <Droppable
                    tabIndex={0}
                    as="div"
                    interactionGroup={this.props.content.name}
                    onClick={this.selectBox.bind(this, category)}
                    onKeyDown={this.handleDroppableKeyDown(category)}
                    className={`material-page__organizerfield-category ${fieldCategoryStateAfterCheck}`}
                    key={category.id}
                    interactionData={category.id}
                    aria-label={this.props.t("wcag.organizerCategoryName", {
                      ns: "materials",
                      name: category.name,
                    })}
                  >
                    <span className="material-page__organizerfield-category-title">
                      {category.name}
                    </span>
                    <span className="material-page__organizerfield-category-terms-container">
                      {this.state.boxes[category.id].map((termId) => {
                        // showhing whether terms are right or not is only worth it if whole answer if not right and the category itself is not right
                        // otherwise it's reduntant, if the whole thing is right or the category is right then every term is right too
                        const itemStateAfterCheck =
                          this.props.displayCorrectAnswers &&
                          this.props.checkAnswers &&
                          !answerIsCheckedAndItisCorrect &&
                          this.state.answerState &&
                          this.state.answerState[category.id]
                            ? this.state.answerState[category.id][termId] ===
                              "FAIL"
                              ? "incorrect-answer"
                              : "correct-answer"
                            : "";

                        return (
                          <span
                            tabIndex={0}
                            onClick={this.preventPropagation}
                            key={termId}
                            className={`material-page__organizerfield-term material-page__organizerfield-term--no-dragging ${itemStateAfterCheck}`}
                          >
                            <span className="material-page__organizerfield-term-label">
                              <StrMathJAX>
                                {this.state.terms[termId]}
                              </StrMathJAX>
                            </span>
                            {!this.props.readOnly ? (
                              <span
                                tabIndex={0}
                                role="button"
                                onClick={this.deleteTermFromBox.bind(
                                  this,
                                  category.id,
                                  termId
                                )}
                                onKeyDown={this.handleOrganizedFieldKeyDown(
                                  category.id,
                                  termId
                                )}
                                className="material-page__organizerfield-term-icon icon-cross"
                                aria-label={this.props.t(
                                  "wcag.organiserTermRemove",
                                  {
                                    ns: "materials",
                                    name: category.name,
                                  }
                                )}
                              />
                            ) : (
                              <span className="material-page__organizerfield-term-icon icon-cross" />
                            )}
                          </span>
                        );
                      })}
                      {itemCorrectAnswerMissingTerms}
                    </span>
                  </Droppable>
                );
              })}
            </span>
          </span>
        </span>
      </>
    );
  }
}

export default withTranslation("materials")(OrganizerField);
