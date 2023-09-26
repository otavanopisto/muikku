import * as React from "react";
import { Document, Page, Path, Svg, Text, View } from "@react-pdf/renderer";
import { styles } from "./table-of-content-pdf-styles";
import {
  MaterialContentNodeWithIdAndLogic,
  WorkspaceDataType,
} from "~/reducers/workspaces";
import { StatusType } from "~/reducers/base/status";
import {
  MaterialCompositeReply,
  MaterialContentNode,
  MaterialViewRestriction,
} from "~/generated/client";

/**
 * ContentType
 */
interface ContentType {
  type: "topic" | "element";
  material: MaterialContentNodeWithIdAndLogic;
}

/**
 * NoteBookPDFProps
 */
interface TableOfContentPFDProps {
  status: StatusType;
  workspace?: WorkspaceDataType;
  assignmentTypeFilters: string[];
  workspaceName?: string;
  materials?: MaterialContentNodeWithIdAndLogic[];
  compositeReplies: MaterialCompositeReply[];
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

  /**
   * renderToc
   * @returns JSX.Element
   */
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
    mSubNode: MaterialContentNodeWithIdAndLogic,
    index: number
  ) => {
    const topicMaterial = materials.find((m) => m.id === mSubNode.parentId);

    const isTocTopicViewRestrictedFromUser =
      (topicMaterial &&
        topicMaterial.viewRestrict === MaterialViewRestriction.LoggedIn &&
        !status.loggedIn) ||
      (topicMaterial &&
        topicMaterial.viewRestrict ===
          MaterialViewRestriction.WorkspaceMembers &&
        !workspace.isCourseMember &&
        (status.isStudent || !status.loggedIn));

    // Boolean if there is view Restriction for toc element
    const isTocElementViewRestricted =
      mSubNode.viewRestrict === MaterialViewRestriction.LoggedIn ||
      mSubNode.viewRestrict === MaterialViewRestriction.WorkspaceMembers;

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
    // Or if element is filtered out
    if (isTocTopicViewRestrictedFromUser || filteredOut) {
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
          icon = renderIcon("check", "#009fe3");
          stylesByState = styles.tocElementStateAnswered;

          break;
        case "SUBMITTED":
          icon = renderIcon("check", "#ffffff");
          stylesByState = styles.tocElementStateSubmitted;

          break;
        case "WITHDRAWN":
          icon = renderIcon("check", "#ffffff");
          stylesByState = styles.tocElementStateWithdrawn;

          break;
        case "INCOMPLETE":
          icon = renderIcon("check", "#ffffff");
          stylesByState = styles.tocElementStateIncomplete;

          break;
        case "FAILED":
          icon = renderIcon("thumb-down", "#ffffff");
          stylesByState = styles.tocElementStateFailed;

          break;
        case "PASSED":
          icon = renderIcon("thumb-up", "#ffffff");
          stylesByState = styles.tocElementStatePassed;
          break;
        case "UNANSWERED":
        default:
          break;
      }
    }

    if (isTocElementViewRestricted && !status.isStudent && status.loggedIn) {
      icon = renderIcon("restriction", "#ffffff");
      stylesByState =
        mSubNode.viewRestrict === MaterialViewRestriction.LoggedIn
          ? styles.tocElementIconRestrictedToLoggedUsers
          : mSubNode.viewRestrict === MaterialViewRestriction.WorkspaceMembers
          ? styles.tocElementIconRestrictedToMembers
          : null;
    }

    return (
      <View
        key={mSubNode.workspaceMaterialId}
        wrap={false}
        style={{ ...styles.tocElementContainer, ...assigmentTypeStyles }}
      >
        <Text style={styles.tocElementTitle}>{mSubNode.title}</Text>

        {icon && (
          <View style={{ ...styles.tocIconContainer, ...stylesByState }}>
            {icon}
          </View>
        )}
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
    mNode: MaterialContentNodeWithIdAndLogic,
    index: number
  ) => {
    // Boolean if there is view Restriction for toc topic
    const isTocTopicViewRestricted =
      mNode.viewRestrict === MaterialViewRestriction.LoggedIn ||
      mNode.viewRestrict === MaterialViewRestriction.WorkspaceMembers;

    // section is restricted in following cases:
    // section is restricted for logged in users and users is not logged in...
    // section is restricted for members only and user is not workspace member and isStudent or is not logged in...
    const isTocTopicViewRestrictedFromUser =
      (mNode.viewRestrict === MaterialViewRestriction.LoggedIn &&
        !status.loggedIn) ||
      (mNode.viewRestrict === MaterialViewRestriction.WorkspaceMembers &&
        !workspace.isCourseMember &&
        (status.isStudent || !status.loggedIn));

    if (isTocTopicViewRestrictedFromUser) {
      return null;
    }

    const icon =
      isTocTopicViewRestricted && !status.isStudent && status.loggedIn
        ? renderIcon("restriction", "#ffffff")
        : null;

    const iconStylesByRestriction =
      mNode.viewRestrict === MaterialViewRestriction.LoggedIn
        ? styles.tocTopicIconRestrictedToLoggedUsers
        : mNode.viewRestrict === MaterialViewRestriction.WorkspaceMembers
        ? styles.tocTopicIconRestrictedToMembers
        : null;

    return (
      <View
        key={mNode.workspaceMaterialId}
        wrap={false}
        style={styles.tocTopicContainer}
      >
        <Text style={styles.tocTopicTitle}>{mNode.title}</Text>

        {icon && (
          <View
            style={{ ...styles.tocIconContainer, ...iconStylesByRestriction }}
          >
            {icon}
          </View>
        )}
      </View>
    );
  };

  const pageHeader = (
    <View style={styles.header} fixed>
      <View style={styles.headerInfoContainer}>
        <Text style={styles.headerTitle}>Sisällysluettelo</Text>
        {props.workspaceName && (
          <Text style={styles.headerSubtitle}>{props.workspaceName}</Text>
        )}

        <Text
          style={styles.headerPageNumber}
          render={({ pageNumber, totalPages }) =>
            `${pageNumber} (${totalPages})`
          }
        />
      </View>
    </View>
  );

  return (
    <Document>
      <Page style={styles.body} size="A4" wrap>
        {pageHeader}
        {materials && materials.length > 0 ? (
          renderToc()
        ) : (
          <View style={styles.contentContainer}>
            <Text style={styles.empty}>Ei materialisivuja</Text>
          </View>
        )}
      </Page>
    </Document>
  );
};

