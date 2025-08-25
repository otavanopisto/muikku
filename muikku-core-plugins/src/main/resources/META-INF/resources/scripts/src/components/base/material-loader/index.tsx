/* eslint-disable @typescript-eslint/no-explicit-any */
//NOTE this is a sandbox file, because the code in the material loader is so complex I created this self contained
//blackbox environment that makes it so that the material loader behaves like one component, this is bad because
//it does not have the same capabilities and efficiency as the other components, and cannot be easily modified
//please remove it

import * as React from "react";
import {
  MaterialContentNodeWithIdAndLogic,
  WorkspaceDataType,
  WorkspaceMaterialEditorType,
} from "~/reducers/workspaces";
import { StatusType } from "~/reducers/base/status";
import { WebsocketStateType } from "~/reducers/util/websocket";
import "~/sass/elements/rich-text.scss";
import "~/sass/elements/material-page.scss";
import { UsedAs } from "~/@types/shared";
import { MaterialCompositeReply } from "~/generated/client";
import MApi from "~/api/api";
import { isEqual } from "lodash";
import { NotificationSeverityType } from "~/reducers/base/notifications";
import { STATES } from "./helpers";
import { StateConfig } from "./types";

/* i18n.t("", { ns: "materials" }); */

//These represent the states assignments and exercises can be in
/* const STATES = [
  {
    "assignment-type": "EXERCISE",
    //usually exercises cannot be withdrawn but they might be in extreme cases when a evaluated has
    //been modified
    state: ["UNANSWERED", "ANSWERED", "WITHDRAWN"],

    //when an exercise is in the state unanswered answered or withdrawn then it doesn't
    //display this button
    "displays-hide-show-answers-on-request-button-if-allowed": false,
    "button-class": "muikku-submit-exercise",

    //This is what by default appears on the button
    "button-text": "actions.send_exercise",

    //Buttons are not disabled
    "button-disabled": false,

    //When the button is pressed, the composite reply will change state to this one
    "success-state": "SUBMITTED",

    //Whether or not the fields are read only
    "fields-read-only": false,
  },
  {
    "assignment-type": "EXERCISE",
    state: ["SUBMITTED"],

    //With this property active whenever in this state the answers will be checked
    "checks-answers": true,
    "displays-hide-show-answers-on-request-button-if-allowed": true,
    "button-class": "muikku-submit-exercise",
    "button-text": "actions.cancel_exercise",
    "button-disabled": false,
    "success-state": "ANSWERED",
    //This is for when the fields are modified, the exercise rolls back to be answered rather than submitted
    "modify-state": "ANSWERED",
  },
  {
    "assignment-type": "EXERCISE",
    state: ["PASSED", "FAILED", "INCOMPLETE"],

    //With this property active whenever in this state the answers will be checked
    "checks-answers": true,
    "displays-hide-show-answers-on-request-button-if-allowed": true,
    "button-class": "muikku-submit-exercise",
    "button-text": "actions.sent",
    "button-disabled": false,

    //This is for when the fields are modified, the exercise rolls back to be answered rather than submitted
    "modify-state": "ANSWERED",
  },
  {
    "assignment-type": "EVALUATED",
    state: ["UNANSWERED", "ANSWERED"],
    "button-class": "muikku-submit-assignment",
    "button-text": "actions.send_assignment",
    //Represents a message that will be shown once the state changes to the success state
    "success-text": "notifications.assignmentSubmitted",
    "button-disabled": false,
    "success-state": "SUBMITTED",
    "fields-read-only": false,
  },
  {
    "assignment-type": "EVALUATED",
    state: "SUBMITTED",
    "button-class": "muikku-withdraw-assignment",
    "button-text": "actions.cancel_assignment",
    "success-text": "notifications.assignmentWithdrawn",
    "button-disabled": false,
    "success-state": "WITHDRAWN",
    "fields-read-only": true,
  },
  {
    "assignment-type": "EVALUATED",
    state: ["FAILED"],
    "button-class": "muikku-withdraw-assignment",
    "button-text": "actions.cancel_assignment",
    "success-text": "notifications.assignmentWithdrawn",
    "button-disabled": true,
    "fields-read-only": true,
  },
  {
    "assignment-type": "EVALUATED",
    state: ["INCOMPLETE"],
    "button-class": "muikku-withdraw-assignment",
    "button-text": "actions.cancel_assignment",
    "success-text": "notifications.assignmentWithdrawn",
    "button-disabled": false,
    "success-state": "WITHDRAWN",
    "fields-read-only": true,
  },
  {
    "assignment-type": "EVALUATED",
    state: "WITHDRAWN",
    "button-class": "muikku-update-assignment",
    "button-text": "actions.update",
    "success-text": "notifications.assignmentUpdated",
    "button-disabled": false,
    "success-state": "SUBMITTED",
    "fields-read-only": false,
  },
  {
    "assignment-type": "EVALUATED",
    state: "PASSED",
    "button-class": "muikku-evaluated-assignment",
    "button-text": "actions.evaluated",
    "button-disabled": true,
    "fields-read-only": true,
  },
  {
    "assignment-type": "JOURNAL",
    state: ["UNANSWERED", "ANSWERED"],
    "button-class": "muikku-submit-journal",
    "button-text": "actions.save",
    "success-state": "SUBMITTED",
    "button-disabled": false,
    "fields-read-only": false,
  },
  {
    "assignment-type": "JOURNAL",
    state: "SUBMITTED",
    "button-class": "muikku-submit-journal",
    "button-text": "actions.edit",
    "success-state": "ANSWERED",
    "button-disabled": false,
    "fields-read-only": true,
  },
  {
    "assignment-type": "INTERIM_EVALUATION",
    state: ["UNANSWERED", "ANSWERED"],
    "button-class": "muikku-submit-interim-evaluation",
    "button-text": "actions.send_interimEvaluationRequest",
    "success-state": "SUBMITTED",
    "button-disabled": false,
    "fields-read-only": false,
  },
  {
    "assignment-type": "INTERIM_EVALUATION",
    state: "SUBMITTED",
    "button-class": "muikku-submit-interim-evaluation",
    "button-text": "actions.cancel_interimEvaluationRequest",
    "success-state": "ANSWERED",
    "button-disabled": false,
    "fields-read-only": true,
  },
  {
    "assignment-type": "INTERIM_EVALUATION",
    state: "PASSED",
    "button-class": "muikku-evaluated-assignment",
    "button-text": "actions.evaluated",
    "button-disabled": true,
    "fields-read-only": true,
  },
]; */

