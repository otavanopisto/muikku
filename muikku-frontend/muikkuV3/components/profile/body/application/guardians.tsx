import React from "react";
import { useSelector } from "react-redux";
import { StateType } from "~/reducers";
import Avatar from "~/components/general/avatar";
import { useTranslation } from "react-i18next";
import "~/sass/elements/item-list.scss";
import Button from "~/components/general/button";
import GuardianVisibilityDialog from "~/components/profile/body/application/dialog/edit-guardian-visibility";

/**
 * Guardians component props.
 */
interface GuardiansProps {}

/**
 * Renders the student's guardians list.
 */
const Guardians: React.FC<GuardiansProps> = () => {
  const { t } = useTranslation();
  const guardians = useSelector((state: StateType) => state.contacts.guardians);
  const profile = useSelector((state: StateType) => state.profile);

  if (profile.location !== "guardians" || !guardians.list) {
    return null;
  }

  return (
    <div>
      <h2>Guardians</h2>
      <div className="item-list item-list--student-guardians">
        {guardians.list.map((guardian, index) => (
          <div
            className="item-list__item item-list__item--student-counselor"
            key={guardian.identifier}
          >
            <div
              className="item-list__profile-picture"
              key={guardian.identifier}
            >
              <Avatar
                id={index}
                userCategory={3}
                name={guardian.firstName + " " + guardian.lastName}
                hasImage={false}
              />
            </div>
            <div className="item-list__text-body item-list__text-body--multiline">
              <div className="item-list__user-name">
                {guardian.firstName} {guardian.lastName}
              </div>
              <div className="item-list__guardian-permission">
                {guardian.continuedViewPermission
                  ? t("labels.continuedViewPermission", {
                      ns: "users",
                    })
                  : t("labels.noContinuedViewPermission", {
                      ns: "users",
                    })}
              </div>
              <div>
                <GuardianVisibilityDialog guardianId={guardian.identifier}>
                  <Button buttonModifiers={["execute"]}>
                    Muokkaa näkyvyyksiä
                  </Button>
                </GuardianVisibilityDialog>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Guardians;
