import {
  Modal,
  TextInput,
  Textarea,
  Select,
  Button,
  Alert,
} from "@mantine/core";
import { DateInput, DatesProvider } from "@mantine/dates";
import { useReducer } from "react";
import type {
  Note,
  NoteCreationType,
  NotePriorityType,
  UpdateNoteRequest,
} from "~/generated/client";
import { htmlToPlainText } from "src/utils/helpers";
import { localize } from "src/locales/i18n";

const PRIORITIES = [
  "LOW",
  "NORMAL",
  "HIGH",
] as const satisfies readonly NotePriorityType[];

export type EditTaskForm = {
  title: string;
  description: string;
  priority: NotePriorityType;
  startDate: string | null;
  dueDate: string | null;
  type: NoteCreationType;
};

type EditTaskAction =
  | { type: "setTitle"; title: string }
  | { type: "setDescription"; description: string }
  | { type: "setPriority"; priority: NotePriorityType }
  | { type: "setStartDate"; startDate: string | null }
  | { type: "setDueDate"; dueDate: string | null };

const formFromTask = (task: Note): EditTaskForm => ({
  title: task.title,
  description: htmlToPlainText(task.description ?? ""),
  priority: task.priority,
  startDate: task.startDate,
  dueDate: task.dueDate,
  type: task.type,
});

const editTaskReducer = (
  state: EditTaskForm,
  action: EditTaskAction
): EditTaskForm => {
  switch (action.type) {
    case "setTitle":
      return { ...state, title: action.title };
    case "setDescription":
      return { ...state, description: action.description };
    case "setPriority":
      return { ...state, priority: action.priority };
    case "setStartDate":
      return { ...state, startDate: action.startDate };
    case "setDueDate":
      return { ...state, dueDate: action.dueDate };
  }
};

const isPriority = (value: string | null): value is NotePriorityType =>
  value === "LOW" || value === "NORMAL" || value === "HIGH" || value === "OWN";

type EditTaskProps = {
  task: Note | null;
  opened: boolean;
  onSave: (taskId: number, request: UpdateNoteRequest) => void;
  onClose: () => void;
};

/**
 * Edit task modal
 * @param props - Task being edited and modal controls
 * @returns Edit task form
 */
export function EditTask({ task, opened, onClose, onSave }: EditTaskProps) {
  return (
    <Modal opened={opened} centered onClose={onClose} title="Edit Task">
      {task ? (
        <EditTaskForm
          onSave={onSave}
          key={task.id}
          task={task}
          onClose={onClose}
        />
      ) : null}
    </Modal>
  );
}

/**
 * Controlled fields for one task
 * @param props - Task used as the initial form values
 * @returns Form fields
 */
function EditTaskForm({
  task,
  onClose,
  onSave,
}: {
  task: Note;
  onClose: () => void;
  onSave: (taskId: number, request: UpdateNoteRequest) => void;
}) {
  const [form, dispatch] = useReducer(editTaskReducer, task, formFromTask);
  const taskId = task.id;
  if (!taskId) {
    return null;
  }

  const startDate = form.startDate ? new Date(form.startDate) : null;
  const dueDate = form.dueDate ? new Date(form.dueDate) : null;

  if (!startDate) {
    return <Alert color="red">Start date must be before end date</Alert>;
  }

  return (
    <>
      <TextInput
        label="Title"
        value={form.title}
        onChange={(event) =>
          dispatch({ type: "setTitle", title: event.currentTarget.value })
        }
      />
      <Textarea
        label="Description"
        value={form.description}
        onChange={(event) =>
          dispatch({
            type: "setDescription",
            description: event.currentTarget.value,
          })
        }
      />
      <Select
        label="Priority"
        value={form.priority}
        data={[...PRIORITIES]}
        onChange={(value) => {
          if (isPriority(value)) {
            dispatch({ type: "setPriority", priority: value });
          }
        }}
      />
      <DateInput
        label="Begin Date"
        value={form.startDate}
        locale={localize.language}
        valueFormat="DD.MM.YYYY"
        onChange={(startDate) => dispatch({ type: "setStartDate", startDate })}
      />
      <DateInput
        label="End Date"
        locale={localize.language}
        valueFormat="DD.MM.YYYY"
        value={form.dueDate}
        onChange={(dueDate) => dispatch({ type: "setDueDate", dueDate })}
      />

      <Button
        onClick={() =>
          onSave(taskId, {
            note: {
              title: form.title,
              description: form.description,
              type: form.type,
              priority: form.priority,
              startDate,
              dueDate,
            },
            // A non-empty list is a recipient change. The backend only
            // accepts students there and returns 400 otherwise. Empty
            // lists update the note and leave current recipients in place.
            recipients: {
              recipientIds: [],
              recipientGroupIds: [],
              recipientStudentsWorkspaceIds: [],
            },
          })
        }
      >
        Save Changes
      </Button>
      <Button onClick={onClose}>Cancel</Button>
    </>
  );
}
