import * as React from "react";
import "~/sass/elements/hops.scss";
import "~/sass/elements/form.scss";
import { useTranslation } from "react-i18next";
import { useCompulsoryForm } from "~/components/pedagogy-support/hooks/useCompulsoryForm";

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
  const { pedagogyForm, userRole, /* sendToStudent, */ editIsActive } =
    useCompulsoryForm();

  return (
    <section className="hops-container">
      {pedagogyForm?.state === "ACTIVE" && userRole === "SPECIAL_ED_TEACHER" ? (
        <fieldset className="hops-container__fieldset">
          <legend className="hops-container__subheader">
            {t("labels.sendForApproval", {
              ns: "pedagogySupportPlan",
            })}
          </legend>
          <div className="hops-container__info">
            <div className="hops-container__state state-INFO">
              <div className="hops-container__state-icon icon-notification"></div>
              <div className="hops-container__state-text">
                {t("content.planSendInformation", {
                  ns: "pedagogySupportPlan",
                })}
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

            {/* <div className="hops-container__row hops-container__row--submit-middle-of-the-form">
              <Button
                buttonModifiers={["execute"]}
                onClick={sendToStudent}
                disabled={editIsActive}
              >
                {t("actions.send", {
                  ns: "common",
                })}
              </Button>
            </div> */}
          </div>
        </fieldset>
      ) : null}

      {/* <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">
          {t("labels.approving", {
            ns: "pedagogySupportPlan",
          })}
        </legend>
        <div className="hops-container__row">
          <div
            className="hops__form-element-container hops__form-element-container--single-row"
            style={{ flexFlow: "unset" }}
          >
            <input
              id="fromFamilyMember"
              type="checkbox"
              name="approved"
              className="hops__input"
              disabled
              defaultChecked={formIsApproved}
            ></input>
            <label htmlFor="fromFamilyMember" className="hops__label">
              {t("content.planAcceptance", {
                ns: "pedagogySupportPlan",
              })}
            </label>
          </div>
        </div>
      </fieldset> */}
    </section>
  );
};

export default PermissionsAndApproval;
