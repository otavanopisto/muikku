import React from "react";
import { ExamAttendance } from "~/generated/client";
import { ExamTimerRegistry, TimerValue } from "~/util/exam-timer";
import { useTranslation } from "react-i18next";

/**
 * ExamTimerProps
 */
interface ExamTimerProps {
  exam: ExamAttendance;
}

/**
 * ExamTimer component that shows remaining time for exams with predefined duration
 * @param props props
 * @returns ExamTimer
 */
const ExamTimer = (props: ExamTimerProps) => {
  const { t } = useTranslation(["exams", "common"]);
  const { exam } = props;
  const [timerValue, setTimerValue] = React.useState<TimerValue | null>(null);

  React.useEffect(() => {
    // Only show timer if exam has minutes defined and has been started and not ended
    if (!exam.minutes || !exam.started || exam.ended) {
      return;
    }

    const timerRegistry = ExamTimerRegistry.getInstance();

    // Check if timer already exists, if not start it
    if (!timerRegistry.hasTimer(exam.folderId)) {
      timerRegistry.startTimer(exam.folderId, exam.started, exam.minutes);
    }

    const timer = timerRegistry.getTimer(exam.folderId);
    if (!timer) return;

    // Subscribe to timer updates
    const unsubscribe = timer.subscribe((value) => {
      setTimerValue(value);
    });

    // Get initial value
    setTimerValue(timer.getCurrentValue());

    return () => {
      unsubscribe();
    };
  }, [exam.folderId, exam.started, exam.minutes, exam.ended]);

  // Don't render timer if no minutes defined or exam not started or ended
  if (!exam.minutes || !exam.started || exam.ended || !timerValue) {
    return <div>Ei ajastusta</div>;
  }

  return (
    <>
      {timerValue.isExpired ? (
        <span className="exam__duration exam__duration--expired">
          <span
            className={`exam__duration-accent ${timerValue.isExpired ? "exam__duration-accent--expired" : ""}`}
          >
            {timerValue.formattedTime}
          </span>
        </span>
      ) : (
        <span className="exam__duration">
          {t("labels.timeLeft", {
            ns: "exams",
          })}{" "}
          <span className="exam__duration-accent">
            {timerValue.formattedTime}{" "}
            {t("labels.minutes", {
              ns: "common",
            })}
          </span>
        </span>
      )}
    </>
  );
};

export default ExamTimer;
