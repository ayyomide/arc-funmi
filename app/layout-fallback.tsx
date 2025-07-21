import type { Metadata } from "next";
import "./globals.css";
import { ClientProviders } from "@/components/providers/ClientProviders";
import { DeploymentDebug } from "@/components/debug/DeploymentDebug";

export const metadata: Metadata = {
  title: "Arcfunmi - Architecture & Engineering Hub",
  description: "Discover insights from architecture, engineering, and construction experts",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body 
        className="antialiased font-sans"
        suppressHydrationWarning={true}
      >
        <ClientProviders>
          {children}
          <DeploymentDebug />
        </ClientProviders>
      </body>
    </html>
  );
} 