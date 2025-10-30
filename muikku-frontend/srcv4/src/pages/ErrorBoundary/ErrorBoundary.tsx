import { Container, Paper, Text, Title } from "@mantine/core";
import { isRouteErrorResponse } from "react-router";
import { useRouteError } from "react-router";

/**
 * ErrorBoundaryPage
 * @returns React.ReactNode
 */
export function ErrorBoundary() {
  const error = useRouteError();

  /**
   * renderErrorMessage
   * @returns React.ReactNode
   */
  const renderErrorMessage = () => {
    let errorMessage = "Something went wrong";
    let errorStatus = null;

    if (isRouteErrorResponse(error)) {
      if (error.status === 404) {
        errorMessage = "This page doesn't exist!";
        errorStatus = error.status;
      }

      if (error.status === 401) {
        errorMessage = "You aren't authorized to see this";
        errorStatus = error.status;
      }

      if (error.status === 503) {
        errorMessage = "Looks like our API is down";
        errorStatus = error.status;
      }

      if (error.status === 418) {
        errorMessage = "🫖";
        errorStatus = error.status;
      }
    }

    return {
      errorMessage,
      errorStatus,
    };
  };

  const { errorMessage, errorStatus } = renderErrorMessage();

  return (
    <Container size="lg">
      <Paper p="xl" withBorder>
        <Title order={1} mb="md">
          {errorStatus ? `Error: ${errorStatus}` : "Error"}
        </Title>
        <Text mb="xl">{errorMessage}</Text>
      </Paper>
    </Container>
  );
}
