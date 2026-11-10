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
      <body className="relative flex min-h-screen flex-col bg-[#f8faf9] text-slate-900 antialiased overflow-x-hidden">
        {/* Global Animated Background */}
        <div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
        >
          <div className="haq-animated-grid absolute inset-0 opacity-75" />
          <div className="haq-orb-1 absolute -top-24 -left-24 h-96 w-96 rounded-full bg-teal-400/20 dark:bg-teal-500/15 blur-3xl" />
          <div className="haq-orb-2 absolute top-1/3 -right-24 h-[28rem] w-[28rem] rounded-full bg-emerald-400/20 dark:bg-emerald-500/15 blur-3xl" />
          <div className="haq-orb-3 absolute -bottom-28 left-1/4 h-96 w-96 rounded-full bg-amber-300/15 dark:bg-cyan-500/10 blur-3xl" />
        </div>
        <RegistrationModal />
        <Navbar />
        <main className="relative z-10 flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
