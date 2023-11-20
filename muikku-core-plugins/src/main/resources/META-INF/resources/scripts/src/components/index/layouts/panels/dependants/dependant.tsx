// dependant component that has a prop "dependant" with UserGuardiansDependant type. The component has a header with an avatar compoonent and persion infomation and a link. There's also a content element with active courses. Dependant component will have a bem className space of "dependant"-
import * as React from "react"; // React
import { useTranslation } from "react-i18next"; // Translation
import { UserGuardiansDependant } from "~/generated/client"; // UserGuardiansDependant type
import { getName } from "~/util/modifiers"; // getName function
import Link from "~/components/general/link"; // Link component
import Avatar from "~/components/general/avatar"; // Avatar component

/**
 * DependantProps
 */
interface DependantProps {
  dependant: UserGuardiansDependant;
}

/**
 * Dependant component
 * @param props StudentsPanelProps
 * @returns  JSX.element
 */
const Dependant: React.FC<DependantProps> = (props) => {
  const { dependant } = props;
  const { t } = useTranslation(["frontPage", "common"]);

  return (
    <div className="dependant">
      <div className="dependant__info">
        <Avatar
          hasImage={dependant.hasImage}
          firstName={dependant.firstName}
          id={16}
        />
        <div>
          {getName(dependant, true)}
          <Link
            key={dependant.identifier}
            className="item-list__item item-list__item--workspaces"
            href={`/guardian#${dependant.identifier}`}
          >
            <span className="item-list__icon item-list__icon--workspaces icon-user"></span>
            <span className="item-list__text-body">
              {getName(dependant, true)}
            </span>
          </Link>
        </div>
      </div>
      <div className="dependant__workspaces"></div>
    </div>
  );
};

export default Dependant;
