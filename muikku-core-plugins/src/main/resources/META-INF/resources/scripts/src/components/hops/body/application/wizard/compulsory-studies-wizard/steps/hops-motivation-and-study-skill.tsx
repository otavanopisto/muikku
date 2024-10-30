import * as React from "react";
import { useEffect, useRef } from "react";
import AnimateHeight from "react-animate-height";
import {
  EmptyRow,
  HopsInputTable,
  InputRow,
} from "~/components/general/hops-compulsory-education-wizard/hops-input-table";
import { Textarea } from "~/components/general/hops-compulsory-education-wizard/text-area";
import { CompulsoryStudiesHops } from "~/@types/hops";

/**
 * Props for the HopsMotivationAndStudySkills component
 */
interface HopsMotivationAndStudySkillsProps {
  /**
   * Callback function to update the motivation and study data
   * @param motivationAndStudy Updated CompulsoryStudiesHops object
   */
  onFormChange: (updatedForm: CompulsoryStudiesHops) => void;
  /**
   * Current form data
   */
  form: CompulsoryStudiesHops;
}

const disabled = false;

/**
 * HopsMotivationAndStudySkills Component
 *
 * This component renders a form for students to assess their study habits,
 * motivation, and self-image as a student. It includes sections for:
 * - Evaluating different learning methods
 * - Identifying sources of study support
 * - Self-assessment of various study-related traits
 *
 * @param props - Component props of type HopsMotivationAndStudySkillsProps
 * @returns React functional component
 */
const HopsMotivationAndStudySkills: React.FC<
  HopsMotivationAndStudySkillsProps
