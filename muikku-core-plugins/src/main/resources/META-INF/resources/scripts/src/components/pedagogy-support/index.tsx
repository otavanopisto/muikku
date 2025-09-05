import * as React from "react";
import { SimpleTabs, Tab } from "~/components/general/tabs";
import { UserRole } from "~/@types/pedagogy-form";
import PedagogicalSupportForm from "./pedagogical-support-form";
import { PedagogyProvider } from "~/components/pedagogy-support/context/pedagogy-context";
//import { usePedagogy } from "~/components/pedagogy-support/hooks/usePedagogy";
import {
  UPPERSECONDARY_PEDAGOGYFORM,
  COMPULSORY_PEDAGOGYFORM,
} from "~/components/pedagogy-support/helpers";
import PedagogyToolbar from "./components/pedagogy-toolbar";
import PedagogyPDFUpperSecondary from "./pedagogy-PDF-uppersecondary";
import PedagogyPDFCompulsory from "./pedagogy-PDF-compulsory";
import ImplementedSupportActions from "./implemented-support-form";
import { usePedagogyRedux } from "./hooks/usePedagogyRedux";
import { PedagogyFormAccess } from "~/generated/client";
import { useTranslation } from "react-i18next";

/**
 * LearningSupportProps
 */
interface PedagogySupportProps {
  userRole: UserRole;
  studentIdentifier: string;
  studyProgrammeName: string;
  /**
   * Optional access information that affects the visibility of the pedagogy form tab
   * for specific user roles (e.g. COURSE_TEACHER, GUIDANCE_COUNSELOR).
   */
  pedagogyFormAccess: Partial<PedagogyFormAccess>;
}

/**
 * PedagogySupport
 *
 * Component that provides tabs for navigation between Pedagogy Support Form and Implemented Actions
 *
 * @param props props
 * @returns JSX.Element
 */
const PedagogySupport = (props: PedagogySupportProps) => {
  const { pedagogyFormAccess, studentIdentifier, studyProgrammeName } = props;

  const { t } = useTranslation(["pedagogySupportPlan", "common"]);

  // Check if user's study programme is eligible for pedagogy form
  const isEligibleForUpperSecondary = UPPERSECONDARY_PEDAGOGYFORM.includes(
    props.studyProgrammeName
  );
  const isEligibleForCompulsory =
    COMPULSORY_PEDAGOGYFORM.includes(studyProgrammeName);

  // Merged condition for pedagogy form eligibility
  const isEligibleForPedagogyForm =
    isEligibleForUpperSecondary || isEligibleForCompulsory;

  // Determine if user is upper secondary student based on eligibility
  const isUppersecondary = isEligibleForUpperSecondary;

  const [activeTab, setActiveTab] = React.useState<string>(
    "IMPLEMENTED_ACTIONS"
  );
  const [showPDF, setShowPDF] = React.useState(false);
  const usePedagogyValues = usePedagogyRedux(
    studentIdentifier,
    studyProgrammeName,
    isUppersecondary,
    pedagogyFormAccess
  );

  /**
   * Returns whether the pedagogy form tab should be shown based on the user role and the access to the form.
   *
   * @returns boolean
   */
  const shouldShowPedagogyFormTab = () => {
    // Base conditions
    if (
      !isEligibleForPedagogyForm ||
      !usePedagogyValues?.pedagogyForm?.created
    ) {
      return false;
    }

    const { userRole } = props;
    const { pedagogyForm } = usePedagogyValues;
    const isPublished = pedagogyForm?.published;

    // Role-based visibility rules
    switch (userRole) {
      case "SPECIAL_ED_TEACHER":
        // Special ed teachers can always see the form tab
        return true;

      case "COURSE_TEACHER":
      case "GUIDANCE_COUNSELOR":
        // Teachers and counselors can see the form tab only when published
        // and accessible
        return isPublished && (pedagogyFormAccess?.accessible ?? false);

      case "STUDENT":
        // Students can see the form tab only when published
        return isPublished;

      case "STUDENT_PARENT":
        // Parents can see the form tab only when published
        return isPublished;

      default:
        return false;
    }
  };

  /**
   * Handles tab change
   * @param id tab id
   */
  const handleTabChange = (id: string) => {
    setActiveTab(id);
  };

  const pedagogySupportTabs: Tab[] = [
    {
      id: "IMPLEMENTED_ACTIONS",
      name: t("labels.implementedActions", { ns: "pedagogySupportPlan" }),
      type: "pedagogy-support",
      component: <ImplementedSupportActions />,
    },
  ];

  // Only add pedagogy form tab if:
  // 1. Study programme is eligible for pedagogy form
  // 2. Pedagogy form is created
  if (shouldShowPedagogyFormTab()) {
    pedagogySupportTabs.push({
      id: "PEDAGOGY_FORM",
      name: t("labels.pedagogySupportPlan", { ns: "pedagogySupportPlan" }),
      type: "pedagogy-support",
      component: <PedagogicalSupportForm isUppersecondary={isUppersecondary} />,
    });
  }

  // Show PDF if:
  // 1. Study programme is eligible for pedagogy form
  // 2. Pedagogy form is created
  // 3. Show PDF is toggled on
  const showPdf =
    isEligibleForPedagogyForm &&
    usePedagogyValues?.pedagogyForm?.created &&
    showPDF;

  /**
   * Content
   * @returns JSX.Element
   */
  const pedagogySupportContent = () => {
    // Check if pedagogy form is included in tabs
    const pedagogyFormExists =
      pedagogySupportTabs.find((tab) => tab.id === "PEDAGOGY_FORM") !==
      undefined;

    // If pedagogy form exists, show PDF or tabs
    if (pedagogyFormExists) {
      if (showPdf) {
        if (isUppersecondary) {
          return <PedagogyPDFUpperSecondary />;
        }

        return <PedagogyPDFCompulsory />;
      }

      return (
        <SimpleTabs
          modifier="pedagogy-support"
          tabs={pedagogySupportTabs}
          onTabChange={handleTabChange}
          activeTab={activeTab}
        />
      );
    }

    // If pedagogy form does not exist, show implemented support actions
    return <ImplementedSupportActions />;
  };

  return (
    <PedagogyProvider
      value={{
        userRole: props.userRole,
        contextType: isUppersecondary ? "upperSecondary" : "compulsory",
        ...usePedagogyValues,
      }}
    >
      <PedagogyToolbar showPDF={showPDF} setShowPDF={setShowPDF} />

      {pedagogySupportContent()}
    </PedagogyProvider>
  );
};

export default PedagogySupport;
