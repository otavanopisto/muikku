import * as React from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import { ExamAttendance } from "~/generated/client";
import { localize } from "~/locales/i18n";
import { StateType } from "~/reducers";
import ExamTimer from "./exam-timer";
import "~/sass/elements/exam.scss";
import CkeditorLoaderContent from "~/components/base/ckeditor-loader/content";
import { convertTimeRangeToMinutes } from "~/helper-functions/time-helpers";
import RecordingsList from "~/components/general/voice-recorder/recordings-list";
import { useTranslation } from "react-i18next";
import { RecordValue } from "~/@types/recorder";

/**
 * ExamsListProps
 */
interface ExamsListProps {}

/**
 * ExamsListProps
 * @param props props
 * @returns ExamsList
 */
const ExamsList = (props: ExamsListProps) => {
  const { exams, examsStatus } = useSelector((state: StateType) => state.exams);
  const currentWorkspace = useSelector(
    (state: StateType) => state.workspaces.currentWorkspace
  );

  if (!currentWorkspace || !exams || examsStatus === "LOADING") {
    return <div className="exam loader-empty" />;
  }

  if (examsStatus === "ERROR") {
    return (
      <div className="empty">
        <span>{"ERROR"}</span>
      </div>
    );
  } else if (exams.length === 0) {
    return (
      <div className="empty">
        <span>Kurssilla ei ole kokeita</span>
      </div>
    );
  }

  return (
    <div className="exams">
      {exams.map((exam) => (
        <ExamsListItem key={exam.folderId} exam={exam} />
      ))}
    </div>
  );
};

/**
 * ExamsListItemProps
 */
interface ExamsListItemProps {
  exam: ExamAttendance;
}

/**
 * ExamsListItemProps
 * @param props props
 * @returns ExamsListItem
 */
const ExamsListItem = (props: ExamsListItemProps) => {
  const { exam } = props;
  const { workspaceUrl } = useParams<{ workspaceUrl: string }>();
  const { t } = useTranslation(["evaluation", "common"]);

  /**
   * Render assessment content
   * @returns JSX.Element
   */
  const renderAssessmentContent = () => {
    if (!exam.ended || !exam.evaluationInfo) {
      return null;
    }

    let evalStateClassName = "";
    let evalStateIcon = "";

    switch (exam.evaluationInfo.type) {
      case "FAILED":
        evalStateClassName = "material-page__assignment-assessment--failed";
        evalStateIcon = "icon-thumb-down";
        break;
      case "PASSED":
        evalStateClassName = "material-page__assignment-assessment--passed";
        evalStateIcon = "icon-thumb-up";
        break;
    }

    const literalAssesment = exam.evaluationInfo.text;
    const audioAssessments = exam.evaluationInfo.audioAssessments;

    const audioRecords =
      audioAssessments &&
      audioAssessments.map(
        (aAssessment) =>
          ({
            id: aAssessment.id,
            name: aAssessment.name,
            contentType: aAssessment.contentType,
            url: `/rest/workspace/materialevaluationaudioassessment/${aAssessment.id}`,
          }) as RecordValue
      );

    return (
      <div
        className={`material-page__assignment-assessment ${evalStateClassName}`}
      >
        <div
          className={`material-page__assignment-assessment-icon ${evalStateIcon}`}
        ></div>

        <div className="material-page__assignment-assessment-date">
          <span className="material-page__assignment-assessment-date-label">
            {t("labels.date")}:
          </span>
          <span className="material-page__assignment-assessment-date-data">
            {localize.date(exam.evaluationInfo.date)}
          </span>
        </div>

        {exam.evaluationInfo.grade && (
          <div className="material-page__assignment-assessment-grade">
            <span className="material-page__assignment-assessment-grade-label">
              {t("labels.grade", { ns: "workspace" })}:
            </span>
            <span className="material-page__assignment-assessment-grade-data">
              {exam.evaluationInfo.grade}
            </span>
          </div>
        )}

        {exam.evaluationInfo.points && (
          <div className="material-page__assignment-assessment-points">
            <span className="material-page__assignment-assessment-points-label">
              {t("labels.points", { ns: "workspace" })}:
            </span>
            <span className="material-page__assignment-assessment-points-data">
              {localize.number(exam.evaluationInfo.points)}
            </span>
          </div>
        )}

        <div className="material-page__assignment-assessment-literal">
          <div className="material-page__assignment-assessment-literal-label">
            {t("labels.literalEvaluation", { ns: "evaluation" })}:
          </div>
          <div
            className="material-page__assignment-assessment-literal-data rich-text"
            dangerouslySetInnerHTML={{ __html: literalAssesment }}
          ></div>

          {audioAssessments !== undefined && audioAssessments.length > 0 ? (
            <>
              <div className="material-page__assignment-assessment-verbal-label">
                {t("labels.verbalEvaluation", { ns: "evaluation" })}:
              </div>
              <div className="voice-container">
                <RecordingsList records={audioRecords} noDeleteFunctions />
              </div>
            </>
          ) : null}
        </div>
      </div>
    );
  };

  // Check if exam has ended
  const isEnded = !!exam.ended;

  // Check if exam has been started
  const isStarted = !!exam.started;

  // Check if exam has time limit
  const hasTimeLimit = exam?.minutes > 0 || false;

  // Check if exam allows restart
  const restartAllowed = exam?.allowRestart || false;

  const onGoing = isStarted && !isEnded;

  return (
    <div className="exam">
      {isEnded && <div className="exam__completed-marker" />}
      <h2 className="exam__header">
        <span>{exam.name}</span>
        <div className="exam__labels">
          {restartAllowed && (
            <span className="exam__label">Kokeen voi suorittaa uudestaan</span>
          )}
          {isEnded && hasTimeLimit ? (
            <span className="exam__label">
              Suoritusaika:{" "}
              <span className="exam__label-accent">
                {`${convertTimeRangeToMinutes(exam.started, exam.ended)} (${exam.minutes}) minuuttia`}
              </span>
            </span>
          ) : !isEnded && hasTimeLimit ? (
            <span className="exam__label">
              Suoritusaika:{" "}
              <span className="exam__label-accent">
                {exam.minutes} minuuttia
              </span>
            </span>
          ) : null}
        </div>
      </h2>
      <div className="exam__body">
        {/* Show exam status and time info */}
        <div className="exam__content">
          <CkeditorLoaderContent html={exam.description} />
          {renderAssessmentContent()}
        </div>
        <div className="exam__meta">
          {isEnded ? (
            <span className="exam__status exam__status--ended">
              Koe suoritettu {localize.date(exam.ended, "l, LT")}
            </span>
          ) : onGoing ? (
            <span className="exam__status exam__status--ongoing">
              Koe aloitettu {localize.date(exam.started, "l, LT")}
            </span>
          ) : (
            <span className="exam__status">Koetta ei ole aloitettu</span>
          )}
        </div>
      </div>

      {restartAllowed || !isEnded ? (
        <div className="exam__footer">
          <div className="exam__actions">
            <Link
              className={`exam__actions-button ${onGoing ? "exam__actions-button--ongoing" : ""}`}
              to={`/workspace/${workspaceUrl}/exams/${exam.folderId}`}
            >
              Avaa koe
            </Link>

            {hasTimeLimit && isStarted && !isEnded && <ExamTimer exam={exam} />}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ExamsList;
