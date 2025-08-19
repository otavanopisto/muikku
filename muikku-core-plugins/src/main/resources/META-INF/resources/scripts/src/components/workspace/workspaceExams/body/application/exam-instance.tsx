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
import { StateType } from "~/reducers";
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

  const { currentExamStatus, exams, examsStatus } = useSelector(
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

  const { currentExamStatus } = useSelector((state: StateType) => state.exams);

  const workspace = useSelector(
    (state: StateType) => state.workspaces.currentWorkspace
  );

  if (currentExamStatus === "LOADING") {
    return <div>Ladataan kokeen sisältöä...</div>;
  }

  if (!currentExam || !workspace) {
    return null;
  }

  const sectionSpecificContentData: JSX.Element[] = currentExam.contents.map(
    (content) => (
      <ContentPanelItem
        id={`p-${content.workspaceMaterialId}`}
        key={content.workspaceMaterialId}
      >
        <ExamMaterial materialContentNode={content} workspace={workspace} />
      </ContentPanelItem>
    )
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
  return <div>examId: {examId}</div>;
};

export default ExamInstance;
