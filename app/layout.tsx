import History from "./History";
import { Search } from "./Search";
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
          <div className="drawer-content space-y-4">
            <div className="flex gap-4">
              <label htmlFor="my-drawer" className="btn btn-neutral">
                See History
              </label>
              <div className="flex-1">
                <Search />
              </div>
            </div>
            <div>{children}</div>
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
