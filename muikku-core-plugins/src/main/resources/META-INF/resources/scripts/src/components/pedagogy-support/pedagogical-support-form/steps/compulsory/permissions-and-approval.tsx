import * as React from "react";
import "~/sass/elements/hops.scss";
import "~/sass/elements/form.scss";
import { useTranslation } from "react-i18next";
import { useCompulsoryForm } from "~/components/pedagogy-support/hooks/useCompulsoryForm";
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
    useCompulsoryForm();

  return (
    <section className="hops-container">
      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">Näkyvyys</legend>
        <div className="hops-container__info">
          <div className="hops-container__state state-INFO">
            <div className="hops-container__state-icon icon-notification"></div>
            <div className="hops-container__state-text">
              {/* {t("content.planSendInformation", {
                ns: "pedagogySupportPlan",
              })} */}

              <p>
                Julkaistu pedagogisen tuen suunnitelma näkyy seuraaville
                henkilöille:
              </p>
              <ul>
                <li>sinulle itsellesi</li>
                <li>mahdollisille huoltajillesi</li>
                <li>erityisopettajalle</li>
                <li>rehtorille</li>
                <li>ryhmänohjaajalle</li>
                <li>opinto-ohjaajalle</li>
                <li>opettajille, joiden opintojaksolla opiskelet juuri nyt.</li>
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