type Icon = "check" | "thumb-up" | "thumb-down" | "restriction";

/**
 * renderIcon
 * @param icon icon
 * @param color color
 * @returns JSX.Element
 */
const renderIcon = (icon: Icon, color?: string) => {
  switch (icon) {
    case "check":
      return iconCheck(color);

    case "thumb-up":
      return iconThumbUp(color);

    case "thumb-down":
      return iconThumbDown(color);

    case "restriction":
      return iconRestriction(color);

    default:
      break;
  }
};

/**
 * iconCheck
 * @param color color
 * @returns JSX.Element
 */
const iconCheck = (color?: string) => (
  <Svg style={styles.tocElementIcon} viewBox="0 0 28 28">
    <Path
      fill={color ? color : "#00000"}
      stroke={color ? color : "#00000"}
      d="M11.562 24c-0.621 0-1.21-0.29-1.587-0.79l-5.105-6.745c-0.664-0.876-0.492-2.123 0.386-2.787 0.879-0.667 2.126-0.492 2.79 0.386l3.359 4.435 8.445-13.561c0.581-0.931 1.81-1.217 2.744-0.636 0.933 0.58 1.22 1.809 0.637 2.743l-9.978 16.016c-0.346 0.559-0.944 0.907-1.6 0.937-0.031 0.003-0.060 0.003-0.091 0.003z"
    />
  </Svg>
);

/**
 * iconRestriction
 * @param color color
 * @returns JSX.Element
 */
const iconRestriction = (color: string) => (
  <Svg style={styles.tocElementIcon} viewBox="0 0 28 28">
    <Path
      fill={color ? color : "#00000"}
      stroke={color ? color : "#00000"}
      d="M11.804 23.753v-2.145c-1.174 0-2.145-0.97-2.145-2.145v-1.123l-5.26-5.208c-0.153 0.613-0.204 1.277-0.204 1.94 0 4.443 3.319 8.17 7.609 8.681zM21.557 14h2.196c0.051 0.357 0.051 0.715 0.051 1.072 0 6.026-4.851 10.928-10.877 10.928s-10.928-4.902-10.928-10.928 4.902-10.877 10.928-10.877c1.123 0 2.247 0.204 3.268 0.511v2.757c0 1.174-1.021 2.196-2.196 2.196h-2.196v2.145c0 0.613-0.46 1.123-1.072 1.123h-2.196v2.145h6.536c0.613 0 1.123 0.511 1.123 1.123v3.268h1.072c0.97 0 1.787 0.613 2.094 1.481 1.43-1.532 2.247-3.626 2.247-5.872 0-0.357 0-0.715-0.051-1.072zM24.009 5.268v-0.511c0-1.021-0.817-1.889-1.838-1.889s-1.838 0.868-1.838 1.889v0.511h3.677zM24.877 5.268c0.613 0 1.123 0.511 1.123 1.123v4.34c0 0.613-0.511 1.072-1.123 1.072h-5.413c-0.613 0-1.123-0.46-1.123-1.072v-4.34c0-0.613 0.511-1.123 1.123-1.123v-0.511c0-1.481 1.226-2.757 2.706-2.757s2.706 1.277 2.706 2.757v0.511z"
    />
  </Svg>
);

