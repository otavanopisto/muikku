/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from "react";
import {
  useTranslation,
  withTranslation,
  WithTranslation,
} from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { startExam } from "~/actions/workspaces/exams";
import ContentPanel, {
  ContentPanelItem,
} from "~/components/general/content-panel";
import TocTopic, { Toc, TocElement } from "~/components/general/toc";
import { MaterialContentNode } from "~/generated/client";
import { StateType } from "~/reducers";
import { useActiveMaterial } from "../../hooks/useActiveMaterial";
import ExamMaterial from "./material";

/**
 * ExamInstanceProps
 * @param props props
 * @returns ExamInstance
 */
interface ExamInstanceProps {
  examId: number;
}

/**
 * ExamInstance
 * @param props props
 * @returns ExamInstance
 */
const ExamInstance = (props: ExamInstanceProps) => {
  const { examId } = props;

  const dispatch = useDispatch();

  const { currentExamStatus, exams, examsStatus, currentExam } = useSelector(
    (state: StateType) => state.exams
  );

  // Start the exam
  React.useEffect(() => {
    // If the exams are not loaded, do not start the exam
    if (examsStatus !== "READY") {
      return;
    }

    // Start the exam if it is not already started when the component is mounted
    if (examId && currentExamStatus === "IDLE") {
      dispatch(startExam({ workspaceFolderId: examId }));
    }
  }, [dispatch, examId, currentExamStatus, examsStatus]);

  const navigation = <ExamInstanceTableOfContents examId={examId} />;

  return <ExamInstanceContent examId={examId} navigation={navigation} />;
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
  const { examId, navigation, i18n, tReady, t: tProp } = props;

  const currentExam = useSelector(
    (state: StateType) => state.exams.currentExam
  );

  const { initializeStatus, currentExamStatus, examsCompositeReplies } =
    useSelector((state: StateType) => state.exams);

  const workspace = useSelector(
    (state: StateType) => state.workspaces.currentWorkspace
  );

  if (initializeStatus === "LOADING") {
    return <div>Ladataan kokeen sisältöä...</div>;
  }

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

  return (
    <ContentPanel
      modifier="workspace-materials"
      navigation={navigation}
      title={"Kokeen tiedot"}
      t={tProp}
      i18n={i18n}
      tReady={tReady}
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
