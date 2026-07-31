import { atom } from "jotai";
import { atomWithQuery, atomWithInfiniteQuery } from "jotai-tanstack-query";
import type {
  Curriculum,
  EducationType,
  GetCoursepickerWorkspacesRequest,
  PublicityRestriction,
  Workspace,
  WorkspaceOrganization,
} from "~/generated/client";
import { getCoursepickerApi, isMApiError, isResponseError } from "~/api";
import { isAuthenticatedAtom } from "./auth";
import type {
  CoursepickerSearchView,
  MandatorityFilter,
} from "src/pages/Coursepicker/types";

const coursepickerApi = getCoursepickerApi();

/** Query atom for coursepicker education types */
export const coursepickerEducationTypesQueryAtom = atomWithQuery(() => ({
  queryKey: ["coursepicker", "educationTypes"],
  queryFn: async (): Promise<EducationType[]> => {
    try {
      return await coursepickerApi.getCoursepickerEducationTypes();
    } catch (err) {
      if (!isMApiError(err)) throw err;
      throw new Error("Failed to load coursepicker education types");
    }
  },
  staleTime: Infinity,
}));

/** Query atom for coursepicker curriculums */
export const coursepickerCurriculumsQueryAtom = atomWithQuery(() => ({
  queryKey: ["coursepicker", "curriculums"],
  queryFn: async (): Promise<Curriculum[]> => {
    try {
      return await coursepickerApi.getCoursepickerCurriculums();
    } catch (err) {
      if (!isMApiError(err)) throw err;
      throw new Error("Failed to load coursepicker curriculums");
    }
  },
  staleTime: Infinity,
}));

/** Query atom for coursepicker organizations */
export const coursepickerOrganizationsQueryAtom = atomWithQuery(() => ({
  queryKey: ["coursepicker", "organizations"],
  queryFn: async (): Promise<WorkspaceOrganization[]> => {
    try {
      return await coursepickerApi.getCoursepickerOrganizations();
    } catch (err) {
      if (!isMApiError(err)) throw err;
      throw new Error("Failed to load coursepicker organizations");
    }
  },
  staleTime: Infinity,
}));

/** True when all filter catalogs have settled successfully. */
export const coursepickerFilterCatalogsReadyAtom = atom((get) => {
  const educationTypes = get(coursepickerEducationTypesQueryAtom);
  const curriculums = get(coursepickerCurriculumsQueryAtom);
  const organizations = get(coursepickerOrganizationsQueryAtom);

  return (
    educationTypes.isSuccess && curriculums.isSuccess && organizations.isSuccess
  );
});

/** True while any catalog is still loading (first fetch). */
export const coursepickerFilterCatalogsLoadingAtom = atom((get) => {
  const educationTypes = get(coursepickerEducationTypesQueryAtom);
  const curriculums = get(coursepickerCurriculumsQueryAtom);
  const organizations = get(coursepickerOrganizationsQueryAtom);

  return (
    educationTypes.isPending || curriculums.isPending || organizations.isPending
  );
});

/** Error while fetching coursepicker filter catalogs */
export const coursepickerFilterCatalogsErrorAtom = atom((get) => {
  const educationTypes = get(coursepickerEducationTypesQueryAtom);
  const curriculums = get(coursepickerCurriculumsQueryAtom);
  const organizations = get(coursepickerOrganizationsQueryAtom);

  return (
    educationTypes.error ?? curriculums.error ?? organizations.error ?? null
  );
});

const MAX_WORKSPACES_PER_PAGE = 25;

/**
 * URL-synced filter snapshot used by the workspaces infinite query.
 * Page/hook writes this; query reads it. Not the source of truth for the URL.
 */
export interface CoursepickerWorkspaceFilters {
  view: CoursepickerSearchView;
  q: string;
  educationTypes: string[];
  curriculums: string[];
  organizations: string[];
  /** Kept for later client-side filtering; not sent to API. */
  mandatority: MandatorityFilter[];
}

