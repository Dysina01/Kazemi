import type { Metadata } from "next";
import "./globals.css";
import "./cursor.css";
import CustomCursor from "./CustomCursor";
import MagneticInteractions from "./MagneticInteractions";

export const metadata: Metadata = {
  title: "Parnaz Kazemi — Product Manager & Consultant",
  description: "Portfolio of Parnaz Kazemi, a digital product manager and consultant specializing in product strategy, design systems and high-performing teams.",
  openGraph: { title: "Parnaz Kazemi", description: "Digital Product Manager & Consultant", type: "website" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}<MagneticInteractions /><CustomCursor /></body></html>;
}
