/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Web3 from "web3";
import * as utils from '../../utils';
import type * as Types from '../../types/index.d';
import connectMetaMask from './metamask'
import cookie from 'js-cookie'
import { CircularProgress } from '@material-ui/core';
import { getAllBidHistory, getAllTokenHistory } from '../../utils/blockchain';

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
import axios from 'axios';

const useStyles = makeStyles({
  select: {
    background: 'inherit',
    borderWidth: 0,
    font: ' 400 13px OpenSans',
  },
});

interface PlaceBidModalProps {
  app: Types.AppProps;
}

/**
 * Модальное окно сделать ставку
 * @param props
 * @returns
 */
export default function PlaceBidModal(props): React.ReactElement {
  const { app, open, data, handleClose, bids, groupedBids} = props;
  const { lang } = app;
  const [proceed, setProceed] = useState(false)
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
  let bidIndex
  let subevent
  const [myBid, setMyBid] = useState({})
  const [myValue, setMyValue] = useState(0)
  // @ts-ignore
  let NFT = new web3.eth.Contract(NFT_ABI, NFT_ADDRESS)// @ts-ignore
let NFTSTORE = new web3.eth.Contract(NFTSTORE_ABI, NFTSTORE_ADDRESS)
// @ts-ignore
let TIMEDAUCTION = new web3.eth.Contract(TIMEDAUCTION_ABI, TIMEDAUCTION_ADDRESS)// @ts-ignore
let SIMPLEAUCTION = new web3.eth.Contract(SIMPLEAUCTION_ABI, SIMPLEAUCTION_ADDRESS)
useEffect(() => {
/*   if(open){
    const trademe = async () => {
      let bidHistory = await getAllBidHistory(data.tokenId)
      console.log(bidHistory)
    }
    trademe()
  } */
  console.log(bids)
  for (const item of bids) {
    if (item.user.wallet === cookie.get('wallet')){
      setMyBid(item)
    }
  }
  for (const item of groupedBids) {
    if (item.user.wallet === cookie.get('wallet')){
      setMyValue(item.value)
    }
  }
}, [open])


  const [bid, setBid] = useState(0)
  const classes = useStyles();
  const selectRef = useRef<any>();
  const [type, setType] = useState<number>(1);
  const gasFee = {
    createAuction: 180000,
    createOrderSell: 159000,
    returnFreeBalance: 58000,
  
    createBidAuction: 216300,
    updateBidAuction: 76600,
    finishAuction: 144600,
    cancelAuction: 59600,
  
    buyOrder :136400,
      cancelOrderSell :63000,
      createBidMarket : 219700,
      realizeBid : 140400,
      cancelBid :58400
  }
  
  function changeSelect(e: any): void {
    setType(e.target.value);
  }
  useEffect(() => {

  }, []);
  const subscription = (contractAddress, topic)=>{
    console.log('start subscription')
    console.log('contractAddress: ', contractAddress)
    console.log('topic: ', topic)
    return web3.eth.subscribe('logs', {
        address: contractAddress,
        topics: [topic]
    })
  } 
  const updateBidAuction = async (tokenId, auctionIndex, bidIndex, value)=> {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const walletAddress = accounts[0];
    const wallet = await new Web3(window.ethereum);
    let fee = await getGasFee(gasFee.updateBidAuction)
    let txData = TIMEDAUCTION.methods.updateBidAuction(NFT_ADDRESS, tokenId, auctionIndex, bidIndex).encodeABI()
    if(!wallet){
      alert('you have to connect cryptowallet')
    } else {
      wallet.eth.sendTransaction({
              to: TIMEDAUCTION_ADDRESS,
              from: walletAddress,
              value: web3.utils.toWei(String(Number(value)+ (fee/1e18) )),
              data: txData
          },
          async function(error, res){
              console.log(error);
              console.log(res);
              if (!res){
                await alert('Error! You canceled the transaction, go back to the main page.')
                window.location.reload()
              }
          }
      )		
    }
  }
  const createBidAuction = async (tokenId, auctionIndex, value)=> {
    console.log(tokenId, auctionIndex, value)
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    const walletAddress = accounts[0];
    const wallet = await new Web3(window.ethereum);
    let fee = await getGasFee(gasFee.createBidAuction)
    console.log(fee, value)
    let txData = TIMEDAUCTION.methods.createBidAuction(NFT_ADDRESS, tokenId, auctionIndex).encodeABI()
    if(!wallet){
      alert('you have to connect cryptowallet')
    } else {
      await wallet.eth.sendTransaction({
              to: TIMEDAUCTION_ADDRESS,
              from: walletAddress,
              value: web3.utils.toWei(String(Number(value) + (fee/1e18) )),
              data: txData
          },
          async function(error, res){
              console.log(error);
              console.log(res);
              if (res){
                              subevent = await subscription(TIMEDAUCTION_ADDRESS, EVENTS_TOPICS.AUCTION_BID)
              subevent.on('data', async event => {
                console.log(event)
                bidIndex = parseInt(event.data)
              })
              } else {
                await alert('Reload the page, you canceled the transaction')
                window.location.reload()
              }

          }
      )		
    }
  }
  const getGasFee = async(gasLimit)=>{
    let result = 0
    await NFTSTORE.methods.getGasFee(gasLimit).call({}, (err, res)=>{
      console.log(`gasFee - ${res}`)
      result = res
    })
    return result;
  }
  const handleClick = async(e) => {
    if (!cookie.get('id')){
      // @ts-ignore
      document.querySelector('.open_connect').click();
      handleClose()
    } else {
      setProceed(true)
      //@ts-ignore
      if (myBid.user){
        console.log('update')
        //@ts-ignore
        await updateBidAuction(data.tokenId, data.orderIndex, myBid.bidIndex, bid)
      } else {
        console.log('create', data.tokenId, data.orderIndex, bid)
        await createBidAuction(data.tokenId, data.orderIndex, bid)
      }
      
    }

    setProceed(false)
    handleClose()
  }
  return (
    <Modal
    open={open}
    onClose={handleClose}
    aria-labelledby="simple-modal-title"
    aria-describedby="simple-modal-description"
  >
    <div className="popup">
      <div className="popup__heading heading">
        <h3>{lang.placeBid}</h3>
      </div>

      <div className="popup__sub">
        You are about to place a bid for <span>{data.title}</span> by <span>{data.owner.name}</span>
      </div>

      <div className="popup__bid-form">
        <div className="bid-form__header">
          <div className="bid-form__item">
            <input type="number" placeholder="Enter bid" style={{fontSize: '13px'}} onChange={(e) => setBid(Number(e.target.value))}/>
            <div className="bid-form__cover">
              <div className="info">
                <div className="info">
                  <div className="info-icon">
                    <i className="flaticon-information" />
                  </div>
                </div>
              </div>
              <h2>ETH</h2>
            </div>
          </div>
        </div>

        <div className="bid-form__calc">
        <div className="form__calc-item">
            <div className="calc-item__title">Bidding balance</div>
            <div className="calc-item__value">{myValue} ETH</div>
          </div>
          <div className="form__calc-item">
            <div className="calc-item__title">Service free</div>
            <div className="calc-item__value">2.5 %</div>
          </div>
          <div className="form__calc-item">
            <div className="calc-item__title">Min Bid</div>
            <div className="calc-item__value">{data.currentBid} ETH</div>
          </div>
        </div>
          {Number(bid) < data.currentBid && Number(bid) !== 0 ? <h2>Please bid more than min bid</h2>: null}
          {proceed ? <CircularProgress/>: 
        <div className="popup__button button">
          <button className="fill" onClick={handleClick}>
            <span>{lang.placeBid}</span>
          </button>
        </div>}
      </div>
    </div>
    </Modal>
  );
}
