/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import clsx from 'clsx';
import type * as Types from '../../types/index.d';
import OwnerDropdownItem from '../global/OwnerDropdownItem';
import Likes from '../global/Likes';
import Favorite from '../global/Favorite';
import Link from 'next/link';
import axios from 'axios'
import { getTokenOwnHistory } from '../../utils/blockchain';
import router from 'next/router';

interface FineArtItemProps {
  item: Types.ItemProps;
  app: Types.AppProps;
}

/**
 * Элемент Fine Art
 * @param props
 * @returns
 */
export default function FineArtItem(props): React.ReactElement {
  const [open, setOpen] = useState<boolean>(false);
  const { item, app } = props;
  const { lang } = app;
  const { owners, author, title, views, likes, likeMe, favoriteMe, price, mark, _id, type, currentBid, status } = item;
  const [historyItem, setHistoryItem] = useState([])
  const ownerHandler = async () => {
    if (!open){
      const el = []
      const resHistory = await getTokenOwnHistory(item.tokenId)
      if (resHistory[0]){
        el.push(resHistory[0].returnValues.addressFrom.toLowerCase())
    for (let i = 0; i < resHistory.length; i++) {
    el.push(resHistory[i].returnValues.addressTo.toLowerCase())
    
    }
    const finalHistory = await axios.post('https://nft-marketplace-api-plzqa.ondigitalocean.app/nft/history', {history: el})
    setHistoryItem(finalHistory.data.result)
    } else {
      console.log(item.owner)
    el.push(item.owner)
    console.log(el)
    setHistoryItem(el)
    }
      }
      setOpen(!open)
  }
  return (
    <div className="fineart__item products__item">
            <div className="products__item-info">
        <div
          role="button"
          className={clsx('item-info__icon', open && 'close', 'fineart')}
          onClick={ownerHandler}>
          <i className="flaticon-information" />
          <i className="flaticon-letter-x cross" />
        </div>

        <div className={clsx('item-info__dropdown', open && 'active')}>
        {historyItem.map((item, index, array) => {
        
                          return <OwnerDropdownItem {...item} ind={index}/>
                        })}
        </div>
      </div>
      <div onClick={() => router.push(`/product/${_id}`)}  className="products__item-img" style={{cursor: 'pointer'}}>
        <div>
          <img style={{width: '55vh', height: '55vh', objectFit: 'cover', borderRadius: '20px'}} src={item?.img} alt="img" />
        </div>
        {mark && (
          <div className="products__item-mark">
            <img src="/img/mark.png" alt="mark" />
          </div>
        )}
      </div>
      <div className="products__item-title">{item.owner.name}</div>
      <div className="products__item-name">{title}</div>
      <div className="products__item-stats">
        <div className="item-stats__views">
          <i className="flaticon-eye" /> <span>{views}</span>
        </div>
        <Favorite data={item} />
        <Likes data={item} />
        <div className="item-stats__count">1/1</div>
      </div>
      {status === 'soldOut' ? <h1 style={{textAlign: 'center', marginTop: '10px', fontSize: '20px', color: 'red'}}>Sold out</h1> : [item.endDate ? [new Date(item.endDate).getTime() < new Date().getTime() ? <h1 style={{textAlign: 'center', marginTop: '10px', fontSize: '20px', color: 'red'}}>{lang.auction.auctionEnded}</h1> :       <div><div className="products__item-price">ETH {price ? price : currentBid}</div>
      <div className="products__item-buy button">


      { type === 'timedAuction' ? <Link href={`/product/${_id}`}><a className="buy fill btn_fill">
          <span>{lang.placeBid}</span>
        </a></Link>:
        <Link href={`/product/${_id}`}><a className="buy fill btn_fill">
        <span>{lang.buy}</span>
      </a></Link>
}
      </div></div>] :       <div><div className="products__item-price">ETH {price ? price : currentBid}</div>
      <div className="products__item-buy button">


      { type === 'timedAuction' ? <Link href={`/product/${_id}`}><a className="buy fill btn_fill">
          <span>{lang.placeBid}</span>
        </a></Link>:
        <Link href={`/product/${_id}`}><a className="buy fill btn_fill">
        <span>{lang.buy}</span>
      </a></Link>
}
      </div></div>]}
    </div>
  );
}