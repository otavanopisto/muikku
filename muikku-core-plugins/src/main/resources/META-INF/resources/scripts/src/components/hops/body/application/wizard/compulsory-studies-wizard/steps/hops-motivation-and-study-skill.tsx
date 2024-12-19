import * as React from "react";
import { useEffect, useRef } from "react";
import AnimateHeight from "react-animate-height";
import {
  EmptyRow,
  HopsInputTable,
  InputRow,
} from "../../components/hops-input-table";
import { Textarea } from "../../components/text-area";
import { CompulsoryStudiesHops } from "~/@types/hops";
import { useTranslation } from "react-i18next";

/**
 * Props for the HopsMotivationAndStudySkills component
 */
interface HopsMotivationAndStudySkillsProps {
  disabled: boolean;
  /**
   * Current form data
   */
  form: CompulsoryStudiesHops;
  /**
   * Callback function to update the motivation and study data
   * @param motivationAndStudy Updated CompulsoryStudiesHops object
   */
  onFormChange: (updatedForm: CompulsoryStudiesHops) => void;
}

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
  const { onFormChange, form, disabled } = props;

  const { t } = useTranslation(["hops_new"]);

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
        {/* <legend className="hops-container__subheader hops-container__subheader--required">
          {t("labels.hopsCompulsorySelfAssessmentTitle1", {
            ns: "hops_new",
          })}
        </legend> */}

        <legend className="hops-container__subheader">
          {t("labels.hopsCompulsorySelfAssessmentTitle1", {
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
                label={t("labels.hopsCompulsoryByReadingMaterials", {
                  ns: "hops_new",
                })}
                selectedValue={form.byReadingMaterials}
                groupName="byReadingMaterials"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange(
                  "byReadingMaterials"
                )}
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label={t("labels.hopsCompulsoryByTakingNotes", {
                  ns: "hops_new",
                })}
                selectedValue={form.byTakingNotes}
                groupName="byTakingNotes"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("byTakingNotes")}
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label={t("labels.hopsCompulsoryByDoingExercises", {
                  ns: "hops_new",
                })}
                selectedValue={form.byDoingExercises}
                groupName="byDoingExercises"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("byDoingExercises")}
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label={t("labels.hopsCompulsoryByMemorizing", {
                  ns: "hops_new",
                })}
                selectedValue={form.byMemorizing}
                groupName="byMemorizing"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("byMemorizing")}
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label={t("labels.hopsCompulsoryByWatchingVideos", {
                  ns: "hops_new",
                })}
                selectedValue={form.byWatchingVideos}
                groupName="byWatchingVideos"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("byWatchingVideos")}
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label={t("labels.hopsCompulsoryByListeningTeaching", {
                  ns: "hops_new",
                })}
                selectedValue={form.byListeningTeaching}
                groupName="byListeningTeaching"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange(
                  "byListeningTeaching"
                )}
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label={t("labels.hopsCompulsoryByExplaining", {
                  ns: "hops_new",
                })}
                selectedValue={form.byExplaining}
                groupName="byExplaining"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("byExplaining")}
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label={t("labels.hopsCompulsoryByDiscussing", {
                  ns: "hops_new",
                })}
                selectedValue={form.byDiscussing}
                groupName="byDiscussing"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("byDiscussing")}
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label={t("labels.hopsCompulsoryByWatchingOrDoingExamples", {
                  ns: "hops_new",
                })}
                selectedValue={form.byWatchingOrDoingExamples}
                groupName="byWatchingOrDoingExamples"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange(
                  "byWatchingOrDoingExamples"
                )}
              />
              <EmptyRow colSpan={5} modifiers={["empty", "question-table"]} />
            </HopsInputTable>
          </div>
        </div>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <Textarea
              id="wayToLearnSomeOtherWayExplanation"
              label={t("labels.hopsCompulsorySomeOtherWay", {
                ns: "hops_new",
              })}
              name="someOtherWay"
              value={form.someOtherWay || ""}
              className="hops__textarea"
              disabled={disabled}
              onChange={handleTextareaChange("someOtherWay")}
            />
          </div>
        </div>
      </fieldset>

      <fieldset className="hops-container__fieldset">
        {/* TODO: Add back in when we have the information about validation */}
        {/* <legend className="hops-container__subheader hops-container__subheader--required">
          {t("labels.hopsCompulsorySelfAssessmentTitle2", {
            ns: "hops_new",
          })}
        </legend> */}

        <legend className="hops-container__subheader">
          {t("labels.hopsCompulsorySelfAssessmentTitle2", {
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
              {t("labels.hopsCompulsoryFromFamilyMember", {
                ns: "hops_new",
              })}
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
              {t("labels.hopsCompulsoryFromFriend", {
                ns: "hops_new",
              })}
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
              {t("labels.hopsCompulsoryFromSupportPerson", {
                ns: "hops_new",
              })}
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
              {t("labels.hopsCompulsoryNoSupport", {
                ns: "hops_new",
              })}
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
              {t("labels.hopsCompulsoryStudySupportSomethingElse", {
                ns: "hops_new",
              })}
            </label>
          </div>
        </div>

        <AnimateHeight height={form.studySupportSomethingElse ? "auto" : 0}>
          <div className="hops__form-element-container">
            <Textarea
              id="somethingElseStudySupportExplanation"
              label={t("labels.hopsCompulsoryStudySupportSomethingElseWhat", {
                ns: "hops_new",
              })}
              name="studySupportSomethingElseWhat"
              value={form.studySupportSomethingElseWhat || ""}
              className="hops__textarea"
              disabled={disabled}
              onChange={handleTextareaChange("studySupportSomethingElseWhat")}
            />
          </div>
        </AnimateHeight>
      </fieldset>

      <fieldset className="hops-container__fieldset">
        {/* TODO: Add back in when we have the information about validation */}
        {/* <legend className="hops-container__subheader hops-container__subheader--required">
          {t("labels.hopsCompulsorySelfAssessmentTitle3", {
            ns: "hops_new",
          })}
        </legend> */}

        <legend className="hops-container__subheader">
          {t("labels.hopsCompulsorySelfAssessmentTitle3", {
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
                label={t("labels.hopsCompulsoryLikeStudying", {
                  ns: "hops_new",
                })}
                selectedValue={form.likeStudying}
                groupName="likeStudying"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("likeStudying")}
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label={t("labels.hopsCompulsoryHaveGoals", {
                  ns: "hops_new",
                })}
                selectedValue={form.haveGoals}
                groupName="haveGoals"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("haveGoals")}
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label={t("labels.hopsCompulsoryReadyToAchieveGoals", {
                  ns: "hops_new",
                })}
                selectedValue={form.readyToAchieveGoals}
                groupName="readyToAchieveGoals"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange(
                  "readyToAchieveGoals"
                )}
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label={t("labels.hopsCompulsoryAlwaysFinishJobs", {
                  ns: "hops_new",
                })}
                selectedValue={form.alwaysFinishJobs}
                groupName="alwaysFinishJobs"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("alwaysFinishJobs")}
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label={t("labels.hopsCompulsoryBePedantic", {
                  ns: "hops_new",
                })}
                selectedValue={form.bePedantic}
                groupName="bePedantic"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("bePedantic")}
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label={t("labels.hopsCompulsoryStudyingConcentration", {
                  ns: "hops_new",
                })}
                selectedValue={form.studyingConcentration}
                groupName="studyingConcentration"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange(
                  "studyingConcentration"
                )}
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label={t("labels.hopsCompulsoryAffectedByNoise", {
                  ns: "hops_new",
                })}
                selectedValue={form.affectedByNoise}
                groupName="affectedByNoise"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("affectedByNoise")}
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label={t("labels.hopsCompulsoryCanFollowInstructions", {
                  ns: "hops_new",
                })}
                selectedValue={form.canFollowInstructions}
                groupName="canFollowInstructions"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange(
                  "canFollowInstructions"
                )}
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label={t("labels.hopsCompulsoryCanEvaluateOwnWork", {
                  ns: "hops_new",
                })}
                selectedValue={form.canEvaluateOwnWork}
                groupName="canEvaluateOwnWork"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange(
                  "canEvaluateOwnWork"
                )}
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label={t("labels.hopsCompulsoryCanTakeFeedback", {
                  ns: "hops_new",
                })}
                selectedValue={form.canTakeFeedback}
                groupName="canTakeFeedback"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange("canTakeFeedback")}
              />
              <InputRow
                scaleStart={1}
                scaleInterval={1}
                scaleLength={5}
                labelOnSeparateRow={true}
                label={t(
                  "labels.hopsCompulsoryCanUseBasicComputerFunctionalities",
                  {
                    ns: "hops_new",
                  }
                )}
                selectedValue={form.canUseBasicComputerFunctionalities}
                groupName="canUseBasicComputerFunctionalities"
                disabled={disabled}
                onInputGroupChange={handleScaleRangeChange(
                  "canUseBasicComputerFunctionalities"
                )}
              />
              <EmptyRow colSpan={5} modifiers={["empty", "question-table"]} />
            </HopsInputTable>
          </div>
        </div>

        <div className="hops-container__row">
          <div className="hops__form-element-container">
            <Textarea
              id="somethingElseSelfImageAsStudentExplanation"
              label={t("labels.hopsCompulsorySelfImageSomethingElse", {
                ns: "hops_new",
              })}
              name="selfImageSomethingElse"
              value={form.selfImageSomethingElse || ""}
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
              label={t("labels.hopsCompulsoryWishesForTeachersAndSupervisors", {
                ns: "hops_new",
              })}
              name="wishesForTeachersAndSupervisors"
              value={form.wishesForTeachersAndSupervisors || ""}
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
