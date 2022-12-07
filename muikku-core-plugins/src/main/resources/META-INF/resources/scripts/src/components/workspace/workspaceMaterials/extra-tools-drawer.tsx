import * as React from "react";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
import { AnyActionType } from "~/actions";
import { IconButton } from "~/components/general/button";
import NoteBook from "~/components/general/note-book/note-book";
import Tabs, { Tab } from "~/components/general/tabs";
import { StateType } from "~/reducers";
import { WorkspaceMaterialExtraTools } from "~/reducers/workspaces";
import {
  MaterialShowOrHideExtraToolsTriggerType,
  materialShowOrHideExtraTools,
} from "../../../actions/workspaces/material";
import {
  DndProvider,
  MouseTransition,
  MultiBackendOptions,
  TouchTransition,
} from "react-dnd-multi-backend";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";

export const HTML5toTouch: MultiBackendOptions = {
  backends: [
    {
      id: "html5",
      backend: HTML5Backend,
      transition: MouseTransition,
    },
    {
      id: "touch",
      backend: TouchBackend,
      options: { enableMouseEvents: true },
      preview: true,
      transition: TouchTransition,
    },
  ],
};

/**
 * SlideDrawerProps
 */
export interface MaterialExtraToolDrawerProps {
  disableClose?: boolean;
  closeIconModifiers?: string[];
  modifiers?: string[];
  materialExtraTools: WorkspaceMaterialExtraTools;
  materialShowOrHideExtraTools: MaterialShowOrHideExtraToolsTriggerType;
}

const defaultProps = {
  showWarning: false,
  disableCloseButtons: false,
};

type ToolTab = "notebook" | "journal";

/**
 * SlideDrawer
 *
 * @param props props
 * @returns JSX.Element
 */
const MaterialExtraToolDrawer: React.FC<MaterialExtraToolDrawerProps> = (
  props
) => {
  props = { ...defaultProps, ...props };

  const [activeTab, setActiveTab] = React.useState<ToolTab>("notebook");

  const {
    materialExtraTools,
    materialShowOrHideExtraTools,
    closeIconModifiers,
    modifiers,
    disableClose,
  } = props;

  /**
   * handleCloseDrawerClick
   */
  const handleCloseDrawerClick = () => {
    materialShowOrHideExtraTools();
  };

  /**
   * handleActiveTabChange
   * @param tab change to
   */
  const handleActiveTabChange = (tab: ToolTab) => {
    setActiveTab(tab);
  };

  const materialEditorTabs: Tab[] = [
    {
      id: "notebook",
      type: "material-editor",
      name: "Muistiinpanot",
      component: <NoteBook />,
    },
    {
      id: "journals",
      type: "material-editor",
      name: "Päiväkirja",
      component: (
        <div>
          <h1>Päiväkirjamerkinnät</h1>
        </div>
      ),
    },
  ];

  let drawerClasses = "evaluation-modal__evaluate-drawer";

  if (materialExtraTools.opened) {
    drawerClasses = "evaluation-modal__evaluate-drawer state-OPEN";
  }

  return (
    <DndProvider options={HTML5toTouch}>
      <section
        className={`${drawerClasses} ${
          modifiers
            ? modifiers
                .map((m) => `evaluation-modal__evaluate-drawer--${m}`)
                .join(" ")
            : ""
        }`}
      >
        <header className="evaluation-modal__evaluate-drawer-header">
          <div className="evaluation-modal__evaluate-drawer-header-title">
            Lisäpaneelin työkalut
          </div>
          <IconButton
            onClick={handleCloseDrawerClick}
            disabled={disableClose}
            buttonModifiers={closeIconModifiers}
            icon="arrow-right"
          />
        </header>
        <div className="evaluation-modal__evaluate-drawer-content evaluation-modal__evaluate-drawer-content--workspace">
          {materialExtraTools.opened ? (
            <Tabs
              renderAllComponents={true}
              modifier="material-editor"
              activeTab={activeTab}
              onTabChange={handleActiveTabChange}
              tabs={materialEditorTabs}
            />
          ) : null}
        </div>
      </section>
    </DndProvider>
  );
};

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    materialExtraTools: state.workspaces.materialExtraTools,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    {
      materialShowOrHideExtraTools,
    },
    dispatch
  );
}

MaterialExtraToolDrawer.displayName = "MaterialExtraToolDrawer";

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(MaterialExtraToolDrawer);
