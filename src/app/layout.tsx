import React from "react";
import "./globals.css";

export const metadata = {
  title: "Mock My Draft",
  description: "Check out how previous NFL draft classes were graded",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
