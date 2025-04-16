import { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import { ProfileProvider } from '../contexts/ProfileContext';
import '../styles/globals.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <ProfileProvider>
        <Component {...pageProps} />
      </ProfileProvider>
    </SessionProvider>
  );
}

export default MyApp;