/**
 * Callback parameter types for MaterialLoader
 */
export interface AssignmentStateChangeCallback {
  (
    newState: string,
    shouldUpdateServer: boolean,
    workspaceId: number,
    workspaceMaterialId: number,
    workspaceMaterialReplyId?: number,
    successText?: string,
    onComplete?: () => void
  ): void;
}

/**
 * EditorStateChangeParams
 */
export interface EditorStateChangeCallback {
  (
    newState: WorkspaceMaterialEditorType,
    loadCurrentDraftNodeValue?: boolean
  ): void;
}

/**
 * ContentNodeUpdateParams
 */
export interface ContentNodeUpdateCallback {
  (data: {
    workspace: WorkspaceDataType;
    material: MaterialContentNodeWithIdAndLogic;
    update: Partial<MaterialContentNodeWithIdAndLogic>;
    isDraft?: boolean;
    updateLinked?: boolean;
    removeAnswers?: boolean;
    success?: () => any;
    fail?: () => any;
    dontTriggerReducerActions?: boolean;
  }): void;
}

/**
 * NotificationParams
 */
export interface NotificationCallback {
  (
    message: string,
    severity: NotificationSeverityType,
    timeout?: number,
    customId?: string | number
  ): void;
}

/**
 * AttachmentsRequestParams
 */
export interface AttachmentsRequestCallback {
  (
    workspace: WorkspaceDataType,
    material: MaterialContentNodeWithIdAndLogic
  ): void;
}

/**
 * MaterialLoaderProps
 */
export interface MaterialLoaderProps {
  material: MaterialContentNodeWithIdAndLogic;
  folder?: MaterialContentNodeWithIdAndLogic;
  workspace: WorkspaceDataType;
  status: StatusType;
  modifiers?: string | Array<string>;
  id?: string;
  websocket: WebsocketStateType;
  isInFrontPage?: boolean;

  /**
   * Can be defined for fetching current students compositereplies for
   * example. Used as conjuction with usedAs "evaluation tool"
   */
  userEntityId?: number;

