import * as React from "react";
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
import Dropdown from "~/components/general/dropdown";
import Link from "~/components/general/link";
import {
  deleteCurrentMessageThread,
  addLabelToCurrentMessageThread,
  removeLabelFromSelectedMessageThreads,
  deleteSelectedMessageThreads,
  toggleMessageThreadsReadStatus,
  addMessagesNavigationLabel,
  addLabelToSelectedMessageThreads,
  removeLabelFromCurrentMessageThread,
  DeleteCurrentMessageThreadTriggerType,
  AddLabelToCurrentMessageThreadTriggerType,
  RemoveLabelFromSelectedMessageThreadsTriggerType,
  DeleteSelectedMessageThreadsTriggerType,
  ToggleMessageThreadsReadStatusTriggerType,
  AddMessagesNavigationLabelTriggerType,
  AddLabelToSelectedMessageThreadsTriggerType,
  RemoveLabelFromCurrentMessageThreadTriggerType,
  restoreCurrentMessageThread,
  RestoreCurrentMessageThreadTriggerType,
  restoreSelectedMessageThreads,
  RestoreSelectedMessageThreadsTriggerType,
  toggleMessageThreadReadStatus,
  ToggleMessageThreadReadStatusTriggerType,
  loadMessageThreads,
  LoadMessageThreadsTriggerType,
} from "~/actions/main-function/messages";
import {
  filterMatch,
  filterHighlight,
  intersect,
  difference,
  flatten,
} from "~/util/modifiers";
import LabelUpdateDialog from "../../dialogs/label-update";
import { MessagesState } from "~/reducers/main-function/messages";
import { StateType } from "~/reducers";
import "~/sass/elements/link.scss";
import "~/sass/elements/application-panel.scss";
import "~/sass/elements/buttons.scss";
import "~/sass/elements/glyph.scss";
import "~/sass/elements/form.scss";
import {
  ApplicationPanelToolbar,
  ApplicationPanelToolbarActionsMain,
  ApplicationPanelToolbarActionsAside,
  ApplicationPanelToolsContainer,
} from "~/components/general/application-panel/application-panel";
import { ButtonPill } from "~/components/general/button";
import { SearchFormElement } from "~/components/general/form-element";
import {
  ToggleSelectAllMessageThreadsTriggerType,
  toggleAllMessageItems,
} from "~/actions/main-function/messages/index";
import { AnyActionType } from "~/actions";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * CommunicatorToolbarProps
 */
interface CommunicatorToolbarProps extends WithTranslation {
  messages: MessagesState;
  deleteCurrentMessageThread: DeleteCurrentMessageThreadTriggerType;
  addLabelToCurrentMessageThread: AddLabelToCurrentMessageThreadTriggerType;
  removeLabelFromSelectedMessageThreads: RemoveLabelFromSelectedMessageThreadsTriggerType;
  deleteSelectedMessageThreads: DeleteSelectedMessageThreadsTriggerType;
  toggleMessageThreadsReadStatus: ToggleMessageThreadsReadStatusTriggerType;
  addMessagesNavigationLabel: AddMessagesNavigationLabelTriggerType;
  addLabelToSelectedMessageThreads: AddLabelToSelectedMessageThreadsTriggerType;
  removeLabelFromCurrentMessageThread: RemoveLabelFromCurrentMessageThreadTriggerType;
  restoreCurrentMessageThread: RestoreCurrentMessageThreadTriggerType;
  restoreSelectedMessageThreads: RestoreSelectedMessageThreadsTriggerType;
  toggleMessageThreadReadStatus: ToggleMessageThreadReadStatusTriggerType;
  loadMessageThreads: LoadMessageThreadsTriggerType;
  toggleAllMessageItems: ToggleSelectAllMessageThreadsTriggerType;
}

/**
 * CommunicatorToolbarState
 */
interface CommunicatorToolbarState {
  labelFilter: string;
  isCurrentRead: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchquery: any;
}

/**
 * CommunicatorToolbar
 */
class CommunicatorToolbar extends React.Component<
  CommunicatorToolbarProps,
  CommunicatorToolbarState
