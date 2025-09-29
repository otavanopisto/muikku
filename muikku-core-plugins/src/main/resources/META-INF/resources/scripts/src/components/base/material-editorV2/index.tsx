/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react";
import "~/sass/elements/material-editor.scss";
import "~/sass/elements/form.scss";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setWorkspaceMaterialEditorState } from "~/actions/workspaces/material";
import { ButtonPill } from "~/components/general/button";
import Tabs, { Tab } from "~/components/general/tabs";
import { StateType } from "~/reducers";
import ConfirmPublishPageWithAnswersDialog from "../material-editorV2/confirm-publish-page-with-answers-dialog";
import ConfirmPublishPageWithLinkedMaterialDialog from "../material-editorV2/confirm-publish-page-with-linked-material-dialog";
import ConfirmRemovePageWithAnswersDialog from "../material-editorV2/confirm-remove-page-with-answers-dialog";
import ConfirmPublishRemovePageWithLinkedAnswersDialog from "../material-editorV2/confirm-remove-page-with-linked-answers-dialog";
import { getEditorStrategy } from "./editor-strategy";
import { PageLocation } from "~/@types/shared";

/**
 * Props for the new material editor
 */
interface MaterialEditorV2Props {
  locationPage?: PageLocation;
}

/**
 * New Material Editor V2 component
 * @param props - Props for the component
 * @returns New Material Editor V2 component
 */
export const MaterialEditorV2: React.FC<MaterialEditorV2Props> = (props) => {
  const [activeTab, setActiveTab] = useState("content");

  const dispatch = useDispatch();

  const editorState = useSelector(
    (state: StateType) => state.workspaces.materialEditor
  );

  const { opened, section, currentNodeValue } = editorState;

  const examEnabled = currentNodeValue?.exam ?? false;

  // Define entity type
  const entityType = section ? "section" : "material";

  // Get the appropriate strategy
  const strategy = getEditorStrategy(
    entityType,
    currentNodeValue?.exam ?? false
  );

  // Get tabs from strategy
  const editorTabs = strategy.getTabs(
    examEnabled,
    {
      canSetLicense: editorState.canSetLicense,
      canSetProducers: editorState.canSetProducers,
      canAddAttachments: editorState.canAddAttachments,
      canDelete: editorState.canDelete,
      canRevert: editorState.canRevert,
      canPublish: editorState.canPublish,
      canChangeExerciseType: editorState.canChangeExerciseType,
      canChangePageType: editorState.canChangePageType,
      canCopy: editorState.canCopy,
      canRestrictView: editorState.canRestrictView,
      canEditContent: editorState.canEditContent,
      canSetTitle: editorState.canSetTitle,
      canHide: editorState.canHide,
    },
    props.locationPage
  );

  /**
   * Handle tab change
   * @param tabId - Id of the tab
   */
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
  };

  /**
   * Handle close button click
   */
  const onClickClose = () => {
    dispatch(
      setWorkspaceMaterialEditorState({
        ...editorState,
        opened: false,
      })
    );
    setActiveTab("content");
  };

  /**
   * Handle delete success
   */
  const onDeleteSuccess = () => {
    console.log("onDeleteSuccess");
  };

  // Convert our EditorTab format to Tabs component format
  const tabsForTabsComponent: Tab[] = editorTabs.map((tab) => ({
    id: tab.id,
    type: "material-editor",
    mobileAction: (
      <ButtonPill
        buttonModifiers={[
          "material-page-close-editor",
          "material-page-close-mobile-editor",
        ]}
        onClick={onClickClose}
        icon="arrow-left"
      />
    ),
    name: tab.name,
    component: tab.component,
  }));

  return (
    <div
      className={`material-editor ${opened ? "material-editor--visible" : ""}`}
    >
      <Tabs
        modifier="material-editor"
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabs={tabsForTabsComponent}
      >
        <ButtonPill
          buttonModifiers="material-page-close-editor"
          onClick={onClickClose}
          icon="arrow-left"
        />
      </Tabs>
      <ConfirmPublishPageWithAnswersDialog />
      <ConfirmRemovePageWithAnswersDialog onDeleteSuccess={onDeleteSuccess} />
      <ConfirmPublishPageWithLinkedMaterialDialog />
      <ConfirmPublishRemovePageWithLinkedAnswersDialog />
    </div>
  );
};
