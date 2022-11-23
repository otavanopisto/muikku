/* eslint-disable react/no-string-refs */
/* eslint-disable @typescript-eslint/ban-types */

/**
 * Component needs refactoring related to how it handles refs because
 * current ref system it is using has been deprecated and should be change
 * to use new way how React handles those.
 *
 * Function type should be change to more specific type
 */

import * as React from "react";
import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";
import {
  MaterialContentNodeListType,
  WorkspaceType,
  MaterialCompositeRepliesListType,
  MaterialContentNodeType,
  WorkspaceEditModeStateType,
  MaterialViewRestriction,
} from "~/reducers/workspaces";

import "~/sass/elements/buttons.scss";
import "~/sass/elements/item-list.scss";
import "~/sass/elements/material-admin.scss";
import TocTopic, {
  Toc,
  TocElement,
  ToggleOpenHandle,
} from "~/components/general/toc";
import Draggable, { Droppable } from "~/components/general/draggable";
import { bindActionCreators } from "redux";
import { repairContentNodes } from "~/util/modifiers";
import { AnyActionType } from "~/actions/index";
import { StatusType } from "~/reducers/base/status";
import {
  updateWorkspaceMaterialContentNode,
  setWholeWorkspaceMaterials,
  SetWholeWorkspaceMaterialsTriggerType,
  UpdateWorkspaceMaterialContentNodeTriggerType,
} from "~/actions/workspaces/material";
import Dropdown from "~/components/general/dropdown";
import { ButtonPill, IconButton } from "~/components/general/button";
import SessionStateComponent from "~/components/general/session-state-component";

/**
 * ContentProps
 */
interface ContentProps {
  i18n: i18nType;
  status: StatusType;
  materials: MaterialContentNodeListType;
  materialReplies: MaterialCompositeRepliesListType;
  activeNodeId: number;
  workspace: WorkspaceType;
  updateWorkspaceMaterialContentNode: UpdateWorkspaceMaterialContentNodeTriggerType;
  setWholeWorkspaceMaterials: SetWholeWorkspaceMaterialsTriggerType;
  workspaceEditMode: WorkspaceEditModeStateType;
  doNotSetHashes?: boolean;
  enableTouch?: boolean;
}

/**
 * ContentState
 */
interface ContentState {
  materials: MaterialContentNodeListType;
  assignmentTypeFilters: string[];
  sessionId: string;
}

