//NOTE this is a sandbox file, because the code in the material loader is so complex I created this self contained
//blackbox environment that makes it so that the material loader behaves like one component, this is bad because
//it does not have the same capabilities and efficiency as the other components, and cannot be easily modified
//please remove it

import * as React from 'react';

import mApi from '~/lib/mApi';
import { WorkspaceType, MaterialContentNodeType, MaterialCompositeRepliesType } from '~/reducers/workspaces';
import promisify from '~/util/promisify';

import { i18nType } from '~/reducers/base/i18n';
import { StatusType } from '~/reducers/base/status';
import { StateType } from '~/reducers';
import { Dispatch, connect } from 'react-redux';
import { WebsocketStateType } from '~/reducers/util/websocket';
import { bindActionCreators } from 'redux';
import { UpdateAssignmentStateTriggerType, updateAssignmentState,
  setWorkspaceMaterialEditorState, SetWorkspaceMaterialEditorStateTriggerType,
  UpdateWorkspaceMaterialContentNodeTriggerType, updateWorkspaceMaterialContentNode,
  requestWorkspaceMaterialContentNodeAttachments, RequestWorkspaceMaterialContentNodeAttachmentsTriggerType } from '~/actions/workspaces';
import { DisplayNotificationTriggerType, displayNotification } from '~/actions/base/notifications';

import '~/sass/elements/rich-text.scss';
import '~/sass/elements/material-page.scss';

//These represent the states assignments and exercises can be in
const STATES = [{
  'assignment-type': 'EXERCISE',
  //usually exercises cannot be withdrawn but they might be in extreme cases when a evaluated has
  //been modified
  'state': ['UNANSWERED', 'ANSWERED', 'WITHDRAWN'],

  //when an exercise is in the state unanswered answered or withdrawn then it doesn't
  //display this button
  'displays-hide-show-answers-on-request-button-if-allowed': false,
  'button-class': 'muikku-check-exercises',

  //This is what by default appears on the button
  'button-text': "plugin.workspace.materialsLoader.sendExerciseButton",

  //This is what appears when the answer can be checked
  //this appears when at least one of the entry fields are checkable
  //in the page
  'button-check-text': "plugin.workspace.materialsLoader.checkExerciseButton",

  //Buttons are not disabled
  'button-disabled': false,

  //When the button is pressed, the composite reply will change state to this one
  'success-state': 'SUBMITTED',

  //Whether or not the fields are read only
  'fields-read-only': false
}, {
  'assignment-type': 'EXERCISE',
  'state': ['SUBMITTED', 'PASSED', 'FAILED', 'INCOMPLETE'],

  //With this property active whenever in this state the answers will be checked
  'checks-answers': true,
  'displays-hide-show-answers-on-request-button-if-allowed': true,
  'button-class': 'muikku-check-exercises',
  'button-text': "plugin.workspace.materialsLoader.exerciseSentButton",
  'button-check-text': "plugin.workspace.materialsLoader.exerciseCheckedButton",
  'button-disabled': false,

  //This is for when the fields are modified, the exercise rolls back to be answered rather than submitted
  'modify-state': 'ANSWERED'
}, {
  'assignment-type': 'EVALUATED',
  'state': ['UNANSWERED', 'ANSWERED'],
  'button-class': 'muikku-submit-assignment',
  'button-text': "plugin.workspace.materialsLoader.submitAssignmentButton",
  //Represents a message that will be shown once the state changes to the success state
  'success-text': "plugin.workspace.materialsLoader.assignmentSubmitted",
  'button-disabled': false,
  'success-state': 'SUBMITTED',
  'fields-read-only': false
}, {
  'assignment-type': 'EVALUATED',
  'state': 'SUBMITTED',
  'button-class': 'muikku-withdraw-assignment',
  'button-text': "plugin.workspace.materialsLoader.withdrawAssignmentButton",
  'success-text': "plugin.workspace.materialsLoader.assignmentWithdrawn",
  'button-disabled': false,
  'success-state': 'WITHDRAWN',
  'fields-read-only': true
}, {
  'assignment-type': 'EVALUATED',
  'state': ['FAILED', 'INCOMPLETE'],
  'button-class': 'muikku-withdraw-assignment',
  'button-text': "plugin.workspace.materialsLoader.withdrawAssignmentButton",
  'success-text': "plugin.workspace.materialsLoader.assignmentWithdrawn",
  'button-disabled': false,
  'success-state': 'WITHDRAWN',
  'fields-read-only': true
}, {
  'assignment-type': 'EVALUATED',
  'state': 'WITHDRAWN',
  'button-class': 'muikku-update-assignment',
  'button-text': "plugin.workspace.materialsLoader.updateAssignmentButton",
  'success-text': "plugin.workspace.materialsLoader.assignmentUpdated",
  'button-disabled': false,
  'success-state': 'SUBMITTED',
  'fields-read-only': false
}, {
  'assignment-type': 'EVALUATED',
  'state': 'PASSED',
  'button-class': 'muikku-evaluated-assignment',
  'button-text': "plugin.workspace.materialsLoader.evaluatedAssignmentButton",
  'button-disabled': true,
  'fields-read-only': true
}]

