/* eslint-disable @typescript-eslint/no-explicit-any */
import TextField from "../fields/text-field";
import SelectField from "../fields/select-field";
import MultiSelectField from "../fields/multiselect-field";
import MemoField from "../fields/memo-field";
import * as React from "react";
import $ from "~/lib/jquery";
import FileField from "../fields/file-field";
import ConnectField from "../fields/connect-field";
import OrganizerField from "../fields/organizer-field";
import AudioField from "../fields/audio-field";
import JournalField from "../fields/journal-field";
import SorterField from "../fields/sorter-field";
import { StatusType } from "~/reducers/base/status";
import Image from "../static/image";
import WordDefinition from "../static/word-definition";
import IFrame from "../static/iframe";
import { extractDataSet, HTMLToReactComponentRule } from "~/util/modifiers";
import MathField from "../fields/math-field";
import {
  MaterialContentNodeWithIdAndLogic,
  WorkspaceDataType,
} from "~/reducers/workspaces";
import { WebsocketStateType } from "~/reducers/util/websocket";
import Link from "~/components/base/material-loader/static/link";
import { HTMLtoReactComponent } from "~/util/modifiers";
import Table from "~/components/base/material-loader/static/table";
import MathJAX from "~/components/base/material-loader/static/mathjax";
import { UsedAs, FieldStateStatus } from "~/@types/shared";
import { AudioPoolComponent } from "~/components/general/audio-pool-component";
import { MaterialCompositeReply } from "~/generated/client";
import {
  CommonFieldProps,
  IframeDataset,
  ImageDataset,
  LinkDataset,
  WordDefinitionDataset,
} from "../types";

//These are all our supported objects as for now
const fieldComponents: { [key: string]: any } = {
  "application/vnd.muikku.field.text": TextField,
  "application/vnd.muikku.field.select": SelectField,
  "application/vnd.muikku.field.multiselect": MultiSelectField,
  "application/vnd.muikku.field.memo": MemoField,
  "application/vnd.muikku.field.file": FileField,
  "application/vnd.muikku.field.connect": ConnectField,
  "application/vnd.muikku.field.organizer": OrganizerField,
  "application/vnd.muikku.field.audio": AudioField,
  "application/vnd.muikku.field.sorter": SorterField,
  "application/vnd.muikku.field.mathexercise": MathField,
  "application/vnd.muikku.field.journal": JournalField,
};

// Wheteher the object can check or not for an answer
const answerCheckables: { [key: string]: (params: any) => boolean } = {
  /**
   * application/vnd.muikku.field.text
   * @param params params
   * @returns any
   */
  "application/vnd.muikku.field.text": (params: any) =>
    params.content &&
    params.content.rightAnswers.filter((option: any) => option.correct).lenght,
  /**
   * select
   * @param params params
   * @returns any
   */
  "application/vnd.muikku.field.select": (params: any) =>
    params.content &&
    params.content.options.filter((option: any) => option.correct).lenght,
  /**
   * multiselect
   * @param params params
   * @returns any
   */
  "application/vnd.muikku.field.multiselect": (params: any) =>
    params.content &&
    params.content.options.filter((option: any) => option.correct).lenght,
  /**
   * connect
   * @returns true
   */
  "application/vnd.muikku.field.connect": () => true,
  /**
   * organizer
   * @returns true
   */
  "application/vnd.muikku.field.organizer": () => true,
  /**
   * sorter
   * @returns true
   */
  "application/vnd.muikku.field.sorter": () => true,
};

/**
 * BaseProps
 */
interface BaseProps {
  material: MaterialContentNodeWithIdAndLogic;
  status: StatusType;
  workspace: WorkspaceDataType;
  websocketState: WebsocketStateType;
  answerable: boolean;
  compositeReplies?: MaterialCompositeReply;
  readOnly?: boolean;
  onConfirmedAndSyncedModification?: () => any;
  onModification?: () => any;
  displayCorrectAnswers: boolean;
  checkAnswers: boolean;
  onAnswerChange: (name: string, status: boolean) => any;
  onAnswerCheckableChange: (status: boolean) => any;
  usedAs: UsedAs;
  invisible: boolean;
  answerRegistry?: { [name: string]: any };
}

