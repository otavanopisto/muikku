import * as React from "react";
import { Textarea } from "../text-area";
import { HopsMotivationAndStudy } from "~/@types/shared";
import { HopsBaseProps } from "..";
import { EmptyRow, HopsInputTable, InputRow } from "../hops-input-table";
import AnimateHeight from "react-animate-height";

/**
 * MotivationAndStudySkillsProps
 */
interface HopsMotivationAndStudySkillsProps extends HopsBaseProps {
  onMotivationAndStudyChange: (
    motivationAndStudy: HopsMotivationAndStudy
  ) => void;
  motivationAndStudy: HopsMotivationAndStudy;
  /**
   * This is utility method to jump specific step. Doesn validate so use it carefully.
   * Weird things is that StepZilla library doesn't support types. So this is need to "activate"
   * this props, so it could work.
   */
  jumpToStep?: (step: number) => void;
}

/**
 * MotivationAndStudySkills
 */
class HopsMotivationAndStudySkills extends React.Component<
  HopsMotivationAndStudySkillsProps,
  Record<string, unknown>
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: HopsMotivationAndStudySkillsProps) {
    super(props);

    this.state = {};
  }

  /**
   * componentDidUpdate
   * @param prevProps prevProps
   */
  componentDidUpdate(
    prevProps: Readonly<HopsMotivationAndStudySkillsProps>
  ): void {
    if (prevProps.disabled !== this.props.disabled) {
      this.props.jumpToStep(0);
    }
  }

  /**
   * Handles textarea changes
   *
   * @param name keyof HopsMotivationAndStudy
   */
  handleTextareaChange =
    (name: keyof HopsMotivationAndStudy) =>
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      this.props.onMotivationAndStudyChange({
        ...this.props.motivationAndStudy,
        [name]: {
          ...this.props.motivationAndStudy[name],
          [e.currentTarget.name]: e.currentTarget.value,
        },
      });
    };

  /**
   * Handles scale range changes depending of property
   *
   * @param name name
   */
  handleScaleRangeChange =
    (name: keyof HopsMotivationAndStudy) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      this.props.onMotivationAndStudyChange({
        ...this.props.motivationAndStudy,
        [name]: {
          ...this.props.motivationAndStudy[name],
          [e.currentTarget.name]: parseInt(e.currentTarget.value),
        },
      });
    };

  /**
   * Handles checkbox item change depending of property
   *
   * @param name keyof HopsMotivationAndStudy
   */
  handleCheckboxItemChange =
    (name: keyof HopsMotivationAndStudy) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      this.props.onMotivationAndStudyChange({
        ...this.props.motivationAndStudy,
        [name]: {
          ...this.props.motivationAndStudy[name],
          [e.target.name]: e.target.checked,
        },
      });
    };

  /**
   * Component render method
   *
   * @returns JSX.Element
   */
  render() {
    const { disabled } = this.props;
    const { wayToLearn, studySupport, selfImageAsStudent } =
      this.props.motivationAndStudy;

    const tableQuestionDescriptions: JSX.Element = (
      <div className="hops-container__table-container--descriptions">
        <div className="hops-container__table-description-item">
          1 = Erittäin huonosti
        </div>
        <div className="hops-container__table-description-item">
          2 = Huonosti
        </div>
        <div className="hops-container__table-description-item">
          3 = Ei hyvin eikä huonosti
        </div>
        <div className="hops-container__table-description-item">4 = Hyvin</div>
        <div className="hops-container__table-description-item">
          5 = Erittäin hyvin
        </div>
      </div>
    );

    return (
      <div className="hops-container">
        <fieldset className="hops-container__fieldset">
          <legend className="hops-container__subheader">Opiskelutavat</legend>

          <div className="hops-container__row">
            {tableQuestionDescriptions}
            <div className="hops-container__table-container">
              <HopsInputTable scaleStart={1} scaleInterval={1} scaleLength={5}>
                <InputRow
                  scaleStart={1}
                  scaleInterval={1}
                  scaleLength={5}
                  labelOnSeparateRow={true}
                  label="Oppimateriaalin lukeminen"
                  selectedValue={wayToLearn.byReadingMaterials}
                  groupName="byReadingMaterials"
                  disabled={disabled}
                  onInputGroupChange={this.handleScaleRangeChange("wayToLearn")}
                />
                <InputRow
                  scaleStart={1}
                  scaleInterval={1}
                  scaleLength={5}
                  labelOnSeparateRow={true}
                  label="Muistiinpanojen tekeminen (esim. miellekartat)"
                  selectedValue={wayToLearn.byTakingNotes}
                  groupName="byTakingNotes"
                  disabled={disabled}
                  onInputGroupChange={this.handleScaleRangeChange("wayToLearn")}
                />
                <InputRow
                  scaleStart={1}
                  scaleInterval={1}
                  scaleLength={5}
                  labelOnSeparateRow={true}
                  label="Tehtävien tekeminen"
                  selectedValue={wayToLearn.byDoingExcercises}
                  groupName="byDoingExcercises"
                  disabled={disabled}
                  onInputGroupChange={this.handleScaleRangeChange("wayToLearn")}
                />
                <InputRow
                  scaleStart={1}
                  scaleInterval={1}
                  scaleLength={5}
                  labelOnSeparateRow={true}
                  label="Asian ulkoa opetteleminen"
                  selectedValue={wayToLearn.byMemorizing}
                  groupName="byMemorizing"
                  disabled={disabled}
                  onInputGroupChange={this.handleScaleRangeChange("wayToLearn")}
                />
                <InputRow
                  scaleStart={1}
                  scaleInterval={1}
                  scaleLength={5}
                  labelOnSeparateRow={true}
                  label="Videoiden katsominen"
                  selectedValue={wayToLearn.byWatchingVideos}
                  groupName="byWatchingVideos"
                  disabled={disabled}
                  onInputGroupChange={this.handleScaleRangeChange("wayToLearn")}
                />
                <InputRow
                  scaleStart={1}
                  scaleInterval={1}
                  scaleLength={5}
                  labelOnSeparateRow={true}
                  label="Opetuksen kuunteleminen"
                  selectedValue={wayToLearn.byListeningTeaching}
                  groupName="byListeningTeaching"
                  disabled={disabled}
                  onInputGroupChange={this.handleScaleRangeChange("wayToLearn")}
                />
                <InputRow
                  scaleStart={1}
                  scaleInterval={1}
                  scaleLength={5}
                  labelOnSeparateRow={true}
                  label="Asian selittäminen toiselle"
                  selectedValue={wayToLearn.byExplaining}
                  groupName="byExplaining"
                  disabled={disabled}
                  onInputGroupChange={this.handleScaleRangeChange("wayToLearn")}
                />
                <InputRow
                  scaleStart={1}
                  scaleInterval={1}
                  scaleLength={5}
                  labelOnSeparateRow={true}
                  label="Muiden kanssa keskusteleminen"
                  selectedValue={wayToLearn.byDiscussing}
                  groupName="byDiscussing"
                  disabled={disabled}
                  onInputGroupChange={this.handleScaleRangeChange("wayToLearn")}
                />
                <InputRow
                  scaleStart={1}
                  scaleInterval={1}
                  scaleLength={5}
                  labelOnSeparateRow={true}
                  label="Toisen tekemisen tai käytännön esimerkkien seuraaminen"
                  selectedValue={wayToLearn.byWatchingOrDoingExamples}
                  groupName="byWatchingOrDoingExamples"
                  disabled={disabled}
                  onInputGroupChange={this.handleScaleRangeChange("wayToLearn")}
                />
                <EmptyRow colSpan={5} modifiers={["empty", "question-table"]} />
              </HopsInputTable>
            </div>
          </div>

          <div className="hops-container__row">
            <div className="hops__form-element-container">
              <Textarea
                label="Jos haluat, voit kertoa tarkemmin itsellesi sopivista opiskelutavoista"
                name="someOtherWay"
                value={wayToLearn.someOtherWay}
                className="hops__textarea"
                disabled={this.props.disabled}
                onChange={this.handleTextareaChange("wayToLearn")}
              />
            </div>
          </div>
        </fieldset>

        <fieldset className="hops-container__fieldset">
          <legend className="hops-container__subheader">
            Keneltä saat tukea opiskeluusi Nettiperuskoulun ohjaajien ja
            opettajien lisäksi?
          </legend>

          <div className="hops-container__row">
            <div className="hops__form-element-container hops__form-element-container--single-row">
              <input
                type="checkbox"
                name="fromFamilyMember"
                className="hops__input"
                checked={studySupport.fromFamilyMember}
                onChange={this.handleCheckboxItemChange("studySupport")}
                disabled={this.props.disabled}
              ></input>
              <label className="hops__label">Perheenjäseneltä</label>
            </div>
          </div>
          <div className="hops-container__row">
            <div className="hops__form-element-container hops__form-element-container--single-row">
              <input
                type="checkbox"
                name="fromFriend"
                className="hops__input"
                checked={studySupport.fromFriend}
                onChange={this.handleCheckboxItemChange("studySupport")}
                disabled={this.props.disabled}
              ></input>
              <label className="hops__label">Ystävältä</label>
            </div>
          </div>
          <div className="hops-container__row">
            <div className="hops__form-element-container hops__form-element-container--single-row">
              <input
                type="checkbox"
                name="fromSupportPerson"
                className="hops__input"
                checked={studySupport.fromSupportPerson}
                onChange={this.handleCheckboxItemChange("studySupport")}
                disabled={this.props.disabled}
              ></input>
              <label className="hops__label">Tukihenkilöltä</label>
            </div>
          </div>
          <div className="hops-container__row">
            <div className="hops__form-element-container hops__form-element-container--single-row">
              <input
                type="checkbox"
                name="noSupport"
                className="hops__input"
                checked={studySupport.noSupport}
                onChange={this.handleCheckboxItemChange("studySupport")}
                disabled={this.props.disabled}
              ></input>
              <label className="hops__label">En saa tukea</label>
            </div>
          </div>
          <div className="hops-container__row">
            <div className="hops__form-element-container hops__form-element-container--single-row">
              <input
                type="checkbox"
                name="somethingElse"
                className="hops__input"
                checked={studySupport.somethingElse}
                onChange={this.handleCheckboxItemChange("studySupport")}
                disabled={this.props.disabled}
              ></input>
              <label className="hops__label">Joku muu</label>
            </div>
          </div>

          <AnimateHeight height={studySupport.somethingElse ? "auto" : 0}>
            <div className="hops__form-element-container">
              <Textarea
                label="Kerro tarkemmin"
                name="somethingElseWhat"
                value={studySupport.somethingElseWhat}
                className="hops__textarea"
                disabled={this.props.disabled}
                onChange={this.handleTextareaChange("studySupport")}
              />
            </div>
          </AnimateHeight>
        </fieldset>

        <fieldset className="hops-container__fieldset">
          <legend className="hops-container__subheader">
            Arvioi, miten hyvin tai huonosti seuraavat väitteet kuvaavat sinua
            opiskelijana:
          </legend>
          <div className="hops-container__row">
            {tableQuestionDescriptions}
            <div className="hops-container__table-container">
              <HopsInputTable scaleStart={1} scaleInterval={1} scaleLength={5}>
                <InputRow
                  scaleStart={1}
                  scaleInterval={1}
                  scaleLength={5}
                  labelOnSeparateRow={true}
                  label="Opiskeleminen on minusta mukavaa"
                  selectedValue={selfImageAsStudent.likeStudying}
                  groupName="likeStudying"
                  disabled={disabled}
                  onInputGroupChange={this.handleScaleRangeChange(
                    "selfImageAsStudent"
                  )}
                />
                <InputRow
                  scaleStart={1}
                  scaleInterval={1}
                  scaleLength={5}
                  labelOnSeparateRow={true}
                  label="Minulla on tavoitteita opinnoilleni"
                  selectedValue={selfImageAsStudent.haveGoals}
                  groupName="haveGoals"
                  disabled={disabled}
                  onInputGroupChange={this.handleScaleRangeChange(
                    "selfImageAsStudent"
                  )}
                />
                <InputRow
                  scaleStart={1}
                  scaleInterval={1}
                  scaleLength={5}
                  labelOnSeparateRow={true}
                  label="Olen valmis tekemään töitä saavuttaakseni tavoitteeni"
                  selectedValue={selfImageAsStudent.readyToAchieveGoals}
                  groupName="readyToAchieveGoals"
                  disabled={disabled}
                  onInputGroupChange={this.handleScaleRangeChange(
                    "selfImageAsStudent"
                  )}
                />
                <InputRow
                  scaleStart={1}
                  scaleInterval={1}
                  scaleLength={5}
                  labelOnSeparateRow={true}
                  label="Teen aina aloittamani työt loppuun"
                  selectedValue={selfImageAsStudent.alwaysFinishJobs}
                  groupName="alwaysFinishJobs"
                  disabled={disabled}
                  onInputGroupChange={this.handleScaleRangeChange(
                    "selfImageAsStudent"
                  )}
                />
                <InputRow
                  scaleStart={1}
                  scaleInterval={1}
                  scaleLength={5}
                  labelOnSeparateRow={true}
                  label="Teen annetut tehtävät sovitussa aikataulussa"
                  selectedValue={selfImageAsStudent.bePedantic}
                  groupName="bePedantic"
                  disabled={disabled}
                  onInputGroupChange={this.handleScaleRangeChange(
                    "selfImageAsStudent"
                  )}
                />
                <InputRow
                  scaleStart={1}
                  scaleInterval={1}
                  scaleLength={5}
                  labelOnSeparateRow={true}
                  label="Ajatukseni ei lähde harhailemaan, kun opiskelen"
                  selectedValue={selfImageAsStudent.studyingConcentration}
                  groupName="studyingConcentration"
                  disabled={disabled}
                  onInputGroupChange={this.handleScaleRangeChange(
                    "selfImageAsStudent"
                  )}
                />
                <InputRow
                  scaleStart={1}
                  scaleInterval={1}
                  scaleLength={5}
                  labelOnSeparateRow={true}
                  label="Pystyn työskentelemään, vaikka ympärilläni olisi häiriöitä"
                  selectedValue={selfImageAsStudent.affectedByNoise}
                  groupName="affectedByNoise"
                  disabled={disabled}
                  onInputGroupChange={this.handleScaleRangeChange(
                    "selfImageAsStudent"
                  )}
                />
                <InputRow
                  scaleStart={1}
                  scaleInterval={1}
                  scaleLength={5}
                  labelOnSeparateRow={true}
                  label="Pystyn seuraamaan ohjeita ja toimimaan niiden mukaisesti"
                  selectedValue={selfImageAsStudent.canFollowInstructions}
                  groupName="canFollowInstructions"
                  disabled={disabled}
                  onInputGroupChange={this.handleScaleRangeChange(
                    "selfImageAsStudent"
                  )}
                />
                <InputRow
                  scaleStart={1}
                  scaleInterval={1}
                  scaleLength={5}
                  labelOnSeparateRow={true}
                  label="Osaan arvioida, missä olen onnistunut ja missä epäonnistunut"
                  selectedValue={selfImageAsStudent.canEvaluateOwnWork}
                  groupName="canEvaluateOwnWork"
                  disabled={disabled}
                  onInputGroupChange={this.handleScaleRangeChange(
                    "selfImageAsStudent"
                  )}
                />
                <InputRow
                  scaleStart={1}
                  scaleInterval={1}
                  scaleLength={5}
                  labelOnSeparateRow={true}
                  label="Otan mielelläni vastaan myös korjaavaa palautetta"
                  selectedValue={selfImageAsStudent.canTakeFeedback}
                  groupName="canTakeFeedback"
                  disabled={disabled}
                  onInputGroupChange={this.handleScaleRangeChange(
                    "selfImageAsStudent"
                  )}
                />
                <InputRow
                  scaleStart={1}
                  scaleInterval={1}
                  scaleLength={5}
                  labelOnSeparateRow={true}
                  label="Osaan käyttää tietokoneella yleisimpiä sovelluksia kuten internet-selainta ja sähköpostia"
                  selectedValue={
                    selfImageAsStudent.canUseBasicComputerFunctionalities
                  }
                  groupName="canUseBasicComputerFunctionalities"
                  disabled={disabled}
                  onInputGroupChange={this.handleScaleRangeChange(
                    "selfImageAsStudent"
                  )}
                />
                <EmptyRow colSpan={5} modifiers={["empty", "question-table"]} />
              </HopsInputTable>
            </div>
          </div>

          <div className="hops-container__row">
            <div className="hops__form-element-container">
              <Textarea
                label="Jos haluat, voit kertoa tarkemmin sinusta opiskelijana"
                name="somethingElse"
                value={selfImageAsStudent.somethingElse}
                className="hops__textarea"
                disabled={this.props.disabled}
                onChange={this.handleTextareaChange("selfImageAsStudent")}
              />
            </div>
          </div>

          <div className="hops-container__row">
            <div className="hops__form-element-container">
              <Textarea
                label="Millaista tukea toivot Nettiperuskoulun ohjaajalta ja opettajilta?"
                name="wishesForTeachersAndSupervisors"
                value={selfImageAsStudent.wishesForTeachersAndSupervisors}
                className="hops__textarea"
                disabled={this.props.disabled}
                onChange={this.handleTextareaChange("selfImageAsStudent")}
              />
            </div>
          </div>
        </fieldset>

        {/*  <fieldset className="hops-container__fieldset">
          <legend className="hops-container__subheader">Muuta?</legend>


        </fieldset> */}
      </div>
    );
  }
}

export default HopsMotivationAndStudySkills;
