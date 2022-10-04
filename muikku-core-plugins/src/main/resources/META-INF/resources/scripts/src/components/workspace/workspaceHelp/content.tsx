/* eslint-disable react/no-string-refs */

/**
 * Depcrecated refs should be refactored
 */

import * as React from "react";
import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import {
  MaterialContentNodeListType,
  WorkspaceType,
  MaterialContentNodeType,
  WorkspaceEditModeStateType,
  MaterialViewRestriction,
} from "~/reducers/workspaces";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/item-list.scss";
import "~/sass/elements/material-admin.scss";
import Toc, { TocTopic, TocElement } from "~/components/general/toc";
import Draggable, { Droppable } from "~/components/general/draggable";
import { bindActionCreators } from "redux";
import {
  updateWorkspaceMaterialContentNode,
  UpdateWorkspaceMaterialContentNodeTriggerType,
  setWholeWorkspaceHelp,
  SetWholeWorkspaceMaterialsTriggerType,
} from "~/actions/workspaces";
import { repairContentNodes } from "~/util/modifiers";
import { AnyActionType } from "~/actions";

/**
 * ContentProps
 */
interface ContentProps {
  i18n: i18nType;
  materials: MaterialContentNodeListType;
  activeNodeId: number;
  workspace: WorkspaceType;
  updateWorkspaceMaterialContentNode: UpdateWorkspaceMaterialContentNodeTriggerType;
  setWholeWorkspaceHelp: SetWholeWorkspaceMaterialsTriggerType;
  workspaceEditMode: WorkspaceEditModeStateType;
  doNotSetHashes?: boolean;
  enableTouch?: boolean;
  isLoggedIn: boolean;
  isStudent: boolean;
}

/**
 * ContentState
 */
interface ContentState {
  materials: MaterialContentNodeListType;
}

/**
 * isScrolledIntoView
 * @param el el
 */
function isScrolledIntoView(el: HTMLElement) {
  const rect = el.getBoundingClientRect();
  const elemTop = rect.top;
  const elemBottom = rect.bottom;

  const element = document.querySelector(
    ".content-panel__navigation"
  ) as HTMLElement;

  if (element) {
    const isVisible =
      elemTop < window.innerHeight - 100 &&
      elemBottom >= element.offsetTop + 50;
    return isVisible;
  } else {
    return true;
  }
}

/**
 * ContentComponent
 */
class ContentComponent extends React.Component<ContentProps, ContentState> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: ContentProps) {
    super(props);

    this.state = {
      materials: props.materials,
    };

