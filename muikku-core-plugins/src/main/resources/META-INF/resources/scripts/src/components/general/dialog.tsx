import Portal from "./portal";
import * as React from "react";
import "~/sass/elements/loaders.scss";
import "~/sass/elements/dialog.scss";
import "~/sass/elements/form.scss";
import { SearchFormElement } from "~/components/general/form-element";
import ApplicationList, {
  ApplicationListItemContentWrapper,
  ApplicationListItem,
  ApplicationListItemHeader,
} from "~/components/general/application-list";
import Tabs, { Tab } from "~/components/general/tabs";
import { UiSelectItem } from "../base/input-select-autofill";
import { SelectItem } from "~/actions/workspaces/index";
import Avatar from "~/components/general/avatar";
import PagerV2 from "~/components/general/pagerV2";

/**
 * DialogProps
 */
interface DialogProps {
  children?: React.ReactElement<any>;
  title: string | React.ReactElement<any>;
  executing?: boolean;
  executeContent?: React.ReactElement<any>;
  modifier?: string | Array<string>;
  content: (closePortal: () => void) => JSX.Element | JSX.Element[];
  disableScroll?: boolean;
  footer?: (closePortal: () => void) => JSX.Element;
  onOpen?: (e?: HTMLElement) => any;
  executeOnOpen?: () => any;
  onClose?: () => any;
  isOpen?: boolean;
  onKeyStroke?: (keyCode: number, closePortal: () => any) => any;
  closeOnOverlayClick?: boolean;
}

/**
 * DialogState
 */
interface DialogState {
  visible: boolean;
}

/**
 * Dialog
 */
export default class Dialog extends React.Component<DialogProps, DialogState> {
  private oldOverflow: string;

  /**
   * constructor
   * @param props props
   */
  constructor(props: DialogProps) {
    super(props);

    this.onOverlayClick = this.onOverlayClick.bind(this);
    this.onOpen = this.onOpen.bind(this);
    this.beforeClose = this.beforeClose.bind(this);
    this.oldOverflow = null;
    this.state = { visible: false };
  }

  /**
   * onOverlayClick
   * @param close c
   * @param e e
   */
  onOverlayClick(close: () => any, e: Event) {
    if (e.target === e.currentTarget) {
      close();
    }
  }

  /**
   * onOpen
   * @param element e
   */
  onOpen(element: HTMLElement) {
    setTimeout(() => {
      this.setState({
        visible: true,
      });
    }, 10);
    this.props.executeOnOpen && this.props.executeOnOpen();
    this.props.onOpen && this.props.onOpen(element);

    if (this.props.disableScroll == true) {
      document.body.style.overflow = "hidden";
    }
    if (element.childNodes && element.childNodes[0]) {
      const el = element.childNodes[0].firstChild as HTMLElement;
      const marginOffset = 20;
      document.body.style.marginBottom = el.offsetHeight - marginOffset + "px";
    }
  }

  /**
   * beforeClose
   * @param DOMNode d
   * @param removeFromDOM r
   */
  beforeClose(DOMNode: HTMLElement, removeFromDOM: () => any) {
    this.setState({
      visible: false,
    });
    if (this.props.disableScroll == true) {
      document.body.style.overflow = "auto";
    }
    document.body.style.marginBottom = "0";
    setTimeout(removeFromDOM, 300);
  }

