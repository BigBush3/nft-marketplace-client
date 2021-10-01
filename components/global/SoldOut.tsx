/* eslint-disable @next/next/link-passhref */
import React, { useState, forwardRef, useEffect } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import type * as Types from '../../types';
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
const SoldOutItem = forwardRef((props: MarketplaceItem, ref: any): React.ReactElement => {
  const { app, data } = props;
  const { owner, _id, title, likes, price, views, img, verified, currentBid, endDate, amount, initialAmount } = data;
  const { lang } = app;
  const [open, setOpen] = useState<boolean>(false);

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
          <Link href={`/token/${_id}`}>
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
        <h1 style={{fontWeight: 'bold', color: 'red'}}>Sold out</h1>
        {/* <div className="item-stats__views">
         <i className="flaticon-eye" /> <span>{views}</span>
        </div> */}
{/*         <Favorite favoriteMe={favoriteMe} app={app} />
        <Likes likeMe={likeMe} likes={likes} app={app} /> */}
       {/*  <div className="item-stats__count">1/1</div> */}
      </div>
     {/*  <div className="products__item-price">ETH {price}</div> */}
    </div>
  );
});

SoldOutItem.displayName = 'SoldOutItem';

export default SoldOutItem;
