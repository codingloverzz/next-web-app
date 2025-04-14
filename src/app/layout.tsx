import "@/app/ui/global.css";
import "@/app/style/reset.css";
import "highlight.js/styles/github.css";
import "bytemd/dist/index.css";

import { AntdRegistry } from "@ant-design/nextjs-registry";
import { ThemeProvider } from "@/theme/ThemeProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AntdRegistry>
          <ThemeProvider>{children}</ThemeProvider>
        </AntdRegistry>
      </body>
    </html>
  );
}
