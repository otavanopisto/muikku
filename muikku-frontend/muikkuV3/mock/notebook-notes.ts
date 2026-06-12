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
    text: "<p>Nulla facilisi. Mauris nibh arcu, vehicula eu molestie in, tempor eu eros. Suspendisse at dolor dapibus ligula vehicula pellentesque. Nulla ac consectetur neque. Mauris ut finibus arcu. Nam vitae purus pharetra, pretium libero eu, scelerisque nibh. Duis aliquet ligula eu accumsan sodales. Nulla eu lacinia ante. Curabitur et porttitor neque. Pellentesque fringilla at orci eu sodales. In volutpat molestie ultrices. Morbi malesuada, massa ac vulputate lobortis, massa tellus tempor sem, nec tempus diam tellus a justo. Aliquam et venenatis sapien, a vehicula lacus. Suspendisse velit dui, mollis non erat id, tincidunt aliquet justo. Aliquam vitae arcu nisi. Nulla consequat, enim rutrum gravida rutrum, erat mauris lacinia sem, nec mattis ipsum tellus ut ex</p>",
  },
  {
    type: NotebookNoteType.Workspace,
    id: 1003,
    owner: MOCK_NOTEBOOK_OWNER,
    workspaceEntityId: MOCK_WORKSPACE_ENTITY_ID,
    title: "Kurssimuistiinpano 2",
    text: "<p>Pellentesque suscipit posuere nibh, eget pretium sapien congue quis. Proin at ligula vitae dui aliquam rhoncus eget et urna. Pellentesque dignissim, arcu sit amet dictum sagittis, dolor nibh pretium sem, vel placerat odio nibh sed massa. Curabitur aliquet porttitor turpis, id molestie erat. Ut id lacinia lorem. Sed luctus tempus quam sed venenatis. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; In nisl turpis, facilisis a lobortis vel, mollis nec lectus.</p>",
  },
  {
    type: NotebookNoteType.Workspace,
    id: 1004,
    owner: MOCK_NOTEBOOK_OWNER,
    workspaceEntityId: MOCK_WORKSPACE_ENTITY_ID,
    title: "Kurssimuistiinpano 3",
    text: "<p> Curabitur velit leo, scelerisque sit amet ornare id, porta at dui. Interdum et malesuada fames ac ante ipsum primis in faucibus. Maecenas mollis mauris sed nibh gravida laoreet.</p>",
  },
  {
    type: NotebookNoteType.Workspace,
    id: 1005,
    owner: MOCK_NOTEBOOK_OWNER,
    workspaceEntityId: MOCK_WORKSPACE_ENTITY_ID,
    title: "Kurssimuistiinpano 4",
    text: "<p> Morbi a viverra eros. Quisque et feugiat nunc. Interdum et malesuada fames ac ante ipsum primis in faucibus. In pulvinar vehicula quam eget finibus. Cras eget enim id nunc hendrerit consequat et ac nisi. Nunc vel libero eu mauris gravida vestibulum a ac tellus. Sed dapibus rutrum nisl a rhoncus.</p>",
  },

  // ── WORKSPACE_MATERIAL ───────────────────────────────────
  {
    type: NotebookNoteType.WorkspaceMaterial,
    id: 1002,
    owner: MOCK_NOTEBOOK_OWNER,
    workspaceEntityId: MOCK_WORKSPACE_ENTITY_ID,
    workspaceMaterialId: MOCK_WORKSPACE_MATERIAL_IDS.page3694,
    title: "Luvun 1 muistiinpanot",
    text: "<p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque tempus euismod ligula ac facilisis. Donec consequat mi lacus, vel pharetra ex scelerisque quis. Phasellus malesuada, ante nec cursus rhoncus, tortor tortor cursus ex, nec aliquet leo diam vel quam. Duis rutrum vestibulum nulla. Morbi a viverra eros. Quisque et feugiat nunc. Interdum et malesuada fames ac ante ipsum primis in faucibus. In pulvinar vehicula quam eget finibus. Cras eget enim id nunc hendrerit consequat et ac nisi. Nunc vel libero eu mauris gravida vestibulum a ac tellus. Sed dapibus rutrum nisl a rhoncus. Nulla eu felis interdum purus egestas ornare a sollicitudin nunc. Nullam pharetra magna convallis purus dignissim condimentum.</p>",
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
    text: "<p>Ut pharetra nulla in lorem sagittis, sit amet mollis turpis elementum. Proin bibendum cursus elementum. Aenean vel tortor viverra, rutrum lorem ut, aliquet velit. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Integer accumsan elit eu rutrum vestibulum. Cras quis dictum nibh. Nunc consectetur metus vitae enim lobortis, nec maximus arcu blandit. Duis eget magna diam. Nulla convallis dapibus lectus, vitae dictum arcu vestibulum id. Aenean vitae arcu ligula. Ut nec tincidunt erat, ac viverra lorem.</p>",
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
    text: "<p>Suspendisse dapibus odio ac neque mattis malesuada. Phasellus ut tincidunt lacus. In hac habitasse platea dictumst. Nunc facilisis massa condimentum ex mattis, eu malesuada nisl venenatis. Donec viverra sapien sem, nec gravida elit imperdiet vel. Nulla venenatis nisl risus, vel sodales nulla tincidunt vitae. Curabitur velit leo, scelerisque sit amet ornare id, porta at dui. Interdum et malesuada fames ac ante ipsum primis in faucibus. Maecenas mollis mauris sed nibh gravida laoreet. In hac habitasse platea dictumst. Nulla facilisi. Suspendisse aliquet eleifend erat at porta. Morbi mauris metus, accumsan sed efficitur tincidunt, dignissim quis dolor. Nam mollis, augue quis finibus ornare, augue elit auctor dui, eget venenatis eros nulla vel purus.</p>",
    start: "kulttuurintutkim",
    end: "rintutkimuksessa",
    index: 0,
  },
];
