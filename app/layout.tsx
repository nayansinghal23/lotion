"use client";
import { Inter } from "next/font/google";
import { Provider } from "react-redux";
import { Toaster } from "sonner";
import "./globals.css";

import { ThemeProvider } from "@/components/providers/theme-provider";
import ConvexProvider from "@/components/providers/convex-provider";
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
      <body className={inter.className}>
        <Provider store={store}>
          <ConvexProvider>
            <EdgeStoreProvider>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                <Toaster position="bottom-center" />
                {children}
              </ThemeProvider>
            </EdgeStoreProvider>
          </ConvexProvider>
        </Provider>
      </body>
    </html>
  );
}
