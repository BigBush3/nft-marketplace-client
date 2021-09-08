/* eslint-disable react/no-danger */
/* eslint-disable no-irregular-whitespace */
/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useMemo } from 'react';
import dynamic from 'next/dynamic';
import { GetServerSidePropsContext } from 'next';
import Slider from 'react-slick';
import * as utils from '../utils';
import type * as Types from '../types/index.d';
import Theme from '../components/Theme';
import Header from '../components/global/Header';

interface AboutProps {
  data: Types.Article[];
  app?: Types.AppProps;
}

function About(props: AboutProps): React.ReactElement {
  const { data, app } = props;
  const { lang } = app;

  const Footer = useMemo(() => {
    return dynamic<any>(() => import('../components/global/Footer').then((mod) => mod.default));
  }, []);

/*   useEffect(() => {
    $('.about_info_images').slick({
      arrows: false,
      dots: true,
      infinite: false,
      slidesToShow: 1,
    });
  }, []); */
  const settings = {
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true,
    autoplay: true,
    autoplaySpeed: 5000,
  }
  const images = [
    '/images/5.jpg',
    '/images/5.jpg',
    '/images/5.jpg',
    '/images/5.jpg',
  ]
  return (
    <Theme>
      <Header app={app} />
      <div className="wrapper">
        <div className="heading center">
          <h1>{lang.pageNames.about}</h1>
        </div>

        <div className="about_info">
          <div className="about_info_block flex_start">
            <div className="about_info_txt">
              <div className="about_info_title">{data[0].title}</div>
              <div
                className="about_info_text"
                dangerouslySetInnerHTML={{ __html: data[0].description }}
              />
            </div>
            <Slider {...settings} className="about_info_images">
              {images.map((item, index) => {
                return (
              <div className="about_info_img" key={`image ${index}`}>
                <picture>
                  <img src={item} alt="img"/>
                </picture>
              </div>
                )
              })}
{/* 
              <div className="about_info_img">
                <picture>
                  <source srcSet="images/5.webp" type="image/webp" />
                  <img src="/images/5.jpg" alt="img" srcSet="images/5.jpg 1x, images/5@2x.jpg 2x" />
                </picture>
              </div>
              <div className="about_info_img">
                <picture>
                  <source srcSet="images/5.webp" type="image/webp" />
                  <img src="/images/5.jpg" alt="img" srcSet="images/5.jpg 1x, images/5@2x.jpg 2x" />
                </picture>
              </div>
              <div className="about_info_img">
                <picture>
                  <source srcSet="images/5.webp" type="image/webp" />
                  <img src="/images/5.jpg" alt="img" srcSet="images/5.jpg 1x, images/5@2x.jpg 2x" />
                </picture>
              </div> */}
            </Slider>
          </div>
          <div className="about_info_block">
            <div className="about_info_title">{data[1].title}</div>
            <div
              className="about_info_text"
              dangerouslySetInnerHTML={{ __html: data[1].description }}
            />
          </div>
          <div className="about_info_block flex_start">
            <div className="faq_article_video">
              <video width="100%" height="100%" controls={true}>
                <source src="/video/1.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="about_info_txt about_info_right_txt">
              <div className="about_info_title">{data[2].title}</div>
              <div
                className="about_info_text"
                dangerouslySetInnerHTML={{ __html: data[2].description }}
              />
            </div>
          </div>
          <div className="about_info_block">
            <div className="about_info_title">{data[3].title}</div>
            <div
              className="about_info_text"
              dangerouslySetInnerHTML={{ __html: data[3].description }}
            />
          </div>
        </div>
        <Footer {...app} />
      </div>
    </Theme>
  );
}

About.getInitialProps = async (ctx: GetServerSidePropsContext): Promise<AboutProps> => {
  const { locale } = ctx;
  return {
    data: utils.d.getAboutArticles(locale),
  };
};

export default About;
