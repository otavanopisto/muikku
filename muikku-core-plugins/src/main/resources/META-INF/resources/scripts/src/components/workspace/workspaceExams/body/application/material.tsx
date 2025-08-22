/* eslint-disable jsdoc/require-jsdoc */
import * as React from "react";
import { StateType } from "~/reducers";
import { useSelector } from "react-redux";
import {
  MaterialContentNodeWithIdAndLogic,
  WorkspaceDataType,
} from "~/reducers/workspaces";
import { MaterialLoaderTitle } from "~/components/base/material-loaderV2/components/title";
import { MaterialLoaderContent } from "~/components/base/material-loaderV2/components/content";
import { MaterialLoaderButtons } from "~/components/base/material-loaderV2/components/buttons";
import LazyLoader from "~/components/general/lazy-loader";
import MaterialLoaderV2 from "~/components/base/material-loaderV2";
import { STATE_CONFIGS } from "~/components/base/material-loaderV2/state/StateConfig";
import { createMaterialsProvider } from "~/components/base/material-loaderV2/providers/MaterialsProvider";

/**
 * WorkspaceMaterialProps
 */
interface ExamMaterialProps {
  materialContentNode: MaterialContentNodeWithIdAndLogic;
  folder: MaterialContentNodeWithIdAndLogic;
  workspace: WorkspaceDataType;
  anchorItem?: JSX.Element;
  readspeakerComponent?: JSX.Element;
}

/**
 * WorkspaceMaterial
 * @param props props
 */
const ExamMaterial = (props: ExamMaterialProps) => {
  const { materialContentNode, folder, workspace } = props;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const status = useSelector((state: StateType) => state.status);

  const dataProvider = createMaterialsProvider({
    folder: {
      ...folder,
      contentVersion: "ckeditor4",
    },
    material: {
      ...materialContentNode,
      contentVersion: "ckeditor4",
      assignment: materialContentNode.assignment,
      evaluation: materialContentNode.evaluation,
    },
    workspace: {
      id: workspace.id,
      urlName: workspace.urlName,
      language: workspace.language,
    },
    userId: status.userId,
    context: {
      tool: "exams",
      contextPath: "",
    },
    editorPermissions: {
      editable: false,
      canPublish: false,
      canRevert: false,
      canCopy: false,
      canHide: false,
      canDelete: false,
      canRestrictView: false,
      canChangePageType: false,
      canChangeExerciseType: false,
      canSetLicense: false,
      canSetProducers: false,
      canAddAttachments: false,
      canEditContent: false,
      canSetTitle: false,
      disablePlugins: false,
    },
    currentState: "INCOMPLETE",
    assignmentType: materialContentNode.assignmentType,
    canEdit: false,
    canSubmit: false,
    canViewAnswers: false,
    fields: [],
    answers: [],
    onFieldChange: () => {},
    onSubmit: () => Promise.resolve(),
    onModify: () => Promise.resolve(),
  });

  return (
    <LazyLoader
      useChildrenAsLazy={true}
      className="material-lazy-loader-container"
    >
      {(loaded: boolean) => (
        <MaterialLoaderV2
          dataProvider={dataProvider}
          stateConfigs={STATE_CONFIGS}
          websocket={null}
          invisible={!loaded}
        >
          {(props, state, stateConfiguration) => (
            <div>
              <MaterialLoaderTitle {...props} {...state} />
              <MaterialLoaderContent
                {...props}
                {...state}
                dataProvider={dataProvider}
              />

              <div className="material-page__de-floater"></div>

              <MaterialLoaderButtons
                {...props}
                {...state}
                stateConfiguration={stateConfiguration}
              />
            </div>
          )}
        </MaterialLoaderV2>
      )}
    </LazyLoader>
  );
};

export default ExamMaterial;
