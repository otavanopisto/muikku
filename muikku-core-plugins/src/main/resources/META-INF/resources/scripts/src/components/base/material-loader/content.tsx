import * as React from "react";
import { MaterialLoaderProps } from "~/components/base/material-loader";
import Base from "~/components/base/material-loader/base";
import BinaryMaterialLoader from "~/components/base/material-loader/binary";
import i18n from "~/locales/i18n";

/**
 * MaterialLoaderContentProps
 */
interface MaterialLoaderContentProps extends MaterialLoaderProps {
  answersChecked: boolean;
  answersVisible: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stateConfiguration: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  answerRegistry: { [name: string]: any };
}

/**
 * stopPropagation
 * @param e e
 */
function stopPropagation(e: React.MouseEvent<HTMLDivElement>) {
  e.stopPropagation();
}

//This gets called once the material modified and the server comfirmed it was modified
/**
 * onConfirmedAndSyncedModification
 * @param props props
 */
function onConfirmedAndSyncedModification(props: MaterialLoaderContentProps) {
  //What we basically want to do this is because when the websocket gets called
  //the state gets changed to ANSWERED from UNANSWERED but our client side
  //tree is not aware of this change
  const compositeReplies = props.compositeReplies;
  //So we check if it is UNASWERED or has no reply in which case is unanswered too
  if (!compositeReplies || compositeReplies.state === "UNANSWERED") {
    //We make the call using true to avoid the server call since that would be redundant
    //We just want to make the answer answered and we know that it has been updated
    //already as the answer has been synced
    //that is why the true flag is there not to call the server
    props.updateAssignmentState(
      "ANSWERED",
      true,
      props.workspace.id,
      props.material.workspaceMaterialId,
      compositeReplies && compositeReplies.workspaceMaterialReplyId,
      props.stateConfiguration &&
        props.stateConfiguration["success-text"] !== undefined
        ? i18n.t(props.stateConfiguration["success-text"], { ns: "materials" })
        : undefined
    );
  }
}
//Gets called on any modification of the material task
/**
 * onModification
 * @param props props
 */
function onModification(props: MaterialLoaderContentProps) {
  //We use this function to basically modify the state with the modify state
  //Currently only used in exercises when the modify state sends them back to be answered
  const compositeReplies = props.compositeReplies;
  if (
    props.stateConfiguration &&
    props.stateConfiguration["modify-state"] &&
    (compositeReplies || { state: "UNANSWERED" }).state !==
      props.stateConfiguration["modify-state"]
  ) {
    //The modify state is forced in so we use false to call to the server
    props.updateAssignmentState(
      props.stateConfiguration["modify-state"],
      false,
      props.workspace.id,
      props.material.workspaceMaterialId,
      compositeReplies && compositeReplies.workspaceMaterialReplyId,
      props.stateConfiguration &&
        props.stateConfiguration["success-text"] !== undefined
        ? i18n.t(props.stateConfiguration["success-text"], { ns: "materials" })
        : undefined,
      props.onAssignmentStateModified
    );
  }
}

/**
 * MaterialLoaderContent
 * @param props props
 */
export function MaterialLoaderContent(props: MaterialLoaderContentProps) {
  let className = "material-page__content-wrapper";

  if (props.material.contentHiddenForUser) {
    className =
      "material-page__content material-page__content--view-restricted";
  }

  return (
    <>
      <div
        className={className}
        onClick={stopPropagation}
        lang={
          props.material.titleLanguage ||
          (props.folder && props.folder.titleLanguage) ||
          props.workspace.language
        }
      >
        {props.loadCompositeReplies &&
        typeof props.compositeReplies === "undefined" ? null : (
          <Base
            material={props.material}
            status={props.status}
            usedAs={props.usedAs}
            workspace={props.workspace}
            websocketState={props.websocket}
            onConfirmedAndSyncedModification={onConfirmedAndSyncedModification.bind(
              this,
              props
            )}
            onModification={onModification.bind(this, props)}
            compositeReplies={props.compositeReplies}
            displayCorrectAnswers={props.answersVisible}
            checkAnswers={props.answersChecked}
            onAnswerChange={props.onAnswerChange}
            onAnswerCheckableChange={props.onAnswerCheckableChange}
            invisible={props.invisible}
            readOnly={props.readOnly}
            answerable={props.answerable}
            answerRegistry={props.answerRegistry}
          />
        )}
      </div>

      {props.material.type === "binary" ? (
        <BinaryMaterialLoader
          material={props.material}
          invisible={props.invisible}
        />
      ) : null}
    </>
  );
}
