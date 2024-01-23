import { Inter } from "next/font/google";
import AuthProvider from "src/provider/AuthProvider";
import "src/styles/globals.css";
import type { Metadata, Viewport } from "next";

const APP_NAME = "chatapp";
const APP_DEFAULT_TITLE = "My Chat App";
const APP_TITLE_TEMPLATE = "%s - CHAT App";
const APP_DESCRIPTION = "Best CHAT app in the world!";

export const metadata: Metadata = {
  applicationName: APP_NAME,
  title: {
    default: APP_DEFAULT_TITLE,
    template: APP_TITLE_TEMPLATE,
  },
  description: APP_DESCRIPTION,
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: APP_DEFAULT_TITLE,
    // startUpImage: [],
  },
  formatDetection: {
    telephone: false,
  },
};

export const viewport: Viewport = {
  themeColor: "#FFFFFF",
};
const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
    
      <body className={inter.className + " dark"}>
        <AuthProvider>
          {/* <NavBar />  */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
