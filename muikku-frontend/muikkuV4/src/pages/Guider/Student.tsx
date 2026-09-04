import { Button } from "@mantine/core";
import { useAtomValue, useSetAtom } from "jotai";
import { Outlet } from "react-router";
import {
  currentStudentAsyncStateAtom,
  currentStudentErrorAtom,
  refetchCurrentStudentAtom,
} from "src/atoms/guider";
import { ActionBar } from "src/components/ActionBar/ActionBar";
import { AsyncState } from "src/components/AsyncState/AsyncState";
import { PageLayout } from "src/layouts/PageLayout/PageLayout";
import { createAsyncError } from "src/utils/AtomHelpers";

/**
 * Guider student page
 */
export function GuiderStudent() {
  const asyncState = useAtomValue(currentStudentAsyncStateAtom);
  const error = useAtomValue(currentStudentErrorAtom);
  const refetch = useSetAtom(refetchCurrentStudentAtom);

  return (
    <PageLayout>
      <AsyncState
        state={asyncState}
        error={createAsyncError(error) ?? undefined}
        onRetry={() => refetch()}
        showRetryButton
      >
        <ActionBar variant="primary">
          <Button>Uusi yhteydenotto</Button>
          <Button>Uusi tehtävä</Button>
        </ActionBar>

        <Outlet />
      </AsyncState>
    </PageLayout>
  );
}
