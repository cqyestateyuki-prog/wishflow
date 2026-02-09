import './globals.css';
import { Fraunces, Work_Sans } from 'next/font/google';
import Nav from '../components/Nav';
import { LanguageProvider } from '../components/LanguageProvider';

const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-serif',
  weight: ['400', '600']
});

const workSans = Work_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '600']
});

export const metadata = {
  title: 'Wishflow · 愿航',
  description: 'Life-long wish navigation system for sensitive minds.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${fraunces.variable} ${workSans.variable}`}>
        <div className="ambient" />
        <LanguageProvider>
          <Nav />
          <main>{children}</main>
        </LanguageProvider>
      </body>
    </html>
  );
}
