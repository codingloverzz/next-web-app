"use client";
import React, { useEffect, useRef } from "react";
import { Graph, Node } from "@antv/x6";
import { Dnd } from "@antv/x6-plugin-dnd";

import { Button, message } from "antd";
import { FlowType } from "@/app/lib/types/flow";
import { updateFlowInfo } from "@/app/lib/server-action/flow";
import DndTool from "./DndTool";
import { redirect } from "next/navigation";

type DndToolType = {
  getContainer: () => HTMLDivElement;
};
export default function Chart({ flowInfo }: { flowInfo: FlowType }) {
  const ref = useRef<HTMLDivElement>(null);
  const dndRef = useRef<Dnd>();
  const dndContainerRef = useRef<DndToolType>(null);
  const graphRef = useRef<Graph>();
  useEffect(() => {
    const graph = new Graph({
      container: ref.current!,
      height: 500,
      width: 800,
      connecting: {
        snap: true,
      },
      panning: {
        enabled: true,
        modifiers: [],
        eventTypes: ["leftMouseDown"],
      },
      // 设置画布背景颜色
      background: {
        color: "#F2F7FA",
      },
    });
    graph.fromJSON(flowInfo.data as Object);
    graph.centerContent(); // 居中显示

    graphRef.current = graph;
    dndRef.current = new Dnd({
      target: graph,
      scaled: false,
      dndContainer: dndContainerRef.current!.getContainer(),
    });
    return () => {
      //为什么节点移动有问题，因为开发环境useEffect执行了两次
      graph.dispose();
    };

    // 渲染元素
  }, [flowInfo]);

  const handleSave = async () => {
    const newData = graphRef.current?.toJSON();
    const newFlowInfo = {
      ...flowInfo,
      data: JSON.stringify(newData),
    };
    await updateFlowInfo(flowInfo.id, newFlowInfo);
    message.success("save success !!!");
  };
  const startDrag = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.currentTarget;
    const type = target.getAttribute("data-type");
    const node =
      type === "rect"
        ? graphRef.current?.createNode({
            width: 100,
            height: 40,
            label: "Rect",
            attrs: {
              body: {
                stroke: "#8f8f8f",
                strokeWidth: 1,
                fill: "#fff",
                rx: 6,
                ry: 6,
              },
            },
          })
        : graphRef.current?.createNode({
            width: 60,
            height: 60,
            shape: "circle",
            label: "Circle",
            attrs: {
              body: {
                stroke: "#8f8f8f",
                strokeWidth: 1,
                fill: "#fff",
              },
            },
          });

    dndRef.current?.start(node!, e.nativeEvent as any);
  };
  return (
    <>
      <div className="flex justify-end mb-2">
        <Button onClick={handleSave}>save</Button>
      </div>
      <div className="relative">
        <DndTool ref={dndContainerRef} startDrag={startDrag} />
        <div id="container" className="h-[100%] w-[100%]" ref={ref}></div>
      </div>
    </>
  );
}
