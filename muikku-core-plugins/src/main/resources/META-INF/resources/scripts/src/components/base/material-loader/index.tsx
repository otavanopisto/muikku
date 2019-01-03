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

interface MaterialLoaderProps {
  material: MaterialContentNodeType,
  workspace: WorkspaceType,
  i18n: i18nType,
  status: StatusType,
  modifiers?: string | Array<string>,
  id?: string,
  websocket: WebsocketStateType,

  loadCompositeReplies?: boolean,
  readOnly?: boolean,
  compositeReplies?: MaterialCompositeRepliesType
}

interface MaterialLoaderState {
  compositeReplies: MaterialCompositeRepliesType
}

let materialRepliesCache:{[key: string]: any} = {};
let compositeRepliesCache:{[key: string]: MaterialCompositeRepliesType} = {};

class MaterialLoader extends React.Component<MaterialLoaderProps, MaterialLoaderState> {
  constructor(props: MaterialLoaderProps){
    super(props);

    this.stopPropagation = this.stopPropagation.bind(this);

    this.state = {
      compositeReplies: null
    }
  }
  componentDidMount(){
    this.create();
  }
  stopPropagation(e: React.MouseEvent<HTMLDivElement>){
    e.stopPropagation();
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

        materialRepliesCache[this.props.workspace.id + "-" + this.props.material.assignment.id] = compositeReplies;

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
        <Base material={this.props.material} i18n={this.props.i18n} status={this.props.status}
         workspace={this.props.workspace} websocket={this.props.websocket}
         readOnly={this.props.readOnly} compositeReplies={this.props.compositeReplies || this.state.compositeReplies}/>
      </div>
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
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MaterialLoader);