> = (props) => {
  const { onFormChange, form } = props;
  const myRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
    myRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  /**
   * Handles changes in textarea inputs
   * @param name - Key of CompulsoryStudiesHops
   * @returns Event handler function
   */
  const handleTextareaChange =
    (name: keyof CompulsoryStudiesHops) =>
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onFormChange({
        ...form,
        [name]: e.currentTarget.value,
      });
    };

  /**
   * Handles changes in scale range inputs
   * @param name - Key of HopsMotivationAndStudy
   * @returns Event handler function
   */
  const handleScaleRangeChange =
    (name: keyof CompulsoryStudiesHops) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onFormChange({
        ...form,
        [name]: parseInt(e.currentTarget.value),
      });
    };

  /**
   * Handles changes in checkbox inputs
   * @param name - Key of HopsMotivationAndStudy
   * @returns Event handler function
   */
  const handleCheckboxItemChange =
    (name: keyof CompulsoryStudiesHops) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onFormChange({
        ...form,
        [name]: e.target.checked,
      });
    };

  return (
    <div className="hops-container" ref={myRef}>
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
            <HopsInputTable usePlace={"studies"}>
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label="Oppimateriaalin lukeminen"
                selectedValue={form.byReadingMaterials}
                groupName="byReadingMaterials"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange(
                  "byReadingMaterials"
                )}
                required
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label="Muistiinpanojen tekeminen (esim. miellekartat)"
                selectedValue={form.byTakingNotes}
                groupName="byTakingNotes"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("byTakingNotes")}
                required
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label="Tehtävien tekeminen"
                selectedValue={form.byDoingExercises}
                groupName="byDoingExercises"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("byDoingExercises")}
                required
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label="Asian ulkoa opetteleminen"
                selectedValue={form.byMemorizing}
                groupName="byMemorizing"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("byMemorizing")}
                required
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label="Videoiden katsominen"
                selectedValue={form.byWatchingVideos}
                groupName="byWatchingVideos"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("byWatchingVideos")}
                required
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label="Opetuksen kuunteleminen"
                selectedValue={form.byListeningTeaching}
                groupName="byListeningTeaching"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange(
                  "byListeningTeaching"
                )}
                required
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label="Asian selittäminen toiselle"
                selectedValue={form.byExplaining}
                groupName="byExplaining"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("byExplaining")}
                required
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label="Muiden kanssa keskusteleminen"
                selectedValue={form.byDiscussing}
                groupName="byDiscussing"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("byDiscussing")}
                required
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label="Toisen tekemisen tai käytännön esimerkkien seuraaminen"
                selectedValue={form.byWatchingOrDoingExamples}
                groupName="byWatchingOrDoingExamples"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange(
                  "byWatchingOrDoingExamples"
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
              id="wayToLearnSomeOtherWayExplanation"
              label="Jos haluat, voit kertoa tarkemmin itsellesi sopivista opiskelutavoista:"
              name="someOtherWay"
              value={form.someOtherWay}
              className="hops__textarea"
              disabled={disabled}
              onChange={handleTextareaChange("someOtherWay")}
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
              checked={!!form.fromFamilyMember}
              onChange={handleCheckboxItemChange("fromFamilyMember")}
              disabled={disabled}
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
              checked={!!form.fromFriend}
              onChange={handleCheckboxItemChange("fromFriend")}
              disabled={disabled}
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
              checked={!!form.fromSupportPerson}
              onChange={handleCheckboxItemChange("fromSupportPerson")}
              disabled={disabled}
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
              checked={!!form.noSupport}
              onChange={handleCheckboxItemChange("noSupport")}
              disabled={disabled}
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
              checked={!!form.studySupportSomethingElse}
              onChange={handleCheckboxItemChange("studySupportSomethingElse")}
              disabled={disabled}
            ></input>
            <label htmlFor="somethingElse" className="hops__label">
              Joku muu
            </label>
          </div>
        </div>

        <AnimateHeight height={form.studySupportSomethingElse ? "auto" : 0}>
          <div className="hops__form-element-container">
            <Textarea
              id="somethingElseStudySupportExplanation"
              label="Kerro tarkemmin"
              name="studySupportSomethingElseWhat"
              value={form.studySupportSomethingElseWhat}
              className="hops__textarea"
              disabled={disabled}
              onChange={handleTextareaChange("studySupportSomethingElseWhat")}
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
            <HopsInputTable usePlace={"studies"}>
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label="Opiskeleminen on minusta mukavaa"
                selectedValue={form.likeStudying}
                groupName="likeStudying"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("likeStudying")}
                required
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label="Minulla on tavoitteita opinnoilleni"
                selectedValue={form.haveGoals}
                groupName="haveGoals"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("haveGoals")}
                required
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label="Olen valmis tekemään töitä saavuttaakseni tavoitteeni"
                selectedValue={form.readyToAchieveGoals}
                groupName="readyToAchieveGoals"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange(
                  "readyToAchieveGoals"
                )}
                required
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label="Teen aina aloittamani työt loppuun"
                selectedValue={form.alwaysFinishJobs}
                groupName="alwaysFinishJobs"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("alwaysFinishJobs")}
                required
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label="Teen annetut tehtävät sovitussa aikataulussa"
                selectedValue={form.bePedantic}
                groupName="bePedantic"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("bePedantic")}
                required
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label="Ajatukseni ei lähde harhailemaan, kun opiskelen"
                selectedValue={form.studyingConcentration}
                groupName="studyingConcentration"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange(
                  "studyingConcentration"
                )}
                required
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label="Pystyn työskentelemään, vaikka ympärilläni olisi häiriöitä"
                selectedValue={form.affectedByNoise}
                groupName="affectedByNoise"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("affectedByNoise")}
                required
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label="Pystyn seuraamaan ohjeita ja toimimaan niiden mukaisesti"
                selectedValue={form.canFollowInstructions}
                groupName="canFollowInstructions"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange(
                  "canFollowInstructions"
                )}
                required
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label="Osaan arvioida, missä olen onnistunut ja missä epäonnistunut"
                selectedValue={form.canEvaluateOwnWork}
                groupName="canEvaluateOwnWork"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange(
                  "canEvaluateOwnWork"
                )}
                required
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label="Otan mielelläni vastaan myös korjaavaa palautetta"
                selectedValue={form.canTakeFeedback}
                groupName="canTakeFeedback"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("canTakeFeedback")}
                required
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label="Osaan käyttää tietokoneella yleisimpiä sovelluksia kuten internet-selainta ja sähköpostia"
                selectedValue={form.canUseBasicComputerFunctionalities}
                groupName="canUseBasicComputerFunctionalities"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange(
                  "canUseBasicComputerFunctionalities"
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
              name="selfImageSomethingElse"
              value={form.selfImageSomethingElse}
              className="hops__textarea"
              disabled={disabled}
              onChange={handleTextareaChange("selfImageSomethingElse")}
            />
          </div>
        </div>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <Textarea
              id="wishesForTeachersAndSupervisors"
              label="Millaista tukea toivot Nettiperuskoulun ohjaajalta ja opettajilta?"
              name="wishesForTeachersAndSupervisors"
              value={form.wishesForTeachersAndSupervisors}
              className="hops__textarea"
              disabled={disabled}
              onChange={handleTextareaChange("wishesForTeachersAndSupervisors")}
            />
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default HopsMotivationAndStudySkills;
