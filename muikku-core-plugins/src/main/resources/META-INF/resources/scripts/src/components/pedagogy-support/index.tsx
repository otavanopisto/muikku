import * as React from "react";
import Tabs, { Tab } from "~/components/general/tabs";
import { UserRole } from "~/@types/pedagogy-form";
import PedagogicalSupportForm from "./pedagogical-support-form";
import { PedagogyProvider } from "~/components/pedagogy-support/context/pedagogy-context";
import { usePedagogy } from "~/components/pedagogy-support/hooks/usePedagogy";
import {
  UPPERSECONDARY_PEDAGOGYFORM,
  COMPULSORY_PEDAGOGYFORM,
} from "~/components/pedagogy-support/helpers";
import PedagogyToolbar from "./components/pedagogy-toolbar";
import PedagogyPDFUpperSecondary from "./pedagogy-PDF-uppersecondary";
import PedagogyPDFCompulsory from "./pedagogy-PDF-compulsory";
import ImplementedSupportActions from "./implemented-support-form";

/**
 * LearningSupportProps
 */
interface PedagogySupportProps {
  userRole: UserRole;
  studentUserEntityId: number;
  studyProgrammeName: string;
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
  // Check if user's study programme is eligible for pedagogy form
  const isEligibleForUpperSecondary = UPPERSECONDARY_PEDAGOGYFORM.includes(
    props.studyProgrammeName
  );
  const isEligibleForCompulsory = COMPULSORY_PEDAGOGYFORM.includes(
    props.studyProgrammeName
  );

  // Merged condition for pedagogy form eligibility
  const isEligibleForPedagogyForm =
    isEligibleForUpperSecondary || isEligibleForCompulsory;

  // Determine if user is upper secondary student based on eligibility
  const isUppersecondary = isEligibleForUpperSecondary;

  const [activeTab, setActiveTab] = React.useState<string>(
    "IMPLEMENTED_ACTIONS"
  );
  const [showPDF, setShowPDF] = React.useState(false);
  const usePedagogyValues = usePedagogy(
    props.studentUserEntityId,
    isUppersecondary
  );

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
      name: "Toteutetut tukitoimet",
      type: "pedagogy-support",
      component: <ImplementedSupportActions />,
    },
  ];

  // Only add pedagogy form tab if:
  // 1. Study programme is eligible for pedagogy form
  // 2. Pedagogy form is created
  if (isEligibleForPedagogyForm && usePedagogyValues?.pedagogyForm?.created) {
    pedagogySupportTabs.push({
      id: "PEDAGOGY_FORM",
      name: "Pedagogisen tuen lomake",
      type: "pedagogy-support",
      component: (
        <PedagogicalSupportForm
          userRole={props.userRole}
          studentUserEntityId={props.studentUserEntityId}
          isUppersecondary={isUppersecondary}
        />
      ),
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
        <Tabs
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
