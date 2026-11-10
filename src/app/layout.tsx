import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import RegistrationModal from "@/components/RegistrationModal";

export const metadata: Metadata = {
  title: "HaqAI – آپ کے قانونی حقوق اور شکایت کا آسان حل | حق اے آئی",
  description:
    "Your Rights. Your Voice. Your Action. Speak in Urdu, Punjabi, Roman Urdu, or English to understand your Pakistani legal rights and submit formal complaints in 1 click.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-[#f8faf9] text-slate-900 antialiased">
        <RegistrationModal />
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
