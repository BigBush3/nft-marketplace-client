/* eslint-disable jsx-a11y/no-noninteractive-element-to-interactive-role */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, useMemo, useRef } from 'react';
import clsx from 'clsx';
import dynamic from 'next/dynamic';
import { GetServerSidePropsContext } from 'next';
import { makeStyles } from '@material-ui/core/styles';

import Web3 from 'web3';
import { useRouter } from 'next/router';
import cookie from 'js-cookie'
import axios from 'axios';
import MarketplaceItem from '../../components/global/MarketplaceItem';
import CollectionItem from '../../components/global/CollectionItem';
import Header from '../../components/global/Header';
import * as utils from '../../utils';
import type * as Types from '../../types/index.d';
import Theme from '../../components/Theme';
import * as clipboard from "clipboard-polyfill/text";
import Modal from '@material-ui/core/Modal';
import Snackbar from '@material-ui/core/Snackbar';
import connectMetaMask from '../../components/global/metamask'
import { getItems } from '../../utils/data';
import { CircularProgress } from '@material-ui/core';


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
import moment from 'moment';
import Link from 'next/link';


const { SLIDER_PRODUCTS_PART } = utils.c;

const useStyles = makeStyles({
  div: {
    width: '210px',
  },
  right: {
    margin: '0 15px 6px auto',
  },
  image: {
    borderRadius: '8px',
  },
  center: {
    margin: '0 auto 6px auto',
  },
});


/**
 * Страница Личный кабинет пользователя
 * @param props
 * @returns
 */
