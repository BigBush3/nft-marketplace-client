/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState } from 'react';
import clsx from 'clsx';
import type * as Types from '../../types';
import OwnerDropdownItem from '../global/OwnerDropdownItem';
import Likes from '../global/Likes';
import Favorite from '../global/Favorite';
import Link from 'next/link';
import axios from 'axios'
import { getTokenOwnHistory } from '../../utils/blockchain';
import router from 'next/router';

interface FineArtItemProps {
  item?: Types.ItemProps;
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
  const { owners, author, title, views, likes, likeMe, favoriteMe, price, mark, _id, type, initialBid } = item;
  const [historyItem, setHistoryItem] = useState([])
  const ownerHandler = async () => {
    if (!open){
      try {
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
  el.push(item.owner)
  setHistoryItem(el)
}
      } catch (err) {
        console.log(err.message)
      }

    }
    setOpen(!open)
  }
  return (
    <div className="fineart__item products__item">
            <div className="products__item-info">
              <img src={item.owner.imgUrl} style={{width: '75px', height: '75px', borderRadius: '50%', float: 'left'}} alt="" />
              <div style={{marginBottom: '10px', marginLeft: '5px'}}>
                                    <div style={{fontSize: '20px', cursor: 'pointer', 'textAlign': 'start'}} onClick={() => router.push(`/cabinet/${item.owner._id}`)} className="products__item-title">{item.owner.name}</div>
      <div style={{fontSize: '20px', textAlign: 'initial'}} className="products__item-name">{title}</div>
              </div>

{/*         <div
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
        </div> */}
      </div>
      <div onClick={() => router.push(`/product/${_id}`)}  className="products__item-img" style={{cursor: 'pointer'}}>
        <div>
          <img style={{width: '60vh', height: '60vh', objectFit: 'cover', borderRadius: '20px'}} src={item?.img} alt="img" />
        </div>
        {mark && (
          <div className="products__item-mark">
            <img src="/img/mark.png" alt="mark" />
          </div>
        )}
      </div>

      <div className="products__item-stats">
        <div className="item-stats__views">
          <i className="flaticon-eye" /> <span>{views}</span>
        </div>
        <Favorite data={item} />
        <Likes data={item} />
        <div className="item-stats__count">1/1</div>
      </div>
      <div className="products__item-price">ETH {price ? price : initialBid}</div>
      <div className="products__item-buy button">

        { type === 'timedAuction' ? <a href={`/product/${_id}`} className="buy fill btn_fill">
          <span>{lang.placeBid}</span>
        </a>:
        <a href={`/product/${_id}`} className="buy fill btn_fill">
          <span>{lang.buy}</span>
        </a>
}
      </div>
    </div>
  );
}