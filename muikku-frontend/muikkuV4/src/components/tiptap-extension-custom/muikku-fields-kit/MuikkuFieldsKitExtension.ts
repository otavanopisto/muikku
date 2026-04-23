import { Extension } from "@tiptap/core";
import { createMuikkuPasteNameUniqPlugin } from "./helpers";
import { MuikkuTextFieldExtension } from "./muikku-textfield";
import { MuikkuMemoFieldExtension } from "./muikku-memofield";
import { MuikkuConnectFieldExtension } from "./muikku-connectfield";
import { MuikkuOrganizerFieldExtension } from "./muikku-organizerfield/MuikkuOrganizerFieldExtension";
import { MuikkuSorterFieldExtension } from "./muikku-sorterfield";
import { MuikkuJournalFieldExtension } from "./muikku-journalfield";
import { MuikkuAudioFieldExtension } from "./muikku-audiofield";
import { MuikkuSelectionFieldExtension } from "./muikku-selectfield";
import { MuikkuFileFieldExtension } from "./muikku-filefield";

type MuikkuFieldsKitOptions = {
  fields?: {
    text?: boolean;
    connect?: boolean;
    memo?: boolean;
    organizer?: boolean;
    sorter?: boolean;
    journal?: boolean;
    audio?: boolean;
    select?: boolean;
    file?: boolean;
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
        select: true,
        file: true,
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
    if (f.audio) extensions.push(MuikkuAudioFieldExtension);
    if (f.select) extensions.push(MuikkuSelectionFieldExtension);
    if (f.file) extensions.push(MuikkuFileFieldExtension);

    return extensions;
  },

  addProseMirrorPlugins() {
    return [createMuikkuPasteNameUniqPlugin()];
  },
});

export default MuikkuFieldsKit;
