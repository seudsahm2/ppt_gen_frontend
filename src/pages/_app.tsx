// src/pages/_app.tsx
import type { AppProps } from 'next/app';
import { Analytics } from '@vercel/analytics/react'; // Note: Use /react for Pages Router
import '../app/globals.css'; // Your global CSS import

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      {/* Component represents the active page (e.g., your index.tsx) */}
      <Component {...pageProps} />
      {/* Add the Analytics component here */}
      <Analytics />
    </>
  );
}

export default MyApp;