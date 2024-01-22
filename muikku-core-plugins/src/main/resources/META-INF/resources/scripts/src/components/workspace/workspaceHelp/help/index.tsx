/* eslint-disable camelcase */
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
import ContentPanel, {
  ContentPanelItem,
} from "~/components/general/content-panel";
import HelpMaterial from "./help-material-page";
import { ButtonPill } from "~/components/general/button";
import Dropdown from "~/components/general/dropdown";
import Link from "~/components/general/link";
import { bindActionCreators } from "redux";
import { Redirect } from "react-router-dom";
import { StatusType } from "~/reducers/base/status";
import { AnyActionType } from "~/actions";
import {
  setWorkspaceMaterialEditorState,
  createWorkspaceMaterialContentNode,
  updateWorkspaceMaterialContentNode,
  CreateWorkspaceMaterialContentNodeTriggerType,
  SetWorkspaceMaterialEditorStateTriggerType,
  UpdateWorkspaceMaterialContentNodeTriggerType,
} from "~/actions/workspaces/material";
import { withTranslation, WithTranslation } from "react-i18next";
import { MaterialViewRestriction } from "~/generated/client";
import ReadSpeakerReader from "~/components/general/readspeaker";

/**
 * HelpMaterialsProps
 */
interface HelpMaterialsProps extends WithTranslation {
  status: StatusType;
  workspace: WorkspaceDataType;
  materials: MaterialContentNodeWithIdAndLogic[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  navigation: React.ReactElement<any>;
  activeNodeId: number;
  workspaceEditMode: WorkspaceEditModeStateType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onActiveNodeIdChange: (activeNodeId: number) => any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onOpenNavigation: () => any;
  setWorkspaceMaterialEditorState: SetWorkspaceMaterialEditorStateTriggerType;
  createWorkspaceMaterialContentNode: CreateWorkspaceMaterialContentNodeTriggerType;
  updateWorkspaceMaterialContentNode: UpdateWorkspaceMaterialContentNodeTriggerType;
}

/**
 * HelpMaterialsState
 */
interface HelpMaterialsState {
  defaultOffset: number;
  redirect: string;
}

const DEFAULT_OFFSET = 67;

/**
 * Help
 */
class Help extends React.Component<HelpMaterialsProps, HelpMaterialsState> {
  private flattenedMaterial: MaterialContentNodeWithIdAndLogic[];
  /**
   * constructor
   * @param props props
   */
  constructor(props: HelpMaterialsProps) {
    super(props);

    this.state = {
      defaultOffset: DEFAULT_OFFSET,
      redirect: null,
    };

    this.onOpenNavigation = this.onOpenNavigation.bind(this);
    this.getFlattenedMaterials = this.getFlattenedMaterials.bind(this);
    this.onScroll = this.onScroll.bind(this);
    this.startupEditor = this.startupEditor.bind(this);
    this.createPage = this.createPage.bind(this);
    this.createSection = this.createSection.bind(this);
    this.pastePage = this.pastePage.bind(this);
    this.createPageFromBinary = this.createPageFromBinary.bind(this);
    this.toggleSectionHiddenStatus = this.toggleSectionHiddenStatus.bind(this);

    this.getFlattenedMaterials(props);
  }

  /**
   * componentDidMount
   */
  componentDidMount() {
    const defaultOffset =
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ((document.querySelector("#stick") as HTMLElement) || ({} as any))
        .offsetHeight || DEFAULT_OFFSET;
    if (defaultOffset !== this.state.defaultOffset) {
      this.setState({
        defaultOffset,
      });
    }

    window.addEventListener("scroll", this.onScroll);
  }

  /**
   * componentWillUnmount
   */
  componentWillUnmount() {
    window.removeEventListener("scroll", this.onScroll);
  }

  /**
   * UNSAFE_componentWillReceiveProps
   * @param nextProps nextProps
   */
  UNSAFE_componentWillReceiveProps(nextProps: HelpMaterialsProps) {
    if (this.props.materials !== nextProps.materials) {
      this.getFlattenedMaterials(nextProps);
    }
  }

  /**
   * toggleSectionHiddenStatus
   * @param section section
   */
  toggleSectionHiddenStatus(section: MaterialContentNodeWithIdAndLogic) {
    this.props.updateWorkspaceMaterialContentNode({
      workspace: this.props.workspace,
      material: section,
      update: {
        hidden: !section.hidden,
      },
      isDraft: false,
    });
  }

