/* eslint-disable @next/next/link-passhref */
import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import Link from 'next/link';
import type * as Types from '../../types/index.d';
import OwnerDropdownItem from '../global/OwnerDropdownItem';
import Likes from '../global/Likes';
import Favorite from '../global/Favorite';
import axios from 'axios'
import { getTokenOwnHistory } from '../../utils/blockchain';
import cookie from 'js-cookie'

interface FineArtItemsProps {
  app?: Types.AppProps;
  data: Types.ItemProps;
  mark: boolean;
}

/**
 * Элемент товара в Fine Art на главной
 * @param props
 * @returns
 */
function FineArtItem(props): React.ReactElement {
  const { app, data, userData } = props;
  const { mark, owners, _id, title, owner, likeMe, price, views, file, favoriteMe, likes, currentBid } = data;
  const { lang } = app;
  const [open, setOpen] = useState<boolean>(false);
  const [historyItem, setHistoryItem] = useState([])
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
  console.log(data.owner)
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
  if (data.startDate){
    if (new Date(data.startDate).getTime() > new Date().getTime() || new Date(data.endDate).getTime() < new Date().getTime()){
      return null
    }}
  return (
    <div className="fineart__item products__item round" style={{maxWidth: '250px'}}>
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
      <div className="products__item-img">
      <div className='products__item-type' style={{position: 'relative', width: '35px', left: '-45%'}}>
{data.nftType === 'gif' ? <img src='/img/icon-gif.svg'/>: [data.nftType === 'video' ? <img src='/img/icon-video.svg'/> : <img src='/img/icon-picture.svg'/>]}
        </div>
        <div className="item-img__cover">
          <Link href={`/product/${_id}`}>
            <img style={{ cursor: 'pointer', borderRadius: '50%' }} src={data.img} alt="img" />
          </Link>
        </div>
        {mark && (
          <div className="products__item-mark">
            <img src="/img/mark.png" alt="mark" />
          </div>
        )}
      </div>
      <div className="products__item-title">{title}</div>
      <div className="products__item-name">{owner.name}</div>
      <div className="products__item-stats">
        <div className="item-stats__views">
          <i className="flaticon-eye" /> <span>{views}</span>
        </div>
        <Favorite data={data} />
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

export default FineArtItem;
