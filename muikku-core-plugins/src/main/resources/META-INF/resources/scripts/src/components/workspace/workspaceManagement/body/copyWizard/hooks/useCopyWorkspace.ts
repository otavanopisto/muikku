import * as React from "react";
import { useDispatch } from "react-redux";
import { copyCurrentWorkspace } from "~/actions/workspaces";
import { WorkspaceDataType } from "~/reducers/workspaces";
import { CopyCurrentWorkspaceStepType } from "~/actions/workspaces";
import moment from "moment";

/**
 * CopyWizardState
 */
export interface CopyWizardState {
  // Form data
  description: string;
  name: string;
  nameExtension?: string;
  beginDate: Date | null;
  endDate: Date | null;
  copyDiscussionAreas: boolean;
  copyMaterials: "NO" | "CLONE" | "LINK";
  copyBackgroundPicture: boolean;

  // UI state
  locked: boolean;

  // Result data
  resultingWorkspace?: WorkspaceDataType;

  // Wizard progress
  step?: CopyCurrentWorkspaceStepType;
}

/**
 * Hook for managing the state of the copy workspace wizard
 * @param workspace workspace
 */
export const useCopyWorkspaceWizardState = (workspace: WorkspaceDataType) => {
  const [state, setState] = React.useState<CopyWizardState>({
    // Form data
    description: workspace.description,
    name: workspace.name,
    nameExtension: workspace.nameExtension,
    beginDate:
      workspace.additionalInfo.beginDate !== null
        ? moment(workspace.additionalInfo.beginDate).toDate()
        : null,
    endDate:
      workspace.additionalInfo.endDate !== null
        ? moment(workspace.additionalInfo.endDate).toDate()
        : null,
    copyDiscussionAreas: false,
    copyMaterials: "CLONE",
    copyBackgroundPicture: true,

    // UI state
    locked: false,

    // Result data
    resultingWorkspace: undefined,

    // Wizard progress
    step: undefined,
  });

  /**
   * Update state
   * @param update update
   */
  const updateState = React.useCallback((update: Partial<CopyWizardState>) => {
    setState((prevState) => ({
      ...prevState,
      ...update,
    }));
  }, []);

  return {
    state,
    updateState,
  };
};

/**
 * Hook for managing the business logic of the copy workspace wizard
 * @param state state
 * @param updateState updateState
 */
export const useCopyWorkspaceWizardLogic = (
  state: CopyWizardState,
  updateState: (update: Partial<CopyWizardState>) => void
) => {
  const dispatch = useDispatch();

  /**
   * Copy workspace
   */
  const copyWorkspace = React.useCallback(() => {
    updateState({ locked: true });

    dispatch(
      copyCurrentWorkspace({
        description: state.description,
        name: state.name,
        nameExtension: state.nameExtension,
        beginDate:
          state.beginDate != null ? state.beginDate.toISOString() : null,
        endDate: state.endDate != null ? state.endDate.toISOString() : null,
        copyDiscussionAreas: state.copyDiscussionAreas,
        copyMaterials: state.copyMaterials,
        copyBackgroundPicture: state.copyBackgroundPicture,
        // eslint-disable-next-line jsdoc/require-jsdoc
        success: (step, workspace) => {
          // Update state
          updateState({
            step,
            ...(step === "done" ? { resultingWorkspace: workspace } : {}),
          });
        },
        // eslint-disable-next-line jsdoc/require-jsdoc
        fail: () => {
          updateState({ locked: false });
        },
      })
    );
  }, [dispatch, state, updateState]);

  return {
    copyWorkspace,
  };
};