  /**
   * getMaterialsOptionListDropdown
   * @param section section
   * @param nextSection nextSection
   * @param nextSibling nextSibling
   * @param includesSection includesSection
   */
  getMaterialsOptionListDropdown(
    section: MaterialContentNodeWithIdAndLogic,
    nextSection: MaterialContentNodeWithIdAndLogic,
    nextSibling: MaterialContentNodeWithIdAndLogic,
    includesSection: boolean
  ) {
    const { t } = this.props;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const materialManagementItemsOptions: Array<any> = [
      {
        icon: "plus",
        text: t("labels.create_chapter", { ns: "materials" }),
        onClick: this.createSection.bind(this, nextSection),
        file: false,
      },
      {
        icon: "plus",
        text: t("labels.create_page", { ns: "materials" }),
        onClick: this.createPage.bind(this, section, nextSibling),
        file: false,
      },
      {
        icon: "paste",
        text: t("labels.paste", { ns: "materials" }),
        onClick: this.pastePage.bind(this, section, nextSibling),
        file: false,
      },
      {
        icon: "attachment",
        text: t("actions.add", { ns: "files" }),
        onChange: this.createPageFromBinary.bind(this, section, nextSibling),
        file: true,
      },
    ];

    if (!includesSection) {
      materialManagementItemsOptions.shift();
    }

    return materialManagementItemsOptions;
  }

  /**
   * startupEditor
   * @param section section
   */
  startupEditor(section: MaterialContentNodeWithIdAndLogic) {
    this.props.setWorkspaceMaterialEditorState({
      currentNodeWorkspace: this.props.workspace,
      currentNodeValue: section,
      currentDraftNodeValue: { ...section },
      parentNodeValue: null,
      section: true,
      opened: true,
      canHide: true,
      canDelete: true,
      disablePlugins: false,
      canPublish: true,
      canRevert: true,
      canRestrictView: true,
      canCopy: false,
      canChangePageType: false,
      canChangeExerciseType: false,
      canSetLicense: false,
      canSetProducers: false,
      canAddAttachments: false,
      canEditContent: false,
      showRemoveAnswersDialogForPublish: false,
      showRemoveAnswersDialogForDelete: false,
      showUpdateLinkedMaterialsDialogForPublish: false,
      showRemoveLinkedAnswersDialogForPublish: false,
      showUpdateLinkedMaterialsDialogForPublishCount: 0,
      canSetTitle: true,
    });
  }

  /**
   * createPage
   * @param section section
   * @param nextSibling nextSibling
   */
  createPage(
    section: MaterialContentNodeWithIdAndLogic,
    nextSibling: MaterialContentNodeWithIdAndLogic
  ) {
    const { t } = this.props;

    this.props.createWorkspaceMaterialContentNode(
      {
        workspace: this.props.workspace,
        rootParentId: this.props.workspace.details.helpFolderId,
        parentMaterial: section,
        nextSibling,
        title: t("labels.newPage", { ns: "materials" }),
        makeFolder: false,
      },
      "help"
    );
  }

  /**
   * createPageFromBinary
   * @param section section
   * @param nextSibling nextSibling
   * @param e e
   */
  createPageFromBinary(
    section: MaterialContentNodeWithIdAndLogic,
    nextSibling: MaterialContentNodeWithIdAndLogic,
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    this.props.createWorkspaceMaterialContentNode(
      {
        workspace: this.props.workspace,
        rootParentId: this.props.workspace.details.helpFolderId,
        parentMaterial: section,
        nextSibling,
        title: e.target.files[0].name,
        file: e.target.files[0],
        makeFolder: false,
      },
      "help"
    );
  }

  /**
   * createSection
   * @param nextSibling nextSibling
   */
  createSection(nextSibling: MaterialContentNodeWithIdAndLogic) {
    const { t } = this.props;

    this.props.createWorkspaceMaterialContentNode(
      {
        workspace: this.props.workspace,
        rootParentId: this.props.workspace.details.helpFolderId,
        nextSibling,
        title: t("labels.newPage", { ns: "materials" }),
        makeFolder: true,
      },
      "help"
    );
  }

  /**
   * pastePage
   * @param section section
   * @param nextSibling nextSibling
   */
  pastePage(
    section: MaterialContentNodeWithIdAndLogic,
    nextSibling: MaterialContentNodeWithIdAndLogic
  ) {
    const workspaceMaterialCopiedId =
      localStorage.getItem("workspace-material-copied-id") || null;
    const workspaceCopiedId =
      localStorage.getItem("workspace-copied-id") || null;

    if (workspaceMaterialCopiedId) {
      this.props.createWorkspaceMaterialContentNode(
        {
          workspace: this.props.workspace,
          parentMaterial: section,
          rootParentId: this.props.workspace.details.helpFolderId,
          nextSibling,
          copyMaterialId: parseInt(workspaceMaterialCopiedId),
          copyWorkspaceId: parseInt(workspaceCopiedId),
          makeFolder: false,
        },
        "help"
      );
    }
  }

