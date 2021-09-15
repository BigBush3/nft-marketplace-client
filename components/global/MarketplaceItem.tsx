/* eslint-disable @next/next/link-passhref */
import React, { useState, forwardRef, useEffect } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import type * as Types from '../../types/index.d';
import OwnerDropdownItem from './OwnerDropdownItem';
import Likes from './Likes';
import Favorite from './Favorite';

interface MarketplaceItem {
  app?: Types.AppProps;
  data: any;
}

/**
 * Элемент маркетплейса
 * @param props
 * @returns
 */
const MarketplaceItem = forwardRef((props: MarketplaceItem, ref: any): React.ReactElement => {
  const { app, data } = props;
  const { owner, _id, title, likes, price, views, img, verified, currentBid, endDate, amount, initialAmount } = data;
  const { lang } = app;
  const [open, setOpen] = useState<boolean>(false);
  const calculateTimeLeft = () => {
    let difference = +new Date(endDate) - +new Date();
    let timeLeft

    if (difference > 0) {
      timeLeft = {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60)
    };
  }

  return timeLeft;

}
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
  });

  if (data.startDate){
    if (new Date(data.startDate).getTime() > new Date().getTime() || new Date(data.endDate).getTime() < new Date().getTime()){
      return null
    } else {
      return (
        <div ref={ref} className="marketplace__item products__item">
      <div className="products__item-info">
        <div
          role="button"
          className={clsx('item-info__icon', open && 'close')}
          onClick={() => {
            setOpen(!open);
          }}>
          <i className="flaticon-information" />
          <i className="flaticon-letter-x cross" />
        </div>
        {/** Всплывающий список владельцев */}
        <div className={clsx('item-info__dropdown', open && 'active')}>
{/*           {owner.map((owner, index) => {
            return <OwnerDropdownItem key={`Owner-${index}`} {...owner} />;
          })} */}
        </div>
      </div>
      <div className="products__item-img">
        <div className="item-img__cover">
          <Link href={`/product/${_id}`}>
            <img style={{ cursor: 'pointer' }} src={img} alt="img" />
          </Link>
        </div>
        {verified && (
          <div className="products__item-mark">
            <img src="/img/verified-gold.png" alt="mark" />
          </div>
        )}
        <div className='timer_fill place_timer'><h1>{`${timeLeft.days} : ${timeLeft.hours} : ${timeLeft.minutes} : ${timeLeft.seconds}`}</h1></div>
      </div>
      <div className="products__item-name">{title}</div>
      <div className="products__item-stats">
        <div className="item-stats__views">
         <i className="flaticon-eye" /> <span>{views}</span>
        </div>
{/*         <Favorite favoriteMe={favoriteMe} app={app} />
        <Likes likeMe={likeMe} likes={likes} app={app} /> */}
        <div className="item-stats__count">{amount ? `${amount}/${initialAmount}` : '1/1'}</div>
      </div>
      <div className="products__item-price">ETH {currentBid}</div>
      <div className="products__item-buy">
        <Link href={`/product/${_id}`}>{lang.buyBid}</Link>
      </div>
    </div>
      )
    }
  }
  return (
    <div ref={ref} className="marketplace__item products__item">
      <div className="products__item-info">
        <div
          role="button"
          className={clsx('item-info__icon', open && 'close')}
          onClick={() => {
            setOpen(!open);
          }}>
          <i className="flaticon-information" />
          <i className="flaticon-letter-x cross" />
        </div>
        {/** Всплывающий список владельцев */}
        <div className={clsx('item-info__dropdown', open && 'active')}>
{/*           {owner.map((owner, index) => {
            return <OwnerDropdownItem key={`Owner-${index}`} {...owner} />;
          })} */}
        </div>
      </div>
      <div className="products__item-img">
        <div className="item-img__cover">
          <Link href={`/product/${_id}`}>
            <img style={{ cursor: 'pointer' }} src={img} alt="img" />
          </Link>
        </div>
        {verified && (
          <div className="products__item-mark">
            <img src="/img/verified-gold.png" alt="mark" />
          </div>
        )}
      </div>
      <div className="products__item-name">{title}</div>
      <div className="products__item-stats">
        <div className="item-stats__views">
         <i className="flaticon-eye" /> <span>{views}</span>
        </div>
{/*         <Favorite favoriteMe={favoriteMe} app={app} />
        <Likes likeMe={likeMe} likes={likes} app={app} /> */}
        <div className="item-stats__count">1/1</div>
      </div>
      <div className="products__item-price">ETH {price}</div>
      <div className="products__item-buy">
        <Link href={`/product/${_id}`}>{lang.buyBid}</Link>
      </div>
    </div>
  );
});

MarketplaceItem.displayName = 'MarketplaceItem';

export default MarketplaceItem;
