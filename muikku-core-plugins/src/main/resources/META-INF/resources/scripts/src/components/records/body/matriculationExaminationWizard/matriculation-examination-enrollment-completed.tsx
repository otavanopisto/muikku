import * as React from "react";
import "~/sass/elements/matriculation.scss";
import { SaveState } from "../../../../@types/shared";

interface MatriculationExaminationEnrollmentCompletedProps {
  saveState: SaveState;
}

export const MatriculationExaminationEnrollmentCompleted: React.FC<MatriculationExaminationEnrollmentCompletedProps> = (
  props
) =>
  ({
    PENDING: (
      <div className="matriculation-container matriculation-container-state matriculation-container-state--loader">
        <h1 className="info-header">Odottaa!</h1>
        <div className="loader-empty" />
      </div>
    ),
    IN_PROGRESS: (
      <div className="matriculation-container matriculation-container-state matriculation-container-state--loader">
        <h1 className="info-header">Lomaketta tallennetaan</h1>
        <p>Lomakkeen tietoja tallennetaan, odota hetki.</p>
        <div className="loader-empty" />
      </div>
    ),
    SUCCESS: (
      <div className="matriculation-container matriculation-container-state matriculation-container-state--success">
        <h1 className="info-header">
          Ilmoittautuminen ylioppilaskirjoituksiin lähetetty
        </h1>
        <p className="info-item">
          Ilmoittautumisesi ylioppilaskirjoituksiin on lähetetty onnistuneesti.
          Saat lomakkeesta kopion sähköpostiisi.
        </p>
        <p className="info-item">
          Tulosta lomake, allekirjoita ja päivää se ja lähetä skannattuna
          riikka.turpeinen@otavia.fi tai kirjeitse Otavia/Nettilukio, Otavantie
          2B, 50670 Otava.
        </p>
        <p className="info-item">
          Tarkistamme lomakkeen tiedot, ja otamme sinuun yhteyttä.
        </p>
      </div>
    ),
    FAILED: (
      <div className="matriculation-container matriculation-container-state matriculation-container-state--failed">
        <h1 className="info-header">Lomakkeen tallennus epäonnistui</h1>
        <p className="info-item">
          Lomakkeen tietojen tallennus epäonnistui. Varmista, että olet
          kirjautunut sisään palaamalla lomakkeelle uudelleen Muikun kautta.
        </p>
      </div>
    ),
  }[props.saveState]);
