import * as React from 'react';
import {connect, Dispatch} from 'react-redux';

import '~/sass/elements/link.scss';
import '~/sass/elements/application-panel.scss';
import '~/sass/elements/text.scss';
import '~/sass/elements/buttons.scss';
import '~/sass/elements/form-fields.scss';
import Link from '~/components/general/link';
import {i18nType} from '~/reducers/base/i18n';
import {DiscussionAreaListType} from '~/reducers/main-function/discussion/discussion-areas';
import {DiscussionType} from '~/reducers/main-function/discussion/discussion-threads';
import NewArea from './new-area-dialog';
import ModifyArea from './modify-area-dialog';
import DeleteArea from './delete-area-dialog';
import { StatusType } from '~/reducers/base/status';
import {StateType} from '~/reducers';

interface DiscussionToolbarProps {
  i18n: i18nType,
  areas: DiscussionAreaListType,
  discussionThreads: DiscussionType,
  status: StatusType
}

interface DiscussionToolbarState {
}

class CommunicatorToolbar extends React.Component<DiscussionToolbarProps, DiscussionToolbarState> {
  constructor(props: DiscussionToolbarProps){
    super(props);
    
    this.onSelectChange = this.onSelectChange.bind(this);
    this.onGoBackClick = this.onGoBackClick.bind(this);
  }
  onSelectChange(e: React.ChangeEvent<HTMLSelectElement>){
    window.location.hash = e.target.value;
  }
  onGoBackClick(e: Event){
    //TODO this is a retarded way to do things if we ever update to a SPA
    //it's a hacky mechanism to make history awesome, once we use a router it gotta be fixed
    if (history.replaceState){
      let canGoBack = (document.referrer.indexOf(window.location.host) !== -1) && (history.length);
      if (canGoBack){
        history.back();
      } else {
        let splitted = location.hash.split("/");
        history.replaceState('', '', splitted[0] + "/" + splitted[1]);
        window.dispatchEvent(new HashChangeEvent("hashchange"));
      }
    } else {
      let splitted = location.hash.split("/");
      location.hash = splitted[0] + "/" + splitted[1];
    }
  }
  render(){
    if (this.props.discussionThreads.current){
      let currentArea = this.props.areas.find((area)=>area.id === this.props.discussionThreads.current.forumAreaId);
      return <div className="application-panel__toolbar">
        <Link className="button-pill button-pill--go-back" onClick={this.onGoBackClick}>
          <span className="button-pill__icon icon-goback"></span>
        </Link>
        <div className="text text--discussion-current-thread">
          <div className={`text__discussion-breadcrumb-item text__discussion-breadcrumb-item--area-${currentArea.id}`}>
            {currentArea.name}
          </div>
          <div className="text__discussion-breadcrumb-arrow">
            <span className=" icon-arrow-right"></span>
          </div>
          <div className="text__discussion-breadcrumb-item">
            {this.props.discussionThreads.current.title}
          </div>
        </div>
      </div>
    }
    
    return <div className="application-panel__toolbar">
      <select className="form-field form-field--toolbar-selector" onChange={this.onSelectChange} value={this.props.discussionThreads.areaId || ""}>
        <option value="">{this.props.i18n.text.get("plugin.discussion.browseareas.all")}</option>
        {this.props.areas.map((area)=><option key={area.id} value={area.id}>
          {area.name}
        </option>)}
      </select>
      {this.props.status.permissions.FORUM_CREATEENVIRONMENTFORUM ? <NewArea><Link className="button-pill button-pill--discussion-toolbar">
        <span className="button-pill__icon icon-add"></span>
      </Link></NewArea> : null}
      {this.props.status.permissions.FORUM_UPDATEENVIRONMENTFORUM ? <ModifyArea><Link className="button-pill button-pill--discussion-toolbar" disabled={!this.props.discussionThreads.areaId}>
        <span className="button-pill__icon icon-edit"></span>
      </Link></ModifyArea> : null}
      {this.props.status.permissions.FORUM_DELETEENVIRONMENTFORUM ? <DeleteArea><Link className="button-pill button-pill--discussion-toolbar" disabled={!this.props.discussionThreads.areaId}>
        <span className="button-pill__icon icon-delete"></span>
      </Link></DeleteArea> : null}
    </div>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    areas: (state as any).areas,
    discussionThreads: (state as any).discussionThreads,
    status: state.status
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {}
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CommunicatorToolbar);