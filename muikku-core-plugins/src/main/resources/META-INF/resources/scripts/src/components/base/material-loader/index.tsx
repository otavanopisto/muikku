//NOTE this is a sandbox file, because the code in the material loader is so complex I created this self contained
//blackbox environment that makes it so that the material loader behaves like one component, this is bad because
//it does not have the same capabilities and efficiency as the other components, and cannot be easily modified
//please remove it

import * as React from 'react';
import Base from './base';

//TODO add the scss files that are necessary to render this material page correctly...
//this file is temporary use it to dump the content from the deprecated scss files that are necessary
import "~/sass/elements/__ugly-material-loader-deprecated-file-mashup.scss";

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
import Button from '~/components/general/button';
import { bindActionCreators } from 'redux';
import { UpdateEvaluatedAssignmentStateTriggerType, updateEvaluatedAssignmentState } from '~/actions/workspaces';
import equals = require("deep-equal");

const STATES = [{
  'assignment-type': 'EXERCISE',
  'state': ['UNANSWERED', 'ANSWERED'],
  'button-class': 'muikku-check-exercises',
  'button-text': "plugin.workspace.materialsLoader.sendExerciseButton",
  'button-check-text': "plugin.workspace.materialsLoader.checkExerciseButton",
  'button-disabled': false,
  'success-state': 'SUBMITTED',
  'fields-read-only': false
}, {
  'assignment-type': 'EXERCISE',
  'state': ['SUBMITTED', 'PASSED', 'FAILED', 'INCOMPLETE'],
  'check-answers': true,
  'button-class': 'muikku-check-exercises',
  'button-text': "plugin.workspace.materialsLoader.exerciseSentButton",
  'button-check-text': "plugin.workspace.materialsLoader.exerciseCheckedButton",
  'button-disabled': false,
  'success-state': 'SUBMITTED',
  'fields-read-only': false,
  'show-answers-button-visible': true
}, {
  'assignment-type': 'EVALUATED',
  'state': ['UNANSWERED', 'ANSWERED'],
  'button-class': 'muikku-submit-assignment',
  'button-text': "plugin.workspace.materialsLoader.submitAssignmentButton",
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
  workspace: WorkspaceType,
  i18n: i18nType,
  status: StatusType,
  modifiers?: string | Array<string>,
  id?: string,
  websocket: WebsocketStateType,
  answerable?: boolean,
  onAnswerPushed?: ()=>any

  loadCompositeReplies?: boolean,
  readOnly?: boolean,
  compositeReplies?: MaterialCompositeRepliesType,
  
  updateEvaluatedAssignmentState: UpdateEvaluatedAssignmentStateTriggerType
}

interface MaterialLoaderState {
  compositeReplies: MaterialCompositeRepliesType
}

let materialRepliesCache:{[key: string]: any} = {};
let compositeRepliesCache:{[key: string]: MaterialCompositeRepliesType} = {};

//Treat this class with care it uses a lot of hacks to be efficient
//The compositeReplies which answers are ignored and only used for setting the initial replies
//Overall there are a ton of hacks for making it fast
//So try only to update the composite replies only, however any changes will be ignored by the field themselves and used only on purposes of
//updating the layout and whatnot basically here, down the line all changes are scraped, base never ever updates
//and the field never changes its state, a change in the content of the field, can destroy it and break the page
//you can add styles here but don't mess up with the low level rendering
class MaterialLoader extends React.Component<MaterialLoaderProps, MaterialLoaderState> {
  private stateConfiguration:any;
  constructor(props: MaterialLoaderProps){
    super(props);

    this.stopPropagation = this.stopPropagation.bind(this);

    this.state = {
      compositeReplies: null
    }
    
    this.onConfirmedAndSyncedModification = this.onConfirmedAndSyncedModification.bind(this);
    this.onPushAnswer = this.onPushAnswer.bind(this);
    
    if (props.answerable && props.material){
      this.stateConfiguration = STATES.filter((state:any)=>{
        return state['assignment-type'] === props.material.assignmentType;
      }).find((state:any)=>{
        let stateRequired = (props.compositeReplies && props.compositeReplies.state) || "UNANSWERED";
        let statesInIt = state['state'];
        return statesInIt === stateRequired || ((statesInIt instanceof Array) && statesInIt.includes(stateRequired));
      });
    }
  }
  componentDidMount(){
    this.create();
  }
  stopPropagation(e: React.MouseEvent<HTMLDivElement>){
    e.stopPropagation();
  }
  componentWillUpdate(nextProps: MaterialLoaderProps, nextState: MaterialLoaderState){
    if (nextProps.answerable && nextProps.material){
      this.stateConfiguration = STATES.filter((state:any)=>{
        return state['assignment-type'] === nextProps.material.assignmentType;
      }).find((state:any)=>{
        let compositeReplies = nextProps.compositeReplies || nextState.compositeReplies;
        let stateRequired = (compositeReplies && compositeReplies.state) || "UNANSWERED";
        let statesInIt = state['state'];
        return statesInIt === stateRequired || ((statesInIt instanceof Array) && statesInIt.includes(stateRequired));
      });
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
  onPushAnswer(){
    if (this.stateConfiguration['assignment-type'] === "EXERCISE"){
      alert("NOT IMPLEMENTED");
    } else {
      this.props.updateEvaluatedAssignmentState(this.stateConfiguration['success-state'],
          this.props.workspace.id, this.props.material.workspaceMaterialId, this.props.compositeReplies && this.props.compositeReplies.workspaceMaterialReplyId,
          this.stateConfiguration['success-text'] && this.props.i18n.text.get(this.stateConfiguration['success-text']), this.props.onAnswerPushed);
    }
  }
  onConfirmedAndSyncedModification(){
    if (this.stateConfiguration['assignment-type'] === "EXERCISE"){
      alert("NOT IMPLEMENTED");
    } else {
      if (!this.props.compositeReplies || this.props.compositeReplies.state === "UNANSWERED"){
        this.props.updateEvaluatedAssignmentState("ANSWERED",
            this.props.workspace.id, this.props.material.workspaceMaterialId, this.props.compositeReplies && this.props.compositeReplies.workspaceMaterialReplyId,
            this.stateConfiguration['success-text'] && this.props.i18n.text.get(this.stateConfiguration['success-text']));
      }
    }
  }
  render(){
    //TODO remove this __deprecated container once things are done and classes are cleared up, or just change the classname to something
    //more reasonable
    let modifiers:Array<string> = typeof this.props.modifiers === "string" ? [this.props.modifiers] : this.props.modifiers;
    return <div className={`material-page ${(modifiers || []).map(s=>`material-page--${s}`).join(" ")} rich-text`} ref="root" id={this.props.id}>
      {this.props.material.evaluation && this.props.material.evaluation.verbalAssessment ?
          <div className="">
            <div className="application-sub-panel__text application-sub-panel__text--task-evaluation rich-text" dangerouslySetInnerHTML={{__html: this.props.material.evaluation.verbalAssessment}}></div>
          </div>
       : null}
      <div className="" onClick={this.stopPropagation}>
        {this.props.loadCompositeReplies && typeof this.state.compositeReplies === "undefined" ? null :
         <Base material={this.props.material} i18n={this.props.i18n} status={this.props.status}
          workspace={this.props.workspace} websocket={this.props.websocket} onConfirmedAndSyncedModification={this.onConfirmedAndSyncedModification}
          readOnly={this.props.readOnly || (this.props.answerable && this.stateConfiguration && this.stateConfiguration['fields-read-only'])} compositeReplies={this.props.compositeReplies || this.state.compositeReplies}/>
         }
      </div>
      {this.props.answerable && this.stateConfiguration && !this.stateConfiguration['button-disabled']? <div className="material-page-answers-buttons">
        <Button buttonModifiers={this.stateConfiguration['button-class']}
        onClick={this.onPushAnswer}>{this.props.i18n.text.get(this.stateConfiguration['button-text'])}</Button>
      </div> : null}
      {this.props.material.license ?
        <div className="license">{this.props.i18n.text.get("plugin.workspace.materials.licenseLabel")}: {this.props.material.license}</div> : null}
    </div>
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
  return bindActionCreators({updateEvaluatedAssignmentState}, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MaterialLoader);