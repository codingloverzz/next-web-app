"use client";

import { useSyncExternalStore } from "react";

function subscribe(callback: any) {
  console.log(callback);

  window.addEventListener("online", callback);
  window.addEventListener("offline", callback);
  return () => {
    window.removeEventListener("online", callback);
    window.removeEventListener("offline", callback);
  };
}
function getSnapshot() {
  return navigator.onLine;
}
export default function Page() {
  const isOnline = useSyncExternalStore(subscribe, getSnapshot, () => true);

  return <div>{isOnline ? "在线" : "离线"}</div>;
}