/**
 * BaseState
 */
interface BaseState {
  elements: Array<HTMLElement>;
}

// The typing of the user will stack until the user stops typing for this amount of milliseconds
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TIME_IT_TAKES_FOR_AN_ANSWER_TO_BE_SAVED_WHILE_THE_USER_MODIFIES_IT = 666;
// The client will wait this amount of milliseconds and otherwise it will consider the answer unsynced
const TIME_IT_TAKES_FOR_AN_ANSWER_TO_BE_CONSIDERED_FAILED_IF_SERVER_DOES_NOT_REPLY = 2000;
// The client will wait this amount of milliseconds to trigger an update
const TIME_IT_WAITS_TO_TRIGGER_A_CHANGE_EVENT_IF_NO_OTHER_CHANGE_EVENT_IS_IN_QUEUE = 666;

/**
 * Fixes the html inconsitencies because there are some of them which shouldn't but hey that's the case
 * @param $html html
 * @returns any
 */
function preprocessor($html: any): any {
  $html.find("img").each(function () {
    if (!$(this).parent("figure").length) {
      const elem = document.createElement("span");
      elem.className = "image";

      $(this).replaceWith(elem);
      const src = this.getAttribute("src");
      if (src) {
        this.dataset.original = src;
        $(this).removeAttr("src");
      }

      elem.appendChild(this);
    } else {
      const src = this.getAttribute("src");
      if (src) {
        this.dataset.original = src;
        $(this).removeAttr("src");
      }
    }
  });

  $html.find("audio").each(function () {
    $(this).attr("preload", "metadata");
  });

  $html.find("source").each(function () {
    // This is done because there will be a bunch of 404's if the src is left untouched - the original url for the audio file src is incomplete as it's missing section/material_page path

    const src = this.getAttribute("src");

    if (src) {
      this.dataset.original = src;
      $(this).removeAttr("src");
    }
  });

  $html.find("a figure").each(function () {
    // removing old style images wrapped in a link
    // they get processed as link and thus don't work
    $(this).parent("a").replaceWith(this);
  });

  const $newHTML = $html.map(function () {
    if (this.tagName === "TABLE") {
      const elem = document.createElement("div");
      elem.className = "material-page__table-wrapper";
      elem.appendChild(this);
      return elem;
    }
    return this;
  });

  $newHTML.find("table").each(function () {
    if ($(this).parent().attr("class") === "material-page__table-wrapper") {
      return;
    }

    const elem = document.createElement("div");
    elem.className = "material-page__table-wrapper";

    $(this).replaceWith(elem);
    elem.appendChild(this);
  });

  return $newHTML;
}

/**
 * createFieldSavedStateClass
 * @param state state
 * @returns string
 */
export function createFieldSavedStateClass(state: FieldStateStatus) {
  let fieldSavedStateClass = "";
  if (state === "ERROR") {
    fieldSavedStateClass = "state-ERROR";
  } else if (state === "SAVING") {
    fieldSavedStateClass = "state-SAVING";
  } else if (state === "SAVED") {
    fieldSavedStateClass = "state-SAVED";
  }

  return fieldSavedStateClass;
}

/**
 * Base
 */
export default class Base extends React.Component<BaseProps, BaseState> {
  private answerCheckable: boolean;

  // whenever a field changes we save it as timeout not to send every keystroke to the server
  // every keystroke cancels the previous timeout given by the TIME_IT_TAKES_FOR_AN_ANSWER_TO_BE_SAVED_WHILE_THE_USER_MODIFIES_IT
  private timeoutChangeRegistry: {
    [name: string]: NodeJS.Timer;
  };
  // once a change is emitted to the server we set a timeout to consider the field unsynced (Say if lost connection)
  // which would unsync the specific field, the timeout is triggered if it is not cancelled within the
  // TIME_IT_TAKES_FOR_AN_ANSWER_TO_BE_CONSIDERED_UNSYNCED_IF_SERVER_DOES_NOT_REPLY
  private timeoutConnectionFailedRegistry: {
    [name: string]: NodeJS.Timer;
  };

