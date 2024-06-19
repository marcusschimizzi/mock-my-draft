import React, { ReactNode } from "react";
import { AppProvider } from "@/providers/app";
import "./globals.css";
import { PublicLayout } from "@/layouts/public-layout";

export const metadata = {
  title: "Mock My Draft",
  description: "Check out how previous NFL draft classes were graded",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppProvider>
          <PublicLayout>{children}</PublicLayout>
        </AppProvider>
      </body>
    </html>
  );
}
