import { Stack } from "@mantine/core";
import { PageLayout } from "src/layouts/PageLayout/PageLayout";
import { CoursepickerSection } from "./components/CoursepickerSection";
import { CoursepickerToolbar } from "./components/CoursepickerToolbar";
import { MOCK_SECTIONS } from "./mockData";

/**
 * Coursepicker - browse and enroll in courses (layout phase: mock data).
 */
export function Coursepicker() {
  // Later: derive from useSearchParams + isAuthenticatedAtom
  const visibleSections = MOCK_SECTIONS;

  return (
    <PageLayout>
      <Stack gap="xl">
        <CoursepickerToolbar />

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
