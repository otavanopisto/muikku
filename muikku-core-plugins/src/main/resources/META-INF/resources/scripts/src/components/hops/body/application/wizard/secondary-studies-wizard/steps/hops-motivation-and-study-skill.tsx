import * as React from "react";
import { useEffect, useRef } from "react";
import {
  EmptyRow,
  HopsInputTable,
  InputRow,
} from "../../components/hops-input-table";
import { Textarea } from "../../components/text-area";
import { SecondaryStudiesHops } from "~/@types/hops";
import { useTranslation } from "react-i18next";

/**
 * Props for the HopsMotivationAndStudySkills component.
 */
interface HopsMotivationAndStudySkillsProps {
  disabled: boolean;
  /**
   * Current form data for SecondaryStudiesHops
   */
  form: SecondaryStudiesHops;
  /**
   * Callback function to handle changes in motivation and study skills.
   * @param form Updated SecondaryStudiesHops object
   */
  onFormChange: (form: SecondaryStudiesHops) => void;
}

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
  const { onFormChange, form, disabled } = props;

  const { t } = useTranslation(["hops_new"]);

  const { moreAboutSelfAssessment } = form;
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
      onFormChange({
        ...form,
        [name]: parseInt(e.currentTarget.value),
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
      onFormChange({ ...form, [name]: e.currentTarget.value });
    };

  return (
    <div className="hops-container" ref={myRef}>
      <fieldset className="hops-container__fieldset">
        <legend className="hops-container__subheader">
          {t("labels.hopsSecondarySelfAssessmentTitle1", {
            ns: "hops_new",
          })}
        </legend>

        {/* TODO: Add back in when we have the information about validation */}
        {/* <div className="hops-container__fieldset-description">
          {t("labels.hopsFormFieldsRequired", {
            ns: "hops_new",
          })}
        </div> */}

        <div className="hops-container__row">
          <div className="hops-container__table-container">
            <HopsInputTable usePlace={"studies"}>
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label={t("labels.hopsSecondaryPositiveAttitude", {
                  ns: "hops_new",
                })}
                selectedValue={form.positiveAttitude}
                groupName="positiveAttitude"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("positiveAttitude")}
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label={t("labels.hopsSecondaryGoalSetting", {
                  ns: "hops_new",
                })}
                selectedValue={form.goalSetting}
                groupName="goalSetting"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("goalSetting")}
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label={t("labels.hopsSecondaryGoalMotivation", {
                  ns: "hops_new",
                })}
                selectedValue={form.goalMotivation}
                groupName="goalMotivation"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("goalMotivation")}
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label={t("labels.hopsSecondaryTaskCompletion", {
                  ns: "hops_new",
                })}
                selectedValue={form.taskCompletion}
                groupName="taskCompletion"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("taskCompletion")}
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label={t("labels.hopsSecondaryFocusAbility", {
                  ns: "hops_new",
                })}
                selectedValue={form.focusAbility}
                groupName="focusAbility"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("focusAbility")}
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label={t("labels.hopsSecondaryFollowInstructions", {
                  ns: "hops_new",
                })}
                selectedValue={form.followInstructions}
                groupName="followInstructions"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange(
                  "followInstructions"
                )}
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label={t("labels.hopsSecondarySelfAssessment", {
                  ns: "hops_new",
                })}
                selectedValue={form.selfAssessment}
                groupName="selfAssessment"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("selfAssessment")}
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label={t("labels.hopsSecondaryReceiveFeedback", {
                  ns: "hops_new",
                })}
                selectedValue={form.receiveFeedback}
                groupName="receiveFeedback"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("receiveFeedback")}
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label={t("labels.hopsSecondaryItSkills", {
                  ns: "hops_new",
                })}
                selectedValue={form.itSkills}
                groupName="itSkills"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("itSkills")}
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label={t("labels.hopsSecondaryIndependentLearningSkills", {
                  ns: "hops_new",
                })}
                selectedValue={form.independentLearningSkills}
                groupName="independentLearningSkills"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange(
                  "independentLearningSkills"
                )}
              />
              <EmptyRow colSpan={5} modifiers={["empty", "question-table"]} />
            </HopsInputTable>
          </div>
        </div>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <Textarea
              id="selfAssessmentSomeOtherWayExplanation"
              label={t("labels.hopsSecondaryMoreAboutSelfAssessment", {
                ns: "hops_new",
              })}
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
