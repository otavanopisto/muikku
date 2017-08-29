import React from 'react';
import {connect} from 'react-redux';
import Link from '~/components/general/link.jsx';

class Navigation extends React.Component {
  render(){
    return <div className="communicator item-list communicator-item-list-navigation">
      {this.props.communicatorNavigation.map((item, index)=>{
        let style = {};
        if (item.color){
          style.color = item.color;
        }
        return <Link key={index} className={`item-list-item ${this.props.communicatorMessages.location === item.location ? "active" : ""}`} href={`#${item.location}`}>
          <span className={`icon icon-${item.icon}`} style={style}></span>
          <span className="item-list-text-body text">
            {item.text(this.props.i18n)}
          </span>
        </Link>
      })}
    </div>
  }
}

function mapStateToProps(state){
  return {
    labels: state.labels,
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