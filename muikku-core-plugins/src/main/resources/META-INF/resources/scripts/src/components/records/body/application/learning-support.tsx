import * as React from "react";
import Tabs, { Tab } from "~/components/general/tabs";
import { UserRole } from "~/@types/pedagogy-form";
import { StatusType } from "~/reducers/base/status";
import PedagogicalSupportForm from "~/components/general/pedagogical-support-form copy";

/**
 * LearningSupportProps
 */
interface LearningSupportProps {
  userRole: UserRole;
  studentUserEntityId: number;
  status: StatusType;
}

/**
 * LearningSupport
 *
 * Component that provides tabs for navigation between Pedagogy Support Form and Implemented Actions
 *
 * @param props props
 * @returns JSX.Element
 */
const LearningSupport = (props: LearningSupportProps) => {
  const [activeTab, setActiveTab] = React.useState<string>("PEDAGOGY_FORM");

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
          studentUserEntityId={props.studentUserEntityId}
          isSecondary={true}
        />
      ),
    },
  ];

  return (
    <div className="learning-support">
      <Tabs
        modifier="learning-support"
        tabs={learningSupportTabs}
        onTabChange={handleTabChange}
        activeTab={activeTab}
      />
    </div>
  );
};

export default LearningSupport;
