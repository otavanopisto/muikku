import { NotebookNote } from "~/generated/client/models/NotebookNote";
import { NotebookNoteType } from "~/generated/client/models/NotebookNoteType";

/** Replace with real values from logged-in user / current workspace when wiring */
export const MOCK_NOTEBOOK_OWNER = "mock-user-id";
export const MOCK_WORKSPACE_ENTITY_ID = 77;

/** Aligns with materials/index.tsx mock pages */
export const MOCK_WORKSPACE_MATERIAL_IDS = {
  page3694: 3694,
  page3696: 3696,
} as const;

/**
 * Notebook notes covering all discriminator variants.
 * type must match swagger mapping exactly.
 */
export const MOCK_NOTEBOOK_NOTES: NotebookNote[] = [
  // ── WORKSPACE ─────────────────────────────────────────────
  {
    type: NotebookNoteType.Workspace,
    id: 1001,
    owner: MOCK_NOTEBOOK_OWNER,
    workspaceEntityId: MOCK_WORKSPACE_ENTITY_ID,
    title: "Kurssimuistiinpano",
    text: "<p>Yleinen muistiinpano koko kurssista.</p>",
  },
  {
    type: NotebookNoteType.Workspace,
    id: 1003,
    owner: MOCK_NOTEBOOK_OWNER,
    workspaceEntityId: MOCK_WORKSPACE_ENTITY_ID,
    title: "Kurssimuistiinpano 2",
    text: "<p>Toinen muistiinpano koko kurssista.</p>",
  },
  {
    type: NotebookNoteType.Workspace,
    id: 1004,
    owner: MOCK_NOTEBOOK_OWNER,
    workspaceEntityId: MOCK_WORKSPACE_ENTITY_ID,
    title: "Kurssimuistiinpano 3",
    text: "<p>Kolmas muistiinpano koko kurssista.</p>",
  },
  {
    type: NotebookNoteType.Workspace,
    id: 1005,
    owner: MOCK_NOTEBOOK_OWNER,
    workspaceEntityId: MOCK_WORKSPACE_ENTITY_ID,
    title: "Kurssimuistiinpano 4",
    text: "<p>Neljäs muistiinpano koko kurssista.</p>",
  },

  // ── WORKSPACE_MATERIAL ───────────────────────────────────
  {
    type: NotebookNoteType.WorkspaceMaterial,
    id: 1002,
    owner: MOCK_NOTEBOOK_OWNER,
    workspaceEntityId: MOCK_WORKSPACE_ENTITY_ID,
    workspaceMaterialId: MOCK_WORKSPACE_MATERIAL_IDS.page3694,
    title: "Luvun 1 muistiinpanot",
    text: "<p>Muistiinpano koko materiaalisivusta, ei valintaan sidottu.</p>",
  },

  // ── WORKSPACE_MATERIAL_CONTEXT_HIGHLIGHT (short rule) ─────
  {
    type: NotebookNoteType.WorkspaceMaterialContextHighlight,
    id: 2001,
    owner: MOCK_NOTEBOOK_OWNER,
    workspaceEntityId: MOCK_WORKSPACE_ENTITY_ID,
    workspaceMaterialId: MOCK_WORKSPACE_MATERIAL_IDS.page3696,
    text: "populaarikulttuuria",
    start: "populaarikulttuu",
    end: "ulaarikulttuuria",
    index: 0,
  },

  // ── WORKSPACE_MATERIAL_CONTEXT_HIGHLIGHT (long rule, index 0) ──
  {
    type: NotebookNoteType.WorkspaceMaterialContextHighlight,
    id: 2002,
    owner: MOCK_NOTEBOOK_OWNER,
    workspaceEntityId: MOCK_WORKSPACE_ENTITY_ID,
    workspaceMaterialId: MOCK_WORKSPACE_MATERIAL_IDS.page3694,
    text: "Laaja kulttuurikäsitys liittyy vahvasti yhteiskunnallisiin ja taloudellisiin kysymyksiin sekä erilaisiin kulttuurikäsityksiin.",
    start: "Laaja kulttuurikä",
    end: "aalikäsityksiin.",
    index: 0,
  },

  // ── WORKSPACE_MATERIAL_CONTEXT_HIGHLIGHT (orphaned – for classify UI) ──
  {
    type: NotebookNoteType.WorkspaceMaterialContextHighlight,
    id: 2003,
    owner: MOCK_NOTEBOOK_OWNER,
    workspaceEntityId: MOCK_WORKSPACE_ENTITY_ID,
    workspaceMaterialId: MOCK_WORKSPACE_MATERIAL_IDS.page3696,
    text: "kulttuurintutkimuksessa vanhentunut",
    start: "kulttuurintutkim",
    end: "rintutkimuksessa",
    index: 99, // index_out_of_range when resolved
  },

  // ── WORKSPACE_MATERIAL_CONTEXT_NOTE ───────────────────────
  {
    type: NotebookNoteType.WorkspaceMaterialContextNote,
    id: 3001,
    owner: MOCK_NOTEBOOK_OWNER,
    workspaceEntityId: MOCK_WORKSPACE_ENTITY_ID,
    workspaceMaterialId: MOCK_WORKSPACE_MATERIAL_IDS.page3694,
    title: "Kommentti kulttuurikäsityksestä",
    text: "<p>Tämä liittyy valittuun tekstikatkelmaan.</p>",
    start: "Sanomalehden ku",
    end: "ja elokuvia.",
    index: 0,
  },

  {
    type: NotebookNoteType.WorkspaceMaterialContextNote,
    id: 3002,
    owner: MOCK_NOTEBOOK_OWNER,
    workspaceEntityId: MOCK_WORKSPACE_ENTITY_ID,
    workspaceMaterialId: MOCK_WORKSPACE_MATERIAL_IDS.page3696,
    title: "Toinen esiintymä",
    text: "<p>Muistiinpano toisesta kohdasta samalla sivulla.</p>",
    start: "kulttuurintutkim",
    end: "rintutkimuksessa",
    index: 0,
  },
];
