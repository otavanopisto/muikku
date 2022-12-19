import * as React from "react";
import "~/sass/elements/matriculation.scss";
import { ExaminationInformation, SaveState } from "~/@types/shared";
import { Textarea } from "./textarea";
import { TextField } from "./textfield";
import { SavingDraftError } from "./saving-draft-error";
import { SavingDraftInfo } from "./saving-draft-info";

/**
 * MatriculationExaminationEnrollmentActProps
 */
interface MatriculationExaminationEnrollmentActProps {
  examination: ExaminationInformation;
  draftSaveErrorMsg?: string;
  saveState: SaveState;
  onChange: (examination: ExaminationInformation) => void;
}

/**
 * MatriculationExaminationEnrollmentAct
 */
export class MatrMatriculationExaminationEnrollmentAct extends React.Component<
  MatriculationExaminationEnrollmentActProps,
  Record<string, unknown>
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: MatriculationExaminationEnrollmentActProps) {
    super(props);
  }

  /**
   * Handles examination information changes and passes it to parent component
   * @param key key of the changed value
   * @param value value
   */
  onExaminationInformationChange = <T extends keyof ExaminationInformation>(
    key: T,
    value: ExaminationInformation[T]
  ) => {
    const { examination, onChange } = this.props;

    const modifiedExamination: ExaminationInformation = {
      ...examination,
      [key]: value,
    };

    onChange(modifiedExamination);
  };

  /**
   * Render method
   */
  render() {
    const { examination, draftSaveErrorMsg, saveState } = this.props;
    const { location, message, canPublishName, name, date } = examination;

    return (
      <div className="matriculation-container">
        <SavingDraftError draftSaveErrorMsg={draftSaveErrorMsg} />
        <SavingDraftInfo saveState={saveState} />
        <fieldset className="matriculation-container__fieldset">
          <legend className="matriculation-container__subheader">
            Kokeen suorittaminen
          </legend>
          <div className="matriculation-container__row">
            <div className="matriculation__form-element-container">
              <label className="matriculation__label">Suorituspaikka</label>
              <select
                onChange={(e) =>
                  this.onExaminationInformationChange(
                    "location",
                    e.currentTarget.value
                  )
                }
                value={location === "Mikkeli" ? "Mikkeli" : ""}
                className="matriculation__select"
              >
                <option>Mikkeli</option>
                <option value="">Muu</option>
              </select>
            </div>
          </div>

          {location !== "Mikkeli" ? (
            <div>
              <div className="matriculation-container__row">
                <div className="matriculation__form-element-container">
                  <TextField
                    label="Muu paikka"
                    value={location}
                    type="text"
                    placeholder="Kirjoita tähän oppilaitoksen nimi"
                    className="matriculation__input"
                    onChange={(e) =>
                      this.onExaminationInformationChange(
                        "location",
                        e.currentTarget.value
                      )
                    }
                  />
                </div>
              </div>

              {location === "" ? (
                <div className="matriculation-container__state state-WARNING">
                  <div className="matriculation-container__state-icon icon-notification"></div>
                  <div className="matriculation-container__state-text">
                    <p>
                      Jos haluat suorittaa kokeen muualla, siitä on sovittava
                      ensin kyseisen oppilaitoksen kanssa.
                    </p>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}

          <div className="matriculation-container__row">
            <div className="matriculation__form-element-container">
              <Textarea
                label="Lisätietoa ohjaajalle"
                rows={5}
                onChange={(e) =>
                  this.onExaminationInformationChange(
                    "message",
                    e.currentTarget.value
                  )
                }
                value={message}
                className="matriculation__textarea"
              />
            </div>
          </div>
          <div className="matriculation-container__row">
            <div className="matriculation__form-element-container">
              <label className="matriculation__label">Julkaisulupa</label>
              <select
                onChange={(e) =>
                  this.onExaminationInformationChange(
                    "canPublishName",
                    e.currentTarget.value
                  )
                }
                value={canPublishName}
                className="matriculation__select"
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

          <div className="matriculation-container__row">
            <div className="matriculation__form-element-container">
              <TextField
                label="Nimi"
                value={name}
                type="text"
                readOnly
                className="matriculation__input"
              />
            </div>
            <div className="matriculation__form-element-container">
              <TextField
                label="Päivämäärä"
                value={date}
                type="text"
                readOnly
                className="matriculation__input"
              />
            </div>
          </div>
        </fieldset>
      </div>
    );
  }
}

export default MatrMatriculationExaminationEnrollmentAct;
