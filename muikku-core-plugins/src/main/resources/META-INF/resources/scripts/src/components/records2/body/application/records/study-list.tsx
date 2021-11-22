import * as React from "react";
import { i18nType } from "~/reducers/base/i18n";
import * as moment from "moment";
import {
  MaterialContentNodeType,
  MaterialEvaluationType,
} from "../../../../../reducers/workspaces/index";
import mApi from "~/lib/mApi";
import promisify from "~/util/promisify";
import { WorkspaceType } from "../../../../../reducers/workspaces/index";
import RecordingsList from "~/components/general/voice-recorder/recordings-list";
import {
  MaterialCompositeRepliesType,
  MaterialAssignmentType,
} from "../../../../../reducers/workspaces/index";
import AnimateHeight from "react-animate-height";
import EvaluationMaterial from "~/components/evaluation/body/application/evaluation/evaluation-material";
import { RecordValue } from "~/@types/recorder";
import { useAssignments } from "./hooks/use-assignment";
import { useCompositeReplies } from "./hooks/use-composite-replies";
import { useWorkspace } from "./hooks/use-workspace";
import "~/sass/elements/records.scss";

/**
 * StudyAssignmentsListProps
 */
interface StudyAssignmentsListProps {
  i18n: i18nType;
  userEntityId: number;
  workspaceId: number;
}

/**
 * StudyAssignmentsList
 * @returns JSX.Element
 */
export const StudyAssignmentsList: React.FC<StudyAssignmentsListProps> = ({
  userEntityId,
  i18n,
  workspaceId,
}) => {
  const { loadingAssignments, assignmentsData, serverError } =
    useAssignments(4);

  const {
    loadingCompositeReplies,
    compositeRepliesData,
    serverErrorCompositeReplies,
  } = useCompositeReplies(23, 4);

  const { loadingWorkspace, workspaceData, serverErrorWorkspace } =
    useWorkspace(4);

  let renderContent: JSX.Element | JSX.Element[] = (
    <div className="empty">
      <span>
        {i18n.text.get("plugin.evaluation.evaluationModal.noAssignmentsTitle")}
      </span>
    </div>
  );

  if (loadingAssignments || loadingCompositeReplies || loadingWorkspace) {
    renderContent = <div className="loader-empty" />;
  } else if (
    serverError ||
    serverErrorCompositeReplies ||
    serverErrorWorkspace
  ) {
    renderContent = (
      <div className="empty">
        <span>Error</span>
      </div>
    );
  } else if (assignmentsData.length > 0) {
    renderContent = assignmentsData.map((aItem, i) => {
      const compositeReply = compositeRepliesData.find(
        (cItem) => cItem.workspaceMaterialId === aItem.id
      );

      console.log(workspaceData);

      return (
        <StudyAssignmentsListItem
          key={i}
          i18n={i18n}
          userEntityId={userEntityId}
          workspace={workspaceData}
          assigment={aItem}
          compositeReply={compositeReply}
        />
      );
    });
  }

  return (
    <div style={{ overflowY: "scroll", maxHeight: "400px" }}>
      {renderContent}
    </div>
  );
};

/**
 * StudyAssignmentsListItemProps
 */
interface StudyAssignmentsListItemProps {
  i18n: i18nType;
  userEntityId: number;
  workspace: WorkspaceType;
  assigment: MaterialAssignmentType;
  compositeReply: MaterialCompositeRepliesType;
}

/**
 * studyAssignmentsListItem
 * @returns JSX.Element
 */
