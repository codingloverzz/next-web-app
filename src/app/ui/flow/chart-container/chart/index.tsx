"use client";
import React, { useEffect, useRef } from "react";
import { Graph, Node } from "@antv/x6";
import { Button, message } from "antd";
import { FlowType } from "@/app/lib/types/flow";
import { updateFlowInfo } from "@/app/lib/server-action/flow";

export default function Chart({ flowInfo }: { flowInfo: FlowType }) {
  const ref = useRef<HTMLDivElement>(null);
  const graphRef = useRef<Graph>();
  useEffect(() => {
    const graph = new Graph({
      container: ref.current!,
      width: 800,
      height: 600,
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
    graph.addNode({
      id: "953b18d6-7c1c-43cd-883f-00acca01bbc1",
      shape: "rect",
      x: 100,
      y: 40,
      width: 100,
      height: 40,
    });
    graph.addNode({
      id: "953b18d6-7c1c-43cd-883f-00acca01bbc0",

      shape: "rect",
      x: 200,
      y: 40,
      width: 100,
      height: 40,
    });
    graphRef.current = graph;
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
  return (
    <>
      <Button onClick={handleSave}>save</Button>
      <div id="container" ref={ref}></div>
    </>
  );
}
