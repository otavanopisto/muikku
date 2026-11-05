import * as React from "react";
import { useSelector } from "react-redux";
import { PDFViewer } from "@react-pdf/renderer";
import { useTranslation } from "react-i18next";
import Dialog from "~/components/general/dialog";
import Button from "~/components/general/button";
import { StateType } from "~/reducers";
import { useHopsBasicInfo } from "~/context/hops-basic-info-context";
import HopsPdfDocument from "./hops-pdf-document";
import {
  EMPTY_HOPS_PDF_SELECTION,
  HopsPdfSectionId,
  HopsPdfSectionSelection,
} from "./hops-pdf-types";
import { getHopsPdfStudyPlanPeriods } from "./hops-pdf-helpers";

/**
 * Section option.
 */
interface SectionOption {
  id: HopsPdfSectionId;
  label: string;
}

/**
 * HopsPdfDialogProps
 */
interface HopsPdfDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Dialog for selecting HOPS parts and previewing the generated PDF.
 *
 * @param props props
 * @returns JSX.Element
 */
const HopsPdfDialog = (props: HopsPdfDialogProps) => {
  const { isOpen, onClose } = props;
  const { t } = useTranslation(["hops_new", "common"]);
  const hops = useSelector((state: StateType) => state.hopsNew);
  const { curriculumConfig, studentInfo, userStudyActivity } =
    useHopsBasicInfo();

  const [step, setStep] = React.useState<"select" | "preview">("select");
  const [selection, setSelection] = React.useState<HopsPdfSectionSelection>(
    EMPTY_HOPS_PDF_SELECTION
  );
  const [previewSelection, setPreviewSelection] =
    React.useState<HopsPdfSectionSelection | null>(null);

  const isBackgroundAvailable = curriculumConfig?.isMatrixAvailable ?? false;
  const isStudyPlanAvailable = curriculumConfig?.isMatrixAvailable ?? false;
  const isPostgraduateAvailable = curriculumConfig?.isMatrixAvailable ?? false;
  const isMatriculationAvailable =
    hops.studentInfo?.educationTypeCode === "lukio";

  const studyPlanPeriods = React.useMemo(() => {
    if (!curriculumConfig || !studentInfo || !hops.studentInfo) {
      return [];
    }

    return getHopsPdfStudyPlanPeriods({
      studyProgramName: studentInfo.studyProgramName,
      studentDateInfo: {
        studyStartDate: hops.studentInfo.studyStartDate
          ? new Date(hops.studentInfo.studyStartDate)
          : new Date(NaN),
        studyTimeEnd: hops.studentInfo.studyTimeEnd
          ? new Date(hops.studentInfo.studyTimeEnd)
          : null,
        graduationGoal: hops.hopsStudyPlanState.goals.graduationGoal,
      },
      studyActivities: userStudyActivity?.items ?? [],
      plannedCourses: hops.hopsStudyPlanState.plannedCourses,
      planNotes: hops.hopsStudyPlanState.planNotes,
      curriculumStrategy: curriculumConfig.strategy,
    });
  }, [
    curriculumConfig,
    hops.studentInfo,
    hops.hopsStudyPlanState,
    studentInfo,
    userStudyActivity,
  ]);

  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    setStep("select");
    setPreviewSelection(null);
    setSelection({
      BACKGROUND: isBackgroundAvailable,
      STUDYPLAN: isStudyPlanAvailable,
      MATRICULATION: isMatriculationAvailable,
      POSTGRADUATE: isPostgraduateAvailable,
    });
  }, [
    isOpen,
    isBackgroundAvailable,
    isStudyPlanAvailable,
    isMatriculationAvailable,
    isPostgraduateAvailable,
  ]);

  const sectionOptions: SectionOption[] = [
    {
      id: "BACKGROUND",
      label: t("labels.hopsBackground", { ns: "hops_new" }),
    },
    {
      id: "STUDYPLAN",
      label: t("labels.hopsStudyPlanning", { ns: "hops_new" }),
    },
    {
      id: "MATRICULATION",
      label: t("labels.hopsMatriculation", { ns: "hops_new" }),
    },
    {
      id: "POSTGRADUATE",
      label: t("labels.hopsPostgraduate", { ns: "hops_new" }),
    },
  ];

  const filteredSectionOptions = sectionOptions.filter((section) => {
    switch (section.id) {
      case "BACKGROUND":
        return isBackgroundAvailable;
      case "STUDYPLAN":
        return isStudyPlanAvailable;
      case "MATRICULATION":
        return isMatriculationAvailable;
      case "POSTGRADUATE":
        return isPostgraduateAvailable;
      default:
        return false;
    }
  });

  const hasSelectedSection = filteredSectionOptions.some(
    (section) => selection[section.id]
  );

  /**
   * Handles a section checkbox change.
   *
   * @param id section id
   * @returns change handler
   */
  const handleSectionToggle =
    (id: HopsPdfSectionId) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setSelection((prev) => ({
        ...prev,
        [id]: e.target.checked,
      }));
    };

  /**
   * Freezes the current selection and opens the PDF preview.
   */
  const handleOpenPreview = () => {
    setPreviewSelection({ ...selection });
    setStep("preview");
  };

  /**
   * Returns to the section selection step and unmounts PDFViewer.
   */
  const handleBackToSelection = () => {
    setStep("select");
    setPreviewSelection(null);
  };

  /**
   * Closes the dialog and resets the preview step.
   */
  const handleDialogClose = () => {
    setStep("select");
    setPreviewSelection(null);
    onClose();
  };

  /**
   * Renders dialog content.
   *
   * @returns dialog content
   */
  const dialogContent = () => {
    if (step === "preview" && previewSelection && hops.studentInfo) {
      return (
        <PDFViewer className="hops-pdf">
          <HopsPdfDocument
            selectedSections={previewSelection}
            studentName={`${hops.studentInfo.firstName} ${hops.studentInfo.lastName}`}
            studyProgramName={studentInfo?.studyProgramName || ""}
            educationTypeCode={hops.studentInfo.educationTypeCode}
            counselors={hops.studentInfo.counselorList || []}
            hopsForm={hops.hopsForm}
            matriculationPlan={hops.hopsMatriculation.plan}
            eligibility={hops.hopsMatriculation.eligibility}
            subjectsWithEligibility={
              hops.hopsMatriculation.subjectsWithEligibility
            }
            exams={hops.hopsMatriculation.exams}
            pastExams={hops.hopsMatriculation.pastExams}
            results={hops.hopsMatriculation.results}
            studyPlanPeriods={studyPlanPeriods}
            studyActivities={userStudyActivity?.items ?? []}
            formatCourseLength={
              curriculumConfig?.strategy.getCourseDisplayedLength ??
              ((courseLength: number) => String(courseLength))
            }
          />
        </PDFViewer>
      );
    }

    return (
      <div>
        <div className="form-element dialog__content-row">
          <label>{t("labels.hopsPdfSelectParts", { ns: "hops_new" })}</label>
          <p>{t("content.hopsPdfSelectPartsHelp", { ns: "hops_new" })}</p>
        </div>
        {filteredSectionOptions.map((section) => (
          <div key={section.id} className="form-element dialog__content-row">
            <div className="hops__form-element-container hops__form-element-container--single-row">
              <input
                id={`hops-pdf-section-${section.id}`}
                type="checkbox"
                name={section.id}
                className="hops__input"
                checked={selection[section.id]}
                onChange={handleSectionToggle(section.id)}
              />
              <label
                htmlFor={`hops-pdf-section-${section.id}`}
                className="hops__label"
              >
                {section.label}
              </label>
            </div>
          </div>
        ))}
      </div>
    );
  };

  /**
   * Renders dialog footer.
   *
   * @returns footer
   */
  const footer = () => (
    <div className="dialog__button-set">
      {step === "preview" ? (
        <Button
          buttonModifiers={["cancel", "standard-cancel"]}
          onClick={handleBackToSelection}
        >
          {t("actions.back", { ns: "common" })}
        </Button>
      ) : (
        <Button
          buttonModifiers={["execute", "standard-ok"]}
          onClick={handleOpenPreview}
          disabled={!hasSelectedSection || !hops.studentInfo}
        >
          {t("actions.openPDF", { ns: "common" })}
        </Button>
      )}
    </div>
  );

  return (
    <Dialog
      modifier="hops-pdf-dialog"
      disableScroll
      title={t("labels.hopsPdfDialogTitle", { ns: "hops_new" })}
      onClose={handleDialogClose}
      content={dialogContent}
      footer={footer}
      isOpen={isOpen}
      closeOnOverlayClick={false}
    />
  );
};

export default HopsPdfDialog;