export const StudyAssignmentsListItem: React.FC<StudyAssignmentsListItemProps> =
  ({ i18n, assigment, workspace, compositeReply, userEntityId }) => {
    const ref = React.useRef<HTMLDivElement>();

    const [isLoading, setIsLoading] = React.useState(false);
    const [openContent, setOpenContent] = React.useState(false);
    const [materialNode, setMaterilaNode] =
      React.useState<MaterialContentNodeType>(undefined);

    React.useEffect(() => {
      if (materialNode !== undefined && openContent) {
        loadMaterialData();
      }
    }, [openContent]);

    /**
     * loadMaterialData
     */
    const loadMaterialData = async () => {
      setIsLoading(true);

      const sleepp = await sleep(1000);

      let [loadedMaterial] = await Promise.all([
        (async () => {
          let material = (await promisify(
            mApi().materials.html.read(assigment.materialId),
            "callback"
          )()) as MaterialContentNodeType;

          console.log(workspace);

          let evaluation = (await promisify(
            mApi().workspace.workspaces.materials.evaluations.read(
              workspace.id,
              assigment.id,
              {
                userEntityId,
              }
            ),
            "callback"
          )()) as MaterialEvaluationType[];

          let loadedMaterial: MaterialContentNodeType = Object.assign(
            material,
            {
              evaluation: evaluation[0],
              assignment: assigment,
              path: assigment.path,
            }
          );

          return loadedMaterial;
        })(),
        sleepp,
      ]);

      setIsLoading(false);
      setMaterilaNode(loadedMaterial);
    };

    /**
     * toggleOpened
     */
    const handleOpenMaterialContent = () => {
      setOpenContent(!openContent);
    };

    /**
     * renderAssignmentStatus
     * @returns JSX.Element
     */
    const renderAssignmentMeta = (
      compositeReply: MaterialCompositeRepliesType
    ) => {
      if (compositeReply) {
        const { evaluationInfo } = compositeReply;

        /**
         * Checking if assigments is submitted at all.
         * Its date string
         */
        const hasSubmitted = compositeReply.submitted;

        /**
         * Checking if its evaluated with grade
         */
        const evaluatedWithGrade = evaluationInfo && evaluationInfo.grade;

        /**
         * Needs supplementation
         */
        const needsSupplementation =
          evaluationInfo && evaluationInfo.type === "INCOMPLETE";

        /**
         * If evaluation is given as supplementation request and student
         * cancels and makes changes to answers and submits again
         */
        const supplementationDone =
          compositeReply.state === "SUBMITTED" && needsSupplementation;

        /**
         * Evaluation date if evaluated
         */
        const evaluationDate = evaluationInfo && evaluationInfo.date;

        /**
         * Grade class mod
         */
        const assignmentGradeClassMod = assigmentGradeClass(compositeReply);

        return (
          <div className="evaluation-modal__item-meta">
            {hasSubmitted === null ||
            (hasSubmitted !== null && compositeReply.state === "WITHDRAWN") ? (
              <div className="evaluation-modal__item-meta-item">
                <span className="evaluation-modal__item-meta-item-data">
                  {i18n.text.get(
                    "plugin.evaluation.evaluationModal.assignmentNotDoneLabel"
                  )}
                </span>
              </div>
            ) : (
              hasSubmitted && (
                <div className="evaluation-modal__item-meta-item">
                  <span className="evaluation-modal__item-meta-item-label">
                    {i18n.text.get(
                      "plugin.evaluation.evaluationModal.assignmentDoneLabel"
                    )}
                  </span>
                  <span className="evaluation-modal__item-meta-item-data">
                    {moment(hasSubmitted).format("l")}
                  </span>
                </div>
              )
            )}

            {evaluationDate && (
              <div className="evaluation-modal__item-meta-item">
                <span className="evaluation-modal__item-meta-item-label">
                  {i18n.text.get(
                    "plugin.evaluation.evaluationModal.assignmentEvaluatedLabel"
                  )}
                </span>
                <span className="evaluation-modal__item-meta-item-data">
                  {moment(evaluationDate).format("l")}
                </span>
              </div>
            )}

            {evaluatedWithGrade && (
              <div className="evaluation-modal__item-meta-item">
                <span className="evaluation-modal__item-meta-item-label">
                  {i18n.text.get(
                    "plugin.evaluation.evaluationModal.assignmentGradeLabel"
                  )}
                </span>
                <span
                  className={`evaluation-modal__item-meta-item-data evaluation-modal__item-meta-item-data--grade ${assignmentGradeClassMod}`}
                >
                  {evaluationInfo.grade}
                </span>
              </div>
            )}

            {needsSupplementation && !supplementationDone && (
              <div className="evaluation-modal__item-meta-item">
                <span
                  className={`evaluation-modal__item-meta-item-data evaluation-modal__item-meta-item-data--grade ${assignmentGradeClassMod}`}
                >
                  {i18n.text.get(
                    "plugin.evaluation.evaluationModal.assignmentEvaluatedIncompleteLabel"
                  )}
                </span>
              </div>
            )}

            {supplementationDone && (
              <div className="evaluation-modal__item-meta-item">
                <span
                  className={`evaluation-modal__item-meta-item-data evaluation-modal__item-meta-item-data--grade ${assignmentGradeClassMod}`}
                >
                  {i18n.text.get(
                    "plugin.evaluation.evaluationModal.assignmentEvaluatedIncompleteDoneLabel"
                  )}
                </span>
              </div>
            )}
          </div>
        );
      }
    };

    const materialTypeClassMod = materialTypeClass(assigment);

    const evaluatedFunctionClassMod = assignmentFunctionClass(
      compositeReply,
      assigment
    );

    const recordings =
      compositeReply &&
      compositeReply.evaluationInfo &&
      compositeReply.evaluationInfo.audioAssessments.map(
        (aAssessment) =>
          ({
            ...aAssessment,
            url: `/rest/workspace/materialevaluationaudioassessment/${aAssessment.id}`,
          } as RecordValue)
      );

    const contentOpen = openContent ? "auto" : 0;

    return (
      <>
        <div
          className={`evaluation-modal__item-header ${evaluatedFunctionClassMod}`}
          ref={ref}
        >
          <div
            onClick={handleOpenMaterialContent}
            className={`evaluation-modal__item-header-title
                  evaluation-modal__item-header-title--${materialTypeClassMod}
                  `}
          >
            {assigment.title}

            {renderAssignmentMeta(compositeReply)}
          </div>
        </div>
        <AnimateHeight duration={400} height={contentOpen}>
          {compositeReply &&
          compositeReply.evaluationInfo &&
          (compositeReply.evaluationInfo.text || recordings.length > 0) ? (
            <>
              {compositeReply.evaluationInfo.text ? (
                <div className="evaluation-modal__item-literal-assessment">
                  <div className="evaluation-modal__item-literal-assessment-label">
                    {i18n.text.get(
                      "plugin.evaluation.evaluationModal.assignmentLiteralEvaluationLabel"
                    )}
                  </div>

                  <div
                    className="evaluation-modal__item-literal-assessment-data rich-text rich-text--evaluation-literal"
                    dangerouslySetInnerHTML={createHtmlMarkup(
                      compositeReply.evaluationInfo.text
                    )}
                  />
                </div>
              ) : null}

              {recordings.length > 0 ? (
                <div className="evaluation-modal__item-verbal-assessment">
                  <div className="evaluation-modal__item-verbal-assessment-label">
                    {i18n.text.get(
                      "plugin.evaluation.evaluationModal.audioAssessments"
                    )}
                  </div>
                  <div className="voice-container">
                    <RecordingsList records={recordings} noDeleteFunctions />
                  </div>
                </div>
              ) : null}
            </>
          ) : null}
          {isLoading ? (
            <div className="loader-empty" />
          ) : workspace && materialNode ? (
            <EvaluationMaterial
              material={materialNode}
              workspace={workspace}
              compositeReply={compositeReply}
              userEntityId={userEntityId}
            />
          ) : null}
        </AnimateHeight>
      </>
    );
  };

