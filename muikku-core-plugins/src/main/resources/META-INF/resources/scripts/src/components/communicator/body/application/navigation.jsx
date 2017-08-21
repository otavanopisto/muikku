import React from 'react';
import {connect} from 'react-redux';
import Link from '../../../general/link.jsx';

class Navigation extends React.Component {
  render(){
    const defaultNavigation = [
      {
        location: "inbox",
        type: "folder",
        id: "inbox",
        icon: "new-section",
        text: this.props.i18n.text.get("plugin.communicator.category.title.inbox")
      },
      {
        location: "unread",
        type: "folder",
        id: "unread",
        icon: "new-section",
        text: this.props.i18n.text.get("plugin.communicator.category.title.unread")
      },
      {
        location: "sent",
        type: "folder",
        id: "sent",
        icon: "new-section",
        text: this.props.i18n.text.get("plugin.communicator.category.title.sent")
      },
      {
        location: "trash",
        type: "folder",
        id: "trash",
        icon: "new-section",
        text: this.props.i18n.text.get("plugin.communicator.category.title.trash")
      }
    ]
    
    return <div className="communicator item-list communicator-item-list-navigation">
      {defaultNavigation.map((item, index)=>{
        let style = {};
        if (item.color){
          style.color = color;
        }
        return <Link key={index} className={`item-list-item ${this.props.hash === item.location ? "active" : ""}`} href={`#${item.location}`}>
          <span className={`icon icon-${item.icon}`} style={style}></span>
          <span className="item-list-text-body text">
            {item.text}
          </span>
        </Link>
      })}
    </div>
  }
}

function mapStateToProps(state){
  return {
    labels: state.labels,
    hash: state.hash,
    i18n: state.i18n
  }
};

const mapDispatchToProps = (dispatch)=>{
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Navigation);