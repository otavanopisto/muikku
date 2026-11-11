import { NumberInput, Select, Stack, Text, TextInput } from "@mantine/core";
import type {
  Language,
  MaterialAI,
  MaterialContentNode,
} from "~/generated/client";
import type { MaterialPageDraft } from "~/src/atoms/workspaceContentDrafts";

/**
 * Tiedot: metadata draft fields.
 */
export function PageMetadataTab(props: {
  page: MaterialContentNode;
  onPatch: (patch: MaterialPageDraft) => void;
}) {
  const { page, onPatch } = props;

  return (
    <Stack gap="md">
      <Text size="sm" c="dimmed">
        Tuottajat kytketään myöhemmin.
      </Text>
      <TextInput
        label="Lisenssi"
        value={page.license ?? ""}
        onChange={(event) =>
          onPatch({ license: event.currentTarget.value ?? "" })
        }
      />
      <TextInput
        label="Lisätiedot"
        value={page.extraInfo ?? ""}
        onChange={(event) => onPatch({ extraInfo: event.currentTarget.value })}
      />
      <Select
        label="Kieli"
        data={[
          { value: "", label: "Peritty" },
          { value: "fi", label: "Suomi" },
          { value: "en", label: "English" },
          { value: "sv", label: "Svenska" },
        ]}
        value={page.titleLanguage ?? ""}
        allowDeselect={false}
        onChange={(value) => onPatch({ titleLanguage: value as Language })}
      />
      <Select
        label="Tekoälyn käyttö"
        data={[
          { value: "", label: "Ei määritelty" },
          { value: "ALLOWED", label: "Sallittu" },
          { value: "DISALLOWED", label: "Ei sallittu" },
        ]}
        value={page.ai ?? ""}
        allowDeselect={false}
        onChange={(value) =>
          onPatch({
            ai:
              value === "ALLOWED" || value === "DISALLOWED"
                ? (value as MaterialAI)
                : undefined,
          })
        }
      />
      <NumberInput
        label="Enimmäispisteet"
        decimalScale={2}
        min={0}
        value={page.maxPoints ?? ""}
        onChange={(value) =>
          onPatch({
            maxPoints: typeof value === "number" ? value : undefined,
          })
        }
      />
    </Stack>
  );
}
