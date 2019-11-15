import * as React from "react";
import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";

import MaterialLoader from "~/components/base/material-loader";
import { MaterialContentNodeType, WorkspaceType, MaterialCompositeRepliesType, WorkspaceEditModeStateType } from "~/reducers/workspaces";
import { MaterialLoaderEditorButtonSet } from "~/components/base/material-loader/editor-buttonset";
import { MaterialLoaderTitle } from "~/components/base/material-loader/title";
import { MaterialLoaderContent } from "~/components/base/material-loader/content";
import { MaterialLoaderProducersLicense } from "~/components/base/material-loader/producers-license";
import { MaterialLoaderButtons } from "~/components/base/material-loader/buttons";
import { MaterialLoaderCorrectAnswerCounter } from "~/components/base/material-loader/correct-answer-counter";
import { MaterialLoaderAssesment } from "~/components/base/material-loader/assesment";
import { MaterialLoaderGrade } from "~/components/base/material-loader/grade";
import { MaterialLoaderDate } from "~/components/base/material-loader/date";
import LazyLoader from "~/components/general/lazy-loader";

interface HelpMaterialProps {
  i18n: i18nType,
  workspaceEditMode: WorkspaceEditModeStateType,
  materialContentNode: MaterialContentNodeType,
  workspace: WorkspaceType,
}

interface HelpMaterialState {
}

class HelpMaterial extends React.Component<HelpMaterialProps, HelpMaterialState> {
  constructor(props: HelpMaterialProps){
    super(props);
  }
  render(){
    const isAssignment = this.props.materialContentNode.assignmentType === "EVALUATED";
    const isBinary = this.props.materialContentNode.type === "binary";

    return <LazyLoader useChildrenAsLazy={true} className="material-lazy-loader-container">
      {(loaded: boolean) => {
        return <MaterialLoader editable={this.props.workspaceEditMode.active}
        modifiers="workspace-help" material={this.props.materialContentNode} workspace={this.props.workspace}
        canHide disablePlugins readOnly canRevert={!isBinary} canCopy={!isBinary}
        canDelete canRestrictView canChangePageType={!isBinary}
        canSetLicense={!isBinary} canSetProducers={!isBinary}
        canAddAttachments={!isBinary} canEditContent={!isBinary}
        invisible={!loaded} canPublish={!isBinary}>
          {(props, state, stateConfiguration) => {
            return <div>
              <MaterialLoaderEditorButtonSet {...props} {...state}/>
              <MaterialLoaderTitle {...props} {...state}/>
              <MaterialLoaderContent {...props} {...state} stateConfiguration={stateConfiguration}/>
              <MaterialLoaderProducersLicense {...props} {...state}/>
            </div>
          }}
        </MaterialLoader>
      }}
    </LazyLoader>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    workspaceEditMode: state.workspaces.editMode,
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(HelpMaterial);