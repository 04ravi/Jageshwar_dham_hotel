import type { Metadata } from "next";
import "./globals.css";
import { HotelProvider } from "@/context/HotelContext";

export const metadata: Metadata = {
  title: "Jageshwar Dham Retreat & Resort | Rooms, Cabs, Dining & Himalayan Treks",
  description: "Boutique heritage stays in Jageshwar Dham, Almora. Book rooms directly, arrange Kathgodam mountain cabs, relish Kumaoni thalis, and hike to Vridh Jageshwar.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-[#FAF8F5] text-stone-900 selection:bg-amber-100 selection:text-emerald-950">
        <HotelProvider>{children}</HotelProvider>
      </body>
    </html>
  );
}