  /**
   * Defines if MaterialLoader is used differently than default case
   * Example as "evaluation tool"
   */
  usedAs?: UsedAs;

  /**
   * Whether or not the thing can be answered
   * and then it will use the state configuration
   */
  answerable?: boolean;

  /**
   * Editing mode, should only be available to admins
   */
  editable?: boolean;
  canDelete?: boolean;
  canHide?: boolean;
  disablePlugins?: boolean;
  canPublish?: boolean;
  canRevert?: boolean;
  canRestrictView?: boolean;
  canCopy?: boolean;
  canChangePageType?: boolean;
  canChangeExerciseType?: boolean;
  canSetLicense?: boolean;
  canSetProducers?: boolean;
  canAddAttachments?: boolean;
  canEditContent?: boolean;
  canSetTitle?: boolean;

  /**
   * When the assignment state has changed, this triggers
   */
  onAssignmentStateModified?: () => any;

  /**
   * A boolean to load the composite replies if they haven't been given
   * Shouldn't use if answerable as the updateAssignmentState function is
   * used
   */
  loadCompositeReplies?: boolean;
  compositeReplies?: MaterialCompositeReply;

  readOnly?: boolean;

  onUpdateAssignmentState?: AssignmentStateChangeCallback;
  onSetWorkspaceMaterialEditorState?: EditorStateChangeCallback;
  onUpdateWorkspaceMaterialContentNode?: ContentNodeUpdateCallback;
  onDisplayNotification?: NotificationCallback;
  onRequestWorkspaceMaterialContentNodeAttachments?: AttachmentsRequestCallback;

  onAnswerChange?: (name: string, value?: boolean) => any;
  onAnswerCheckableChange?: (answerCheckable: boolean) => any;
  onPushAnswer?: (params?: any) => any;
  onToggleAnswersVisible?: () => any;
  invisible?: boolean;
  answersVisible?: boolean;
  isViewRestricted?: boolean;
  readspeakerComponent?: JSX.Element;
  anchorElement?: JSX.Element;

  children?: (
    props: MaterialLoaderProps,
    state: MaterialLoaderState,
    stateConfiguration: any
  ) => any;
}

/**
 * DefaultMaterialLoaderProps
 */
interface DefaultMaterialLoaderProps {
  usedAs: UsedAs;
}

/**
 * MaterialLoaderState
 */
interface MaterialLoaderState {
  //Composite replies as loaded when using loadCompositeReplies boolean
  compositeRepliesInState: MaterialCompositeReply;
  compositeRepliesInStateLoaded: boolean;

  //whether the answers are visible and checked
  answersVisible: boolean;
  answersChecked: boolean;

  //whether the material can be checked at all
  answerCheckable: boolean;

  //A registry for the right and wrong answers as told by the material
  answerRegistry: { [name: string]: any };
  stateConfiguration: StateConfig | null;
}

//A cheap cache for material replies and composite replies used by the hack
const materialRepliesCache: { [key: string]: any } = {};
const compositeRepliesCache: { [key: string]: MaterialCompositeReply } = {};

//Treat this class with care it uses a lot of hacks to be efficient
//The compositeReplies which answers are ignored and only used for setting the initial replies
//Overall there are a ton of hacks for making it fast
//So try only to update the composite replies only, however any changes will be ignored by the field themselves and used only on purposes of
//updating the layout and what not basically here, down the line all changes are scraped, base never ever updates
//and the field never changes its state, a change in the content of the field, can destroy it and break the page
//you can add styles here but don't mess up with the low level rendering
/**
 * MaterialLoader
 */
class MaterialLoader extends React.Component<
  MaterialLoaderProps,
  MaterialLoaderState