  // This is a helper utility which saves the context of a react component during the change because we handle
  // its sync and unsync state here, so we save it for name, these are page specific so they don't collide
  // as every page has its own base.tsx
  private nameContextRegistry: {
    [name: string]: React.Component<any, any>;
  };

  /**
   * constructor
   * @param props props
   */
  constructor(props: BaseProps) {
    super(props);

    // We preprocess the html
    this.state = {
      elements: preprocessor(
        $(props.material.html)
      ).toArray() as Array<HTMLElement>,
    };

    // prepare the registries
    this.timeoutChangeRegistry = {};
    this.timeoutConnectionFailedRegistry = {};
    this.nameContextRegistry = {};

    // And prepare this one too
    this.onAnswerSavedAtServer = this.onAnswerSavedAtServer.bind(this);

    this.answerCheckable = null;
  }

  /**
   * componentDidMount - When it mounts we setup everything
   */
  componentDidMount() {
    // Register websocket event listeners
    if (this.props.websocketState.websocket) {
      this.props.websocketState.websocket.addEventCallback(
        "workspace:field-answer-saved",
        this.onAnswerSavedAtServer
      );
      this.props.websocketState.websocket.addEventCallback(
        "workspace:field-answer-error",
        this.onAnswerSavedAtServer
      );
    }
  }

  /**
   * componentDidUpdate - Updates everything if we get brand new HTML
   * @param prevProps previous props
   */
  componentDidUpdate(prevProps: BaseProps) {
    if (this.props.material.html !== prevProps.material.html) {
      const elements = preprocessor(
        $(this.props.material.html)
      ).toArray() as Array<HTMLElement>;
      this.setState({
        elements,
      });

      this.setupEverything(this.props, elements);
    }
  }

  /**
   * setupEverything
   * @param props props
   * @param elements elements
   */
  setupEverything(props: BaseProps = this.props, elements: Array<HTMLElement>) {
    const originalAnswerCheckable = this.answerCheckable;
    this.answerCheckable = false;

    // First we find all the interactive
    $(elements)
      .find("object")
      .addBack("object")
      .each((index: number, element: HTMLElement) => {
        // We get the object element as in, the react component that it will be replaced with
        const rElement: React.ReactElement<any> = this.createFieldElement(
          element,
          props
        );

        const newAnswerCheckableState =
          answerCheckables[element.getAttribute("type")] &&
          answerCheckables[element.getAttribute("type")](rElement.props);
        if (newAnswerCheckableState && !this.answerCheckable) {
          this.answerCheckable = true;
        }
      });

    if (
      this.props.onAnswerCheckableChange &&
      originalAnswerCheckable !== this.answerCheckable
    ) {
      this.props.onAnswerCheckableChange(this.answerCheckable);
    }
  }

  /**
   * onAnswerSavedAtServer - when an answer is saved from the server, as in the websocket calls this
   * @param data data
   */
  onAnswerSavedAtServer(data: any) {
    // For some reason the data comes as string
    const actualData = JSON.parse(data);
    // we check the data for a match for this specific page, given that a lot of callbacks will be registered
    // and we are going to get all those events indiscrimately of wheter which page it belongs to as we are
    // registering this event on all the field-answer-saved events
    if (
      actualData.materialId === this.props.material.materialId &&
      actualData.workspaceMaterialId ===
        this.props.material.workspaceMaterialId &&
      actualData.workspaceEntityId === this.props.workspace.id
    ) {
      // We clear the timeout that would mark the field as unsynced given the time had passed
      clearTimeout(this.timeoutConnectionFailedRegistry[actualData.fieldName]);
      delete this.timeoutConnectionFailedRegistry[actualData.fieldName];

      // if we have an error
      if (actualData.error) {
        // eslint-disable-next-line no-console
        console.error && console.error(actualData.error);
        // we get the context and check whether it's synced
        this.nameContextRegistry[actualData.fieldName].setState({
          synced: false,
          syncError: actualData.error,
        });
        return;
      }

      // The answer has been modified so we bubble this event
      this.props.onConfirmedAndSyncedModification();

      if (this.nameContextRegistry[actualData.fieldName]) {
        // we check the name context registry to see if it had been synced, said if you lost connection to the server
        // the field got unsynced, regained the connection and the answer got saved, so the thing above did nothing
        // as the field had been unsynced already
        if (
          !this.nameContextRegistry[actualData.fieldName].state.synced ||
          this.nameContextRegistry[actualData.fieldName].state.syncError
        ) {
          // we make it synced then and the user is happy can keep typing
          this.nameContextRegistry[actualData.fieldName].setState({
            synced: true,
            syncError: null,
          });
        }
      }
    }
  }

