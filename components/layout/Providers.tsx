"use client";

import { ThemeProvider } from "next-themes";

/* Theme only. next-themes writes data-theme on <html> and injects a blocking
   script so a stored choice is applied before first paint (no flash).
   New visitors follow their system preference; an explicit choice persists. */
export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="data-theme"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  );
}
