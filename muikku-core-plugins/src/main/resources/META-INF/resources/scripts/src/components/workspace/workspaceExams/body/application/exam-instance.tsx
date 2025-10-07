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
import TocTopic, {
  BackToToc,
  Toc,
  TocElement,
  TocTopicRef,
} from "~/components/general/toc";
import { ExamAttendance, MaterialContentNode } from "~/generated/client";
import { localize } from "~/locales/i18n";
import { StateType } from "~/reducers";
import { useActiveMaterial } from "../../hooks/useActiveMaterial";
import ExamMaterial from "./material";
import ExamTimer from "./exam-timer";
import { displayNotification } from "~/actions/base/notifications";
import { ExamTimerRegistry } from "~/util/exam-timer";
import { AnimatePresence, motion, Transition, Variants } from "framer-motion";

const variants: Variants = {
  entering: {
    opacity: 0,
    y: 10,
    scale: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  },
  exit: {
    opacity: 0,
    y: -10,
    scale: 0.95,
  },
};

const transition: Transition = {
  duration: 0.4,
  ease: [0.4, 0, 0.2, 1],
};

const commonMotionProps = {
  initial: "entering",
  animate: "visible",
  exit: "exit",
  transition: transition,
  variants: variants,
};

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

  const [currentExamExpired, setCurrentExamExpired] = React.useState(false);

  const dispatch = useDispatch();

  const { initializeStatus, currentExamStatusInfo, exams, currentExam } =
    useSelector((state: StateType) => state.exams);

  const preExamInfo = React.useMemo(
    () => exams.find((exam) => exam.folderId === examId),
    [exams, examId]
  );

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
            setCurrentExamExpired(true);
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
          `Huomio: Sinulla on alle ${remainingMinutes} minuuttia aikaa jäljellä!`,
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

  // Reset the current exam (if exists) when the component is unmounted
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

  /**
   * Render content
   */
  const renderContent = () => {
    // If minimun exams related information is initialized, but current exam is not started
    // we show pre exam related info
    if (
      initializeStatus === "READY" &&
      currentExamStatusInfo.status === "IDLE"
    ) {
      return (
        <motion.div
          {...commonMotionProps}
          key="pre-info"
          className="exam__info"
        >
          <PreExamInfo exam={preExamInfo} onCloseExam={props.onCloseExam} />
        </motion.div>
      );
    } else if (currentExamStatusInfo.status === "ERROR") {
      return (
        <motion.div
          {...commonMotionProps}
          key="error"
          className="exam exam--dialog"
        >
          <div className="exam__body">
            <div className="exam__content">
              {getErrorMsgByStatusCode(currentExamStatusInfo.statusCode)}
            </div>
          </div>

          <div className="exam__footer">
            <div className="exam__actions exam__actions--centered">
              <Button
                buttonModifiers={["standard-cancel", "cancel"]}
                onClick={props.onCloseExam}
              >
                Sulje koeikkuna
              </Button>
            </div>
          </div>
        </motion.div>
      );
    } else if (currentExamExpired) {
      return (
        <motion.div
          {...commonMotionProps}
          key="expired"
          className="exam exam--dialog"
        >
          <div className="exam__body">
            <div className="exam__content">
              Kokeen aika on umpeutunut ja koe on päättynyt. Palauttamattomat
              tehtävät on merkitty automaattisesti palautetuiksi. Voit sulkea
              koeikkunan.
            </div>
          </div>

          <div className="exam__footer">
            <div className="exam__actions exam__actions--centered">
              <Button
                buttonModifiers={["standard-cancel", "cancel"]}
                onClick={props.onCloseExam}
              >
                Sulje koeikkuna
              </Button>
            </div>
          </div>
        </motion.div>
      );
    } else if (currentExam && currentExam.ended) {
      return (
        <motion.div
          {...commonMotionProps}
          key="ended"
          className="exam exam--dialog"
        >
          <div className="exam__body">
            <div className="exam__content">
              Koe on päättynyt {localize.date(currentExam.ended)}. Voit sulkea
              koe ikkunan
            </div>
          </div>

          <div className="exam__footer">
            <div className="exam__actions exam__actions--centered">
              <Button
                buttonModifiers={["standard-cancel", "cancel"]}
                onClick={props.onCloseExam}
              >
                Sulje koeikkuna
              </Button>
            </div>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div {...commonMotionProps} key="active">
        <ExamInstanceContent
          examId={examId}
          navigation={<ExamInstanceTableOfContents examId={examId} />}
        />
      </motion.div>
    );
  };

  return (
    <AnimatePresence exitBeforeEnter initial={false}>
      {renderContent()}
    </AnimatePresence>
  );
};

/**
 * ExamPreInstanceProps
 * @param props props
 * @returns ExamPreInstanceProps
 */
interface PreExamInfoProps {
  exam?: ExamAttendance;
  onCloseExam: () => void;
}

/**
 * ExamPreInstance
 * @param props props
 * @returns ExamPreInstance
 */
