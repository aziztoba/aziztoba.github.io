import type { Metadata } from "next";
import { ThemeProvider } from "../components/ThemeProvider";
import "./globals.css";
export const metadata: Metadata = {
  metadataBase: new URL("https://aziztoba.github.io"),
  title: "Abdulaziz Toba — AI Engineer",
  description:
    "Self-hosted LLM systems, agent workflows, inference engineering, and production C#/.NET services. Explore Abdulaziz Toba’s interactive portfolio.",
  openGraph: {
    title: "Abdulaziz Toba — AI Engineer",
    description: "AI systems. Production engineering.",
    url: "https://aziztoba.github.io",
    type: "website",
    images: ["/social.svg"],
  },
  icons: { icon: "/favicon.svg" },
};
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-theme="blackmoney" suppressHydrationWarning>
      <head>
        <link
          rel="preload"
          href="/fonts/IBMPlexMono-Regular.ttf"
          as="font"
          type="font/ttf"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
