import { Button } from "@mantine/core";
import { useAtomValue } from "jotai";
import { currentStudentAtom } from "~/src/atoms/guider";
import { ActionBar } from "~/src/components/ActionBar/ActionBar";
import { AsyncState } from "~/src/components/AsyncState/AsyncState";
import { PageLayout } from "~/src/layout/PageLayout/PageLayout";

/**
 * Guider - Guider page
 */
export function GuiderStudent() {
  const studentState = useAtomValue(currentStudentAtom);

  return (
    <PageLayout title="Ohjaamo">
      <AsyncState
        state={studentState.state}
        error={studentState.error ?? undefined}
      >
        <ActionBar variant="primary">
          <Button>Uusi yhteydenotto</Button>
          <Button>Uusi tehtävä</Button>
          {/* List-specific actions */}
        </ActionBar>
      </AsyncState>
    </PageLayout>
  );
}
