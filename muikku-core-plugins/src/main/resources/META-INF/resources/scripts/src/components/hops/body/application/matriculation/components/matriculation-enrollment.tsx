import * as React from "react";
import { useTranslation } from "react-i18next";
import { MatriculationExamWithHistory } from "~/reducers/hops";
import {
  MatriculationExamStudentStatus,
  MatriculationExam,
} from "~/generated/client";
import MatriculationExaminationWizardDialog from "~/components/hops/body/application/matriculation/dialogs/matriculation-wizard";
import MatriculationWizardSummaryDialog from "~/components/hops/body/application/matriculation/dialogs/matriculation-summary";
import MatriculationVerifyDialog from "~/components/hops/body/application/matriculation/dialogs/matriculation-verify";
import Button from "~/components/general/button";
import { TFunction } from "i18next";
import ApplicationSubPanel, {
  ApplicationSubPanelItem,
} from "~/components/general/application-sub-panel";
import { localize } from "~/locales/i18n";
import { useHopsBasicInfo } from "~/context/hops-basic-info-context";

/**
 * MatriculationEnrollmentProps
 */
interface MatriculationEnrollmentProps {
  exam: MatriculationExamWithHistory;
  past: boolean;
}

/**
 * Enrollment element. Depending on the status of the exam, it will render different components.
 * @param props props
 * @returns JSX.Element
 */
const MatriculationEnrollment = (props: MatriculationEnrollmentProps) => {
  switch (props.exam.studentStatus) {
    case MatriculationExamStudentStatus.Eligible:
      return <MatriculationEnrollmentLink exam={props.exam} />;

    default:
      return (
        <MatriculationSubmittedEnrollment exam={props.exam} past={props.past} />
      );
  }
};

/**
 * MatriculationSubmittedExamProps
 */
interface MatriculationEnrollmentLinkProps {
  exam: MatriculationExam;
}

/**
 * MatriculationEnrollmentLink
 * @param props props
 * @returns JSX.Element
 */
const MatriculationEnrollmentLink = (
  props: MatriculationEnrollmentLinkProps
) => {
  const { exam } = props;

  const { t } = useTranslation(["hops_new", "common"]);
  const { useCase } = useHopsBasicInfo();

  return (
    <div className="application-sub-panel__notification-item">
      <div className="application-sub-panel__notification-body application-sub-panel__notification-body">
        {t("content.matriculationEnrollmentGuides1", {
          ns: "hops_new",
        })}
      </div>
      <div className="application-sub-panel__notification-footer">
        <MatriculationExaminationWizardDialog
          exam={exam}
          compulsoryEducationEligible={exam.compulsoryEducationEligible}
          formType="initial"
        >
          <Button
            buttonModifiers={["info"]}
            disabled={
              useCase === "GUARDIAN" || useCase === "GUIDANCE_COUNSELOR"
            }
          >
            {t("actions.signUp", {
              ns: "hops_new",
              dueDate: localize.date(new Date(exam.ends)),
            })}
          </Button>
        </MatriculationExaminationWizardDialog>
      </div>
    </div>
  );
};

/**
 * MatriculationSubmittedEnrollmentProps
 */
interface MatriculationSubmittedEnrollmentProps {
  exam: MatriculationExamWithHistory;
  past: boolean;
}

/**
 * MatriculationSubmittedEnrollment
 * @param props props
 * @returns JSX.Element
 */
