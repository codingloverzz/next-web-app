"use client";

import React from "react";
import { Button } from "antd";
import { useTheme } from "@/theme/ThemeProvider";

export default function ThemeToggle() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <Button
      onClick={toggleTheme}
      type="primary"
      style={{
        position: "fixed",
        bottom: "20px",
        right: "20px",
        zIndex: 999,
      }}
    >
      {isDarkMode ? "切换到亮色主题" : "切换到暗色主题"}
    </Button>
  );
}
