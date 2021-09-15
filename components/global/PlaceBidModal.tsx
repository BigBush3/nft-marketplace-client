/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useEffect, useState, useRef } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Web3 from "web3";
import * as utils from '../../utils';
import type * as Types from '../../types/index.d';
import connectMetaMask from './metamask'
import cookie from 'js-cookie'
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
  const { app, open, data, handleClose} = props;
  const { lang } = app;
  const web3 = new Web3(Web3.givenProvider || new Web3.providers.WebsocketProvider(ULR_INFURA_WEBSOCKET));
  let bidIndex
  let subevent
  // @ts-ignore
  let NFT = new web3.eth.Contract(NFT_ABI, NFT_ADDRESS)// @ts-ignore
let NFTSTORE = new web3.eth.Contract(NFTSTORE_ABI, NFTSTORE_ADDRESS)
// @ts-ignore
let TIMEDAUCTION = new web3.eth.Contract(TIMEDAUCTION_ABI, TIMEDAUCTION_ADDRESS)// @ts-ignore
let SIMPLEAUCTION = new web3.eth.Contract(SIMPLEAUCTION_ABI, SIMPLEAUCTION_ADDRESS)

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
    let metamask = await connectMetaMask()
	let walletAddress = metamask.userAddress
	let wallet = metamask.web3
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
          function(error, res){
              console.log(error);
              console.log(res);
          }
      )		
    }
  }
  const createBidAuction = async (tokenId, auctionIndex, value)=> {
    console.log(tokenId, auctionIndex, value)
    let metamask = await connectMetaMask()
	let walletAddress = metamask.userAddress
	let wallet = metamask.web3
	console.log('metamask connected')
  // @ts-ignore
	console.log('NFT contract connected')
	console.log(NFT)
	console.log('walletAddress: ', walletAddress)
	console.log('web3: ', web3)
    let fee = await getGasFee(gasFee.createBidAuction)
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
              subevent = await subscription(TIMEDAUCTION_ADDRESS, EVENTS_TOPICS.AUCTION_BID)
              subevent.on('data', async event => {
                console.log(event)
                bidIndex = parseInt(event.data)
              })
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
          if (cookie.get('update')){
      await updateBidAuction(data.tokenId, data.orderIndex, cookie.get('bidIndex'), bid)
      
    } else {
      await createBidAuction(data.tokenId, data.orderIndex, bid)
    }
    }

    
    console.log(bidIndex)
    cookie.set('bidIndex', bidIndex)
    cookie.set('bid', bid)
    cookie.set('update', true)
    await axios.post('https://desolate-inlet-76011.herokuapp.com/nft/bid', {bidIndex, id: data._id, userId: cookie.get('id'), price: bid})
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
            <input type="number" placeholder="Enter bid" onChange={(e) => setBid(Number(e.target.value))}/>
            <div className="bid-form__cover">
              <div className="info">
                <div className="info">
                  <div className="info-icon">
                    <i className="flaticon-information" />
                  </div>
                </div>
              </div>
              <select ref={selectRef} className={classes.select}>
                <option value={1}>ETH</option>
                <option value={2}>ETH</option>
                <option value={3}>ETH</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bid-form__calc">
          <div className="form__calc-item">
            <div className="calc-item__title">Service free</div>
            <div className="calc-item__value">2.5 %</div>
          </div>
          <div className="form__calc-item">
            <div className="calc-item__title">Current Bid</div>
            <div className="calc-item__value">{data.currentBid} ETH</div>
          </div>
        </div>

        <div className="popup__button button">
          <button className="fill" onClick={handleClick}>
            <span>{lang.placeBid}</span>
          </button>
        </div>
      </div>
    </div>
    </Modal>
  );
}
