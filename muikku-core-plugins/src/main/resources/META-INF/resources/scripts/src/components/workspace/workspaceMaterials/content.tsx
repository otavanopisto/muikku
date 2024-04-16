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
import {
  MaterialContentNodeWithIdAndLogic,
  WorkspaceDataType,
  WorkspaceEditModeStateType,
} from "~/reducers/workspaces";

import "~/sass/elements/buttons.scss";
import "~/sass/elements/item-list.scss";
import "~/sass/elements/material-admin.scss";
import TocTopic, {
  Toc,
  TocElement,
  TocTopicRef,
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
import { IconButton } from "~/components/general/button";
import SessionStateComponent from "~/components/general/session-state-component";
import { withTranslation, WithTranslation } from "react-i18next";
import TableOfContentPDFDialog from "./table-of-content-pdf-dialog";
import {
  MaterialCompositeReply,
  MaterialViewRestriction,
} from "~/generated/client";

/**
 * TocElementRef
 */
interface TocElementRef {
  [key: string]: HTMLAnchorElement[];
}

/**
 * ContentProps
 */
interface ContentProps extends WithTranslation {
  status: StatusType;
  materials: MaterialContentNodeWithIdAndLogic[];
  materialReplies: MaterialCompositeReply[];
  activeNodeId: number;
  workspace: WorkspaceDataType;
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
  materials: MaterialContentNodeWithIdAndLogic[];
  assignmentTypeFilters: string[];
  sessionId: string;
}

/**
 * ContentComponent
 */
class ContentComponent extends SessionStateComponent<
  ContentProps,
  ContentState
> {
  private storedLastUpdateServerExecution: Function;
  private originalMaterials: MaterialContentNodeWithIdAndLogic[];
  private topicRefs: TocTopicRef[];
  private elementRefs: TocElementRef;

  private tocElementFocusIndexRef: number;

  /**
   * constructor
   * @param props props
   */
  constructor(props: ContentProps) {
    super(props, "workspaceMaterialsContent");

    const sessionId = props.status.loggedIn
      ? `${props.workspace.id}.${props.status.userId}`
      : `${props.workspace.id}`;

    this.state = {
      ...this.getRecoverStoredState(
        {
          assignmentTypeFilters: [
            "THEORY",
            "EVALUATED",
            "EXERCISE",
            "JOURNAL",
            "INTERIM_EVALUATION",
          ],
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

    this.topicRefs = [];
    this.elementRefs = props.materials.reduce<TocElementRef>((acc, node) => {
      acc[`s-${node.workspaceMaterialId}`] = [];
      return acc;
    }, {});

    this.tocElementFocusIndexRef = 0;
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

    let material: MaterialContentNodeWithIdAndLogic;
    this.originalMaterials.forEach((cn) => {
      cn.children.forEach((ccn) => {
        if (ccn.workspaceMaterialId === materialFromState.workspaceMaterialId) {
          material = ccn;
        }
      });
    });

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
  handleToggleAllSectionsClick =
    (type: "close" | "open") =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      for (const ref of this.topicRefs) {
        ref.toggleOpen(type);
      }
    };

  /**
   * handleToggleAllSectionKeyDown
   * @param type type
   */
  handleToggleAllSectionKeyDown =
    (type: "close" | "open") => (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        e.stopPropagation();
        for (const ref of this.topicRefs) {
          ref.toggleOpen(type);
        }
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

    this.elementRefs = this.state.materials.reduce<TocElementRef>(
      (acc, node) => {
        acc[`s-${node.workspaceMaterialId}`] = [];
        return acc;
      },
      {}
    );

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
        case MaterialViewRestriction.LoggedIn:
          return "view-restricted-to-logged-in";

        case MaterialViewRestriction.WorkspaceMembers:
          return "view-restricted-to-members";

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
   * Sets ref to topic
   * @param index index
   */
  handleCallbackTocTopicRef = (index: number) => (ref: TocTopicRef) => {
    this.topicRefs[index] = ref;
  };

  /**
   * Sets ref to element
   * @param parentIdentifier parentIdentifier
   * @param index index
   */
  handleCallbackTocElementRef =
    (parentIdentifier: string, index: number) => (ref: HTMLAnchorElement) => {
      this.elementRefs[parentIdentifier][index] = ref;
    };

  /**
   * Handle keydown event on toc topic
   * @param topicIdentifier topicIdentifier
   */
  handleTocTopicTitleKeyDown =
    (topicIdentifier: string) => (e: React.KeyboardEvent) => {
      // Change focus to first element in topic
      if (e.key === "ArrowDown") {
        e.stopPropagation();
        e.preventDefault();

        this.tocElementFocusIndexRef = 0;

        // Check if there are any elements in topic top focus
        if (this.elementRefs[topicIdentifier].length > 0) {
          this.elementRefs[topicIdentifier][
            this.tocElementFocusIndexRef
          ].setAttribute("tabindex", "0");
          this.elementRefs[topicIdentifier][
            this.tocElementFocusIndexRef
          ].focus();
        }
      }
    };

  /**
   * Handles keydown event on toc element
   * @param parentNodeIdentifier parentNodeIdentifier
   */
  handleTocElementKeyDown =
    (parentNodeIdentifier: string) => (e: React.KeyboardEvent) => {
      /**
       * elementFocusChange
       * @param operation operation
       */
      const elementFocusChange = (operation: "decrement" | "increment") => {
        e.stopPropagation();
        e.preventDefault();

        if (operation === "decrement") {
          this.tocElementFocusIndexRef--;
        } else {
          this.tocElementFocusIndexRef++;
        }

        if (this.tocElementFocusIndexRef < 0) {
          this.tocElementFocusIndexRef =
            this.elementRefs[parentNodeIdentifier].length - 1;
        } else if (
          this.tocElementFocusIndexRef >
          this.elementRefs[parentNodeIdentifier].length - 1
        ) {
          this.tocElementFocusIndexRef = 0;
        }

        this.elementRefs[parentNodeIdentifier][
          this.tocElementFocusIndexRef
        ].setAttribute("tabindex", "0");
        this.elementRefs[parentNodeIdentifier][
          this.tocElementFocusIndexRef
        ].focus();
      };

      if (e.key === "ArrowUp") {
        elementFocusChange("decrement");
      }

      if (e.key === "ArrowDown") {
        elementFocusChange("increment");
      }
    };

  /**
   * Handle blur event on toc element
   * @param parentNodeIdentifier parentNodeIdentifier
   * @param elementIndex elementIndex
   */
  handleTocElementBlur =
    (parentNodeIdentifier: string, elementIndex: number) =>
    (e: React.FocusEvent) => {
      e.stopPropagation();
      e.preventDefault();

      this.elementRefs[parentNodeIdentifier][elementIndex].setAttribute(
        "tabindex",
        "-1"
      );
    };

  /**
   * render
   * @returns JSX.Element
   */
  render() {
    const { t } = this.props;

    if (!this.props.materials || !this.props.materials.length) {
      return null;
    }

    const isEditable = this.props.workspaceEditMode.active;

    return (
      <Toc
        modifier="workspace-materials"
        tocHeaderExtraContent={
          <>
            <Dropdown openByHover content={<p>{t("actions.openAll")}</p>}>
              <IconButton
                icon="arrow-down"
                aria-label={t("actions.openAll")}
                buttonModifiers={["toc-action"]}
                onClick={this.handleToggleAllSectionsClick("open")}
                onKeyDown={this.handleToggleAllSectionKeyDown("open")}
              />
            </Dropdown>
            <Dropdown openByHover content={<p>{t("actions.closeAll")}</p>}>
              <IconButton
                icon="arrow-up"
                aria-label={t("actions.closeAll")}
                buttonModifiers={["toc-action"]}
                onClick={this.handleToggleAllSectionsClick("close")}
                onKeyDown={this.handleToggleAllSectionKeyDown("close")}
              />
            </Dropdown>
            <Dropdown
              items={[
                <div
                  key="theory-page"
                  className="filter-item filter-item--workspace-page"
                >
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
                    {t("labels.theoryPages", { ns: "materials" })}
                  </label>
                </div>,
                <div
                  key="exercise-page"
                  className="filter-item filter-item--workspace-page"
                >
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
                    {t("labels.exercises", { ns: "materials" })}
                  </label>
                </div>,
                <div
                  key="evaluated-page"
                  className="filter-item filter-item--workspace-page"
                >
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
                    {t("labels.evaluables", {
                      ns: "materials",
                    })}
                  </label>
                </div>,
                <div
                  key="journal-page"
                  className="filter-item filter-item--workspace-page"
                >
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
                    {t("labels.journalAssignments", { ns: "materials" })}
                  </label>
                </div>,

                <div
                  key="interim-evaluation-page"
                  className="filter-item filter-item--workspace-page"
                >
                  <input
                    type="checkbox"
                    value="INTERIM_EVALUATION"
                    id="interim-evaluation-page-filter"
                    checked={this.state.assignmentTypeFilters.includes(
                      "INTERIM_EVALUATION"
                    )}
                    onChange={this.handleToggleAssignmentFilterChange}
                  />
                  <label
                    htmlFor="interim-evaluation-page-filter"
                    className="filter-item__label"
                  >
                    {t("labels.interimEvaluationPages", {
                      ns: "materials",
                    })}
                  </label>
                </div>,
              ]}
            >
              <IconButton
                icon="filter"
                buttonModifiers={["toc-action"]}
                aria-label={t("actions.filterContent")}
              />
            </Dropdown>
            <Dropdown
              openByHover
              content={<p>{t("actions.openPDF", { ns: "common" })}</p>}
            >
              <TableOfContentPDFDialog
                assignmentTypeFilters={this.state.assignmentTypeFilters}
                materials={this.props.materials}
                workspace={this.props.workspace}
                compositeReplies={this.props.materialReplies}
              >
                <IconButton
                  icon="pdf"
                  aria-label={t("actions.openPDF", { ns: "common" })}
                  buttonModifiers={["toc-action"]}
                  disablePropagation={true}
                />
              </TableOfContentPDFDialog>
            </Dropdown>
          </>
        }
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

          const filteredChildren = node.children.filter((child) => {
            const isTheory = child.assignmentType === null;

            return this.state.assignmentTypeFilters.includes(
              child.assignmentType || (isTheory && "THEORY")
            );
          });

          const topic = (
            <TocTopic
              ref={this.handleCallbackTocTopicRef(nodeIndex)}
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
              onTitleKeyDown={this.handleTocTopicTitleKeyDown(
                `s-${node.workspaceMaterialId}`
              )}
              language={node.titleLanguage || this.props.workspace.language}
            >
              {!isTocTopicViewRestrictedFromUser &&
                filteredChildren.map((subnode, subNodeIndex) => {
                  // Boolean if there is view Restriction for toc element
                  const isTocElementViewRestricted =
                    subnode.viewRestrict === MaterialViewRestriction.LoggedIn ||
                    subnode.viewRestrict ===
                      MaterialViewRestriction.WorkspaceMembers;

                  const isAssignment = subnode.assignmentType === "EVALUATED";
                  const isExercise = subnode.assignmentType === "EXERCISE";
                  const isJournal = subnode.assignmentType === "JOURNAL";
                  const isInterimEvaluation =
                    subnode.assignmentType === "INTERIM_EVALUATION";

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
                        iconTitle = t("labels.assignment", {
                          context: "done",
                          ns: "materials",
                        });
                        break;
                      case "SUBMITTED":
                        icon = "check";
                        className = "toc__item--submitted";
                        iconTitle = t("labels.assignment", {
                          context: "returned",
                          ns: "materials",
                        });
                        break;
                      case "WITHDRAWN":
                        icon = "check";
                        className = "toc__item--withdrawn";
                        iconTitle = t("labels.assignment", {
                          context: "cancelled",
                          ns: "materials",
                        });
                        break;

                        break;
                      case "INCOMPLETE":
                        icon = "check";
                        className = "toc__item--incomplete";
                        iconTitle = t("labels.evaluated", {
                          context: "incomplete",
                          ns: "materials",
                        });
                        break;
                        break;
                      case "FAILED":
                        icon = "thumb-down";
                        className = "toc__item--failed";
                        iconTitle = t("labels.evaluated", {
                          context: "failed",
                          ns: "materials",
                        });
                        iconTitle = "Tittel";
                        break;
                      case "PASSED":
                        icon = "thumb-up";
                        className = "toc__item--passed";
                        iconTitle = t("labels.evaluated", {
                          context: "passed",
                          ns: "materials",
                        });
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
                      ref={this.handleCallbackTocElementRef(
                        `s-${node.workspaceMaterialId}`,
                        subNodeIndex
                      )}
                      key={subnode.workspaceMaterialId}
                      isActive={
                        this.props.activeNodeId === subnode.workspaceMaterialId
                      }
                      className={className}
                      isHidden={subnode.hidden || node.hidden}
                      iconAfter={icon}
                      iconAfterTitle={iconTitle}
                      hash={
                        this.props.doNotSetHashes
                          ? null
                          : "p-" + subnode.workspaceMaterialId
                      }
                      onKeyDown={this.handleTocElementKeyDown(
                        `s-${node.workspaceMaterialId}`
                      )}
                      onBlur={this.handleTocElementBlur(
                        `s-${node.workspaceMaterialId}`,
                        subNodeIndex
                      )}
                      lang={
                        subnode.titleLanguage ||
                        node.titleLanguage ||
                        this.props.workspace.language
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
                })}
              {isEditable && node?.children.length === 0 ? (
                <Droppable
                  key="LAST"
                  interactionData={node.workspaceMaterialId}
                  interactionGroup="TOC_SUBNODE"
                  className="toc__element--drag-placeholder-container"
                ></Droppable>
              ) : null}
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

const componentWithTranslation = withTranslation(["materials", "common"], {
  withRef: true,
})(ContentComponent);

export default connect(mapStateToProps, mapDispatchToProps, null, {
  withRef: true,
})(componentWithTranslation);
