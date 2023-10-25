import * as React from "react";
import { localize } from "~/locales/i18n";
import {
  MaterialContentNodeWithIdAndLogic,
  WorkspaceDataType,
} from "~/reducers/workspaces";
import MaterialLoader from "~/components/base/material-loader";
import { shortenGrade } from "~/util/modifiers";
import { StatusType } from "~/reducers/base/status";
import { MaterialLoaderContent } from "~/components/base/material-loader/content";
import { MaterialLoaderAssesment } from "~/components/base/material-loader/assesment";
import { MaterialLoaderGrade } from "~/components/base/material-loader/grade";
import { MaterialLoaderDate } from "~/components/base/material-loader/date";
import {
  ApplicationListItem,
  ApplicationListItemHeader,
  ApplicationListItemBody,
} from "~/components/general/application-list";
import AnimateHeight from "react-animate-height";
import Dropdown from "~/components/general/dropdown";
import {
  MaterialAssigmentType,
  MaterialCompositeReply,
  MaterialContentNode,
} from "~/generated/client";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * MaterialProps
 */
interface MaterialProps extends WithTranslation {
  material: MaterialContentNodeWithIdAndLogic;
  workspace: WorkspaceDataType;
  status: StatusType;
  compositeReply: MaterialCompositeReply;
  open: boolean;
  onMaterialClick: (
    id: number,
    type: MaterialAssigmentType
  ) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
}

/**
 * MaterialState
 */
interface MaterialState {
  opened: boolean;
}

/**
 * Material
 */
class Material extends React.Component<MaterialProps, MaterialState> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: MaterialProps) {
    super(props);

    this.toggleOpened = this.toggleOpened.bind(this);

    this.state = {
      opened: false,
    };
  }

  /**
   * toggleOpened
   */
  toggleOpened() {
    this.setState({ opened: !this.state.opened });
  }

  /**
   * indicatorClassModifier
   */
  checkIndicatorClassModifier = () => {
    const { compositeReply, material } = this.props;

    if (compositeReply) {
      switch (compositeReply.state) {
        case "PASSED":
          return material.assignment &&
            material.assignment.assignmentType === "EVALUATED"
            ? "state-PASSED"
            : "state-PASSED icon-check";

        case "FAILED":
          return "state-FAILED";

        default:
          return "";
      }
    }

    return "";
  };

  /**
   * renderIndicator
   * @returns JSX.Element
   */
  renderIndicator = () => {
    const { compositeReply } = this.props;

    if (compositeReply && compositeReply.evaluationInfo) {
      switch (compositeReply.state) {
        case "PASSED":
        case "FAILED":
          return (
            <Dropdown
              openByHover
              content={
                <span>{localize.date(compositeReply.evaluationInfo.date)}</span>
              }
            >
              <span
                className={`application-list__indicator-badge application-list__indicator-badge--task ${this.checkIndicatorClassModifier()}`}
              >
                {shortenGrade(compositeReply.evaluationInfo.grade)}
              </span>
            </Dropdown>
          );

        case "INCOMPLETE":
          return (
            <Dropdown
              openByHover
              content={
                <span>{localize.date(compositeReply.evaluationInfo.date)}</span>
              }
            >
              <span
                className={`application-list__indicator-badge application-list__indicator-badge--task state-INCOMPLETE`}
              >
                T
              </span>
            </Dropdown>
          );

        default:
          return (
            <span
              className={`application-list__indicator-badge application-list__indicator-badge--task state-NO-ASSESSMENT`}
            >
              N
            </span>
          );
      }
    }

    return (
      <span
        className={`application-list__indicator-badge application-list__indicator-badge--task state-NO-ASSESSMENT`}
      >
        N
      </span>
    );
  };

  /**
   * render
   */
  render() {
    return (
      <ApplicationListItem
        key={this.props.material.id}
        className={`application-list__item assignment ${
          this.props.compositeReply &&
          this.props.compositeReply.state !== "UNANSWERED"
            ? ""
            : "state-NO-ASSESSMENT"
        }`}
      >
        <ApplicationListItemHeader
          modifiers="studies-assignment"
          onClick={this.props.onMaterialClick(
            this.props.material.id,
            this.props.material.assignment.assignmentType
          )}
        >
          {this.renderIndicator()}
          <span className="application-list__header-primary">
            {this.props.material.assignment.title}
          </span>
        </ApplicationListItemHeader>

        <ApplicationListItemBody>
          <AnimateHeight height={this.props.open ? "auto" : 0}>
            <MaterialLoader
              material={this.props.material}
              workspace={this.props.workspace}
              readOnly
              compositeReplies={this.props.compositeReply}
              modifiers="studies-material-page"
            >
              {(props, state, stateConfiguration) => {
                let evalStateClassName = "";
                let evalStateIcon = "";
                const hasEvaluation =
                  props.compositeReplies &&
                  (props.compositeReplies.state === "PASSED" ||
                    props.compositeReplies.state === "FAILED" ||
                    props.compositeReplies.state === "INCOMPLETE");
                if (props.compositeReplies) {
                  switch (props.compositeReplies.state) {
                    case "INCOMPLETE":
                      evalStateClassName =
                        "material-page__assignment-assessment--incomplete";
                      break;
                    case "FAILED":
                      evalStateClassName =
                        "material-page__assignment-assessment--failed";
                      evalStateIcon = "icon-thumb-down";
                      break;
                    case "PASSED":
                      evalStateClassName =
                        "material-page__assignment-assessment--passed";
                      evalStateIcon = "icon-thumb-up";
                      break;
                    case "WITHDRAWN":
                      evalStateClassName =
                        "material-page__assignment-assessment--withdrawn";
                      break;
                  }
                }
                return (
                  <div>
                    <MaterialLoaderContent
                      {...props}
                      {...state}
                      stateConfiguration={stateConfiguration}
                    />
                    {hasEvaluation && (
                      <div
                        className={`material-page__assignment-assessment ${evalStateClassName}`}
                      >
                        <div
                          className={`material-page__assignment-assessment-icon ${evalStateIcon}`}
                        ></div>
                        <MaterialLoaderDate {...props} {...state} />
                        <MaterialLoaderGrade {...props} {...state} />
                        <MaterialLoaderAssesment {...props} {...state} />
                      </div>
                    )}
                  </div>
                );
              }}
            </MaterialLoader>
          </AnimateHeight>
        </ApplicationListItemBody>
      </ApplicationListItem>
    );
  }
}

export default withTranslation(["common"])(Material);
