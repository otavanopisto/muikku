import * as React from 'react';
import { connect, Dispatch } from 'react-redux';
import { bindActionCreators } from 'redux';
import { colorIntToHex, getUserImageUrl } from '~/util/modifiers';
import equals = require( "deep-equal" );
import { i18nType } from '~/reducers/base/i18n';

import '~/sass/elements/empty.scss';
import '~/sass/elements/loaders.scss';
import '~/sass/elements/rich-text.scss';
import '~/sass/elements/discussion.scss';
import '~/sass/elements/avatar.scss';


import { DiscussionUserType, DiscussionType, DiscussionThreadType } from '~/reducers/main-function/discussion';
import { UserType } from '~/reducers/main-function/user-index';
import BodyScrollLoader from '~/components/general/body-scroll-loader';
import Pager from '~/components/general/pager';
import BodyScrollKeeper from '~/components/general/body-scroll-keeper';
import { StateType } from '~/reducers';
import OverflowDetector from '~/components/general/overflow-detector';
import { DiscussionThreads, DiscussionThread, DiscussionThreadHeader, DiscussionThreadBody, DiscussionThreadFooter } from './threads/threads';

interface DiscussionThreadsProps {
  discussion: DiscussionType,
  i18n: i18nType
}

interface DiscussionThreadsState {
}

class DDiscussionThreads extends React.Component<DiscussionThreadsProps, DiscussionThreadsState> {
  constructor( props: DiscussionThreadsProps ) {
    super( props );

    this.getToThread = this.getToThread.bind( this );
    this.getToPage = this.getToPage.bind( this );
  }
  getToPage( n: number ) {
    window.location.hash = ( this.props.discussion.areaId || 0 ) + "/" + n;
  }
  getToThread( thread: DiscussionThreadType ) {
    if ( this.props.discussion.areaId === thread.forumAreaId ) {
      window.location.hash = thread.forumAreaId + "/" + this.props.discussion.page +
        "/" + thread.id + "/1";
    }
    window.location.hash = thread.forumAreaId + "/1" +
      "/" + thread.id + "/1";
  }
  render() {
    if ( this.props.discussion.state === "LOADING" ) {
      return null;
    } else if ( this.props.discussion.state === "ERROR" ) {
      //TODO: put a translation here t! this happens when messages fail to load, a notification shows with the error
      //message but here we got to put something
      return <div className="empty"><span>{"ERROR"}</span></div>
    } else if (this.props.discussion.threads.length === 0 && !this.props.discussion.current) {
      return <div className="empty"><span>{this.props.i18n.text.get( "plugin.communicator.empty.topic" )}</span></div>
    }

    return <BodyScrollKeeper hidden={!!this.props.discussion.current}>
      <DiscussionThreads>{
        this.props.discussion.threads.map( ( thread: DiscussionThreadType, index: number ) => {
          let user: DiscussionUserType = thread.creator;

          let userCategory = thread.creator.id > 10 ? thread.creator.id % 10 + 1 : thread.creator.id;
          let threadCategory = thread.forumAreaId > 10 ? thread.forumAreaId % 10 + 1 : thread.forumAreaId;
          let avatar;
          if ( !user ) {
            //This is what it shows when the user is not ready
            avatar = <div className="avatar avatar--category-1"></div>;
          } else {
            //This is what it shows when the user is ready
            avatar = <object className="avatar-container"
              data={getUserImageUrl( user )}
              type="image/jpeg">
              <div className={`avatar avatar--category-${userCategory}`}>{user.firstName[0]}</div>
            </object>;
          }

          return (
            <DiscussionThread key={thread.id} onClick={this.getToThread.bind( this, thread )} avatar={avatar}>
              <DiscussionThreadHeader>
                {thread.locked ?
                  <div className="discussion__icon icon-lock"></div> : null
                }
                {thread.sticky ?
                  <div className="discussion__icon icon-pin"></div> : null
                }
                <div className={`discussion-category discussion-category--category-${threadCategory}`}>
                  <span>{thread.title}</span>
                </div>
              </DiscussionThreadHeader>                                   
              {thread.sticky ?
                <DiscussionThreadBody>
                  <OverflowDetector as="div" classNameWhenOverflown="application-list__item-body--discussion-message-overflow"
                    className="application-list__item-body--discussion-message rich-text" dangerouslySetInnerHTML={{ __html: thread.message }} />
                </DiscussionThreadBody> : null
              }
              <DiscussionThreadFooter>
                <div className="application-list__item-footer-content-main">
                  <span>{user && user.firstName + ' ' + user.lastName}, {this.props.i18n.time.format( thread.created )}</span>
                </div>
                <div className="application-list__item-footer-content-aside">
                  <div className="application-list__item-counter-container">
                    <span className="application-list__item-counter-title">{this.props.i18n.text.get( "plugin.discussion.titleText.replyCount" )} </span>
                    <span className="application-list__item-counter">{thread.numReplies}</span>
                  </div>
                  <div className="application-list__item-date">
                    <span>{this.props.i18n.text.get( "plugin.discussion.titleText.lastMessage" )} {this.props.i18n.time.format( thread.updated )}</span>
                  </div>
                </div>
              </DiscussionThreadFooter>
            </DiscussionThread>
          )
        } )
      }<Pager onClick={this.getToPage} current={this.props.discussion.page} pages={this.props.discussion.totalPages} />
      </DiscussionThreads>
    </BodyScrollKeeper>
  }
}

function mapStateToProps( state: StateType ) {
  return {
    i18n: state.i18n,
    discussion: state.discussion
  }
};

function mapDispatchToProps( dispatch: Dispatch<any> ) {
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)( DDiscussionThreads );
