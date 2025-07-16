import * as React from "react";
import Tabs, { Tab } from "~/components/general/tabs";
import { UserRole } from "~/@types/pedagogy-form";
import PedagogicalSupportForm from "./pedagogical-support-form";
import { PedagogyProvider } from "~/components/pedagogy-support/context/pedagogy-context";
import { usePedagogy } from "~/components/pedagogy-support/hooks/usePedagogy";
import { StateType } from "~/reducers";
import { useSelector } from "react-redux";
import { UPPERSECONDARY_PEDAGOGYFORM } from "~/components/pedagogy-support/helpers";

/**
 * LearningSupportProps
 */
interface LearningSupportProps {
  userRole: UserRole;
}

/**
 * PedagogySupport
 *
 * Component that provides tabs for navigation between Pedagogy Support Form and Implemented Actions
 *
 * @param props props
 * @returns JSX.Element
 */
const PedagogySupport = (props: LearningSupportProps) => {
  const status = useSelector((state: StateType) => state.status);

  // Check if user is uppersecondary student
  const isUppersecondary = UPPERSECONDARY_PEDAGOGYFORM.includes(
    status.profile.studyProgrammeName
  );

  const [activeTab, setActiveTab] = React.useState<string>("PEDAGOGY_FORM");
  const usePedagogyValues = usePedagogy(status.userId, isUppersecondary);

  /**
   * Handles tab change
   * @param id tab id
   */
  const handleTabChange = (id: string) => {
    setActiveTab(id);
  };

  const learningSupportTabs: Tab[] = [
    {
      id: "IMPLEMENTED_ACTIONS",
      name: "Toteutetut tukitoimet",
      type: "learning-support",
      component: (
        <>
          <h1>Toteutetut tukitoimet</h1>
        </>
      ),
    },
    {
      id: "PEDAGOGY_FORM",
      name: "Pedagogisen tuen lomake",
      type: "learning-support",
      component: (
        <PedagogicalSupportForm
          userRole={props.userRole}
          studentUserEntityId={status.userId}
          isUppersecondary={isUppersecondary}
        />
      ),
    },
  ];

  return (
    <PedagogyProvider
      value={{
        userRole: props.userRole,
        contextType: isUppersecondary ? "upperSecondary" : "compulsory",
        ...usePedagogyValues,
      }}
    >
      <Tabs
        modifier="pedagogy-support"
        tabs={learningSupportTabs}
        onTabChange={handleTabChange}
        activeTab={activeTab}
      />
    </PedagogyProvider>
  );
};

export default PedagogySupport;
