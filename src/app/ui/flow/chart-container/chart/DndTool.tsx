"use client";

import { forwardRef, useImperativeHandle, useRef } from "react";

type Props = {
  startDrag: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
};
export default forwardRef<any, Props>(function DndTool(props, ref) {
  const { startDrag } = props;
  const containerRef = useRef<HTMLDivElement>(null);
  useImperativeHandle(ref, () => ({
    getContainer: () => containerRef.current,
  }));
  return (
    <div
      className="absolute left-0 top-0 z-10 cursor-pointer"
      ref={containerRef}
    >
      <div data-type="rect" className="dnd-rect" onMouseDown={startDrag}>
        Rect
      </div>
      <div data-type="circle" className="dnd-circle" onMouseDown={startDrag}>
        Circle
      </div>
    </div>
  );
});
