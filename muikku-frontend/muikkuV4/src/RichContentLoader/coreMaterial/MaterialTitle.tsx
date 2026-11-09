import { Title } from "@mantine/core";
import { useMaterialContentContext } from "./MaterialContentProvider";

/**
 * Shared material title
 */
export function MaterialTitle() {
  const { material } = useMaterialContentContext();

  if (!material.title) {
    return null;
  }

  return (
    <Title order={2} className="material-page__title">
      {material.title}
    </Title>
  );
}
