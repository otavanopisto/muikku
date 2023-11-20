import * as React from "react"; // React
import { useTranslation } from "react-i18next"; // Translation
import { UserGuardiansDependant } from "~/generated/client"; // UserGuardiansDependant type
import { getName } from "~/util/modifiers"; // getName function
import Link from "~/components/general/link"; // Link component
import Avatar from "~/components/general/avatar"; // Avatar component
import "~/sass/elements/dependant.scss"; // Styles
/**
 * DependantProps
 */
interface DependantProps {
  dependant: UserGuardiansDependant;
}

/**
 * Dependant component
 * @param props DependantPropsProps
 * @returns  JSX.element
 */
const Dependant: React.FC<DependantProps> = (props) => {
  const { dependant } = props;
  const { t } = useTranslation(["frontPage", "workspace"]);

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
            <span className="dependant__info-item">{dependant.email}</span>
            <span className="dependant__info-item">
              {dependant.phoneNumber}
            </span>
            <span className="dependant__info-item">{dependant.address}</span>
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
      <div className="dependant__activity-container">
        {t("labels.latestLogin", { ns: "frontPage", date: "xx.xx.xxxx" })}
      </div>
      <div className="dependant__workspaces-container">
        <h3>
          {t("labels.workspaces", { ns: "workspace", context: "active" })}
        </h3>
      </div>
    </div>
  );
};

export default Dependant;
