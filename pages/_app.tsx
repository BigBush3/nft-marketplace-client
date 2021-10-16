import React, { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import 'slick-carousel/slick/slick.css';
import {useRouter} from 'next/router'
import * as utils from '../utils';
import '../styles/globals.css';
import NProgress from 'nprogress'
import '../public/nprogress.css'

/**
 * Компонент уровня приложения
 * @param param0
 * @returns
 */

function MyApp({ Component, pageProps, router }: AppProps): React.ReactElement {
  const rout = useRouter()
  const handleStart = (url) => {
      console.log(`Loading: ${url}`)
      NProgress.start()
    }
  const handleStop = () => {
      NProgress.done()
    }
  useEffect(() => {
    

    rout.events.on('routeChangeStart', handleStart)
    rout.events.on('routeChangeComplete', handleStop)
    rout.events.on('routeChangeError', handleStop)

    return () => {
      rout.events.off('routeChangeStart', handleStart)
      rout.events.off('routeChangeComplete', handleStop)
      rout.events.off('routeChangeError', handleStop)
    }
  }, [rout])
  const lang = utils.h.getLang(router.locale);
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
        <link rel="stylesheet" type="text/css" href="/nprogress.css" />
        <title>iNifty</title>
        <script defer src="/js/jquery-3.5.1.min.js" />
        <script defer src="/js/jquery-ui.min.js" />
        <script defer src="/plugins/magnific-popup/js/jquery.magnific-popup.min.js" />
      </Head>
       <Component app={{ lang }} {...pageProps} />
      
    </>
  );
}

export default MyApp;