> {
  private answerRegistrySync: { [name: string]: any };
  private rootRef: React.RefObject<HTMLElement>;

  static defaultProps: DefaultMaterialLoaderProps = {
    usedAs: "default",
  };

  /**
   * constructor
   * @param props props
   */
  constructor(props: MaterialLoaderProps) {
    super(props);

    //initial state has no composite replies and the answers are not visible or checked
    const state: MaterialLoaderState = {
      compositeRepliesInState: null,
      compositeRepliesInStateLoaded: false,

      answersVisible: false,
      answersChecked: false,

      //assume true, as it is usually true; this is
      //basically only used for exercises to show button-check-text instead
      //of just the normal text that doesn't check
      answerCheckable: true,

      //The rightness registry start empty
      answerRegistry: {},
      stateConfiguration: null,
    };

    //A sync version of the answer registry, it can change so fast
    //setStates might stack
    this.answerRegistrySync = {};
    this.rootRef = React.createRef();

    this.onPushAnswer = this.onPushAnswer.bind(this);
    this.toggleAnswersVisible = this.toggleAnswersVisible.bind(this);
    this.onAnswerChange = this.onAnswerChange.bind(this);
    this.onAnswerCheckableChange = this.onAnswerCheckableChange.bind(this);

    let stateConfiguration: StateConfig | null = null;

    //if it is answerable
    if (props.answerable && props.material) {
      //lets try and get the state configuration
      stateConfiguration = STATES.filter(
        (state) =>
          // by assignment type first. If it is not found, then it is not answerable
          // There two type situation. First is for normal workspace material use and
          // second is for evaluation use.
          state.assignmentType === props.material.assignmentType
      ).find((state) => {
        //then by state, if no composite reply is given assume UNANSWERED
        const stateRequired =
          (props.compositeReplies && props.compositeReplies.state) ||
          "UNANSWERED";
        const statesInIt = state.states;
        return (
          statesInIt === stateRequired ||
          (statesInIt instanceof Array && statesInIt.includes(stateRequired))
        );
      });

      //If checks answers, make it with answersChecked and answersVisible starting as true
      if (stateConfiguration && stateConfiguration?.checksAnswers) {
        state.answersChecked =
          (props.material.correctAnswers || "NEVER") !== "NEVER";
        state.answersVisible =
          (props.material.correctAnswers || "ALWAYS") === "ALWAYS";
      }
      // Evaluation tool version because in the evaluation tool answers need to be visible and checked
      // and information is passed in props
      if (props.usedAs === "evaluationTool") {
        state.answersVisible = props.answersVisible || false;
        state.answersChecked = props.answersVisible || false;
      }
    }

    //set the state
    this.state = { ...state, stateConfiguration };
  }
  /**
   * componentDidMount
   */
  componentDidMount() {
    //create the composite replies if using the boolean flag
    this.create();
  }

  /**
   * ShouldComponentUpdate. To prevent unnecessary re-renders and to optimize performance.
   * @param nextProps nextProps
   * @param nextState nextState
   * @returns boolean
   */
  shouldComponentUpdate(
    nextProps: MaterialLoaderProps,
    nextState: MaterialLoaderState
  ) {
    return (
      !isEqual(this.props, nextProps) ||
      !isEqual(this.state.stateConfiguration, nextState.stateConfiguration) ||
      this.state.answersVisible !== nextState.answersVisible ||
      this.state.answersChecked !== nextState.answersChecked ||
      this.state.answerRegistry !== nextState.answerRegistry
    );
  }

  /**
   * Calculate new state configuration based on props
   * @param props props
   * @param state state
   * @returns Partial<MaterialLoaderState> | null
   */
  static getDerivedStateFromProps(
    props: MaterialLoaderProps,
    state: MaterialLoaderState
  ): Partial<MaterialLoaderState> | null {
    if (!props.answerable || !props.material) {
      return null;
    }

    const compositeReplies =
      props.compositeReplies || state.compositeRepliesInState;

    // Calculate new state configuration
    const newStateConfiguration = STATES.filter(
      (state) => state.assignmentType === props.material.assignmentType
    ).find((state) => {
      const stateRequired =
        (compositeReplies && compositeReplies.state) || "UNANSWERED";
      const statesInIt = state.states;
      return (
        statesInIt === stateRequired ||
        (statesInIt instanceof Array && statesInIt.includes(stateRequired))
      );
    });

    // Only update if configuration changed
    if (!isEqual(newStateConfiguration, state.stateConfiguration)) {
      return { stateConfiguration: newStateConfiguration };
    }

    return null;
  }

  /**
   * Handle answer checking logic based on state configuration changes
   * @param prevProps prevProps
   * @param prevState prevState
   */
  componentDidUpdate(
    prevProps: MaterialLoaderProps,
    prevState: MaterialLoaderState
  ) {
    if (!this.props.answerable || !this.props.material) {
      return;
    }

    // Handle answer checking logic when stateConfiguration changes
    if (!isEqual(prevState.stateConfiguration, this.state.stateConfiguration)) {
      const shouldCheck = this.state.stateConfiguration?.checksAnswers;
      const isAlwaysShow =
        (this.props.material.correctAnswers || "ALWAYS") === "ALWAYS";

      if (shouldCheck && !this.state.answersChecked) {
        if (isAlwaysShow) {
          this.setState({
            answersVisible: true,
            answersChecked: true,
          });
        } else {
          this.setState({
            answersChecked: true,
          });
        }
      } else if (!shouldCheck && this.state.answersChecked) {
        this.setState({
          answersVisible: false,
          answersChecked: false,
        });
      }
    }
  }

  /**
   * create
   */
  async create() {
    const { usedAs = "default", userEntityId } = this.props;

    const workspaceApi = MApi.getWorkspaceApi();

    let userEntityIdToLoad = this.props.status.userId;

    if (usedAs === "evaluationTool" && userEntityId) {
      userEntityIdToLoad = userEntityId;
    }

    //TODO maybe we should get rid of this way to load the composite replies
    //after all it's learned that this is part of the workspace
    if (this.props.loadCompositeReplies) {
      let compositeRepliesInState: MaterialCompositeReply =
        compositeRepliesCache[
          this.props.workspace.id + "-" + this.props.material.assignment.id
        ];
      if (!compositeRepliesInState) {
        compositeRepliesInState =
          await workspaceApi.getWorkspaceUserCompositeReply({
            workspaceEntityId: this.props.workspace.id,
            workspaceMaterialId: this.props.material.assignment.id,
            userEntityId: userEntityIdToLoad,
          });

        materialRepliesCache[
          this.props.workspace.id + "-" + this.props.material.assignment.id
        ] = compositeRepliesInState || null;

        setTimeout(() => {
          delete compositeRepliesCache[
            this.props.workspace.id + "-" + this.props.material.assignment.id
          ];
        }, 60000);
      }

      this.setState({
        compositeRepliesInState,
        compositeRepliesInStateLoaded: true,
      });
    }
  }

  /**
   * getComponent
   */
  getComponent(): HTMLElement | null {
    return this.rootRef.current;
  }

  /**
   * onPushAnswer
   * This gets called once an answer is pushed with the button to push the answer
   * To change its state
   * @param params params
   */
  onPushAnswer(params?: any) {
    //So now we need that juicy success state
    if (this.state.stateConfiguration?.successState) {
      //Get the composite reply
      const compositeReplies =
        this.props.compositeReplies || this.state.compositeRepliesInState;
      //We make it be the success state that was given, call this function
      //We set first the state we want
      //false because we want to call and update the state server side
      //we put the required workspace id and workspace material id
      //add a worspaceMaterialReplyId if we have one, and hopefully we will, for most of the cases that is
      //We add the success text if we have one, ofc it is a string to translate
      this.props.onUpdateAssignmentState &&
        this.props.onUpdateAssignmentState(
          this.state.stateConfiguration?.successState,
          false,
          this.props.workspace.id,
          this.props.material.workspaceMaterialId,
          compositeReplies && compositeReplies.workspaceMaterialReplyId,
          this.state.stateConfiguration?.successText
            ? this.state.stateConfiguration?.successText
            : undefined,
          this.props.onAssignmentStateModified
        );
    }

    this.props.onPushAnswer && this.props.onPushAnswer();
  }

  /**
   * Toggles answers visible or not
   */
  toggleAnswersVisible() {
    this.setState({
      answersVisible: !this.state.answersVisible,
    });

    this.props.onToggleAnswersVisible && this.props.onToggleAnswersVisible();
  }

  /**
   * This function gets called every time a field answer state changes
   * because of the way it works it will only be called if checkAnswers boolean attribute
   * is set to true and it will fire immediately all the on rightness change events, as everything
   * starts with unknown rightness, only things that can be righted call this, the name represents the field
   * and the value the rightness that came as a result
   * Some items do not trigger this function, which means your rightness count might differ from the
   * amount of fields, because fields self register
   * @param name name
   * @param value value
   */
  onAnswerChange(name: string, value?: boolean) {
    //The reason we need a sync registry is that the rightness can change so fast
    //that it can overwrite itself in async operations like setState and this.state

    //A value of null represents no rightness, some fields can have unknown rightness
    if (value === null) {
      delete this.answerRegistrySync[name];
    } else {
      this.answerRegistrySync[name] = value;
    }
    const newObj: any = { ...this.answerRegistrySync };
    this.setState({
      answerRegistry: newObj,
    });

    this.props.onAnswerChange && this.props.onAnswerChange(name, value);

    //NOTE if you would rather have 3 answer states here in order
    //to make all fields show in the correct answer count you might modify and change how
    //the function operates within the fields freely
  }

  /**
   * this function gets called when the material in question
   * answer checkable state changes
   * now by default this state is unknown
   * so it will always trigger on setup
   * however here we set it to true and check
   * because changes are it will be true so we
   * need not to update anything
   * if that's the case
   * feel free to go on top and change it to false
   * if chances are it is more likely to be false
   * should save a couple of bytes
   * @param answerCheckable answerCheckable
   */
  onAnswerCheckableChange(answerCheckable: boolean) {
    if (answerCheckable !== this.state.answerCheckable) {
      this.setState({ answerCheckable });
    }

    this.props.onAnswerCheckableChange &&
      this.props.onAnswerCheckableChange(answerCheckable);
  }

  /**
   * returnMaterialPageType
   * @returns material page type
   */
  returnMaterialPageType = () => {
    switch (this.props.material.assignmentType) {
      case "EXERCISE":
        return "exercise";

      case "EVALUATED":
        return "assignment";

      case "JOURNAL":
        return "journal";

      case "INTERIM_EVALUATION":
        return "interim-evaluation";

      default:
        return "theory";
    }
  };

  /**
   * isReadOnly
   * @returns boolean
   */
  isReadOnly = () => {
    // Parent props readOnly is true
    if (this.props.readOnly) {
      return true;
    }

    // If the material is locked, it is read only
    if (this.props.compositeReplies) {
      if (this.props.compositeReplies.lock !== "NONE") {
        return true;
      }
    }

    // If the material is answerable by parent props, and existing state configuration
    // has fields-read-only set to true, it is read only
    if (
      this.props.answerable &&
      this.state.stateConfiguration &&
      this.state.stateConfiguration?.fieldsReadOnly
    ) {
      return true;
    }
    return false;
  };

  /**
   * isAnswerable. Helper function to check if the material is answerable.
   * Note that priority of conditions is different than isReadOnly.
   * @returns boolean
   */
  isAnswerable = () => {
    // If the material is locked, it is not answerable
    if (this.props.compositeReplies) {
      if (this.props.compositeReplies.lock !== "NONE") {
        return false;
      }
    }

    // If parent props answerable is true, it is answerable
    if (this.props.answerable) {
      return true;
    }

    // Defaults to false
    return false;
  };

  /**
   * render
   */
  render() {
    //The modifiers in use
    const modifiers: Array<string> =
      typeof this.props.modifiers === "string"
        ? [this.props.modifiers]
        : this.props.modifiers;
    const compositeReplies =
      this.props.compositeReplies || this.state.compositeRepliesInState;

    //Setting this up
    const isHidden =
      this.props.material.hidden ||
      (this.props.folder && this.props.folder.hidden);

    const materialPageType = this.returnMaterialPageType();

    let className = `material-page material-page--${materialPageType} ${(
      modifiers || []
    )
      .map((s) => `material-page--${s}`)
      .join(" ")} ${isHidden ? "state-HIDDEN" : ""}`;
    if (compositeReplies && compositeReplies.state) {
      className += " state-" + compositeReplies.state;
    }

    let content = null;
    if (
      (this.props.loadCompositeReplies &&
        this.state.compositeRepliesInStateLoaded) ||
      !this.props.loadCompositeReplies
    ) {
      content = this.props.children(
        {
          ...this.props,
          readOnly: this.isReadOnly(),
          answerable: this.isAnswerable(),
          compositeReplies,
          onAnswerChange: this.onAnswerChange,
          onAnswerCheckableChange: this.onAnswerCheckableChange,
          onPushAnswer: this.onPushAnswer,
          onToggleAnswersVisible: this.toggleAnswersVisible,
        },
        this.state,
        this.state.stateConfiguration
      );
    }

    return (
      <article className={className} ref={this.rootRef} id={this.props.id}>
        {content}
      </article>
    );
  }
}

export default MaterialLoader;
