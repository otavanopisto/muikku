//NOTE this is a sandbox file, because the code in the material loader is so complex I created this self contained
//blackbox environment that makes it so that the material loader behaves like one component, this is bad because
//it does not have the same capabilities and efficiency as the other components, and cannot be easily modified
//please remove it

import * as React from 'react';
import Base from './base';

import $ from '~/lib/jquery';
import mApi from '~/lib/mApi';
import { WorkspaceType, MaterialContentNodeType, MaterialCompositeRepliesType } from '~/reducers/workspaces';
import promisify from '~/util/promisify';

import '~/sass/elements/rich-text.scss';
import { i18nType } from '~/reducers/base/i18n';
import { StatusType } from '~/reducers/base/status';
import { StateType } from '~/reducers';
import { Dispatch, connect } from 'react-redux';
import { WebsocketStateType } from '~/reducers/util/websocket';
import Button, { ButtonPill } from '~/components/general/button';
import { bindActionCreators } from 'redux';
import { UpdateAssignmentStateTriggerType, updateAssignmentState,
  setWorkspaceMaterialEditorState, SetWorkspaceMaterialEditorStateTriggerType } from '~/actions/workspaces';
import equals = require("deep-equal");
import Dropdown from "~/components/general/dropdown"; 

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

interface MaterialLoaderProps {
  material: MaterialContentNodeType,
  page?: MaterialContentNodeType,
  
  workspace: WorkspaceType,
  i18n: i18nType,
  status: StatusType,
  modifiers?: string | Array<string>,
  id?: string,
  websocket: WebsocketStateType,
  
  //Whether or not the thing can be answered
  //and then it will use the state configuration
  answerable?: boolean,
  
  //Edition mode, should only be available to admins
  editable?: boolean,
  
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
}

interface MaterialLoaderState {
  //Composite replies as loaded when using loadCompositeReplies boolean
  compositeReplies: MaterialCompositeRepliesType,
  
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
//So try only to updnullnullate the composite replies only, however any changes will be ignored by the field themselves and used only on purposes of
//updating the layout and whatnot basically here, down the line all changes are scraped, base never ever updates
//and the field never changes its state, a change in the content of the field, can destroy it and break the page
//you can add styles here but don't mess up with the low level rendering
class MaterialLoader extends React.Component<MaterialLoaderProps, MaterialLoaderState> {
  private stateConfiguration:any;
  private answerRegistrySync: {[name: string]: any};
  
