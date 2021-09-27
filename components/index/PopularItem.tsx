/* eslint-disable @next/next/link-passhref */
import React, { useState } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import type * as Types from '../../types/index.d';
import OwnerDropdownItem from '../global/OwnerDropdownItem';
import Likes from '../global/Likes';
import Favorite from '../global/Favorite';
import axios from 'axios'
import { getTokenOwnHistory } from '../../utils/blockchain';


interface PopularIntemProps {
  app?: Types.AppProps;
  data: Types.ItemProps;
  mark: boolean;
}

/**
 * Элемент популярного товара
 * @param props
 * @returns
 */
function PopularItem(props): React.ReactElement {
  const { app, data } = props;
  const { mark, owners, _id, title, likeMe, likes, price, views, favoriteMe, img, verified , currentBid} = data;
  const { lang } = app;
  const [historyItem, setHistoryItem] = useState([])
  const [open, setOpen] = useState<boolean>(false);
  console.log(data)
  const ownerHandler = async () => {
    if (!open){
    const el = []
    const resHistory = await getTokenOwnHistory(data.tokenId)
    if (resHistory[0]){
      el.push(resHistory[0].returnValues.addressFrom.toLowerCase())
for (let i = 0; i < resHistory.length; i++) {
  el.push(resHistory[i].returnValues.addressTo.toLowerCase())
  
}
const finalHistory = await axios.post('https://desolate-inlet-76011.herokuapp.com/nft/history', {history: el})
setHistoryItem(finalHistory.data.result)
} else {
  console.log(data.owner)
  el.push(data.owner)
  setHistoryItem(el)
}
    }
    setOpen(!open)
  }
  return (
    <div className="popular__item products__item">
      <div className="products__item-info">
        <div
          role="button"
          className={clsx('item-info__icon', open && 'close')}
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
      <div className="products__item-img">
        <div className="item-img__cover">
          <Link href={`/product/${_id}`}>
            <img style={{ cursor: 'pointer' }} src={img} alt="img" />
          </Link>
        </div>
        {verified && (
          <div className="products__item-mark">
            <img src="/img/mark.png" alt="mark" />
          </div>
        )}
      </div>
      <div className="products__item-name">{title}</div>
      <div className="products__item-stats">
        <div className="item-stats__views">
          <i className="flaticon-eye" /> <span>{views}</span>
        </div>
        <Favorite favoriteMe={favoriteMe} app={app} />
        <Likes likeMe={likeMe} likes={likes} app={app} />
        <div className="item-stats__count">1/1</div>
      </div>
      <div className="products__item-price">ETH {price ? price: currentBid}</div>
      <div className="products__item-buy">
        <Link href={`/product/${_id}`}>{lang.buyBid}</Link>
      </div>
    </div>
  );
}

export default PopularItem;
