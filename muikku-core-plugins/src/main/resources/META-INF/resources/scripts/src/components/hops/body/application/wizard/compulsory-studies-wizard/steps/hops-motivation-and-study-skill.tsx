import * as React from "react";
import { useEffect, useRef } from "react";
import { HopsMotivationAndStudy } from "~/@types/shared";
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
  onMotivationAndStudyChange: (
    motivationAndStudy: CompulsoryStudiesHops
  ) => void;
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
  const { onMotivationAndStudyChange, form } = props;
  const myRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
    myRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  /**
   * Checks if a property of CompulsoryStudiesHops contains any undefined values
   * @param property - Key of CompulsoryStudiesHops
   * @returns boolean indicating if undefined values are present
   */
  /* const hopsMotivationAndStudyPropertyHasUndefinedValues = (
    property: keyof CompulsoryStudiesHops
  ) => {
    const includedUndefineValues = Object.values(form[property]).includes(
      undefined
    );

    return includedUndefineValues;
  }; */

  /**
   * Handles changes in textarea inputs
   * @param name - Key of CompulsoryStudiesHops
   * @returns Event handler function
   */
  const handleTextareaChange =
    (name: keyof CompulsoryStudiesHops) =>
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onMotivationAndStudyChange({
        ...form,
        [name]: {
          [e.currentTarget.name]: e.currentTarget.value,
        },
      });
    };

  /**
   * Handles changes in scale range inputs
   * @param name - Key of HopsMotivationAndStudy
   * @returns Event handler function
   */
  const handleScaleRangeChange =
    (name: keyof HopsMotivationAndStudy) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onMotivationAndStudyChange({
        ...form,
        [name]: {
          ...form[name],
          [e.currentTarget.name]: parseInt(e.currentTarget.value),
        },
      });
    };

  /**
   * Handles changes in checkbox inputs
   * @param name - Key of HopsMotivationAndStudy
   * @returns Event handler function
   */
  const handleCheckboxItemChange =
    (name: keyof HopsMotivationAndStudy) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onMotivationAndStudyChange({
        ...form,
        [name]: {
          ...form[name],
          [e.target.name]: e.target.checked,
        },
      });
    };

  const { wayToLearn, studySupport, selfImageAsStudent } = form;

  return (
    <div className="hops-container" ref={myRef}>
      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader hops-container__subheader--required">
          Arvioi, miten hyvin tai huonosti seuraavat opiskelutavat auttavat
          sinua opiskelussa:
        </legend>

        <span>Tähdellä (*) merkityt kentät ovat pakollisia.</span>

        <div className="hops-container__row">
          <div className="hops-container__table-container">
            <HopsInputTable usePlace={"studies"}>
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label="Oppimateriaalin lukeminen"
                selectedValue={wayToLearn.byReadingMaterials}
                groupName="byReadingMaterials"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("wayToLearn")}
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
                onInputGroupChange={handleScaleRangeChange("wayToLearn")}
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
                onInputGroupChange={handleScaleRangeChange("wayToLearn")}
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
                onInputGroupChange={handleScaleRangeChange("wayToLearn")}
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
                onInputGroupChange={handleScaleRangeChange("wayToLearn")}
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
                onInputGroupChange={handleScaleRangeChange("wayToLearn")}
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
                onInputGroupChange={handleScaleRangeChange("wayToLearn")}
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
                onInputGroupChange={handleScaleRangeChange("wayToLearn")}
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
                onInputGroupChange={handleScaleRangeChange("wayToLearn")}
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
              disabled={disabled}
              onChange={handleTextareaChange("wayToLearn")}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader hops-container__subheader--required">
          Keneltä saat tukea opiskeluusi Nettiperuskoulun ohjaajien ja
          opettajien lisäksi?
        </legend>

        <span>Tähdellä (*) merkityt kentät ovat pakollisia.</span>

        <div className="hops-container__row">
          <div className="hops__form-element-container hops__form-element-container--single-row">
            <input
              id="fromFamilyMember"
              type="checkbox"
              name="fromFamilyMember"
              className="hops__input"
              checked={!!studySupport.fromFamilyMember}
              onChange={handleCheckboxItemChange("studySupport")}
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
              checked={!!studySupport.fromFriend}
              onChange={handleCheckboxItemChange("studySupport")}
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
              checked={!!studySupport.fromSupportPerson}
              onChange={handleCheckboxItemChange("studySupport")}
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
              checked={!!studySupport.noSupport}
              onChange={handleCheckboxItemChange("studySupport")}
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
              checked={!!studySupport.somethingElse}
              onChange={handleCheckboxItemChange("studySupport")}
              disabled={disabled}
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
              disabled={disabled}
              onChange={handleTextareaChange("studySupport")}
            />
          </div>
        </AnimateHeight>
      </fieldset>

      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader hops-container__subheader--required">
          Arvioi, miten hyvin tai huonosti seuraavat väitteet kuvaavat sinua
          opiskelijana:
        </legend>

        <span>Tähdellä (*) merkityt kentät ovat pakollisia.</span>

        <div className="hops-container__row">
          <div className="hops-container__table-container">
            <HopsInputTable usePlace={"studies"}>
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label="Opiskeleminen on minusta mukavaa"
                selectedValue={selfImageAsStudent.likeStudying}
                groupName="likeStudying"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange(
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
                onInputGroupChange={handleScaleRangeChange(
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
                onInputGroupChange={handleScaleRangeChange(
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
                onInputGroupChange={handleScaleRangeChange(
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
                onInputGroupChange={handleScaleRangeChange(
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
                onInputGroupChange={handleScaleRangeChange(
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
                onInputGroupChange={handleScaleRangeChange(
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
                onInputGroupChange={handleScaleRangeChange(
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
                onInputGroupChange={handleScaleRangeChange(
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
                onInputGroupChange={handleScaleRangeChange(
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
                onInputGroupChange={handleScaleRangeChange(
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
              disabled={disabled}
              onChange={handleTextareaChange("selfImageAsStudent")}
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
              disabled={disabled}
              onChange={handleTextareaChange("selfImageAsStudent")}
            />
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default HopsMotivationAndStudySkills;
