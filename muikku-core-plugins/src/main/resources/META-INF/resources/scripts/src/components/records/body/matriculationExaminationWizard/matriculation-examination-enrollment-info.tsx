import * as React from "react";
import "~/sass/elements/matriculation.scss";

interface MatriculationExaminationEnrollmentInfoProps {}

export const MatriculationExaminationEnrollmentInfo: React.FC<MatriculationExaminationEnrollmentInfoProps> = (
  props
) => (
  <div className="matriculation-container matriculation-container-state matriculation-container-state--info">
    <h1 className="info-header">
      Ylioppilaskirjoituksiin ilmoittautuminen (Info)
    </h1>
    <p className="info-item">
      Ilmoittautuminen ylioppilaskirjoituksiin on nyt auki. Voit ilmoittautua
      yo-kirjoituksiin, jos täytät abistatuksen. Lue lisää tiedotteesta.
    </p>
    <p className="info-item">
      Täytä puuttuvat tiedot huolellisesti ja tarkista lomake ennen sen
      lähettämistä.
    </p>
    <p className="info-item">Ilmoittautuminen sulkeutuu</p>
    <ul className="info-item">
      <li className="info-list-item">kevään kirjoitusten osalta 20.11.</li>
      <li className="info-list-item">syksyn kirjoitusten osalta 20.5.</li>
    </ul>
    <p className="info-item">
      Jos sinulla on kysyttävää, ota yhteyttä Riikka Turpeiseen
      (riikka.turpeinen@otavia.fi).
    </p>
    <p className="info-item">
      <b>Ilmoittautuminen on sitova.</b>
    </p>
  </div>
);
