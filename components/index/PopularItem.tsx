/* eslint-disable @next/next/link-passhref */
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import clsx from 'clsx';
import type * as Types from '../../types/index.d';
import OwnerDropdownItem from '../global/OwnerDropdownItem';
import Likes from '../global/Likes';
import Favorite from '../global/Favorite';
import axios from 'axios'
import { getTokenOwnHistory } from '../../utils/blockchain';
import cookie from 'js-cookie'


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
  const { app, data, userData } = props;
  const { mark, owners, _id, title, likeMe, likes, price, views, favoriteMe, img, verified , currentBid} = data;
  const { lang } = app;
  const [historyItem, setHistoryItem] = useState([])
  const [open, setOpen] = useState<boolean>(false);
  const [favNfts, setFavNfts] = useState(userData?.favouriteNfts)
  function userExists(username) {
    if (favNfts){
      return favNfts.some(function(el) {
  if (el?._id){
   return el?._id === username; 
  } else {
    return false
  }
  
}); }

  }
  function deleteFav(){
    const removeIndex = favNfts.findIndex( item => item._id === data._id );
// remove object
favNfts.splice( removeIndex, 1 );
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
  el.push(data.owner)
  setHistoryItem(el)
}
    }
    setOpen(!open)
  }
  useEffect(() => {
    const handler = async () => {
     const userHistory = await axios.get(`https://nft-marketplace-api-plzqa.ondigitalocean.app/user/${cookie.get('id')}`)
     setFavNfts(userHistory.data.favouriteNfts)
    }
    if (cookie.get('id')){
     handler() 
    }
    
    
  }, [])
  return (
    <div className="popular__item products__item">
      <div className="products__item-info" style={{position: 'relative'}}>
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
        <div className="item-stats__views">
          <i className="flaticon-eye" /> <span>{views}</span>
        </div>
        <Favorite  data={data}/>
        <Likes data={data} />
        <div className="item-stats__count">1/1</div>
      </div>
      <div className="products__item-price">ETH {price ? price: currentBid}</div>
      <div className="products__item-buy">
        <Link href={`/product/${_id}`}>{currentBid ? lang.placeBid: lang.buy}</Link>
      </div>
    </div>
  );
}

export default PopularItem;
