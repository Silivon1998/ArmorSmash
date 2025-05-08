import React from "react";
import { LayoutProps } from "@router/Layout";

export default function MainLayout({ children }: LayoutProps) {
  return (
    <div style={{ border: '3px solid green', padding: '10px' }}>
      <header>🌍 Global Header</header>
      {children}
    </div>
  );
}