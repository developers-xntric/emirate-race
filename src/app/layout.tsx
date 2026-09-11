import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const leagueSpartan = localFont({
  src: [
    { path: "../../public/fonts/LeagueSpartan-Light.ttf", weight: "300", style: "normal" },
    { path: "../../public/fonts/LeagueSpartan-Regular.ttf", weight: "400", style: "normal" },
    { path: "../../public/fonts/LeagueSpartan-Medium.ttf", weight: "500", style: "normal" },
    { path: "../../public/fonts/LeagueSpartan-SemiBold.ttf", weight: "600", style: "normal" },
    { path: "../../public/fonts/LeagueSpartan-Bold.ttf", weight: "700", style: "normal" },
  ],
  variable: "--font-league-spartan",
  display: "swap",
});

const cronosPro = localFont({
  src: [
    { path: "../../public/fonts/Cronos-Pro-Light_12448.ttf", weight: "300", style: "normal" },
    { path: "../../public/fonts/Cronos-Pro-Semibold_12456.ttf", weight: "600", style: "normal" },
    { path: "../../public/fonts/Cronos-Pro-Bold_12435.ttf", weight: "700", style: "normal" },
    { path: "../../public/fonts/Cronos-Pro-Semibold-Caption-Italic_12449.ttf", weight: "600", style: "italic" },
  ],
  variable: "--font-cronos-pro",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Emirate Race",
  description: "Emirate Race",
  icons:{
    icon: "/favicon.png",
  }
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className={`${leagueSpartan.variable} ${cronosPro.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}