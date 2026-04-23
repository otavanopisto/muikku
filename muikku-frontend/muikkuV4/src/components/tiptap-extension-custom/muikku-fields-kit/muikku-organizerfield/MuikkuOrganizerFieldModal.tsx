"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Modal,
  Button,
  Stack,
  Group,
  TextInput,
  Card,
  Badge,
} from "@mantine/core";
import type { Editor } from "@tiptap/react";
import type {
  MuikkuOrganizerCategory,
  MuikkuOrganizerCategoryTerms,
  MuikkuOrganizerFieldContent,
  MuikkuOrganizerTerm,
} from "./MuikkuOrganizerFieldExtension";
import { createRandomMuikkuFieldName } from "../helpers";

type UiCategory = {
  id: string;
  name: string;
  termIds: string[];
};

type TermIndex = Record<
  string,
  { id: string; count: number } // key is term name
>;

/**
 * Generates a next ID.
 * @param prefix - The prefix for the ID.
 * @param used - The set of used IDs.
 * @returns The next ID.
 */
function nextId(prefix: "c" | "t", used: Set<string>): string {
  let i = 1;
  while (used.has(`${prefix}${i}`)) i++;
  return `${prefix}${i}`;
}

/**
 * The Muikku organizer field modal component.
 * @param props - The props for the Muikku organizer field modal component.
 * @returns The Muikku organizer field modal component.
 */
