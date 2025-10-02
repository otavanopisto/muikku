import { Button } from "@mantine/core";
import { ActionBar } from "~/src/components/ActionBar/ActionBar";
import { PageLayout } from "~/src/layout/PageLayout/PageLayout";

/**
 * Guider - Guider page
 */
export function GuiderStudent() {
  return (
    <PageLayout title="Ohjaamo">
      <ActionBar variant="primary">
        <Button>Uusi yhteydenotto</Button>
        <Button>Uusi tehtävä</Button>
        {/* List-specific actions */}
      </ActionBar>
    </PageLayout>
  );
}
