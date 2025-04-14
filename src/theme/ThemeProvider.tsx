"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { ConfigProvider } from "antd";
import { getAntdTheme } from "./antd-theme";

// 主题上下文
type ThemeContextType = {
  isDarkMode: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDarkMode: false,
  toggleTheme: () => {},
});

// 主题提供者组件
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  // 初始主题设置为浏览器偏好
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 在客户端检测系统主题偏好
  useEffect(() => {
    // 检查本地存储中是否有保存的主题偏好
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      setIsDarkMode(savedTheme === "dark");
    } else {
      // 检查系统偏好
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      setIsDarkMode(prefersDark);
    }

    // 监听系统主题变化
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      if (localStorage.getItem("theme") === null) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // 切换主题
  const toggleTheme = () => {
    const newTheme = !isDarkMode;
    setIsDarkMode(newTheme);
    localStorage.setItem("theme", newTheme ? "dark" : "light");

    // 切换 HTML 的 dark 类
    if (newTheme) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  // 初始设置 HTML 的 dark 类
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDarkMode]);

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
      <ConfigProvider theme={getAntdTheme(isDarkMode)}>
        {children}
      </ConfigProvider>
    </ThemeContext.Provider>
  );
}

// 使用主题的钩子
export const useTheme = () => useContext(ThemeContext);
