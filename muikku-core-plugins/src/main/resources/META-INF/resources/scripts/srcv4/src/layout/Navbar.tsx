import {
  AppShell,
  Group,
  Title,
  Button,
  Menu,
  Avatar,
  Text,
} from "@mantine/core";
import { Link, useLocation } from "react-router";
import { AuthService, type User } from "../services/auth";
import { userAtom } from "../atoms/auth";
import { langAtom, setLangAtom } from "../atoms/locale";
import { useAtomValue, useSetAtom } from "jotai";
import { languages } from "../shared/langs";

/**
 * NavItem - Interface for a navigation item
 */
interface NavItem {
  label: string;
  path: string;
  canAccess?: (user: User | null) => boolean;
}

// List of nav items
const navItems: NavItem[] = [
  { label: "Home", path: "/" },
  { label: "Coursepicker", path: "/coursepicker" },
  {
    label: "Announcements",
    path: "/announcements",
    canAccess: (user) => user?.loggedIn ?? false,
  },
  {
    label: "Announcer",
    path: "/announcer",
    canAccess: (user) =>
      (user?.permissions?.ANNOUNCER_TOOL ?? false) && (user?.loggedIn ?? false),
  },
  {
    label: "Communicator",
    path: "/communicator",
    canAccess: (user) => (user?.isActive ?? false) && (user?.loggedIn ?? false),
  },
];

/**
 * Navbar - Navbar component
 */
export function Navbar() {
  const location = useLocation();
  const user = useAtomValue(userAtom);
  const lang = useAtomValue(langAtom);
  const setLang = useSetAtom(setLangAtom);

  /**
   * Handle logout
   */
  const handleLogout = () => {
    AuthService.logout();
  };

  /**
   * Handle login
   */
  const handleLogin = () => {
    AuthService.login();
  };

  /**
   * Handle language change
   * @param newLang - New language code
   */
  const handleLanguageChange = async (newLang: "fi" | "en") => {
    await setLang(newLang);
  };

  // Get current language
  const currentLanguage = languages.find((l) => l.code === lang);

  // Filtered nav items based on user access.
  // Access is optional, so if it's not provided, the item is always visible.
  const visibleNavItems = navItems.filter(
    (item) => !item.canAccess || item.canAccess(user)
  );

  return (
    <AppShell.Header p="md">
      <Group justify="space-between" align="center" h="100%">
        <Title order={3} c="blue">
          React Jotai Test
        </Title>

        <Group gap="sm">
          {visibleNavItems.map((item) => (
            <Button
              key={item.path}
              component={Link}
              to={item.path}
              variant={location.pathname === item.path ? "filled" : "subtle"}
              size="sm"
            >
              {item.label}
            </Button>
          ))}

          {/* Language Picker */}
          <Menu shadow="md" width={150}>
            <Menu.Target>
              <Button variant="subtle" size="sm">
                <Group gap="xs">
                  {/* <IconLanguage size={16} /> */}
                  <Text size="sm">{currentLanguage?.label}</Text>
                </Group>
              </Button>
            </Menu.Target>
            <Menu.Dropdown>
              {languages.map((language) => (
                <Menu.Item
                  key={language.code}
                  onClick={() => void handleLanguageChange(language.code)}
                  fw={lang === language.code ? "bold" : "normal"}
                >
                  {language.label}
                </Menu.Item>
              ))}
            </Menu.Dropdown>
          </Menu>

          {user?.loggedIn ? (
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Button variant="subtle" size="sm">
                  <Group gap="xs">
                    <Avatar size="sm" color="blue">
                      {user.displayName?.charAt(0) ?? "?"}
                    </Avatar>
                    <Text size="sm">{user.displayName}</Text>
                  </Group>
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item onClick={handleLogout} color="red">
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          ) : (
            <Button variant="subtle" size="sm" onClick={handleLogin}>
              Login
            </Button>
          )}
        </Group>
      </Group>
    </AppShell.Header>
  );
}
