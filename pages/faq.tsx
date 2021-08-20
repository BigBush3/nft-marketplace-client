/* eslint-disable jsx-a11y/media-has-caption */
import React, { useRef, useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { GetServerSidePropsContext } from 'next';
import type * as Types from '../types/index.d';
import * as utils from '../utils';
import Theme from '../components/Theme';
import Header from '../components/global/Header';
import FAQItem from '../components/faq/FAQItem';

interface FAQProps {
  data: {
    faqItems: Types.FAQItem[];
  };
  app?: Types.AppProps;
}

function FAQ(props: FAQProps): React.ReactElement {
  const { app, data } = props;
  const { lang } = app;
  const { faqItems } = data;
  const videoRef = useRef<any>();

  const Footer = useMemo(() => {
    return dynamic<any>(() => import('../components/global/Footer').then((mod) => mod.default));
  }, []);

  useEffect(() => {
    if (videoRef?.current) {
      videoRef.current.muted = false;
    }
  }, []);
  return (
    <Theme>
      <Header app={app} />
      <div className="wrapper">
        <div className="content faq_main">
          <div className="faq_main-heading heading center">
            <h1>{lang.pageNames.support}</h1>
          </div>

          <main className="main faq_article">
            <div className="faq_article_dropdown">
              {faqItems.map((item, key) => {
                return <FAQItem key={`FAQItem-${key}`} {...item} />;
              })}
            </div>
            <div className="faq_article_title">{lang.videoInstruction}</div>
            <div className="faq_article_video">
              <video width="100%" height="100%" ref={videoRef} controls={true}>
                <source src="/video/1.mp4" type="video/mp4" />
              </video>
            </div>
          </main>

          <aside className="aside faq_sidebar">
            <form>
              <span>{lang.formQuestion.haveQuestions}</span>
              <input type="text" placeholder={lang.form.yourName} />
              <input type="email" placeholder={lang.form.yourEmail} />
              <textarea placeholder={lang.formQuestion.text} />
              <button type="button" className="btn btn_black">
                {lang.send}
              </button>
            </form>
            <div className="faq_chat">
              <span className="icon icon-chat" />
              <span>{lang.chat}</span>
            </div>
          </aside>
        </div>
        <Footer {...app} />
      </div>
    </Theme>
  );
}

FAQ.getInitialProps = async (ctx: GetServerSidePropsContext): Promise<FAQProps> => {
  const { locale }: any = ctx;
  return {
    data: {
      faqItems: utils.d.getFAQItems(locale),
    },
  };
};

export default FAQ;
