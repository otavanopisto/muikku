import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import Dropdown from '~/components/general/dropdown';
import Link from '~/components/general/link';
import {
  deleteCurrentMessageThread, addLabelToCurrentMessageThread, removeLabelFromSelectedMessageThreads,
  deleteSelectedMessageThreads, toggleMessageThreadsReadStatus, addMessagesNavigationLabel, addLabelToSelectedMessageThreads,
  removeLabelFromCurrentMessageThread, DeleteCurrentMessageThreadTriggerType,
  AddLabelToCurrentMessageThreadTriggerType, RemoveLabelFromSelectedMessageThreadsTriggerType, DeleteSelectedMessageThreadsTriggerType,
  ToggleMessageThreadsReadStatusTriggerType, AddMessagesNavigationLabelTriggerType, AddLabelToSelectedMessageThreadsTriggerType,
  RemoveLabelFromCurrentMessageThreadTriggerType, restoreCurrentMessageThread, RestoreCurrentMessageThreadTriggerType,
  restoreSelectedMessageThreads, RestoreSelectedMessageThreadsTriggerType,
  toggleMessageThreadReadStatus, ToggleMessageThreadReadStatusTriggerType, loadMessageThreads, LoadMessageThreadsTriggerType
} from '~/actions/main-function/messages';
import { filterMatch, filterHighlight, intersect, difference, flatten } from '~/util/modifiers';
import LabelUpdateDialog from '../../dialogs/label-update';
import { MessagesType } from '~/reducers/main-function/messages';
import { i18nType } from '~/reducers/base/i18n';
import { StateType } from '~/reducers';
import '~/sass/elements/link.scss';
import '~/sass/elements/application-panel.scss';
import '~/sass/elements/buttons.scss';
import '~/sass/elements/glyph.scss';
import '~/sass/elements/form-elements.scss';
import { ApplicationPanelToolbar, ApplicationPanelToolbarActionsMain, ApplicationPanelToolbarActionsAside } from '~/components/general/application-panel';
import { ButtonPill } from '~/components/general/button';
import { SearchFormElement } from '~/components/general/form-element';

interface CommunicatorToolbarProps {
  messages: MessagesType,
  i18n: i18nType

  deleteCurrentMessageThread: DeleteCurrentMessageThreadTriggerType,
  addLabelToCurrentMessageThread: AddLabelToCurrentMessageThreadTriggerType,
  removeLabelFromSelectedMessageThreads: RemoveLabelFromSelectedMessageThreadsTriggerType,
  deleteSelectedMessageThreads: DeleteSelectedMessageThreadsTriggerType,
  toggleMessageThreadsReadStatus: ToggleMessageThreadsReadStatusTriggerType,
  addMessagesNavigationLabel: AddMessagesNavigationLabelTriggerType,
  addLabelToSelectedMessageThreads: AddLabelToSelectedMessageThreadsTriggerType,
  removeLabelFromCurrentMessageThread: RemoveLabelFromCurrentMessageThreadTriggerType,
  restoreCurrentMessageThread: RestoreCurrentMessageThreadTriggerType,
  restoreSelectedMessageThreads: RestoreSelectedMessageThreadsTriggerType,
  toggleMessageThreadReadStatus: ToggleMessageThreadReadStatusTriggerType,
  loadMessageThreads: LoadMessageThreadsTriggerType,
}

interface CommunicatorToolbarState {
  labelFilter: string,
  isCurrentRead: boolean,
  searchquery: any
}

class CommunicatorToolbar extends React.Component<CommunicatorToolbarProps, CommunicatorToolbarState> {
  private searchTimer: NodeJS.Timer;
  private focused: boolean;
  constructor(props: CommunicatorToolbarProps) {
    super(props);
    this.updateLabelFilter = this.updateLabelFilter.bind(this);
    this.onGoBackClick = this.onGoBackClick.bind(this);
    this.loadMessage = this.loadMessage.bind(this);
    this.onCreateNewLabel = this.onCreateNewLabel.bind(this);
    this.resetLabelFilter = this.resetLabelFilter.bind(this);
    this.toggleCurrentMessageReadStatus = this.toggleCurrentMessageReadStatus.bind(this);
    this.updateSearchWithQuery = this.updateSearchWithQuery.bind(this);
    this.onInputFocus = this.onInputFocus.bind(this);
    this.onInputBlur = this.onInputBlur.bind(this);

    this.focused = false;

    this.state = {
      labelFilter: "",
      isCurrentRead: true,
      searchquery: this.props.messages.selectedThreads || ""
    }
  }

  updateSearchWithQuery(query: string) {
    clearTimeout(this.searchTimer);
    this.setState({
      searchquery: query
    });
    clearTimeout(this.searchTimer);
    this.searchTimer = setTimeout(this.props.loadMessageThreads.bind(null, null, query) as any, 600);
  }

