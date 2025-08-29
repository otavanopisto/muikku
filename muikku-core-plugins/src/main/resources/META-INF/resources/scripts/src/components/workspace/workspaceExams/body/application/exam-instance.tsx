/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import {
  useTranslation,
  withTranslation,
  WithTranslation,
} from "react-i18next";
import "~/sass/elements/hops.scss";
import { useDispatch, useSelector } from "react-redux";
import { endExam, startExam } from "~/actions/workspaces/exams";
import Button from "~/components/general/button";
import ContentPanel, {
  ContentPanelItem,
} from "~/components/general/content-panel";
import TocTopic, { Toc, TocElement } from "~/components/general/toc";
import { MaterialContentNode } from "~/generated/client";
import { localize } from "~/locales/i18n";
import { StateType } from "~/reducers";
//import { useActiveMaterial } from "../../hooks/useActiveMaterial";
import ExamMaterial from "./material";
import ExamTimer from "./exam-timer";
import { displayNotification } from "~/actions/base/notifications";
import { ExamTimerRegistry } from "~/util/exam-timer";
import { AnimatePresence, motion } from "framer-motion";

/**
 * ExamInstanceProps
 * @param props props
 * @returns ExamInstance
 */
interface ExamInstanceProps {
  examId: number;
  onCloseExam: () => void;
}

/**
 * ExamInstance
 * @param props props
 * @returns ExamInstance
 */