  /**
   * render
   * @returns JSX.Element
   */
  render() {
    let closeOnOverlayClick = true;
    if (typeof this.props.closeOnOverlayClick !== "undefined") {
      closeOnOverlayClick = !!this.props.closeOnOverlayClick;
    }
    return (
      <Portal
        onKeyStroke={this.props.onKeyStroke}
        isOpen={this.props.isOpen}
        openByClickOn={this.props.children}
        onOpen={this.onOpen}
        onClose={this.props.onClose}
        beforeClose={this.beforeClose}
        closeOnEsc
      >
        {(closePortal: () => any) => {
          const modifiers: Array<string> =
            typeof this.props.modifier === "string"
              ? [this.props.modifier]
              : this.props.modifier;
          return (
            <div
              className={`dialog ${(modifiers || [])
                .map((s) => `dialog--${s}`)
                .join(" ")} ${this.state.visible ? "dialog--visible" : ""}`}
              onClick={
                closeOnOverlayClick
                  ? this.onOverlayClick.bind(this, closePortal)
                  : null
              }
            >
              {/* Execution container is missing from here */}
              <section
                role="dialog"
                aria-labelledby={`dialog-title--${modifiers[0]}`}
                aria-modal="true"
                className={`dialog__window ${(modifiers || [])
                  .map((s) => `dialog__window--${s}`)
                  .join(" ")}`}
              >
                {this.props.executing && this.props.executing === true ? (
                  <div className="dialog__overlay dialog__overlay--executing">
                    {this.props.executeContent ? (
                      <div className="dialog__overlay-content">
                        <div className="loader__executing--dialog"></div>
                        {this.props.executeContent}
                      </div>
                    ) : (
                      <div className="loader__executing"></div>
                    )}
                  </div>
                ) : null}
                <header
                  className={`dialog__header ${(modifiers || [])
                    .map((s) => `dialog__header--${s}`)
                    .join(" ")}`}
                >
                  <div
                    className="dialog__title"
                    id={`dialog-title--${modifiers[0]}`}
                  >
                    {this.props.title}
                  </div>
                  <div
                    className="dialog__close icon-cross"
                    onClick={closePortal}
                  ></div>
                </header>
                <section
                  className={`dialog__content ${(modifiers || [])
                    .map((s) => `dialog__content--${s}`)
                    .join(" ")}`}
                >
                  {this.props.content(closePortal)}
                </section>
                {this.props.footer ? (
                  <footer
                    className={`dialog__footer ${(modifiers || [])
                      .map((s) => `dialog__footer--${s}`)
                      .join(" ")}`}
                  >
                    {this.props.footer && this.props.footer(closePortal)}
                  </footer>
                ) : null}
              </section>
            </div>
          );
        }}
      </Portal>
    );
  }
}

/**
 * DialogRowProps
 */
interface DialogRowProps {
  modifiers?: string | Array<string>;
}

/**
 * DialogRowState
 */
interface DialogRowState {}

/**
 * DialogRow
 */
export class DialogRow extends React.Component<DialogRowProps, DialogRowState> {
  /**
   * render
   * @returns JSX.Element
   */
  render() {
    const modifiers =
      this.props.modifiers && this.props.modifiers instanceof Array
        ? this.props.modifiers
        : [this.props.modifiers];
    return (
      <div
        className={`dialog__content-row ${
          this.props.modifiers
            ? modifiers.map((m) => `dialog__content-row--${m}`).join(" ")
            : ""
        }`}
      >
        {this.props.children}
      </div>
    );
  }
}

/**
 * DialogTitleContainerProps
 */
interface DialogTitleContainerProps {
  modifier?: string;
}

/**
 * DialogTitleContainer
 * @param props DialogTitleContainerProps
 * @returns  JSX.Element
 */
export const DialogTitleContainer: React.FC<DialogTitleContainerProps> = (
  props
) => (
  <div
    className={`dialog__title-sub-container ${
      props.modifier ? "dialog__title-container--" + props.modifier : ""
    }`}
  >
    {props.children}
  </div>
);

/**
 * DialogTitleProps
 */
interface DialogTitleProps {
  modifier?: string;
}

/**
 * DialogTitleItem
 * @param props DialogTitleProps
 * @returns JSX.Element
 */
export const DialogTitleItem: React.FC<DialogTitleProps> = (props) => (
  <span
    className={`dialog__title-item ${
      props.modifier ? "dialog__title-item--" + props.modifier : ""
    }`}
  >
    {props.children}
  </span>
);

/**
 * DialogRowHeaderProps
 */
interface DialogRowHeaderProps {
  modifiers?: string | Array<string>;
  title: string;
  description?: string;
}

/**
 * DialogRowHeaderState
 */
interface DialogRowHeaderState {}

/**
 * DialogRowHeader
 */
export class DialogRowHeader extends React.Component<
  DialogRowHeaderProps,
  DialogRowHeaderState
