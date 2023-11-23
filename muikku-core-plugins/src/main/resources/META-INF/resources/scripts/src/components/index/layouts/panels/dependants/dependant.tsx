import * as React from "react"; // React
import "~/sass/elements/dependant.scss"; // Styles
import { useTranslation } from "react-i18next"; // Translation
import { localize } from "~/locales/i18n";
import { connect, Dispatch } from "react-redux";
import { bindActionCreators } from "redux";
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
        <Avatar
          hasImage={dependant.hasImage}
          firstName={dependant.firstName}
          id={dependant.userEntityId}
        />
        <div className="dependant__details">
          <div className="dependant__header">
            <h2>{getName(dependant, true)}</h2>
            <span className="dependant__header-aside">
              {"(" + dependant.studyProgrammeName + ")"}
            </span>
          </div>
          <div className="dependant__contact-info-container">
            {dependant.email && (
              <span className="dependant__info-item">{dependant.email}</span>
            )}
            {dependant.phoneNumber && (
              <span className="dependant__info-item">
                {dependant.phoneNumber}
              </span>
            )}
            {dependant.address && (
              <span className="dependant__info-item">{dependant.address}</span>
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
          <h3>
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
                {t("content.noWorkspaces", { ns: "frontPage" })}
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
          className={`icon-arrow-${showWorkspaces ? "up" : "down"}`}
        />
      </div>
    </div>
  );
};

/**
 * mapDispatchToProps
 * @param dispatch dispatch
 */
function mapDispatchToProps(dispatch: Dispatch<AnyActionType>) {
  return bindActionCreators({ loadDependantWorkspaces }, dispatch);
}

export default connect(null, mapDispatchToProps)(DependantComponent);