export function MuikkuOrganizerFieldModal(props: {
  editor: Editor | null;
  opened: boolean;
  onClose: () => void;
}) {
  const { editor, opened, onClose } = props;
  const isEditing = !!editor?.isActive("muikkuOrganizerField");

  const [termTitle, setTermTitle] = useState("");
  const [termsIndex, setTermsIndex] = useState<TermIndex>({});
  const [categories, setCategories] = useState<UiCategory[]>([]);

  const usedCategoryIds = useMemo(
    () => new Set(categories.map((c) => c.id)),
    [categories]
  );

  const usedTermIds = useMemo(() => {
    const ids = new Set<string>();
    Object.values(termsIndex).forEach((t) => ids.add(t.id));
    return ids;
  }, [termsIndex]);

  useEffect(() => {
    if (!opened || !editor) return;

    if (editor.isActive("muikkuOrganizerField")) {
      const attrs = editor.getAttributes("muikkuOrganizerField") as {
        content?: MuikkuOrganizerFieldContent;
      };
      const c = attrs.content ?? null;

      setTermTitle(c?.termTitle ?? "");

      // Build term index (name -> {id,count})
      const index: TermIndex = {};
      (c?.terms ?? []).forEach((t) => {
        if (t?.name && t?.id) index[t.name] = { id: t.id, count: 0 };
      });

      // Build categories and their term ids
      const catTermsMap = new Map<string, string[]>();
      (c?.categoryTerms ?? []).forEach((ct) => {
        if (ct?.category)
          catTermsMap.set(ct.category, Array.isArray(ct.terms) ? ct.terms : []);
      });

      const uiCats: UiCategory[] = (c?.categories ?? []).map((cat) => ({
        id: cat.id,
        name: cat.name ?? "",
        termIds: catTermsMap.get(cat.id) ?? [],
      }));

      // Count usage of each term by name (via term id occurrences)
      const idToName = new Map<string, string>();
      (c?.terms ?? []).forEach((t) => idToName.set(t.id, t.name));

      uiCats.forEach((cat) => {
        cat.termIds.forEach((tid) => {
          const name = idToName.get(tid);
          if (!name) return;
          const entry = index[name];
          if (entry) entry.count++;
        });
      });

      setTermsIndex(index);
      setCategories(uiCats);
    } else {
      setTermTitle("");
      setTermsIndex({});
      setCategories([]);
    }
  }, [opened, editor]);

  const addCategory = () => {
    const id = nextId("c", usedCategoryIds);
    setCategories((prev) => [...prev, { id, name: "", termIds: [] }]);
  };

  const deleteCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((c) => c.id !== categoryId));

    // Decrement term usage counts for terms that were in this category
    const cat = categories.find((c) => c.id === categoryId);
    if (!cat) return;

    setTermsIndex((prev) => {
      const next = { ...prev };
      const idToName = new Map<string, string>();
      Object.keys(prev).forEach((name) => idToName.set(prev[name].id, name));

      cat.termIds.forEach((tid) => {
        const name = idToName.get(tid);
        if (!name) return;
        const entry = next[name];
        if (!entry) return;

        const nextCount = entry.count - 1;
        if (nextCount <= 0) {
          delete next[name];
        } else {
          next[name] = { ...entry, count: nextCount };
        }
      });

      return next;
    });
  };

  /**
   * Updates the name of a category.
   * @param categoryId - The ID of the category.
   * @param name - The new name of the category.
   * @returns The updated categories.
   */
  const updateCategoryName = (categoryId: string, name: string) => {
    setCategories((prev) =>
      prev.map((c) => (c.id === categoryId ? { ...c, name } : c))
    );
  };

  /**
   * Adds a term to a category.
   * @param categoryId - The ID of the category.
   * @param termNameRaw - The raw name of the term.
   * @returns The updated categories and terms index.
   */
  const addTermToCategory = (categoryId: string, termNameRaw: string) => {
    const termName = termNameRaw.trim();
    if (!termName) return;

    setCategories((prev) =>
      prev.map((c) => {
        if (c.id !== categoryId) return c;

        // prevent duplicates in same category (by term id)
        const existing = termsIndex[termName];
        const termId = existing?.id ?? nextId("t", usedTermIds);

        if (c.termIds.includes(termId)) return c;

        return { ...c, termIds: [...c.termIds, termId] };
      })
    );

    setTermsIndex((prev) => {
      const existing = prev[termName];
      if (existing) {
        return {
          ...prev,
          [termName]: { ...existing, count: existing.count + 1 },
        };
      }
      return {
        ...prev,
        [termName]: { id: nextId("t", usedTermIds), count: 1 },
      };
    });
  };

  /**
   * Removes a term from a category.
   * @param categoryId - The ID of the category.
   * @param termId - The ID of the term.
   * @returns The updated categories and terms index.
   */
  const removeTermFromCategory = (categoryId: string, termId: string) => {
    setCategories((prev) =>
      prev.map((c) =>
        c.id === categoryId
          ? { ...c, termIds: c.termIds.filter((t) => t !== termId) }
          : c
      )
    );

    setTermsIndex((prev) => {
      const next = { ...prev };
      const name = Object.keys(next).find((n) => next[n].id === termId);
      if (!name) return prev;

      const entry = next[name];
      const nextCount = entry.count - 1;
      if (nextCount <= 0) delete next[name];
      else next[name] = { ...entry, count: nextCount };
      return next;
    });
  };

  /**
   * Handles the OK button click.
   * @returns The updated categories and terms index.
   */
  const handleOk = () => {
    if (!editor?.isEditable) return;

    const prev = (
      editor.getAttributes("muikkuOrganizerField") as {
        content?: MuikkuOrganizerFieldContent;
      }
    ).content;

    const name = prev?.name?.trim() ?? createRandomMuikkuFieldName();

    const terms: MuikkuOrganizerTerm[] = Object.keys(termsIndex).map(
      (termName) => ({
        id: termsIndex[termName].id,
        name: termName,
      })
    );

    const categoriesOut: MuikkuOrganizerCategory[] = categories.map((c) => ({
      id: c.id,
      name: c.name,
    }));

    const categoryTerms: MuikkuOrganizerCategoryTerms[] = categories.map(
      (c) => ({
        category: c.id,
        terms: c.termIds,
      })
    );

    const content: MuikkuOrganizerFieldContent = {
      name,
      termTitle,
      terms,
      categories: categoriesOut,
      categoryTerms,
    };

    const ok = isEditing
      ? editor.commands.updateMuikkuOrganizerField(content)
      : editor.commands.setMuikkuOrganizerField(content);

    if (ok) onClose();
  };

  const idToName = useMemo(() => {
    const map = new Map<string, string>();
    Object.keys(termsIndex).forEach((name) =>
      map.set(termsIndex[name].id, name)
    );
    return map;
  }, [termsIndex]);

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="RYHMITTELYKENTÄN ASETUKSET"
      size="xl"
      centered
    >
      <Stack gap="sm">
        <TextInput
          label="Termien otsikko"
          value={termTitle}
          onChange={(e) => setTermTitle(e.currentTarget.value)}
        />

        <Group justify="space-between">
          <div style={{ fontWeight: 600 }}>Ryhmät</div>
          <Button variant="light" onClick={addCategory}>
            +
          </Button>
        </Group>

        <Stack gap="sm">
          {categories.length === 0 ? (
            <div style={{ opacity: 0.7 }}>Ei ryhmiä.</div>
          ) : (
            categories.map((cat) => (
              <Card key={cat.id} withBorder padding="sm">
                <Group justify="space-between" align="flex-end" mb="xs">
                  <TextInput
                    style={{ flex: 1 }}
                    label="Ryhmän nimi"
                    placeholder="Ryhmän nimi"
                    value={cat.name}
                    onChange={(e) =>
                      updateCategoryName(cat.id, e.currentTarget.value)
                    }
                  />
                  <Button
                    variant="default"
                    onClick={() => deleteCategory(cat.id)}
                    title="Poista"
                  >
                    🗑
                  </Button>
                </Group>

                <TextInput
                  label="Uusi termi"
                  placeholder="Uusi termi"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      const target = e.currentTarget as HTMLInputElement;
                      addTermToCategory(cat.id, target.value);
                      target.value = "";
                    }
                  }}
                />

                <Group mt="sm" gap="xs">
                  {cat.termIds.length === 0 ? (
                    <span style={{ opacity: 0.7 }}>Ei termejä.</span>
                  ) : (
                    cat.termIds.map((tid) => (
                      <Badge
                        key={tid}
                        variant="light"
                        rightSection={
                          <button
                            type="button"
                            onClick={() => removeTermFromCategory(cat.id, tid)}
                            style={{
                              border: "none",
                              background: "transparent",
                              cursor: "pointer",
                            }}
                            aria-label="Poista termi"
                          >
                            ×
                          </button>
                        }
                      >
                        {idToName.get(tid) ?? tid}
                      </Badge>
                    ))
                  )}
                </Group>
              </Card>
            ))
          )}
        </Stack>
      </Stack>

      <Group justify="flex-end" mt="md">
        <Button variant="default" onClick={onClose}>
          PERUUTA
        </Button>
        <Button onClick={handleOk}>OK</Button>
      </Group>
    </Modal>
  );
}

export default MuikkuOrganizerFieldModal;
