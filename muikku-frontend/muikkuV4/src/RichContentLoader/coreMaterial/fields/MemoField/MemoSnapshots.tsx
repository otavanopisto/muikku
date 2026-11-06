import { Accordion, Button } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import dayjs from "dayjs";
import { useFieldSnapshots } from "../../hooks/useFieldSnapshot";
import { countMemoText } from "../../utils/memoField";
import { MemoCounters } from "./MemoCounters";
import { MemoReadonly } from "./MemoReadonly";
import classes from "./MemoField.module.css";

/**
 * Snapshot take / list / delete when the loader exposed the capability.
 */
export function MemoSnapshots(props: {
  fieldName: string;
  value: string;
  maxWords?: string;
  maxChars?: string;
}) {
  const snapshots = useFieldSnapshots(props.fieldName);
  if (!snapshots) {
    return null;
  }

  return (
    <div className={classes.snapshots}>
      {snapshots.canTake && snapshots.onTake ? (
        <div className={classes.snapshotBar}>
          <Button
            size="xs"
            variant="light"
            leftSection={<IconPlus size={14} />}
            disabled={!props.value}
            onClick={() => snapshots.onTake?.(props.fieldName)}
          >
            Tallenna versio
          </Button>
        </div>
      ) : null}
      {snapshots.canView && snapshots.items.length > 0 ? (
        <Accordion multiple>
          {snapshots.items.map((item) => {
            const counts = countMemoText(item.value);
            return (
              <Accordion.Item key={item.id} value={String(item.id)}>
                <Accordion.Control>
                  {dayjs(item.date).format("D.M.YYYY HH:mm")}
                </Accordion.Control>
                <Accordion.Panel>
                  <MemoReadonly value={item.value} />
                  <MemoCounters
                    words={counts.words}
                    characters={counts.characters}
                    maxWords={props.maxWords}
                    maxChars={props.maxChars}
                  />
                  {snapshots.canDelete && snapshots.onDelete ? (
                    <Button
                      size="xs"
                      color="red"
                      variant="subtle"
                      mt="xs"
                      onClick={() =>
                        snapshots.onDelete?.(props.fieldName, item.id)
                      }
                    >
                      Poista
                    </Button>
                  ) : null}
                </Accordion.Panel>
              </Accordion.Item>
            );
          })}
        </Accordion>
      ) : null}
    </div>
  );
}
