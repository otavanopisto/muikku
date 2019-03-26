import * as React from "react";
import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import { i18nType } from "~/reducers/base/i18n";

import ContentPanel, { ContentPanelItem } from '~/components/general/content-panel';

interface PermissionsByUsergroupsProps {
  i18n: i18nType,
}

interface PermissionsByUsergroupsState {
}

class PermissionsByUsergroups extends React.Component<PermissionsByUsergroupsProps, PermissionsByUsergroupsState> {
  constructor(props: PermissionsByUsergroupsProps){
    super(props);
  }
  render(){
    return <ContentPanel modifier="permissions-by-usergroup"
      title={this.props.i18n.text.get("plugin.workspace.permissions.viewTitle")} ref="content-panel">
      
    </ContentPanel>
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(PermissionsByUsergroups);