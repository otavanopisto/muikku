import { Stack } from "@mantine/core";
import { useAtomValue } from "jotai";
import {
  wokspaceSuggestionsDataAtom,
  studentCourseMatrixDataAtom,
} from "~/src/atoms/hops";
import { Empty } from "src/components/Empty";
import Panel from "~/src/components/Panel/Panel";
import { useTranslation } from "react-i18next";
/**
 * Workspaces
 * @returns
 */
export function Suggestions() {
  const suggestions = useAtomValue(wokspaceSuggestionsDataAtom);
  const matrix = useAtomValue(studentCourseMatrixDataAtom);
  const { t } = useTranslation("workspaces");
  if (suggestions === undefined && matrix === undefined) {
    return <Empty title="No absences found" />;
  }
  /*   const generateAbsenceDates = (absence: MuikkuEvent) => (
    <Group>
      <Text>{localize.date(absence.start, "DD.MM.YYYY")}</Text>
      <IconArrowNarrowRight color="gray" />
      <Text>{localize.date(absence.end, "DD.MM.YYYY")}</Text>
    </Group>
  );
 */
  /*   const getAbsenceState = (absence: MuikkuEvent): PanelItemBadge => {
    const reason =
      absence.properties?.find((property) => property.name === "ABSENCE_REASON")
        ?.value ?? "NO_REASON";

    return {
      label: t(`reasons.${reason}`, { ns: "events" }),
      state: reason === "NO_REASON" ? "warning" : "success",
    };
  }; */
  return (
    <Panel title={t("label")}>
      <Stack>
        {suggestions?.map((suggestion) => (
          <Panel.Item
            title={suggestion.name}
            key={suggestion.id}
            itemId={suggestion.id}
          />
        ))}
      </Stack>
    </Panel>
  );
}

export default Suggestions;
