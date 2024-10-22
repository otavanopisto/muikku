import * as React from "react";
import { useEffect, useRef } from "react";
import {
  EmptyRow,
  HopsInputTable,
  InputRow,
} from "~/components/general/hops-compulsory-education-wizard/hops-input-table";
import { Textarea } from "~/components/general/hops-compulsory-education-wizard/text-area";
import { SecondaryStudiesHops } from "~/@types/hops";

/**
 * Props for the HopsMotivationAndStudySkills component.
 */
interface HopsMotivationAndStudySkillsProps {
  /**
   * Callback function to handle changes in motivation and study skills.
   * @param motivationAndStudy Updated SecondaryStudiesHops object
   */
  onMotivationAndStudyChange: (
    motivationAndStudy: SecondaryStudiesHops
  ) => void;
  /**
   * Current form data for SecondaryStudiesHops
   */
  form: SecondaryStudiesHops;
}

const disabled = false;

/**
 * HopsMotivationAndStudySkills component
 *
 * This component renders a form for students to self-assess their motivation and study skills.
 * It includes a series of questions with scale inputs and a textarea for additional comments.
 *
 * @param props - The component props
 * @returns React component
 */
const HopsMotivationAndStudySkills: React.FC<
  HopsMotivationAndStudySkillsProps
> = (props) => {
  const { onMotivationAndStudyChange, form } = props;

  const { selfAssessment, moreAboutSelfAssessment } = form;
  const myRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.dispatchEvent(new Event("resize"));
    myRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  /**
   * Handles changes in scale range inputs
   * @param name - The name of the field to update
   * @returns A function that handles the change event
   */
  const handleScaleRangeChange =
    (name: keyof SecondaryStudiesHops) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onMotivationAndStudyChange({
        ...form,
        [name]: {
          [e.currentTarget.name]: parseInt(e.currentTarget.value),
        },
      });
    };

  /**
   * Handles changes in textarea inputs
   * @param name - The name of the field to update
   * @returns A function that handles the change event
   */
  const handleTextareaChange =
    (name: keyof SecondaryStudiesHops) =>
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      onMotivationAndStudyChange({ ...form, [name]: e.currentTarget.value });
    };

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
                label="Suhtaudun opiskeluun myönteisesti."
                selectedValue={selfAssessment.positiveAttitude}
                groupName="positiveAttitude"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("selfAssessment")}
                required
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label="Olen valmis asettamaan tavoitteita opinnoilleni."
                selectedValue={selfAssessment.goalSetting}
                groupName="goalSetting"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("selfAssessment")}
                required
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label="Olen motivoitunut tekemään töitä saavuttaakseni tavoitteeni."
                selectedValue={selfAssessment.goalMotivation}
                groupName="goalMotivation"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("selfAssessment")}
                required
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label="Pyrin tekemään tehtävät sovitussa aikataulussa."
                selectedValue={selfAssessment.taskCompletion}
                groupName="taskCompletion"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("selfAssessment")}
                required
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label="Pystyn keskittymään opiskeluun riittävän hyvin."
                selectedValue={selfAssessment.focusAbility}
                groupName="focusAbility"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("selfAssessment")}
                required
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label="Pystyn seuraamaan ohjeita ja toimimaan niiden mukaisesti."
                selectedValue={selfAssessment.followInstructions}
                groupName="followInstructions"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("selfAssessment")}
                required
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label="Osaan arvioida, mikä on mennyt hyvin ja missä voin vielä kehittyä."
                selectedValue={selfAssessment.selfAssessment}
                groupName="selfAssessment"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("selfAssessment")}
                required
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label="Osaan ottaa vastaan opintoihin liittyvää palautetta."
                selectedValue={selfAssessment.receiveFeedback}
                groupName="receiveFeedback"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("selfAssessment")}
                required
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label="Minulla on hyvät tietotekniikan käyttötaidot opiskelua varten."
                selectedValue={selfAssessment.itSkills}
                groupName="itSkills"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("selfAssessment")}
                required
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label="Minulla on riittävät opiskelutaidot itsenäiseen verkko-opiskeluun."
                selectedValue={selfAssessment.independentLearningSkills}
                groupName="independentLearningSkills"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("selfAssessment")}
                required
              />
              <EmptyRow colSpan={5} modifiers={["empty", "question-table"]} />
            </HopsInputTable>
          </div>
        </div>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <Textarea
              id="selfAssessmentSomeOtherWayExplanation"
              label="Jos haluat, voit kertoa tarkemmin itsellesi sopivista opiskelutavoista:"
              name="moreAboutSelfAssessment"
              value={moreAboutSelfAssessment}
              className="hops__textarea"
              disabled={disabled}
              onChange={handleTextareaChange("moreAboutSelfAssessment")}
            />
          </div>
        </div>
      </fieldset>
    </div>
  );
};

export default HopsMotivationAndStudySkills;