export interface MaterialLoaderProps {
  material: MaterialContentNodeType,
  folder?: MaterialContentNodeType,

  workspace: WorkspaceType,
  i18n: i18nType,
  status: StatusType,
  modifiers?: string | Array<string>,
  id?: string,
  websocket: WebsocketStateType,
  isInFrontPage?: boolean,

  //Whether or not the thing can be answered
  //and then it will use the state configuration
  answerable?: boolean,

  //Editing mode, should only be available to admins
  editable?: boolean,
  canDelete?: boolean,
  canHide?: boolean,
  disablePlugins?: boolean,
  canPublish?: boolean,
  canRevert?: boolean,
  canRestrictView?: boolean,
  canCopy?: boolean,
  canChangePageType?: boolean,
  canChangeExerciseType?: boolean,
  canSetLicense?: boolean,
  canSetProducers?: boolean,
  canAddAttachments?: boolean,
  canEditContent?: boolean,
  canSetTitle?: boolean,

  //When the assignment state has changed, this triggers
  onAssignmentStateModified?: ()=>any

  //A boolean to load the composite replies if they haven't been given
  //Shouldn't use if answerable as the updateAssignmentState function is
  //used
  loadCompositeReplies?: boolean,
  compositeReplies?: MaterialCompositeRepliesType,

  readOnly?: boolean,

  updateAssignmentState: UpdateAssignmentStateTriggerType,
  setWorkspaceMaterialEditorState: SetWorkspaceMaterialEditorStateTriggerType,
  updateWorkspaceMaterialContentNode: UpdateWorkspaceMaterialContentNodeTriggerType,
  displayNotification: DisplayNotificationTriggerType,
  requestWorkspaceMaterialContentNodeAttachments: RequestWorkspaceMaterialContentNodeAttachmentsTriggerType,

  onAnswerChange?: (name: string, value?: boolean) => any,
  onAnswerCheckableChange?: (answerCheckable: boolean) => any,
  onPushAnswer?: () => any,
  onToggleAnswersVisible?: () => any,
  invisible?: boolean,

  isViewRestricted?: boolean,

  children?: (
    props: MaterialLoaderProps,
    state: MaterialLoaderState,
    stateConfiguration: any,
  ) => any,
}

interface MaterialLoaderState {
  //Composite replies as loaded when using loadCompositeReplies boolean
  compositeRepliesInState: MaterialCompositeRepliesType,
  compositeRepliesInStateLoaded: boolean,

  //whether the answers are visible and checked
  answersVisible: boolean,
  answersChecked: boolean,

  //whether the material can be checked at all
  answerCheckable: boolean,

  //A registry for the right and wrong answers as told by the material
  answerRegistry: {[name: string]: any}
}

//A cheap cache for material replies and composite replies used by the hack
let materialRepliesCache:{[key: string]: any} = {};
let compositeRepliesCache:{[key: string]: MaterialCompositeRepliesType} = {};

//Treat this class with care it uses a lot of hacks to be efficient
//The compositeReplies which answers are ignored and only used for setting the initial replies
//Overall there are a ton of hacks for making it fast
//So try only to update the composite replies only, however any changes will be ignored by the field themselves and used only on purposes of
//updating the layout and what not basically here, down the line all changes are scraped, base never ever updates
//and the field never changes its state, a change in the content of the field, can destroy it and break the page
//you can add styles here but don't mess up with the low level rendering
class MaterialLoader extends React.Component<MaterialLoaderProps, MaterialLoaderState> {
  private stateConfiguration:any;
  private answerRegistrySync: {[name: string]: any};