/** URL-synced filter snapshot used by the workspaces infinite query. */
export const coursepickerWorkspaceFiltersAtom =
  atom<CoursepickerWorkspaceFilters>({
    view: "All",
    q: "",
    educationTypes: [],
    curriculums: [],
    organizations: [],
    mandatority: [],
  });

/**
 * Maps list view → getCoursepickerWorkspaces flags.
 * Returns null when this view should not hit the API yet.
 */
export function buildCoursepickerWorkspacesRequest(
  filters: CoursepickerWorkspaceFilters
): Omit<GetCoursepickerWorkspacesRequest, "firstResult" | "maxResults"> | null {
  const { view, q, educationTypes, curriculums, organizations } = filters;
  if (view === "All" || view === "Suggested") {
    // All: multi-section later. Suggested: no endpoint yet.
    return null;
  }
  let myWorkspaces = false;
  let publicity: PublicityRestriction = "ONLY_PUBLISHED";
  if (view === "MyCourses") {
    myWorkspaces = true;
  } else if (view === "Unpublished") {
    publicity = "ONLY_UNPUBLISHED";
  }
  return {
    q: q.trim() || undefined,
    educationTypes: educationTypes.length > 0 ? educationTypes : undefined,
    curriculums: curriculums.length > 0 ? curriculums : undefined,
    organizations: organizations.length > 0 ? organizations : undefined,
    myWorkspaces,
    publicity,
    templates: "ONLY_WORKSPACES",
    orderBy: ["alphabet"],
  };
}

// Infinite query atom for coursepicker workspaces
export const coursepickerWorkspacesInfiniteQueryAtom = atomWithInfiniteQuery(
  (get) => {
    const catalogsReady = get(coursepickerFilterCatalogsReadyAtom);
    const filters = get(coursepickerWorkspaceFiltersAtom);
    const isAuthenticated = get(isAuthenticatedAtom);
    const requestBase = buildCoursepickerWorkspacesRequest(filters);
    const canLoadMyCourses = filters.view !== "MyCourses" || isAuthenticated;
    const enabled = catalogsReady && requestBase != null && canLoadMyCourses;
    return {
      initialPageParam: 0,
      queryKey: ["coursepicker", "workspaces", filters.view, requestBase],
      queryFn: async ({ pageParam = 0 }) => {
        if (!requestBase) {
          return { data: [], hasMore: false, nextPage: undefined };
        }
        const firstResult = pageParam as number;
        const maxResults = MAX_WORKSPACES_PER_PAGE + 1;
        try {
          const workspaces =
            (await coursepickerApi.getCoursepickerWorkspaces({
              ...requestBase,
              firstResult,
              maxResults,
            })) ?? [];
          // Generated client types this as any[]; treat as Workspace[].
          const list = workspaces as Workspace[];
          const hasMore = list.length === MAX_WORKSPACES_PER_PAGE + 1;
          const data = hasMore ? list.slice(0, MAX_WORKSPACES_PER_PAGE) : list;
          return {
            data,
            hasMore,
            nextPage: hasMore
              ? firstResult + MAX_WORKSPACES_PER_PAGE
              : undefined,
          };
        } catch (err) {
          if (!isMApiError(err)) throw err;
          if (isResponseError(err)) {
            throw new Error(err.message);
          }
          throw new Error("Failed to load coursepicker workspaces");
        }
      },
      getNextPageParam: (lastPage) => lastPage.nextPage,
      enabled,
      staleTime: 5 * 60 * 1000,
      retry: false,
    };
  }
);

// Atom for coursepicker workspaces
export const coursepickerWorkspacesAtom = atom((get) =>
  get(coursepickerWorkspacesInfiniteQueryAtom)
);

// Atom for loading more coursepicker workspaces
export const loadMoreCoursepickerWorkspacesAtom = atom(null, (get) => {
  const query = get(coursepickerWorkspacesInfiniteQueryAtom);
  if (query.hasNextPage && !query.isFetchingNextPage) {
    void query.fetchNextPage();
  }
});
