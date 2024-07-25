"use client";
import React, { useEffect, useRef } from "react";
import { Graph, Node } from "@antv/x6";
// import { register } from "@antv/x6-react-shape";
const data = {
  nodes: [
    {
      //   id: "123123",
      shape: "circle",
      x: 40,
      y: 40,
      width: 100,
      height: 40,
      label: "hello",
      attrs: {
        // body 是选择器名称，选中的是 rect 元素
        body: {
          stroke: "#8f8f8f",
          strokeWidth: 1,
          fill: "#fff",
          rx: 6,
          ry: 6,
        },
      },
    },
    {
      //   id: "node2",
      shape: "rect",
      x: 160,
      y: 180,
      width: 100,
      height: 40,
      label: "world",
      attrs: {
        body: {
          stroke: "#8f8f8f",
          strokeWidth: 1,
          fill: "#fff",
          rx: 6,
          ry: 6,
        },
      },
    },
  ],
  //   edges: [
  //     {
  //       shape: "edge",
  //       source: "node1",
  //       target: "node2",
  //       label: "x6",
  //       attrs: {
  //         // line 是选择器名称，选中的边的 path 元素
  //         line: {
  //           stroke: "#8f8f8f",
  //           strokeWidth: 1,
  //         },
  //       },
  //     },
  //   ],
};

export default function Chart() {
  const ref = useRef<HTMLDivElement>(null);

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
    graph.fromJSON(data);
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

    console.log(graph.toJSON(), "graph.toJSON()");

    // 渲染元素
  }, []);

  return <div id="container" ref={ref}></div>;
}