  loadMessage(messageId: number) {
    if (history.replaceState) {
      history.replaceState('', '', location.hash.split("/")[0] + "/" + messageId);
      window.dispatchEvent(new HashChangeEvent("hashchange"));
    } else {
      location.hash = location.hash.split("/")[0] + "/" + messageId;
    }
  }
  updateLabelFilter(e: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ labelFilter: e.target.value });
  }
  onCreateNewLabel() {
    if (this.state.labelFilter.trim()) {
      this.props.addMessagesNavigationLabel(this.state.labelFilter.trim());
      this.resetLabelFilter();
    }
  }
  onGoBackClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (history.replaceState) {
      let canGoBack = (!document.referrer || document.referrer.indexOf(window.location.host) !== -1) && (history.length);
      if (canGoBack && location.hash.indexOf("?f") === -1) {
        history.back();
      } else {
        history.replaceState('', '', location.hash.split("/")[0]);
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      }
    } else {
      location.hash = location.hash.split("/")[0];
    }
  }
  resetLabelFilter() {
    this.setState({
      labelFilter: ""
    });
  }
  componentWillUpdate(nextProps: CommunicatorToolbarProps, nextState: CommunicatorToolbarState) {
    if (nextProps.messages.currentThread !== this.props.messages.currentThread) {
      this.setState({
        isCurrentRead: true
      });
    }
    if (!this.focused && (nextProps.messages.query || "") !== this.state.searchquery) {
      this.setState({
        searchquery: nextProps.messages.query || ""
      });
    }
  }
  toggleCurrentMessageReadStatus() {
    this.props.toggleMessageThreadReadStatus(this.props.messages.currentThread.messages[0].communicatorMessageId, !this.state.isCurrentRead);
    this.setState({
      isCurrentRead: !this.state.isCurrentRead
    });
  }
  onInputFocus() {
    this.focused = true;
  }

  onInputBlur() {
    this.focused = false;
  }

  render() {
    let currentLocation = this.props.messages.navigation.find((item) => {
      return (item.location === this.props.messages.location);
    });

    if (!currentLocation) {
      return null;
    }

    let isUnreadOrInboxOrLabel: boolean = (this.props.messages.location === "unread" || this.props.messages.location === "inbox" || this.props.messages.location.startsWith("label"));

    if (this.props.messages.currentThread) {
      return (
        <ApplicationPanelToolbar>
          <ApplicationPanelToolbarActionsMain>
            <ButtonPill buttonModifiers="go-back" icon="back" onClick={this.onGoBackClick} />

            <div className="application-panel__tool--current-folder">
              <span className={`glyph application-panel__tool-icon icon-${currentLocation.icon}`} style={{ color: currentLocation.color }} />
              <span className="application-panel__tool-title">{"  " + currentLocation.text(this.props.i18n)}</span>
              {currentLocation.type === "label" ? <LabelUpdateDialog label={currentLocation}>
                <ButtonPill buttonModifiers="toolbar-edit-label" icon="pencil" />
              </LabelUpdateDialog> : null}
            </div>
            {this.props.messages.location === "trash" ?
              <ButtonPill buttonModifiers="restore" icon="undo" onClick={this.props.restoreCurrentMessageThread} /> : null}
            <ButtonPill buttonModifiers="delete" icon="trash" onClick={this.props.deleteCurrentMessageThread} />
            <Dropdown modifier="communicator-labels" items={
              [
                <div className="form-element">
                  <input className="form-element__input" value={this.state.labelFilter} onChange={this.updateLabelFilter}
                    type="text" placeholder={this.props.i18n.text.get('plugin.communicator.label.create.textfield.placeholder')} />
                </div>,
                <Link tabIndex={0} className="link link--full link--new" onClick={this.onCreateNewLabel}>
                  {this.props.i18n.text.get("plugin.communicator.label.create")}
                </Link>
              ].concat(this.props.messages.navigation.filter((item) => {
                return item.type === "label" && filterMatch(item.text(this.props.i18n), this.state.labelFilter);
              }).map((label) => {
                let isSelected = this.props.messages.currentThread.labels.find(l => l.labelId === label.id);
                return (<Link tabIndex={0} className={`link link--full link--communicator-label-dropdown ${isSelected ? "selected" : ""}`}
                  onClick={!isSelected ? this.props.addLabelToCurrentMessageThread.bind(null, label) : this.props.removeLabelFromCurrentMessageThread.bind(null, label)}>
                  <span className="link__icon icon-tag" style={{ color: label.color }}></span>
                  <span className="link__text">{filterHighlight(label.text(this.props.i18n), this.state.labelFilter)}</span>
                </Link>);
              }))
            }>
              <ButtonPill buttonModifiers="label" icon="tag" />
            </Dropdown>
            {isUnreadOrInboxOrLabel ? <ButtonPill buttonModifiers="toggle-read" icon={`${this.state.isCurrentRead ? "envelope-open" : "envelope-alt"}`}
              onClick={this.props.messages.toolbarLock ? null : this.toggleCurrentMessageReadStatus} /> : null}

          </ApplicationPanelToolbarActionsMain>
          <ApplicationPanelToolbarActionsAside>
            <ButtonPill buttonModifiers="next-page" icon="arrow-left"
              disabled={this.props.messages.currentThread.newerThreadId === null}
              onClick={this.loadMessage.bind(this, this.props.messages.currentThread.newerThreadId)} />
            <ButtonPill buttonModifiers="prev-page" icon="arrow-right"
              disabled={this.props.messages.currentThread.olderThreadId === null}
              onClick={this.loadMessage.bind(this, this.props.messages.currentThread.olderThreadId)} />
          </ApplicationPanelToolbarActionsAside>
        </ApplicationPanelToolbar>
      )
    }

    let allInCommon: number[] = [];
    let onlyInSome: number[] = [];
    let isAtLeastOneSelected = this.props.messages.selectedThreads.length >= 1;
    if (isAtLeastOneSelected) {
      let partialIds: Array<Array<number>> = this.props.messages.selectedThreads.map((thread) => { return thread.labels.map(l => l.labelId) });
      allInCommon = intersect(...partialIds);
      onlyInSome = difference(allInCommon, flatten(...partialIds));
    }

    return <ApplicationPanelToolbar>
      <div className="application-panel__tool--current-folder">
        <span className={`glyph application-panel__tool-icon icon-${currentLocation.icon}`} style={{ color: currentLocation.color }} />
        <span className="application-panel__tool-title">{"  " + currentLocation.text(this.props.i18n)}</span>
        {currentLocation.type === "label" ? <LabelUpdateDialog label={currentLocation}>
          <ButtonPill buttonModifiers="toolbar-edit-label" icon="pencil" />
        </LabelUpdateDialog> : null}
      </div>

      {this.props.messages.location === "trash" ? <ButtonPill buttonModifiers="restore" icon="undo"
        disabled={this.props.messages.selectedThreads.length == 0} onClick={this.props.restoreSelectedMessageThreads} /> : null}
      <ButtonPill buttonModifiers="delete" icon="trash"
        disabled={this.props.messages.selectedThreads.length == 0} onClick={this.props.deleteSelectedMessageThreads} />

      <Dropdown onClose={this.resetLabelFilter} modifier="communicator-labels" items={
        [
          <div className="form-element">
            <input className="form-element__input" value={this.state.labelFilter} onChange={this.updateLabelFilter}
              type="text" placeholder={this.props.i18n.text.get('plugin.communicator.label.create.textfield.placeholder')} />
          </div>,
          <Link tabIndex={0} className="link link--full" onClick={this.onCreateNewLabel}>
            {this.props.i18n.text.get("plugin.communicator.label.create")}
          </Link>
        ].concat(this.props.messages.navigation.filter((item)=>{
          return item.type === "label" && filterMatch(item.text(this.props.i18n), this.state.labelFilter);
        }).map((label) => {
          let isSelected = allInCommon.includes(label.id as number);
          let isPartiallySelected = onlyInSome.includes(label.id as number);
          return (<Link tabIndex={0} className={`link link--full link--communicator-label-dropdown ${isSelected ? "selected" : ""} ${isPartiallySelected ? "semi-selected" : ""} ${isAtLeastOneSelected ? "" : "disabled"}`}
            onClick={!isSelected || isPartiallySelected ? this.props.addLabelToSelectedMessageThreads.bind(null, label) : this.props.removeLabelFromSelectedMessageThreads.bind(null, label)}>
            <span className="link__icon icon-tag" style={{ color: label.color }}></span>
            <span className="link__text">{filterHighlight(label.text(this.props.i18n), this.state.labelFilter)}</span>
          </Link>);
        }))
      }>
        <ButtonPill buttonModifiers="label" icon="tag" />
      </Dropdown>

      {isUnreadOrInboxOrLabel ? <ButtonPill buttonModifiers="toggle-read" icon={`${this.props.messages.selectedThreads.length >= 1 && !this.props.messages.selectedThreads[0].unreadMessagesInThread ? "envelope-open" : "envelope-alt"}`}
        disabled={this.props.messages.selectedThreads.length < 1}
        onClick={this.props.messages.toolbarLock ? null : this.props.toggleMessageThreadsReadStatus.bind(null, this.props.messages.selectedThreads)} /> : null}

      <SearchFormElement
        updateField={this.updateSearchWithQuery}
        name="message-search"
        id="searchMessages"
        onFocus={this.onInputFocus}
        onBlur={this.onInputBlur}
        placeholder={this.props.i18n.text.get('plugin.communicator.search.placeholder')}
        value={this.state.searchquery}
      />
    </ApplicationPanelToolbar>
  }
}

function mapStateToProps(state: StateType) {
  return {
    messages: state.messages,
    i18n: state.i18n
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>) {
  return bindActionCreators({
    deleteCurrentMessageThread, addLabelToCurrentMessageThread,
    removeLabelFromSelectedMessageThreads, deleteSelectedMessageThreads, toggleMessageThreadReadStatus,
    toggleMessageThreadsReadStatus, addMessagesNavigationLabel, addLabelToSelectedMessageThreads,
    removeLabelFromCurrentMessageThread, restoreCurrentMessageThread, restoreSelectedMessageThreads,
    loadMessageThreads
  }, dispatch);
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunicatorToolbar);
