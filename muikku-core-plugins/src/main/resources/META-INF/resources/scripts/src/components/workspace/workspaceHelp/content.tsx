/* eslint-disable react/no-string-refs */

/**
 * Depcrecated refs should be refactored
 */

import * as React from "react";
import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import {
  MaterialContentNodeWithIdAndLogic,
  WorkspaceDataType,
  WorkspaceEditModeStateType,
} from "~/reducers/workspaces";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/item-list.scss";
import "~/sass/elements/material-admin.scss";
import TocTopic, { Toc, TocElement } from "~/components/general/toc";
import Draggable, { Droppable } from "~/components/general/draggable";
import { bindActionCreators } from "redux";
import { repairContentNodes } from "~/util/modifiers";
import { AnyActionType } from "~/actions";
import { StatusType } from "~/reducers/base/status";
import {
  SetWholeWorkspaceMaterialsTriggerType,
  UpdateWorkspaceMaterialContentNodeTriggerType,
  setWholeWorkspaceHelp,
  updateWorkspaceMaterialContentNode,
} from "~/actions/workspaces/material";
import {
  MaterialContentNode,
  MaterialViewRestriction,
} from "~/generated/client";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * ContentProps
 */
interface ContentProps extends WithTranslation {
  status: StatusType;
  materials: MaterialContentNodeWithIdAndLogic[];
  activeNodeId: number;
  workspace: WorkspaceDataType;
  updateWorkspaceMaterialContentNode: UpdateWorkspaceMaterialContentNodeTriggerType;
  setWholeWorkspaceHelp: SetWholeWorkspaceMaterialsTriggerType;
  workspaceEditMode: WorkspaceEditModeStateType;
  doNotSetHashes?: boolean;
  enableTouch?: boolean;
}

/**
 * ContentState
 */
interface ContentState {
  materials: MaterialContentNodeWithIdAndLogic[];
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
      (cn: MaterialContentNodeWithIdAndLogic) =>
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
    base: MaterialContentNodeWithIdAndLogic,
    target: MaterialContentNodeWithIdAndLogic
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
    base: MaterialContentNodeWithIdAndLogic,
    target: MaterialContentNodeWithIdAndLogic | number
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
        case MaterialViewRestriction.LoggedIn:
          return "toc__section-container--view-restricted-to-logged-in";

        case MaterialViewRestriction.WorkspaceMembers:
          return "toc__section-container--view-restricted-to-members";

        default:
          return null;
      }
    } else {
      switch (viewRestrict) {
        case MaterialViewRestriction.LoggedIn:
          return "toc__item--view-restricted-to-logged-in";

        case MaterialViewRestriction.WorkspaceMembers:
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
    const { t } = this.props;

    switch (viewRestrict) {
      case MaterialViewRestriction.LoggedIn:
        return t("content.viewRestricted", { ns: "materials" });

      case MaterialViewRestriction.WorkspaceMembers:
        return t("content.viewRestricted_workspaceMembers", {
          ns: "materials",
        });

      default:
        return null;
    }
  };

  /**
   * Check if section is active by looking if any of its children are active
   *
   * @param section section
   * @returns boolean if section is active
   */
  isSectionActive = (section: MaterialContentNodeWithIdAndLogic) => {
    const { activeNodeId } = this.props;

    for (const m of section.children) {
      if (m.workspaceMaterialId === activeNodeId) {
        return true;
      }
    }

    return false;
  };

  /**
   * render
   */
  render() {
    const { t } = this.props;

    if (!this.props.materials || !this.props.materials.length) {
      return null;
    }

    const isEditable = this.props.workspaceEditMode.active;

    return (
      <Toc
        modifier="workspace-instructions"
        tocHeaderTitle={t("labels.tableOfContents", { ns: "materials" })}
      >
        {this.state.materials.map((node, nodeIndex) => {
          // Boolean if there is view Restriction for toc topic
          const isTocTopicViewRestricted =
            node.viewRestrict === MaterialViewRestriction.LoggedIn ||
            node.viewRestrict === MaterialViewRestriction.WorkspaceMembers;

          // section is restricted in following cases:
          // section is restricted for logged in users and users is not logged in...
          // section is restricted for members only and user is not workspace member and isStudent or is not logged in...
          const isTocTopicViewRestrictedFromUser =
            (node.viewRestrict === MaterialViewRestriction.LoggedIn &&
              !this.props.status.loggedIn) ||
            (node.viewRestrict === MaterialViewRestriction.WorkspaceMembers &&
              !this.props.workspace.isCourseMember &&
              (this.props.status.isStudent || !this.props.status.loggedIn));

          const icon: string =
            isTocTopicViewRestricted &&
            !this.props.status.isStudent &&
            this.props.status.loggedIn
              ? "restriction"
              : null;

          const iconTitle: string =
            isTocTopicViewRestricted && !this.props.status.isStudent
              ? this.buildViewRestrictionLocaleString(node.viewRestrict)
              : null;

          const classModifier: string[] =
            isTocTopicViewRestricted && !this.props.status.isStudent
              ? [this.buildViewRestrictionModifiers(node.viewRestrict, true)]
              : [];

          const topic = (
            <TocTopic
              topicId={node.workspaceMaterialId}
              isActive={this.isSectionActive(node)}
              name={node.title}
              isHidden={node.hidden}
              key={node.workspaceMaterialId}
              hash={
                this.props.doNotSetHashes
                  ? null
                  : "s-" + node.workspaceMaterialId
              }
              modifiers={classModifier}
              iconAfter={icon}
              iconAfterTitle={iconTitle}
              language={node.titleLanguage || this.props.workspace.language}
            >
              {!isTocTopicViewRestrictedFromUser &&
                node.children
                  .map((subnode) => {
                    // Boolean if there is view Restriction for toc element
                    const isTocElementViewRestricted =
                      subnode.viewRestrict ===
                        MaterialViewRestriction.LoggedIn ||
                      subnode.viewRestrict ===
                        MaterialViewRestriction.WorkspaceMembers;

                    const isAssignment = subnode.assignmentType === "EVALUATED";
                    const isExercise = subnode.assignmentType === "EXERCISE";

                    //this modifier will add the --assignment or --exercise to the list so you can add the border style with it
                    const modifier = isAssignment
                      ? "assignment"
                      : isExercise
                      ? "exercise"
                      : null;

                    const icon: string =
                      isTocElementViewRestricted &&
                      !this.props.status.isStudent &&
                      this.props.status.loggedIn
                        ? "restriction"
                        : null;

                    const iconTitle: string =
                      isTocElementViewRestricted &&
                      !this.props.status.isStudent &&
                      this.props.status.loggedIn
                        ? this.buildViewRestrictionLocaleString(
                            subnode.viewRestrict
                          )
                        : null;

                    const className: string =
                      isTocElementViewRestricted &&
                      !this.props.status.isStudent &&
                      this.props.status.loggedIn
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
                          this.props.activeNodeId ===
                          subnode.workspaceMaterialId
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
                        language={
                          subnode.titleLanguage ||
                          node.titleLanguage ||
                          this.props.workspace.language
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
    status: state.status,
    materials: state.workspaces.currentHelp,
    activeNodeId: state.workspaces.currentMaterialsActiveNodeId,
    workspace: state.workspaces.currentWorkspace,
    workspaceEditMode: state.workspaces.editMode,
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

const componentWithTranslation = withTranslation(["workspace", "common"], {
  withRef: true,
})(ContentComponent);

export default connect(mapStateToProps, mapDispatchToProps, null, {
  withRef: true,
})(componentWithTranslation);
