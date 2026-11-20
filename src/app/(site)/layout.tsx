import type { Metadata } from "next";
import { Tajawal } from "next/font/google";
import localFont from "next/font/local";
import "../globals.css";
import { homeData } from "@/data/home-data";
import { LanguageProvider } from "@/component/LanguageProvider";
import SmoothScroll from "@/component/SmoothScroll";
import FloatingCTA from "@/component/FloatingCTA";
import MetaPixelPageView from "@/component/MetaPixelPageView";
import PayloadLivePreviewListener from "@/component/PayloadLivePreviewListener";

const leagueSpartan = localFont({
  src: [
    {
      path: "../../../public/fonts/LeagueSpartan-Light.ttf",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../../public/fonts/LeagueSpartan-Regular.ttf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../../public/fonts/LeagueSpartan-Medium.ttf",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../../public/fonts/LeagueSpartan-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../../public/fonts/LeagueSpartan-Bold.ttf",
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      dir="ltr"
      className={`${leagueSpartan.variable} ${tajawal.variable} h-full antialiased`}
    >
      <head>
        <script
          id="google-tag-manager"
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-M4JBSWWQ');`,
          }}
        />
        <script
          id="meta-pixel"
          dangerouslySetInnerHTML={{
            __html: `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '1347271940144954');
fbq('track', 'PageView');`,
          }}
        />
      </head>      <body className="min-h-full flex flex-col bg-background font-sans text-foreground">
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1347271940144954&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-M4JBSWWQ"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>
        <SmoothScroll />
        <PayloadLivePreviewListener />
        <MetaPixelPageView />
        <LanguageProvider>
          {children}
          <FloatingCTA />
        </LanguageProvider>
      </body>
    </html>
  );
}