/**
 * isScrolledIntoView
 * @param el el
 * @returns boolean
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
class ContentComponent extends SessionStateComponent<
  ContentProps,
  ContentState
> {
  private storedLastUpdateServerExecution: Function;
  private originalMaterials: MaterialContentNodeListType;
  private topicRefs: ToggleOpenHandle[];

  /**
   * constructor
   * @param props props
   */
  constructor(props: ContentProps) {
    super(props, "workspaceMaterialsContent");

    const sessionId = props.status.loggedIn
      ? `${props.workspace.id}.${props.status.userId}`
      : `${props.workspace.id}`;

    this.topicRefs = [];

    this.state = {
      ...this.getRecoverStoredState(
        {
          assignmentTypeFilters: ["THEORY", "EVALUATED", "EXERCISE", "JOURNAL"],
          sessionId,
        },
        sessionId
      ),
      materials: props.materials,
    };

    this.originalMaterials = props.materials;

    this.hotInsertBeforeSection = this.hotInsertBeforeSection.bind(this);
    this.hotInsertBeforeSubnode = this.hotInsertBeforeSubnode.bind(this);
    this.onInteractionBetweenSections =
      this.onInteractionBetweenSections.bind(this);
    this.onInteractionBetweenSubnodes =
      this.onInteractionBetweenSubnodes.bind(this);
    this.onDropBetweenSubnodes = this.onDropBetweenSubnodes.bind(this);
    this.onDropBetweenSections = this.onDropBetweenSections.bind(this);
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
   * UNSAFE_componentWillReceiveProps
   * @param nextProps nextProps
   */
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillReceiveProps(nextProps: ContentProps) {
    this.setState({
      materials: nextProps.materials,
    });
  }

  /**
   * refresh
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

    const materialFromState = this.state.materials[baseIndex];
    const material = this.originalMaterials.find(
      (cn) => cn.workspaceMaterialId === materialFromState.workspaceMaterialId
    );
    const update = contentNodesRepaired.find(
      (cn) => cn.workspaceMaterialId === material.workspaceMaterialId
    );

    this.setState({
      materials: contentNodesRepaired,
    });

    /**
     * storedLastUpdateServerExecution
     */
    this.storedLastUpdateServerExecution = () => {
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
          this.props.setWholeWorkspaceMaterials(contentNodesRepaired);
          this.originalMaterials = contentNodesRepaired;
        },
        dontTriggerReducerActions: true,
      });
    };
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
    const materialParentFromState = this.state.materials[parentBaseIndex];
    const materialFromState = materialParentFromState.children[baseIndex];
    const workspaceId = materialFromState.workspaceMaterialId;

    let material: MaterialContentNodeType;
    this.originalMaterials.forEach((cn) => {
      cn.children.forEach((ccn) => {
        if (ccn.workspaceMaterialId === materialFromState.workspaceMaterialId) {
          material = ccn;
        }
      });
    });

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
      }
    );

    /**
     * storedLastUpdateServerExecution
     */
    this.storedLastUpdateServerExecution = () => {
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
          this.props.setWholeWorkspaceMaterials(repariedNodes);
          this.originalMaterials = repariedNodes;
        },
        dontTriggerReducerActions: true,
      });
    };
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
   * onDropBetweenSections
   */
  onDropBetweenSections() {
    this.storedLastUpdateServerExecution &&
      this.storedLastUpdateServerExecution();
    delete this.storedLastUpdateServerExecution;
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
   * onDropBetweenSubnodes
   */
  onDropBetweenSubnodes() {
    this.storedLastUpdateServerExecution &&
      this.storedLastUpdateServerExecution();
    delete this.storedLastUpdateServerExecution;
  }

  /**
   * handleOpenAllSections
   * @param type type
   */
  handleToggleAllSectionsOpen =
    (type: "close" | "open") =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      for (const ref of this.topicRefs) {
        ref.toggleOpen(type);
      }
    };

  /**
   * handleToggleAssignmentFilterChange
   * @param e e
   */
  handleToggleAssignmentFilterChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const clickedValue = e.target.value;

    const newAssignmentFilter = [...this.state.assignmentTypeFilters];

    // Get possible existing index of clicked value
    const indexOfActiveFilter = newAssignmentFilter.findIndex(
      (f) => f === clickedValue
    );

    if (indexOfActiveFilter !== -1) {
      newAssignmentFilter.splice(indexOfActiveFilter, 1);
    } else {
      newAssignmentFilter.push(clickedValue);
    }

    // Using session component to store filters
    this.setStateAndStore(
      {
        assignmentTypeFilters: newAssignmentFilter,
      },
      this.state.sessionId
    );
  };

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
          return "view-restricted-to-logged-in";

        case MaterialViewRestriction.WORKSPACE_MEMBERS:
          return "view-restricted-to-members";

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
   * Check if section is active by looking if any of its children are active
   *
   * @param section section
   * @returns boolean if section is active
   */
  isSectionActive = (section: MaterialContentNodeType) => {
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
   * @returns JSX.Element
   */
  render() {
    if (!this.props.materials || !this.props.materials.length) {
      return null;
    }

    const isEditable = this.props.workspaceEditMode.active;

    return (
      <Toc
        tocHeaderTitle={this.props.i18n.text.get(
          "plugin.workspace.materials.tocTitle"
        )}
        tocHeaderExtraContent={
          <div>
            <Dropdown openByHover content={<p>Avaa kaikki</p>}>
              <IconButton
                icon="arrow-down"
                buttonModifiers={["toc-open-close-sections"]}
                onClick={this.handleToggleAllSectionsOpen("open")}
              />
            </Dropdown>
            <Dropdown openByHover content={<p>Sulje kaikki</p>}>
              <IconButton
                icon="arrow-up"
                buttonModifiers={["toc-open-close-sections"]}
                onClick={this.handleToggleAllSectionsOpen("close")}
              />
            </Dropdown>
            <Dropdown
              content={
                <>
                  <div className="dropdown__container-item">
                    <div className="filter-category">
                      <div className="filter-category__label">
                        {this.props.i18n.text.get(
                          "plugin.workspace.materials.tocFilter"
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="dropdown__container-item">
                    <div className="filter-item filter-item--workspace-page">
                      <input
                        type="checkbox"
                        value="THEORY"
                        id="theory-page-filter"
                        checked={this.state.assignmentTypeFilters.includes(
                          "THEORY"
                        )}
                        onChange={this.handleToggleAssignmentFilterChange}
                      />
                      <label
                        htmlFor="theory-page-filter"
                        className="filter-item__label"
                      >
                        {this.props.i18n.text.get(
                          "plugin.workspace.materials.tocFilter.theory"
                        )}
                      </label>
                    </div>
                  </div>
                  <div className="dropdown__container-item">
                    <div className="filter-item filter-item--workspace-page">
                      <input
                        type="checkbox"
                        value="EXERCISE"
                        id="exercise-page-filter"
                        checked={this.state.assignmentTypeFilters.includes(
                          "EXERCISE"
                        )}
                        onChange={this.handleToggleAssignmentFilterChange}
                      />
                      <label
                        htmlFor="exercise-page-filter"
                        className="filter-item__label"
                      >
                        {this.props.i18n.text.get(
                          "plugin.workspace.materials.tocFilter.exercise"
                        )}
                      </label>
                    </div>
                  </div>
                  <div className="dropdown__container-item">
                    <div className="filter-item filter-item--workspace-page">
                      <input
                        type="checkbox"
                        value="EVALUATED"
                        id="assignment-page-filter"
                        checked={this.state.assignmentTypeFilters.includes(
                          "EVALUATED"
                        )}
                        onChange={this.handleToggleAssignmentFilterChange}
                      />
                      <label
                        htmlFor="assignment-page-filter"
                        className="filter-item__label"
                      >
                        {this.props.i18n.text.get(
                          "plugin.workspace.materials.tocFilter.assignment"
                        )}
                      </label>
                    </div>
                  </div>
                  <div className="dropdown__container-item">
                    <div className="filter-item filter-item--workspace-page">
                      <input
                        type="checkbox"
                        value="JOURNAL"
                        id="journal-page-filter"
                        checked={this.state.assignmentTypeFilters.includes(
                          "JOURNAL"
                        )}
                        onChange={this.handleToggleAssignmentFilterChange}
                      />
                      <label
                        htmlFor="journal-page-filter"
                        className="filter-item__label"
                      >
                        {this.props.i18n.text.get(
                          "plugin.workspace.materials.tocFilter.journal"
                        )}
                      </label>
                    </div>
                  </div>
                </>
              }
            >
              <IconButton icon="filter" buttonModifiers={["toc-filter"]} />
            </Dropdown>
          </div>
        }
      >
        {this.state.materials.map((node, nodeIndex) => {
          // Boolean if there is view Restriction for toc topic
          const isTocTopicViewRestricted =
            node.viewRestrict === MaterialViewRestriction.LOGGED_IN ||
            node.viewRestrict === MaterialViewRestriction.WORKSPACE_MEMBERS;

          // section is restricted in following cases:
          // section is restricted for logged in users and users is not logged in...
          // section is restricted for members only and user is not workspace member and isStudent or is not logged in...
          const isTocTopicViewRestrictedFromUser =
            (node.viewRestrict === MaterialViewRestriction.LOGGED_IN &&
              !this.props.status.loggedIn) ||
            (node.viewRestrict === MaterialViewRestriction.WORKSPACE_MEMBERS &&
              !this.props.workspace.isCourseMember &&
              (this.props.status.isStudent || !this.props.status.loggedIn));

          const iconTopic: string =
            isTocTopicViewRestricted &&
            !this.props.status.isStudent &&
            this.props.status.loggedIn
              ? "restriction"
              : null;

          const iconTitleTopic: string =
            isTocTopicViewRestricted &&
            !this.props.status.isStudent &&
            this.props.status.loggedIn
              ? this.buildViewRestrictionLocaleString(node.viewRestrict)
              : null;

          const topicClassMods: string[] =
            isTocTopicViewRestricted &&
            !this.props.status.isStudent &&
            this.props.status.loggedIn
              ? [this.buildViewRestrictionModifiers(node.viewRestrict, true)]
              : [];

          const topic = (
            <TocTopic
              ref={(ref) => {
                this.topicRefs[nodeIndex] = ref;
              }}
              isActive={this.isSectionActive(node)}
              topicId={
                this.props.status.loggedIn
                  ? `${node.workspaceMaterialId}_${this.props.status.userId}`
                  : node.workspaceMaterialId
              }
              name={node.title}
              isHidden={node.hidden}
              key={node.workspaceMaterialId}
              hash={
                this.props.doNotSetHashes
                  ? null
                  : "s-" + node.workspaceMaterialId
              }
              modifiers={topicClassMods}
              iconAfter={iconTopic}
              iconAfterTitle={iconTitleTopic}
            >
              {!isTocTopicViewRestrictedFromUser &&
                node.children
                  .map((subnode) => {
                    // Boolean if there is view Restriction for toc element
                    const isTocElementViewRestricted =
                      subnode.viewRestrict ===
                        MaterialViewRestriction.LOGGED_IN ||
                      subnode.viewRestrict ===
                        MaterialViewRestriction.WORKSPACE_MEMBERS;

                    const isAssignment = subnode.assignmentType === "EVALUATED";
                    const isExercise = subnode.assignmentType === "EXERCISE";
                    const isJournal = subnode.assignmentType === "JOURNAL";
                    const isInterimEvaluation =
                      subnode.assignmentType === "INTERIM_EVALUATION";
                    const isTheory = subnode.assignmentType === null;

                    // Boolean if toc element is filtered out
                    // if there is filters, then only elements that match the filters are shown
                    const filteredOut =
                      !this.state.assignmentTypeFilters.includes(
                        subnode.assignmentType || (isTheory && "THEORY")
                      );

                    //this modifier will add the --assignment or --exercise to the list so you can add the border style with it
                    const modifier = isAssignment
                      ? "assignment"
                      : isExercise
                      ? "exercise"
                      : isJournal
                      ? "journal"
                      : isInterimEvaluation
                      ? "interim-evaluation"
                      : null;

                    let icon: string | null = null;
                    let iconTitle: string | null = null;
                    let className: string | null = null;

                    const compositeReplies =
                      this.props.materialReplies &&
                      this.props.materialReplies.find(
                        (reply) =>
                          reply.workspaceMaterialId ===
                          subnode.workspaceMaterialId
                      );

                    let showEvenIfHidden = false;

                    if (subnode.hidden && compositeReplies) {
                      showEvenIfHidden =
                        compositeReplies && compositeReplies.submitted !== null;
                    }

                    if (compositeReplies) {
                      switch (compositeReplies.state) {
                        case "ANSWERED":
                          icon = "check";
                          className = "toc__item--answered";
                          iconTitle = this.props.i18n.text.get(
                            "plugin.workspace.materials.exerciseDoneTooltip"
                          );
                          break;
                        case "SUBMITTED":
                          icon = "check";
                          className = "toc__item--submitted";
                          iconTitle = this.props.i18n.text.get(
                            "plugin.workspace.materials.assignmentDoneTooltip"
                          );
                          break;
                        case "WITHDRAWN":
                          icon = "check";
                          className = "toc__item--withdrawn";
                          iconTitle = this.props.i18n.text.get(
                            "plugin.workspace.materials.assignmentWithdrawnTooltip"
                          );
                          break;
                        case "INCOMPLETE":
                          icon = "thumb-down";
                          className = "toc__item--incomplete";
                          iconTitle = this.props.i18n.text.get(
                            "plugin.workspace.materials.assignmentIncompleteTooltip"
                          );
                          break;
                        case "FAILED":
                          icon = "thumb-down";
                          className = "toc__item--failed";
                          iconTitle = this.props.i18n.text.get(
                            "plugin.workspace.materials.assignmentFailedTooltip"
                          );
                          break;
                        case "PASSED":
                          icon = "thumb-up";
                          className = "toc__item--passed";
                          iconTitle = this.props.i18n.text.get(
                            "plugin.workspace.materials.assignmentPassedTooltip"
                          );
                          break;
                        case "UNANSWERED":
                        default:
                          break;
                      }
                    }

                    if (
                      isTocElementViewRestricted &&
                      !this.props.status.isStudent &&
                      this.props.status.loggedIn
                    ) {
                      icon = "restriction";
                      className = this.buildViewRestrictionModifiers(
                        subnode.viewRestrict,
                        false
                      );
                      iconTitle = this.buildViewRestrictionLocaleString(
                        subnode.viewRestrict
                      );
                    }

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
                        isFilteredOut={filteredOut}
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
                      if (subnode.hidden && !showEvenIfHidden) {
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
                          onDropInto={this.onDropBetweenSubnodes.bind(
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
                onDropInto={this.onDropBetweenSections.bind(this, node)}
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
    status: state.status,
    materials: state.workspaces.currentMaterials,
    materialReplies: state.workspaces.currentMaterialsReplies,
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
    { updateWorkspaceMaterialContentNode, setWholeWorkspaceMaterials },
    dispatch
  );
}

export default connect(mapStateToProps, mapDispatchToProps, null, {
  withRef: true,
})(ContentComponent);
