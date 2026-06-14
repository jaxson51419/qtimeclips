import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "QTimeClips",
  description: "90-second video clips social app",
  manifest: "/manifest.json",
  themeColor: "#FF6B6B",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "QTimeClips",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="QTimeClips" />
        <meta name="theme-color" content="#FF6B6B" />
      </head>
      <body style={{ margin: 0, padding: 0, background: "#0A0A0F" }}>{children}</body>
    </html>
  );
}
