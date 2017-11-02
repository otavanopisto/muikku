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
import NewArea from './new-area';
import ModifyArea from './modify-area';
import DeleteArea from './delete-area';


interface DiscussionToolbarProps {
  i18n: i18nType,
  areas: DiscussionAreaListType,
  discussionThreads: DiscussionType
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
          <span className="icon icon-goback"></span>
        </Link>
        <div className="text text--discussion-current-thread">
          {currentArea.name} >
          {this.props.discussionThreads.current.title}
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
      <NewArea><Link className="button-pill button-pill--discussion-toolbar">
        <span className="icon icon-add"></span>
      </Link></NewArea>
      <ModifyArea><Link className="button-pill button-pill--discussion-toolbar" disabled={!this.props.discussionThreads.areaId}>
        <span className="icon icon-edit"></span>
      </Link></ModifyArea>
      <DeleteArea><Link className="button-pill button-pill--discussion-toolbar" disabled={!this.props.discussionThreads.areaId}>
        <span className="icon icon-delete"></span>
      </Link></DeleteArea>
    </div>
  }
}

function mapStateToProps(state: any){
  return {
    i18n: state.i18n,
    areas: state.areas,
    discussionThreads: state.discussionThreads
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {}
};

export default (connect as any)(
  mapStateToProps,
  mapDispatchToProps
)(CommunicatorToolbar);