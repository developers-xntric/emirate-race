import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import localFont from "next/font/local";
import Script from "next/script";
import "./globals.css";
import { homeData } from "@/data/home-data";
import { LanguageProvider } from "@/component/LanguageProvider";
import SmoothScroll from "@/component/SmoothScroll";
import FloatingCTA from "@/component/FloatingCTA";

const leagueSpartan = localFont({
  src: [
    {
      path: "../../public/fonts/LeagueSpartan-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../public/fonts/LeagueSpartan-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/LeagueSpartan-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../public/fonts/LeagueSpartan-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../public/fonts/LeagueSpartan-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-league-spartan",
  display: "swap",
});

const tajawal = Tajawal({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-tajawal",
  display: "swap",
});
export const metadata: Metadata = {
  title: homeData.metadata.title,
  description: homeData.metadata.description,
  icons: {
    icon: "/favicon.png",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" dir="ltr" className={`${leagueSpartan.variable} ${tajawal.variable} h-full antialiased`}>
      <Script id="google-tag-manager" strategy="beforeInteractive">
        {`(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-M4JBSWWQ');`}
      </Script>
      <body className="min-h-full flex flex-col bg-background font-sans text-foreground">
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-M4JBSWWQ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <SmoothScroll />
        <LanguageProvider>
          {children}
          <FloatingCTA />
        </LanguageProvider>
      </body>
    </html>
  );
}