    this.hotInsertBeforeSection = this.hotInsertBeforeSection.bind(this);
    this.hotInsertBeforeSubnode = this.hotInsertBeforeSubnode.bind(this);
    this.onInteractionBetweenSections =
      this.onInteractionBetweenSections.bind(this);
    this.onInteractionBetweenSubnodes =
      this.onInteractionBetweenSubnodes.bind(this);
  }

  /**
   * componentDidUpdate
   * @param prevProps prevProps
   */
  componentDidUpdate(prevProps: ContentProps) {
    if (prevProps.activeNodeId !== this.props.activeNodeId) {
      this.refresh();
    }
  }

  /**
   * componentWillReceiveProps
   * @param nextProps nextProps
   */
  // eslint-disable-next-line react/no-deprecated
  componentWillReceiveProps(nextProps: ContentProps) {
    this.setState({
      materials: nextProps.materials,
    });
  }

  /**
   *  refresh
   * @param props props
   */
  refresh(props: ContentProps = this.props) {
    const tocElement = this.refs[props.activeNodeId] as TocElement;
    if (tocElement) {
      const element = tocElement.getElement();
      if (!isScrolledIntoView(element)) {
        element.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "start",
        });
      }
    }
  }

  /**
   * hotInsertBeforeSection
   * @param baseIndex baseIndex
   * @param targetBeforeIndex targetBeforeIndex
   */
  hotInsertBeforeSection(baseIndex: number, targetBeforeIndex: number) {
    const newMaterialState = [...this.state.materials];
    newMaterialState.splice(baseIndex, 1);
    newMaterialState.splice(
      targetBeforeIndex,
      0,
      this.state.materials[baseIndex]
    );
    const contentNodesRepaired = repairContentNodes(newMaterialState);

    const material = this.state.materials[baseIndex];
    const update = contentNodesRepaired.find(
      (cn) => cn.workspaceMaterialId === material.workspaceMaterialId
    );

    this.setState(
      {
        materials: contentNodesRepaired,
      },
      () => {
        this.props.updateWorkspaceMaterialContentNode({
          workspace: this.props.workspace,
          material,
          update: {
            parentId: update.parentId,
            nextSiblingId: update.nextSiblingId,
          },
          /**
           * success
           */
          success: () => {
            this.props.setWholeWorkspaceHelp(contentNodesRepaired);
          },
          dontTriggerReducerActions: true,
        });
      }
    );
  }

  /**
   * hotInsertBeforeSubnode
   * @param parentBaseIndex parentBaseIndex
   * @param baseIndex baseIndex
   * @param parentTargetBeforeIndex parentTargetBeforeIndex
   * @param targetBeforeIndex targetBeforeIndex
   */
  hotInsertBeforeSubnode(
    parentBaseIndex: number,
    baseIndex: number,
    parentTargetBeforeIndex: number,
    targetBeforeIndex: number
  ) {
    // TODO do the action update here for server side update
    const newMaterialState = [...this.state.materials];
    newMaterialState[parentBaseIndex] = {
      ...newMaterialState[parentBaseIndex],
      children: [...newMaterialState[parentBaseIndex].children],
    };
    newMaterialState[parentBaseIndex].children.splice(baseIndex, 1);
    newMaterialState[parentTargetBeforeIndex] = {
      ...newMaterialState[parentTargetBeforeIndex],
      children: [...newMaterialState[parentTargetBeforeIndex].children],
    };
    if (targetBeforeIndex === null) {
      newMaterialState[parentTargetBeforeIndex].children.push(
        this.state.materials[parentBaseIndex].children[baseIndex]
      );
    } else if (parentBaseIndex === parentTargetBeforeIndex) {
      newMaterialState[parentTargetBeforeIndex].children.splice(
        targetBeforeIndex,
        0,
        this.state.materials[parentBaseIndex].children[baseIndex]
      );
    } else {
      newMaterialState[parentTargetBeforeIndex].children.splice(
        targetBeforeIndex,
        0,
        this.state.materials[parentBaseIndex].children[baseIndex]
      );
    }

    const repariedNodes = repairContentNodes(newMaterialState);
    const workspaceId =
      this.state.materials[parentBaseIndex].children[baseIndex]
        .workspaceMaterialId;

    const material = this.state.materials[parentBaseIndex].children[baseIndex];
    const update = repariedNodes[parentTargetBeforeIndex].children.find(
      (cn: MaterialContentNodeType) =>
        cn.workspaceMaterialId === material.workspaceMaterialId
    );

    this.setState(
      {
        materials: repariedNodes,
      },
      () => {
        if (parentBaseIndex !== parentTargetBeforeIndex) {
          (
            this.refs[
              `draggable-${parentTargetBeforeIndex}-${workspaceId}`
            ] as Draggable
          ).onRootSelectStart(null, true);
        }

        this.props.updateWorkspaceMaterialContentNode({
          workspace: this.props.workspace,
          material,
          update: {
            parentId: update.parentId,
            nextSiblingId: update.nextSiblingId,
          },
          /**
           * success
           */
          success: () => {
            this.props.setWholeWorkspaceHelp(repariedNodes);
          },
          dontTriggerReducerActions: true,
        });
      }
    );
  }

  /**
   * onInteractionBetweenSections
   * @param base base
   * @param target target
   */
  onInteractionBetweenSections(
    base: MaterialContentNodeType,
    target: MaterialContentNodeType
  ) {
    this.hotInsertBeforeSection(
      this.state.materials.findIndex(
        (m) => m.workspaceMaterialId === base.workspaceMaterialId
      ),
      this.state.materials.findIndex(
        (m) => m.workspaceMaterialId === target.workspaceMaterialId
      )
    );
  }

  /**
   * onInteractionBetweenSubnodes
   * @param base base
   * @param target target
   */
  onInteractionBetweenSubnodes(
    base: MaterialContentNodeType,
    target: MaterialContentNodeType | number
  ) {
    const parentBaseIndex = this.state.materials.findIndex(
      (m) => m.workspaceMaterialId === base.parentId
    );
    const baseIndex = this.state.materials[parentBaseIndex].children.findIndex(
      (m) => m.workspaceMaterialId === base.workspaceMaterialId
    );
    if (typeof target === "number") {
      this.hotInsertBeforeSubnode(
        parentBaseIndex,
        baseIndex,
        this.state.materials.findIndex((m) => m.workspaceMaterialId === target),
        null
      );
      return;
    }
    const parentTargetBeforeIndex = this.state.materials.findIndex(
      (m) => m.workspaceMaterialId === target.parentId
    );
    const targetBeforeIndex = this.state.materials[
      parentTargetBeforeIndex
    ].children.findIndex(
      (m) => m.workspaceMaterialId === target.workspaceMaterialId
    );
    this.hotInsertBeforeSubnode(
      parentBaseIndex,
      baseIndex,
      parentTargetBeforeIndex,
      targetBeforeIndex
    );
  }

  /**
   * buildViewRestrictionModifiers
   * @param viewRestrict viewRestrict
   * @param section section
   */
  buildViewRestrictionModifiers = (
    viewRestrict: MaterialViewRestriction,
    section: boolean
  ) => {
    if (section) {
      switch (viewRestrict) {
        case MaterialViewRestriction.LOGGED_IN:
          return "toc__section-container--view-restricted-to-logged-in";

        case MaterialViewRestriction.WORKSPACE_MEMBERS:
          return "toc__section-container--view-restricted-to-members";

        default:
          return null;
      }
    } else {
      switch (viewRestrict) {
        case MaterialViewRestriction.LOGGED_IN:
          return "toc__item--view-restricted-to-logged-in";

        case MaterialViewRestriction.WORKSPACE_MEMBERS:
          return "toc__item--view-restricted-to-members";

        default:
          return null;
      }
    }
  };

  /**
   * buildViewRestrictionLocaleString
   * @param viewRestrict viewRestrict
   * @returns locale string
   */
  buildViewRestrictionLocaleString = (
    viewRestrict: MaterialViewRestriction
  ) => {
    switch (viewRestrict) {
      case MaterialViewRestriction.LOGGED_IN:
        return this.props.i18n.text.get(
          "plugin.workspace.materialViewRestricted"
        );

      case MaterialViewRestriction.WORKSPACE_MEMBERS:
        return this.props.i18n.text.get(
          "plugin.workspace.materialViewRestrictedToWorkspaceMembers"
        );

      default:
        return null;
    }
  };

  /**
   * render
   */
  render() {
    if (!this.props.materials || !this.props.materials.length) {
      return null;
    }

    const isEditable = this.props.workspaceEditMode.active;

    return (
      <Toc
        tocTitle={this.props.i18n.text.get(
          "plugin.workspace.materials.tocTitle"
        )}
      >
        {this.state.materials.map((node, nodeIndex) => {
          const isSectionViewRestricted =
            (node.viewRestrict === MaterialViewRestriction.LOGGED_IN ||
              node.viewRestrict ===
                MaterialViewRestriction.WORKSPACE_MEMBERS) &&
            !this.props.isStudent;

          const isSectionViewRestrictedVisible =
            (node.viewRestrict === MaterialViewRestriction.LOGGED_IN ||
              node.viewRestrict ===
                MaterialViewRestriction.WORKSPACE_MEMBERS) &&
            !this.props.isStudent;

          const icon: string = isSectionViewRestrictedVisible
            ? "restriction"
            : null;

          const iconTitle: string = !this.props.isStudent
            ? this.buildViewRestrictionLocaleString(node.viewRestrict)
            : null;

          const className: string = !this.props.isStudent
            ? this.buildViewRestrictionModifiers(node.viewRestrict, true)
            : "toc__section-container";

          const topic = (
            <TocTopic
              name={node.title}
              isHidden={node.hidden}
              key={node.workspaceMaterialId}
              hash={
                this.props.doNotSetHashes
                  ? null
                  : "s-" + node.workspaceMaterialId
              }
              className={className}
              iconAfter={icon}
              iconAfterTitle={iconTitle}
            >
              {node.children
                .map((subnode) => {
                  if (isSectionViewRestricted) {
                    return null;
                  }
                  const isViewRestrictedVisible =
                    (subnode.viewRestrict ===
                      MaterialViewRestriction.LOGGED_IN ||
                      subnode.viewRestrict ===
                        MaterialViewRestriction.WORKSPACE_MEMBERS) &&
                    !this.props.isStudent;

                  const isAssignment = subnode.assignmentType === "EVALUATED";
                  const isExercise = subnode.assignmentType === "EXERCISE";

                  //this modifier will add the --assignment or --exercise to the list so you can add the border style with it
                  const modifier = isAssignment
                    ? "assignment"
                    : isExercise
                    ? "exercise"
                    : null;

                  const icon: string = isViewRestrictedVisible
                    ? "restriction"
                    : null;

                  const iconTitle: string = !this.props.isStudent
                    ? this.buildViewRestrictionLocaleString(
                        subnode.viewRestrict
                      )
                    : null;

                  const className: string = !this.props.isStudent
                    ? this.buildViewRestrictionModifiers(
                        subnode.viewRestrict,
                        false
                      )
                    : null;

                  const pageElement = (
                    <TocElement
                      modifier={modifier}
                      ref={subnode.workspaceMaterialId + ""}
                      key={subnode.workspaceMaterialId}
                      isActive={
                        this.props.activeNodeId === subnode.workspaceMaterialId
                      }
                      className={className}
                      isHidden={subnode.hidden || node.hidden}
                      disableScroll
                      iconAfter={icon}
                      iconAfterTitle={iconTitle}
                      hash={
                        this.props.doNotSetHashes
                          ? null
                          : "p-" + subnode.workspaceMaterialId
                      }
                    >
                      {subnode.title}
                    </TocElement>
                  );

                  if (!isEditable) {
                    if (subnode.hidden) {
                      return null;
                    }
                    return pageElement;
                  } else {
                    return (
                      <Draggable
                        interactionData={subnode}
                        interactionGroup="TOC_SUBNODE"
                        key={subnode.workspaceMaterialId}
                        className="toc__item--drag-container"
                        handleSelector=".toc__item--drag-handle"
                        onInteractionWith={this.onInteractionBetweenSubnodes.bind(
                          this,
                          subnode
                        )}
                        ref={`draggable-${nodeIndex}-${subnode.workspaceMaterialId}`}
                        enableTouch={this.props.enableTouch}
                      >
                        <div className="toc__item--drag-handle icon-move"></div>
                        {pageElement}
                      </Draggable>
                    );
                  }
                })
                .concat(
                  isEditable ? (
                    <Droppable
                      key="LAST"
                      interactionData={node.workspaceMaterialId}
                      interactionGroup="TOC_SUBNODE"
                      className="toc__element--drag-placeholder-container"
                    ></Droppable>
                  ) : (
                    []
                  )
                )}
            </TocTopic>
          );

          if (!isEditable) {
            if (node.hidden) {
              return null;
            }
            return topic;
          } else {
            return (
              <Draggable
                interactionData={node}
                interactionGroup="TOC"
                key={node.workspaceMaterialId}
                className="toc__section--drag-container"
                handleSelector=".toc__section--drag-handle"
                onInteractionWith={this.onInteractionBetweenSections.bind(
                  this,
                  node
                )}
                enableTouch={this.props.enableTouch}
              >
                <div className="toc__section--drag-handle icon-move"></div>
                {topic}
              </Draggable>
            );
          }
        })}
      </Toc>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    materials: state.workspaces.currentHelp,
    activeNodeId: state.workspaces.currentMaterialsActiveNodeId,
    workspace: state.workspaces.currentWorkspace,
    workspaceEditMode: state.workspaces.editMode,
    isLoggedIn: state.status.loggedIn,
    isStudent: state.status.loggedIn && state.status.isStudent,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    { updateWorkspaceMaterialContentNode, setWholeWorkspaceHelp },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps, null, {
  withRef: true,
})(ContentComponent);
