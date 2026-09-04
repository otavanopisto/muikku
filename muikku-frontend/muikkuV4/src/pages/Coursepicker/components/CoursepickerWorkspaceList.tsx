import { useCallback, useMemo } from "react";
import { Center, Group, Loader, ScrollArea, Text } from "@mantine/core";
import { useAtomValue, useSetAtom } from "jotai";
import {
  coursepickerWorkspacesAsyncStateAtom,
  coursepickerWorkspacesDataAtom,
  coursepickerWorkspacesErrorAtom,
  coursepickerWorkspacesHasNextPageAtom,
  coursepickerWorkspacesIsFetchingNextPageAtom,
  loadMoreCoursepickerWorkspacesAtom,
  refetchCoursepickerWorkspacesAtom,
} from "src/atoms/coursepicker";
import { AsyncState } from "src/components/AsyncState/AsyncState";
import { createAsyncError } from "src/utils/AtomHelpers";
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
  const workspaces = useAtomValue(coursepickerWorkspacesDataAtom);
  const hasNextPage = useAtomValue(coursepickerWorkspacesHasNextPageAtom);
  const isFetchingNextPage = useAtomValue(
    coursepickerWorkspacesIsFetchingNextPageAtom
  );
  const asyncState = useAtomValue(coursepickerWorkspacesAsyncStateAtom);
  const error = useAtomValue(coursepickerWorkspacesErrorAtom);
  const loadMore = useSetAtom(loadMoreCoursepickerWorkspacesAtom);
  const refetch = useSetAtom(refetchCoursepickerWorkspacesAtom);

  const items = useMemo(
    () =>
      workspaces.map((workspace) => mapWorkspaceToCourseItem(workspace, view)),
    [workspaces, view]
  );

  /**
   * Handles the bottom reached event
   */

  const handleBottomReached = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      loadMore();
    }
  }, [hasNextPage, isFetchingNextPage, loadMore]);
  return (
    <CoursepickerSection title={title} info={info}>
      <AsyncState
        state={asyncState}
        error={createAsyncError(error) ?? undefined}
        onRetry={() => refetch()}
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
                isFetchingNextPage ? (
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
