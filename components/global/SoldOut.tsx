/* eslint-disable @next/next/link-passhref */
import React, { useState, forwardRef, useEffect } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import type * as Types from '../../types';
import OwnerDropdownItem from './OwnerDropdownItem';
import Likes from './Likes';
import Favorite from './Favorite';
import { getTokenOwnHistory } from '../../utils/blockchain';
import axios from 'axios'

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
  const [historyItem, setHistoryItem] = useState([])

  const [open, setOpen] = useState<boolean>(false);
  const ownerHandler = async () => {
    if (!open){
    const el = []
    const resHistory = await getTokenOwnHistory(data.tokenId)
    if (resHistory[0]){
      el.push(resHistory[0].returnValues.addressFrom.toLowerCase())
for (let i = 0; i < resHistory.length; i++) {
  el.push(resHistory[i].returnValues.addressTo.toLowerCase())
  
}
const finalHistory = await axios.post('https://nft-marketplace-api-plzqa.ondigitalocean.app/nft/history', {history: el})
setHistoryItem(finalHistory.data.result)
} else {
  el.push(data.owner)
  setHistoryItem(el)
}
    }
    setOpen(!open)
  }
  return (
    <div ref={ref} className="marketplace__item products__item" style={{cursor: 'pointer'}}>
      <div className="products__item-info">
        <div
          role="button"
          className={clsx('item-info__icon', open && 'close')}
          onClick={ownerHandler}>
          <i className="flaticon-information" />
          <i className="flaticon-letter-x cross" />
        </div>
        {/** Всплывающий список владельцев */}
        <div className={clsx('item-info__dropdown', open && 'active')}>
        {historyItem.map((item, index, array) => {
                          return <OwnerDropdownItem {...item} ind={index}/>
                        })}
        </div>
      </div>
      <div className="products__item-img">
        <div className="item-img__cover">
          <Link href={`/token/${_id}`}>
          {data.nftType === 'video' ? <video src={data.img} width="250" height="250" autoPlay  muted loop playsInline style={{width: '250px', borderRadius: '20px', height: '250px', objectFit: 'cover'}}>
     </video> : <img src={data.img} alt="img" style={{borderRadius: '20px', width: '250px', height: '250px', objectFit: 'cover'}}/>}
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

        <h1 style={{fontWeight: 'bold', color: 'red'}}>{data.type === 'timedAuction' ? 'Auction ended' : 'Sold Out'}</h1>
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
