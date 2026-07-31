import { Stack } from "@mantine/core";
import { useAtomValue } from "jotai";
import { isAuthenticatedAtom } from "src/atoms/auth";
import { PageLayout } from "src/layouts/PageLayout/PageLayout";
import { CoursepickerSection } from "./components/CoursepickerSection";
import { CoursepickerToolbar } from "./components/CoursepickerToolbar";
import { useCoursepickerFilters } from "./hooks/useCoursepickerFilters";
import { MOCK_EDUCATION_TYPES, MOCK_SECTIONS } from "./mockData";
import { getVisibleSections } from "./utils/visibleSections";

/**
 * Coursepicker - browse and enroll in courses (URL shell + mock data).
 */
export function Coursepicker() {
  const isAuthenticated = useAtomValue(isAuthenticatedAtom);
  const {
    view,
    q,
    educationTypes,
    mandatority,
    setQ,
    removeEducationType,
    toggleEducationType,
    removeMandatority,
    toggleMandatority,
  } = useCoursepickerFilters();

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

  return (
    <PageLayout>
      <Stack gap="xl">
        <CoursepickerToolbar
          q={q}
          educationTypeOptions={MOCK_EDUCATION_TYPES}
          educationTypes={educationTypes}
          mandatority={mandatority}
          onQChange={setQ}
          onToggleEducationType={toggleEducationType}
          onRemoveEducationType={removeEducationType}
          onToggleMandatority={toggleMandatority}
          onRemoveMandatority={removeMandatority}
        />

        {visibleSections.map((section) => (
          <CoursepickerSection
            key={section.id}
            section={section}
            defaultExpandedCourseId={
              section.id === "suggested"
                ? "1"
                : section.id === "myCourses"
                ? "101"
                : undefined
            }
          />
        ))}
      </Stack>
    </PageLayout>
  );
}