  constructor(props: MaterialLoaderProps){
    super(props);

    //initial state has no composite replies and the answers are not visible or checked
    let state:MaterialLoaderState = {
      compositeRepliesInState: null,
      compositeRepliesInStateLoaded: false,

      answersVisible: false,
      answersChecked: false,

      //assume true, as it is usually true; this is
      //basically only in used for exercises to show button-check-text instead
      //of just the normal text that doesn't check
      answerCheckable: true,

      //The rightness registry start empty
      answerRegistry: {}
    };

    //A sync version of the answer registry, it can change so fast
    //setStates might stack
    this.answerRegistrySync = {};

    this.onPushAnswer = this.onPushAnswer.bind(this);
    this.toggleAnswersVisible = this.toggleAnswersVisible.bind(this);
    this.onAnswerChange = this.onAnswerChange.bind(this);
    this.onAnswerCheckableChange = this.onAnswerCheckableChange.bind(this);

    //if it is answerable
    if (props.answerable && props.material){
      //lets try and get the state configuration
      this.stateConfiguration = STATES.filter((state:any)=>{
        //by assignment type first
        return state['assignment-type'] === props.material.assignmentType;
      }).find((state:any)=>{
        //then by state, if no composite reply is given assume UNANSWERED
        let stateRequired = (props.compositeReplies && props.compositeReplies.state) || "UNANSWERED";
        let statesInIt = state['state'];
        return statesInIt === stateRequired || ((statesInIt instanceof Array) && statesInIt.includes(stateRequired));
      });

      //If checks answers, make it with answersChecked and answersVisible starting as true
      if (this.stateConfiguration && this.stateConfiguration['checks-answers']){
        state.answersChecked = true;
        if ((props.material.correctAnswers || "ALWAYS") === "ALWAYS"){
          state.answersVisible = true;
        }
      }
    }

    //set the state
    this.state = state;
  }
  componentDidMount(){
    //create the composite replies if using the boolean flag
    this.create();
  }
  componentWillUpdate(nextProps: MaterialLoaderProps, nextState: MaterialLoaderState){
    //if the component will update we need to do some changes if it's gonna be answerable
    //and there's a material
    if (nextProps.answerable && nextProps.material){
      //we get the composite replies
      let compositeReplies = nextProps.compositeReplies || nextState.compositeRepliesInState;

      //The state configuration
      this.stateConfiguration = STATES.filter((state:any)=>{
        return state['assignment-type'] === nextProps.material.assignmentType;
      }).find((state:any)=>{
        let stateRequired = (compositeReplies && compositeReplies.state) || "UNANSWERED";
        let statesInIt = state['state'];
        return statesInIt === stateRequired || ((statesInIt instanceof Array) && statesInIt.includes(stateRequired));
      });

      //There should be one but add this check just in case
      if (this.stateConfiguration){
        //if the thing has the flag to checks-answers but they are not going to be
        if (this.stateConfiguration['checks-answers'] && !nextState.answersChecked){
          //Depending on whether rightAnswers are ALWAYS (and the default is always if not set)
          if ((nextProps.material.correctAnswers || "ALWAYS") === "ALWAYS"){
            //We set the answers visible and checked
            this.setState({
              answersVisible: true,
              answersChecked: true
            });
          } else {
            //Otherwise the answers only get checked, this is for example
            //For the ON_REQUEST or NEVER types
            this.setState({
              answersChecked: true
            });
          }
        //If the opposite is true and they are not with the checks-answers flags but they are currently checked
        } else if (!this.stateConfiguration['checks-answers'] && nextState.answersChecked){
          //hide all that, and answersVisible too, it might be active too
          this.setState({
            answersVisible: false,
            answersChecked: false
          });
        }
      }
    }
  }
  async create(){
    //TODO maybe we should get rid of this way to load the composite replies
    //after all it's learned that this is part of the workspace
    if (this.props.loadCompositeReplies){
      let compositeRepliesInState:MaterialCompositeRepliesType = compositeRepliesCache[this.props.workspace.id + "-" + this.props.material.assignment.id];
      if (!compositeRepliesInState){
        compositeRepliesInState = (await promisify(mApi().workspace.workspaces.materials.compositeMaterialReplies
            .read(this.props.workspace.id, this.props.material.assignment.id,
                {userEntityId: (window as any).MUIKKU_LOGGED_USER_ID}), 'callback')()) as MaterialCompositeRepliesType;

        materialRepliesCache[this.props.workspace.id + "-" + this.props.material.assignment.id] = compositeRepliesInState || null;

        setTimeout(()=>{
          delete compositeRepliesCache[this.props.workspace.id + "-" + this.props.material.assignment.id];
        }, 60000);
      }

      this.setState({
        compositeRepliesInState,
        compositeRepliesInStateLoaded: true,
      });
    }
  }
  getComponent():HTMLDivElement {
    return this.refs["root"] as HTMLDivElement;
  }
  //This gets called once an answer is pushed with the button to push the answer
  //To change its state
  onPushAnswer(){
    //So now we need that juicy success state
    if (this.stateConfiguration['success-state']){
      //Get the composite reply
      let compositeReplies = (this.props.compositeReplies || this.state.compositeRepliesInState);
      //We make it be the success state that was given, call this function
      //We set first the state we want
      //false because we want to call and update the state server side
      //we put the required workspace id and workspace material id
      //add a worspaceMaterialReplyId if we have one, and hopefully we will, for most of the cases that is
      //We add the success text if we have one, ofc it is a string to translate
      this.props.updateAssignmentState(this.stateConfiguration['success-state'], false,
          this.props.workspace.id, this.props.material.workspaceMaterialId, compositeReplies && compositeReplies.workspaceMaterialReplyId,
          this.stateConfiguration['success-text'] && this.props.i18n.text.get(this.stateConfiguration['success-text']), this.props.onAssignmentStateModified);
    }

    this.props.onPushAnswer && this.props.onPushAnswer();
  }
  //Toggles answers visible or not
  toggleAnswersVisible(){
    this.setState({
      answersVisible: !this.state.answersVisible
    });

    this.props.onToggleAnswersVisible && this.props.onToggleAnswersVisible();
  }
  //This function gets called every time a field answer state changes
  //because of the way it works it will only be called if checkAnswers boolean attribute
  //is set to true and it will fire immediately all the on rightness change events, as everything
  //starts with unknown rightness, only things that can be righted call this, the name represents the field
  //and the value the rightness that came as a result
  //Some items do not trigger this function, which means your rightness count might differ from the
  //amount of fields, because fields self register
  onAnswerChange(name: string, value?: boolean){

    //The reason we need a sync registry is that the rightness can change so fast
    //that it can overwrite itself in async operations like setState and this.state

    //A value of null represents no rightness, some fields can have unknown rightness
    if (value === null){
      delete this.answerRegistrySync[name];
    } else {
      this.answerRegistrySync[name] = value;
    }
    let newObj:any = {...this.answerRegistrySync};
    this.setState({
      answerRegistry: newObj
    })

    this.props.onAnswerChange && this.props.onAnswerChange(name, value);

    //NOTE if you would rather have 3 answer states here in order
    //to make all fields show in the correct answer count you might modify and change how
    //the function operates within the fields freely
  }
  //this function gets called when the material in question
  //answer checkable state changes
  //now by default this state is unknown
  //so it will always trigger on setup
  //however here we set it to true and check
  //because changes are it will be true so we
  //need not to update anything
  //if that's the case
  //feel free to go on top and change it to false
  //if chances are it is more likely to be false
  //should save a couple of bytes
  onAnswerCheckableChange(answerCheckable: boolean){
    if (answerCheckable !== this.state.answerCheckable){
      this.setState({answerCheckable});
    }

    this.props.onAnswerCheckableChange && this.props.onAnswerCheckableChange(answerCheckable);
  }
  render(){
    //The modifiers in use
    let modifiers:Array<string> = typeof this.props.modifiers === "string" ? [this.props.modifiers] : this.props.modifiers;
    const compositeReplies = this.props.compositeReplies || this.state.compositeRepliesInState

    //Setting this up
    let isHidden = this.props.material.hidden || (this.props.folder && this.props.folder.hidden);

    const materialPageType = this.props.material.assignmentType ? (this.props.material.assignmentType === "EXERCISE" ? "exercise" : "assignment") : "textual";
    let className = `material-page material-page--${materialPageType} ${(modifiers || []).map(s=>`material-page--${s}`).join(" ")} ${isHidden ? "material-page--hidden" : ""}`;
    if (compositeReplies && compositeReplies.state) {
      className += " material-page--" + compositeReplies.state;
    }

    let content = null;
    if (
      (this.props.loadCompositeReplies && this.state.compositeRepliesInStateLoaded) ||
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

    return <article className={className} ref="root" id={this.props.id}>
      {content}
    </article>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    status: state.status,
    websocket: state.websocket
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return bindActionCreators({updateAssignmentState, setWorkspaceMaterialEditorState,
    updateWorkspaceMaterialContentNode, displayNotification, requestWorkspaceMaterialContentNodeAttachments}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MaterialLoader);
