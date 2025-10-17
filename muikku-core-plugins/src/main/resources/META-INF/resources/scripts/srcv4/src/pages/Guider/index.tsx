import { Paper, Button } from "@mantine/core";
import { ActionBar } from "~/src/components/ActionBar/ActionBar";
import { PageLayout } from "~/src/layouts/PageLayout/PageLayout";
import StudentsList from "./StudentsList";

/**
 * Guider - Guider page
 */
export function Guider() {
  return (
    <PageLayout title="Ohjaamo">
      <ActionBar variant="primary">
        <Button>Uusi yhteydenotto</Button>
        <Button>Uusi tehtävä</Button>
        {/* List-specific actions */}
      </ActionBar>
      {/* <Paper p="xl" withBorder>
        <Text size="lg" c="dimmed" mb="lg">
          You are now in the guider area of the application.
        </Text>
        <Text mb="xl">This is where you can access guider features</Text>

        <Link to="/guider/PYRAMUS-STUDENT-XX">Testi studentti XX</Link>
        <Link to="/guider/PYRAMUS-STUDENT-102">Testi studentti</Link>
      </Paper> */}
      <Paper p="xl" withBorder>
        <StudentsList />
      </Paper>
    </PageLayout>
  );
}
