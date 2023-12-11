import * as React from "react";
import Dropdown from "~/components/general/dropdown";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const ProgressBarCircle = require("react-progress-bar.js").Circle;
import "~/sass/elements/workspace-activity.scss";
import "~/sass/elements/wcag.scss";
import { WorkspaceActivity } from "~/generated/client";
import { withTranslation, WithTranslation } from "react-i18next";

/**
 * ProgressDataProps
 */
interface ProgressDataProps extends WithTranslation {
  activity: WorkspaceActivity;
  title?: string;
  modifier?: string;
}

/**
 * ProgressData
 */
class ProgressData extends React.Component<
  ProgressDataProps,
  Record<string, unknown>
> {
  /**
   * render
   */
  render() {
    const { t } = this.props;

    if (!this.props.activity) {
      return null;
    }

    const evaluablesDone =
      this.props.activity.evaluablesPassed +
      this.props.activity.evaluablesSubmitted +
      this.props.activity.evaluablesFailed +
      this.props.activity.evaluablesIncomplete;

    return (
      <div
        className={`workspace-activity ${
          this.props.modifier
            ? "workspace-activity--" + this.props.modifier
            : ""
        }`}
      >
        {this.props.title ? (
          <div
            className={`workspace-activity__title ${
              this.props.modifier
                ? "workspace-activity__title--" + this.props.modifier
                : ""
            }`}
          >
            {this.props.title}
          </div>
        ) : null}
        <div className="workspace-activity__content">
          {this.props.activity.evaluablesTotal ? (
            <Dropdown
              modifier="workspace-progress"
              content={
                <div>
                  <div className="workspace-activity__menu-title">
                    {t("labels.evaluables", { ns: "materials" })}
                  </div>
                  <div className="workspace-activity__menu-label">
                    {t("labels.assignments", {
                      ns: "materials",
                      context: "returned",
                    })}{" "}
                    <span className="workspace-activity__menu-data">
                      {evaluablesDone}
                    </span>
                  </div>
                  <div className="workspace-activity__menu-label">
                    {t("labels.totalAssignments", { ns: "materials" })}{" "}
                    <span className="workspace-activity__menu-data">
                      {this.props.activity.evaluablesTotal}
                    </span>
                  </div>
                  {this.props.activity.evaluablesTotal ? (
                    <div className="workspace-activity__menu-label">
                      {t("labels.assignments", {
                        ns: "materials",
                        context: "passed",
                      })}{" "}
                      <span className="workspace-activity__menu-data">
                        {this.props.activity.evaluablesPassed}
                      </span>
                    </div>
                  ) : null}
                  {this.props.activity.evaluablesSubmitted ? (
                    <div className="workspace-activity__menu-label">
                      {t("labels.evaluables", {
                        ns: "materials",
                        context: "unevaluated",
                      })}{" "}
                      <span className="workspace-activity__menu-data">
                        {this.props.activity.evaluablesSubmitted}
                      </span>
                    </div>
                  ) : null}
                  {this.props.activity.evaluablesFailed ? (
                    <div className="workspace-activity__menu-label">
                      {t("labels.evaluables", {
                        ns: "materials",
                        context: "failed",
                      })}{" "}
                      <span className="workspace-activity__menu-data">
                        {this.props.activity.evaluablesFailed}
                      </span>
                    </div>
                  ) : null}
                  {this.props.activity.evaluablesIncomplete ? (
                    <div className="workspace-activity__menu-label">
                      {t("labels.assignments", {
                        ns: "materials",
                        context: "incomplete",
                      })}{" "}
                      <span className="workspace-activity__menu-data">
                        {this.props.activity.evaluablesIncomplete}
                      </span>
                    </div>
                  ) : null}
                </div>
              }
            >
              <div tabIndex={0}>
                <ProgressBarCircle
                  containerClassName="workspace-activity__progressbar-circle workspace-activity__progressbar-circle--workspace"
                  options={{
                    strokeWidth: 10,
                    duration: 0,
                    color: "#ce01bd",
                    trailColor: "#ebebeb",
                    easing: "easeInOut",
                    trailWidth: 10,
                    svgStyle: {
                      flexBasis: "25px",
                      flexGrow: "0",
                      flexShrink: "0",
                      height: "25px",
                    },
                    text: {
                      style: null,
                      className:
                        "workspace-activity__progressbar-label workspace-activity__progressbar-label--assignment  workspace-activity__progressbar-label--workspace",
                      value:
                        evaluablesDone +
                        "/" +
                        this.props.activity.evaluablesTotal,
                    },
                  }}
                  progress={
                    evaluablesDone / this.props.activity.evaluablesTotal
                  }
                />
              </div>
            </Dropdown>
          ) : null}
          {this.props.activity.exercisesTotal ? (
            <Dropdown
              modifier="workspace-progress"
              content={
                <div>
                  <div className="workspace-activity__menu-title">
                    {t("labels.exercises", { ns: "materials" })}
                  </div>
                  <div className="workspace-activity__menu-label">
                    {t("labels.assignments", {
                      ns: "materials",
                      context: "done",
                    })}{" "}
                    <span className="workspace-activity__menu-data">
                      {this.props.activity.exercisesAnswered}
                    </span>
                  </div>
                  <div className="workspace-activity__menu-label">
                    {t("labels.totalAssignments", { ns: "materials" })}{" "}
                    <span className="workspace-activity__menu-data">
                      {this.props.activity.exercisesTotal}
                    </span>
                  </div>
                </div>
              }
            >
              <div tabIndex={0}>
                <ProgressBarCircle
                  containerClassName="workspace-activity__progressbar-circle workspace-activity__progressbar-circle--workspace"
                  options={{
                    strokeWidth: 10,
                    duration: 0,
                    color: "#ff9900",
                    trailColor: "#ebebeb",
                    easing: "easeInOut",
                    trailWidth: 10,
                    svgStyle: {
                      flexBasis: "25px",
                      flexGrow: "0",
                      flexShrink: "0",
                      height: "25px",
                    },
                    text: {
                      style: null,
                      className:
                        "workspace-activity__progressbar-label workspace-activity__progressbar-label--exercise workspace-activity__progressbar-label--workspace",
                      value:
                        this.props.activity.exercisesAnswered +
                        "/" +
                        this.props.activity.exercisesTotal,
                    },
                  }}
                  progress={
                    this.props.activity.exercisesAnswered /
                    this.props.activity.exercisesTotal
                  }
                />
              </div>
            </Dropdown>
          ) : null}
        </div>
      </div>
    );
  }
}

export default withTranslation(["common"])(ProgressData);
