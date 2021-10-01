/* eslint-disable jsx-a11y/media-has-caption */
import React, { useRef, useEffect, useMemo, useState} from 'react';
import dynamic from 'next/dynamic';
import { GetServerSidePropsContext } from 'next';
import type * as Types from '../types/index.d';
import * as utils from '../utils';
import Theme from '../components/Theme';
import Header from '../components/global/Header';
import FAQItem from '../components/faq/FAQItem';
import { useForm}from 'react-hook-form';
import CircularProgress from '@material-ui/core/CircularProgress';
import axios from 'axios';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import router from 'next/router';

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
  const [loader, setLoader] = useState(false)
  const videoRef = useRef<any>();
  const {register, handleSubmit, reset} = useForm()
  const [open, setOpen] = React.useState(false);
  console.log(data)
  const Footer = useMemo(() => {
    return dynamic<any>(() => import('../components/global/Footer').then((mod) => mod.default));
  }, []);
  const handleClose = (event, reason) => {
    setOpen(false);
  };
  useEffect(() => {
    if (videoRef?.current) {
      videoRef.current.muted = false;
    }
  }, []);
  const onSubmit = async (data) => {
    setLoader(true)
    try {
      const result = await axios.post('https://nft-marketplace-api-plzqa.ondigitalocean.app/question', {...data})
      console.log(result)
    } catch(err){
      console.log(err.message)
    }
    
    
    setLoader(false)
    setOpen(true);
    reset({name: '', email: '', text: ''})
  }
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
            {loader ? <CircularProgress color="secondary" /> :             <form  onSubmit={handleSubmit(onSubmit)}>
              <span>{lang.formQuestion.haveQuestions}</span>
              <input type="text" placeholder={lang.form.yourName} {...register('name')} required/>
              <input type="email" placeholder={lang.form.yourEmail} {...register('email')} required/>
              <textarea placeholder={lang.formQuestion.text} {...register('text')} required/>
              <button type="submit" className="btn btn_black">
                {lang.send}
              </button>
            </form>}

            <div className="faq_chat">
              <span className="icon icon-chat" />
              <span>{lang.chat}</span>
            </div>
          </aside>
        </div>
        <Footer {...app} />
      </div>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open}
        autoHideDuration={6000}
        onClose={handleClose}
        message="successfully delivered message! be in touch!"
      />
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
