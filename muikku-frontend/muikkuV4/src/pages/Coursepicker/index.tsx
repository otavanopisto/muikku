import { Skeleton, Stack } from "@mantine/core";
import { useAtomValue, useSetAtom } from "jotai";
import {
  coursepickerCurriculumsDataAtom,
  coursepickerEducationTypesDataAtom,
  coursepickerFilterCatalogsLoadingAtom,
  coursepickerOrganizationsDataAtom,
  coursepickerWorkspaceFiltersAtom,
} from "src/atoms/coursepicker";
import { isAuthenticatedAtom } from "src/atoms/auth";
import { PageLayout } from "src/layouts/PageLayout/PageLayout";
import { CoursepickerSection } from "./components/CoursepickerSection";
import { CoursepickerToolbar } from "./components/CoursepickerToolbar";
import { useCoursepickerFilters } from "./hooks/useCoursepickerFilters";
import { MOCK_SECTIONS } from "./mockData";
import { getVisibleSections } from "./utils/visibleSections";
import { useEffect } from "react";
import { CourseListAccordion } from "./components/CourseListAccordion";
import { CoursepickerWorkspaceList } from "./components/CoursepickerWorkspaceList";

/**
 * Coursepicker - browse and enroll in courses (URL shell + mock data).
 */
export function Coursepicker() {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const {
    view,
    q,
    educationTypes,
    curriculums,
    organizations,
    mandatority,
    setQ,
    removeEducationType,
    toggleEducationType,
    removeCurriculum,
    toggleCurriculum,
    removeOrganization,
    toggleOrganization,
    removeMandatority,
    toggleMandatority,
  } = useCoursepickerFilters();

  const educationTypeOptions = useAtomValue(coursepickerEducationTypesDataAtom);
  const curriculumOptions = useAtomValue(coursepickerCurriculumsDataAtom);
  const organizationOptions = useAtomValue(coursepickerOrganizationsDataAtom);
  const catalogsLoading = useAtomValue(coursepickerFilterCatalogsLoadingAtom);
  // const catalogsReady = useAtomValue(coursepickerFilterCatalogsReadyAtom);
  // const catalogsError = useAtomValue(coursepickerFilterCatalogsErrorAtom);

  // Workspace filters
  const setWorkspaceFilters = useSetAtom(coursepickerWorkspaceFiltersAtom);

  useEffect(() => {
    setWorkspaceFilters({
      view,
      q,
      educationTypes,
      curriculums,
      organizations,
      mandatority,
    });
  }, [
    view,
    q,
    educationTypes,
    curriculums,
    organizations,
    mandatority,
    setWorkspaceFilters,
  ]);

  const visibleSections = getVisibleSections({
    sections: MOCK_SECTIONS,
    view,
    isAuthenticated,
  }).map((section) => {
    const needle = q.trim().toLowerCase();
    if (!needle) return section;
    return {
      ...section,
      items: section.items.filter(
        (item) =>
          item.title.toLowerCase().includes(needle) ||
          item.code.toLowerCase().includes(needle)
      ),
    };
  });

  if (catalogsLoading) {
    return (
      <PageLayout>
        <Stack gap="xl">
          <Skeleton height={"100vh"} />
        </Stack>
      </PageLayout>
    );
  }

  const showApiList = view === "MyCourses" || view === "Unpublished";

  const listTitle =
    view === "MyCourses"
      ? "Omat kurssit"
      : view === "Unpublished"
      ? "Julkaisematon"
      : "";

  return (
    <PageLayout>
      <CoursepickerToolbar
        q={q}
        educationTypeOptions={educationTypeOptions}
        curriculumOptions={curriculumOptions}
        organizationOptions={organizationOptions}
        educationTypes={educationTypes}
        curriculums={curriculums}
        organizations={organizations}
        mandatority={mandatority}
        onQChange={setQ}
        onToggleEducationType={toggleEducationType}
        onRemoveEducationType={removeEducationType}
        onToggleCurriculum={toggleCurriculum}
        onRemoveCurriculum={removeCurriculum}
        onToggleOrganization={toggleOrganization}
        onRemoveOrganization={removeOrganization}
        onToggleMandatority={toggleMandatority}
        onRemoveMandatority={removeMandatority}
      />

      {showApiList ? (
        <CoursepickerWorkspaceList view={view} title={listTitle} />
      ) : (
        // All / Suggested: keep mock (or a short “ei vielä API”) until later
        visibleSections.map((section) => (
          <CoursepickerSection
            key={section.id}
            title={section.title}
            info={section.info}
          >
            <CourseListAccordion items={section.items} />
          </CoursepickerSection>
        ))
      )}
    </PageLayout>
  );
}
