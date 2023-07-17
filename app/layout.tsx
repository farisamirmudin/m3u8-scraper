import History from "./History";
import "./globals.css";
import Navbar from "./Navbar";

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
        <div className="drawer">
          <input id="my-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content flex flex-col min-h-screen">
            <Navbar />
            <div className="hero bg-base-200 flex-1">
              <div className="hero-content flex-col">
                <h1 className="text-5xl font-bold">Scrape for M3U8 link</h1>
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
