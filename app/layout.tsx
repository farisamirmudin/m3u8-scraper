import Link from "next/link";
import "./globals.css";

export const metadata = {
  title: "M3u8 scraper",
  description: "M3u8 scraper",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <div className="">
          <div className="">
            <Link href="/" className="">
              M3U8 Scraper
            </Link>
            <p className="">
              This project uses Next.js 14 RSC, cheerio, hls.js and plyr.js to
              scrape and play a m3u8 link from a korean streaming website.
            </p>
            <div>{children}</div>
          </div>
        </div>
      </body>
    </html>
  );
}
