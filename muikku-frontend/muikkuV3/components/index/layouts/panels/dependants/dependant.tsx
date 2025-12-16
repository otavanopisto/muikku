import * as React from "react"; // React
import "~/sass/elements/dependant.scss"; // Styles
import { useTranslation } from "react-i18next"; // Translation
import { localize } from "~/locales/i18n";
import { connect } from "react-redux";
import { Action, bindActionCreators, Dispatch } from "redux";
import { AnyActionType } from "~/actions";
import {
  loadDependantWorkspaces,
  LoadDependantWorkspacesTriggerType,
} from "~/actions/main-function/dependants";
import { Dependant } from "~/reducers/main-function/dependants"; // Dependant type
import { getName } from "~/util/modifiers"; // getName function
import Link from "~/components/general/link"; // Link component
import Avatar from "~/components/general/avatar"; // Avatar component
import AnimateHeight from "react-animate-height"; // AnimateHeight
import Button from "~/components/general/button"; // Button component
import DependantWorkspace from "./workspace"; // DependantWorkspace component
/**
 * DependantProps
 */
interface DependantComponentProps {
  dependant: Dependant;
  loadDependantWorkspaces: LoadDependantWorkspacesTriggerType;
}

/**
 * Dependant component
 * @param props DependantPropsProps
 * @returns  JSX.element
 */
const DependantComponent: React.FC<DependantComponentProps> = (props) => {
  const { dependant, loadDependantWorkspaces } = props;
  const { t } = useTranslation(["frontPage", "workspace"]);
  const [showWorkspaces, setShowWorkspaces] = React.useState(false);
  /**
   * toggles description visibility
   */
  const toggleShowWorkspaces = () => {
    setShowWorkspaces(!showWorkspaces);
    loadDependantWorkspaces(dependant.identifier);
  };
  return (
    <div className="dependant">
      <div className="dependant__details-container">
        <div className="dependant__details">
          <div className="dependant__header">
            <Avatar
              hasImage={dependant.hasImage}
              name={dependant.firstName}
              id={dependant.userEntityId}
            />
            <div className="dependant__header-text-container">
              <h2 className="dependant__header-title">
                {getName(dependant, true)}
              </h2>
              <span className="dependant__header-aside">
                {dependant.studyProgrammeName}
              </span>
            </div>
          </div>
          <div className="dependant__contact-info-container">
            {dependant.email && (
              <span className="dependant__info-item dependant__info-item--email">
                <span className="dependant__info-item-icon icon-envelope" />
                {dependant.email}
              </span>
            )}
            {dependant.phoneNumber && (
              <span className="dependant__info-item">
                <span className="dependant__info-item-icon icon-phone" />
                {dependant.phoneNumber}
              </span>
            )}
            {dependant.address && (
              <span className="dependant__info-item">
                <span className="dependant__info-item-icon icon-pin" />
                {dependant.address}
              </span>
            )}
          </div>
          <div className="dependant__details-footer">
            <Link
              key={dependant.identifier}
              href={`/guardian#${dependant.identifier}`}
            >
              {t("actions.dependantStudies", { ns: "frontPage" })}
            </Link>
          </div>
        </div>
      </div>
      {dependant.latestLogin && (
        <div className="dependant__activity-container">
          {t("labels.latestLogin", {
            ns: "frontPage",
            date: localize.date(dependant.latestLogin),
          })}
        </div>
      )}
      <AnimateHeight
        height={showWorkspaces ? "auto" : 0}
        id="workspacesAccordion"
      >
        <div className="dependant__workspaces-container">
          <h3 className="dependant__workspaces-title">
            {t("labels.workspaces", { ns: "workspace", context: "active" })}
          </h3>
          <div className="item-list item-list--panel-workspaces">
            {dependant.workspaces.length > 0 ? (
              dependant.workspaces.map((workspace, index) => (
                <DependantWorkspace
                  key={workspace.name + index}
                  workspace={workspace}
                />
              ))
            ) : (
              <div className="empty">
                {t("content.noWorkspaces", {
                  ns: "frontPage",
                  context: "guardian",
                })}
              </div>
            )}
          </div>
        </div>
      </AnimateHeight>
      <div className="dependant__footer">
        <Button
          onClick={toggleShowWorkspaces}
          aria-label="TODO: Toggle workspace visibility"
          aria-controls="workspacesAccordion"
          aria-expanded={showWorkspaces}
          className={`dependant__accordion-button icon-arrow-${
            showWorkspaces ? "up" : "down"
          }`}
        />
      </div>
    </div>
  );
};

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<Action<AnyActionType>>) {
  return bindActionCreators({ loadDependantWorkspaces }, dispatch);
}

export default connect(null, mapDispatchToProps)(DependantComponent);
