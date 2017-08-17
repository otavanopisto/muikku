import Feed from '../general/feed.jsx';
import PropTypes from 'prop-types';
import React from 'react';

export default class FrontpageFeed extends React.Component {
  static propTypes = {
    feedReadTarget: PropTypes.string.isRequired,
    queryOptions: PropTypes.object.isRequired
  }
  constructor(props){
    super(props);
    
    this.state = {
      entries: []
    }
  }
  componentDidMount(){
    mApi().feed.feeds.read(this.props.feedReadTarget, this.props.queryOptions).callback((err, entries)=>{
      if (!err){
        this.setState({entries});
      }
    });
  }
  render(){
    return <Feed entries={this.state.entries}></Feed>
  }
}