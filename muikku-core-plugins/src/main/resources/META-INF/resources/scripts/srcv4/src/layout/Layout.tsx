import { AppShell } from "@mantine/core";
import { Outlet } from "react-router";
import { Navbar } from "./Navbar";

/**
 * Layout - Layout component
 */
export function Layout() {
  return (
    <AppShell header={{ height: 60 }} padding="md">
      <Navbar />
      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