const MatriculationSubmittedEnrollment = (
  props: MatriculationSubmittedEnrollmentProps
) => {
  const { exam, past } = props;

  const { useCase } = useHopsBasicInfo();

  const { t } = useTranslation(["hops_new", "common"]);

  /**
   * Render function by status
   */
  const renderFunctionByStatus = () => {
    if (past) {
      return (
        <div key={exam.id}>
          <MatriculationWizardSummaryDialog
            exam={exam}
            compulsoryEducationEligible={exam.compulsoryEducationEligible}
            formType="readonly"
          >
            <Button buttonModifiers={["info"]}>
              {t("actions.showOldSummary", {
                ns: "hops_new",
              })}
            </Button>
          </MatriculationWizardSummaryDialog>
        </div>
      );
    }

    if (useCase === "GUARDIAN" || useCase === "GUIDANCE_COUNSELOR") {
      // Guardians can only view the summary
      switch (exam.studentStatus) {
        case MatriculationExamStudentStatus.Pending:
        case MatriculationExamStudentStatus.SupplementationRequest:
        case MatriculationExamStudentStatus.Supplemented:
        case MatriculationExamStudentStatus.Confirmed:
          return (
            <div key={exam.id}>
              <MatriculationWizardSummaryDialog
                exam={exam}
                compulsoryEducationEligible={exam.compulsoryEducationEligible}
                formType="readonly"
              >
                <Button buttonModifiers={["info"]} disabled={past}>
                  {t("actions.showSummary", {
                    ns: "hops_new",
                  })}
                </Button>
              </MatriculationWizardSummaryDialog>
            </div>
          );

        default:
          return null;
      }
    }

    switch (exam.studentStatus) {
      case MatriculationExamStudentStatus.Confirmed:
      case MatriculationExamStudentStatus.Supplemented:
      case MatriculationExamStudentStatus.Pending:
        return (
          <div key={exam.id}>
            <MatriculationWizardSummaryDialog
              exam={exam}
              compulsoryEducationEligible={exam.compulsoryEducationEligible}
              formType="readonly"
            >
              <Button buttonModifiers={["info"]} disabled={past}>
                {t("actions.showSummary", {
                  ns: "hops_new",
                })}
              </Button>
            </MatriculationWizardSummaryDialog>
          </div>
        );

      case MatriculationExamStudentStatus.SupplementationRequest:
        return (
          <div key={exam.id}>
            <MatriculationExaminationWizardDialog
              exam={exam}
              compulsoryEducationEligible={exam.compulsoryEducationEligible}
              formType="editable"
            >
              <Button buttonModifiers={["info"]} disabled={past}>
                {t("actions.supplementRegistration", {
                  ns: "hops_new",
                })}
              </Button>
            </MatriculationExaminationWizardDialog>
          </div>
        );

      case MatriculationExamStudentStatus.Approved:
        return (
          <div key={exam.id}>
            <MatriculationVerifyDialog
              exam={exam}
              compulsoryEducationEligible={exam.compulsoryEducationEligible}
              formType="readonly"
            >
              <Button buttonModifiers={["info"]} disabled={past}>
                {t("actions.confirmRegistration", {
                  ns: "hops_new",
                })}
              </Button>
            </MatriculationVerifyDialog>
          </div>
        );

      default:
        return null;
    }
  };

  const functionByStatus = renderFunctionByStatus();

  const termLocale = t(`matriculationTerms.${exam.term}`, {
    ns: "hops_new",
    year: exam.year,
  });

  const date = localize.date(new Date(exam.enrollment.enrollmentDate));

  const enrollmentTitle = (
    <span
      dangerouslySetInnerHTML={{
        __html: t("content.matriculationEnrollmentDone", {
          ns: "hops_new",
          term: termLocale.toLowerCase(),
        }),
      }}
    />
  );

  return (
    <ApplicationSubPanel>
      <ApplicationSubPanel.Body>
        <ApplicationSubPanelItem title={enrollmentTitle}>
          <ApplicationSubPanelItem.Content>
            {date}
          </ApplicationSubPanelItem.Content>
        </ApplicationSubPanelItem>

        <ApplicationSubPanelItem
          title={t("labels.matriculationEnrollmentCloses", {
            ns: "hops_new",
          })}
        >
          <ApplicationSubPanelItem.Content>
            {localize.date(new Date(exam.ends))}
          </ApplicationSubPanelItem.Content>
        </ApplicationSubPanelItem>
        <ApplicationSubPanelItem
          title={t("labels.matriculationEnrollmentStatus", {
            ns: "hops_new",
          })}
        >
          <ApplicationSubPanelItem.Content>
            {getLocaleByExamStatus(exam.studentStatus, t)}
          </ApplicationSubPanelItem.Content>
        </ApplicationSubPanelItem>

        {exam.changeLogs[0] && exam.changeLogs[0].message !== null && (
          <ApplicationSubPanelItem
            title={t("labels.matriculationEnrollmentMessage", {
              ns: "hops_new",
            })}
          >
            <ApplicationSubPanelItem.Content>
              {exam.changeLogs[0].message}
            </ApplicationSubPanelItem.Content>
          </ApplicationSubPanelItem>
        )}

        {functionByStatus && (
          <ApplicationSubPanelItem
            title={t("labels.matriculationEnrollmentInfo", {
              ns: "hops_new",
            })}
          >
            <ApplicationSubPanelItem.Content modifier="no-bg">
              {functionByStatus}
            </ApplicationSubPanelItem.Content>
          </ApplicationSubPanelItem>
        )}
      </ApplicationSubPanel.Body>
    </ApplicationSubPanel>
  );
};

/**
 * getLocaleByStatus
 * @param examStatus examStatus
 * @param t t
 */
const getLocaleByExamStatus = (
  examStatus: MatriculationExamStudentStatus,
  t: TFunction
) => {
  const statusMap: {
    [key in MatriculationExamStudentStatus]?: string;
  } = {
    [MatriculationExamStudentStatus.Pending]: t(
      "matriculationEnrollmentStatuses.pending",
      {
        ns: "hops_new",
      }
    ),
    [MatriculationExamStudentStatus.SupplementationRequest]: t(
      "matriculationEnrollmentStatuses.supplementationRequest",
      {
        ns: "hops_new",
      }
    ),
    [MatriculationExamStudentStatus.Supplemented]: t(
      "matriculationEnrollmentStatuses.supplemented",
      {
        ns: "hops_new",
      }
    ),
    [MatriculationExamStudentStatus.Approved]: t(
      "matriculationEnrollmentStatuses.Approved",
      {
        ns: "hops_new",
      }
    ),
    [MatriculationExamStudentStatus.Rejected]: t(
      "matriculationEnrollmentStatuses.rejected",
      {
        ns: "hops_new",
      }
    ),
    [MatriculationExamStudentStatus.Confirmed]: t(
      "matriculationEnrollmentStatuses.confirmed",
      {
        ns: "hops_new",
      }
    ),
  };

  return statusMap[examStatus];
};

export default MatriculationEnrollment;
