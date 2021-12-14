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
import Web3 from 'web3';
import type * as Types from '../../types';
import { getTokenOwnHistory, getAllTokenHistory, getAllBidHistory } from '../../utils/blockchain';
import { Link } from '@material-ui/core';
import { CircularProgress, Snackbar } from '@material-ui/core';

import moment from 'moment'

import {
	NFT_ABI, 
	NFT_ADDRESS, 

	NFTSTORE_ADDRESS, 
	NFTSTORE_ABI,
	
	TIMEDAUCTION_ABI,
	TIMEDAUCTION_ADDRESS,
	
	SIMPLEAUCTION_ABI,
	SIMPLEAUCTION_ADDRESS,

	RINKEBY_RPC_URL, 
	ULR_INFURA_WEBSOCKET, 
	EVENTS_TOPICS
} from '../../config/default.json'



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
  const [historySpinner, setHistorySpinner] = useState(false)
  const [openBids, setOpenBids] = useState(false)
  const [openHistory, setOpenHistory] = useState(false)
  const [openShare, setOpenShare] = useState(false)
  const [bids, setBids] = useState([])
  const [wideHistory, setWideHistory] = useState([])
  const getProvider = () => {
    const provider = new Web3.providers.WebsocketProvider(ULR_INFURA_WEBSOCKET)
    provider.on('connect', () => console.log('WS Connected'))
    provider.on('error', () => {
      console.error('WS Error')
      web3.setProvider(getProvider())
    })
    provider.on('end', () => {
      console.error('WS End')
      web3.setProvider(getProvider())
    })

    return provider
  }
  const web3 = new Web3(Web3.givenProvider || getProvider())
  const getBids = async () => {
    const allBidHistory = await getAllBidHistory(data.tokenId)
    if (allBidHistory){
      let users = []
      let clearBids = []
      for (const item of allBidHistory) {
        users.push(item.returnValues.user.toLowerCase())
        clearBids.push({event: item.event, bidIndex: item.returnValues.bidIndex, user: item.returnValues.user.toLowerCase(), tokenId: item.returnValues.tokenId, value: Web3.utils.fromWei(String(item.returnValues.value), 'ether', ), time: (await web3.eth.getBlock(item.blockNumber)).timestamp})
      }
      const resBids = await axios.post('https://nft-marketplace-api-plzqa.ondigitalocean.app/nft/history', {history: users})
      for(let i = 0; i < clearBids.length; i++){
        for(let j = 0; j < resBids.data.result.length; j++){
            if (resBids.data.result[j].wallet === clearBids[i].user){
              clearBids[i].user = resBids.data.result[j]
            }
          
        }
      }
      clearBids = clearBids.sort((a,b) => {
        return b.time - a.time
      })
      setBids(clearBids)
    }
  }
  const bidHandler = async () => {
    if (openHistory){
      setOpenHistory(false)
    }
    if (!openBids){
    setHistorySpinner(true)
    await getBids()
    setHistorySpinner(false)
    }
    setOpenBids(!openBids)
    
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
  const Footer = useMemo(() => {
    return dynamic<any>(() => import('../../components/global/Footer').then((mod) => mod.default));
  }, []);

  useEffect(() => {
   setItem(data)
   /* axios.post("https://nft-marketplace-api-plzqa.ondigitalocean.app/nft/views", {product: data._id}) */
  }, []);
  
  const historyHandler = async () => {
    if (openBids){
      setOpenBids(false)
    }
    setHistorySpinner(true)
    let oneList = []
    let fullHistory = []
    let clearList = []
    if (!openHistory){
    const allTokenHistory = await getAllTokenHistory(data.tokenId)
      console.log(allTokenHistory)
    for (const item of allTokenHistory) {
      if (item.event === 'Create'){
        oneList.push(item.returnValues.creator.toLowerCase())
        clearList.push({user: item.returnValues.creator.toLowerCase(), event: 'Minted by', time: (await web3.eth.getBlock(item.blockNumber)).timestamp})
      }
      else if (item.event === 'FixOrder'){
        oneList.push(item.returnValues.seller.toLowerCase())
        clearList.push({user: item.returnValues.seller.toLowerCase(), event: 'Listed for', time: (await web3.eth.getBlock(item.blockNumber)).timestamp, price: Web3.utils.fromWei(String(item.returnValues.price), 'ether')})
      } else if(item.event === 'Deal'){
        oneList.push(item.returnValues.addressFrom.toLowerCase())
        oneList.push(item.returnValues.addressTo.toLowerCase())
        clearList.push({userFrom: item.returnValues.addressFrom.toLowerCase(), userTo: item.returnValues.addressTo.toLowerCase(), event: 'Purchased for', time: (await web3.eth.getBlock(item.blockNumber)).timestamp, price: Web3.utils.fromWei(String(item.returnValues.price), 'ether')})
      } else if(item.event === 'AuctionOrder'){
        oneList.push(item.returnValues.seller.toLowerCase())
        clearList.push({user: item.returnValues.seller.toLowerCase(), event: 'Auctioned for', time: (await web3.eth.getBlock(item.blockNumber)).timestamp, price: Web3.utils.fromWei(String(item.returnValues.minValue), 'ether')})
      } else if(item.event === 'AuctionBid'){
        oneList.push(item.returnValues.user.toLowerCase())
        clearList.push({user: item.returnValues.user.toLowerCase(), event: 'Bid', time: (await web3.eth.getBlock(item.blockNumber)).timestamp, price: Web3.utils.fromWei(String(item.returnValues.value), 'ether')})
      } else if(item.event === "UpdateBidAuction"){
        oneList.push(item.returnValues.user.toLowerCase())
        clearList.push({user: item.returnValues.user.toLowerCase(), event: 'Bid', time: (await web3.eth.getBlock(item.blockNumber)).timestamp, price: Web3.utils.fromWei(String(item.returnValues.value), 'ether')})
      
      }
    }
    const yourmom = await axios.post('https://nft-marketplace-api-plzqa.ondigitalocean.app/nft/history', {history: oneList})
    setWideHistory(allTokenHistory)
    for(let i = 0; i < clearList.length; i++){
      for(let j = 0; j < yourmom.data.result.length; j++){
        if (clearList[i].event === 'Purchased for'){
          console.log(yourmom.data.result[j].wallet)
          if (yourmom.data.result[j].wallet === clearList[i].userFrom){
            clearList[i].userFrom = yourmom.data.result[j]
          } else if (yourmom.data.result[j].wallet === clearList[i].userTo){
            clearList[i].userTo = yourmom.data.result[j]
          }
        } else {
          if (yourmom.data.result[j].wallet === clearList[i].user){
            clearList[i].user = yourmom.data.result[j]
          }
        }
      }
    }
    clearList = clearList.sort((a, b) => {
      if (a.time < b.time){
        return 1
      }
      return -1
    })
    
    setWideHistory(clearList)
    }
    setHistorySpinner(false)
    setOpenHistory(!openHistory)
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
              <div className="author__buttons button">
            <button className='fill buy' onClick={async () => {await historyHandler()}}><span>{lang.tokenHistory}</span></button>
            {data.type === 'timedAuction' ? <button className='fill buy' onClick={async () => {await bidHandler()}}><span>{lang.auction.historyOfBids}</span></button> : null}
            </div>
            {historySpinner && <CircularProgress/>}
            {openHistory ? [wideHistory.map((item, index, array) => {
              return (
                <div style={{display: 'flex', marginTop: '15px', fontSize: '14px'}}>
                  <div className='history_img' style={{marginRight:'10px'}}>
                    {item.event === 'Purchased for' ? <Link href={item.user?._id ? `/cabinet/${item.user?._id}` : `/cabinet/${item.userTo?._id}`}><img style={{width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer'}} src={item.userTo?.imgUrl ? item.userTo?.imgUrl : '/img/avatar_0.png'} alt="/img/avatar_0.png" />
                    </Link>: <Link href={item.user?._id ? `/cabinet/${item.user?._id}` : `/cabinet/${item.userTo?._id}`}><img style={{width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer'}} src={item.user?.imgUrl ? item.user?.imgUrl : '/img/avatar_0.png'} alt="/img/avatar_0.png" />
                    </Link>}
                    
                  </div>
                  <div>
                      <div>
                        {item.event === 'Minted by' ? <p>{item.event + ' ' + item.user?.name}</p> : <p>{`${item.event} ${item.price} ETH`}</p>}
                        
                      </div>
                      <div>
                        {item.event === 'Minted by' ? <p>{moment.unix(item.time).format("MM/DD/YYYY, HH:mm")}</p> : <p>by {item.event === 'Purchased for' ? <Link href={`/cabinet/${item.userTo?._id}`}>{item.userTo?.name}</Link> : <Link href={`/cabinet/${item.user?._id}`}>{item.user?.name}</Link>}, {moment.unix(item.time).format("MM/DD/YYYY, HH:mm")}</p>}
                      </div>
                  </div>
                </div>
              )
            })] : null}
            {
              openBids ? [bids.map((item, index, array) => {
                return (
                  <div style={{display: 'flex', marginTop: '15px', fontSize: '14px'}}>
                    <div className='history_img' style={{marginRight:'10px'}}>
                      <Link href={`/cabinet/${item.user?._id}`}><img style={{width: '50px', height: '50px', borderRadius: '50%', cursor: 'pointer'}} src={item.user?.imgUrl !== '' ? item.user?.imgUrl : '/img/avatar_0.png'} alt="/img/avatar_0.png" />
                      </Link>
                      
                    </div>
                    <div>
                        <div>
                          <p>{`Bid ${item.value} ETH`}</p>
                          
                        </div>
                        <div>
                          <p>by <Link href={`/cabinet/${item.user?._id}`}>{item.user.name}</Link>, {moment.unix(item.time).format("MM/DD/YYYY, HH:mm")}</p>
                        </div>
                    </div>
                  </div>
                )
              })]: null
            }
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