> {
  private focused: boolean;
  /**
   * constructor
   * @param props props
   */
  constructor(props: CommunicatorToolbarProps) {
    super(props);
    this.updateLabelFilter = this.updateLabelFilter.bind(this);
    this.onGoBackClick = this.onGoBackClick.bind(this);
    this.loadMessage = this.loadMessage.bind(this);
    this.onCreateNewLabel = this.onCreateNewLabel.bind(this);
    this.resetLabelFilter = this.resetLabelFilter.bind(this);
    this.toggleCurrentMessageReadStatus =
      this.toggleCurrentMessageReadStatus.bind(this);
    this.updateSearchWithQuery = this.updateSearchWithQuery.bind(this);
    this.onInputFocus = this.onInputFocus.bind(this);
    this.onInputBlur = this.onInputBlur.bind(this);

    this.focused = false;

    this.state = {
      labelFilter: "",
      isCurrentRead: true,
      searchquery: this.props.messages.selectedThreads || "",
    };
  }

  /**
   * UNSAFE_componentWillUpdate
   * @param nextProps nextProps
   * @param nextState nextState
   */
  // eslint-disable-next-line camelcase
  UNSAFE_componentWillUpdate(
    nextProps: CommunicatorToolbarProps,
    nextState: CommunicatorToolbarState
  ) {
    if (
      nextProps.messages.currentThread !== this.props.messages.currentThread
    ) {
      this.setState({
        isCurrentRead: true,
      });
    }
    if (
      !this.focused &&
      (nextProps.messages.query || "") !== this.state.searchquery
    ) {
      this.setState({
        searchquery: nextProps.messages.query || "",
      });
    }
  }

  /**
   * updateSearchWithQuery
   * @param query query
   */
  updateSearchWithQuery(query: string) {
    this.setState({
      searchquery: query,
    });
    this.props.loadMessageThreads(null, query);
  }

  /**
   * loadMessage
   * @param messageId messageId
   */
  loadMessage(messageId: number) {
    if (history.replaceState) {
      history.replaceState(
        "",
        "",
        location.hash.split("/")[0] + "/" + messageId
      );
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    } else {
      location.hash = location.hash.split("/")[0] + "/" + messageId;
    }
  }

  /**
   * updateLabelFilter
   * @param e e
   */
  updateLabelFilter(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ labelFilter: e.target.value });
  }

  /**
   * onCreateNewLabel
   */
  onCreateNewLabel() {
    if (this.state.labelFilter.trim()) {
      this.props.addMessagesNavigationLabel(this.state.labelFilter.trim());
      this.resetLabelFilter();
    }
  }

  /**
   * onGoBackClick
   * @param e e
   */
  onGoBackClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (history.replaceState) {
      const canGoBack =
        (!document.referrer ||
          document.referrer.indexOf(window.location.host) !== -1) &&
        history.length;
      if (canGoBack && location.hash.indexOf("?f") === -1) {
        history.back();
      } else {
        history.replaceState("", "", location.hash.split("/")[0]);
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      }
    } else {
      location.hash = location.hash.split("/")[0];
    }
  }

  /**
   * resetLabelFilter
   */
  resetLabelFilter() {
    this.setState({
      labelFilter: "",
    });
  }

  /**
   * toggleCurrentMessageReadStatus
   */
  toggleCurrentMessageReadStatus() {
    this.props.toggleMessageThreadReadStatus(
      this.props.messages.currentThread.messages[0].communicatorMessageId,
      !this.state.isCurrentRead
    );
    this.setState({
      isCurrentRead: !this.state.isCurrentRead,
    });
  }
  /**
   * onInputFocus
   */
  onInputFocus() {
    this.focused = true;
  }

  /**
   * onInputBlur
   */
  onInputBlur() {
    this.focused = false;
  }

  /**
   * render
   */
  render() {
    const currentLocation = this.props.messages.navigation.find(
      (item) => item.location === this.props.messages.location
    );

    if (!currentLocation) {
      return null;
    }

    const isUnreadOrInboxOrLabel: boolean =
      this.props.messages.location === "unread" ||
      this.props.messages.location === "inbox" ||
      this.props.messages.location.startsWith("label");

    if (this.props.messages.currentThread) {
      return (
        <ApplicationPanelToolbar>
          <ApplicationPanelToolbarActionsMain>
            <ButtonPill
              buttonModifiers="go-back"
              icon="back"
              onClick={this.onGoBackClick}
            />

            <div className="application-panel__mobile-current-folder">
              <span
                className={`glyph application-panel__mobile-current-folder-icon icon-${currentLocation.icon}`}
                style={{ color: currentLocation.color }}
              />
              <span className="application-panel__mobile-current-folder-title">
                {"  " + currentLocation.text}
              </span>
              {currentLocation.type === "label" ? (
                <LabelUpdateDialog label={currentLocation}>
                  <ButtonPill
                    buttonModifiers="toolbar-edit-label"
                    icon="pencil"
                  />
                </LabelUpdateDialog>
              ) : null}
            </div>
            {this.props.messages.location === "trash" ? (
              <ButtonPill
                buttonModifiers="restore"
                icon="undo"
                onClick={this.props.restoreCurrentMessageThread}
              />
            ) : null}
            <ButtonPill
              buttonModifiers="delete"
              icon="trash"
              onClick={this.props.deleteCurrentMessageThread}
            />
            <Dropdown
              modifier="communicator-labels"
              items={[
                <div
                  key="update-label"
                  className="form-element form-element--new-label"
                >
                  <input
                    className="form-element__input"
                    value={this.state.labelFilter}
                    onChange={this.updateLabelFilter}
                    type="text"
                    placeholder={this.props.i18n.t(
                      "labels.createAndSearchLabels",
                      { ns: "messaging" }
                    )}
                  />
                </div>,
                <Link
                  key="new-link"
                  tabIndex={0}
                  className="link link--full link--new"
                  onClick={this.onCreateNewLabel}
                >
                  {this.props.i18n.t("actions.create", {
                    ns: "messaging",
                    context: "label",
                  })}
                </Link>,
              ].concat(
                this.props.messages.navigation
                  .filter(
                    (item) =>
                      item.type === "label" &&
                      filterMatch(item.text, this.state.labelFilter)
                  )
                  .map((label) => {
                    const isSelected =
                      this.props.messages.currentThread.labels.find(
                        (l) => l.labelId === label.id
                      );
                    return (
                      <Link
                        key={label.id}
                        tabIndex={0}
                        className={`link link--full link--communicator-label-dropdown ${
                          isSelected ? "selected" : ""
                        }`}
                        onClick={
                          !isSelected
                            ? this.props.addLabelToCurrentMessageThread.bind(
                                null,
                                label
                              )
                            : this.props.removeLabelFromCurrentMessageThread.bind(
                                null,
                                label
                              )
                        }
                      >
                        <span
                          className="link__icon icon-tag"
                          style={{ color: label.color }}
                        ></span>
                        <span className="link__text">
                          {filterHighlight(label.text, this.state.labelFilter)}
                        </span>
                      </Link>
                    );
                  })
              )}
            >
              <ButtonPill buttonModifiers="label" icon="tag" />
            </Dropdown>
            {isUnreadOrInboxOrLabel ? (
              <ButtonPill
                buttonModifiers="toggle-read"
                icon={`${
                  this.state.isCurrentRead ? "envelope-open" : "envelope-alt"
                }`}
                onClick={
                  this.props.messages.toolbarLock
                    ? null
                    : this.toggleCurrentMessageReadStatus
                }
              />
            ) : null}
          </ApplicationPanelToolbarActionsMain>
          <ApplicationPanelToolbarActionsAside>
            <ButtonPill
              buttonModifiers="next-page"
              icon="arrow-left"
              disabled={
                this.props.messages.currentThread.newerThreadId === null
              }
              onClick={this.loadMessage.bind(
                this,
                this.props.messages.currentThread.newerThreadId
              )}
            />
            <ButtonPill
              buttonModifiers="prev-page"
              icon="arrow-right"
              disabled={
                this.props.messages.currentThread.olderThreadId === null
              }
              onClick={this.loadMessage.bind(
                this,
                this.props.messages.currentThread.olderThreadId
              )}
            />
          </ApplicationPanelToolbarActionsAside>
        </ApplicationPanelToolbar>
      );
    }

    let allInCommon: number[] = [];
    let onlyInSome: number[] = [];
    const isAtLeastOneSelected =
      this.props.messages.selectedThreads.length >= 1;
    if (isAtLeastOneSelected) {
      const partialIds: Array<Array<number>> =
        this.props.messages.selectedThreads.map((thread) =>
          thread.labels.map((l) => l.labelId)
        );
      allInCommon = intersect(...partialIds);
      onlyInSome = difference(allInCommon, flatten(...partialIds));
    }

    return (
      <ApplicationPanelToolbar>
        <div className="application-panel__mobile-current-folder">
          <span
            className={`glyph application-panel__mobile-current-folder-icon icon-${currentLocation.icon}`}
            style={{ color: currentLocation.color }}
          />
          <span className="application-panel__mobile-current-folder-title">
            {"  " + currentLocation.text}
          </span>
          {currentLocation.type === "label" ? (
            <LabelUpdateDialog label={currentLocation}>
              <ButtonPill buttonModifiers="toolbar-edit-label" icon="pencil" />
            </LabelUpdateDialog>
          ) : null}
        </div>

        {this.props.messages.location === "trash" ? (
          <ButtonPill
            buttonModifiers="restore"
            icon="undo"
            disabled={this.props.messages.selectedThreads.length == 0}
            onClick={this.props.restoreSelectedMessageThreads}
          />
        ) : null}
        <ButtonPill
          buttonModifiers="toggle"
          icon="check"
          disabled={this.props.messages.threads.length < 1}
          onClick={this.props.toggleAllMessageItems}
        />
        <ButtonPill
          buttonModifiers="delete"
          icon="trash"
          disabled={this.props.messages.selectedThreads.length == 0}
          onClick={this.props.deleteSelectedMessageThreads}
        />

        <Dropdown
          onClose={this.resetLabelFilter}
          modifier="communicator-labels"
          items={[
            <div
              key="update-label"
              className="form-element form-element--new-label"
            >
              <input
                className="form-element__input"
                value={this.state.labelFilter}
                onChange={this.updateLabelFilter}
                type="text"
                placeholder={this.props.i18n.t("labels.createAndSearchLabels", {
                  ns: "messaging",
                })}
              />
            </div>,
            <Link
              key="new-label"
              tabIndex={0}
              className="link link--full"
              onClick={this.onCreateNewLabel}
            >
              {this.props.i18n.t("actions.create", {
                ns: "messaging",
                context: "label",
              })}
            </Link>,
          ].concat(
            this.props.messages.navigation
              .filter(
                (item) =>
                  item.type === "label" &&
                  filterMatch(
                    // TODO: simplify and use i18next
                    item.text,
                    this.state.labelFilter
                  )
              )
              .map((label) => {
                const isSelected = allInCommon.includes(label.id as number);
                const isPartiallySelected = onlyInSome.includes(
                  label.id as number
                );
                return (
                  <Link
                    key={label.id}
                    tabIndex={0}
                    className={`link link--full link--communicator-label-dropdown ${
                      isSelected ? "selected" : ""
                    } ${isPartiallySelected ? "semi-selected" : ""} ${
                      isAtLeastOneSelected ? "" : "disabled"
                    }`}
                    onClick={
                      !isSelected || isPartiallySelected
                        ? this.props.addLabelToSelectedMessageThreads.bind(
                            null,
                            label
                          )
                        : this.props.removeLabelFromSelectedMessageThreads.bind(
                            null,
                            label
                          )
                    }
                  >
                    <span
                      className="link__icon icon-tag"
                      style={{ color: label.color }}
                    ></span>
                    <span className="link__text">
                      {filterHighlight(label.text, this.state.labelFilter)}
                    </span>
                  </Link>
                );
              })
          )}
        >
          <ButtonPill buttonModifiers="label" icon="tag" />
        </Dropdown>

        {isUnreadOrInboxOrLabel ? (
          <ButtonPill
            buttonModifiers="toggle-read"
            icon={`${
              this.props.messages.selectedThreads.length >= 1 &&
              !this.props.messages.selectedThreads[0].unreadMessagesInThread
                ? "envelope-open"
                : "envelope-alt"
            }`}
            disabled={this.props.messages.selectedThreads.length < 1}
            onClick={
              this.props.messages.toolbarLock
                ? null
                : this.props.toggleMessageThreadsReadStatus.bind(
                    null,
                    this.props.messages.selectedThreads
                  )
            }
          />
        ) : null}
        <ApplicationPanelToolsContainer>
          <SearchFormElement
            updateField={this.updateSearchWithQuery}
            name="message-search"
            id="searchMessages"
            onFocus={this.onInputFocus}
            onBlur={this.onInputBlur}
            // TODO: use i18next
            placeholder={this.props.i18n.t("labels.search", {
              ns: "messaging",
              context: "message",
            })}
            value={this.state.searchquery}
          />
        </ApplicationPanelToolsContainer>
      </ApplicationPanelToolbar>
    );
  }
}

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    messages: state.messages,
  };
}

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators(
    {
      deleteCurrentMessageThread,
      addLabelToCurrentMessageThread,
      removeLabelFromSelectedMessageThreads,
      deleteSelectedMessageThreads,
      toggleMessageThreadReadStatus,
      toggleMessageThreadsReadStatus,
      addMessagesNavigationLabel,
      addLabelToSelectedMessageThreads,
      removeLabelFromCurrentMessageThread,
      restoreCurrentMessageThread,
      restoreSelectedMessageThreads,
      loadMessageThreads,
      toggleAllMessageItems,
    },
    dispatch
  );
}

export default withTranslation(["messaging"])(
  connect(mapStateToProps, mapDispatchToProps)(CommunicatorToolbar)
);
