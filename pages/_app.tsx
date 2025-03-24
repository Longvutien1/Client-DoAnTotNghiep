
import "@/styles/globals.css";
// import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import { Provider } from 'react-redux';
import NProgress from "nprogress";
import { ToastContainer } from "react-toastify";
import { PersistGate } from "redux-persist/integration/react";
import { SWRConfig } from "swr";
import Router from "next/router";
import Layout from '../components/Layout'
import { persistor, store } from '../app/store';
import { NextPage } from "next";
import { ReactElement } from "react";
import { API_NodeJS } from "@/api/config";


NProgress.configure({
  showSpinner: false,
  trickleSpeed: 100,
});
Router.events.on("routeChangeStart", NProgress.start);
Router.events.on("routeChangeComplete", NProgress.done);
Router.events.on("routeChangeError", NProgress.done);

type LayoutProps = {
  children: React.ReactNode
}

type NextPageWithLayout = NextPage & {
  Layout?: (page: LayoutProps) => ReactElement
}
type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

export default function App({ Component, pageProps }: AppPropsWithLayout) {

  const LayoutWrapper = Component.Layout ?? Layout;
  return <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      {/* <SessionProvider session={pageProps.session} refetchInterval={0}> */}
        <LayoutWrapper>
          <SWRConfig
            value={{
              fetcher: async (url: string) => API_NodeJS.get(url),
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
              pauseOnHover={false}
              pauseOnFocusLoss={false}
            />
          </SWRConfig>
        </LayoutWrapper>
      {/* </SessionProvider> */}
    </PersistGate>
  </Provider>
}
