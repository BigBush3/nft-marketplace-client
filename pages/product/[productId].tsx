/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useRef, useMemo } from 'react';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import axios from 'axios'
import router from 'next/router';
import { SettingsRemoteTwoTone, Web } from '@material-ui/icons';
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
import Web3 from 'web3';
import cookie from 'js-cookie'
import * as utils from '../../utils';
import type * as Types from '../../types/index.d';
import { getTokenOwnHistory, getAllTokenHistory, getAllBidHistory } from '../../utils/blockchain';
import WideHistory from '../../components/global/WideHistory'
import { CircularProgress, Snackbar } from '@material-ui/core';
import connectMetaMask from '../../components/global/metamask'
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
import Link from 'next/link';



interface ProductProps {
  app?: Types.AppProps;
}

/**
 * Страница одного товара
 * @param props
 * @returns
 */
interface iMaxBid {
  user: any;
  value: any;
}
function Product({app, data, user, userData}): React.ReactElement {
  const { lang } = app;
  const [item, setItem] = useState();
  const [openSnackbar, setOpenSnackbar] = useState(false)
  const [open, setOpen] = useState<boolean>(false);
  const [openModal, setOpenModal] = useState(false)
  const [historySpinner, setHistorySpinner] = useState(false)
  const [favNfts, setFavNfts] = useState(userData?.favouriteNfts)
  const [likedNfts, setLikedNfts] = useState(userData?.AccLikes)
  const [openBid, setOpenBid] = useState(false)
  const [openHistory, setOpenHistory] = useState(false)
  const [likes, setLikes] = useState(data.likes)
  const [openShare, setOpenShare] = useState(false)
  const [historyItem, setHistoryItem] = useState([])
  const [wideHistory, setWideHistory] = useState([])
  const [endSpinner, setEndSpinner] = useState(false)
  const [maxBid, setMaxBid] = useState<iMaxBid>()
  const [openBids, setOpenBids] = useState(false)
  const [bids, setBids] = useState([])
  const [groupedBids, setGrouped] = useState([])
  const subscription = (contractAddress, topic)=>{
    console.log('start subscription')
    console.log('contractAddress: ', contractAddress)
    console.log('topic: ', topic)
    return web3.eth.subscribe('logs', {
        address: contractAddress,
        topics: [topic]
    })
  } 
  const handleCloseSnack = () => {
    setOpenSnackbar(false)
  }
  const web3 = new Web3(Web3.givenProvider || new Web3.providers.WebsocketProvider(ULR_INFURA_WEBSOCKET));
  //@ts-ignore
  let TIMEDAUCTION = new web3.eth.Contract(TIMEDAUCTION_ABI, TIMEDAUCTION_ADDRESS)//@ts-ignore
  let NFTSTORE = new web3.eth.Contract(NFTSTORE_ABI, NFTSTORE_ADDRESS)
  //@ts-ignore
  let NFT = new web3.eth.Contract(NFT_ABI, NFT_ADDRESS)
  const Footer = useMemo(() => {
    return dynamic<any>(() => import('../../components/global/Footer').then((mod) => mod.default));
  }, []);
  function userExists(username) {
    if (favNfts){
      return favNfts.some(function(el) {
  if (el?._id){
   return el?._id === username; 
  } else {
    return false
  }
  
}); 
}

  }
  function deleteFav(){
    if (favNfts){
          const removeIndex = favNfts.findIndex( item => item?._id === data._id );
// remove object
      favNfts.splice( removeIndex, 1 );
    }

  }
  function likeExists(username){
 
    if (likedNfts){
      return likedNfts.some(function(el) {
  if (el?._id){
   return el?._id === username; 
  } else {
    return false
  }
  
}); 
}
  }
  function deleteLike(){
    const removeIndex = likedNfts.findIndex( item => item._id === data._id );
// remove object
likedNfts.splice( removeIndex, 1 );
  }
  useEffect(() => {
    console.log(user)
    setItem(data)
    const beach = async () => {
      await getBids()
    }
    beach()
    axios.post("https://nft-marketplace-api-plzqa.ondigitalocean.app/nft/views", {product: data._id})
      const handler = async () => {
       const userHistory = await axios.get(`https://nft-marketplace-api-plzqa.ondigitalocean.app/user/${cookie.get('id')}`)
       setFavNfts(userHistory.data.favouriteNfts)
       setLikedNfts(userHistory.data.accLikes)
      }
      if (cookie.get('id')){
       handler() 
      }
      
      
  }, []);
  useEffect(() => {
    const beach = async () => {
      await getMaxBid()
    }
    beach()
  }, [bids])
  const handleClose = async () => {
    await getBids()
    await getMaxBid()
    setOpenBid(false);
    setOpenSnackbar(true)
  };
  const handleCloseCheckout = () => {
    
    setOpenModal(false)
  }
  const handleCloseShare = () => {
    setOpenShare(false)
  }
  const calculateTimeLeft = () => {
    let difference = +new Date(data?.endDate) - +new Date();
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
const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
  });
  const getMaxBid = async () => {
    let grouped = Array.from(
      bids.reduce(
          (m, { user, value }) => m.set( user, (m.get(user) || 0) + Number(value)),
          new Map
      ).entries(),
      ([user, value]) => ({ user, value })
  );
      grouped = grouped.sort((a,b) => {
        return b.value - a.value
      })
      setGrouped(grouped)
      setMaxBid(grouped[0])

  }
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
  const getGasFee = async(gasLimit)=>{
    let result = 0
    await NFTSTORE.methods.getGasFee(gasLimit).call({}, (err, res)=>{
      console.log(`gasFee - ${res}`)
      result = res
    })
    return result;
  }
  
  const gasFee = {
    createAuction: 180100,
    createOrderSell: 159100,
    returnFreeBalance: 58100,
  
    createBidAuction: 216400,
    updateBidAuction: 76700,
    finishAuction: 144800,
    cancelAuction: 59700,
  
    buyOrder :136500,
      cancelOrderSell :63100,
      createBidMarket : 219800,
      realizeBid : 140500,
      cancelBid :58500
  }
  const finishAuction = async ()=> {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const walletAddress = accounts[0];
    const wallet = await new Web3(window.ethereum);
    if (maxBid?.user){
    let fee = await getGasFee(gasFee.finishAuction)
    let txData = TIMEDAUCTION.methods.finishAuction(NFT_ADDRESS, data.tokenId, data.orderIndex).encodeABI()
    if(!wallet){
      alert('you have to connect cryptowallet')
    } else {
      await wallet.eth.sendTransaction({
              from: walletAddress,
              to: TIMEDAUCTION_ADDRESS,
              
              value: web3.utils.toWei(String(fee/1e18)),
              data: txData
          },
          function(error, res){
              console.log(error);
              console.log(res);
          }
      )		
    }
    await axios.post("https://nft-marketplace-api-plzqa.ondigitalocean.app/nft/buy", {ownerId: cookie.get("id"), buyerId: maxBid.user._id, tokenId: router.query.productId, action: `${maxBid.user.name} won this auction!`})
    router.push(`/cabinet/${maxBid.user._id}`)
    } else {
      let fee = await getGasFee(gasFee.cancelAuction)
      let txData = TIMEDAUCTION.methods.cancelAuction(NFT_ADDRESS, data.tokenId, data.orderIndex).encodeABI()
      if(!wallet){
        alert('you have to connect cryptowallet')
      } else {
        await wallet.eth.sendTransaction({
                to: TIMEDAUCTION_ADDRESS,
                from: walletAddress,
                value: web3.utils.toWei(String(fee/1e18)),
                data: txData
            },
            function(error, res){
                console.log(error);
                console.log(res);
            }
        )		
      }
      await axios.post("https://nft-marketplace-api-plzqa.ondigitalocean.app/nft/buy", {ownerId: cookie.get("id"), buyerId: cookie.get('id'), tokenId: router.query.productId, action: `${cookie.get('name')} end this auction!`})
      router.push(`/cabinet/${cookie.get('id')}`)
    }
/* 
    if (maxBid.user){


    } else {
      await axios.post("https://nft-marketplace-api-plzqa.ondigitalocean.app/nft/buy", {ownerId: cookie.get("id"), buyerId: cookie.get('id'), tokenId: router.query.productId, action: `${cookie.get('name')} end auction`})
      router.push(`/cabinet/${cookie.get('id')}`)
    } */
  }
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
  const endHandler = async () => {
    setEndSpinner(true)
    await finishAuction()
  }
  const ownerHandler = async () => {
    if (!open){
const el = []
    try {
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
    } catch (err) {
      console.log(err.message)
    }

    }
    setOpen(!open)
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
     </video> : <img src={data.img} alt="img" />}
                
                <div className='verified__gold'>
                  {data.verified ? <img src="/img/verified-gold.png" alt="" /> : null}
                 
                </div>
                
                <a href={data.img} className="product__image-resize">
                  <span />
                </a>
              
              </div>
              <div className="product__bottom">
                <div className="product__views">
                  <i className="flaticon-eye" /> <span>{data?.views}</span>
                </div>
                {item && (
                  <>
                    <Favorite data={data}/>
                    <Likes data={data}/>
                  </>
                )}
                <div className="product__share">
                  <button onClick={() => setOpenShare(true)}>
                    <i className="flaticon-share" /> <span>{lang.share}</span>
                  </button>
                </div>
                {data.pdf !== 'https://inifty.mypinata.cloud/ipfs/' && <div className="product__doc">
                  <a href={data.pdf} target="_blank" rel="noreferrer">
                    <i className="flaticon-file" /> <span>{lang.documents}</span>
                  </a>
                </div>}


                <div className="product__buy button">
                  {data.owner._id === cookie.get('id') ? 
                  [data.type === 'orderSell' ? <button className='fill buy' onClick={() => setOpenModal(true)}><span>{lang.auction.purchase}</span></button> : 
                   [new Date(data.endDate).getTime() < new Date().getTime() && <button className='fill buy' onClick={endHandler}><span>{endSpinner ? <CircularProgress/> : <p>{lang.auction.endAuction}</p>}</span></button>]] 
                   : [data.type === 'orderSell' ? <button className='fill buy' onClick={() => setOpenModal(true)}><span>{lang.auction.purchase}</span></button> :  [new Date(data.endDate).getTime() < new Date().getTime() ? null : <button className='fill buy' onClick={async () => {await getBids;setOpenBid(true)}}><span>{lang.auction.makeBid}</span></button>]]}
                  
                </div>
              </div>
            </div>
          </main>

          <aside className="aside author">
{/*             <div className="author__rate">{lang.highestBid} 0.02 ETH</div> */}
            <div className="author__block">
              <div className="author__img" onClick={() => router.push(`/cabinet/${user ? user._id : data.owner._id}`)}>
                <img src={user ? user.imgUrl : data.owner.imgUrl} alt="img" />
              </div>
              <div className="author__cover">
                <div className="author__status">
                  {lang.author}
                </div>
                {user ?<div style={{cursor: 'pointer'}} onClick={() => router.push(`/cabinet/${user._id}`)} className="author__name">{user.name}</div> : <div style={{cursor: 'pointer'}} onClick={() => router.push(`/cabinet/${data.owner._id}`)} className="author__name">{data.owner.name}</div>
                }
                
                <div className="author__count">{data.amount ? `${data.amount}/${data.amount}` : '1/1'}</div>
              </div>
            </div>
            <div className="author__text">
              <div>{data.hashtags.map((item) => {
                return (<span>#{item.text} </span>)
              })}</div>
              <span style={{display: 'flex'}}>Collection name: {data.collect}</span>
              <hr />
              <div></div>
              {data.type === 'orderSell' ? null : new Date(data.startDate).getTime() > new Date().getTime() ? null : [new Date(data.endDate).getTime() < new Date().getTime() ? <h1 className='auction_end'>{lang.auction.auctionEnded}</h1>: [timeLeft.days === 0 ? <div className='timer_fill' style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}><p style={{color: 'white', fontSize: '10px'}}>Auction ends in</p><h1>{`${timeLeft.hours < 10? '0' + String(timeLeft.hours): timeLeft.hours} : ${timeLeft.minutes < 10? '0' + String(timeLeft.minutes): timeLeft.minutes} : ${timeLeft.seconds < 10? '0' + String(timeLeft.seconds) :timeLeft.seconds}`}</h1></div>: 
        <div className='timer_fill' style={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}><p style={{color: 'white', fontSize: '10px'}}>Auction ends in</p><h1>{`${timeLeft.days < 10? '0' + String(timeLeft.days): timeLeft.days} : ${timeLeft.hours < 10? '0' + String(timeLeft.hours): timeLeft.hours} : ${timeLeft.minutes < 10? '0' + String(timeLeft.minutes): timeLeft.minutes} : ${timeLeft.seconds < 10? '0' + String(timeLeft.seconds) :timeLeft.seconds}`}</h1></div>]]}
              
              <p>
                {data.description}
              </p>
            </div>
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
            <div className="author__sale">
              <span>{data.royalty}%</span> of sales will go to creator
            </div>
{    maxBid ?          <div className="author__bid">
              <div className="author__bid-img">
                <Link href={`/cabinet/${maxBid.user._id}`}><img style={{width: '75px', height:'75px', borderRadius: '50%', cursor: 'pointer'}} src={maxBid.user.imgUrl || 'unknown'} alt="img" /></Link>
              </div>
              <div className="author__bid-cover">
                <div className="author__bid-title">
                  Highest bid by <span>{maxBid.user.name}</span>
                </div>
                <div className="author__bid-value">
                  <span className="eth">{maxBid.value} ETH</span>
                </div>
              </div>
            </div>
           : null   }   
            </aside>
        </div>
        <PlaceBidModal app={app} open={openBid} data={data} handleClose={handleClose} bids={bids} groupedBids={groupedBids}/>
        <CheckoutModal app={app} data={data} open={openModal} handleClose={handleCloseCheckout}/>
        <ShareModal app={app} data={data} open={openShare} handleClose={handleCloseShare}/>
        <Footer {...app} />
      </div>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={openSnackbar}
        autoHideDuration={2000}
        onClose={handleCloseSnack}
        message="Your bid proceed successfull!"
      />
    </Theme>
  );
}

Product.getInitialProps = async ({req, res, query}) => {
  let clear = []
  const response = await axios.get(`https://nft-marketplace-api-plzqa.ondigitalocean.app/nft/${query.productId}`)
  let userData
  if (req?.cookies?.id){
   userData = await axios.get(`https://nft-marketplace-api-plzqa.ondigitalocean.app/user/${req.cookies.id}`) 
  }
  
  const history = await getTokenOwnHistory(47)
  if (history[0]){
      clear.push(history[0].returnValues.addressFrom.toLowerCase())
  const finalHistory = await axios.post('https://nft-marketplace-api-plzqa.ondigitalocean.app/nft/history', {history: clear})
  return {data: response.data, user: finalHistory[0]}}
  return {data: response.data, userData: userData?.data}


}

export default Product;
