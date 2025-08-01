import * as React from "react";
import "~/sass/elements/hops.scss";
import "~/sass/elements/form.scss";
import { useTranslation } from "react-i18next";
import { useUpperSecondaryForm } from "~/components/pedagogy-support/hooks/useUppersecondaryForm";
import Button from "~/components/general/button";

/**
 * PermissionsAndApprovalProps
 */
interface PermissionsAndApprovalProps {}

/**
 * PermissionsAndApproval
 *
 * @param props props
 * @returns JSX.Element
 */
const PermissionsAndApproval: React.FC<PermissionsAndApprovalProps> = (
  props
) => {
  const { t } = useTranslation(["pedagogySupportPlan", "common"]);
  const { pedagogyForm, userRole, togglePublishPedagogyForm, editIsActive } =
    useUpperSecondaryForm();

  return (
    <section className="hops-container">
      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">Näkyvyys</legend>
        <div className="hops-container__info">
          <div className="hops-container__state state-INFO">
            <div className="hops-container__state-icon icon-notification"></div>
            <div className="hops-container__state-text">
              <p>
                {t("content.publishedTo", {
                  ns: "pedagogySupportPlan",
                })}
              </p>
              <ul>
                <li>
                  {t("content.publishedToYourself", {
                    ns: "pedagogySupportPlan",
                  })}
                </li>
                <li>
                  {t("content.publishedToGuardians", {
                    ns: "pedagogySupportPlan",
                  })}
                </li>
                <li>
                  {t("content.publishedToSpecialEdTeacher", {
                    ns: "pedagogySupportPlan",
                  })}
                </li>
                <li>
                  {t("content.publishedToPrincipal", {
                    ns: "pedagogySupportPlan",
                  })}
                </li>
                <li>
                  {t("content.publishedToGroupSupervisor", {
                    ns: "pedagogySupportPlan",
                  })}
                </li>
                <li>
                  {t("content.publishedToStudyCounselor", {
                    ns: "pedagogySupportPlan",
                  })}
                </li>
                <li>
                  {t("content.publishedToCurrentTeachers", {
                    ns: "pedagogySupportPlan",
                  })}
                </li>
              </ul>
            </div>
          </div>
          {editIsActive && (
            <div className="hops-container__state state-WARNING">
              <div className="hops-container__state-icon icon-notification"></div>
              <div className="hops-container__state-text">
                {t("content.planEditingActive", {
                  ns: "pedagogySupportPlan",
                })}
              </div>
            </div>
          )}

          {userRole === "SPECIAL_ED_TEACHER" && (
            <div className="hops-container__row hops-container__row--submit-middle-of-the-form">
              <Button
                buttonModifiers={["execute"]}
                disabled={editIsActive}
                onClick={togglePublishPedagogyForm}
              >
                {pedagogyForm?.published ? "Peru julkaisu" : "Julkaise"}
              </Button>
            </div>
          )}
        </div>
      </fieldset>
    </section>
  );
};

export default PermissionsAndApproval;
