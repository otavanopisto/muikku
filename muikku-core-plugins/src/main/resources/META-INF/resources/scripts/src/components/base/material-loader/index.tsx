/* eslint-disable react/no-string-refs */

/**
 * Deprecated refs should be reractored
 */

//NOTE this is a sandbox file, because the code in the material loader is so complex I created this self contained
//blackbox environment that makes it so that the material loader behaves like one component, this is bad because
//it does not have the same capabilities and efficiency as the other components, and cannot be easily modified
//please remove it

import * as React from "react";
import {
  MaterialContentNodeWithIdAndLogic,
  WorkspaceDataType,
} from "~/reducers/workspaces";
import { StatusType } from "~/reducers/base/status";
import { StateType } from "~/reducers";
import { WebsocketStateType } from "~/reducers/util/websocket";
import { Action, bindActionCreators, Dispatch } from "redux";
import {
  UpdateAssignmentStateTriggerType,
  updateAssignmentState,
} from "~/actions/workspaces";
import {
  DisplayNotificationTriggerType,
  displayNotification,
} from "~/actions/base/notifications";
import "~/sass/elements/rich-text.scss";
import "~/sass/elements/material-page.scss";
import { UsedAs } from "~/@types/shared";
import {
  RequestWorkspaceMaterialContentNodeAttachmentsTriggerType,
  SetWorkspaceMaterialEditorStateTriggerType,
  UpdateWorkspaceMaterialContentNodeTriggerType,
  setWorkspaceMaterialEditorState,
  updateWorkspaceMaterialContentNode,
  requestWorkspaceMaterialContentNodeAttachments,
} from "~/actions/workspaces/material";
import {
  MaterialCompositeReply,
  WorkspaceAssessmentState,
} from "~/generated/client";
import { AnyActionType } from "~/actions";
import MApi from "~/api/api";
import { connect } from "react-redux";

/* i18n.t("", { ns: "materials" }); */

//These represent the states assignments and exercises can be in
const STATES = [
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
];

/**
 * MaterialLoaderProps
 */
export interface MaterialLoaderProps {
  evaluation: WorkspaceAssessmentState[];
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

