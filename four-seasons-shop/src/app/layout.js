import './globals.css';
import Header from '@/components/dom/Header';

export const metadata = {
  title: 'Four Seasons Concept Store',
  description: 'A premium 3D shopping experience.',
  icons: {
    icon: '/favicon.svg',
    apple: '/logo.svg',
  }
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Header />
        <main>{children}</main>
      </body>
    </html>
  );
}
