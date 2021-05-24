import * as React from "react";
import "~/sass/elements/matriculation.scss";
import {
  Examination,
  ExaminationAttentionInformation,
} from "../../../../@types/shared";

/**
 * MatriculationExaminationEnrollmentActProps
 */
interface MatriculationExaminationEnrollmentActProps {
  examination: Examination;
  onChange: (examination: Examination) => void;
}

/**
 * MatriculationExaminationEnrollmentAct
 * @param props
 * @returns
 */
export const MatriculationExaminationEnrollmentAct: React.FC<MatriculationExaminationEnrollmentActProps> =
  ({ examination, onChange }) => {
    const onExaminationAttentionInfoChanges = <
      T extends keyof ExaminationAttentionInformation
    >(
      key: T,
      value: ExaminationAttentionInformation[T]
    ) => {
      const modifiedExamination: Examination = {
        ...examination,
        attentionInformation: {
          ...examination.attentionInformation,
          [key]: value,
        },
      };

      onChange(modifiedExamination);
    };

    return (
      <div className="matriculation-container">
        <fieldset className="matriculation-fieldset">
          <legend>Kokeen suorittaminen</legend>
          <div className="matriculation-row">
            <div className="matriculation__form-element-container">
              <label>Suorituspaikka</label>
              <select
                onChange={(e) =>
                  onExaminationAttentionInfoChanges(
                    "placeToAttend",
                    e.currentTarget.value
                  )
                }
                className="matriculation__form-element__input"
              >
                <option>Mikkeli</option>
                <option value="">Muu</option>
              </select>
            </div>
          </div>

          <div className="pure-u-1-2"></div>
          <div className="matriculation-row">
            <div className="matriculation__form-element-container">
              <label>Lisätietoa ohjaajalle</label>
              <textarea
                rows={5}
                onChange={(e) =>
                  onExaminationAttentionInfoChanges(
                    "extraInfoForSupervisor",
                    e.currentTarget.value
                  )
                }
                className="matriculation__form-element__input matriculation__form-element__input--textarea"
              />
            </div>
          </div>
          <div className="matriculation-row">
            <div className="matriculation__form-element-container">
              <label>Julkaisulupa</label>
              <select
                onChange={(e) =>
                  onExaminationAttentionInfoChanges(
                    "publishPermission",
                    e.currentTarget.value
                  )
                }
                className="matriculation__form-element__input"
              >
                <option value="true">
                  Haluan nimeni julkaistavan valmistujalistauksissa
                </option>
                <option value="false">
                  En halua nimeäni julkaistavan valmistujaislistauksissa
                </option>
              </select>
            </div>
          </div>

          <div className="matriculation-row">
            <div className="matriculation__form-element-container">
              <label>Nimi</label>
              <input
                onChange={(e) =>
                  onExaminationAttentionInfoChanges(
                    "publishedName",
                    e.currentTarget.value
                  )
                }
                readOnly={true}
                className="matriculation__form-element__input"
                type="text"
              />
            </div>
          </div>
          <div className="matriculation-row">
            <div className="matriculation__form-element-container">
              <label>Päivämäärä</label>
              <input
                onChange={(e) =>
                  onExaminationAttentionInfoChanges(
                    "date",
                    e.currentTarget.value
                  )
                }
                readOnly={true}
                className="matriculation__form-element__input"
                type="text"
              />
            </div>
          </div>
        </fieldset>
      </div>
    );
  };
