/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, useMemo, useRef } from 'react';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { GetServerSidePropsContext } from 'next';
import { makeStyles } from '@material-ui/core/styles';


import { useRouter } from 'next/router';
import cookie from 'js-cookie'
import axios from 'axios';
import MarketplaceItem from '../../components/global/MarketplaceItem';
import Header from '../../components/global/Header';
import * as utils from '../../utils';
import type * as Types from '../../types/index.d';
import Theme from '../../components/Theme';


const { SLIDER_PRODUCTS_PART } = utils.c;

const useStyles = makeStyles({
  div: {
    width: '210px',
  },
  right: {
    margin: '0 15px 6px auto',
  },
  image: {
    borderRadius: '8px',
  },
  center: {
    margin: '0 auto 6px auto',
  },
});


/**
 * Страница Личный кабинет пользователя
 * @param props
 * @returns
 */
function Cabinet(props): React.ReactElement {
  const router = useRouter()
  const { app, data } = props;
  const { lang } = app;
  const [active, setActive] = useState<number>(0);
  const [show, setShow] = useState<boolean>(false);


  const Footer = useMemo(() => {
    return dynamic<any>(() => import('../../components/global/Footer').then((mod) => mod.default));
  }, []);
  useEffect(() => {
    console.log(data)
  }, [])
  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 2000);
    $(document).on('click', '.cabinet_top_user_link', () => {
      const e = $(this),
        val = e.text(),
        f = $('<input>');

      e.toggleClass('icon-copy icon-copy_fill');

      $('body').append(f);
      f.val(val).select();
      document.execCommand('copy');
      f.remove();

      setTimeout(() => {
        e.toggleClass('icon-copy icon-copy_fill');
      }, 1000);
    });
  }, [active]);
  return (
    <Theme>
      <Header app={app}/>
      <div className="wrapper">
        <div className="cabinet_top">
          <div className="cabinet_top_bg">
            <span className="icon icon-edit_white" />
            {data.headerUrl ?    <picture>
              <source srcSet={data.headerUrl} />
              <img
                src={data.headerUrl}
                alt="img"
              />
            </picture>   :      <picture>
              <source srcSet="/images/bg.webp" type="image/webp" />
              <img
                src="/images/bg.jpg"
                alt="img"
                srcSet="/images/bg.jpg 1x, /images/bg@2x.jpg 2x"
              />
            </picture>}

          </div>
          <div className="cabinet_top_user">
            <div className="cabinet_top_user_img">
              {data.imgUrl ? <picture>
                <source srcSet={data.imgUrl}/>
                <img src={data.imgUrl} alt="" />
              </picture> : <picture><source srcSet="/img/avatar_0.png" /><img src="/img/avatar_0.png" alt="avatar" /></picture>}
            </div>
            <div className="cabinet_top_user_name">{data.name}</div>
            <div className="cabinet_top_user_link icon icon-copy">
              {data.wallet}
            </div>
          </div>
          {cookie.get('id') === data._id ?
          (<div className="cabinet_top_btns button">
            <a href="#" className="btn btn_black fill">
              <span>{lang.cabinet.auctionBallance}</span>
            </a>
            <a href="#" className="btn btn_black fill">
              <span>{lang.cabinet.walletBallance}</span>
            </a>
          </div>): <div className="cabinet_top_btns button">
            <a href="#" className="btn btn_black fill">
              <span>Подписаться</span>
            </a>
          </div>}
        </div>

        <div className="cabinet_nav flex">
          <label
            role="button"
            onClick={() => {
              setShow(false);
              setActive(0);
            }}
            className={clsx('cabinet_nav_li', active === 0 && 'active')}
            htmlFor="slick-slide-control00">
            {lang.cabinet.created}
          </label>
          <label
            role="button"
            onClick={() => {
              setShow(false);
              setActive(1);
            }}
            className={clsx('cabinet_nav_li', active === 1 && 'active')}
            htmlFor="slick-slide-control01">
            {lang.cabinet.inMarket}
          </label>
          <label
            role="button"
            onClick={() => {
              setShow(false);
              setActive(2);
            }}
            className={clsx('cabinet_nav_li', active === 2 && 'active')}
            htmlFor="slick-slide-control02">
            {lang.cabinet.myCollection}
          </label>
          <label
            role="button"
            onClick={() => {
              setShow(false);
              setActive(3);
            }}
            className={clsx('cabinet_nav_li', active === 3 && 'active')}
            htmlFor="slick-slide-control03">
            {lang.cabinet.favorites}
          </label>
          <label
            role="button"
            onClick={() => {
              setShow(false);
              setActive(4);
            }}
            className={clsx('cabinet_nav_li', active === 4 && 'active')}
            htmlFor="slick-slide-control04">
            {lang.cabinet.followers}
          </label>
          <label
            role="button"
            onClick={() => {
              setShow(false);
              setActive(5);
            }}
            className={clsx('cabinet_nav_li', active === 5 && 'active')}
            htmlFor="slick-slide-control05">
            {lang.cabinet.following}
          </label>
        </div>
        <div className="cabinet_block" hidden={active !== 0}>
          <div className="marketplace__items">
       {data.nfts.map((item) => {
              return <MarketplaceItem app={app} key={`MarketplaceItem-${item._id}`} data={item} />;
            })}
          </div>
        </div>
        <div className="cabinet_block" hidden={active !== 1}>
          <span>«Пусто»</span>
        </div>
        <div className="cabinet_block" hidden={active !== 2}>
          block3
        </div>
        <div className="cabinet_block" hidden={active !== 3}>
        <div className="marketplace__items">
       {data.favouriteNfts ? [data.favouriteNfts.map((item) => {
              return <MarketplaceItem app={app} key={`MarketplaceItem-${item._id}`} data={item} />;
            })] : <div>you dont have any favourite nft-tokens</div>}
          </div>
        </div>
        <div className="cabinet_block" hidden={active !== 4}>
          <div className="cabinet_subs">
            <a className="cabinet_sub" href="#">
              <div className="cabinet_sub_img">
                <picture>
                  <source srcSet="/images/2.webp" type="image/webp" />
                  <img
                    src="/images/2.jpg"
                    alt="img"
                    srcSet="/images/2.jpg 1x, /images/2@2x.jpg 2x"
                  />
                </picture>
              </div>
              <span className="cabinet_sub_name">Lee Aaker</span>
            </a>
            <a className="cabinet_sub" href="#">
              <div className="cabinet_sub_img">
                <picture>
                  <source srcSet="/images/3.webp" type="image/webp" />
                  <img
                    src="/images/3.jpg"
                    alt="img"
                    srcSet="/images/3.jpg 1x, /images/3@2x.jpg 2x"
                  />
                </picture>
              </div>
              <span className="cabinet_sub_name">Frank J. Aard</span>
            </a>
            <a className="cabinet_sub" href="#">
              <div className="cabinet_sub_img">
                <picture>
                  <source srcSet="/images/4.webp" type="image/webp" />
                  <img
                    src="/images/4.jpg"
                    alt="img"
                    srcSet="/images/4.jpg 1x, /images/4@2x.jpg 2x"
                  />
                </picture>
              </div>
              <span className="cabinet_sub_name">Aash Aaron</span>
            </a>
            <a className="cabinet_sub" href="#">
              <div className="cabinet_sub_img">
                <picture>
                  <source srcSet="/images/2.webp" type="image/webp" />
                  <img
                    src="/images/2.jpg"
                    alt="img"
                    srcSet="/images/2.jpg 1x, /images/2@2x.jpg 2x"
                  />
                </picture>
              </div>
              <span className="cabinet_sub_name">Quinton Aaron</span>
            </a>
            <a className="cabinet_sub" href="#">
              <div className="cabinet_sub_img">
                <picture>
                  <source srcSet="/images/3.webp" type="image/webp" />
                  <img
                    src="/images/3.jpg"
                    alt="img"
                    srcSet="/images/3.jpg 1x, /images/3@2x.jpg 2x"
                  />
                </picture>
              </div>
              <span className="cabinet_sub_name">William Abadie</span>
            </a>
            <a className="cabinet_sub" href="#">
              <div className="cabinet_sub_img">
                <picture>
                  <source srcSet="/images/4.webp" type="image/webp" />
                  <img
                    src="/images/4.jpg"
                    alt="img"
                    srcSet="/images/4.jpg 1x, /images/4@2x.jpg 2x"
                  />
                </picture>
              </div>
              <span className="cabinet_sub_name">Tony Abatemarco, Anthony Michael </span>
            </a>
          </div>
        </div>
        <div className="cabinet_block" hidden={active !== 5}>
          <div className="cabinet_subs">
            <a className="cabinet_sub" href="#">
              <div className="cabinet_sub_img">
                <picture>
                  <source srcSet="/images/2.webp" type="image/webp" />
                  <img
                    src="/images/2.jpg"
                    alt="img"
                    srcSet="/images/2.jpg 1x, /images/2@2x.jpg 2x"
                  />
                </picture>
              </div>
              <span className="cabinet_sub_name">Lee Aaker</span>
            </a>
            <a className="cabinet_sub" href="#">
              <div className="cabinet_sub_img">
                <picture>
                  <source srcSet="/images/3.webp" type="image/webp" />
                  <img
                    src="/images/3.jpg"
                    alt="img"
                    srcSet="/images/3.jpg 1x, /images/3@2x.jpg 2x"
                  />
                </picture>
              </div>
              <span className="cabinet_sub_name">Frank J. Aard</span>
            </a>
            <a className="cabinet_sub" href="#">
              <div className="cabinet_sub_img">
                <picture>
                  <source srcSet="/images/4.webp" type="image/webp" />
                  <img
                    src="/images/4.jpg"
                    alt="img"
                    srcSet="/images/4.jpg 1x, /images/4@2x.jpg 2x"
                  />
                </picture>
              </div>
              <span className="cabinet_sub_name">Aash Aaron</span>
            </a>
            <a className="cabinet_sub" href="#">
              <div className="cabinet_sub_img">
                <picture>
                  <source srcSet="/images/2.webp" type="image/webp" />
                  <img
                    src="/images/2.jpg"
                    alt="img"
                    srcSet="/images/2.jpg 1x, /images/2@2x.jpg 2x"
                  />
                </picture>
              </div>
              <span className="cabinet_sub_name">Quinton Aaron</span>
            </a>
            <a className="cabinet_sub" href="#">
              <div className="cabinet_sub_img">
                <picture>
                  <source srcSet="/images/3.webp" type="image/webp" />
                  <img
                    src="/images/3.jpg"
                    alt="img"
                    srcSet="/images/3.jpg 1x, images/3@2x.jpg 2x"
                  />
                </picture>
              </div>
              <span className="cabinet_sub_name">William Abadie</span>
            </a>
            <a className="cabinet_sub" href="#">
              <div className="cabinet_sub_img">
                <picture>
                  <source srcSet="/images/4.webp" type="image/webp" />
                  <img
                    src="/images/4.jpg"
                    alt="img"
                    srcSet="/images/4.jpg 1x, images/4@2x.jpg 2x"
                  />
                </picture>
              </div>
              <span className="cabinet_sub_name">Tony Abatemarco, Anthony Michael </span>
            </a>
          </div>
        </div>

        <Footer {...app} />
      </div>
    </Theme>
  );
}

Cabinet.getInitialProps = async ({query}) => {
  const response = await axios.get(`https://desolate-inlet-76011.herokuapp.com/user/${query.cabinetId}`)
  return {data: response.data}
};

export default Cabinet;
