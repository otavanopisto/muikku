import * as React from "react";
import { i18nType } from "reducers/base/i18n";
import '~/sass/elements/syncer.scss';

interface SyncerProps {
  synced: boolean;
  syncError: string;
  i18n: i18nType;
}

interface SyncerState {
  displaySyncedMessage: boolean;
}

export default class Syncer extends React.PureComponent<SyncerProps, SyncerState> {
  constructor(props: SyncerProps){
    super(props);
    
    this.state = {
      displaySyncedMessage: false,
    }
  }
  
  componentWillReceiveProps(nextProps: SyncerProps) {
    if (nextProps.synced && !this.props.synced && !nextProps.syncError) {
      this.setState({
        displaySyncedMessage: true,
      });
      
      setTimeout(() => {
        this.setState({
          displaySyncedMessage: false,
        });
      }, 1000);
    }
  }
  
  render() {
    if (this.props.synced && !this.state.displaySyncedMessage && !this.props.syncError) {
      return null;
    }
    
    let message: string;
    if (this.props.syncError) {
      message = this.props.i18n.text.get("error");
    } else if (!this.props.synced) {
      message = this.props.i18n.text.get("syncing");
    } else if (this.state.displaySyncedMessage) {
      message = this.props.i18n.text.get("synced!!!");
    }

    return (
      <div className="syncer">
        {message}
      </div>
    );
  }
}