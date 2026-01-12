import Header from "@/components/Header";
import SessionProviderWrapper from "@/components/SessionProviderWrapper";
import './globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pl">
      <body className="min-h-screen flex flex-col">
        <SessionProviderWrapper>
          <Header />
          <main className="flex-1 flex items-center justify-center px-6">
            {children}
          </main>
        </SessionProviderWrapper>

      </body>
    </html>
  );
}
