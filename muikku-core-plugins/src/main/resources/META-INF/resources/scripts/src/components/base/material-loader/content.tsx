import * as React from 'react';
import { MaterialLoaderProps } from '~/components/base/material-loader';
import Base from '~/components/base/material-loader/base';
import BinaryMaterialLoader from '~/components/base/material-loader/binary';

interface MaterialLoaderContentProps extends MaterialLoaderProps {
  answersChecked: boolean,
  answersVisible: boolean,
  stateConfiguration: any,
}

function stopPropagation(e: React.MouseEvent<HTMLDivElement>) {
  e.stopPropagation();
}

//This gets called once the material modified and the server comfirmed it was modified
function onConfirmedAndSyncedModification(props: MaterialLoaderContentProps){
  //What we basically want to do this is because when the websocket gets called
  //the state gets changed to ANSWERED from UNANSWERED but our client side
  //tree is not aware of this change
  let compositeReplies = props.compositeReplies;
  //So we check if it is UNASWERED or has no reply in which case is unanswered too
  if (!compositeReplies || compositeReplies.state === "UNANSWERED"){
    //We make the call using true to avoid the server call since that would be redundant
    //We just want to make the answer answered and we know that it has been updated
    //already as the answer has been synced
    //that is why the true flag is there not to call the server
    props.updateAssignmentState("ANSWERED", true,
        props.workspace.id, props.material.workspaceMaterialId, compositeReplies && compositeReplies.workspaceMaterialReplyId,
        props.stateConfiguration['success-text'] && props.i18n.text.get(props.stateConfiguration['success-text']));
  }
}
//Gets called on any modification of the material task
function onModification(props: MaterialLoaderContentProps){
  //We use this function to basically modify the state with the modify state
  //Currently only used in exercises when the modify state sends them back to be answered
  let compositeReplies = props.compositeReplies;
  if (props.stateConfiguration && props.stateConfiguration['modify-state'] &&
      (compositeReplies || {state: "UNANSWERED"}).state !== props.stateConfiguration['modify-state']){
    //The modify state is forced in so we use false to call to the server
    props.updateAssignmentState(props.stateConfiguration['modify-state'], false,
        props.workspace.id, props.material.workspaceMaterialId, compositeReplies && compositeReplies.workspaceMaterialReplyId,
        props.stateConfiguration['success-text'] && props.i18n.text.get(props.stateConfiguration['success-text']), props.onAssignmentStateModified);
  }
}

export function MaterialLoaderContent(props: MaterialLoaderContentProps) {
  if (props.isViewRestricted) {
    return (<div className="react-required-container">
      <div className="material-page__content material-page__content--view-restricted" onClick={stopPropagation}>
      {props.i18n.text.get("plugin.workspace.materialViewRestricted")}
    </div>
  </div>);
  }
  return (<div className="react-required-container">
    <div className="react-required-container" onClick={stopPropagation}>
      {
        props.loadCompositeReplies && typeof props.compositeReplies === "undefined" ? null :
          <Base material={props.material} i18n={props.i18n} status={props.status}
            workspace={props.workspace} websocket={props.websocket} onConfirmedAndSyncedModification={onConfirmedAndSyncedModification.bind(this, props)}
            onModification={onModification.bind(this, props)}
            readOnly={props.readOnly || (props.answerable && props.stateConfiguration && props.stateConfiguration['fields-read-only'])}
            compositeReplies={props.compositeReplies} displayCorrectAnswers={props.answersVisible}
            checkAnswers={props.answersChecked} onAnswerChange={props.onAnswerChange} onAnswerCheckableChange={props.onAnswerCheckableChange}
            invisible={props.invisible} answerable={props.answerable}/>
       }
    </div>
    {
      props.material.type === "binary" ?
      <BinaryMaterialLoader material={props.material} i18n={props.i18n}/> : null
    }
  </div>);
}
