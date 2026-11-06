import {
  DragDropProvider,
  KeyboardSensor,
  PointerSensor,
  type DragEndEvent,
} from "@dnd-kit/react";
import { PointerActivationConstraints } from "@dnd-kit/dom";
import type { ReactNode } from "react";

/**
 * Pointer + keyboard sensors shared by task fields that use drag and drop.
 */
function fieldSensors() {
  return [
    PointerSensor.configure({
      activationConstraints: (event: PointerEvent) => {
        if (event.pointerType === "touch" || event.pointerType === "pen") {
          return [
            new PointerActivationConstraints.Delay({
              value: 200,
              tolerance: 8,
            }),
          ];
        }
        return [new PointerActivationConstraints.Distance({ value: 8 })];
      },
    }),
    KeyboardSensor,
  ];
}

/**
 * DndFieldProviderProps
 */
interface DndFieldProviderProps {
  children: ReactNode;
  onDragEnd: (event: DragEndEvent) => void;
}

/**
 * Per-field drag context. Pointer needs 8px movement (or a short touch delay)
 * so a click is not a drag. Keyboard: Space/Enter pick up, arrows move, Escape cancel.
 * @param props - Provider props
 */
export function DndFieldProvider(props: DndFieldProviderProps) {
  const { children, onDragEnd } = props;

  return (
    <DragDropProvider sensors={fieldSensors} onDragEnd={onDragEnd}>
      {children}
    </DragDropProvider>
  );
}
