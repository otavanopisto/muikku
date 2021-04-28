import Link from '../../general/link';
import * as React from 'react';
import {i18nType} from '~/reducers/base/i18n';
import {StatusType} from '~/reducers/base/status';
import {AnnouncementListType, AnnouncementType} from '~/reducers/announcements';

import '~/sass/elements/item-list.scss';
import '~/sass/elements/panel.scss';
import '~/sass/elements/label.scss';
import Pagination from 'react-js-pagination';
import { StateType } from '../../../reducers/index';
import { connect, Dispatch } from 'react-redux';

interface AnnouncementsPanelProps {
  i18n: i18nType,
  status: StatusType,
  announcements: AnnouncementListType
}

interface AnnouncementsPanelState {
  currentPage:number;
  announcements: AnnouncementListType;
  itemsPerPage: number
}

class AnnouncementsPanel extends React.Component<AnnouncementsPanelProps, AnnouncementsPanelState> {
  constructor(props: AnnouncementsPanelProps){
    super(props);

    this.state = {
      itemsPerPage: 5,
      currentPage: 1,
      announcements: props.announcements
    }
    this.handlePageChange = this.handlePageChange.bind(this);
  }

  /**
   * componentDidUpdate
   * @param prevProps
   * @param prevState
   */
  componentDidUpdate(prevProps: AnnouncementsPanelProps, prevState: AnnouncementsPanelState){
    console.log("componentDidUpdate 1");
    if(JSON.stringify(prevProps.announcements) !== JSON.stringify(this.props.announcements)){
      this.setState({
        announcements: this.props.announcements
      })
    }

  }

  /**
   * handleClick
   * @param event
   */
   handlePageChange(pageNumber: number) {
    this.setState({
      currentPage: pageNumber
    });
  }

  /**
   * render
   * @returns
   */
  render(){
    const { announcements, currentPage, itemsPerPage } = this.state;

    const indexOfLastTodo = currentPage * itemsPerPage;
    const indexOfFirstTodo = indexOfLastTodo - itemsPerPage;
    const currentAnnouncements = announcements.slice(indexOfFirstTodo, indexOfLastTodo);

    /**
     * renders announcements
     */
    const renderAnnouncements = currentAnnouncements.map((announcement: AnnouncementType)=>{
      let extraWorkspaces = announcement.workspaces && announcement.workspaces.length ? announcement.workspaces.length - 1 : 0;
      return <Link key={announcement.id} className={`item-list__item item-list__item--announcements ${announcement.workspaces.length ? "item-list__item--has-workspaces" : ""}`}
        href={`/announcements#${announcement.id}`} to={`/announcements#${announcement.id}`}>
        <span className="item-list__icon item-list__icon--announcements icon-paper-plane"></span>
        <span className="item-list__text-body item-list__text-body--multiline">
          <span className="item-list__announcement-caption">
            {announcement.caption}
          </span>
          <span className="item-list__announcement-date">
            {this.props.i18n.time.format(announcement.startDate)}
          </span>
          {announcement.workspaces && announcement.workspaces.length ?
            <div className="labels item-list__announcement-workspaces">
              <span className="label">
                <span className="label__icon label__icon--announcement-workspace icon-books"></span>
                <span className="label__text label__text--announcement-workspace">{announcement.workspaces[0].name} {announcement.workspaces[0].nameExtension ? "(" + announcement.workspaces[0].nameExtension + ")" : null }</span>
              </span>
              {extraWorkspaces ? <span className="label">{"(+" + extraWorkspaces + ")"}</span> : null}
            </div> : null}
        </span>
      </Link>
    })

    /**
     * renders pagination body as one of announcements list item
     */
    const renderPaginationBody = (<div className="item-list__item item-list__item--announcements" >
      <span className="item-list__text-body item-list__text-body--multiline" style={{display:"inline-block", textAlign:"center", margin:0}}>
          <Pagination 
            innerClass="pagination"
            activePage={currentPage}
            itemsCountPerPage={5}
            totalItemsCount={announcements.length}
            pageRangeDisplayed={3}
            onChange={this.handlePageChange}
           />
        </span>
      </div>);

    return (<div className="panel panel--announcements">
      <div className="panel__header">
        <div className="panel__header-icon panel__header-icon--announcements icon-paper-plane"></div>
        <h2 className="panel__header-title">{this.props.i18n.text.get('plugin.frontPage.announcements.title')}</h2>
      </div>
      {this.props.announcements.length ? (
        <div className="panel__body">
          <div className="item-list item-list--panel-announcements">
            {renderAnnouncements}
          </div>
          {renderPaginationBody}        
        </div>
        ) : (
          <div className="panel__body panel__body--empty">
            {this.props.i18n.text.get("plugin.frontPage.announcements.noAnnouncements")}
          </div>
      )}
    </div>);
  }
}

/**
 * mapStateToProps
 * @param state
 * @returns
 */
function mapStateToProps(state: StateType){
  return {
    status: state.status,
    i18n: state.i18n,
    announcements: state.announcements.announcements
  }
};

/**
 * mapDispatchToProps
 * @param dispatch
 * @returns
 */
function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AnnouncementsPanel);
