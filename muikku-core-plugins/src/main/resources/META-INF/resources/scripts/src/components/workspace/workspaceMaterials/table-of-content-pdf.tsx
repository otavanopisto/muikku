import * as React from "react";
import { Document, Page, Path, Svg, Text, View } from "@react-pdf/renderer";
import { styles } from "./table-of-content-pdf-styles";
import {
  MaterialCompositeRepliesListType,
  MaterialContentNodeListType,
  MaterialContentNodeType,
  MaterialViewRestriction,
  WorkspaceType,
} from "~/reducers/workspaces";
import { StatusType } from "~/reducers/base/status";

/**
 * ContentType
 */
interface ContentType {
  type: "topic" | "element";
  material: MaterialContentNodeType;
}

/**
 * NoteBookPDFProps
 */
interface TableOfContentPFDProps {
  status: StatusType;
  workspace?: WorkspaceType;
  assignmentTypeFilters: string[];
  workspaceName?: string;
  materials?: MaterialContentNodeListType;
  compositeReplies: MaterialCompositeRepliesListType;
}

/**
 * TableOfContentPDF
 * @param props props
 * @returns JSX.Element
 */
const TableOfContentPDF = (props: TableOfContentPFDProps) => {
  const {
    status,
    workspace,
    materials,
    assignmentTypeFilters,
    compositeReplies,
  } = props;

  const renderToc = () => {
    const content: ContentType[] = [];

    if (materials) {
      materials.forEach((mNode) => {
        content.push({ type: "topic", material: mNode });

        if (mNode.children) {
          mNode.children.forEach((mSubNode) => {
            content.push({ type: "element", material: mSubNode });
          });
        }
      });
    }

    return (
      <View wrap style={styles.contentContainer}>
        {content.map((c, i) => {
          if (c.type === "topic") {
            return renderContentTopic(c.material, i);
          } else {
            return renderContentElement(c.material, i);
          }
        })}
      </View>
    );
  };

  /**
   * renderContentElement
   * @param mSubNode mSubNode
   * @param index index
   * @returns JSX.Element
   */
  const renderContentElement = (
    mSubNode: MaterialContentNodeType,
    index: number
  ) => {
    const jotain = 0;

    const topicMaterial = materials.find((m) => m.id === mSubNode.parentId);

    const isTocTopicViewRestrictedFromUser =
      (topicMaterial &&
        topicMaterial.viewRestrict === MaterialViewRestriction.LOGGED_IN &&
        !status.loggedIn) ||
      (topicMaterial &&
        topicMaterial.viewRestrict ===
          MaterialViewRestriction.WORKSPACE_MEMBERS &&
        !workspace.isCourseMember &&
        (status.isStudent || !status.loggedIn));

    // Boolean if there is view Restriction for toc element
    const isTocElementViewRestricted =
      mSubNode.viewRestrict === MaterialViewRestriction.LOGGED_IN ||
      mSubNode.viewRestrict === MaterialViewRestriction.WORKSPACE_MEMBERS;

    const isAssignment = mSubNode.assignmentType === "EVALUATED";
    const isExercise = mSubNode.assignmentType === "EXERCISE";
    const isJournal = mSubNode.assignmentType === "JOURNAL";
    const isInterimEvaluation =
      mSubNode.assignmentType === "INTERIM_EVALUATION";
    const isTheory = mSubNode.assignmentType === null;

    const assigmentTypeStyles = isAssignment
      ? styles.tocElementAssignment
      : isExercise
      ? styles.tocElementExcercise
      : isJournal
      ? styles.tocElementJournal
      : isInterimEvaluation
      ? styles.tocElementInterimEvaluation
      : null;

    const filteredOut = !assignmentTypeFilters.includes(
      mSubNode.assignmentType || (isTheory && "THEORY")
    );

    // If Toc topic is restricted so is the element
    // Or if element is restricted
    // Or if element is filtered out
    if (
      isTocTopicViewRestrictedFromUser ||
      isTocElementViewRestricted ||
      filteredOut
    ) {
      return null;
    }

    const materialCompositeReply =
      compositeReplies &&
      compositeReplies.find(
        (reply) => reply.workspaceMaterialId === mSubNode.workspaceMaterialId
      );

    let showEvenIfHidden = false;

    if (mSubNode.hidden && materialCompositeReply) {
      showEvenIfHidden = materialCompositeReply.submitted !== null;
    }

    // If element is hidden and user has not submitted a reply
    if (mSubNode.hidden && !showEvenIfHidden) {
      return null;
    }

    let icon = null;
    let stylesByState = null;

    if (materialCompositeReply) {
      switch (materialCompositeReply.state) {
        case "ANSWERED":
          icon = "vastattu check";
          stylesByState = styles.tocElementStateAnswered;

          break;
        case "SUBMITTED":
          icon = "palautettu check";
          stylesByState = styles.tocElementStateSubmitted;

          break;
        case "WITHDRAWN":
          icon = "peruutettu check";
          stylesByState = styles.tocElementStateWithdrawn;

          break;
        case "INCOMPLETE":
          icon = "puutteellinen check";
          stylesByState = styles.tocElementStateIncomplete;

          break;
        case "FAILED":
          icon = "hylätty thumb-down";
          stylesByState = styles.tocElementStateFailed;

          break;
        case "PASSED":
          icon = "läpäisty thumb-up";
          stylesByState = styles.tocElementStatePassed;
          break;
        case "UNANSWERED":
        default:
          break;
      }
    }

    return (
      <View
        key={mSubNode.id}
        style={{ ...styles.tocElementContainer, ...assigmentTypeStyles }}
      >
        <Text style={styles.tocElementTitle}>{mSubNode.title}</Text>
        <Text style={{ ...styles.tocElementIcon, ...stylesByState }}>
          {icon}
        </Text>
      </View>
    );
  };

  /**
   * renderContentTopic
   * @param mNode mNode
   * @param index index
   * @returns JSX.Element
   */
  const renderContentTopic = (
    mNode: MaterialContentNodeType,
    index: number
  ) => {
    const jotain = 0;

    return (
      <View key={mNode.id} wrap={false} style={styles.tocTopicContainer}>
        <View style={styles.tocTopicTitle}>
          <Text>{mNode.title}</Text>
        </View>
      </View>
    );
  };

  let pageTitle = "Muistiinpanot";

  if (props.workspaceName) {
    pageTitle += ` - ${props.workspaceName}`;
  }

  return (
    <Document>
      <Page style={styles.body} size="A4" wrap>
        <Text style={styles.pageTitle}>{pageTitle}</Text>

        {materials && materials.length > 0 ? (
          renderToc()
        ) : (
          <View style={styles.contentContainer}>
            <Text style={styles.noteFieldLabel}>Ei muistiinpanoja</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

export default TableOfContentPDF;
