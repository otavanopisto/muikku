import * as React from 'react';
import {connect} from 'react-redux';
import Link from '~/components/general/link';
import LabelUpdateDialog from './label-update-dialog';
import {i18nType, CommunicatorNavigationItemListType, CommunicatorNavigationItemType, CommunicatorMessagesType} from '~/reducers';

interface NavigationProps {
  i18n: i18nType,
  communicatorNavigation: CommunicatorNavigationItemListType,
  communicatorMessages: CommunicatorMessagesType
}

interface NavigationState {
  
}

class Navigation extends React.Component<NavigationProps, NavigationState> {
  render(){
    return <div className="communicator item-list communicator-item-list-navigation">
      {this.props.communicatorNavigation.map((item: CommunicatorNavigationItemType)=>{
        let style: any = {};
        if (item.color){
          style.color = item.color;
        }
        
        return <Link key={item.id} className={`item-list-item ${this.props.communicatorMessages.location === item.location ? "active" : ""}`} href={`#${item.location}`}>
          <span className={`icon icon-${item.icon}`} style={style}></span>
          <span className="item-list-text-body text">
            {item.text(this.props.i18n)}
          </span>
          {item.type === "label" ? <LabelUpdateDialog label={item}>
            <Link disablePropagation as="span" className="communicator button-pill communicator-button-pill-navigation-edit-label">
              <span className="icon icon-edit"/>
            </Link>
          </LabelUpdateDialog> : null}
        </Link>
      })}
    </div>
  }
}

function mapStateToProps(state){
  return {
    i18n: state.i18n,
    communicatorNavigation: state.communicatorNavigation,
    communicatorMessages: state.communicatorMessages
  }
};

const mapDispatchToProps = (dispatch)=>{
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navigation);