/**
 * assignmentFunctionClass
 * @param compositeReply
 * @returns Assignment function button class
 */
const assignmentFunctionClass = (
  compositeReply?: MaterialCompositeRepliesType,
  assigment?: MaterialAssignmentType
) => {
  if (
    compositeReply &&
    compositeReply.evaluationInfo &&
    compositeReply.evaluationInfo.date
  ) {
    if (
      (compositeReply.evaluationInfo && compositeReply.evaluationInfo.grade) ||
      (compositeReply.evaluationInfo &&
        assigment.assignmentType === "EXERCISE" &&
        compositeReply.evaluationInfo.type === "PASSED")
    ) {
      // Evaluated if graded or if assignment type is excercise and info type returns PASSED
      return "state-EVALUATED";
    } else if (
      compositeReply.state === "SUBMITTED" &&
      compositeReply.evaluationInfo.type === "INCOMPLETE"
    ) {
      // Supplemented as in use to be incomplete but user has submitted it again
      return "state-SUPPLEMENTED";
    } else {
      // Incomplete
      return "state-INCOMPLETE";
    }
  }
};

/**
 * assignmentTypeClass
 * @returns string
 */
const materialTypeClass = (assigment: MaterialAssignmentType) => {
  if (assigment.assignmentType === "EVALUATED") {
    return "assignment";
  }
  return "exercise";
};

/**
 * assigmentGradeClass
 * @param state
 * @returns classMod
 */
const assigmentGradeClass = (compositeReply?: MaterialCompositeRepliesType) => {
  if (compositeReply) {
    const { evaluationInfo } = compositeReply;

    if (evaluationInfo && evaluationInfo.type !== "INCOMPLETE") {
      return "state-EVALUATED";
    } else if (
      compositeReply.state === "SUBMITTED" &&
      evaluationInfo &&
      evaluationInfo.type === "INCOMPLETE"
    ) {
      return "state-SUPPLEMENTED";
    }
    return "state-INCOMPLETE";
  }
};

/**
 * createHtmlMarkup
 * This should sanitize html
 * @param htmlString string that contains html
 */
const createHtmlMarkup = (htmlString: string) => {
  return {
    __html: htmlString,
  };
};

/**
 * sleep
 * @param m milliseconds
 * @returns Promise
 */
const sleep = (m: number) => new Promise((r) => setTimeout(r, m));
