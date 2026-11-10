export const CONTENT_PRODUCTION_KINDS = [
  "materials",
  "exams",
  "description",
  "help",
] as const;

export type ContentProductionKind = (typeof CONTENT_PRODUCTION_KINDS)[number];

export const CONTENT_PRODUCTION_KIND_LABEL: Record<
  ContentProductionKind,
  string
> = {
  materials: "Kurssin materiaalit",
  exams: "Kokeet",
  description: "Työtilan kuvaus",
  help: "Ohjeet",
};

export const CONTENT_PRODUCTION_CLOSE_LABEL: Record<
  ContentProductionKind,
  string
> = {
  materials: "Poistu materiaaleista",
  exams: "Poistu kokeista",
  description: "Poistu kuvauksesta",
  help: "Poistu ohjeista",
};

/**
 * Strip leading/trailing slashes.
 * @param path - Raw path or splat
 */
export function normalizeContentPath(path: string | undefined): string {
  return (path ?? "").replace(/^\/+|\/+$/g, "");
}

/**
 * Whether the segment is a content-production kind.
 * @param value - Route segment
 */
export function isContentProductionKind(
  value: string | undefined
): value is ContentProductionKind {
  return (
    value === "materials" ||
    value === "exams" ||
    value === "description" ||
    value === "help"
  );
}

/**
 * Content-production URL for a kind (and optional material path).
 * @param workspaceUrlName - Workspace urlName
 * @param kind - Content kind
 * @param path - Material path / splat
 */
export function contentProductionHref(
  workspaceUrlName: string,
  kind: ContentProductionKind,
  path = ""
): string {
  const base = `/workspace/${workspaceUrlName}/contentProduction/${kind}`;
  if (kind === "description") {
    return base;
  }
  const normalized = normalizeContentPath(path);
  return normalized ? `${base}/${normalized}` : base;
}

/**
 * Matching read-view URL for Luku näkymä.
 * @param workspaceUrlName - Workspace urlName
 * @param kind - Content kind currently being edited
 * @param path - Material path / splat
 */
export function contentProductionReadHref(
  workspaceUrlName: string,
  kind: ContentProductionKind,
  path = ""
): string {
  const normalized = normalizeContentPath(path);
  switch (kind) {
    case "materials": {
      const base = `/workspace/${workspaceUrlName}/workspaceMaterials`;
      return normalized ? `${base}/${normalized}` : base;
    }
    case "help":
      return `/workspace/${workspaceUrlName}/workspaceHelp`;
    default:
      return `/workspace/${workspaceUrlName}`;
  }
}
