import type { ReactNode } from "react";
import { Loader, Alert, Button, Stack } from "@mantine/core";
import type { AsyncState, AsyncStateError } from "src/types/AsyncState";

/**
 * AsyncStateProps - Async state props
 */
interface AsyncStateProps {
  state: AsyncState;
  error?: AsyncStateError;
  onRetry?: () => void;
  children: ReactNode;
  /**
   * Custom loading component
   * @default <Loader /> (Mantine Loader)
   */
  loadingComponent?: ReactNode;
  /**
   * Custom error component
   * @default <Alert /> (Mantine Alert)
   */
  errorComponent?: ReactNode;
  showErrorAlert?: boolean;
  showRetryButton?: boolean;
}

/**
 * AsyncState - Async state component
 */
export function AsyncState({
  state,
  error,
  onRetry,
  children,
  loadingComponent,
  errorComponent,
  showErrorAlert = true,
  showRetryButton = true,
}: AsyncStateProps) {
  if (state === "loading") {
    return <>{loadingComponent ?? <Loader />}</>;
  }

  if (state === "error") {
    if (errorComponent) {
      return <>{errorComponent}</>;
    }

    return (
      <Stack>
        {showErrorAlert && (
          <Alert color="red" title="Error loading data">
            {error?.message ?? "An error occurred"}
          </Alert>
        )}
        {showRetryButton && onRetry && <Button onClick={onRetry}>Retry</Button>}
      </Stack>
    );
  }

  return <>{children}</>;
}