> {
  /**
   * render
   * @returns JSX.Element
   */
  render() {
    const modifiers =
      this.props.modifiers && this.props.modifiers instanceof Array
        ? this.props.modifiers
        : [this.props.modifiers];
    return (
      <div
        className={`dialog__content-row-header ${
          this.props.modifiers
            ? modifiers.map((m) => `dialog__content-row-header--${m}`).join(" ")
            : ""
        }`}
      >
        <div
          className={`dialog__content-row-header-title ${
            this.props.modifiers
              ? modifiers
                  .map((m) => `dialog__content-row-title--${m}`)
                  .join(" ")
              : ""
          }`}
        >
          {this.props.title}
        </div>
        {this.props.description ? (
          <div
            className={`dialog__content-row-header-description ${
              this.props.modifiers
                ? modifiers
                    .map((m) => `dialog__content-row-title-description--${m}`)
                    .join(" ")
                : ""
            }`}
          >
            {this.props.description}
          </div>
        ) : null}
      </div>
    );
  }
}

/**
 * DialogRowContentProps
 */
interface DialogRowContentProps {
  modifiers?: string | Array<string>;
}

/**
 * DialogRowContentState
 */
interface DialogRowContentState {}

/**
 * DialogRowContent
 */
export class DialogRowContent extends React.Component<
  DialogRowContentProps,
  DialogRowContentState
> {
  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const modifiers =
      this.props.modifiers && this.props.modifiers instanceof Array
        ? this.props.modifiers
        : [this.props.modifiers];
    return (
      <div
        className={`dialog__content-row-content ${
          this.props.modifiers
            ? modifiers
                .map((m) => `dialog__content-row-content--${m}`)
                .join(" ")
            : ""
        }`}
      >
        {this.props.children}
      </div>
    );
  }
}

/**
 * DialogRemoveUsersProps
 */
interface DialogRemoveUsersProps {
  users: SelectItem[];
  removeUsers: UiSelectItem[];
  pages: number;
  placeholder: string;
  identifier: string;
  allTabTitle: string;
  removeTabTitle: string;
  onEmptyTitle: string;
  searchValue: string;
  searchUsers: (q: string) => any;
  changePage: (n: number) => any;
  setRemoved: (u: UiSelectItem) => any;
}

/**
 * DialogRemoveUsersState
 */
interface DialogRemoveUsersState {
  activeTab: string;
  removeUsersPage: UiSelectItem[];
  currentAllPage: number;
  currentRemovePage: number;
}

/**
 * DialogRemoveUsers
 */
export class DialogRemoveUsers extends React.Component<
  DialogRemoveUsersProps,
  DialogRemoveUsersState
