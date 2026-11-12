import { atom } from "jotai";
import { atomWithQuery } from "jotai-tanstack-query";
import { getUserApi } from "~/api";
import i18n from "~/src/locales/i18n";
import { handleApiError } from "./helpers/error";

const { t } = i18n;
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
  queryFn: async () => {
    try {
      const property = (await userApi.getUserProperty({
        key: "last-workspaces",
      })) as unknown;
      if (!isUserProperty(property)) {
        throw new Error(t("errors.notValidUserProperty", { ns: "user" }));
      }
      const parsed = JSON.parse(property.value) as unknown;
      if (
        !Array.isArray(parsed) ||
        !parsed.every(isWorkspaceMaterialReference)
      ) {
        throw new Error(t("errors.unrecognizedUserProperty", { ns: "user" }));
      }
      return parsed;
    } catch (err) {
      handleApiError(err, t("errors.loadUserProperty", { ns: "user" }));
    }
  },
  staleTime: Infinity,
}));

export const lastWorkspacesDataAtom = atom(
  (get) =>
    get(lastWorkspacesQueryAtom).data ??
    ([] as WorkspaceMaterialReferenceType[])
);
