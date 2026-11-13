import { useCallback, useMemo, useState } from "react";
import {
  ActionIcon,
  Divider,
  Group,
  Menu,
  Tooltip,
  UnstyledButton,
} from "@mantine/core";
import {
  IconArrowBackUp,
  IconBulb,
  IconCopy,
  IconEye,
  IconFileText,
  IconLock,
  IconNotebook,
  IconPencil,
  IconTrash,
  IconUpload,
  IconUsers,
  IconWorld,
  IconX,
} from "@tabler/icons-react";
import { useAtomValue } from "jotai";
import {
  MaterialViewRestriction,
  type MaterialContentNode,
} from "~/generated/client";
import {
  isPageDraftPublishable,
  materialPageDraftAtom,
  type MaterialPageDraft,
} from "~/src/atoms/workspaceContentDrafts";
import { ConfirmDialog } from "~/src/components/Dialogs/ConfirmDialog/ConfirmDialog";
import { useMaterialContentContext } from "./MaterialContentProvider";
import type { MaterialEditingActionContext } from "./types";
import classes from "./MaterialPage.module.css";

const PAGE_TYPES: MaterialContentNode["assignmentType"][] = [
  null,
  "EXERCISE",
  "EVALUATED",
  "JOURNAL",
  "INTERIM_EVALUATION",
];

const VIEW_RESTRICTIONS: MaterialContentNode["viewRestrict"][] = [
  MaterialViewRestriction.None,
  MaterialViewRestriction.LoggedIn,
  MaterialViewRestriction.WorkspaceMembers,
];

const ANSWER_TYPES: NonNullable<MaterialContentNode["correctAnswers"]>[] = [
  "ALWAYS",
  "ON_REQUEST",
  "NEVER",
];

/**
 * Authoring toolbar: start/stop edit, publish, revert, plus stubs.
 * Renders nothing when editing capability is absent.
 */
