import Feed from '../general/feed';
import * as PropTypes from 'prop-types';
import * as React from 'react';
import mApi from '~/lib/mApi';

interface FrontpageFeedProps {
  feedReadTarget: string,
  queryOptions: any
}

interface FrontpageFeedState {
  entries: Array<any>
}

export default class FrontpageFeed extends React.Component<FrontpageFeedProps, FrontpageFeedState> {
  static propTypes = {
    feedReadTarget: PropTypes.string.isRequired,
    queryOptions: PropTypes.object.isRequired
  }
  constructor(props: FrontpageFeedProps){
    super(props);
    
    this.state = {
      entries: []
    }
  }
  componentDidMount(){
    mApi().feed.feeds.read(this.props.feedReadTarget, this.props.queryOptions).callback((err: Error, entries: Array<any>)=>{
      if (!err){
        this.setState({entries});
      }
    });
  }
  render(){
    return <Feed entries={this.state.entries}></Feed>
  }
}