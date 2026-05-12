"use client";

import { useEffect, useState } from "react";
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

  const canSave = !!editor?.isEditable;

  // Hydrate the state from the editor.
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

  /**
   * The updateAnswer function.
   * @param idx - The index of the answer to update.
   * @param next - The next answer.
   */
  const updateAnswer = (
    idx: number,
    next: Partial<MuikkuTextFieldRightAnswer>
  ) => {
    setRightAnswers((prev) =>
      prev.map((a, i) => (i === idx ? { ...a, ...next } : a))
    );
  };

  /**
   * The removeAnswer function.
   * @param idx - The index of the answer to remove.
   */
  const removeAnswer = (idx: number) => {
    setRightAnswers((prev) => prev.filter((_, i) => i !== idx));
  };

  /**
   * The moveAnswer function.
   * @param idx - The index of the answer to move.
   * @param dir - The direction to move the answer.
   */
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

  /**
   * The handleColumnsChange function.
   * @param e - The change event.
   */
  const handleColumnsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setColumns(e.currentTarget.value);
  };

  /**
   * The handleAutogrowChange function.
   * @param e - The change event.
   */
  const handleAutogrowChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAutogrow(e.currentTarget.checked);
  };

  /**
   * The handleHintChange function.
   * @param e - The change event.
   */
  const handleHintChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHint(e.currentTarget.value);
  };

  /**
   * The handleAddAnswer function.
   */
  const handleAddAnswer = () => {
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

  /**
   * The handleAnswerTextChange function.
   * @param idx - The index of the answer to update.
   * @param e - The change event.
   */
  const handleAnswerTextChange =
    (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      updateAnswer(idx, { text: e.currentTarget.value });
    };

  /**
   * The handleAnswerCorrectChange function.
   * @param idx - The index of the answer to update.
   * @param e - The change event.
   */
  const handleAnswerCorrectChange =
    (idx: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      updateAnswer(idx, { correct: e.currentTarget.checked });
    };

  /**
   * The handleMoveAnswerUp function.
   * @param idx - The index of the answer to move.
   */
  const handleMoveAnswerUp = (idx: number) => () => {
    moveAnswer(idx, -1);
  };

  /**
   * The handleMoveAnswerDown function.
   * @param idx - The index of the answer to move.
   */
  const handleMoveAnswerDown = (idx: number) => () => {
    moveAnswer(idx, 1);
  };

  /**
   * The handleRemoveAnswerClick function.
   * @param idx - The index of the answer to remove.
   */
  const handleRemoveAnswerClick = (idx: number) => () => {
    removeAnswer(idx);
  };

  /**
   * The handleOk function.
   */
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
              onChange={handleColumnsChange}
              placeholder="Esim. 40"
            />
            <Checkbox
              checked={autogrow}
              onChange={handleAutogrowChange}
              label="Levene automaattisesti kirjoittaessa"
            />
            <TextInput
              label="Vihjeteksti"
              value={hint}
              onChange={handleHintChange}
            />
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="answers" pt="md">
          <Stack gap="sm">
            <Group justify="space-between">
              <div style={{ fontWeight: 600 }}>Vastausvaihtoehdot</div>
              <Button variant="light" onClick={handleAddAnswer}>
                +
              </Button>
            </Group>

            {rightAnswers.length === 0 ? (
              <div style={{ opacity: 0.7 }}>Ei vastausvaihtoehtoja.</div>
            ) : (
              rightAnswers.map((a, idx) => (
                <Group
                  key={`right-answer-${a.text}`}
                  align="flex-end"
                  grow
                  wrap="nowrap"
                >
                  <TextInput
                    label={idx === 0 ? "Teksti" : undefined}
                    value={a.text}
                    onChange={handleAnswerTextChange(idx)}
                  />

                  <Checkbox
                    checked={!!a.correct}
                    onChange={handleAnswerCorrectChange(idx)}
                    label={idx === 0 ? "Oikea" : ""}
                    styles={{ label: { whiteSpace: "nowrap" } }}
                  />

                  <Group gap="xs" wrap="nowrap">
                    <Button
                      variant="default"
                      onClick={handleMoveAnswerUp(idx)}
                      disabled={idx === 0}
                    >
                      ↑
                    </Button>
                    <Button
                      variant="default"
                      onClick={handleMoveAnswerDown(idx)}
                      disabled={idx === rightAnswers.length - 1}
                    >
                      ↓
                    </Button>
                    <Button
                      variant="default"
                      onClick={handleRemoveAnswerClick(idx)}
                    >
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