export function MaterialEditingToolbar() {
  const { material, workspace, editing } = useMaterialContentContext();

  const [confirmClose, setConfirmClose] = useState(false);

  const savedPage = editing?.savedPage ?? material;
  const draftAtom = useMemo(
    () => materialPageDraftAtom(savedPage.workspaceMaterialId),
    [savedPage.workspaceMaterialId]
  );
  const draft = useAtomValue(draftAtom);
  const canPublish = isPageDraftPublishable(savedPage, draft);
  const publishing = editing?.publishing ?? false;
  const active = editing?.active ?? false;

  const actionCtx: MaterialEditingActionContext | null = useMemo(
    () => (editing && workspace ? { material, workspace, editing } : null),
    [editing, workspace, material]
  );

  /**
   * Handle stop editing click.
   */
  const handleStopEditingClick = useCallback(() => {
    if (canPublish) {
      setConfirmClose(true);
      return;
    }
    if (actionCtx) editing?.onStopEditing?.(actionCtx);
  }, [canPublish, actionCtx, editing]);

  /**
   * Patch draft fields. Opens the editor if the toolbar is still idle.
   * @param patch - Draft patch
   */
  const handleToolbarPatch = useCallback(
    (patch: MaterialPageDraft) => {
      editing?.onPatch?.(patch);
      if (!active && actionCtx) editing?.onEdit?.(actionCtx);
    },
    [active, actionCtx, editing]
  );

  if (!editing) {
    return null;
  }

  return (
    <div className={classes.toolbar}>
      <Group gap="xs" wrap="nowrap" justify="space-between">
        <Group gap="xs" wrap="nowrap">
          {active ? (
            <>
              <Tooltip
                label={
                  canPublish
                    ? "Julkaise muutokset"
                    : "Ei julkaistavia muutoksia"
                }
              >
                <ActionIcon
                  variant="subtle"
                  aria-label="Julkaise muutokset"
                  disabled={!canPublish || publishing}
                  onClick={() => actionCtx && editing.onPublish?.(actionCtx)}
                >
                  <IconUpload size={16} />
                </ActionIcon>
              </Tooltip>
              <Tooltip
                label={
                  canPublish ? "Peru muutokset" : "Ei peruttavia muutoksia"
                }
              >
                <ActionIcon
                  variant="subtle"
                  aria-label="Peru muutokset"
                  disabled={!canPublish}
                  onClick={() => actionCtx && editing.onRevert?.(actionCtx)}
                >
                  <IconArrowBackUp size={16} />
                </ActionIcon>
              </Tooltip>
              <Tooltip label="Lopeta muokkaus">
                <ActionIcon
                  variant="subtle"
                  aria-label="Lopeta muokkaus"
                  disabled={publishing}
                  onClick={handleStopEditingClick}
                >
                  <IconX size={16} />
                </ActionIcon>
              </Tooltip>
            </>
          ) : (
            <Tooltip label="Aloita muokkaus">
              <ActionIcon
                variant="subtle"
                aria-label="Aloita muokkaus"
                onClick={() => actionCtx && editing.onEdit?.(actionCtx)}
              >
                <IconPencil size={16} />
              </ActionIcon>
            </Tooltip>
          )}
          <Divider orientation="vertical" />
          <ActionIcon variant="subtle" aria-label="Kopioi" disabled>
            <IconCopy size={16} />
          </ActionIcon>
          <ActionIcon variant="subtle" aria-label="Esikatsele" disabled>
            <IconEye size={16} />
          </ActionIcon>
          {editing.canRestrictView ? (
            <VisibilitySelect
              value={material.viewRestrict}
              disabled={publishing}
              onChange={(viewRestrict) => handleToolbarPatch({ viewRestrict })}
            />
          ) : (
            <span className={classes.meta}>
              {restrictionIcon(material.viewRestrict)}
              {restrictionLabel(material.viewRestrict)}
            </span>
          )}
          {editing.canChangePageType ? (
            <PageTypeSelect
              value={material.assignmentType}
              disabled={publishing}
              onChange={(assignmentType) =>
                handleToolbarPatch({
                  assignmentType,
                  correctAnswers:
                    assignmentType === "EXERCISE"
                      ? material.assignmentType === "EXERCISE"
                        ? material.correctAnswers
                        : "ALWAYS"
                      : undefined,
                })
              }
            />
          ) : (
            <span className={classes.meta}>
              {pageTypeIcon(material.assignmentType)}
              {pageTypeLabel(material.assignmentType)}
            </span>
          )}
          {editing.canChangeExerciseType &&
          material.assignmentType === "EXERCISE" ? (
            <AnswersTypeSelect
              value={material.correctAnswers}
              disabled={publishing}
              onChange={(correctAnswers) =>
                handleToolbarPatch({ correctAnswers })
              }
            />
          ) : null}
        </Group>
        <ActionIcon variant="subtle" color="red" aria-label="Poista" disabled>
          <IconTrash size={16} />
        </ActionIcon>
      </Group>

      <ConfirmDialog
        opened={confirmClose}
        title="Julkaisemattomat muutokset"
        size="md"
        cancelLabel="Jatka muokkausta"
        confirmLabel="Lopeta tallentamatta"
        onCancel={() => setConfirmClose(false)}
        onConfirm={() => {
          setConfirmClose(false);
          if (actionCtx) editing.onStopEditing?.(actionCtx);
        }}
      >
        Sivulla on julkaisemattomia muutoksia. Jos lopetat muokkauksen,
        muutokset häviävät.
      </ConfirmDialog>
    </div>
  );
}

/**
 * View-restriction dropdown. Trigger shows icon + label.
 */