  constructor(props: MaterialLoaderProps){
    super(props);

    //stop propagation of clicks
    this.stopPropagation = this.stopPropagation.bind(this);

    //initial state has no composite replies and the asnwers are not visible or checked
    let state:MaterialLoaderState = {
      compositeReplies: null,
      answersVisible: false,
      answersChecked: false,
      
      //assume true, as it is usually true; this is
      //basically only in used for exercises to show button-check-text instead
      //of just the normal text that doesn't check
      answerCheckable: true,
      
      //The rightness registry start empty
      answerRegistry: {}
    };
    
    //A sync version of the righness registry, it can change so fast
    //setStates might stack
    this.answerRegistrySync = {};
    
    this.onConfirmedAndSyncedModification = this.onConfirmedAndSyncedModification.bind(this);
    this.onModification = this.onModification.bind(this);
    this.onPushAnswer = this.onPushAnswer.bind(this);
    this.toggleAnswersVisible = this.toggleAnswersVisible.bind(this);
    this.onAnswerChange = this.onAnswerChange.bind(this);
    this.onAnswerCheckableChange = this.onAnswerCheckableChange.bind(this);
    this.startupEditor = this.startupEditor.bind(this);
    
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
  stopPropagation(e: React.MouseEvent<HTMLDivElement>){
    e.stopPropagation();
  }
  startupEditor(){
    this.props.setWorkspaceMaterialEditorState({
      currentNodeValue: this.props.material,
      parentNodeValue: this.props.page,
      workspace: this.props.workspace,
      section: false,
      opened: true,
    });
  }
  componentWillUpdate(nextProps: MaterialLoaderProps, nextState: MaterialLoaderState){
    //if the component will update we need to do some changes if it's gonna be answerable
    //and there's a material
    if (nextProps.answerable && nextProps.material){
      //we get the composite replies
      let compositeReplies = nextProps.compositeReplies || nextState.compositeReplies;
      
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
      let compositeReplies:MaterialCompositeRepliesType = compositeRepliesCache[this.props.workspace.id + "-" + this.props.material.assignment.id];
      if (!compositeReplies){
        compositeReplies = (await promisify(mApi().workspace.workspaces.materials.compositeMaterialReplies
            .read(this.props.workspace.id, this.props.material.assignment.id,
                {userEntityId: (window as any).MUIKKU_LOGGED_USER_ID}), 'callback')()) as MaterialCompositeRepliesType;

        materialRepliesCache[this.props.workspace.id + "-" + this.props.material.assignment.id] = compositeReplies || null;

        setTimeout(()=>{
          delete compositeRepliesCache[this.props.workspace.id + "-" + this.props.material.assignment.id];
        }, 60000);
      }

      this.setState({
        compositeReplies
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
      let compositeReplies = (this.props.compositeReplies || this.state.compositeReplies);
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
  }
  //This gets called once the material modified and the server comfirmed it was modified
  onConfirmedAndSyncedModification(){
    //What we basically want to do this is because when the websocket gets called
    //the state gets changed to ANSWERED from UNANSWERED but our client side
    //tree is not aware of this change
    let compositeReplies = (this.props.compositeReplies || this.state.compositeReplies);
    //So we check if it is UNASWERED or has no reply in which case is unanswered too
    if (!compositeReplies || compositeReplies.state === "UNANSWERED"){
      //We make the call using true to avoid the server call since that would be redundant
      //We just want to make the answer answered and we know that it has been updated
      //already as the answer has been synced
      //that is why the true flag is there not to call the server
      this.props.updateAssignmentState("ANSWERED", true,
          this.props.workspace.id, this.props.material.workspaceMaterialId, compositeReplies && compositeReplies.workspaceMaterialReplyId,
          this.stateConfiguration['success-text'] && this.props.i18n.text.get(this.stateConfiguration['success-text']));
    }
  }
  //Gets called on any modification of the material task
  onModification(){
    //We use this function to basically modify the state with the modify state
    //Currently only used in exercises when the modify state sends them back to be answered
    let compositeReplies = (this.props.compositeReplies || this.state.compositeReplies);
    if (this.stateConfiguration['modify-state'] &&
        (compositeReplies || {state: "UNANSWERED"}).state !== this.stateConfiguration['modify-state']){
      //The modify state is forced in so we use false to call to the server
      this.props.updateAssignmentState(this.stateConfiguration['modify-state'], false,
          this.props.workspace.id, this.props.material.workspaceMaterialId, compositeReplies && compositeReplies.workspaceMaterialReplyId,
          this.stateConfiguration['success-text'] && this.props.i18n.text.get(this.stateConfiguration['success-text']), this.props.onAssignmentStateModified);
    }
  }
  //Toggles answers visible or not
  toggleAnswersVisible(){
    this.setState({
      answersVisible: !this.state.answersVisible
    });
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
  }
  render(){
    //The modifiers in use
    let modifiers:Array<string> = typeof this.props.modifiers === "string" ? [this.props.modifiers] : this.props.modifiers;

    //Setting this up
    let materialType = this.props.material.assignmentType ? (this.props.material.assignmentType === "EXERCISE" ? "exercise" : "assignment") : "textual";
    let isHidden = this.props.material.hidden || this.props.page.hidden;
    return <article className={`material-page material-page--${materialType} ${(modifiers || []).map(s=>`material-page--${s}`).join(" ")} ${isHidden ? "material-page--hidden" : ""}`} ref="root" id={this.props.id}>
      {this.props.editable ? <div className="material-page__admin-panel">
        <ButtonPill buttonModifiers="material-management" icon="edit" onClick={this.startupEditor}/>
        <ButtonPill buttonModifiers="material-management" icon="content_copy"/>
        <ButtonPill buttonModifiers="material-management" icon="hide"/>
        <ButtonPill buttonModifiers="material-management" icon="show"/>
        <ButtonPill buttonModifiers="material-management" icon="closed-material"/>
      </div> : null}
      <h2  className={`material-page__title material-page__title--${materialType}`}>{this.props.material.title} </h2>
      <div className="react-required-container" onClick={this.stopPropagation}>
        {this.props.loadCompositeReplies && typeof this.state.compositeReplies === "undefined" ? null :
         <Base material={this.props.material} i18n={this.props.i18n} status={this.props.status}
          workspace={this.props.workspace} websocket={this.props.websocket} onConfirmedAndSyncedModification={this.onConfirmedAndSyncedModification}
          onModification={this.onModification}
          readOnly={this.props.readOnly || (this.props.answerable && this.stateConfiguration && this.stateConfiguration['fields-read-only'])}
          compositeReplies={this.props.compositeReplies || this.state.compositeReplies} displayCorrectAnswers={this.state.answersVisible}
          checkAnswers={this.state.answersChecked} onAnswerChange={this.onAnswerChange} onAnswerCheckableChange={this.onAnswerCheckableChange}/>
         }
      </div>
      {this.props.answerable && this.stateConfiguration ? <div className="material-page__buttonset">
        {!this.stateConfiguration['button-disabled'] ? <Button buttonModifiers={this.stateConfiguration['button-class']}
          onClick={this.onPushAnswer}>{this.props.i18n.text.get(this.state.answerCheckable ?
            this.stateConfiguration['button-check-text'] : this.stateConfiguration['button-text'])}</Button> : null}
        {this.stateConfiguration['displays-hide-show-answers-on-request-button-if-allowed'] &&
          this.props.material.correctAnswers === "ON_REQUEST" ? <Button 
            buttonModifiers="muikku-show-correct-answers-button" onClick={this.toggleAnswersVisible}>
            {this.props.i18n.text.get(this.state.answersVisible ? "plugin.workspace.materialsLoader.hideAnswers" : "plugin.workspace.materialsLoader.showAnswers")}
          </Button> : null}
      </div> : null}
      {this.state.answersChecked && Object.keys(this.state.answerRegistry).length ? <div className="material-page__correct-answers">
        <span className="material-page__correct-answers-label">{this.props.i18n.text.get("plugin.workspace.materialsLoader.correctAnswersCountLabel")}</span>
        <span className="material-page__correct-answers-data">
          {Object.keys(this.state.answerRegistry).filter((key)=>this.state.answerRegistry[key]).length} / {Object.keys(this.state.answerRegistry).length}
        </span>
      </div> : null}
      {this.props.material.evaluation && this.props.material.evaluation.verbalAssessment ?
        <div className="material-page__verbal-assessment">
          <div className="rich-text" dangerouslySetInnerHTML={{__html: this.props.material.evaluation.verbalAssessment}}></div>
        </div>
     : null}
      {this.props.material.producers ?
        <div className="material-page__producers">{this.props.i18n.text.get("plugin.workspace.materials.producersLabel")}: {this.props.material.producers}</div> : null}
      {this.props.material.license ?
        <div className="material-page__license">{this.props.i18n.text.get("plugin.workspace.materials.licenseLabel")}: {this.props.material.license}</div> : null}
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
  return bindActionCreators({updateAssignmentState, setWorkspaceMaterialEditorState}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MaterialLoader);