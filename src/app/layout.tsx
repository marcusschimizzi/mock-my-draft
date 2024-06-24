import React, { ReactNode } from "react";
import { AppProvider } from "@/providers/app";
import "./globals.css";
import { PublicLayout } from "@/layouts/public-layout";
import { ColorModeScript } from "@chakra-ui/react";
import { theme } from "@/config/theme";
import { Viewport } from "next";

export const metadata = {
  title: "Mock My Draft",
  description: "Check out how previous NFL draft classes were graded",
};

export const viewport: Viewport = {
  initialScale: 1,
  maximumScale: 1,
  width: "device-width",
  themeColor: "#000000",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ColorModeScript initialColorMode={theme.config.initialColorMode} />
        <AppProvider>
          <PublicLayout>{children}</PublicLayout>
        </AppProvider>
      </body>
    </html>
  );
}
