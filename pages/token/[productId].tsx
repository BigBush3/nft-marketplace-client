/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import axios from 'axios'
import router from 'next/router';
import { SettingsRemoteTwoTone } from '@material-ui/icons';
import Theme from '../../components/Theme';
import Header from '../../components/global/Header';
import OwnerDropdownItem from '../../components/global/OwnerDropdownItem';
import PlaceBidModal from '../../components/global/PlaceBidModal';
import CheckoutModal from '../../components/global/CheckoutModal';
import Likes from '../../components/global/Likes';
import Favorite from '../../components/global/Favorite';
import ButtonsStyled from '../../components/product/ButtonsStyled';
import ShareModal from '../../components/global/ShareModal';
import {FacebookShareButton, TelegramShareButton, TwitterShareButton} from 'react-share'
import cookie from 'js-cookie'
import * as utils from '../../utils';
import type * as Types from '../../types';
import { getTokenOwnHistory, getAllTokenHistory, getAllBidHistory } from '../../utils/blockchain';
import { Link } from '@material-ui/core';



interface ProductProps {
  app?: Types.AppProps;
}

/**
 * Страница одного товара
 * @param props
 * @returns
 */
function NftToken({app, nft}): React.ReactElement {
  const data = JSON.parse(nft)
  const { lang } = app;
  const [item, setItem] = useState();
  const [open, setOpen] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState(false)
  const [openBid, setOpenBid] = useState(false)
  const [historyItem, setHistoryItem] = useState([])

  const [openHistory, setOpenHistory] = useState(false)
  const [openShare, setOpenShare] = useState(false)

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
  const Footer = useMemo(() => {
    return dynamic<any>(() => import('../../components/global/Footer').then((mod) => mod.default));
  }, []);

  useEffect(() => {
   setItem(data)
   /* axios.post("https://nft-marketplace-api-plzqa.ondigitalocean.app/nft/views", {product: data._id}) */
  }, []);
  
  const historyHandler = async () => {
    const responseHistory = await axios.get(`https://nft-marketplace-api-plzqa.ondigitalocean.app/nft/history/${router.query.productid}`)
    console.log(responseHistory)
    console.log('something')
    if (openHistory){
      setOpenHistory(false)
    } else {
      setOpenHistory(true)
    }
    
  }
  return (
    <Theme>
      <Header app={app} />
      <div className="wrapper">
        <div className="content single-product">
          <main className="main product">
            <div className="heading center">
              <h1>{data.title}</h1>
            </div>

            <div className="product__block">
              <div className="product__image">
              {data.nftType === 'video' ? <video src={data.img} width="700" height="700" style={{width: '100%', height: '100%'}} controls webkit-playsinline playsInline autoPlay loop muted>
     </video> : <img src={data.img} style={{maxHeight: '700px'}} alt="img" />}
                <div className='verified__gold'>
                  {data.verified ? <img src="/img/verified-gold.png" alt="" /> : null}
                 
                </div>
                
                <a href={data.img} className="product__image-resize">
                  <span />
                </a>
              
              </div>
              <div className="product__bottom">
            
              {data.pdf !== 'https://inifty.mypinata.cloud/ipfs/' && <div className="product__doc">
                  <a href={data.pdf} target="_blank" rel="noreferrer">
                    <i className="flaticon-file" /> <span>{lang.documents}</span>
                  </a>
                </div>}

                <div className="product__buy button">
                {data.owner._id === cookie.get('id') ? <button className='fill buy' onClick={() => router.push({pathname: '/update-one', query: {id: data._id}})}><span>{lang.pageNames.resell}</span></button>: <h1 style={{fontWeight: 'bold', color: 'red', fontSize: '25px'}}>{data.type === 'timedAuction' ? 'Auction ended': 'Sold out'}</h1>}
                </div>
              </div>
            </div>
          </main>

          <aside className="aside author">
{/*             <div className="author__rate">{lang.highestBid} 0.02 ETH</div> */}
            <div className="author__block">
              <div className="author__img" onClick={() => router.push(`/cabinet/${data.author._id}`)}>
                <img src={data.author.imgUrl ? data.author.imgUrl : '/img/avatar_0.png'} alt="img" />
              </div>
              <div className="author__cover">
              <div className="author__status">
                  {lang.author}
                  <div className="products__item-info info">
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
                </div>
                <div className="author__name">{data.author.name}</div>
                <div className="author__count">{data.amount ? `${data.amount}/${data.initialAmount}` : '1/1'}</div>
              </div>
            </div>
            <div className="author__text">
              <div>{data.hashtags.map((item) => {
                return (<span>#{item.text} </span>)
              })}</div>
                            { data.collect?._id ? <span style={{display: 'flex'}}>Collection name:&nbsp; <Link href={`/collection/${data.collect._id}`}>
              <a>{data.collect.title}</a>
              </Link></span> : null}
              <hr />
              <div></div>
              
              
              <p>
                {data.description}
              </p>
            </div>
            <div className="author__buttons button">
            </div>
            <div className="author__sale">
              <span>{data.royalty}%</span> of sales will go to creator
            </div>
{/*               {data.type === 'orderSell' ? null :  <div className="author__bid">
              <div className="author__bid-img">
                <img src={data.owner.imgUrl} alt="img" />
              </div>
              <div className="author__bid-cover">
                <div className="author__bid-title">
                  Highest bid by <span>{data.owner.name}</span>
                </div>
                <div className="author__bid-value">
                  <span className="eth">{data.currentBid} ETH</span>
                </div>
              </div>
            </div>
          }    */}   
            </aside>
        </div>
        <Footer {...app} />
      </div>
    </Theme>
  );
}

NftToken.getInitialProps = async ({req, res, query}) => {
  const response = await axios.get(`https://nft-marketplace-api-plzqa.ondigitalocean.app/nft/token/${query.productId}`)
  return {nft: JSON.stringify(response.data)}
}

export default NftToken;
