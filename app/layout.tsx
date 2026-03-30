import "./globals.css";
import QueryProvider from "@/components/Providers/query-provider";
import { ThemeProvider } from "@/components/Providers/theme-provider";
import { DriveProvider } from "@/components/Providers/drive-provider";
import { ChatProvider } from "@/components/Providers/chat-provider";
import { TourProvider } from "@/components/Providers/tour-provider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <QueryProvider>
          <ThemeProvider>
            <DriveProvider>
              <ChatProvider>
                <TourProvider>
                  {children}
                </TourProvider>
              </ChatProvider>
            </DriveProvider>
          </ThemeProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