const ExamInstance = (props: ExamInstanceProps) => {
  const { examId } = props;

  const [isExpired, setIsExpired] = React.useState(false);

  const dispatch = useDispatch();

  const { initializeStatus, currentExamStatusInfo, currentExam, examsStatus } =
    useSelector((state: StateType) => state.exams);

  // Start the exam
  React.useEffect(() => {
    // If the exams are not loaded, do not start the exam
    if (examsStatus !== "READY") {
      return;
    }

    // Start the exam if it is not already started when the component is mounted
    if (examId && currentExamStatusInfo.status === "IDLE") {
      dispatch(startExam({ workspaceFolderId: examId }));
    }
  }, [dispatch, examId, currentExamStatusInfo, examsStatus]);

  // Handle timer expiration for active exam
  React.useEffect(() => {
    if (
      !currentExam ||
      !currentExam.minutes ||
      !currentExam.started ||
      currentExam.ended
    ) {
      return;
    }

    /**
     * Handles expired callback. Shows notification and sets isExpired to true.
     */
    const handleExpiredCallback = () => {
      dispatch(
        endExam({
          // eslint-disable-next-line jsdoc/require-jsdoc
          onSuccess: () => {
            dispatch(
              displayNotification(
                "Koe on päättynyt. Vastauksesi on tallennettu automaattisesti",
                "info"
              )
            );
            setIsExpired(true);
          },
        })
      );
    };

    /**
     * Handles warning callback. Shows notification.
     * @param remainingMinutes remainingMinutes
     */
    const handleWarningCallback = (remainingMinutes: number) => {
      dispatch(
        displayNotification(
          `Varoitus: Sinulla on alle ${remainingMinutes} minuuttia aikaa jäljellä!`,
          "fatal"
        )
      );
    };

    const timerRegistry = ExamTimerRegistry.getInstance();

    // Update callbacks for this specific exam instance
    timerRegistry.updateTimerCallbacks(examId, {
      // eslint-disable-next-line jsdoc/require-jsdoc
      onExpire: handleExpiredCallback,
      // eslint-disable-next-line jsdoc/require-jsdoc
      onWarning: handleWarningCallback,
    });
  }, [currentExam, examId, dispatch]);

  // Reset the current exam when the component is unmounted
  React.useEffect(
    () => () => {
      // Reset the current exam
      dispatch({
        type: "EXAMS_RESET_CURRENT_EXAM",
      });

      const timerRegistry = ExamTimerRegistry.getInstance();
      //Remove callbacks related to this exam instance on unmount
      timerRegistry.updateTimerCallbacks(examId, {
        onExpire: undefined,
        onWarning: undefined,
      });
    },
    [dispatch, examId]
  );

  /**
   * renderErrorByStatusCode
   * @param statusCode statusCode
   * @returns JSX.Element
   */
  const getErrorMsgByStatusCode = (statusCode?: number) => {
    if (!statusCode) {
      return "Tapahtui virhe kokeen alustamisessa. Sulje koeikkuna ja yritä uudelleen.";
    }

    switch (statusCode) {
      case 403:
        return "Sinulla ei ole oikeuksia kokeeseen";
      default:
        return "Tapahtui virhe kokeen alustamisessa. Sulje koeikkuna ja yritä uudelleen.";
    }
  };

  return (
    <AnimatePresence>
      {initializeStatus === "LOADING" ||
      currentExamStatusInfo.status === "LOADING" ? (
        <motion.div
          key="loading"
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          Ladataan kokeen sisältöä...
        </motion.div>
      ) : currentExamStatusInfo.status === "ERROR" ? (
        <motion.div
          key="error"
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="hops-container__info"
        >
          <div className="hops-container__state state-FAILED">
            <div className="hops-container__state-icon icon-notification"></div>
            <div className="hops-container__state-text">
              {getErrorMsgByStatusCode(currentExamStatusInfo.statusCode)}
            </div>
          </div>

          <div className="hops-container__row hops-container__row--submit-middle-of-the-form">
            <Button buttonModifiers={["execute"]} onClick={props.onCloseExam}>
              Sulje koeikkuna
            </Button>
          </div>
        </motion.div>
      ) : isExpired ? (
        <motion.div
          key="expired"
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="hops-container__info"
        >
          <div className="hops-container__state state-INFO">
            <div className="hops-container__state-icon icon-notification"></div>
            <div className="hops-container__state-text">
              Kokeen aika on umpeutunut ja koe on päättynyt. Palauttamattomat
              tehtävät on merkitty automaattisesti palautetuiksi. Voit sulkea
              koeikkunan.
            </div>
          </div>

          <div className="hops-container__row hops-container__row--submit-middle-of-the-form">
            <Button buttonModifiers={["execute"]} onClick={props.onCloseExam}>
              Sulje koeikkuna
            </Button>
          </div>
        </motion.div>
      ) : currentExam && currentExam.ended ? (
        <motion.div
          key="ended"
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
          }}
          className="hops-container__info"
        >
          <div className="hops-container__state state-INFO">
            <div className="hops-container__state-icon icon-notification"></div>
            <div className="hops-container__state-text">
              Koe on päättynyt {localize.date(currentExam.ended)}. Voit sulkea
              koe ikkunan
            </div>
          </div>

          <div className="hops-container__row hops-container__row--submit-middle-of-the-form">
            <Button buttonModifiers={["execute"]} onClick={props.onCloseExam}>
              Sulje koeikkuna
            </Button>
          </div>
        </motion.div>
      ) : (
        <motion.div
          key="active"
          initial={{ opacity: 0, y: 10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{
            duration: 0.4,
            ease: [0.4, 0, 0.2, 1],
          }}
        >
          <ExamInstanceContent
            examId={examId}
            navigation={<ExamInstanceTableOfContents examId={examId} />}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

/**
 * ExamInstanceContentProps
 */
interface ExamInstanceContentProps extends WithTranslation {
  examId: number;
  navigation: React.ReactElement<
    any,
    string | React.JSXElementConstructor<any>
  >;
}

/**
 * ExamInstanceContent
 * @param props props
 * @returns ExamInstanceContent
 */
const ExamInstanceContent = withTranslation("workspace")((
  props: ExamInstanceContentProps
) => {
  const { navigation, i18n, tReady, t: tProp } = props;

  const dispatch = useDispatch();

  const currentExam = useSelector(
    (state: StateType) => state.exams.currentExam
  );

  const { examsCompositeReplies } = useSelector(
    (state: StateType) => state.exams
  );

  const workspace = useSelector(
    (state: StateType) => state.workspaces.currentWorkspace
  );

  /**
   * Handles end exam
   */
  const handleEndExam = () => {
    dispatch(endExam({}));
  };

  if (!currentExam || !workspace) {
    return null;
  }

  const sectionSpecificContentData: JSX.Element[] = currentExam.contents.map(
    (content) => {
      const compositeReply = examsCompositeReplies.find(
        (reply) => reply.workspaceMaterialId === content.workspaceMaterialId
      );

      return (
        <ContentPanelItem
          id={`p-${content.workspaceMaterialId}`}
          key={content.workspaceMaterialId}
          dataMaterialId={content.workspaceMaterialId}
        >
          <ExamMaterial
            materialContentNode={content}
            workspace={workspace}
            compositeReply={compositeReply}
          />
        </ContentPanelItem>
      );
    }
  );

  const createSectionElement = (
    <section
      key={"section-" + currentExam.folderId}
      className="content-panel__chapter"
      id={`s-${currentExam.folderId}`}
    >
      {/*TOP OF THE CHAPTER*/}
      <h2 className={`content-panel__chapter-title`}>
        <div className="content-panel__chapter-title-text">
          {currentExam.name}
        </div>
      </h2>

      {sectionSpecificContentData}
    </section>
  );

  const aside = (
    <div className="exam-aside">
      <ExamTimer exam={currentExam} />
    </div>
  );

  const footerActions = <Button onClick={handleEndExam}>Lopeta koe</Button>;

  return (
    <ContentPanel
      modifier="workspace-exam"
      navigation={navigation}
      aside={aside}
      title={"Kokeen tiedot"}
      t={tProp}
      i18n={i18n}
      tReady={tReady}
      footer={footerActions}
    >
      {createSectionElement}
    </ContentPanel>
  );
});

/**
 * ExamInstanceTableOfContentsProps
 * @param props props
 * @returns ExamInstanceTableOfContents
 */
interface ExamInstanceTableOfContentsProps {
  examId: number;
}

/**
 * ExamInstanceTableOfContents
 * @param props props
 * @returns ExamInstanceTableOfContents
 */
const ExamInstanceTableOfContents = (
  props: ExamInstanceTableOfContentsProps
) => {
  const { examId } = props;

  const { t } = useTranslation();

  const status = useSelector((state: StateType) => state.status);

  const currentExam = useSelector(
    (state: StateType) => state.exams.currentExam
  );

  const examsCompositeReplies = useSelector(
    (state: StateType) => state.exams.examsCompositeReplies
  );

  /**
   * getTopicElementAttributes
   * @param content content
   * @returns topic element attributes
   */
  const getTopicElementAttributes = (content: MaterialContentNode) => {
    let icon: string | null = null;
    let iconTitle: string | null = null;
    let className: string | null = null;
    let ariaLabel: string | null = null;

    const compositeReply = examsCompositeReplies.find(
      (reply) => reply.workspaceMaterialId === content.workspaceMaterialId
    );

    if (!compositeReply) {
      return {
        icon,
        iconTitle,
        className,
        ariaLabel,
      };
    }

    switch (compositeReply.state) {
      case "ANSWERED":
        icon = "check";
        className = "toc__item--answered";
        iconTitle = t("labels.assignment", {
          context: "done",
          ns: "materials",
        });
        ariaLabel = t("wcag.tocPageMaterialStatus", {
          context: "done",
          ns: "materials",
        });
        break;
      case "SUBMITTED":
        icon = "check";
        className = "toc__item--submitted";
        iconTitle = t("labels.assignment", {
          context: "returned",
          ns: "materials",
        });
        ariaLabel = t("wcag.tocPageMaterialStatus", {
          context: "submitted",
          ns: "materials",
        });
        break;
      case "WITHDRAWN":
        icon = "check";
        className = "toc__item--withdrawn";
        iconTitle = t("labels.assignment", {
          context: "cancelled",
          ns: "materials",
        });
        ariaLabel = t("wcag.tocPageMaterialStatus", {
          context: "withdrawn",
          ns: "materials",
        });
        break;
      case "INCOMPLETE":
        icon = "check";
        className = "toc__item--incomplete";
        iconTitle = t("labels.evaluated", {
          context: "incomplete",
          ns: "materials",
        });
        ariaLabel = t("wcag.tocPageMaterialStatus", {
          context: "incomplete",
          ns: "materials",
        });
        break;
      case "FAILED":
        icon = "thumb-down";
        className = "toc__item--failed";
        iconTitle = t("labels.evaluated", {
          context: "failed",
          ns: "materials",
        });
        iconTitle = "Tittel";
        ariaLabel = t("wcag.tocPageMaterialStatus", {
          context: "failed",
          ns: "materials",
        });
        break;
      case "PASSED":
        icon = "thumb-up";
        className = "toc__item--passed";
        iconTitle = t("labels.evaluated", {
          context: "passed",
          ns: "materials",
        });
        ariaLabel = t("wcag.tocPageMaterialStatus", {
          context: "passed",
          ns: "materials",
        });
        break;
      case "UNANSWERED":
      default:
        break;
    }

    return {
      icon,
      iconTitle,
      className,
      ariaLabel,
    };
  };

  //const { activeMaterialId } = useActiveMaterial(currentExam?.contents || []);

  return (
    <Toc modifier="workspace-materials" tocHeaderTitle="Sisällysluettelo">
      <TocTopic
        isActive={true}
        isHidden={false}
        key={`tocTopic-${currentExam.folderId}`}
        // Used to track local storage value for each user and exam topic
        topicId={`tocTopic-${currentExam.folderId}_${status.userId}`}
        name="Tehtävät"
      >
        {currentExam.contents.map((content) => {
          const isAssignment = content.assignmentType === "EVALUATED";
          const isExercise = content.assignmentType === "EXERCISE";

          const modifier = isAssignment
            ? "assignment"
            : isExercise
              ? "exercise"
              : null;

          const { icon, iconTitle, className, ariaLabel } =
            getTopicElementAttributes(content);

          return (
            <TocElement
              key={`tocElement-${content.workspaceMaterialId}`}
              id={`tocElement-${content.workspaceMaterialId}`}
              className={className}
              modifier={modifier}
              isActive={false}
              isHidden={false}
              iconAfter={icon}
              iconAfterTitle={iconTitle}
              aria-label={ariaLabel}
            >
              {content.title}
            </TocElement>
          );
        })}
      </TocTopic>
    </Toc>
  );
};

export default ExamInstance;
