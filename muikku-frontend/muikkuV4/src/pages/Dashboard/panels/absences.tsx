import { Text, Stack } from "@mantine/core";
import { useAtomValue } from "jotai";
import { absencesDataAtom } from "~/src/atoms/events";
import { Empty } from "src/components/Empty";
import Panel, { type PanelItemBadge } from "~/src/components/Panel/Panel";
import { useTranslation } from "react-i18next";
import type { MuikkuEvent } from "~/generated/client";
import { localize } from "~/src/locales/i18n";
import { Group } from "@mantine/core";
import { IconArrowNarrowRight } from "@tabler/icons-react";
/**
 * Workspaces
 * @returns
 */
export function Absences() {
  const absences = useAtomValue(absencesDataAtom);
  const { t } = useTranslation("events");
  if (absences === undefined) {
    return <Empty title="No absences found" />;
  }
  const generateAbsenceDates = (absence: MuikkuEvent) => (
    <Group>
      <Text>{localize.date(absence.start, "DD.MM.YYYY")}</Text>
      <IconArrowNarrowRight color="gray" />
      <Text>{localize.date(absence.end, "DD.MM.YYYY")}</Text>
    </Group>
  );

  const getAbsenceState = (absence: MuikkuEvent): PanelItemBadge => {
    const reason =
      absence.properties?.find((property) => property.name === "ABSENCE_REASON")
        ?.value ?? "NO_REASON";

    return {
      label: t(`reasons.${reason}`, { ns: "events" }),
      state: reason === "NO_REASON" ? "warning" : "success",
    };
  };
  return (
    <Panel title="TODO: Localize Absences">
      <Stack>
        {absences.map((absence) => (
          <Panel.Item
            title={
              t(`types.${absence.title}`, { ns: "events" }) +
              "-" +
              absence.containerName
            }
            date={generateAbsenceDates(absence)}
            itemId={absence.id ?? 0}
            key={absence.id}
            badges={getAbsenceState(absence)}
          />
        ))}
      </Stack>
    </Panel>
  );
}
