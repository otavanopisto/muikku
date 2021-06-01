import * as React from "react";
import "~/sass/elements/matriculation.scss";
import {
  Examination,
  ExaminationAttentionInformation,
  SaveState,
} from "../../../../@types/shared";

/**
 * MatriculationExaminationEnrollmentActProps
 */
interface MatriculationExaminationEnrollmentActProps {
  examination: Examination;
  draftSaveErrorMsg?: string;
  saveState: SaveState;
  onChange: (examination: Examination) => void;
}

/**
 * MatriculationExaminationEnrollmentAct
 * @param props
 * @returns
 */
export class MatrMatriculationExaminationEnrollmentAct extends React.Component<
  MatriculationExaminationEnrollmentActProps,
  {}
> {
  constructor(props: MatriculationExaminationEnrollmentActProps) {
    super(props);
  }

  onExaminationAttentionInfoChanges = <
    T extends keyof ExaminationAttentionInformation
  >(
    key: T,
    value: ExaminationAttentionInformation[T]
  ) => {
    const { examination, onChange } = this.props;

    const modifiedExamination: Examination = {
      ...examination,
      attentionInformation: {
        ...examination.attentionInformation,
        [key]: value,
      },
    };

    onChange(modifiedExamination);
  };

  render() {
    const { examination, draftSaveErrorMsg, saveState } = this.props;
    const { attentionInformation } = examination;

    /**
     * saving draft error popper
     */
    const savingDraftError = draftSaveErrorMsg && (
      <div className="matriculation__saving-draft matriculation__saving-draft--error">
        <h3 className="matriculation__saving-draft-title">
          Luonnoksen tallentaminen epäonnistui!
        </h3>
        <p>{draftSaveErrorMsg}</p>
      </div>
    );

    /**
     * saving draft info popper
     */
    const savingDraftInfo = saveState && (
      <div className="matriculation__saving-draft matriculation__saving-draft--info">
        <h3 className="matriculation__saving-draft-title">
          {saveState === "SAVING_DRAFT"
            ? "Tallennetaan luonnosta"
            : "Luonnos tallennettu"}
          {saveState === "SAVING_DRAFT" && this.renderAnimatedDots()}
        </h3>
      </div>
    );

    return (
      <div className="matriculation-container">
        {savingDraftError}
        {savingDraftInfo}
        <fieldset className="matriculation-fieldset">
          <legend>Kokeen suorittaminen</legend>
          <div className="matriculation-container__row">
            <div className="matriculation__form-element-container">
              <label>Suorituspaikka</label>
              <select
                onChange={(e) =>
                  this.onExaminationAttentionInfoChanges(
                    "placeToAttend",
                    e.currentTarget.value
                  )
                }
                value={attentionInformation.placeToAttend}
                className="matriculation__form-element__input"
              >
                <option>Mikkeli</option>
                <option value="">Muu</option>
              </select>
            </div>
          </div>

          <div className="pure-u-1-2"></div>
          <div className="matriculation-container__row">
            <div className="matriculation__form-element-container">
              <label>Lisätietoa ohjaajalle</label>
              <textarea
                rows={5}
                onChange={(e) =>
                  this.onExaminationAttentionInfoChanges(
                    "extraInfoForSupervisor",
                    e.currentTarget.value
                  )
                }
                value={attentionInformation.extraInfoForSupervisor}
                className="matriculation__form-element__input matriculation__form-element__input--textarea"
              />
            </div>
          </div>
          <div className="matriculation-container__row">
            <div className="matriculation__form-element-container">
              <label>Julkaisulupa</label>
              <select
                onChange={(e) =>
                  this.onExaminationAttentionInfoChanges(
                    "publishPermission",
                    e.currentTarget.value
                  )
                }
                value={attentionInformation.publishPermission}
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

          <div className="matriculation-container__row">
            <div className="matriculation__form-element-container">
              <label>Nimi</label>
              <input
                value={attentionInformation.publishedName}
                readOnly={true}
                className="matriculation__form-element__input"
                type="text"
              />
            </div>
            <div className="matriculation__form-element-container">
              <label>Päivämäärä</label>
              <input
                value={attentionInformation.date}
                readOnly={true}
                className="matriculation__form-element__input"
                type="text"
              />
            </div>
          </div>
        </fieldset>
      </div>
    );
  }

  /**
   * renderAnimatedDots
   * @returns
   */
  renderAnimatedDots = () => {
    return (
      <>
        <span>.</span>
        <span>.</span>
        <span>.</span>
      </>
    );
  };
}

export default MatrMatriculationExaminationEnrollmentAct;