function VisibilitySelect(props: {
  value: MaterialContentNode["viewRestrict"];
  disabled: boolean;
  onChange: (value: MaterialContentNode["viewRestrict"]) => void;
}) {
  const { value, disabled, onChange } = props;

  return (
    <Menu position="bottom-start" shadow="md">
      <Menu.Target>
        <UnstyledButton
          className={classes.select}
          aria-label="Näkyvyys"
          disabled={disabled}
        >
          {restrictionIcon(value)}
          {restrictionLabel(value)}
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        {VIEW_RESTRICTIONS.map((option) => (
          <Menu.Item
            key={option ?? "none"}
            leftSection={restrictionIcon(option)}
            onClick={() => onChange(option)}
          >
            {restrictionLabel(option)}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}

/**
 * Page-type dropdown. Trigger shows icon + label.
 */
function PageTypeSelect(props: {
  value: MaterialContentNode["assignmentType"];
  disabled: boolean;
  onChange: (value: MaterialContentNode["assignmentType"]) => void;
}) {
  const { value, disabled, onChange } = props;

  return (
    <Menu position="bottom-start" shadow="md">
      <Menu.Target>
        <UnstyledButton
          className={classes.select}
          aria-label="Sivun tyyppi"
          disabled={disabled}
        >
          {pageTypeIcon(value)}
          {pageTypeLabel(value)}
        </UnstyledButton>
      </Menu.Target>
      <Menu.Dropdown>
        {PAGE_TYPES.map((option) => (
          <Menu.Item
            key={option ?? "theory"}
            leftSection={pageTypeIcon(option)}
            onClick={() => onChange(option)}
          >
            {pageTypeLabel(option)}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}

/**
 * Exercise answer-reveal dropdown. Icon only, same as V3 lightbulb.
 */
function AnswersTypeSelect(props: {
  value: MaterialContentNode["correctAnswers"];
  disabled: boolean;
  onChange: (value: NonNullable<MaterialContentNode["correctAnswers"]>) => void;
}) {
  const { value, disabled, onChange } = props;

  return (
    <Menu position="bottom-start" shadow="md">
      <Menu.Target>
        <Tooltip label={answersTypeLabel(value)}>
          <ActionIcon
            variant="subtle"
            aria-label="Vastausten näyttäminen"
            disabled={disabled}
          >
            <IconBulb size={16} />
          </ActionIcon>
        </Tooltip>
      </Menu.Target>
      <Menu.Dropdown>
        {ANSWER_TYPES.map((option) => (
          <Menu.Item key={option} onClick={() => onChange(option)}>
            {answersTypeLabel(option)}
          </Menu.Item>
        ))}
      </Menu.Dropdown>
    </Menu>
  );
}

/**
 * View-restriction label for the idle/editing toolbar.
 * @param viewRestrict - Node viewRestrict
 */
function restrictionLabel(
  viewRestrict: MaterialContentNode["viewRestrict"]
): string {
  switch (viewRestrict) {
    case MaterialViewRestriction.LoggedIn:
      return "Kirjautuneille";
    case MaterialViewRestriction.WorkspaceMembers:
      return "Jäsenille";
    default:
      return "Kaikille";
  }
}

/**
 * View-restriction icon for the toolbar trigger and menu.
 * @param viewRestrict - Node viewRestrict
 */
function restrictionIcon(viewRestrict: MaterialContentNode["viewRestrict"]) {
  switch (viewRestrict) {
    case MaterialViewRestriction.LoggedIn:
      return <IconLock size={16} />;
    case MaterialViewRestriction.WorkspaceMembers:
      return <IconUsers size={16} />;
    default:
      return <IconWorld size={16} />;
  }
}

/**
 * Page-type label for the toolbar.
 * @param assignmentType - Node assignment type
 */
function pageTypeLabel(
  assignmentType: MaterialContentNode["assignmentType"]
): string {
  switch (assignmentType) {
    case "EXERCISE":
      return "Harjoitustehtävä";
    case "EVALUATED":
      return "Arvioitava tehtävä";
    case "JOURNAL":
      return "Oppimispäiväkirja";
    case "INTERIM_EVALUATION":
      return "Välipalautetehtävä";
    default:
      return "Teoriasivu";
  }
}

/**
 * Page-type icon for the toolbar.
 * @param assignmentType - Node assignment type
 */
function pageTypeIcon(assignmentType: MaterialContentNode["assignmentType"]) {
  switch (assignmentType) {
    case "JOURNAL":
      return <IconNotebook size={16} />;
    default:
      return <IconFileText size={16} />;
  }
}

/**
 * Exercise answer-reveal label. V3 showAnswersAlways / OnRequest / Never.
 * @param correctAnswers - Node correctAnswers
 */
function answersTypeLabel(
  correctAnswers: MaterialContentNode["correctAnswers"]
): string {
  switch (correctAnswers) {
    case "ALWAYS":
      return "Vastaukset näytetään aina";
    case "ON_REQUEST":
      return "Vastaukset opiskelijan pyynnöstä";
    default:
      return "Vastauksia ei näytetä";
  }
}