  /**
   * getObjectElement - This takes the raw element and checks what react component it will give
   * @param element element
   * @param props props
   * @param key key
   * @returns JSX.Element
   */
  createFieldElement(
    element: HTMLElement,
    props: BaseProps = this.props,
    key?: number
  ) {
    const fieldType = element.getAttribute("type");
    // So we check from our objects we have on top, to see what class we are getting
    const FieldComponent = fieldComponents[fieldType];

    // This is here in case we get some brand new stuff, it should never come here
    if (!FieldComponent) {
      return (
        <span>
          Invalid Element {element.getAttribute("type")} {element.innerHTML}
        </span>
      );
    }

    // Extract common props
    const commonProps = extractCommonFieldProps(element, props, key);

    // Extract field-specific initial value
    const initialValue = extractFieldInitialValue(
      commonProps.content,
      props.compositeReplies
    );

    commonProps.initialValue = initialValue;
    commonProps.onChange = this.onValueChange.bind(this);

    // and we return that thing
    return <FieldComponent {...commonProps} key={key} />;
  }

  /**
   * onValueChange - Ok so this is what the element calls every time that changes
   * @param context context
   * @param name name
   * @param newValue newValue
   */
  onValueChange(
    context: React.Component<any, any>,
    name: string,
    newValue: any
  ) {
    if (!this.props.websocketState.websocket) {
      // can't do anything if no websocket
      return;
    }

    // the context is basically the react component, the name the fieldName, and the newValue the value we use

    // so we check if it's not modified and if it is, we mark it as modified
    if (!context.state.modified) {
      context.setState({ modified: true });
    }
    if (!this.props.answerable) {
      context.setState({ synced: true });
      return;
    }
    context.setState({ synced: false });

    this.props.onModification && this.props.onModification();

    // we get the name context registry and register that context for future use
    this.nameContextRegistry[name] = context;

    // we clear the timeout of possible previous changes
    clearTimeout(this.timeoutChangeRegistry[name]);

    // and set a new timeout to change given the TIME_IT_TAKES_FOR_AN_ANSWER_TO_BE_SAVED_WHILE_THE_USER_MODIFIES_IT
    this.timeoutChangeRegistry[name] = setTimeout(() => {
      // Tell the server thru the websocket to save
      const messageData = JSON.stringify({
        answer: newValue,
        // I have no idea what this is for
        embedId: "",
        materialId: this.props.material.materialId,
        fieldName: name,
        workspaceEntityId: this.props.workspace.id,
        workspaceMaterialId: this.props.material.workspaceMaterialId,
        userEntityId: this.props.status.userId,
      });
      const stackId =
        name +
        "-" +
        this.props.workspace.id +
        "-" +
        this.props.material.workspaceMaterialId +
        "-" +
        this.props.material.materialId;
      this.props.websocketState.websocket.sendMessage(
        "workspace:field-answer-save",
        messageData,
        null,
        stackId
      );
      // We set no callback onsent
      // and for the stackId we use this unique id that should represent the only field
      // remember that base.tsx represents a specific page so a name in the registry here suffices
      // but on the websocket there's only one for everyone so it needs more speficic identification
      // the reason why there gotta be an identification is because the websocket will stack answers
      // so if you happen to somehow in some way send an event twice to save to the server while the first hasn't
      // been executed because you are superman and type reeeeeeaaaally fast then the computer will cancel
      // the first send event and use the second instead given the first hasn't been sent anyway

      // And we wait the TIME_IT_TAKES_FOR_AN_ANSWER_TO_BE_CONSIDERED_UNSYNCED_IF_SERVER_DOES_NOT_REPLY
      // for considering the answer unsynced if the server does not reply
      this.timeoutConnectionFailedRegistry[name] = setTimeout(() => {
        // Takes too long so we queue the message again
        this.props.websocketState.websocket.queueMessage(
          "workspace:field-answer-save",
          messageData,
          null,
          stackId
        );
        context.setState({ syncError: "server does not reply" });
      }, TIME_IT_TAKES_FOR_AN_ANSWER_TO_BE_CONSIDERED_FAILED_IF_SERVER_DOES_NOT_REPLY) as any;
    }, TIME_IT_WAITS_TO_TRIGGER_A_CHANGE_EVENT_IF_NO_OTHER_CHANGE_EVENT_IS_IN_QUEUE) as any;
  }

