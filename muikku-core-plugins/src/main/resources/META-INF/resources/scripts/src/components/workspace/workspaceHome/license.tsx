import { StateType } from "~/reducers";
import { connect } from "react-redux";
import * as React from "react";
import { WorkspaceType } from "~/reducers/workspaces";
import { i18nType } from "~/reducers/base/i18n";
import Link from "~/components/general/link";

import "~/sass/elements/license.scss";

interface LicenseProps {
  workspace: WorkspaceType;
  i18n: i18nType;
}

interface LicenseState {}

class License extends React.Component<LicenseProps, LicenseState> {
  render() {
    if (!this.props.workspace || !this.props.workspace.materialDefaultLicense) {
      return null;
    }

    const materialLicenseIcons = [];
    if (
      this.props.workspace.materialDefaultLicense &&
      this.props.workspace.materialDefaultLicense.includes(
        "creativecommons.org"
      )
    ) {
      materialLicenseIcons.push("cc");
      if (
        this.props.workspace.materialDefaultLicense.includes(
          "creativecommons.org/licenses/"
        )
      ) {
        const license = this.props.workspace.materialDefaultLicense.match(
          "creativecommons.org/licenses/(.*)/"
        )[1];
        if (license) {
          if (license.includes("by")) {
            materialLicenseIcons.push("cc-by");
          }
          if (license.includes("nc")) {
            materialLicenseIcons.push("cc-nc");
          }
          if (license.includes("nd")) {
            materialLicenseIcons.push("cc-nd");
          }
          if (license.includes("sa")) {
            materialLicenseIcons.push("cc-sa");
          }
        }
      } else if (
        this.props.workspace.materialDefaultLicense.includes(
          "creativecommons.org/publicdomain/"
        )
      ) {
        materialLicenseIcons.push("cc-zero");
      }
    }

    const isLicenseLink =
      this.props.workspace.materialDefaultLicense.indexOf("http://") === 0 ||
      this.props.workspace.materialDefaultLicense.indexOf("https://") === 0;
    return (
      <div className="license">
        <span className="license__icons">
          {materialLicenseIcons.map((i) => (
            <span className={`license__icon icon-${i}`} key={i}></span>
          ))}
        </span>
        <span className="license__title">
          {this.props.i18n.text.get("plugin.workspace.index.licenseLabel")}:
        </span>
        {isLicenseLink ? (
          <Link
            className="license__link"
            href={this.props.workspace.materialDefaultLicense}
            openInNewTab="_blank"
          >
            {this.props.workspace.materialDefaultLicense}
          </Link>
        ) : (
          <span className="license__text">
            {this.props.workspace.materialDefaultLicense}
          </span>
        )}
      </div>
    );
  }
}

function mapStateToProps(state: StateType) {
  return {
    i18n: state.i18n,
    workspace: state.workspaces.currentWorkspace,
  };
}

function mapDispatchToProps() {
  return {};
}

export default connect(mapStateToProps, mapDispatchToProps)(License);
