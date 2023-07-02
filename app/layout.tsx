import History from "./History";
import "./globals.css";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

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
      <body className={inter.className}>
        <div className="lg:grid lg:grid-cols-10 gap-4 min-h-screen flex flex-col">
          <aside className="p-6 col-span-2">
            <History />
          </aside>
          <div className="col-span-8 p-6">{children}</div>
        </div>
      </body>
    </html>
  );
}
