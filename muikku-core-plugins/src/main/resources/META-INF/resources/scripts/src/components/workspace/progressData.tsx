import * as React from "react";
import Dropdown from "~/components/general/dropdown";
import { Circle } from "rc-progress";
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
                <Circle
                  className="workspace-activity__progressbar-circle workspace-activity__progressbar-circle--workspace"
                  percent={
                    (evaluablesDone / this.props.activity.evaluablesTotal) * 100
                  }
                  strokeWidth={10}
                  trailColor="#ebebeb"
                  strokeColor="#ce01bd"
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
                <Circle
                  className="workspace-activity__progressbar-circle workspace-activity__progressbar-circle--workspace"
                  percent={
                    (this.props.activity.exercisesAnswered /
                      this.props.activity.exercisesTotal) *
                    100
                  }
                  strokeWidth={10}
                  trailColor="#ebebeb"
                  strokeColor="#ff9900"
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