  updateAssignmentState: UpdateAssignmentStateTriggerType;
  setWorkspaceMaterialEditorState: SetWorkspaceMaterialEditorStateTriggerType;
  updateWorkspaceMaterialContentNode: UpdateWorkspaceMaterialContentNodeTriggerType;
  displayNotification: DisplayNotificationTriggerType;
  requestWorkspaceMaterialContentNodeAttachments: RequestWorkspaceMaterialContentNodeAttachmentsTriggerType;

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
  private stateConfiguration: any;
  private answerRegistrySync: { [name: string]: any };

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
    };

    // Find the most current evaluation from the list of evaluations
    const mostCurrentEvaluation = props.evaluation.reduce((prev, current) => {
      if (prev === null) {
        return current;
      }
      const currentDate = new Date(current.date);
      const prevDate = new Date(prev.date);
      return currentDate > prevDate ? current : prev;
    }, null);

    // If the most current evaluation is incomplete, disable the withdraw button from submitted evaluables
    if (mostCurrentEvaluation && mostCurrentEvaluation.state === "incomplete") {
      STATES.find((s) => {
        return s["assignment-type"] === "EVALUATED" && s.state === "SUBMITTED";
      })["button-disabled"] = true;
    }

    //A sync version of the answer registry, it can change so fast
    //setStates might stack
    this.answerRegistrySync = {};

    this.onPushAnswer = this.onPushAnswer.bind(this);
    this.toggleAnswersVisible = this.toggleAnswersVisible.bind(this);
    this.onAnswerChange = this.onAnswerChange.bind(this);
    this.onAnswerCheckableChange = this.onAnswerCheckableChange.bind(this);

    //if it is answerable
    if (props.answerable && props.material) {
      //lets try and get the state configuration
      this.stateConfiguration = STATES.filter(
        (state: any) =>
          // by assignment type first. If it is not found, then it is not answerable
          // There two type situation. First is for normal workspace material use and
          // second is for evaluation use.
          state["assignment-type"] === props.material.assignmentType
      ).find((state: any) => {
        //then by state, if no composite reply is given assume UNANSWERED
        const stateRequired =
          (props.compositeReplies && props.compositeReplies.state) ||
          "UNANSWERED";
        const statesInIt = state["state"];

        return (
          statesInIt === stateRequired ||
          (statesInIt instanceof Array && statesInIt.includes(stateRequired))
        );
      });

      //If checks answers, make it with answersChecked and answersVisible starting as true
      if (
        this.stateConfiguration &&
        this.stateConfiguration["checks-answers"]
      ) {
        state.answersChecked = true;
        if ((props.material.correctAnswers || "ALWAYS") === "ALWAYS") {
          state.answersVisible = true;
        }
      }
    }

    //set the state
    this.state = state;
  }
  /**
   * componentDidMount
   */
  componentDidMount() {
    this.setState({
      answersVisible: this.props.answersVisible && this.props.answersVisible,
      answersChecked: this.props.answersVisible && this.props.answersVisible,
    });

    //create the composite replies if using the boolean flag
    this.create();
  }
  /**
   * UNSAFE_componentWillUpdate
   * @param nextProps nextProps
   * @param nextState nextState
   */
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillUpdate(
    nextProps: MaterialLoaderProps,
    nextState: MaterialLoaderState
  ) {
    //if the component will update we need to do some changes if it's gonna be answerable
    //and there's a material
    if (nextProps.answerable && nextProps.material) {
      //we get the composite replies
      const compositeReplies =
        nextProps.compositeReplies || nextState.compositeRepliesInState;

      //The state configuration
      this.stateConfiguration = STATES.filter(
        (state: any) =>
          state["assignment-type"] === nextProps.material.assignmentType
      ).find((state: any) => {
        const stateRequired =
          (compositeReplies && compositeReplies.state) || "UNANSWERED";
        const statesInIt = state["state"];
        return (
          statesInIt === stateRequired ||
          (statesInIt instanceof Array && statesInIt.includes(stateRequired))
        );
      });

      //There should be one but add this check just in case
      if (this.stateConfiguration) {
        //if the thing has the flag to checks-answers but they are not going to be
        if (
          this.stateConfiguration["checks-answers"] &&
          !nextState.answersChecked
        ) {
          //Depending on whether rightAnswers are ALWAYS (and the default is always if not set)
          if ((nextProps.material.correctAnswers || "ALWAYS") === "ALWAYS") {
            //We set the answers visible and checked
            this.setState({
              answersVisible: true,
              answersChecked: true,
            });
          } else {
            //Otherwise the answers only get checked, this is for example
            //For the ON_REQUEST or NEVER types
            this.setState({
              answersChecked: true,
            });
          }
          //If the opposite is true and they are not with the checks-answers flags but they are currently checked
        } else if (
          !this.stateConfiguration["checks-answers"] &&
          nextState.answersChecked
        ) {
          //hide all that, and answersVisible too, it might be active too
          this.setState({
            answersVisible: false,
            answersChecked: false,
          });
        }
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
          await workspaceApi.getWorkspaceCompositeMaterialReplies({
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
  getComponent(): HTMLDivElement {
    return this.refs["root"] as HTMLDivElement;
  }

  /**
   * onPushAnswer
   * This gets called once an answer is pushed with the button to push the answer
   * To change its state
   * @param params params
   */
  onPushAnswer(params?: any) {
    //So now we need that juicy success state
    if (this.stateConfiguration["success-state"]) {
      //Get the composite reply
      const compositeReplies =
        this.props.compositeReplies || this.state.compositeRepliesInState;
      //We make it be the success state that was given, call this function
      //We set first the state we want
      //false because we want to call and update the state server side
      //we put the required workspace id and workspace material id
      //add a worspaceMaterialReplyId if we have one, and hopefully we will, for most of the cases that is
      //We add the success text if we have one, ofc it is a string to translate
      this.props.updateAssignmentState(
        this.stateConfiguration["success-state"],
        false,
        this.props.workspace.id,
        this.props.material.workspaceMaterialId,
        compositeReplies && compositeReplies.workspaceMaterialReplyId,
        this.stateConfiguration["success-text"]
          ? this.stateConfiguration["success-text"]
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
   *
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
          compositeReplies,
          onAnswerChange: this.onAnswerChange,
          onAnswerCheckableChange: this.onAnswerCheckableChange,
          onPushAnswer: this.onPushAnswer,
          onToggleAnswersVisible: this.toggleAnswersVisible,
        },
        this.state,
        this.stateConfiguration
      );
    }

    return (
      <article className={className} ref="root" id={this.props.id}>
        {content}
      </article>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    status: state.status,
    evaluation: state.workspaces.currentWorkspace?.activity?.assessmentStates,
    websocket: state.websocket,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    {
      updateAssignmentState,
      setWorkspaceMaterialEditorState,
      updateWorkspaceMaterialContentNode,
      displayNotification,
      requestWorkspaceMaterialContentNodeAttachments,
    },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps)(MaterialLoader);
