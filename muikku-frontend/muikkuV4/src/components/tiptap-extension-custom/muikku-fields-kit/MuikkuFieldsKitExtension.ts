import { Extension } from "@tiptap/core";
import { createMuikkuPasteNameUniqPlugin } from "./helpers";
import { MuikkuTextFieldExtension } from "./muikku-textfield";
import { MuikkuMemoFieldExtension } from "./muikku-memofield";
import { MuikkuConnectFieldExtension } from "./muikku-connectfield";
import { MuikkuOrganizerFieldExtension } from "./muikku-organizerfield/MuikkuOrganizerFieldExtension";
import { MuikkuSorterFieldExtension } from "./muikku-sorterfield";
import { MuikkuJournalFieldExtension } from "./muikku-journalfield";

type MuikkuFieldsKitOptions = {
  fields?: {
    text?: boolean;
    connect?: boolean;
    memo?: boolean;
    organizer?: boolean;
    sorter?: boolean;
    journal?: boolean;
    audio?: boolean;
  };
};

/**
 * MuikkuFieldsKit is the extension for the Muikku fields kit.
 * @param options - The options for the Muikku fields kit.
 * @returns The Muikku fields kit extension.
 */
export const MuikkuFieldsKit = Extension.create<MuikkuFieldsKitOptions>({
  name: "muikkuFieldsKit",

  addOptions() {
    return {
      fields: {
        text: true,
        connect: true,
        memo: true,
        organizer: true,
        sorter: true,
        journal: true,
        audio: true,
      },
    };
  },

  addExtensions() {
    const f = this.options.fields ?? {};

    const extensions = [];
    if (f.text) extensions.push(MuikkuTextFieldExtension);
    if (f.memo) extensions.push(MuikkuMemoFieldExtension);
    if (f.connect) extensions.push(MuikkuConnectFieldExtension);
    if (f.organizer) extensions.push(MuikkuOrganizerFieldExtension);
    if (f.sorter) extensions.push(MuikkuSorterFieldExtension);
    if (f.journal) extensions.push(MuikkuJournalFieldExtension);

    return extensions;
  },

  addProseMirrorPlugins() {
    return [createMuikkuPasteNameUniqPlugin()];
  },
});

export default MuikkuFieldsKit;
