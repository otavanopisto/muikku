import * as React from "react";
import { useTranslation } from "react-i18next";
import { SaveState, MatriculationFormType } from "~/@types/shared";
import "~/sass/elements/matriculation.scss";
import { useMatriculationContext } from "../context/matriculation-context";

/**
 * MatriculationExaminationEnrollmentCompletedProps
 */
interface MatriculationExaminationEnrollmentCompletedProps {
  formType: MatriculationFormType;
}

/**
 * MatriculationExaminationEnrollmentCompleted
 * @param props props
 */
export const MatriculationExaminationEnrollmentCompleted = (
  props: MatriculationExaminationEnrollmentCompletedProps
) => {
  const { matriculation } = useMatriculationContext();
  const { saveState } = matriculation;

  const { t } = useTranslation(["common", "hops_new"]);

  /**
   * renderStateMessage
   * @param saveState saveState
   * @returns render save state message
   */
  const renderStateMessage = (saveState: SaveState) =>
    ({
      PENDING: (
        <div className="matriculation-container">
          <h3 className="matriculation-container__header">
            {t("labels.matriculationFormSaveStatePendingTitle", {
              ns: "hops_new",
            })}
          </h3>
          <div className="loader-empty" />
        </div>
      ),
      IN_PROGRESS: (
        <div className="matriculation-container">
          <h3 className="matriculation-container__header">
            {t("labels.matriculationFormSaveStateInProgressTitle", {
              ns: "hops_new",
            })}
          </h3>
          <div className="matriculation-container__state state-LOADER">
            <div className="matriculation-container__state-icon icon-notification"></div>
            <div
              className="matriculation-container__state-text"
              dangerouslySetInnerHTML={{
                __html: t("content.matriculationFormSaveStateInProgress", {
                  ns: "hops_new",
                }),
              }}
            />
          </div>
          <div className="loader-empty" />
        </div>
      ),
      SUCCESS:
        props.formType === "initial" ? (
          <div className="matriculation-container">
            <h3 className="matriculation-container__header">
              {t("labels.matriculationFormSaveStateSuccessTitle", {
                ns: "hops_new",
              })}
            </h3>
            <div className="matriculation-container__state state-SUCCESS">
              <div className="matriculation-container__state-icon icon-notification"></div>
              <div
                className="matriculation-container__state-text"
                dangerouslySetInnerHTML={{
                  __html: t("content.matriculationFormSaveStateSuccess", {
                    ns: "hops_new",
                  }),
                }}
              />
            </div>
          </div>
        ) : (
          <div className="matriculation-container">
            <h3 className="matriculation-container__header">
              {t("labels.matriculationFormSaveStateSuccessTitle", {
                ns: "hops_new",
                context: "supplementation",
              })}
            </h3>
            <div className="matriculation-container__state state-SUCCESS">
              <div className="matriculation-container__state-icon icon-notification"></div>
              <div
                className="matriculation-container__state-text"
                dangerouslySetInnerHTML={{
                  __html: t("content.matriculationFormSaveStateSuccess", {
                    ns: "hops_new",
                    context: "supplementation",
                  }),
                }}
              />
            </div>
          </div>
        ),
      FAILED: (
        <div className="matriculation-container">
          <h3 className="matriculation-container__header">
            {t("labels.matriculationFormSaveStateFailedTitle", {
              ns: "hops_new",
            })}
          </h3>
          <div className="matriculation-container__state state-FAILED">
            <div className="matriculation-container__state-icon icon-notification"></div>
            <div
              className="matriculation-container__state-text"
              dangerouslySetInnerHTML={{
                __html: t("content.matriculationFormSaveStateFailed", {
                  ns: "hops_new",
                }),
              }}
            />
          </div>
        </div>
      ),
      SAVING_DRAFT: null,
      DRAFT_SAVED: null,
      undefined: null,
    }[saveState]);

  return <div>{renderStateMessage(saveState)}</div>;
};

export default MatriculationExaminationEnrollmentCompleted;
