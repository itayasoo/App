import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";

export const metadata: Metadata = {
  title: "BackgammonPro – Premium Backgammon Sets",
  description:
    "Shop premium handcrafted backgammon sets. Classic, Deluxe, Tournament, and Travel editions available. Fast delivery.",
  openGraph: {
    title: "BackgammonPro – Premium Backgammon Sets",
    description:
      "Shop premium handcrafted backgammon sets. Classic, Deluxe, Tournament, and Travel editions.",
    type: "website",
  },
};

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_FB_PIXEL_ID ?? "";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="h-full antialiased">
      <head>
        {FB_PIXEL_ID && (
          <Script id="fb-pixel" strategy="afterInteractive">
            {`
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '${FB_PIXEL_ID}');
              fbq('track', 'PageView');
            `}
          </Script>
        )}
      </head>
      <body className="min-h-full flex flex-col bg-stone-50 text-stone-900 font-sans">
        {children}
      </body>
    </html>
  );
}