/**
 * iconThumbUp
 * @param color color
 * @returns JSX.Element
 */
const iconThumbUp = (color: string) => (
  <Svg style={styles.tocElementIcon} viewBox="0 0 28 28">
    <Path
      fill={color ? color : "#00000"}
      stroke={color ? color : "#00000"}
      d="M5.188 21.257q0-0.421-0.308-0.729t-0.729-0.308q-0.437 0-0.737 0.308t-0.3 0.729q0 0.437 0.3 0.737t0.737 0.3q0.421 0 0.729-0.3t0.308-0.737zM7.78 12.963v10.367q0 0.421-0.308 0.729t-0.729 0.308h-4.665q-0.421 0-0.729-0.308t-0.308-0.729v-10.367q0-0.421 0.308-0.729t0.729-0.308h4.665q0.421 0 0.729 0.308t0.308 0.729zM26.958 12.963q0 1.393-0.891 2.413 0.243 0.713 0.243 1.231 0.049 1.231-0.697 2.219 0.275 0.907 0 1.895-0.243 0.923-0.875 1.523 0.146 1.814-0.794 2.932-1.037 1.231-3.191 1.263h-2.090q-1.069 0-2.333-0.251t-1.968-0.47-1.952-0.64q-1.992-0.697-2.559-0.713-0.421-0.016-0.729-0.316t-0.308-0.721v-10.383q0-0.405 0.292-0.705t0.697-0.332q0.389-0.032 1.231-0.956t1.636-1.96q1.101-1.409 1.636-1.944 0.292-0.292 0.502-0.778t0.283-0.786 0.219-0.98q0.113-0.632 0.202-0.988t0.316-0.842 0.551-0.81q0.308-0.308 0.729-0.308 0.745 0 1.336 0.17t0.972 0.421 0.648 0.656 0.389 0.729 0.194 0.81 0.081 0.729 0.008 0.632q0 0.616-0.154 1.231t-0.308 0.972-0.445 0.907q-0.049 0.097-0.162 0.292t-0.178 0.356-0.13 0.389h4.487q1.263 0 2.187 0.923t0.923 2.187z"
    />
  </Svg>
);

/**
 * iconThumbDown
 * @param color color
 * @returns JSX.Element
 */
const iconThumbDown = (color: string) => (
  <Svg style={styles.tocElementIcon} viewBox="0 0 28 28">
    <Path
      fill={color ? color : "#00000"}
      stroke={color ? color : "#00000"}
      d="M5.188 6.743q0 0.421-0.308 0.729t-0.729 0.308q-0.437 0-0.737-0.308t-0.3-0.729q0-0.437 0.3-0.737t0.737-0.3q0.421 0 0.729 0.3t0.308 0.737zM7.78 15.037v-10.367q0-0.421-0.308-0.729t-0.729-0.308h-4.665q-0.421 0-0.729 0.308t-0.308 0.729v10.367q0 0.421 0.308 0.729t0.729 0.308h4.665q0.421 0 0.729-0.308t0.308-0.729zM26.067 12.623q0.891 0.988 0.891 2.413-0.016 1.263-0.931 2.187t-2.179 0.923h-4.487q0.065 0.227 0.13 0.389t0.178 0.356 0.162 0.292q0.292 0.599 0.437 0.923t0.308 0.948 0.162 1.239q0 0.389-0.008 0.632t-0.081 0.729-0.194 0.81-0.389 0.729-0.648 0.656-0.972 0.421-1.336 0.17q-0.421 0-0.729-0.308-0.324-0.324-0.551-0.81t-0.316-0.842-0.202-0.988q-0.146-0.68-0.219-0.98t-0.283-0.786-0.502-0.778q-0.535-0.535-1.636-1.944-0.794-1.037-1.636-1.96t-1.231-0.956q-0.405-0.032-0.697-0.332t-0.292-0.705v-10.383q0-0.421 0.308-0.721t0.729-0.316q0.567-0.016 2.559-0.713 1.247-0.421 1.952-0.64t1.968-0.47 2.333-0.251h2.090q2.154 0.032 3.191 1.263 0.939 1.118 0.794 2.932 0.632 0.599 0.875 1.523 0.275 0.988 0 1.895 0.745 0.988 0.697 2.219 0 0.518-0.243 1.231z"
    />
  </Svg>
);

export default TableOfContentPDF;
