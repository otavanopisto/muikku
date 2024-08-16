import * as React from "react";
import { MatriculationSubjectWithEligibilityStatus } from "~/reducers/main-function/records/yo";
import "~/sass/elements/application-sub-panel.scss";
import { withTranslation, WithTranslation } from "react-i18next";
import { MatriculationSubjectCode } from "./matriculation-subject-type";

/**
 * MatriculationEligibilityRowProps
 */
interface MatriculationEligibilityRowProps extends WithTranslation {
  subject: MatriculationSubjectWithEligibilityStatus;
}

/**
 * MatriculationEligibilityRowState
 */
interface MatriculationEligibilityRowState {
  loading: boolean;
}

/**
 * MatriculationEligibilityRow
 */
class MatriculationEligibilityRow extends React.Component<
  MatriculationEligibilityRowProps,
  MatriculationEligibilityRowState
> {
  /**
   * constructor
   * @param props props
   */
  constructor(props: MatriculationEligibilityRowProps) {
    super(props);
  }

  /**
   * getMatriculationSubjectNameByCode
   * @param code code
   */
  getMatriculationSubjectNameByCode = (code: MatriculationSubjectCode) =>
    this.props.t(`matriculationSubjects.${code}`, { ns: "hops" });

  /**
   * render
   */
  render() {
    const { t } = this.props;

    return (
      <div className="application-sub-panel__summary-item application-sub-panel__summary-item--subject-eligibility">
        <div
          className={`application-sub-panel__summary-item-state application-sub-panel__summary-item-state--${
            this.props.subject.eligibility == "ELIGIBLE"
              ? "eligible"
              : "not-eligible"
          }`}
        >
          {this.props.subject.eligibility === "ELIGIBLE"
            ? t("labels.yes")
            : t("labels.no")}
        </div>
        <div className="application-sub-panel__summary-item-label">
          {this.getMatriculationSubjectNameByCode(
            this.props.subject.code as MatriculationSubjectCode
          )}
        </div>
        <div
          className="application-sub-panel__summary-item-description"
          dangerouslySetInnerHTML={{
            __html: t("content.matriculationEligibility", {
              ns: "hops",
              acceptedCount: this.props.subject.acceptedCount,
              requiredCount: this.props.subject.requiredCount,
            }),
          }}
        />
      </div>
    );
  }
}

export default withTranslation(["studies", "hops", "common"])(
  MatriculationEligibilityRow
);
