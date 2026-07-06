import type { Metadata } from "next";
import { Montserrat, Merriweather } from "next/font/google";
import { CartProvider } from "@/components/CartContext";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://noisyapartment.org"),
  title: "NoisyApartment | Solve Your Apartment Noise Problem",
  description:
    "Free, practical guides for renters and condo owners dealing with noisy neighbors, thin walls, and street noise — organized by noise source and by room.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${montserrat.variable} ${merriweather.variable} scroll-smooth`}
    >
      <body className="min-h-screen bg-background text-on-surface font-body-md antialiased flex flex-col">
        <CartProvider>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
