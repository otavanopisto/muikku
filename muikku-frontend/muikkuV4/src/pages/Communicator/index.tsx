import { Outlet } from "react-router";
import { PageLayout } from "src/layouts/PageLayout/PageLayout";

/**
 * Communicator - Communicator page
 */
export function Communicator() {
  return (
    <PageLayout>
      <Outlet />
    </PageLayout>
  );
}
