import { Fragment } from "react";
import type { AnyExtension } from "@tiptap/core";
import type { Editor } from "@tiptap/react";
import { StarterKit, type StarterKitOptions } from "@tiptap/starter-kit";
import {
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar";
import { PasteSanitizerExtension } from "@/components/tiptap-extension-custom/paste-sanitizer";
import { CharAndWordLimitExtension } from "@/components/tiptap-extension-custom/char-and-word-limit";
import { FEATURE_CATALOG, FEATURE_NAMES } from "./catalog";
import { isOn, optionsOf } from "./features";
import type {
  MuikkuEditorCharacterCount,
  MuikkuEditorParts,
  ResolvedMuikkuEditorFeatures,
  ToolbarGroupId,
} from "./types";
import { MuikkuEditorToolbar } from "./muikku-editor-toolbar";
import { Spacer } from "../../tiptap-ui-primitive/spacer";

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
 * Build StarterKit options from enabled/disabled catalog rows.
 * @param features - Resolved feature map
 */
function createStarterKitOptions(
  features: ResolvedMuikkuEditorFeatures
): Partial<StarterKitOptions> {
  const options: Partial<StarterKitOptions> = { ...STARTER_KIT_ALWAYS_OFF };

  for (const name of FEATURE_NAMES) {
    const def = FEATURE_CATALOG[name];
    const value = features[name];
    if (!def.starterKitKeys) {
      continue;
    }
    if (!isOn(value)) {
      const disabled = options as Record<keyof StarterKitOptions, false>;
      for (const key of def.starterKitKeys) {
        disabled[key] = false;
      }
      continue;
    }
    if (def.starterKit) {
      Object.assign(options, def.starterKit(optionsOf(value)));
    }
  }

  return options;
}

/**
 * Project resolved features into extensions, toolbar, and bubble menus.
 * @param features - Resolved feature map
 * @param characterCount - Optional instance limits
 */
export function createEditorParts(
  features: ResolvedMuikkuEditorFeatures,
  characterCount?: MuikkuEditorCharacterCount
): MuikkuEditorParts {
  const extra: AnyExtension[] = [];
  const toolbarGroups = new Map<ToolbarGroupId, React.ReactNode[]>();
  const bubbleMenus: ((editor: Editor) => React.ReactNode)[] = [];

  for (const name of FEATURE_NAMES) {
    const def = FEATURE_CATALOG[name];
    const value = features[name];
    if (!isOn(value)) {
      continue;
    }
    const options = optionsOf(value);
    if (def.extensions) {
      extra.push(...def.extensions(options));
    }
    if (def.toolbar) {
      const items = toolbarGroups.get(def.toolbar.group) ?? [];
      items.push(<Fragment key={name}>{def.toolbar.render(options)}</Fragment>);
      toolbarGroups.set(def.toolbar.group, items);
    }
    if (def.bubbleMenu) {
      const render = def.bubbleMenu;
      bubbleMenus.push((editor) => (
        <Fragment key={name}>{render(editor, options)}</Fragment>
      ));
    }
  }

  extra.push(PasteSanitizerExtension);

  if (characterCount) {
    extra.push(
      CharAndWordLimitExtension.configure({
        limit: characterCount.wordLimit ?? null,
        characterCount: {
          limit: characterCount.characterLimit ?? null,
          mode: "textSize",
          ...(characterCount.textCounter
            ? { textCounter: characterCount.textCounter }
            : {}),
          ...(characterCount.wordCounter
            ? { wordCounter: characterCount.wordCounter }
            : {}),
        },
      })
    );
  }

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
