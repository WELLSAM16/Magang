import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from "@/lib/authContext";

export const metadata: Metadata = {
  title: "Instagram Monitoring Dashboard",
  description: "Real-time Instagram post monitoring dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