const PreExamInfo = React.memo((props: PreExamInfoProps) => {
  const { exam, onCloseExam } = props;

  const dispatch = useDispatch();

  /**
   * handleStartExam
   */
  const handleStartExam = () => {
    if (exam && exam.folderId) {
      dispatch(startExam({ workspaceFolderId: exam.folderId }));
    }
  };

  // Check if exam has been started
  const isStarted = !!exam?.started;
  // Check if exam has ended
  const isEnded = !!exam?.ended;
  // Check if exam allows restart
  const allowRestart = exam?.allowRestart || false;
  // Check if exam has time limit
  const hasTimeLimit = exam?.minutes > 0 || false;

  /**
   * buttonText
   * @returns button text
   */
  const getButton = () => {
    if (!allowRestart && isEnded) {
      return null;
    }

    if (isStarted && !isEnded) {
      return (
        <Button
          buttonModifiers={["standard-ok", "continue-exam"]}
          onClick={handleStartExam}
        >
          Jatka koetta
        </Button>
      );
    }

    return (
      <Button
        buttonModifiers={["standard-ok", "start-exam"]}
        onClick={handleStartExam}
      >
        Aloita koe
      </Button>
    );
  };

  if (!exam) {
    return null;
  }

  // If user is trying to access the exam after it has ended and the exam does not allow restart, show a message
  if (!allowRestart && isEnded) {
    return (
      <div className="exam exam--dialog">
        <div className="exam__body">
          <div className="exam__content">
            Olet jo suorittanut kokeen, jota ei voida suorittaa uudestaan.
            Mikäli haluat suorittaa kokeen uudestaan, ole yhteydessä
            opettajaasi. Voit sulkea koeikkunan.
          </div>

          <div className="exam__footer">
            <div className="exam__actions exam__actions--centered">
              <Button
                buttonModifiers={["standard-cancel", "cancel"]}
                onClick={props.onCloseExam}
              >
                Sulje koeikkuna
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="exam exam--dialog">
      <div className="exam__body">
        <div className="exam__labels">
          {exam.allowRestart && (
            <span className="exam__label">Kokeen voi suorittaa uudestaan</span>
          )}

          {hasTimeLimit && (
            <span className="exam__label">
              Suoritusaika:{" "}
              <span className="exam__label-accent">
                {exam.minutes} minuuttia
              </span>
            </span>
          )}
        </div>
        {exam.description && (
          <div
            className="exam__content"
            dangerouslySetInnerHTML={{ __html: exam.description }}
          ></div>
        )}

        <div className="exam__footer">
          <div className="exam__actions exam__actions--centered">
            {getButton()}

            <Button
              buttonModifiers={["standard-cancel", "cancel"]}
              onClick={onCloseExam}
            >
              Sulje koeikkuna
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
});

PreExamInfo.displayName = "PreExamInfo";

/**
 * ExamInstanceContentProps
 */
interface ExamInstanceContentProps extends WithTranslation {
  examId: number;
  navigation: React.ReactElement<
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

  const contentPanelRef = React.useRef<ContentPanel>(null);

  const status = useSelector((state: StateType) => state.status);

  const currentExam = useSelector(
    (state: StateType) => state.exams.currentExam
  );

  const { currentExamCompositeReplies } = useSelector(
    (state: StateType) => state.exams
  );

  const workspace = useSelector(
    (state: StateType) => state.workspaces.currentWorkspace
  );

  if (!currentExam || !workspace) {
    return null;
  }

  const sectionSpecificContentData: JSX.Element[] = currentExam.contents.map(
    (content) => {
      const compositeReply = currentExamCompositeReplies.find(
        (reply) => reply.workspaceMaterialId === content.workspaceMaterialId
      );

      return (
        <ContentPanelItem
          id={`p-${content.workspaceMaterialId}`}
          key={content.workspaceMaterialId + ""}
          dataMaterialId={content.workspaceMaterialId}
        >
          <ExamMaterial
            materialContentNode={content}
            workspace={workspace}
            compositeReply={compositeReply}
            anchorItem={
              <BackToToc
                tocElementId={`tocElement-${content.workspaceMaterialId}`}
                openToc={
                  contentPanelRef.current &&
                  contentPanelRef.current.openNavigation
                }
              />
            }
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
          <BackToToc
            tocElementId={`tocTopic-${currentExam.folderId}_${status.userId}`}
            openToc={
              contentPanelRef.current && contentPanelRef.current.openNavigation
            }
          />
        </div>
      </h2>

      {sectionSpecificContentData}
    </section>
  );

  const aside = (
    <div className="exam__aside">
      <ExamTimer exam={currentExam} />
    </div>
  );

  return (
    <ContentPanel
      modifier="workspace-exam"
      navigation={navigation}
      aside={aside}
      t={tProp}
      i18n={i18n}
      tReady={tReady}
      ref={contentPanelRef}
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
  const topicRef = React.useRef<TocTopicRef>(null);
  const elementRefs = React.useRef<{ [key: string]: HTMLAnchorElement[] }>({});
  const tocElementFocusIndexRef = React.useRef(0);

  const { t } = useTranslation();

  const status = useSelector((state: StateType) => state.status);

  const currentExam = useSelector(
    (state: StateType) => state.exams.currentExam
  );

  const activeMaterialId = useSelector(
    (state: StateType) => state.exams.currentExamsActiveNodeId
  );

  const examsCompositeReplies = useSelector(
    (state: StateType) => state.exams.currentExamCompositeReplies
  );

  /**
   * Handles callback to set ref to toc topic
   * @param ref ref
   */
  const handleCallbackTocTopicRef = (ref: TocTopicRef) => {
    topicRef.current = ref;
  };

  /**
   * Handles callback to set ref to toc element
   * @param parentIdentifier parentIdentifier
   * @param index index
   */
  const handleCallbackTocElementRef =
    (parentIdentifier: string, index: number) => (ref: HTMLAnchorElement) => {
      if (!elementRefs.current[parentIdentifier]) {
        elementRefs.current[parentIdentifier] = [];
      }

      elementRefs.current[parentIdentifier][index] = ref;
    };

  /**
   * Handle keydown event on toc topic
   * @param topicIdentifier topicIdentifier
   */
  const handleTocTopicTitleKeyDown =
    (topicIdentifier: string) => (e: React.KeyboardEvent) => {
      // Change focus to first element in topic
      if (e.key === "ArrowDown") {
        e.stopPropagation();
        e.preventDefault();

        tocElementFocusIndexRef.current = 0;

        // Check if there are any elements in topic top focus
        if (elementRefs.current[topicIdentifier].length > 0) {
          elementRefs.current[topicIdentifier][
            tocElementFocusIndexRef.current
          ].setAttribute("tabindex", "0");
          elementRefs.current[topicIdentifier][
            tocElementFocusIndexRef.current
          ].focus();
        }
      }
    };

  /**
   * Handles keydown event on toc element
   * @param parentIdentifier parentIdentifier
   * @returns handleTocElementKeyDown
   */
  const handleTocElementKeyDown =
    (parentIdentifier: string) => (e: React.KeyboardEvent) => {
      /**
       * elementFocusChange
       * @param operation operation
       */
      const elementFocusChange = (operation: "decrement" | "increment") => {
        e.stopPropagation();
        e.preventDefault();

        if (operation === "decrement") {
          tocElementFocusIndexRef.current--;
        } else {
          tocElementFocusIndexRef.current++;
        }

        if (tocElementFocusIndexRef.current < 0) {
          tocElementFocusIndexRef.current =
            elementRefs.current[parentIdentifier].length - 1;
        } else if (
          tocElementFocusIndexRef.current >
          elementRefs.current[parentIdentifier].length - 1
        ) {
          tocElementFocusIndexRef.current = 0;
        }

        elementRefs.current[parentIdentifier][
          tocElementFocusIndexRef.current
        ].setAttribute("tabindex", "0");
        elementRefs.current[parentIdentifier][
          tocElementFocusIndexRef.current
        ].focus();
      };

      if (e.key === "ArrowUp") {
        elementFocusChange("decrement");
      }

      if (e.key === "ArrowDown") {
        elementFocusChange("increment");
      }
    };

  /**
   * Handle blur event on toc element
   * @param parentIdentifier parentIdentifier
   * @param elementIndex elementIndex
   */
  const handleTocElementBlur =
    (parentIdentifier: string, elementIndex: number) =>
    (e: React.FocusEvent) => {
      e.stopPropagation();
      e.preventDefault();

      elementRefs.current[parentIdentifier][elementIndex].setAttribute(
        "tabindex",
        "-1"
      );
    };

  /**
   * Handle focus event on toc element
   * @param elementIndex elementIndex
   */
  const handleTocElementFocus =
    (elementIndex: number) => (e: React.FocusEvent) => {
      e.stopPropagation();
      e.preventDefault();

      tocElementFocusIndexRef.current = elementIndex;
    };

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

  useActiveMaterial(currentExam?.contents || []);

  return (
    <Toc modifier="workspace-materials" tocHeaderTitle="Sisällysluettelo">
      <TocTopic
        isActive={true}
        isHidden={false}
        key={`tocTopic-${currentExam.folderId}`}
        // Used to track local storage value for each user and exam topic
        topicId={`tocTopic-${currentExam.folderId}_${status.userId}`}
        hash={`s-${currentExam.folderId}`}
        name="Tehtävät"
        ref={handleCallbackTocTopicRef}
        onTitleKeyDown={handleTocTopicTitleKeyDown(`s-${currentExam.folderId}`)}
      >
        {currentExam.contents.map((content, contentIndex) => {
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
              hash={`p-${content.workspaceMaterialId}`}
              className={className}
              modifier={modifier}
              isActive={activeMaterialId === content.workspaceMaterialId}
              isHidden={false}
              iconAfter={icon}
              iconAfterTitle={iconTitle}
              aria-label={ariaLabel}
              ref={handleCallbackTocElementRef(
                `s-${currentExam.folderId}`,
                contentIndex
              )}
              onKeyDown={handleTocElementKeyDown(`s-${currentExam.folderId}`)}
              onBlur={handleTocElementBlur(
                `s-${currentExam.folderId}`,
                contentIndex
              )}
              onFocus={handleTocElementFocus(contentIndex)}
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
