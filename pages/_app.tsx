import React, { useEffect } from 'react';
import type { AppProps } from 'next/app';
import Head from 'next/head';
import 'slick-carousel/slick/slick.css';
import * as utils from '../utils';
import '../styles/globals.css';

/**
 * Компонент уровня приложения
 * @param param0
 * @returns
 */
function MyApp({ Component, pageProps, router }: AppProps): React.ReactElement {
  useEffect(() => {
    // buttons fill
    /* $('body').on('mouseenter', '.button .btn_fill', () => {
      $(this).removeClass('fill');
      $(this).next('.btn_blank').addClass('fill');
      $(this).prev('.btn_blank').addClass('fill');
    });
    $('body').on('mouseleave', '.button .btn_fill', () => {
      $(this).addClass('fill');
      $(this).next('.btn_blank').removeClass('fill');
      $(this).prev('.btn_blank').removeClass('fill');
    });
    $('body').on('mouseenter', '.button .btn_blank', () => {
      $(this).addClass('fill');
      $(this).next('.btn_fill').removeClass('fill');
      $(this).prev('.btn_fill').removeClass('fill');
    });
    $('body').on('mouseleave', '.button .btn_blank', () => {
      $(this).removeClass('fill');
      $(this).next('.btn_fill').addClass('fill');
      $(this).prev('.btn_fill').addClass('fill');
    });
    */
  }, []);
  const lang = utils.h.getLang(router.locale);
  return (
    <>
      <Head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
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
