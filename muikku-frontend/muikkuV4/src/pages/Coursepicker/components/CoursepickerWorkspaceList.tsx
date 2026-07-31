import { useCallback, useMemo } from "react";
import { Center, Group, Loader, ScrollArea, Text } from "@mantine/core";
import { useAtomValue, useSetAtom } from "jotai";
import {
  coursepickerWorkspacesAtom,
  loadMoreCoursepickerWorkspacesAtom,
} from "src/atoms/coursepicker";
import { AsyncState } from "src/components/AsyncState/AsyncState";
import {
  createAsyncError,
  parseAsyncStateFromQuery,
} from "src/utils/AtomHelpers";
import type { CoursepickerSearchView } from "../types";
import { mapWorkspaceToCourseItem } from "../utils/mapWorkspaceToCourseItem";
import { CourseListAccordion } from "./CourseListAccordion";
import { CoursepickerSection } from "./CoursepickerSection";

/** Props for the CoursepickerWorkspaceList component */
interface CoursepickerWorkspaceListProps {
  view: CoursepickerSearchView;
  title: string;
  info?: string;
}

/**
 * CoursepickerWorkspaceList component
 * @param props - Props for the CoursepickerWorkspaceList component
 */
export function CoursepickerWorkspaceList(
  props: CoursepickerWorkspaceListProps
) {
  const { view, title, info } = props;
  const workspacesQuery = useAtomValue(coursepickerWorkspacesAtom);
  const loadMore = useSetAtom(loadMoreCoursepickerWorkspacesAtom);

  const items = useMemo(() => {
    const workspaces =
      workspacesQuery.data?.pages.flatMap((page) => page.data) ?? [];
    return workspaces.map((workspace) =>
      mapWorkspaceToCourseItem(workspace, view)
    );
  }, [workspacesQuery.data, view]);

  /**
   * Handles the bottom reached event
   */
  const handleBottomReached = useCallback(() => {
    if (workspacesQuery.hasNextPage && !workspacesQuery.isFetchingNextPage) {
      loadMore();
    }
  }, [
    workspacesQuery.hasNextPage,
    workspacesQuery.isFetchingNextPage,
    loadMore,
  ]);

  return (
    <CoursepickerSection title={title} info={info}>
      <AsyncState
        state={parseAsyncStateFromQuery(workspacesQuery)}
        error={createAsyncError(workspacesQuery.error) ?? undefined}
        onRetry={() => void workspacesQuery.refetch()}
        showRetryButton
      >
        <ScrollArea
          h="calc(100vh - 220px)"
          type="auto"
          offsetScrollbars
          onBottomReached={handleBottomReached}
        >
          {items.length === 0 ? (
            <Text size="sm" c="dimmed">
              Ei kursseja.
            </Text>
          ) : (
            <CourseListAccordion
              items={items}
              footer={
                workspacesQuery.isFetchingNextPage ? (
                  <Center py="md">
                    <Group gap="xs">
                      <Loader size="sm" />
                      <Text size="sm" c="dimmed">
                        Ladataan lisää...
                      </Text>
                    </Group>
                  </Center>
                ) : null
              }
            />
          )}
        </ScrollArea>
      </AsyncState>
    </CoursepickerSection>
  );
}
