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

  const currentExam = useSelector(
    (state: StateType) => state.exams.currentExam
  );

  //const { activeMaterialId } = useActiveMaterial(currentExam?.contents || []);

  return (
    <Toc modifier="workspace-materials">
      <TocTopic
        isActive={true}
        isHidden={false}
        key={`p-${currentExam.folderId}`}
        topicId={`p-${currentExam.folderId}`}
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

          return (
            <TocElement
              key={`p-${content.workspaceMaterialId}`}
              id={`p-${content.workspaceMaterialId}`}
              modifier={modifier}
              isActive={false}
              isHidden={false}
              iconAfter={null}
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
