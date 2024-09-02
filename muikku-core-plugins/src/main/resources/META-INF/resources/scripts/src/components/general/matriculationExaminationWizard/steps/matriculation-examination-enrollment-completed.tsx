import * as React from "react";
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

  /**
   * renderStateMessage
   * @param saveState saveState
   * @returns render save state message
   */
  const renderStateMessage = (saveState: SaveState) =>
    ({
      PENDING: (
        <div className="matriculation-container">
          <h3 className="matriculation-container__header">Odottaa!</h3>
          <div className="loader-empty" />
        </div>
      ),
      IN_PROGRESS: (
        <div className="matriculation-container">
          <h3 className="matriculation-container__header">
            Lomaketta tallennetaan
          </h3>
          <div className="matriculation-container__state state-LOADER">
            <div className="matriculation-container__state-icon icon-notification"></div>
            <div className="matriculation-container__state-text">
              <p>Lomakkeen tietoja tallennetaan, odota hetki</p>
            </div>
          </div>
          <div className="loader-empty" />
        </div>
      ),
      SUCCESS:
        props.formType === "initial" ? (
          <div className="matriculation-container">
            <h3 className="matriculation-container__header">
              Ilmoittautuminen ylioppilaskirjoituksiin lähetetty
            </h3>
            <div className="matriculation-container__state state-SUCCESS">
              <div className="matriculation-container__state-icon icon-notification"></div>
              <div className="matriculation-container__state-text">
                <p>
                  Ilmoittautumisesi ylioppilaskirjoituksiin on lähetetty
                  onnistuneesti. Saat lomakkeesta kopion sähköpostiisi.
                </p>
                <p>
                  Tulosta lomake, allekirjoita ja päivää se ja lähetä
                  skannattuna tai kuvana yo-ilmoittautumiset@otavia.fi tai
                  kirjeitse Otavia/Nettilukio, Otavantie 2B, 50670 Otava.
                </p>
                <p>Tarkistamme lomakkeen tiedot, ja otamme sinuun yhteyttä.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="matriculation-container">
            <h3 className="matriculation-container__header">
              Ilmoittautumista täydennetty onnistuneesti
            </h3>
            <div className="matriculation-container__state state-SUCCESS">
              <div className="matriculation-container__state-icon icon-notification"></div>
              <div className="matriculation-container__state-text">
                <p>
                  Olet muokannut ilmoittautumistasi ylioppilaskirjoituksiin
                  onnistuneesti
                </p>

                <p>Tarkistamme lomakkeen tiedot, ja otamme sinuun yhteyttä.</p>
              </div>
            </div>
          </div>
        ),
      FAILED: (
        <div className="matriculation-container">
          <h3 className="matriculation-container__header">
            Lomakkeen tallennus epäonnistui
          </h3>
          <div className="matriculation-container__state state-FAILED">
            <div className="matriculation-container__state-icon icon-notification"></div>
            <div className="matriculation-container__state-text">
              <p>
                Lomakkeen tietojen tallennus epäonnistui. Varmista, että olet
                kirjautunut sisään palaamalla lomakkeelle uudelleen Muikun
                kautta.
              </p>
            </div>
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
