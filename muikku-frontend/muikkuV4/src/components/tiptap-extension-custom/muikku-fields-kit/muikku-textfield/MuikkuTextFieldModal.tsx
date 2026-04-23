"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Tabs,
  Button,
  Stack,
  TextInput,
  Group,
  Checkbox,
} from "@mantine/core";
import type { Editor } from "@tiptap/react";
import type {
  MuikkuTextFieldContent,
  MuikkuTextFieldRightAnswer,
} from "./MuikkuTextFieldExtension";
import { createRandomMuikkuFieldName } from "../helpers";

/**
 * Normalizes the right answers of a Muikku text field.
 * @param answers - The right answers to normalize.
 * @returns The normalized right answers.
 */
function normalizeRightAnswers(
  answers: MuikkuTextFieldRightAnswer[] | undefined
): MuikkuTextFieldRightAnswer[] {
  if (!Array.isArray(answers)) return [];
  return answers.map((a) => ({
    text: typeof a.text === "string" ? a.text : "",
    correct: !!a.correct,
    caseSensitive:
      typeof a.caseSensitive === "boolean" ? a.caseSensitive : false,
    normalizeWhitespace:
      typeof a.normalizeWhitespace === "boolean" ? a.normalizeWhitespace : true,
  }));
}

/**
 * The Muikku text field modal component.
 * @param props - The props for the Muikku text field modal component.
 * @returns The Muikku text field modal component.
 */
export function MuikkuTextFieldModal(props: {
  editor: Editor | null;
  opened: boolean;
  onClose: () => void;
}) {
  const { editor, opened, onClose } = props;

  const isEditing = !!editor?.isActive("muikkuTextField");
  const [tab, setTab] = useState<string | null>("general");

  const [columns, setColumns] = useState("");
  const [autogrow, setAutogrow] = useState(true);
  const [hint, setHint] = useState("");

  const [rightAnswers, setRightAnswers] = useState<
    MuikkuTextFieldRightAnswer[]
  >([]);

  const canSave = useMemo(() => !!editor?.isEditable, [editor]);

  useEffect(() => {
    if (!opened || !editor) return;

    if (editor.isActive("muikkuTextField")) {
      const attrs = editor.getAttributes("muikkuTextField") as {
        content?: MuikkuTextFieldContent;
      };
      const content = attrs.content ?? null;

      setColumns((content?.columns ?? "").toString());
      setAutogrow(
        typeof content?.autogrow === "boolean" ? content.autogrow : true
      );
      setHint(content?.hint ?? "");
      setRightAnswers(normalizeRightAnswers(content?.rightAnswers));
    } else {
      setColumns("");
      setAutogrow(true);
      setHint("");
      setRightAnswers([]);
    }
  }, [opened, editor]);

  const addAnswer = () => {
    setRightAnswers((prev) => [
      ...prev,
      {
        text: "",
        correct: false,
        caseSensitive: false,
        normalizeWhitespace: true,
      },
    ]);
  };

  const updateAnswer = (
    idx: number,
    next: Partial<MuikkuTextFieldRightAnswer>
  ) => {
    setRightAnswers((prev) =>
      prev.map((a, i) => (i === idx ? { ...a, ...next } : a))
    );
  };

  const removeAnswer = (idx: number) => {
    setRightAnswers((prev) => prev.filter((_, i) => i !== idx));
  };

  const moveAnswer = (idx: number, dir: -1 | 1) => {
    setRightAnswers((prev) => {
      const next = [...prev];
      const j = idx + dir;
      if (j < 0 || j >= next.length) return prev;
      const tmp = next[idx];
      next[idx] = next[j];
      next[j] = tmp;
      return next;
    });
  };

  const handleOk = () => {
    if (!editor || !canSave) return;

    const prev = (
      editor.getAttributes("muikkuTextField") as {
        content?: MuikkuTextFieldContent;
      }
    ).content;

    const content: MuikkuTextFieldContent = {
      name: prev?.name?.trim() ?? createRandomMuikkuFieldName(),
      columns: columns.trim(),
      autogrow: !!autogrow,
      hint: hint,
      rightAnswers: rightAnswers.map((a) => ({
        text: a.text,
        correct: !!a.correct,
        caseSensitive:
          typeof a.caseSensitive === "boolean" ? a.caseSensitive : false,
        normalizeWhitespace:
          typeof a.normalizeWhitespace === "boolean"
            ? a.normalizeWhitespace
            : true,
      })),
    };

    const ok = isEditing
      ? editor.commands.updateMuikkuTextField(content)
      : editor.commands.setMuikkuTextField(content);

    if (ok) onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="TEKSTIKENTÄN OMINAISUUDET"
      size="lg"
      centered
    >
      <Tabs value={tab} onChange={setTab}>
        <Tabs.List>
          <Tabs.Tab value="general">Yleinen</Tabs.Tab>
          <Tabs.Tab value="answers">Vastausvaihtoehdot</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="general" pt="md">
          <Stack gap="sm">
            <TextInput
              label="Leveys"
              value={columns}
              onChange={(e) => setColumns(e.currentTarget.value)}
              placeholder="Esim. 40"
            />
            <Checkbox
              checked={autogrow}
              onChange={(e) => setAutogrow(e.currentTarget.checked)}
              label="Levene automaattisesti kirjoittaessa"
            />
            <TextInput
              label="Vihjeteksti"
              value={hint}
              onChange={(e) => setHint(e.currentTarget.value)}
            />
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="answers" pt="md">
          <Stack gap="sm">
            <Group justify="space-between">
              <div style={{ fontWeight: 600 }}>Vastausvaihtoehdot</div>
              <Button variant="light" onClick={addAnswer}>
                +
              </Button>
            </Group>

            {rightAnswers.length === 0 ? (
              <div style={{ opacity: 0.7 }}>Ei vastausvaihtoehtoja.</div>
            ) : (
              rightAnswers.map((a, idx) => (
                // eslint-disable-next-line react-x/no-array-index-key
                <Group key={idx} align="flex-end" grow wrap="nowrap">
                  <TextInput
                    label={idx === 0 ? "Teksti" : undefined}
                    value={a.text}
                    onChange={(e) =>
                      updateAnswer(idx, { text: e.currentTarget.value })
                    }
                  />

                  <Checkbox
                    checked={!!a.correct}
                    onChange={(e) =>
                      updateAnswer(idx, { correct: e.currentTarget.checked })
                    }
                    label={idx === 0 ? "Oikea" : ""}
                    styles={{ label: { whiteSpace: "nowrap" } }}
                  />

                  <Group gap="xs" wrap="nowrap">
                    <Button
                      variant="default"
                      onClick={() => moveAnswer(idx, -1)}
                      disabled={idx === 0}
                    >
                      ↑
                    </Button>
                    <Button
                      variant="default"
                      onClick={() => moveAnswer(idx, 1)}
                      disabled={idx === rightAnswers.length - 1}
                    >
                      ↓
                    </Button>
                    <Button variant="default" onClick={() => removeAnswer(idx)}>
                      🗑
                    </Button>
                  </Group>
                </Group>
              ))
            )}
          </Stack>
        </Tabs.Panel>
      </Tabs>

      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={onClose}>
          PERUUTA
        </Button>
        <Button onClick={handleOk} disabled={!canSave}>
          OK
        </Button>
      </Group>
    </Modal>
  );
}

export default MuikkuTextFieldModal;