> {
  private maxRemoveUsersPerPage: number;

  /**
   * constructor
   * @param props props
   */
  constructor(props: DialogRemoveUsersProps) {
    super(props);
    this.maxRemoveUsersPerPage = 6;
    this.state = {
      removeUsersPage: [],
      activeTab: this.props.identifier + "-ALL",
      currentAllPage: 1,
      currentRemovePage: 1,
    };

    this.onTabChange = this.onTabChange.bind(this);
    this.goToAllUsersPage = this.goToAllUsersPage.bind(this);
    this.goToRemovePage = this.goToRemovePage.bind(this);
    this.turnSelectToUiSelectItem = this.turnSelectToUiSelectItem.bind(this);
    this.toggleUserRemoved = this.toggleUserRemoved.bind(this);
    this.refreshRemoveUserpage = this.refreshRemoveUserpage.bind(this);
    this.checkUserInRemoveList = this.checkUserInRemoveList.bind(this);
  }

  /**
   * componentDidMount
   */
  componentDidMount() {
    this.refreshRemoveUserpage(
      this.state.currentRemovePage,
      this.props.removeUsers
    );
    this.goToAllUsersPage(this.state.currentAllPage);
  }

  /**
   * UNSAFE_componentWillReceiveProps
   * @param nextProps
   * @param nextState
   */
  UNSAFE_componentWillReceiveProps(nextProps: DialogRemoveUsersProps) {
    if (this.props.removeUsers.length !== nextProps.removeUsers.length) {
      this.refreshRemoveUserpage(
        this.state.currentRemovePage,
        nextProps.removeUsers
      );
    }
  }

  /**
   * goToAllUsersPage
   * @param n n
   */
  goToAllUsersPage(n: number) {
    this.setState({ currentAllPage: n });
    this.props.changePage(n);
  }

  /**
   * goToRemovePage
   * @param n n
   */
  goToRemovePage(n: number) {
    this.setState({ currentRemovePage: n });
    this.refreshRemoveUserpage(n, this.props.removeUsers);
  }

  /**
   * turnSelectToUiSelectItem
   * @param user u
   * @returns UiSelectItem object
   */
  turnSelectToUiSelectItem(user: SelectItem) {
    return {
      ...user,
      icon: "user",
    } as UiSelectItem;
  }

  /**
   * refreshRemoveUserpage
   * @param page p
   * @param removeUsers r
   */
  refreshRemoveUserpage(page: number, removeUsers: UiSelectItem[]) {
    const pageStart: number = (page - 1) * this.maxRemoveUsersPerPage;
    const pageEnd: number = pageStart + this.maxRemoveUsersPerPage;
    let newRemoveUsers: UiSelectItem[] = [];

    for (let i = pageStart; i < pageEnd; i++) {
      if (removeUsers[i]) {
        newRemoveUsers = newRemoveUsers.concat(removeUsers[i]);
      }
    }
    this.setState({ removeUsersPage: newRemoveUsers });
    if (newRemoveUsers.length === 0 && this.state.currentRemovePage !== 1) {
      this.goToRemovePage(this.state.currentRemovePage - 1);
    }
  }

  /**
   * toggleUserRemoved
   * @param user u
   */
  toggleUserRemoved(user: SelectItem) {
    this.props.setRemoved(this.turnSelectToUiSelectItem(user));
  }

  /**
   * checkUserInRemoveList
   * @param user u
   * @param removedListUsers r
   * @returns boolean
   */
  checkUserInRemoveList(user: string, removedListUsers: UiSelectItem[]) {
    for (let i = 0; i < removedListUsers.length; i++) {
      if (user === removedListUsers[i].id) {
        return true;
      }
    }
    return false;
  }

  // Userids we receive are a string like "PYRAMUS-STAFF-USER-12"
  // So we need the digits from the end of the string for the avatar

  /**
   * getNumberFromUserId
   * @param id id
   * @returns number
   */
  getNumberFromUserId = (id: string): number => {
    const digitRegEx = /\d+/;
    return parseInt(digitRegEx.exec(id)[0]);
  };

  /**
   * onTabChange
   * @param identifier
   */
  onTabChange(identifier: string) {
    this.setState({
      activeTab: identifier,
    });
  }

  /**
   * handles page changes,
   * sets selected page as currentPage to state
   * @param selectedItem selectedItem
   * @param selectedItem.selected selected
   */
  handleRemoveUsersPagerChange = (selectedItem: { selected: number }) =>
    this.goToRemovePage(selectedItem.selected + 1);

  /**
   * handles page changes,
   * sets selected page as currentPage to state
   * @param selectedItem selectedItem
   * @param selectedItem.selected selected
   */
  handleAllUsersPagerChange = (selectedItem: { selected: number }) =>
    this.goToAllUsersPage(selectedItem.selected + 1);

  /**
   * Component render method
   * @returns JSX.Element
   */
  render() {
    const removePages = Math.ceil(
      this.props.removeUsers.length / this.maxRemoveUsersPerPage
    );
    const tabs: Tab[] = [
      {
        id: this.props.identifier + "-ALL",
        name: this.props.allTabTitle,

        // eslint-disable-next-line
        component: (
          <DialogRow modifiers="user-search">
            <form>
              <SearchFormElement
                name="search-user-group-users"
                placeholder={this.props.placeholder}
                value={this.props.searchValue}
                id="searchUserGroupUsers"
                updateField={this.props.searchUsers}
              />
            </form>
            <DialogRow>
              <ApplicationList modifiers="dialog-users">
                {this.props.users.length > 0 ? (
                  this.props.users.map((user: SelectItem) => (
                    <ApplicationListItem
                      className="course"
                      classState={
                        this.checkUserInRemoveList(
                          user.id as string,
                          this.props.removeUsers
                        )
                          ? "disabled"
                          : ""
                      }
                      key={"all-" + user.id}
                    >
                      <ApplicationListItemContentWrapper
                        modifiers="dialog-remove-users"
                        asideModifiers="user"
                        aside={
                          <Avatar
                            id={
                              user.variables && user.variables.identifier
                                ? (user.variables.identifier as number)
                                : this.getNumberFromUserId(user.id as string)
                            }
                            hasImage={
                              user.variables && user.variables.boolean
                                ? user.variables.boolean
                                : false
                            }
                            firstName={user.label}
                            size="small"
                          />
                        }
                      >
                        <ApplicationListItemHeader
                          onClick={this.toggleUserRemoved.bind(this, user)}
                          modifiers="course"
                        >
                          <span className="application-list__header-primary">
                            {user.label}
                          </span>
                          <span className="application-list__header-secondary"></span>
                        </ApplicationListItemHeader>
                      </ApplicationListItemContentWrapper>
                    </ApplicationListItem>
                  ))
                ) : (
                  <div className="empty">{this.props.onEmptyTitle}</div>
                )}
              </ApplicationList>
            </DialogRow>
            <DialogRow>
              <PagerV2
                previousLabel=""
                nextLabel=""
                breakLabel="..."
                initialPage={this.state.currentAllPage - 1}
                forcePage={this.state.currentAllPage - 1}
                marginPagesDisplayed={1}
                pageCount={this.props.pages}
                pageRangeDisplayed={2}
                onPageChange={this.handleAllUsersPagerChange}
              />
            </DialogRow>
          </DialogRow>
        ),
      },
      {
        id: this.props.identifier + "-REMOVE",
        name: this.props.removeTabTitle,

        // eslint-disable-next-line
        component: (
          <DialogRow>
            <DialogRow>
              <DialogRow>
                <ApplicationList modifiers="dialog-remove-users">
                  {this.state.removeUsersPage.length > 0 ? (
                    this.state.removeUsersPage.map((user: UiSelectItem) => (
                      <ApplicationListItem
                        className="course"
                        key={"remove-" + user.id}
                      >
                        <ApplicationListItemContentWrapper
                          modifiers="dialog-remove-users"
                          asideModifiers="user"
                          aside={
                            <Avatar
                              id={
                                user.variables && user.variables.identifier
                                  ? (user.variables.identifier as number)
                                  : this.getNumberFromUserId(user.id as string)
                              }
                              hasImage={
                                user.variables && user.variables.boolean
                                  ? user.variables.boolean
                                  : false
                              }
                              firstName={user.label}
                              size="small"
                            />
                          }
                        >
                          <ApplicationListItemHeader
                            onClick={this.toggleUserRemoved.bind(this, user)}
                            modifiers="course"
                          >
                            <span className="application-list__header-primary">
                              {user.label}
                            </span>
                            <span className="application-list__header-secondary"></span>
                          </ApplicationListItemHeader>
                        </ApplicationListItemContentWrapper>
                      </ApplicationListItem>
                    ))
                  ) : (
                    <div className="empty">{this.props.onEmptyTitle}</div>
                  )}
                </ApplicationList>
              </DialogRow>
              <DialogRow>
                {this.props.removeUsers.length > 0 ? (
                  <PagerV2
                    previousLabel=""
                    nextLabel=""
                    breakLabel="..."
                    nextAriaLabel="Seuraava"
                    previousAriaLabel="Edellinen"
                    initialPage={this.state.currentRemovePage - 1}
                    forcePage={this.state.currentRemovePage - 1}
                    marginPagesDisplayed={1}
                    pageCount={removePages}
                    pageRangeDisplayed={2}
                    onPageChange={this.handleRemoveUsersPagerChange}
                  />
                ) : null}
              </DialogRow>
            </DialogRow>
            <DialogRow>
              {this.props.removeUsers.length > 0 ? (
                <PagerV2
                  previousLabel=""
                  nextLabel=""
                  breakLabel="..."
                  nextAriaLabel="Seuraava"
                  previousAriaLabel="Edellinen"
                  initialPage={this.state.currentRemovePage - 1}
                  forcePage={this.state.currentRemovePage - 1}
                  marginPagesDisplayed={1}
                  pageCount={removePages}
                  pageRangeDisplayed={2}
                  onPageChange={this.handleRemoveUsersPagerChange}
                />
              ) : null}
            </DialogRow>
          </DialogRow>
        ),
      },
    ];

    return (
      <Tabs
        onTabChange={this.onTabChange}
        renderAllComponents
        activeTab={this.state.activeTab}
        tabs={tabs}
      />
    );
  }
}
