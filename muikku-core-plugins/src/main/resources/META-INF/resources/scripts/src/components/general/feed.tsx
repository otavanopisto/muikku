import * as PropTypes from 'prop-types';
import * as React from 'react';
import {connect} from 'react-redux';
import {i18nType} from '~/reducers/index.d';

interface FeedProps {
  entries: Array<{
    publicationDate: string,
    description: string,
    link: string,
    title: string
  }>,
  i18n: i18nType
}

interface FeedState {
  
}

class Feed extends React.Component<FeedProps, FeedState> {
  render(){
    return <ul className="feed">
      {this.props.entries.map((entry, index)=>{
        return <li className="feed-item">
          <span className="feed-item-description">
            <a href={entry.link} target="top">{entry.title}</a>
            {entry.description}
          </span>
          <span className="feed-item-date">{this.props.i18n.time.format(entry.publicationDate)}</span>
        </li>
      })}
    </ul>
  }
}

function mapStateToProps(state){
  return {
    i18n: state.i18n
  }
};

const mapDispatchToProps = (dispatch)=>{
  return {};
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Feed);