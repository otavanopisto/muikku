import { StateType } from "~/reducers";
import { connect } from "react-redux";
import * as React from "react";
import { WorkspaceDataType } from "~/reducers/workspaces";
import Link from "~/components/general/link";
import "~/sass/elements/license.scss";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * LicenseProps
 */
interface LicenseProps extends WithTranslation {
  workspace: WorkspaceDataType;
}

/**
 * LicenseState
 */
interface LicenseState {}

/**
 * License
 */
class License extends React.Component<LicenseProps, LicenseState> {
  /**
   * render
   */
  render() {
    const { t } = this.props;

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
          {t("wcag.workspaceLicense", { ns: "workspace" })}:
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

/**
 * mapStateToProps
 * @param state state
 */
function mapStateToProps(state: StateType) {
  return {
    workspace: state.workspaces.currentWorkspace,
  };
}

/**
 * mapDispatchToProps
 */
function mapDispatchToProps() {
  return {};
}

export default withTranslation(["workspace", "common"])(
  connect(mapStateToProps, mapDispatchToProps)(License)
);
