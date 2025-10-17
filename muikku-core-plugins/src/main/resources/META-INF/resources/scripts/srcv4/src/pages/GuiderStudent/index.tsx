import { Button } from "@mantine/core";
import { useAtomValue } from "jotai";
import { currentStudentAtom } from "~/src/atoms/guider";
import { ActionBar } from "~/src/components/ActionBar/ActionBar";
import { AsyncState } from "~/src/components/AsyncState/AsyncState";
import { PageLayout } from "~/src/layouts/PageLayout/PageLayout";
import {
  createAsyncError,
  parseAsyncStateFromQuery,
} from "~/src/utils/AtomHelpers";

/**
 * Guider - Guider page
 */
export function GuiderStudent() {
  const studentState = useAtomValue(currentStudentAtom);

  return (
    <PageLayout title="Ohjaamo">
      <AsyncState
        state={parseAsyncStateFromQuery(studentState)}
        error={createAsyncError(studentState.error) ?? undefined}
        onRetry={() => void studentState.refetch()}
        showRetryButton
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
