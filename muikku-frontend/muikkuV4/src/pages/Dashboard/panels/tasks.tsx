import { Accordion, Text, Button } from "@mantine/core";

import { useAtomValue, useSetAtom } from "jotai";
import { Empty } from "src/components/Empty";
import Panel, {
  type PanelItemBadge,
  type PanelItemVariant,
} from "~/src/components/Panel/Panel";
import { useTranslation } from "react-i18next";
import type {
  NoteStatusType,
  Note,
  UpdateNoteRequest,
} from "~/generated/client";
import { localize } from "~/src/locales/i18n";
import { Group } from "@mantine/core";
import { IconArrowNarrowRight } from "@tabler/icons-react";
import {} from "~/src/atoms/tasks";
import { userAtom } from "~/src/atoms/auth";
import {
  frontpageTasksRecipientDataAtom,
  updateFrontpageTaskStatusAtom,
  updateFrontpageTaskAtom,
} from "~/src/atoms/tasks";
import { useState } from "react";
import { EditTask } from "../modals/EditTask";
import { htmlToPlainText } from "src/utils/helpers";

/**
 * Workspaces
 * @returns
 */
export default function Tasks() {
  const tasks = useAtomValue(frontpageTasksRecipientDataAtom);
  const user = useAtomValue(userAtom);
  const setUpdateTaskStatus = useSetAtom(updateFrontpageTaskStatusAtom);
  const updateTask = useSetAtom(updateFrontpageTaskAtom);
  const [editingTask, setEditingTask] = useState<Note | null>(null);
  const { t } = useTranslation("tasks");

  if (tasks === undefined || tasks.length === 0) {
    return <Empty title="No Tasks found" />;
  }
  const userId = user?.id;
  const isCreator = (creatorId: number) => creatorId === userId;
  if (!userId) {
    return null;
  }

  const generateTaskDates = (task: Note) => (
    <Group>
      <Text>{localize.date(task.created, "DD.MM.YYYY")}</Text>
      {task.dueDate && (
        <>
          <IconArrowNarrowRight color="gray" />
          <Text>{localize.date(task.dueDate, "DD.MM.YYYY")}</Text>
        </>
      )}
    </Group>
  );

  const getTaskStates = (task: Note): PanelItemBadge | undefined => {
    const currentRecipient = task.recipients.find(
      (recipient) => recipient.recipientId === userId
    );

    const taskState = (status: NoteStatusType) => {
      switch (status) {
        case "ONGOING":
          return "warning";
        case "APPROVED":
          return "success";
        case "APPROVAL_PENDING":
          return "info";
        default:
          return undefined;
      }
    };
    if (currentRecipient) {
      return {
        label: t(`states.${currentRecipient.status}`),
        state: taskState(currentRecipient.status) ?? "warning",
      };
    }
  };
  const getStatusUpdateLocale = (task: Note) =>
    isCreator(task.creator) ? t("actions.approve") : t("actions.send");

  const handleUpdateTaskStatus = (task: Note) => {
    if (isCreator(task.creator)) {
      void setUpdateTaskStatus(userId, task, "APPROVED");
    } else {
      void setUpdateTaskStatus(userId, task, "APPROVAL_PENDING");
    }
  };

  const handleEditTask = (taskId: number, request: UpdateNoteRequest) => {
    void updateTask(taskId, request);
  };

  const getTaskVariant = (task: Note): PanelItemVariant | undefined => {
    switch (task.priority) {
      case "HIGH":
        return "high";
      case "NORMAL":
        return "medium";
      case "LOW":
        return "low";
      default:
        return undefined;
    }
  };

  return (
    <Panel title={t("label")}>
      <Accordion>
        {tasks.map((task, index) => (
          <Panel.AccordionItem
            variant={getTaskVariant(task)}
            title={task.title}
            date={generateTaskDates(task)}
            itemId={task.id ?? index}
            key={task.id ?? index}
            badges={getTaskStates(task)}
          >
            <Text>{htmlToPlainText(task.description ?? "")}</Text>

            <Group>
              <Button onClick={() => handleUpdateTaskStatus(task)}>
                {getStatusUpdateLocale(task)}
              </Button>
              {isCreator(task.creator) && (
                <>
                  <Button onClick={() => setEditingTask(task)}>Edit</Button>

                  <EditTask
                    task={editingTask}
                    opened={editingTask !== null}
                    onClose={() => setEditingTask(null)}
                    onSave={handleEditTask}
                  />
                </>
              )}
            </Group>
          </Panel.AccordionItem>
        ))}
      </Accordion>
    </Panel>
  );
}
