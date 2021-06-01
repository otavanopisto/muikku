import * as React from "react";
import "~/sass/elements/matriculation.scss";

interface MatriculationExaminationEnrollmentInfoProps {}

export class MatriculationExaminationEnrollmentInfo extends React.Component<
  MatriculationExaminationEnrollmentInfoProps,
  {}
> {
  constructor(props: MatriculationExaminationEnrollmentInfoProps) {
    super(props);
  }

  render() {
    return (
      <div className="matriculation-container">
        <h3 className="matriculation-container__header">
          Ylioppilaskirjoituksiin ilmoittautuminen (Info)
        </h3>
        <p className="matriculation-container__info-item">
          Ilmoittautuminen ylioppilaskirjoituksiin on nyt auki. Voit
          ilmoittautua yo-kirjoituksiin, jos täytät abistatuksen. Lue lisää
          tiedotteesta.
        </p>
        <p className="matriculation-container__info-item">
          Täytä puuttuvat tiedot huolellisesti ja tarkista lomake ennen sen
          lähettämistä.
        </p>
        <h3 className="matriculation-container__subheader">Ilmoittautuminen sulkeutuu</h3>
        <ul className="matriculation-container__info-list">
          <li className="matriculation-container__info-list-item">kevään kirjoitusten osalta 20.11.</li>
          <li className="matriculation-container__info-list-item">syksyn kirjoitusten osalta 20.5.</li>
        </ul>
        <p className="matriculation-container__info-item">
          Jos sinulla on kysyttävää, ota yhteyttä Riikka Turpeiseen
          (riikka.turpeinen@otavia.fi).
        </p>
        <div className="matriculation-container__state state-INFO">Ilmoittautuminen on sitova.</div>
      </div>
    );
  }
}

export default MatriculationExaminationEnrollmentInfo;
