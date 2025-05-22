// import * as React from "react";
// import { Editor, Range } from "slate";
// import { useFocused, useSlate } from "slate-react";
// import { IconButton } from "~/components/general/button";
// import Portal from "~/components/general/portal";

// /**
//  * EditorHoveringToolbar
//  */
// interface EditorHoveringToolbarProps {}

// /**
//  * EditorHoveringToolbar
//  * @param props props
//  */
// function EditorHoveringToolbar(props: EditorHoveringToolbarProps) {
//   const ref = React.useRef<HTMLDivElement | null>();
//   const editor = useSlate();
//   const inFocus = useFocused();

//   React.useEffect(() => {
//     const el = ref.current;
//     const containerElement = document.getElementById("chat__body");
//     const { selection } = editor;

//     if (!el || !containerElement) {
//       return;
//     }

//     if (
//       !selection ||
//       !inFocus ||
//       Range.isCollapsed(selection) ||
//       Editor.string(editor, selection) === ""
//     ) {
//       el.style.opacity = "0";
//       el.style.bottom = "-10000px";
//       el.style.left = "-10000px";
//       return;
//     }
//     const domSelection = window.getSelection();
//     const domRange = domSelection.getRangeAt(0);
//     const rect = domRange.getBoundingClientRect();
//     const parentRect = containerElement.getBoundingClientRect();

//     el.style.opacity = "1";
//     el.style.bottom = `${parentRect.bottom - rect.top}px`;
//     el.style.left = `${
//       rect.left - parentRect.left - el.offsetWidth / 2 + rect.width / 2
//     }px`;
//     el.style.position = "absolute";
//   });

//   return (
//     <Portal localElementId="chat__body" isOpen>
//       <div
//         style={{
//           height: "0",
//           left: "0",
//           position: "fixed",
//           right: "0",
//           bottom: "0",
//           zIndex: "10000",
//         }}
//       >
//         <ToolbarMenu ref={ref}>
//           <IconButton icon="quote-left" />
//           <IconButton icon="minus" />
//           <IconButton icon="exclamation" />
//           <IconButton icon="link" />
//         </ToolbarMenu>
//       </div>
//     </Portal>
//   );
// }

// /**
//  * ToolbarMenuProps
//  */
// interface ToolbarMenuProps {
//   children: React.ReactNode;
// }

// /**
//  * ToolbarMenu
//  * @param props props
//  */
// const ToolbarMenu = React.forwardRef<HTMLDivElement, ToolbarMenuProps>(
//   (props, ref) => {
//     const { children } = props;

//     return (
//       <div
//         ref={ref}
//         style={{
//           position: "absolute",
//           zIndex: 1,
//           borderRadius: "4px",
//           opacity: 0,
//           backgroundColor: "white",
//           boxShadow: "0 0 5px 2px rgba(0,0,0,.1)",
//           transition: "opacity 0.3s",
//         }}
//       >
//         {children}
//       </div>
//     );
//   }
// );

// ToolbarMenu.displayName = "ToolbarMenu";

// export default EditorHoveringToolbar;
