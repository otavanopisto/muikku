import { StateType } from "~/reducers";
import { Dispatch, connect } from "react-redux";
import * as React from "react";
import { WorkspaceType } from "~/reducers/workspaces";
import { i18nType } from "~/reducers/base/i18n";
import Link from "~/components/general/link";

interface LicenseProps {
  workspace: WorkspaceType,
  i18n: i18nType
}

interface LicenseState {

}

class License extends React.Component<LicenseProps, LicenseState> {
  render(){
    if (!this.props.workspace || !this.props.workspace.materialDefaultLicense) {
      return null;
    }

    let materialLicenseIcons = [];
    if (this.props.workspace.materialDefaultLicense && this.props.workspace.materialDefaultLicense.includes('creativecommons.org')) {
      materialLicenseIcons.push('cc');
      if (this.props.workspace.materialDefaultLicense.includes('creativecommons.org/licenses/')) {
        let license = this.props.workspace.materialDefaultLicense.match('creativecommons.org/licenses/(.*)/')[1];
        if (license) {
          if (license.includes('by')) {
            materialLicenseIcons.push('cc-by');
          }
          if (license.includes('nc')) {
            materialLicenseIcons.push('cc-nc');
          }
          if (license.includes('nd')) {
            materialLicenseIcons.push('cc-nd');
          }
          if (license.includes('sa')) {
            materialLicenseIcons.push('cc-sa');
          }
        }
      } else if (this.props.workspace.materialDefaultLicense.includes('creativecommons.org/publicdomain/')) {
        materialLicenseIcons.push('cc-zero');
      }
    }

    return (<div className="">
      <div className="">
        <span className="">
          {materialLicenseIcons.map((i)=><span className={`icon-${i}`}></span>)}
        </span>
        <span className="">{this.props.i18n.text.get("plugin.workspace.index.licenseLabel")}:</span>
        <span className="">
          <Link href={this.props.workspace.materialDefaultLicense} target="top">{this.props.workspace.materialDefaultLicense}</Link>
        </span>
      </div>
    </div>);
  }
}

function mapStateToProps(state: StateType){
  return {
    i18n: state.i18n,
    workspace: state.workspaces.currentWorkspace
  }
};

function mapDispatchToProps(dispatch: Dispatch<any>){
  return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(License);