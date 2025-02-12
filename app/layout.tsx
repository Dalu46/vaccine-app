import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@components/components/ui/toaster";
import { AuthInit } from "../app/store/auth-store";



const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Vaxtrack",
  description: "A web application to track children vaccination",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <AuthInit />
      <body className={inter.className}>{children}</body>
     <Toaster /> 
    </html>
  );
}
