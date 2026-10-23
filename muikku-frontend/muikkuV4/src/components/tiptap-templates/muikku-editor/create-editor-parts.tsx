import { Fragment } from "react";
import type { AnyExtension } from "@tiptap/core";
import type { Editor } from "@tiptap/react";
import { StarterKit, type StarterKitOptions } from "@tiptap/starter-kit";
import {
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar";
import { PasteSanitizerExtension } from "@/components/tiptap-extension-custom/paste-sanitizer";
import { FEATURE_CATALOG, FEATURE_NAMES } from "./catalog";
import { isOn, optionsOf } from "./features";
import type {
  MuikkuEditorParts,
  ResolvedMuikkuEditorFeatures,
  ToolbarGroupId,
} from "./types";
import { MuikkuEditorToolbar } from "./muikku-editor-toolbar";
import { Spacer } from "../../tiptap-ui-primitive/spacer";

// Projects a resolved feature map into Tiptap parts.
//
// Two passes over FEATURE_NAMES:
// ------------------------------------------------------------
// 1. createStarterKitOptions — subtract/configure the StarterKit bundle
//    (bold, heading, lists, …). Result: StarterKit.configure(options).
//
// 2. createEditorParts loop — for each *enabled* feature, collect extra
//    extensions, toolbar items (by group), and bubble-menu renderers.
//
// Callers never pass Extension[] ; they pass features. The catalog is
// the only place that names TableKit, MarkButton, etc.
// ------------------------------------------------------------

const TOOLBAR_GROUP_ORDER: ToolbarGroupId[] = [
  "document",
  "history",
  "blocks",
  "lang",
  "marks",
  "script",
  "align",
  "indent",
  "direction",
  "insert",
  "boxes",
  "fields",
  "theme",
];

/**
 * StarterKit keys that this editor never uses (replaced or not offered yet).
 */
const STARTER_KIT_ALWAYS_OFF: Partial<StarterKitOptions> = {
  horizontalRule: false,
  link: false,
};

/**
 * Build StarterKit.configure(...) from the feature map.
 *
 * Always starts with STARTER_KIT_ALWAYS_OFF (link + HR: Muikku replaces
 * both). Then for each catalog row that has starterKitKeys:
 *
 * - feature off  → every listed key = false (not in the schema)
 * - feature on, no starterKit() → do nothing; StarterKit default stays
 *   Example: bold: true → Bold remains registered.
 * - feature on + starterKit() → merge that object
 *   Example: heading: { levels: [1,2,3,4] } → heading: { levels: [...] }
 *   Example: list: { types: ["bulletList"] } → orderedList: false
 *
 * Rows without starterKitKeys (table, math, themeToggle) are skipped.
 *
 * @param features - Resolved feature map (defaults already merged)
 */
function createStarterKitOptions(
  features: ResolvedMuikkuEditorFeatures
): Partial<StarterKitOptions> {
  // Default options for StarterKit.
  const options: Partial<StarterKitOptions> = { ...STARTER_KIT_ALWAYS_OFF };

  // Go through each feature in the feature map and create the StarterKit options.
  for (const name of FEATURE_NAMES) {
    // Get the catalog entry for the feature.
    // and value of the feature.
    const def = FEATURE_CATALOG[name];
    const value = features[name];

    // If the feature does not have starterKitKeys, skip it (isn't related to StarterKit).
    if (!def.starterKitKeys) {
      continue;
    }
    // If the feature is off, set all the starterKitKeys to false.
    if (!isOn(value)) {
      const disabled = options as Record<keyof StarterKitOptions, false>;
      for (const key of def.starterKitKeys) {
        disabled[key] = false;
      }
      continue;
    }
    // If the feature is on and has a starterKit function, merge the options.
    if (def.starterKit) {
      Object.assign(options, def.starterKit(optionsOf(value)));
    }
  }

  // Return the options related to StarterKit.
  return options;
}

/**
 * Build extensions, toolbar, and bubble menus for one editor instance.
 *
 * For each enabled feature in FEATURE_NAMES:
 * - def.extensions(options) are concatenated after StarterKit
 * - def.toolbar.render is bucketed into toolbarGroups[group]
 * - def.bubbleMenu is stored as a function; MuikkuEditor calls it with
 *   the live editor (menus cannot be created before useEditor)
 *
 * Toolbar groups not in TOOLBAR_GROUP_ORDER never render. Empty groups
 * are omitted so STUDENT_PLAIN does not leave stray separators.
 *
 * PasteSanitizer always runs.
 *
 * @param features - Resolved feature map
 */
export function createEditorParts(
  features: ResolvedMuikkuEditorFeatures
): MuikkuEditorParts {
  const extra: AnyExtension[] = [];
  const toolbarGroups = new Map<ToolbarGroupId, React.ReactNode[]>();
  const bubbleMenus: ((editor: Editor) => React.ReactNode)[] = [];

  // Go through each feature in the feature map and create the extensions, toolbar, and bubble menus.
  for (const name of FEATURE_NAMES) {
    // Get the catalog entry for the feature
    // and the value of the feature.
    const def = FEATURE_CATALOG[name];
    const value = features[name];

    // Off → no extra extensions, no tools, no menus (schema already
    // stripped in createStarterKitOptions when starterKitKeys exist).
    if (!isOn(value)) {
      continue;
    }
    const options = optionsOf(value);

    // If the feature has extensions, add them to the extra extensions.
    if (def.extensions) {
      extra.push(...def.extensions(options));
    }

    // If the feature has a toolbar, add it to the toolbar groups with the group name
    // and items rendered from def.toolbar.render(options).
    if (def.toolbar) {
      const items = toolbarGroups.get(def.toolbar.group) ?? [];
      items.push(<Fragment key={name}>{def.toolbar.render(options)}</Fragment>);
      toolbarGroups.set(def.toolbar.group, items);
    }

    // If the feature has a bubble menu, add it to the bubble menus with the name
    // and items rendered from def.bubbleMenu(editor, options).
    if (def.bubbleMenu) {
      const render = def.bubbleMenu;
      bubbleMenus.push((editor) => (
        <Fragment key={name}>{render(editor, options)}</Fragment>
      ));
    }
  }

  extra.push(PasteSanitizerExtension);

  // Only groups that received at least one control, in display order.
  const visibleGroups = TOOLBAR_GROUP_ORDER.filter((group) =>
    toolbarGroups.has(group)
  );

  const toolbar =
    visibleGroups.length === 0 ? null : (
      <MuikkuEditorToolbar>
        {visibleGroups.map((group, index) => (
          <Fragment key={group}>
            {group === "theme" ? (
              <Spacer />
            ) : index > 0 ? (
              <ToolbarSeparator />
            ) : null}
            <ToolbarGroup data-group={group}>
              {toolbarGroups.get(group)}
            </ToolbarGroup>
          </Fragment>
        ))}
      </MuikkuEditorToolbar>
    );

  return {
    extensions: [
      StarterKit.configure(createStarterKitOptions(features)),
      ...extra,
    ],
    toolbar,
    renderBubbleMenus: (editor) =>
      bubbleMenus.length === 0 ? null : (
        <>{bubbleMenus.map((render) => render(editor))}</>
      ),
  };
}
