import Link from "next/link";
import History from "./History";
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
      <body className="p-8">
        <div className="drawer">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <div className="hero min-h-screen bg-base-200">
              <div className="hero-content flex-col">
                <div className="flex gap-4">
                  <Link href="/" className="btn btn-sm btn-outline">
                    Go to home
                  </Link>
                  <label htmlFor="my-drawer" className="btn btn-sm">
                    See History
                  </label>
                </div>
                <h1 className="text-5xl font-bold">M3U8 Scraper</h1>
                <p className="py-6">
                  This project uses Next.js 13 app directory, cheerio, hls.js
                  and plyr.js to scrape and play a m3u8 link from a korean
                  streaming website.
                </p>
                <div>{children}</div>
              </div>
            </div>
          </div>
          <div className="drawer-side">
            <label htmlFor="my-drawer" className="drawer-overlay"></label>
            <ul className="menu w-80 h-full bg-base-200 text-base-content">
              <History />
            </ul>
          </div>
        </div>
      </body>
    </html>
  );
}
