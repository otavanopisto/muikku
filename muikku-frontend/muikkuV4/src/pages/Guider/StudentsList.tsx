import { useCallback } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import {
  Box,
  ScrollArea,
  Stack,
  Text,
  Loader,
  Center,
  TextInput,
  ActionIcon,
  Group,
} from "@mantine/core";
import { IconSearch, IconX } from "@tabler/icons-react";
import {
  guiderStudentsAsyncStateAtom,
  guiderStudentsDataAtom,
  guiderStudentsErrorAtom,
  guiderStudentsHasNextPageAtom,
  guiderStudentsIsFetchingNextPageAtom,
  guiderStudentsIsLoadingAtom,
  guiderStudentsQueryAtom,
  loadMoreGuiderStudentsAtom,
  refetchGuiderStudentsAtom,
} from "../../atoms/guider";
import { Link, useSearchParams } from "react-router";
import { AsyncState } from "src/components/AsyncState/AsyncState";
import { createAsyncError } from "src/utils/AtomHelpers";

/**
 * Students list props
 */
interface StudentsListProps {
  //onStudentSelect?: (student: FlaggedStudent) => void;
}

/**
 * StudentsList
 */
export default function StudentsList(_props: StudentsListProps) {
  const students = useAtomValue(guiderStudentsDataAtom);
  const hasNextPage = useAtomValue(guiderStudentsHasNextPageAtom);
  const isFetchingNextPage = useAtomValue(guiderStudentsIsFetchingNextPageAtom);
  const isLoading = useAtomValue(guiderStudentsIsLoadingAtom);
  const asyncState = useAtomValue(guiderStudentsAsyncStateAtom);
  const error = useAtomValue(guiderStudentsErrorAtom);
  const [query, setQuery] = useAtom(guiderStudentsQueryAtom);
  const loadMoreStudents = useSetAtom(loadMoreGuiderStudentsAtom);
  const refetch = useSetAtom(refetchGuiderStudentsAtom);
  const [searchParams, setSearchParams] = useSearchParams();

  /**
   * Load more students when scrolling near bottom
   */
  const handleBottomReachedScroll = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      loadMoreStudents();
    }
  }, [hasNextPage, isFetchingNextPage, loadMoreStudents]);

  /**
   * Handles query change
   * @param value - value
   */
  const handleQueryChange = (value: string) => {
    setQuery(value);
    // Update URL params
    const newSearchParams = new URLSearchParams(searchParams);
    if (value.trim()) {
      newSearchParams.set("q", value);
    } else {
      newSearchParams.delete("q");
    }
    setSearchParams(newSearchParams, { replace: true });
  };

  /**
   * Clears query
   */
  const clearQuery = () => {
    setQuery("");
    // Clear URL param
    const newSearchParams = new URLSearchParams(searchParams);
    newSearchParams.delete("q");
    setSearchParams(newSearchParams, { replace: true });
  };

  return (
    <AsyncState
      state={asyncState}
      error={createAsyncError(error) ?? undefined}
      onRetry={() => refetch()}
      showRetryButton
    >
      <Box h="100%" style={{ display: "flex", flexDirection: "column" }}>
        {/* Search Input */}
        <Box
          p="md"
          style={{ borderBottom: "1px solid var(--mantine-color-gray-3)" }}
        >
          <TextInput
            placeholder="Search students..."
            value={query}
            onChange={(event) => handleQueryChange(event.currentTarget.value)}
            leftSection={<IconSearch size={16} />}
            rightSection={
              query ? (
                <ActionIcon
                  size="sm"
                  variant="transparent"
                  onClick={clearQuery}
                >
                  <IconX size={14} />
                </ActionIcon>
              ) : null
            }
          />
        </Box>

        {/* Students List */}
        <ScrollArea
          h={300}
          type="auto"
          onBottomReached={handleBottomReachedScroll}
        >
          <Stack gap={0}>
            {isLoading ? (
              <Center py="xl">
                <Loader size="md" />
              </Center>
            ) : students.length === 0 ? (
              <Center py="xl">
                <Text c="dimmed">No students found</Text>
              </Center>
            ) : (
              students.map((student, index) => (
                <Box
                  key={student.id}
                  p="md"
                  style={{
                    cursor: "pointer",
                    borderBottom:
                      index < students.length - 1
                        ? "1px solid var(--mantine-color-gray-2)"
                        : "none",
                  }}
                  component={Link}
                  to={`/guider/${student.id}`}
                >
                  <Text size="sm">
                    {student.firstName} {student.lastName}
                  </Text>
                </Box>
              ))
            )}

            {/* Loading More Indicator */}
            {isFetchingNextPage && (
              <Center py="md">
                <Group gap="xs">
                  <Loader size="sm" />
                  <Text size="sm" c="dimmed">
                    Loading more students...
                  </Text>
                </Group>
              </Center>
            )}
          </Stack>
        </ScrollArea>
      </Box>
    </AsyncState>
  );
}
