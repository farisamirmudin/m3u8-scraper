import Link from "next/link";
import History from "@/components/History";
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
        <div className="hero bg-base-200 min-h-screen">
          <div className="hero-content flex-col">
            <Link href="/" className="text-5xl font-bold">
              M3U8 Scraper
            </Link>
            <p className="mb-8">
              This project uses Next.js 13 app directory, cheerio, hls.js and
              plyr.js to scrape and play a m3u8 link from a korean streaming
              website.
            </p>
            <div>{children}</div>
            <History />
          </div>
        </div>
      </body>
    </html>
  );
}
