import "@/styles/globals.css";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { Provider } from 'react-redux';
import NProgress from "nprogress";
import { ToastContainer } from "react-toastify";
import { PersistGate } from "redux-persist/integration/react";
import { SWRConfig } from "swr";
import Router from "next/router";
import Layout from '../components/Layout'
import { persistor, store } from '../app/store';
import { instance } from '../api/config';


NProgress.configure({
  showSpinner: false,
  trickleSpeed: 100,
});
Router.events.on("routeChangeStart", NProgress.start);
Router.events.on("routeChangeComplete", NProgress.done);
Router.events.on("routeChangeError", NProgress.done);


export default function App({ Component, pageProps }: AppProps) {
  const LayoutWrapper = Component.Layout ?? Layout;
  return <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <SessionProvider session={pageProps.session}>
        <LayoutWrapper>
          <SWRConfig
            value={{
              fetcher: async (url: string) => instance.get(url),
            }}
          >
            <Component {...pageProps} />
            <ToastContainer
              position="top-right"
              autoClose={4000}
              hideProgressBar={false}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              draggable
              theme='dark'
              pauseOnHover = {false}
              pauseOnFocusLoss = {false}
            />
          </SWRConfig>
        </LayoutWrapper>
      </SessionProvider>
    </PersistGate>
  </Provider>
}
