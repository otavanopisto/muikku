import { Avatar, Group, Image, Stack, Title } from "@mantine/core";
import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { workspaceInfoAtom } from "src/atoms/workspace";

/**
 * Workspace thumbnail + section title. Rendered once per grid column
 * so the header row height stays matched.
 */
export function SectionHeader(props: { sectionTitle: string }) {
  const info = useAtomValue(workspaceInfoAtom);
  const [coverFailed, setCoverFailed] = useState(false);

  useEffect(() => {
    setCoverFailed(false);
  }, [info?.id]);

  const title = info?.nameExtension
    ? `${info.name} (${info.nameExtension})`
    : (info?.name ?? "");
  const coverSrc = info
    ? `/rest/workspace/workspaces/${info.id}/workspacefile/workspace-frontpage-image-cropped`
    : "";
  const initials = info?.name.slice(0, 2) ?? "";

  return (
    <Stack gap="xs">
      {info?.name && (
        <Group gap="sm" wrap="nowrap">
          {coverFailed ? (
            <Avatar size={36} radius="sm" color="gray">
              {initials}
            </Avatar>
          ) : (
            <Image
              src={coverSrc}
              w={36}
              h={36}
              radius="sm"
              fit="cover"
              alt=""
              onError={() => setCoverFailed(true)}
            />
          )}
          <Title order={3} size="h4" fw={600} lineClamp={2}>
            {title}
          </Title>
        </Group>
      )}
      <Title order={1} size="h2">
        {props.sectionTitle}
      </Title>
    </Stack>
  );
}
