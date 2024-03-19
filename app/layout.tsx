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
        <Link href="/" className="text-4xl font-bold">
          M3U8 Scraper
        </Link>
        <div>{children}</div>
      </body>
    </html>
  );
}
