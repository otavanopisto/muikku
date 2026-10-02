import { atomWithQuery } from "jotai-tanstack-query";
import { getUserApi, isMApiError, isResponseError } from "~/api";

const userApi = getUserApi();

/**
 * WorkspaceMaterialReferenceType
 */
export interface WorkspaceMaterialReferenceType {
  workspaceName: string;
  workspaceId: number;
  materialName: string;
  url: string;
}

const isUserProperty = (property: unknown): property is { value: string } =>
  typeof property === "object" &&
  property !== null &&
  "value" in property &&
  typeof property.value === "string";

const isWorkspaceMaterialReference = (
  value: unknown
): value is WorkspaceMaterialReferenceType =>
  typeof value === "object" &&
  value !== null &&
  "workspaceName" in value &&
  typeof value.workspaceName === "string" &&
  "workspaceId" in value &&
  typeof value.workspaceId === "number" &&
  "materialName" in value &&
  typeof value.materialName === "string" &&
  "url" in value &&
  typeof value.url === "string";

/** Query atom for user last workspaces */
export const lastWorkspacesQueryAtom = atomWithQuery(() => ({
  queryKey: ["lastWorkspaces"],
  queryFn: async (): Promise<WorkspaceMaterialReferenceType[]> => {
    try {
      const property = (await userApi.getUserProperty({
        key: "last-workspaces",
      })) as unknown;
      if (!isUserProperty(property)) {
        throw new Error("Failed to load user property");
      }
      const parsed = JSON.parse(property.value) as unknown;
      if (
        !Array.isArray(parsed) ||
        !parsed.every(isWorkspaceMaterialReference)
      ) {
        throw new Error("Failed to load user property");
      }
      return parsed;
    } catch (err) {
      if (!isMApiError(err)) throw err;
      throw new Error("Failed to load user property");
    }
  },
  staleTime: Infinity,
}));
