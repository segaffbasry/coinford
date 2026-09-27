import type { Metadata, Viewport } from "next";
import { Shell } from "@/components/chrome";
import { posthogSnippet } from "@/lib/posthog";
import "./globals.css";
import "@/styles/ui.css";
import "@/styles/chrome.css";
import "@/styles/home.css";
import "@/styles/pages.css";

export const metadata: Metadata = {
  title: { default: "Coinford – Leading Groundwork & Concrete Frame Specialists in London & the South East", template: "%s – Coinford" },
  description: "Coinford delivers infrastructure, earthworks, groundworks and RC frames for contracts from £5 million to £50 million throughout the South East of England.",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export const viewport: Viewport = { themeColor: "#ffffff" };

/* `js` is set before first paint (unless reduced motion is requested) so reveal targets can start hidden without a flash.
   Without JavaScript the class is never added and every element renders in place; the <noscript> style also hides the preloader. */
const boot = "if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('js')";

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en-GB" data-header="light" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: boot }} />
        <script dangerouslySetInnerHTML={{ __html: posthogSnippet }} />
        <link rel="preload" href="/fonts/Roboto-Variable.woff2" as="font" type="font/woff2" crossOrigin="" />
        <link rel="preload" href="/fonts/BebasNeue-Regular.woff2" as="font" type="font/woff2" crossOrigin="" />
        <noscript><style>{".preloader{display:none!important}"}</style></noscript>
      </head>
      <body><Shell>{children}</Shell></body>
    </html>
  );
}
