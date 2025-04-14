import { ThemeConfig } from "antd";

// 将HSL格式转换为rgba
const hslToRgba = (variableName: string): string => {
  return `rgba(var(${variableName}) / <alpha-value>)`;
};

export const lightTheme: ThemeConfig = {
  token: {
    // 主色
    colorPrimary: "hsl(var(--primary))",
    colorPrimaryBg: "hsl(var(--primary) / 0.1)",
    colorPrimaryBgHover: "hsl(var(--primary) / 0.2)",
    colorPrimaryBorder: "hsl(var(--primary) / 0.3)",
    colorPrimaryText: "hsl(var(--primary-foreground))",
    colorPrimaryTextHover: "hsl(var(--primary-foreground) / 0.9)",
    colorPrimaryTextActive: "hsl(var(--primary-foreground) / 0.8)",

    // 成功色
    colorSuccess: "hsl(var(--chart-2))",
    colorSuccessBg: "hsl(var(--chart-2) / 0.1)",
    colorSuccessBorder: "hsl(var(--chart-2) / 0.3)",

    // 警告色
    colorWarning: "hsl(var(--chart-4))",
    colorWarningBg: "hsl(var(--chart-4) / 0.1)",
    colorWarningBorder: "hsl(var(--chart-4) / 0.3)",

    // 错误色
    colorError: "hsl(var(--destructive))",
    colorErrorBg: "hsl(var(--destructive) / 0.1)",
    colorErrorBorder: "hsl(var(--destructive) / 0.3)",

    // 中性色
    colorText: "hsl(var(--foreground))",
    colorTextSecondary: "hsl(var(--muted-foreground))",
    colorTextTertiary: "hsl(var(--muted-foreground) / 0.7)",
    colorTextQuaternary: "hsl(var(--muted-foreground) / 0.5)",

    // 边框色
    colorBorder: "hsl(var(--border))",
    colorBorderSecondary: "hsl(var(--input))",

    // 背景色
    colorBgContainer: "hsl(var(--background))",
    colorBgElevated: "hsl(var(--card))",
    colorBgLayout: "hsl(var(--muted))",
    colorBgSpotlight: "hsl(var(--accent))",

    // 填充色
    colorFill: "hsl(var(--accent))",
    colorFillSecondary: "hsl(var(--secondary))",
    colorFillTertiary: "hsl(var(--muted))",
    colorFillQuaternary: "hsl(var(--muted) / 0.5)",

    // 圆角
    borderRadius: 8,
  },
  components: {
    Button: {
      colorPrimary: "hsl(var(--primary))",
      colorPrimaryHover: "hsl(var(--primary) / 0.9)",
      colorPrimaryActive: "hsl(var(--primary) / 0.8)",
    },
    Input: {
      colorBgContainer: "hsl(var(--background))",
      colorBorder: "hsl(var(--input))",
    },
    Select: {
      colorBgContainer: "hsl(var(--background))",
      colorBorder: "hsl(var(--input))",
    },
    Menu: {
      colorItemBg: "hsl(var(--background))",
      colorItemText: "hsl(var(--foreground))",
      colorItemTextSelected: "hsl(var(--primary))",
      colorItemBgSelected: "hsl(var(--primary) / 0.1)",
    },
  },
};

export const darkTheme: ThemeConfig = {
  token: {
    // 主色
    colorPrimary: "hsl(var(--primary))",
    colorPrimaryBg: "hsl(var(--primary) / 0.1)",
    colorPrimaryBgHover: "hsl(var(--primary) / 0.2)",
    colorPrimaryBorder: "hsl(var(--primary) / 0.3)",
    colorPrimaryText: "hsl(var(--primary-foreground))",
    colorPrimaryTextHover: "hsl(var(--primary-foreground) / 0.9)",
    colorPrimaryTextActive: "hsl(var(--primary-foreground) / 0.8)",

    // 成功色
    colorSuccess: "hsl(var(--chart-2))",
    colorSuccessBg: "hsl(var(--chart-2) / 0.1)",
    colorSuccessBorder: "hsl(var(--chart-2) / 0.3)",

    // 警告色
    colorWarning: "hsl(var(--chart-4))",
    colorWarningBg: "hsl(var(--chart-4) / 0.1)",
    colorWarningBorder: "hsl(var(--chart-4) / 0.3)",

    // 错误色
    colorError: "hsl(var(--destructive))",
    colorErrorBg: "hsl(var(--destructive) / 0.1)",
    colorErrorBorder: "hsl(var(--destructive) / 0.3)",

    // 中性色
    colorText: "hsl(var(--foreground))",
    colorTextSecondary: "hsl(var(--muted-foreground))",
    colorTextTertiary: "hsl(var(--muted-foreground) / 0.7)",
    colorTextQuaternary: "hsl(var(--muted-foreground) / 0.5)",

    // 边框色
    colorBorder: "hsl(var(--border))",
    colorBorderSecondary: "hsl(var(--input))",

    // 背景色
    colorBgContainer: "hsl(var(--background))",
    colorBgElevated: "hsl(var(--card))",
    colorBgLayout: "hsl(var(--muted))",
    colorBgSpotlight: "hsl(var(--accent))",

    // 填充色
    colorFill: "hsl(var(--accent))",
    colorFillSecondary: "hsl(var(--secondary))",
    colorFillTertiary: "hsl(var(--muted))",
    colorFillQuaternary: "hsl(var(--muted) / 0.5)",

    // 圆角
    borderRadius: 8,
  },
  components: {
    Button: {
      colorPrimary: "hsl(var(--primary))",
      colorPrimaryHover: "hsl(var(--primary) / 0.9)",
      colorPrimaryActive: "hsl(var(--primary) / 0.8)",
    },
    Input: {
      colorBgContainer: "hsl(var(--background))",
      colorBorder: "hsl(var(--input))",
    },
    Select: {
      colorBgContainer: "hsl(var(--background))",
      colorBorder: "hsl(var(--input))",
    },
    Menu: {
      colorItemBg: "hsl(var(--background))",
      colorItemText: "hsl(var(--foreground))",
      colorItemTextSelected: "hsl(var(--primary))",
      colorItemBgSelected: "hsl(var(--primary) / 0.1)",
    },
  },
};

export function getAntdTheme(isDarkMode: boolean): ThemeConfig {
  return isDarkMode ? darkTheme : lightTheme;
}