  /**
   * render
   * @returns JSX.Element
   */
  render() {
    const path =
      "/workspace/" +
      this.props.workspace.urlName +
      "/materials/" +
      this.props.material.path;
    const invisible = this.props.invisible;

    const processingRules: HTMLToReactComponentRule[] = [
      {
        /**
         * shouldProcessHTMLElement method for "contains inccorrect excercises" div style box
         * @param tagname tagname
         * @param element element
         * @returns boolean
         */
        shouldProcessHTMLElement: (tagname, element) =>
          tagname === "div" &&
          element.getAttribute("data-show") !== null &&
          element.getAttribute("data-name") ===
            "excercises-incorrect-style-box",

        /**
         * processingFunction for "contains inccorrect excercises" div style box
         * @param tag tag
         * @param props props
         * @param children children
         * @param element element
         */
        preprocessReactProperties: (tag, props, children, element) => {
          // prerequisites for showing the box
          if (this.props.checkAnswers && this.props.answerRegistry) {
            // We get the correct answers
            const correctAnswers = Object.keys(
              this.props.answerRegistry
            ).filter((key) => this.props.answerRegistry[key]).length;

            // And the total answers
            const totalAnswers = Object.keys(this.props.answerRegistry).length;

            // If there are incorrect answers
            if (correctAnswers !== totalAnswers) {
              props["data-show"] = "true";
            } else {
              props["data-show"] = "false";
            }
          } else {
            props["data-show"] = "false";
          }
        },
      },
      {
        /**
         * shouldProcessHTMLElement method for "all excercises correct" div style box
         * @param tagname tagname
         * @param element element
         * @returns boolean
         */
        shouldProcessHTMLElement: (tagname, element) =>
          tagname === "div" &&
          element.getAttribute("data-show") !== null &&
          element.getAttribute("data-name") === "excercises-correct-style-box",

        /**
         * processingFunction for "all excercises correct" div style box
         * @param tag tag
         * @param props props
         * @param children children
         * @param element element
         */
        preprocessReactProperties: (tag, props, children, element) => {
          // prerequisites for showing the box
          if (this.props.checkAnswers && this.props.answerRegistry) {
            // We get the correct answers
            const correctAnswers = Object.keys(
              this.props.answerRegistry
            ).filter((key) => this.props.answerRegistry[key]).length;

            // And the total answers
            const totalAnswers = Object.keys(this.props.answerRegistry).length;

            // If all answers are correct
            if (correctAnswers === totalAnswers) {
              props["data-show"] = "true";
            } else {
              props["data-show"] = "false";
            }
          } else {
            props["data-show"] = "false";
          }
        },
      },
      {
        /**
         * shouldProcessHTMLElement
         * @param tagname tagname
         * @param element element
         * @returns boolean
         */
        shouldProcessHTMLElement: (tagname, element) =>
          tagname === "div" && element.getAttribute("data-show") !== null,

        /**
         * processingFunction
         * @param tag tag
         * @param props props
         * @param children children
         * @param element element
         */
        preprocessReactProperties: (tag, props, children, element) => {
          if (this.props.checkAnswers && this.props.displayCorrectAnswers) {
            props["data-show"] = "true";
          } else {
            props["data-show"] = "false";
          }
        },
      },
      {
        /**
         * shouldProcessHTMLElement
         * @param tagname tagname
         * @param element element
         * @returns boolean
         */
        shouldProcessHTMLElement: (tagname, element) =>
          tagname === "object" && fieldComponents[element.getAttribute("type")],

        /**
         * processingFunction
         * @param tag tag
         * @param props props
         * @param children children
         * @param element element
         * @returns any
         */
        processingFunction: (tag, props, children, element) =>
          this.createFieldElement(element, this.props, props.key),
      },
      {
        /**
         * shouldProcessHTMLElement
         * @param tagname tagname
         * @returns boolean
         */
        shouldProcessHTMLElement: (tagname) => tagname === "iframe",
        preventChildProcessing: true,

        /**
         * processingFunction
         * @param tag tag
         * @param props props
         * @param children children
         * @param element element
         * @returns any
         */
        processingFunction: (tag, props, children, element) => {
          const dataset = extractDataSet<IframeDataset>(element);
          return (
            <IFrame
              key={props.key}
              element={element}
              path={path}
              invisible={invisible}
              dataset={dataset}
            />
          );
        },
      },
      {
        /**
         * shouldProcessHTMLElement
         * @param tagname tagname
         * @param element element
         * @returns boolean
         */
        shouldProcessHTMLElement: (tagname, element) =>
          !!(tagname === "mark" && element.dataset.muikkuWordDefinition),

        /**
         * processingFunction
         * @param tag tag
         * @param props props
         * @param children children
         * @param element element
         * @returns any
         */
        processingFunction: (tag, props, children, element) => {
          const dataset = extractDataSet<WordDefinitionDataset>(element);
          return (
            <WordDefinition
              key={props.key}
              invisible={invisible}
              dataset={dataset}
            >
              {children}
            </WordDefinition>
          );
        },
      },
      {
        /**
         * shouldProcessHTMLElement
         * @param tagname tagname
         * @param element element
         * @returns boolean
         */
        shouldProcessHTMLElement: (tagname, element) =>
          (tagname === "figure" || tagname === "span") &&
          element.classList.contains("image"),
        preventChildProcessing: true,

        /**
         * processingFunction
         * @param tag tag
         * @param props props
         * @param children children
         * @param element element
         * @returns any
         */
        processingFunction: (tag, props, children, element) => {
          const dataset = extractDataSet<ImageDataset>(element);
          return (
            <Image
              key={props.key}
              element={element}
              path={path}
              invisible={invisible}
              dataset={dataset}
              processingRules={processingRules}
            />
          );
        },
        id: "image-rule",
      },
      {
        /**
         * shouldProcessHTMLElement
         * @param tagname tagname
         * @param element element
         * @returns boolean
         */
        shouldProcessHTMLElement: (tagname, element) =>
          tagname === "span" && element.classList.contains("math-tex"),
        /**
         * processingFunction
         * @param tag tag
         * @param props  props
         * @param children  children
         * @param element  element
         * @returns any
         */
        processingFunction: (tag, props, children, element) => (
          // eslint-disable-next-line react/no-children-prop
          <MathJAX key={props.key} invisible={invisible} children={children} />
        ),
      },
      {
        /**
         * shouldProcessHTMLElement
         * @param tagname tagname
         * @param element element
         * @returns boolean
         */
        shouldProcessHTMLElement: (tagname, element) =>
          !!(tagname === "a" && (element as HTMLAnchorElement).href),
        id: "link-rule",
        preventChildProcessing: true,

        /**
         * processingFunction
         * @param tag tag
         * @param props props
         * @param children children
         * @param element element
         * @returns any
         */
        processingFunction: (tag, props, children, element) => {
          const dataset = extractDataSet<LinkDataset>(element);
          return (
            <Link
              key={props.key}
              element={element}
              path={path}
              dataset={dataset}
              processingRules={processingRules}
            />
          );
        },
      },
      {
        /**
         * shouldProcessHTMLElement
         * @param tagname tagname
         * @returns boolean
         */
        shouldProcessHTMLElement: (tagname) => tagname === "table",
        /**
         * processingFunction
         * @param tagname tagname
         * @param props props
         * @param children children
         * @param element element
         * @returns any
         */
        processingFunction: (tagname, props, children, element) => (
          <Table
            key={props.key}
            element={element}
            props={props}
            // eslint-disable-next-line react/no-children-prop
            children={children}
          />
        ),
      },
      {
        /**
         * shouldProcessHTMLElement
         * @param tagname tagname
         * @returns boolean
         */
        shouldProcessHTMLElement: (tagname) => tagname === "audio",
        /**
         * preprocessReactProperties
         * @param tag tag
         * @param props props
         * @param children children
         * @param element element
         */
        preprocessReactProperties: (tag, props, children, element) => {
          props.preload = "metadata";
        },

        /**
         * processingFunction
         * @param tag tag
         * @param props props
         * @param children children
         * @param element element
         * @returns any
         */
        processingFunction: (tag, props, children, element) => (
          <AudioPoolComponent {...props} invisible={invisible}>
            {children}
          </AudioPoolComponent>
        ),
      },
      {
        /**
         * shouldProcessHTMLElement
         * @param tagname tagname
         * @returns boolean
         */
        shouldProcessHTMLElement: (tagname) => tagname === "source",
        /**
         * preprocessReactProperties
         * @param tag tag
         * @param props props
         * @param children children
         * @param element element
         */
        preprocessReactProperties: (tag, props, children, element) => {
          const dataset = extractDataSet<any>(element);
          const src = dataset.original || "";
          const isAbsolute =
            src.indexOf("/") == 0 ||
            src.indexOf("mailto:") == 0 ||
            src.indexOf("data:") == 0 ||
            src.match("^(?:[a-zA-Z]+:)?//");
          if (!isAbsolute) {
            const path =
              "/workspace/" +
              this.props.workspace.urlName +
              "/materials/" +
              this.props.material.path;
            props.src = path + "/" + src;
          }
        },
      },
    ];

    // This is all there is we just glue the HTML in there
    // and pick out the content from there
    return (
      <div className="material-page__content rich-text">
        {this.state.elements.map((rootElement, index) =>
          HTMLtoReactComponent(rootElement, processingRules, index)
        )}
      </div>
    );
  }
}

