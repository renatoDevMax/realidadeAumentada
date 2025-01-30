import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "AR Project",
  description: "Um projeto simples de Realidade Aumentada",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
