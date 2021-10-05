/* eslint-disable @next/next/link-passhref */
import React, { useState, forwardRef, useEffect } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import type * as Types from '../../types/index.d';
import OwnerDropdownItem from './OwnerDropdownItem';
import Web3 from 'web3';
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
const MarketplaceItem = forwardRef((props: MarketplaceItem, ref: any): React.ReactElement => {
  const { app, data } = props;
  const { owner, _id, title, likes, price, views, img, verified, currentBid, endDate, amount, initialAmount } = data;
  const { lang } = app;
  const [historyItem, setHistoryItem] = useState([])

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
console.log(data.owner)
el.push(data.owner)
setHistoryItem(el)
}
  }
  setOpen(!open)
}
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  useEffect(() => {
    const timer=setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    // Clear timeout if the component is unmounted
    return () => clearTimeout(timer);
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
      <div className='products__item-type'>
{data.nftType === 'gif' ? <img src='/img/icon-gif.svg'/>: [data.nftType === 'video' ? <img src='/img/icon-video.svg'/> : <img src='/img/icon-picture.svg'/>]}
        </div>
        <div className="item-img__cover">
          <Link href={`/product/${_id}`}>
          {data.nftType === 'video' ? <video src={data.img} width="450" height="300" loop webkit-playsinline playsInline>
     </video> : <img src={data.img} alt="img" style={{borderRadius: '20px'}}/>}
          </Link>
        </div>
        {verified && (
          <div className="products__item-mark">
            <img src="/img/verified-gold.png" alt="mark" />
          </div>
        )}
        {timeLeft.days === 0 ? <div className='timer_fill place_timer' style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}><p style={{color: 'white', fontSize: '10px'}}>Auction ends in</p><h1>{`${timeLeft.hours < 10? '0' + String(timeLeft.hours): timeLeft.hours} : ${timeLeft.minutes < 10? '0' + String(timeLeft.minutes): timeLeft.minutes} : ${timeLeft.seconds < 10? '0' + String(timeLeft.seconds) :timeLeft.seconds}`}</h1></div>: 
        <div className='timer_fill place_timer' style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}><p style={{color: 'white', fontSize: '10px'}}>Auction ends in</p><h1>{`${timeLeft.days < 10? '0' + String(timeLeft.days): timeLeft.days} : ${timeLeft.hours < 10? '0' + String(timeLeft.hours): timeLeft.hours} : ${timeLeft.minutes < 10? '0' + String(timeLeft.minutes): timeLeft.minutes} : ${timeLeft.seconds < 10? '0' + String(timeLeft.seconds) :timeLeft.seconds}`}</h1></div>}
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
        <Link href={`/product/${_id}`}>{currentBid ? lang.placeBid: lang.buy}</Link>
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
        <div className='products__item-type'>
{data.nftType === 'gif' ? <img src='/img/icon-gif.svg'/>: [data.nftType === 'video' ? <img src='/img/icon-video.svg'/> : <img src='/img/icon-picture.svg'/>]}
        </div>
        
        <div className="item-img__cover">
          <Link href={`/product/${_id}`}>
          {data.nftType === 'video' ? <video src={data.img} width="450" height="300" autoPlay loop webkit-playsinline playsInline>
     </video> : <img src={data.img} alt="img" style={{borderRadius: '20px'}}/>}
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
        <Link href={`/product/${_id}`}>{currentBid ? lang.placeBid: lang.buy}</Link>
      </div>
    </div>
  );
});

MarketplaceItem.displayName = 'MarketplaceItem';

export default MarketplaceItem;
