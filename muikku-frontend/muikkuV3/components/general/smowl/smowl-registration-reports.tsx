// components/evaluation/body/application/evaluation/evaluation-exam-proctoring-reports.tsx
import * as React from "react";

/**
 * SmowlRegistrationReportsProps
 */
interface SmowlRegistrationReportsProps {
  entityName: string;
  swlAPIKey: string;
  /**
   * JSON string of activity names, must include student id as key and first name and last name as value
   * e.g.: {"0":"John Doe","1":"Jane Doe","2":"Jim Doe"}
   */
  aNamesJson: string;
  /**
   * The language of the user, e.g.: "en", "es", "fr", "pt", "it", "de"...
   */
  lang: string;
  /**
   * The referral, optional, defaults to "Integration"
   */
  referral?: string;
}

/**
 * Creates a form and iframe to display the SMOWL registration reports
 * @param props props
 * @returns JSX.Element
 */
const SmowlRegistrationReports = (props: SmowlRegistrationReportsProps) => {
  const {
    entityName,
    swlAPIKey,
    aNamesJson,
    lang,
    referral = "Integration",
  } = props;

  const formRef = React.useRef<HTMLFormElement | null>(null);
  const hasSubmittedRef = React.useRef(false);

  React.useEffect(() => {
    if (formRef.current && !hasSubmittedRef.current) {
      hasSubmittedRef.current = true;
      formRef.current.submit();
    }
  }, []);

  return (
    <>
      <form
        ref={formRef}
        id="registerForm"
        style={{ display: "none" }}
        target="smowl"
        action="https://front-results.smowltech.net/index.php/ActivityStatus"
        method="POST"
      >
        <input type="hidden" name="entity_Name" value={entityName} />
        <input type="hidden" name="swlAPIKey" value={swlAPIKey} />
        <input type="hidden" name="aNames_json" value={aNamesJson} />
        <input type="hidden" name="lang" value={lang} />
        <input type="hidden" name="referral" value={referral} />
      </form>

      <iframe
        id="smowl"
        name="smowl"
        width="100%"
        height={750}
        frameBorder={0}
        allowFullScreen
      />
    </>
  );
};

export { SmowlRegistrationReports };
