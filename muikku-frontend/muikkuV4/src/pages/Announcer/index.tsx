import { Outlet } from "react-router";
import { PageLayout } from "src/layouts/PageLayout/PageLayout";

/**
 * Announcer - Announcer page
 */
export function Announcer() {
  return (
    <PageLayout>
      <Outlet />
    </PageLayout>
  );
}