  /**
   * getFlattenedMaterials
   * @param props props
   */
  getFlattenedMaterials(props: HelpMaterialsProps = this.props) {
    this.flattenedMaterial = [];
    if (!props.materials) {
      return;
    }
    props.materials.forEach((node) => {
      node.children.forEach((subnode) => {
        this.flattenedMaterial.push(subnode);
      });
    });
  }

  /**
   * onOpenNavigation
   */
  onOpenNavigation() {
    this.props.onOpenNavigation();
  }

  /**
   * onScroll
   */
  onScroll() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).IGNORE_SCROLL_EVENTS) {
      return;
    }
    const newActive: number = this.getActive();
    if (newActive !== this.props.activeNodeId) {
      this.props.onActiveNodeIdChange(newActive);
    }
  }

  /**
   * getActive
   */
  getActive() {
    //gets the current active node
    let winner: number = null;

    //when you are at the bottom the active is the last one
    const isAllTheWayToTheBottom =
      document.documentElement.scrollHeight -
        document.documentElement.scrollTop ===
      document.documentElement.clientHeight;
    if (!isAllTheWayToTheBottom) {
      let winnerTop: number = null;
      let winnerVisibleWeight: number = null;
      for (const refKey of Object.keys(this.refs)) {
        const refKeyInt = parseInt(refKey);
        if (!refKeyInt) {
          continue;
        }
        const element = (this.refs[refKey] as ContentPanelItem).getComponent();
        const elementTop = element.getBoundingClientRect().top;
        const elementBottom = element.getBoundingClientRect().bottom;
        const isVisible =
          elementTop < window.innerHeight &&
          elementBottom >=
            (document.querySelector("#stick") as HTMLElement).offsetHeight;
        if (isVisible) {
          let cropBottom = window.innerHeight - elementBottom;
          if (cropBottom > 0) {
            cropBottom = 0;
          }
          let cropTop = elementTop;
          if (cropTop > 0) {
            cropTop = 0;
          }
          const cropTotal = -cropTop - cropBottom;

          const visibleFraction =
            (element.offsetHeight - cropTotal) / element.offsetHeight;
          let weight = visibleFraction;
          if (!winner || elementTop < winnerTop) {
            weight += 0.4;
          }
          if (!winnerVisibleWeight || weight >= winnerVisibleWeight) {
            winner = refKeyInt;
            winnerTop = elementTop;
            winnerVisibleWeight = weight;
          }
        }
      }
    } else {
      winner =
        this.flattenedMaterial[this.flattenedMaterial.length - 1]
          .workspaceMaterialId;
    }

    winner = winner || this.flattenedMaterial[0].workspaceMaterialId;
    return winner;
  }

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
   * render
   */
  render() {
    const { t } = this.props;

    if (this.state.redirect) {
      return <Redirect push to={this.state.redirect} />;
    }

    if (!this.props.materials || !this.props.workspace) {
      return null;
    }

    const readSpeakerParameters: string[] = [];

    const isEditable = this.props.workspaceEditMode.active;

    const createSectionElementWhenEmpty =
      this.props.materials.length === 0 && isEditable ? (
        <div className="material-admin-panel material-admin-panel--master-functions">
          <Dropdown
            openByHover
            modifier="material-management-tooltip"
            content={t("labels.create_chapter", { ns: "materials" })}
          >
            <ButtonPill
              buttonModifiers="material-management-master"
              icon="plus"
              onClick={this.createSection.bind(this, null)}
            />
          </Dropdown>
        </div>
      ) : null;

    const emptyMessage =
      this.props.materials.length === 0 ? (
        <div className="material-page material-page--empty">
          {t("content.empty", { ns: "workspace", context: "instructions" })}
        </div>
      ) : null;

    const results: JSX.Element[] = [];

    this.props.materials.forEach((section, index) => {
      readSpeakerParameters.push(`sectionId${section.workspaceMaterialId}`);

      // If first section, then above it is "add new section" icon button
      // And it is only showed when editing is active
      if (index === 0 && isEditable) {
        results.push(
          <div
            key={"sectionfunctions-" + section.workspaceMaterialId}
            className="material-admin-panel material-admin-panel--master-functions"
          >
            <Dropdown
              openByHover
              modifier="material-management-tooltip"
              content={t("labels.create_chapter", { ns: "materials" })}
            >
              <ButtonPill
                buttonModifiers="material-management-master"
                icon="plus"
                onClick={this.createSection.bind(this, section)}
              />
            </Dropdown>
          </div>
        );
      }

      const nextSection = this.props.materials[index + 1] || null;

      // Management option, only showed when editing is active
      const lastManagementOptionsWithinSectionItem = isEditable ? (
        <div className="material-admin-panel material-admin-panel--master-functions">
          <Dropdown
            modifier="material-management"
            items={this.getMaterialsOptionListDropdown(
              section,
              nextSection,
              null,
              true
            ).map((item) => (closeDropdown: () => void) => {
              if (item.file) {
                return (
                  <label
                    htmlFor="baseFileInput"
                    className={`link link--full link--material-management-dropdown`}
                  >
                    <input
                      type="file"
                      id="baseFileInput"
                      onChange={(e) => {
                        closeDropdown();
                        item.onChange && item.onChange(e);
                      }}
                    />
                    <span className={`link__icon icon-${item.icon}`}></span>
                    <span>{item.text}</span>
                  </label>
                );
              }
              return (
                <Link
                  className={`link link--full link--material-management-dropdown`}
                  onClick={() => {
                    closeDropdown();
                    item.onClick && item.onClick();
                  }}
                >
                  <span className={`link__icon icon-${item.icon}`}></span>
                  <span>{item.text}</span>
                </Link>
              );
            })}
          >
            <ButtonPill
              buttonModifiers="material-management-master"
              icon="plus"
            />
          </Dropdown>
        </div>
      ) : null;

      // section is restricted in following cases:
      // section is restricted for logged in users and users is not logged in...
      // section is restricted for members only and user is not workspace member and isStudent or is not logged in...
      const isSectionViewRestricted =
        (section.viewRestrict === MaterialViewRestriction.LoggedIn &&
          !this.props.status.loggedIn) ||
        (section.viewRestrict === MaterialViewRestriction.WorkspaceMembers &&
          !this.props.workspace.isCourseMember &&
          (this.props.status.isStudent || !this.props.status.loggedIn));

      // "section pages"
      const sectionSpecificContentData: JSX.Element[] = [];

      // If section is restricted we don't return anything
      !isSectionViewRestricted &&
        section.children.forEach((node, pageI) => {
          // this is the next sibling for the content node that is to be added, aka the current
          const nextSibling = node;

          // Adding editing functions to page if editing is active
          if (isEditable) {
            sectionSpecificContentData.push(
              <div
                key={node.workspaceMaterialId + "-dropdown"}
                className="material-admin-panel material-admin-panel--master-functions"
              >
                <Dropdown
                  modifier="material-management"
                  items={this.getMaterialsOptionListDropdown(
                    section,
                    nextSection,
                    nextSibling,
                    false
                  ).map((item) => (closeDropdown: () => void) => {
                    if (item.file) {
                      return (
                        <label
                          htmlFor={node.workspaceMaterialId + "-input"}
                          className={`link link--full link--material-management-dropdown`}
                        >
                          <input
                            type="file"
                            id={node.workspaceMaterialId + "-input"}
                            onChange={(e) => {
                              closeDropdown();
                              item.onChange && item.onChange(e);
                            }}
                          />
                          <span
                            className={`link__icon icon-${item.icon}`}
                          ></span>
                          <span>{item.text}</span>
                        </label>
                      );
                    }
                    return (
                      <Link
                        className={`link link--full link--material-management-dropdown`}
                        onClick={() => {
                          closeDropdown();
                          item.onClick && item.onClick();
                        }}
                      >
                        <span className={`link__icon icon-${item.icon}`}></span>
                        <span>{item.text}</span>
                      </Link>
                    );
                  })}
                >
                  <ButtonPill
                    buttonModifiers="material-management-master"
                    icon="plus"
                  />
                </Dropdown>
              </div>
            );
          }

          let readSpeakerComponent = undefined;

          if (!this.props.workspaceEditMode.active) {
            const arrayOfSectionsToRemoved = Array(
              pageI === 0 ? index : index + 1
            )
              .fill(0)
              .map((_, i) => i);

            const arrayOfPagesToRemoved = Array(pageI)
              .fill(0)
              .map((_, i) => i);

            let contentToRead = [
              ...this.props.materials
                .filter((section, i) => !arrayOfSectionsToRemoved.includes(i))
                .map((section) => `sectionId${section.workspaceMaterialId}`),
            ];

            if (pageI !== 0) {
              contentToRead = [
                ...section.children
                  .filter((page, i) => !arrayOfPagesToRemoved.includes(i))
                  .map((page) => `pageId${page.workspaceMaterialId}`),
                ...contentToRead,
              ];
            }

            readSpeakerComponent = (
              <ReadSpeakerReader
                entityId={pageI + 1}
                readParameterType="readid"
                readParameters={contentToRead}
              />
            );
          }

          // Actual page material
          // Nothing is shown is workspace or material "compositeReplies" are missing or
          // editing is not active and material is hided and showEvenIfHidden is false
          const material =
            !this.props.workspace || (!isEditable && node.hidden) ? null : (
              <ContentPanelItem
                id={`pageId${node.workspaceMaterialId}`}
                ref={node.workspaceMaterialId + ""}
                key={node.workspaceMaterialId + ""}
              >
                <div
                  id={"p-" + node.workspaceMaterialId}
                  style={{
                    transform:
                      "translateY(" + -this.state.defaultOffset + "px)",
                  }}
                />
                {/*TOP OF THE PAGE*/}
                <HelpMaterial
                  folder={section}
                  materialContentNode={node}
                  workspace={this.props.workspace}
                  isViewRestricted={false}
                  readspeakerComponent={readSpeakerComponent}
                />
              </ContentPanelItem>
            );
          sectionSpecificContentData.push(material);
        });

      // Hidden materials are only shown if editing is active
      // Otherwise nothing is returned
      if (!isEditable && section.hidden) {
        return;
      }

      results.push(
        <section
          key={"section-" + section.workspaceMaterialId}
          className="content-panel__chapter"
          id={`sectionId${section.workspaceMaterialId}`}
        >
          <div
            id={"s-" + section.workspaceMaterialId}
            style={{
              transform: "translateY(" + -this.state.defaultOffset + "px)",
            }}
          />
          {/*TOP OF THE CHAPTER*/}
          <h2
            className={`content-panel__chapter-title ${
              section.hidden ? "content-panel__chapter-title--hidden" : ""
            }`}
          >
            {isEditable ? (
              <div className="material-admin-panel material-admin-panel--chapter-functions">
                <Dropdown
                  openByHover
                  modifier="material-management-tooltip"
                  content={t("labels.edit", {
                    ns: "materials",
                    context: "chapter",
                  })}
                >
                  <ButtonPill
                    buttonModifiers="material-management-chapter"
                    icon="pencil"
                    onClick={this.startupEditor.bind(this, section)}
                  />
                </Dropdown>
                <Dropdown
                  openByHover
                  modifier="material-management-tooltip"
                  content={
                    section.hidden
                      ? t("labels.setVisible", { ns: "materials" })
                      : t("labels.hide", { ns: "materials" })
                  }
                >
                  <ButtonPill
                    buttonModifiers="material-management-chapter"
                    icon="eye"
                    onClick={this.toggleSectionHiddenStatus.bind(this, section)}
                  />
                </Dropdown>
              </div>
            ) : null}
            <div
              className="content-panel__chapter-title-text"
              lang={section.titleLanguage || this.props.workspace.language}
            >
              {section.title}
            </div>
          </h2>

          {isSectionViewRestricted ? (
            <div className="content-panel__item">
              <article className="material-page">
                <div className="material-page__content material-page__content--view-restricted">
                  {this.buildViewRestrictionLocaleString(section.viewRestrict)}
                </div>
              </article>
            </div>
          ) : null}
          {sectionSpecificContentData}
          {lastManagementOptionsWithinSectionItem}
        </section>
      );
    });

    return (
      <ContentPanel
        onOpenNavigation={this.onOpenNavigation}
        modifier="workspace-instructions"
        navigation={this.props.navigation}
        title={t("labels.instructions", { ns: "workspace" })}
        ref="content-panel"
        readspeakerComponent={
          <ReadSpeakerReader
            readParameterType="readid"
            readParameters={readSpeakerParameters}
          />
        }
      >
        {results}
        {emptyMessage}
        {createSectionElementWhenEmpty}
      </ContentPanel>
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
    workspace: state.workspaces.currentWorkspace,
    materials: state.workspaces.currentHelp,
    activeNodeId: state.workspaces.currentMaterialsActiveNodeId,
    workspaceEditMode: state.workspaces.editMode,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators(
    {
      setWorkspaceMaterialEditorState,
      createWorkspaceMaterialContentNode,
      updateWorkspaceMaterialContentNode,
    },
    dispatch
  );
}

const componentWithTranslation = withTranslation(
  ["workspace", "materials", "files", "common"],
  {
    withRef: true,
  }
)(Help);

export default connect(mapStateToProps, mapDispatchToProps, null, {
  withRef: true,
})(componentWithTranslation);