/**
 * Extract common props that are the same for all field components
 * @param element HTML element containing field data
 * @param props Base props from MaterialLoader
 * @param key React key
 * @returns Object with common props for field components
 */
export function extractCommonFieldProps(
  element: HTMLElement,
  props: BaseProps,
  key?: number
) {
  // Extract parameters from <param> elements
  const parameters: { [key: string]: any } = {};

  element.querySelectorAll("param").forEach((node) => {
    parameters[node.getAttribute("name")] = node.getAttribute("value");
  });

  // Handle JSON content parsing
  if (parameters["type"] === "application/json") {
    try {
      parameters["content"] =
        parameters["content"] && JSON.parse(parameters["content"]);
    } catch (e) {
      // Keep original content if parsing fails
    }
  }

  // Set defaults
  if (!parameters["type"]) {
    parameters["type"] = "application/json";
  }
  if (!parameters["content"]) {
    parameters["content"] = null;
  }

  // Add common props from MaterialLoader
  const commonProps: CommonFieldProps = {
    // Field parameters
    type: parameters["type"],
    content: parameters["content"],

    // MaterialLoader props
    status: props.status,
    readOnly: props.readOnly,
    usedAs: props.usedAs,
    displayCorrectAnswers: props.displayCorrectAnswers,
    checkAnswers: props.checkAnswers,
    onAnswerChange: props.onAnswerChange,
    invisible: props.invisible,
    userId: props.status.userId,

    // React key
    key: key,
  };

  return commonProps;
}

/**
 * Extract field-specific initial value from composite replies
 * @param content Field content object
 * @param compositeReplies Composite replies from props
 * @returns Initial value for the field
 */
export function extractFieldInitialValue(content: any, compositeReplies: any) {
  if (!compositeReplies?.answers || !content?.name) {
    return null;
  }

  const answer = compositeReplies.answers.find(
    (answer: any) => answer.fieldName === content.name
  );

  if (!answer) {
    return null;
  }

  // Handle .value field if it exists
  return typeof answer.value !== "undefined" ? answer.value : answer;
}
