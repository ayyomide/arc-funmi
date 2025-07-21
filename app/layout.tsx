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
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body 
        className="antialiased font-inter"
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
