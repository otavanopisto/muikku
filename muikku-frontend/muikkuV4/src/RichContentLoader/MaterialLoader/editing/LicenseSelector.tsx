import { Radio, Select, Stack, TextInput } from "@mantine/core";

const CC_PREFIX = "https://creativecommons.org/licenses/";
const CC0_URL = "https://creativecommons.org/publicdomain/zero/1.0/";

type LicenseKind = "CC4" | "CC3" | "CC0" | "text_or_link" | "none";
type AllowModifications = "" | "nd" | "sa";
type CommercialUse = "" | "nc";

const KIND_OPTIONS = [
  { value: "CC4", label: "Creative Commons 4.0" },
  { value: "CC3", label: "Creative Commons 3.0" },
  { value: "CC0", label: "CC0 1.0 Yleismaailmallinen" },
  { value: "text_or_link", label: "Teksti tai linkki" },
  { value: "none", label: "Ei määritetty" },
];

/**
 * Build a Creative Commons license URL, same shape as V3.
 */
function ccUrl(
  version: "4.0" | "3.0",
  commercialUse: CommercialUse,
  allowModifications: AllowModifications
): string {
  const nc = commercialUse ? `-${commercialUse}` : "";
  const am = allowModifications ? `-${allowModifications}` : "";
  return `${CC_PREFIX}by${nc}${am}/${version}`;
}

/**
 * Read kind + CC options from a stored license string.
 */
function parseLicense(value: string): {
  kind: LicenseKind;
  commercialUse: CommercialUse;
  allowModifications: AllowModifications;
} {
  const normalized = value.trim();
  if (!normalized) {
    return { kind: "none", commercialUse: "nc", allowModifications: "sa" };
  }
  if (
    normalized === CC0_URL ||
    normalized === "http://creativecommons.org/publicdomain/zero/1.0/"
  ) {
    return { kind: "CC0", commercialUse: "nc", allowModifications: "sa" };
  }
  const isCc =
    normalized.startsWith(CC_PREFIX) ||
    normalized.startsWith("http://creativecommons.org/licenses/");
  if (isCc && (normalized.endsWith("4.0") || normalized.endsWith("3.0"))) {
    return {
      kind: normalized.endsWith("4.0") ? "CC4" : "CC3",
      commercialUse: normalized.includes("-nc") ? "nc" : "",
      allowModifications: normalized.includes("-nd")
        ? "nd"
        : normalized.includes("-sa")
          ? "sa"
          : "",
    };
  }
  return {
    kind: "text_or_link",
    commercialUse: "nc",
    allowModifications: "sa",
  };
}

/**
 * V3-compatible license editor. Value is a URL, custom text, or empty.
 */
export function LicenseSelector(props: {
  value: string;
  onChange: (license: string) => void;
}) {
  const { value, onChange } = props;
  const parsed = parseLicense(value);

  /**
   * Switch license kind. CC 3/4 start at V3 default by-nc-sa.
   */
  function handleKindChange(kind: string | null) {
    switch (kind) {
      case "CC4":
        onChange(ccUrl("4.0", "nc", "sa"));
        return;
      case "CC3":
        onChange(ccUrl("3.0", "nc", "sa"));
        return;
      case "CC0":
        onChange(CC0_URL);
        return;
      case "none":
        onChange("");
        return;
      default:
        onChange("");
    }
  }

  /**
   * Rebuild the CC URL when a radio changes.
   */
  function handleCcChange(
    commercialUse: CommercialUse,
    allowModifications: AllowModifications
  ) {
    const version = parsed.kind === "CC3" ? "3.0" : "4.0";
    onChange(ccUrl(version, commercialUse, allowModifications));
  }

  const showCcOptions = parsed.kind === "CC4" || parsed.kind === "CC3";

  return (
    <Stack gap="sm">
      <Select
        label="Lisenssi"
        data={KIND_OPTIONS}
        value={parsed.kind}
        allowDeselect={false}
        onChange={handleKindChange}
      />
      {showCcOptions ? (
        <>
          <Radio.Group
            label="Sallitaanko teoksen muokkaaminen?"
            value={parsed.allowModifications}
            onChange={(next) =>
              handleCcChange(parsed.commercialUse, next as AllowModifications)
            }
          >
            <Stack gap="xs" mt="xs">
              <Radio value="" label="Kyllä" />
              <Radio value="nd" label="Ei" />
              <Radio
                value="sa"
                label="Kyllä, mikäli muut jakavat samoin ehdoin"
              />
            </Stack>
          </Radio.Group>
          <Radio.Group
            label="Sallitaanko teoksen kaupallinen käyttö?"
            value={parsed.commercialUse}
            onChange={(next) =>
              handleCcChange(next as CommercialUse, parsed.allowModifications)
            }
          >
            <Stack gap="xs" mt="xs">
              <Radio value="" label="Kyllä" />
              <Radio value="nc" label="Ei" />
            </Stack>
          </Radio.Group>
        </>
      ) : null}
      {parsed.kind === "text_or_link" ? (
        <TextInput
          label="URL-osoite lisenssiin tai lisenssiteksti"
          value={value}
          onChange={(event) => onChange(event.currentTarget.value)}
        />
      ) : null}
    </Stack>
  );
}
