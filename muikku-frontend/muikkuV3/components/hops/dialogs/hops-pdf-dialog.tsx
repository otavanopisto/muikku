import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { PDFViewer } from "@react-pdf/renderer";
import { useTranslation } from "react-i18next";
import Dialog from "~/components/general/dialog";
import Button from "~/components/general/button";
import { StateType } from "~/reducers";
import { useHopsBasicInfo } from "~/context/hops-basic-info-context";
import HopsPdfDocument from "../body/application/pdf/hops-pdf-document";
import {
  EMPTY_HOPS_PDF_SELECTION,
  HopsPdfSectionId,
  HopsPdfSectionSelection,
} from "../body/application/pdf/hops-pdf-types";
import { getHopsPdfStudyPlanPeriods } from "../body/application/pdf/hops-pdf-helpers";
import {
  loadMatriculationData,
  loadStudyPlanData,
} from "~/actions/main-function/hops";
// eslint-disable-next-line camelcase
import { unstable_batchedUpdates } from "react-dom";

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

  const dispatch = useDispatch();

  // Check if background, study plan, postgraduate, and matriculation data is available to use
  const isBackgroundAvailable = curriculumConfig?.isMatrixAvailable ?? false;
  const isStudyPlanAvailable = curriculumConfig?.isMatrixAvailable ?? false;
  const isPostgraduateAvailable = curriculumConfig?.isMatrixAvailable ?? false;
  const isMatriculationAvailable =
    hops.studentInfo?.educationTypeCode === "lukio";

  // Calculate study plan periods
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

  // Reset state when dialog is opened
  React.useEffect(() => {
    if (!isOpen) {
      return;
    }

    unstable_batchedUpdates(() => {
      setStep("select");
      setPreviewSelection(null);
      setSelection({
        BACKGROUND: isBackgroundAvailable,
        STUDYPLAN: isStudyPlanAvailable,
        MATRICULATION: isMatriculationAvailable,
        POSTGRADUATE: isPostgraduateAvailable,
      });
    });
  }, [
    isOpen,
    isBackgroundAvailable,
    isStudyPlanAvailable,
    isMatriculationAvailable,
    isPostgraduateAvailable,
  ]);

  // Load data if loading it is permitted and data doesn't not already exist
  React.useEffect(() => {
    if (!isOpen) {
      return;
    }
    if (isStudyPlanAvailable && hops.hopsStudyPlanStatus === "IDLE") {
      dispatch(
        loadStudyPlanData({
          userIdentifier: hops.currentStudentIdentifier,
        })
      );
    }
    if (isMatriculationAvailable && hops.hopsMatriculationStatus === "IDLE") {
      dispatch(
        loadMatriculationData({
          userIdentifier: hops.currentStudentIdentifier,
        })
      );
    }
  }, [
    dispatch,
    hops.currentStudentIdentifier,
    hops.hopsMatriculationStatus,
    hops.hopsStudyPlanStatus,
    isMatriculationAvailable,
    isOpen,
    isStudyPlanAvailable,
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

  // Filter section options based on availability
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

  // Check if any section is selected
  const hasSelectedSection = filteredSectionOptions.some(
    (section) => selection[section.id]
  );

  /**
   * Checks if a section is ready.
   *
   * @param id section id
   * @returns true if section is ready, false otherwise
   */
  const isSectionReady = (id: HopsPdfSectionId): boolean => {
    switch (id) {
      case "BACKGROUND":
      case "POSTGRADUATE":
        return hops.hopsFormStatus === "READY";
      case "STUDYPLAN":
        return hops.hopsStudyPlanStatus === "READY";
      case "MATRICULATION":
        return hops.hopsMatriculationStatus === "READY";
      default:
        return false;
    }
  };

  /**
   * Checks if a section is loading.
   *
   * @param id section id
   * @returns true if section is loading, false otherwise
   */
  const isSectionLoading = (id: HopsPdfSectionId): boolean => {
    switch (id) {
      case "BACKGROUND":
      case "POSTGRADUATE":
        return (
          hops.hopsFormStatus === "IDLE" || hops.hopsFormStatus === "LOADING"
        );
      case "STUDYPLAN":
        return (
          hops.hopsStudyPlanStatus === "IDLE" ||
          hops.hopsStudyPlanStatus === "LOADING"
        );
      case "MATRICULATION":
        return (
          hops.hopsMatriculationStatus === "IDLE" ||
          hops.hopsMatriculationStatus === "LOADING"
        );
      default:
        return false;
    }
  };

  // Check if any selected section is not ready
  const hasSelectedUnreadySection = filteredSectionOptions.some(
    (section) => selection[section.id] && !isSectionReady(section.id)
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
    unstable_batchedUpdates(() => {
      setStep("select");
      setPreviewSelection(null);
    });
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
                disabled={!isSectionReady(section.id)}
              />
              <label
                htmlFor={`hops-pdf-section-${section.id}`}
                className="hops__label"
              >
                {section.label}
              </label>

              {isSectionLoading(section.id) ? (
                <span className="hops__pdf-section-loader" />
              ) : null}
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
          disabled={
            !hasSelectedSection ||
            hasSelectedUnreadySection ||
            !hops.studentInfo
          }
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
