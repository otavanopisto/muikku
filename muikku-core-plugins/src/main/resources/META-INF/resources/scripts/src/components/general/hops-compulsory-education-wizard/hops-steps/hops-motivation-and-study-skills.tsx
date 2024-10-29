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
  private myRef: HTMLDivElement = undefined;
  /**
   * constructor
   * @param props props
   */
  constructor(props: HopsMotivationAndStudySkillsProps) {
    super(props);

    this.state = {};

    this.isValidated = this.isValidated.bind(this);
  }

  /**
   * componentDidMount
   */
  componentDidMount(): void {
    window.dispatchEvent(new Event("resize"));

    this.myRef.scrollIntoView({ behavior: "smooth" });
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
   * This is for StepZilla way to validated "step"
   * that locks users way to get further in form
   * before all data is given and valitated
   * @returns boolean
   */
  isValidated = () => !this.isInvalid();

  /**
   * Checks if form is invalid
   * @returns boolean
   */
  isInvalid = () =>
    this.props.user === "student" &&
    (this.hopsMotivationAndStudyPropertyHasUndefinedValues("wayToLearn") ||
      this.hopsMotivationAndStudyPropertyHasUndefinedValues("studySupport"));

  /**
   * HopsMotivationAndStudyPropertyHasUndefinedValues
   * @param property property
   */
  hopsMotivationAndStudyPropertyHasUndefinedValues = (
    property: keyof HopsMotivationAndStudy
  ) => {
    const includedUndefineValues = Object.values(
      this.props.motivationAndStudy[property]
    ).includes(undefined);

    return includedUndefineValues;
  };

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
    const { disabled, usePlace } = this.props;
    const { wayToLearn, studySupport, selfImageAsStudent } =
      this.props.motivationAndStudy;

    return (
      <div className="hops-container" ref={(ref) => (this.myRef = ref)}>
        <fieldset className="hops-container__fieldset">
          <legend className="hops-container__subheader hops-container__subheader--required">
            Arvioi, miten hyvin tai huonosti seuraavat opiskelutavat auttavat
            sinua opiskelussa:
          </legend>

          <span className="hops-container__fieldset-description">
            Tähdellä (*) merkityt kentät ovat pakollisia.
          </span>

          <div className="hops-container__row">
            <div className="hops-container__table-container">
              <HopsInputTable usePlace={usePlace}>
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
                  required
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
                  required
                />
                <InputRow
                  scaleStart={1}
                  scaleInterval={1}
                  scaleLength={5}
                  labelOnSeparateRow={true}
                  label="Tehtävien tekeminen"
                  selectedValue={wayToLearn.byDoingExercises}
                  groupName="byDoingExercises"
                  disabled={disabled}
                  onInputGroupChange={this.handleScaleRangeChange("wayToLearn")}
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
                />
                <EmptyRow colSpan={5} modifiers={["empty", "question-table"]} />
              </HopsInputTable>
            </div>
          </div>

          <div className="hops-container__row">
            <div className="hops__form-element-container">
              <Textarea
                id="wayToLearnSomeOtherWayExplanation"
                label="Jos haluat, voit kertoa tarkemmin itsellesi sopivista opiskelutavoista:"
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
          <legend className="hops-container__subheader hops-container__subheader--required">
            Keneltä saat tukea opiskeluusi Nettiperuskoulun ohjaajien ja
            opettajien lisäksi?
          </legend>

          <span className="hops-container__fieldset-description">
            Tähdellä (*) merkityt kentät ovat pakollisia.
          </span>

          <div className="hops-container__row">
            <div className="hops__form-element-container hops__form-element-container--single-row">
              <input
                id="fromFamilyMember"
                type="checkbox"
                name="fromFamilyMember"
                className="hops__input"
                checked={!!studySupport.fromFamilyMember}
                onChange={this.handleCheckboxItemChange("studySupport")}
                disabled={this.props.disabled}
              ></input>
              <label htmlFor="fromFamilyMember" className="hops__label">
                Perheenjäseneltä
              </label>
            </div>
          </div>
          <div className="hops-container__row">
            <div className="hops__form-element-container hops__form-element-container--single-row">
              <input
                id="fromFriend"
                type="checkbox"
                name="fromFriend"
                className="hops__input"
                checked={!!studySupport.fromFriend}
                onChange={this.handleCheckboxItemChange("studySupport")}
                disabled={this.props.disabled}
              ></input>
              <label htmlFor="fromFriend" className="hops__label">
                Ystävältä
              </label>
            </div>
          </div>
          <div className="hops-container__row">
            <div className="hops__form-element-container hops__form-element-container--single-row">
              <input
                id="fromSupportPerson"
                type="checkbox"
                name="fromSupportPerson"
                className="hops__input"
                checked={!!studySupport.fromSupportPerson}
                onChange={this.handleCheckboxItemChange("studySupport")}
                disabled={this.props.disabled}
              ></input>
              <label htmlFor="fromSupportPerson" className="hops__label">
                Tukihenkilöltä
              </label>
            </div>
          </div>
          <div className="hops-container__row">
            <div className="hops__form-element-container hops__form-element-container--single-row">
              <input
                id="noSupport"
                type="checkbox"
                name="noSupport"
                className="hops__input"
                checked={!!studySupport.noSupport}
                onChange={this.handleCheckboxItemChange("studySupport")}
                disabled={this.props.disabled}
              ></input>
              <label htmlFor="noSupport" className="hops__label">
                En saa tukea
              </label>
            </div>
          </div>
          <div className="hops-container__row">
            <div className="hops__form-element-container hops__form-element-container--single-row">
              <input
                id="somethingElseStudySupport"
                type="checkbox"
                name="somethingElse"
                className="hops__input"
                checked={!!studySupport.somethingElse}
                onChange={this.handleCheckboxItemChange("studySupport")}
                disabled={this.props.disabled}
              ></input>
              <label htmlFor="somethingElse" className="hops__label">
                Joku muu
              </label>
            </div>
          </div>

          <AnimateHeight height={studySupport.somethingElse ? "auto" : 0}>
            <div className="hops__form-element-container">
              <Textarea
                id="somethingElseStudySupportExplanation"
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
          <legend className="hops-container__subheader hops-container__subheader--required">
            Arvioi, miten hyvin tai huonosti seuraavat väitteet kuvaavat sinua
            opiskelijana:
          </legend>

          <span className="hops-container__fieldset-description">
            Tähdellä (*) merkityt kentät ovat pakollisia.
          </span>

          <div className="hops-container__row">
            <div className="hops-container__table-container">
              <HopsInputTable usePlace={usePlace}>
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
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
                  required
                />
                <EmptyRow colSpan={5} modifiers={["empty", "question-table"]} />
              </HopsInputTable>
            </div>
          </div>

          <div className="hops-container__row">
            <div className="hops__form-element-container">
              <Textarea
                id="somethingElseSelfImageAsStudentExplanation"
                label="Jos haluat, voit kertoa tarkemmin sinusta opiskelijana:"
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
                id="wishesForTeachersAndSupervisors"
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