function Cabinet(props): React.ReactElement {
  const router = useRouter()
  const { app, data } = props;
  const { lang } = app;
  const [active, setActive] = useState<number>(0);
  const [show, setShow] = useState<boolean>(false);
  const [sub, setSub] = useState(false)
  const [open, setOpen] = useState(false)
  const [openBids, setOpenBids] = useState(false)
  const [progress, setProgress] = useState(false)
  const [followers, setFollowers] = useState(data.followers)
  const [followings, setFollowings] = useState(data.followings)
  const [openSnack, setOpenSnack] = React.useState(false);
  const [bidHistory, setBidHistory] = useState([])
  const web3 = new Web3(Web3.givenProvider || new Web3.providers.WebsocketProvider(ULR_INFURA_WEBSOCKET));
  //@ts-ignore
  let TIMEDAUCTION = new web3.eth.Contract(TIMEDAUCTION_ABI, TIMEDAUCTION_ADDRESS)
  const handleCloseBids = () => {
    setOpenBids(false)
  }
  const handleClose = (event, reason) => {
    setOpenSnack(false);
  };
  const Footer = useMemo(() => {
    return dynamic<any>(() => import('../../components/global/Footer').then((mod) => mod.default));
  }, []);
  const getBlock = async(timeFrom)=>{
    if(timeFrom==='latest'){
      return web3.eth.getBlockNumber()
    }
  }
  //@ts-ignore
  let NFTSTORE = new web3.eth.Contract(NFTSTORE_ABI, NFTSTORE_ADDRESS)
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
  const getGasFee = async(gasLimit)=>{
    let result = 0
    await NFTSTORE.methods.getGasFee(gasLimit).call({}, (err, res)=>{
      console.log(`gasFee - ${res}`)
      result = res
    })
    return result;
  }
  const returnFreeBalance = async ()=> {
    const metamask = await connectMetaMask()
    const walletAddress = metamask.userAddress
    const wallet = metamask.web3
    let fee = await getGasFee(gasFee.returnFreeBalance)
    let txData = NFTSTORE.methods.returnFreeBalance().encodeABI()
    if(!wallet){
      alert('you have to connect cryptowallet')
    } else {
      wallet.eth.sendTransaction({
              to: NFTSTORE_ADDRESS,
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
  }
const getUpdatedBidByToken = async(userAddress)=>{
	let res
	await TIMEDAUCTION.getPastEvents(
		'UpdateBidAuction', 
		{
			fromBlock: 0,
			toBlock: 'latest',
			filter: {
				user: userAddress
			}
		}, 
		(err, events) => {
			if(events!=null){
				res = events
			}
		})
	return res
}
  const getAllUserAuctionBids = async(userAddress)=>{
     let res
    await TIMEDAUCTION.getPastEvents(
      'AuctionBid', 
      {
        fromBlock: 0,
        toBlock: 'latest',
        filter: {
          user: userAddress
        }
      }, 
      (err, events) => {
        if(events!=null){
          res = events
        }
      })
    return res
  }
  useEffect(() => {
    setTimeout(() => {
      setShow(true);
    }, 500);
    $(document).on('click', '.cabinet_top_user_link', () => {
      const e = $(this),
        val = e.text(),
        f = $('<input>');

      e.toggleClass('icon-copy icon-copy_fill');

      $('body').append(f);
      f.val(val).select();
      document.execCommand('copy');
      f.remove();

      setTimeout(() => {
        e.toggleClass('icon-copy icon-copy_fill');
      }, 1000);
    });
  }, [active]);
  async function subscribeHandler(){
    setProgress(true)
    if (cookie.get('id')){
         setSub(true)
    setFollowers(followers.push({name: cookie.get('name'), imgUrl: cookie.get('imgUrl'), _id: cookie.get('id')}))
    try {
      await axios.post('https://nft-marketplace-api-plzqa.ondigitalocean.app/user/follow', {id: cookie.get('id'), user: router.query})
    } catch (err) {
      console.log(err.message)
    }
     
    } else {
      // @ts-ignore
      document.querySelector('.open_connect').click();
    }
    setProgress(false)
    
  }
  const asHandler = async() => {
    setOpenBids(true)
    let clearHistory = []
    let tokenIds= []
    let history = await getAllUserAuctionBids(cookie.get('wallet'))
    const secHistory = await getUpdatedBidByToken(cookie.get('wallet'))
    history = [...history, ...secHistory]
    for (const item of history) {
      tokenIds.push(item.returnValues.tokenId)
      clearHistory.push({nft: item.returnValues.tokenId, bid: web3.utils.fromWei(String(item.returnValues.value), 'ether'), time: (await web3.eth.getBlock(item.blockNumber)).timestamp})
    }
    const finalHistory = await axios.post('https://nft-marketplace-api-plzqa.ondigitalocean.app/nft/nftHistory', {history: tokenIds})
    for (let i = 0; i < clearHistory.length; i++) {
      for (const item of finalHistory.data.result) {
        console.log(item.tokenId, clearHistory[i].nft)
        if (Number(clearHistory[i].nft) === Number(item.tokenId)){
          clearHistory[i].nft = item
        }
      }
      

    }
    clearHistory.sort((a, b) => {
      return Number(a.time) - Number(b.time)
    })
    setBidHistory(clearHistory)
  }
  const returnBalance = async() => {

  }
  async function unSubscribeHandler(){
    setSub(false)
    setProgress(true)
    const index = followers.indexOf(cookie.get('id'))
    setFollowers(followers.splice(index, 1))
    try {
      await axios.post('https://nft-marketplace-api-plzqa.ondigitalocean.app/user/unfollow', {id:cookie.get('id'), user: router.query})
    } catch (err) {
      console.log(err.message)
    }
    
    setProgress(false)

    
  }
/*   function checkAvailability(arr, val) {
    if (arr){
      console.log(arr)
          return arr.some(function(arrVal) {
      return val === arrVal._id;
    });
    } else {
      return false
    }

  } */
  return (
    <Theme>
      <Header app={app}/>
      <div className="wrapper">
        <div className="cabinet_top">
          <div className="cabinet_top_bg">
            <span className="icon icon-edit_white" />
            {data.headerUrl ?    <picture>
              <source srcSet={data.headerUrl} />
              <img
                src={data.headerUrl}
                alt="img"
              />
            </picture>   :      <picture>
              <source srcSet="/images/bg.webp" type="image/webp" />
              <img
                src="/images/bg.jpg"
                alt="img"
                srcSet="/images/bg.jpg 1x, /images/bg@2x.jpg 2x"
              />
            </picture>}

          </div>
          <div className="cabinet_top_user">
            <div className="cabinet_top_user_img">
              {data.imgUrl ? <picture>
                <source srcSet={data.imgUrl}/>
                <img src={data.imgUrl} alt="" />
              </picture> : <picture><source srcSet="/img/avatar_0.png" /><img src="/img/avatar_0.png" alt="avatar" /></picture>}
            </div>
            <div className="cabinet_top_user_name">{data.name}</div>
            <div className="cabinet_top_user_link icon icon-copy" onClick={() => {
                clipboard.writeText(data.wallet).then(
                  function () {
                    setOpenSnack(true)
                  },
                  function () {
                    alert("error!");
                  }
                );
            }}>
              {data.wallet}
            </div>
          </div>
          {cookie.get('id') === data._id ?
          (<div className="cabinet_top_btns button">
            <a href="#" onClick={asHandler} className="btn btn_black fill">
              <span>{lang.cabinet.auctionBallance}</span>
            </a>
            <a href="#" onClick={returnBalance} className="btn btn_black fill">
              <span>Auction balanace</span>
            </a>
            {data.verified &&             <a href="/create" className="btn btn_black fill">
              <span>+ Create NFT</span>
            </a>}
          </div>): [ sub ? [progress ? <CircularProgress style={{display: 'flex', margin: 'auto'}}/> : <div className="cabinet_top_btns button">
            <button className="btn btn_black fill" onClick={unSubscribeHandler}>
              <span>Отписаться</span>
            </button>
          </div>] : [progress ? <CircularProgress style={{display: 'flex', margin: 'auto'}}/> :  <div className="cabinet_top_btns button">
            <button className="btn btn_black fill" onClick={subscribeHandler}>
              <span>Подписаться</span>
            </button>
          </div>]]}
        </div>

        <div className="cabinet_nav flex">
          {data.verified === true && <label
            role="button"
            onClick={() => {
              setShow(false);
              setActive(0);
            }}
            className={clsx('cabinet_nav_li', active === 0 && 'active')}
            htmlFor="slick-slide-control00">
            {lang.cabinet.created}
          </label>}
          <label
            role="button"
            onClick={() => {
              setShow(false);
              setActive(1);
            }}
            className={clsx('cabinet_nav_li', active === 1 && 'active')}
            htmlFor="slick-slide-control01">
            {lang.cabinet.inMarket}
          </label>
          <label
            role="button"
            onClick={() => {
              setShow(false);
              setActive(2);
            }}
            className={clsx('cabinet_nav_li', active === 2 && 'active')}
            htmlFor="slick-slide-control02">
            {cookie.get('id') === data._id ? lang.cabinet.myCollection : lang.cabinet.Collection}
          </label>
          <label
            role="button"
            onClick={() => {
              setShow(false);
              setActive(3);
            }}
            className={clsx('cabinet_nav_li', active === 3 && 'active')}
            htmlFor="slick-slide-control03">
            {lang.cabinet.favorites}
          </label>
          <label
            role="button"
            onClick={() => {
              setShow(false);
              setActive(4);
            }}
            className={clsx('cabinet_nav_li', active === 4 && 'active')}
            htmlFor="slick-slide-control04">
            {lang.cabinet.followers}
          </label>
          <label
            role="button"
            onClick={() => {
              setShow(false);
              setActive(5);
            }}
            className={clsx('cabinet_nav_li', active === 5 && 'active')}
            htmlFor="slick-slide-control05">
            {lang.cabinet.following}
          </label>
        </div>
        {data.verified === true && <div className="cabinet_block" hidden={active !== 0}>
          <div className="marketplace__items">
       {data.nfts.filter((item) => item.location !== 'collection').map((item) => {
              return <MarketplaceItem app={app} key={`MarketplaceItem-${item._id}`} data={item} />;
            })}
          </div>
        </div>}
        <div className="cabinet_block" hidden={active !== 1}>
        <div className="marketplace__items">
       {data.nfts.filter((item) => item.location !== 'collection').map((item) => {
              return <MarketplaceItem app={app} key={`MarketplaceItem-${item._id}`} data={item} />;
            })}
          </div>
        </div>
        <div className="cabinet_block" hidden={active !== 2}>
          {data.nfts.filter((item) => item.location === 'collection').map((item) => {
            return <CollectionItem app={app} key={`MarketplaceItem-${item._id}`} data={item} />;
          })}
        </div>
        <div className="cabinet_block" hidden={active !== 3}>
        <div className="marketplace__items">
       {data.favouriteNfts ? [data.favouriteNfts.map((item) => {
              return <MarketplaceItem app={app} key={`MarketplaceItem-${item._id}`} data={item} />;
            })] : <div>you dont have any favourite nft tokens</div>}
          </div>
        </div>
        <div className="cabinet_block" hidden={active !== 4}>
          <div className="cabinet_subs">
{/*             {followers ? [data.followers.map((item) => {
              return (
                            <a className="cabinet_sub" href={`/cabinet/${item._id}`}>
              <div className="cabinet_sub_img">
                <picture>
                  <img
                    src={item.imgUrl}
                    alt="img"
                  />
                </picture>
              </div>
              <span className="cabinet_sub_name">{item.name}</span>
            </a>
              )
            })] : <span>You don't have followers yet</span>} */}
          </div>
        </div>
        <div className="cabinet_block" hidden={active !== 5}>
          <div className="cabinet_subs">
          {data.followings ? [data.followings.map((item) => {
              return (
                            <a className="cabinet_sub" href={`/cabinet/${item._id}`}>
              <div className="cabinet_sub_img">
                <picture>
                  <img
                    src={item.imgUrl}
                    alt="img"
                  />
                </picture>
              </div>
              <span className="cabinet_sub_name">{item.name}</span>
            </a>
              )
            })] : <span>You don't have followings yet</span>}
          </div>
        </div>

        <Footer {...app} />
      </div>
      <Snackbar
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        open={openSnack}
        autoHideDuration={1000}
        onClose={handleClose}
        message="Copied!"
      />
          <Modal
    open={openBids}
    onClose={handleCloseBids}
    aria-labelledby="simple-modal-title"
    aria-describedby="simple-modal-description"
  ><div className='popup' style={{maxWidth: '720px', padding: '57px 68px 47px 16px'}}>
    <div>
      {bidHistory.map((item) => {
        console.log(item)
        if (item){
           return (
          <div style={{display: 'flex', justifyContent: 'flex-start'}}>
            
            <div>
              <img style={{width: '55px', height: '55px', borderRadius: '50%', paddingRight: '10px'}} src={item.nft.img} alt="" />
            </div>
            <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', fontSize: '12px'}}>
              <div>
                <Link href={`/product/${item.nft._id}`}>{item.nft.title}</Link> made bid {Math.round(item.bid * 10000) / 10000} ETH
              </div>
              <div>
              {moment.unix(item.time).format("MM/DD/YYYY, HH:mm")}
              </div>
            </div>
          </div>
        )
        } else {
          return (
            <div>
              Нет истории ставок
            </div>
          )
        }
       
      })}
    </div>
      
    </div>
</Modal>
      
    </Theme>
  );
}

Cabinet.getInitialProps = async ({query}) => {
  const response = await axios.get(`https://nft-marketplace-api-plzqa.ondigitalocean.app/user/${query.cabinetId}`)
  return {data: response.data}
};

export default Cabinet;
