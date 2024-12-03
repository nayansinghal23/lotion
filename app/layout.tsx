"use client";
import { Inter } from "next/font/google";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
// import "@stream-io/video-react-sdk/dist/css/style.css";
import "./globals.css";
import "@/i18n/i18n.ts";

import { ThemeProvider } from "@/components/providers/theme-provider";
import ConvexProvider from "@/components/providers/convex-provider";
import { StreamClientProvider } from "@/components/providers/stream-client-provider";
import { EdgeStoreProvider } from "@/lib/edgestore";
import { store } from "@/redux/store";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <title>Jotion</title>
      <meta
        name="description"
        content="Journey from Junior to Senior Frontend Developer"
      ></meta>
      <meta name="referrer" content="no-referrer"></meta>
      <body className={inter.className}>
        <Provider store={store}>
          <ConvexProvider>
            <EdgeStoreProvider>
              <StreamClientProvider>
                <ThemeProvider
                  attribute="class"
                  defaultTheme="system"
                  enableSystem
                  disableTransitionOnChange
                >
                  <Toaster position="bottom-center" />
                  {children}
                </ThemeProvider>
              </StreamClientProvider>
            </EdgeStoreProvider>
          </ConvexProvider>
        </Provider>
      </body>
    </html>
  );
}
