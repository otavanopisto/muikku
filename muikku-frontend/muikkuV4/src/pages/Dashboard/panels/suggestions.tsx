import { Stack, Button, Group } from "@mantine/core";
import { Empty } from "src/components/Empty";
import Panel from "~/src/components/Panel/Panel";
import { useTranslation } from "react-i18next";
import { useNextCourseSuggestions } from "~/src/hooks/use-next-course-suggestions";
import PromptDialog from "~/src/components/PromptDialog/PromptDialog";
import { useState } from "react";
/**
 * Suggestions
 *
 * Displays the next course suggestions for the student.
 *
 * If the student has not signed up for the course, a prompt dialog is displayed
 * asking the student to sign up for the course.
 *
 * If the student has signed up for the course, the course is displayed in a button
 * that opens the course in a new tab.
 * @returns Suggestions panel
 */
export function Suggestions() {
  const { t } = useTranslation("workspaces");

  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const { nextCourseSuggestions, signUpForCourse } = useNextCourseSuggestions();
  if (nextCourseSuggestions.length === 0) {
    return <Empty title="No suggestions found" />;
  }

  const handleSignUpForCourse = (courseId: number) => {
    void signUpForCourse(courseId, "");
    setSelectedCourseId(null);
  };

  return (
    <Panel title={t("label")}>
      <Stack>
        {nextCourseSuggestions?.map((suggestion) => (
          <Panel.Item
            title={suggestion.courseName}
            key={suggestion.courseId}
            itemId={suggestion.courseId}
          >
            <Group>
              <Button
                onClick={() => {
                  setSelectedCourseId(suggestion.courseId);
                }}
              >
                {t("actions.signUp")}
              </Button>
              {suggestion?.url && (
                <Button component="a" href={suggestion.url} target="_blank">
                  {t("actions.view")}
                </Button>
              )}
            </Group>
          </Panel.Item>
        ))}
      </Stack>
      <PromptDialog
        opened={selectedCourseId !== null}
        onConfirm={() => handleSignUpForCourse(selectedCourseId ?? 0)}
        title={t("labels.signUpPrompt")}
        description={t("content.signUpPrompt")}
        onCancel={() => setSelectedCourseId(null)}
        onClose={() => setSelectedCourseId(null)}
      />
    </Panel>
  );
}

export default Suggestions;
