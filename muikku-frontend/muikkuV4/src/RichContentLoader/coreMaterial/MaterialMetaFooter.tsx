import { Anchor, Text } from "@mantine/core";
import type { MaterialContentNode } from "~/generated/client";
import { localize } from "~/src/locales/i18n";
import { useMaterialContentContext } from "./MaterialContentProvider";
import classes from "./MaterialPage.module.css";

/**
 * Read-only producers / extraInfo / license / last edit.
 * Safe outside MaterialLoader (pass material yourself).
 */
export function MaterialMetaFooterView(props: {
  material: MaterialContentNode;
}) {
  const { material } = props;
  const producers = material.producers ?? [];
  const license = material.license?.trim() ?? "";
  const extraInfo = material.extraInfo?.trim() ?? "";
  const licenseIsUrl =
    license.startsWith("https://") || license.startsWith("http://");

  const hasMeta = producers.length > 0 || extraInfo || license;
  const hasEdited = Boolean(material.edited && material.editor);

  if (!hasMeta && !hasEdited) {
    return null;
  }

  return (
    <div className={classes.footer}>
      {producers.length > 0 ? (
        <div className={classes.row}>
          <Text span className={classes.label}>
            Materiaalin tuottajat:
          </Text>
          <Text span>{producers.map((p) => p.name).join(", ")}</Text>
        </div>
      ) : null}
      {extraInfo ? <Text>{extraInfo}</Text> : null}
      {license ? (
        <div className={classes.row}>
          <Text span className={classes.label}>
            Lisenssi:
          </Text>
          {licenseIsUrl ? (
            <Anchor href={license} target="_blank" rel="noreferrer">
              {license}
            </Anchor>
          ) : (
            <Text span>{license}</Text>
          )}
        </div>
      ) : null}
      {hasEdited ? (
        <div className={classes.row}>
          <Text span className={classes.label}>
            Päivitetty viimeksi:
          </Text>
          <Text span>
            {localize.date(material.edited, "D.M.YYYY")}, {material.editor}
          </Text>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Same footer, reading the node from MaterialLoader context.
 */
export function MaterialMetaFooter() {
  const { material } = useMaterialContentContext();
  return <MaterialMetaFooterView material={material} />;
}
