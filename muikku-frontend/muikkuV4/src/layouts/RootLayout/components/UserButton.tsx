import {
  IconChevronRight,
  IconExternalLink,
  IconLogout,
  IconMail,
  IconRuler,
  IconSettings,
  IconUser,
} from "@tabler/icons-react";
import {
  Avatar,
  Menu,
  NavLink,
  SegmentedControl,
  Stack,
  Text,
  Tooltip,
  useComputedColorScheme,
  useMantineColorScheme,
} from "@mantine/core";
import { useAtom, useAtomValue } from "jotai";
import { userAtom } from "src/atoms/auth";
import { getUserImageUrl } from "src/utils/helpers";
import { navLinkClassNames } from "src/components/NavbarLink/navLinkClassnames";
import { Link } from "react-router";
import { brandIdAtom } from "~/src/atoms/theme";

/**
 * Props for the UserButton component.
 */
interface UserButtonProps {
  collapsed?: boolean;
}

const AVATAR_SIZE = 36;

/**
 * User footer for MainNav. Label/email always rendered; clipped when rail collapses.
 */
export function UserButton(props: UserButtonProps) {
  const { collapsed = false } = props;
  const user = useAtomValue(userAtom);

  const [brandId, setBrandId] = useAtom(brandIdAtom);
  const { setColorScheme } = useMantineColorScheme({ keepTransitions: true });
  const computed = useComputedColorScheme("dark");

  const displayName = user?.displayName ?? "Profile";
  const emails = user ? user.profile?.emails ?? [] : [];
  const email = emails[0];

  const avatar = user?.hasImage ? (
    <Avatar
      src={getUserImageUrl(user?.id ?? 0)}
      radius="xl"
      size={AVATAR_SIZE}
    />
  ) : (
    <Avatar radius="xl" size={AVATAR_SIZE}>
      <IconUser size={14} />
    </Avatar>
  );

  const leftSection = collapsed ? (
    <Tooltip label={<Text>{displayName}</Text>} position="right" withArrow>
      {avatar}
    </Tooltip>
  ) : (
    avatar
  );

  const rightSection = !collapsed ? (
    <IconChevronRight size={14} stroke={1.5} className="mantine-rotate-rtl" />
  ) : undefined;

  return (
    <Menu
      width={300}
      position="bottom-end"
      transitionProps={{ transition: "pop-bottom-right" }}
      shadow="md"
      offset={{
        mainAxis: 10,
        crossAxis: -10,
      }}
    >
      <Menu.Target>
        <NavLink
          leftSection={leftSection}
          m={0}
          label={displayName}
          description={email}
          rightSection={rightSection}
          classNames={navLinkClassNames}
        />
      </Menu.Target>
      <Menu.Dropdown>
        <Menu.Label>Teema</Menu.Label>
        <Stack gap="xs">
          <SegmentedControl
            size="xs"
            value={brandId}
            onChange={(v) => setBrandId(v)}
            data={[
              { label: "Mantine", value: "mantineDefault" },
              { label: "Muikku", value: "muikkuDefault" },
            ]}
          />
          <SegmentedControl
            size="xs"
            value={computed}
            onChange={(v) => setColorScheme(v)}
            data={[
              { label: "Light", value: "light" },
              { label: "Dark", value: "dark" },
            ]}
          />
        </Stack>

        <Menu.Divider />

        <Menu.Label>Linkit</Menu.Label>
        <Menu.Item
          leftSection={<IconMail size={14} />}
          component="a"
          href="mailto:helpdesk@muikkuverkko.fi"
        >
          Helpdesk
        </Menu.Item>
        <Menu.Item
          leftSection={<IconExternalLink size={14} />}
          component="a"
          href="https://opinvoimala.fi"
          target="_blank"
        >
          Opinvoimala.fi
        </Menu.Item>

        <Menu.Item
          leftSection={<IconExternalLink size={14} />}
          component="a"
          href="https://otavanopisto.muikkuverkko.fi/workspace/ohjeet/materials"
          target="_blank"
        >
          Muikun ohjeet
        </Menu.Item>

        <Menu.Divider />

        <Menu.Label>Työkalut</Menu.Label>
        <Menu.Item leftSection={<IconRuler size={14} />} component="button">
          Lukiviivain
        </Menu.Item>

        <Menu.Divider />
        <Menu.Label>Settings</Menu.Label>
        <Menu.Item
          component={Link}
          to="/profile"
          leftSection={<IconSettings size={16} stroke={1.5} />}
        >
          Omat tiedot
        </Menu.Item>
        <Menu.Item
          component={Link}
          to="/logout"
          leftSection={<IconLogout size={16} stroke={1.5} />}
        >
          Kirjaudu ulos
        </Menu.Item>
      </Menu.Dropdown>
    </Menu>
  );
}
